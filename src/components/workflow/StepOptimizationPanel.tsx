import React, { useState, useEffect } from 'react';
import { WorkflowStep } from '../../utils/workflow/workflowEditor';
import { analyzeWorkflowSteps, StepAnalysis, applyStepSplits } from '../../utils/workflow/stepOptimizer';
import { analyzeWorkflowOrdering } from '../../utils/workflow/aiOrderingAnalysis';
import { Check, X, AlertTriangle, ArrowRight, RotateCcw, List } from 'lucide-react';

interface StepOptimizationPanelProps {
  workflow: WorkflowStep[];
  onApplySplits: (newWorkflow: WorkflowStep[]) => void;
  onClose: () => void;
}

const StepOptimizationPanel: React.FC<StepOptimizationPanelProps> = ({
  workflow,
  onApplySplits,
  onClose
}) => {
  const [analyses] = useState<StepAnalysis[]>(() => analyzeWorkflowSteps(workflow));
  const [selectedSplits, setSelectedSplits] = useState<{ [stepId: string]: WorkflowStep[] }>({});
  const [showPreview, setShowPreview] = useState(false);
  const [orderingIssue, setOrderingIssue] = useState<any>(null);
  const [isAnalyzingOrder, setIsAnalyzingOrder] = useState(true);
  
  // Analyze ordering on mount
  useEffect(() => {
    const analyzeOrder = async () => {
      const apiKey = localStorage.getItem('openai_api_key');
      const ordering = await analyzeWorkflowOrdering(workflow, apiKey);
      setOrderingIssue(ordering);
      setIsAnalyzingOrder(false);
    };
    analyzeOrder();
  }, [workflow]);

  const complexSteps = analyses.filter(a => a.shouldSplit);
  const totalSteps = workflow.length;
  const complexCount = complexSteps.length;

  const handleToggleSplit = (stepId: string, splits: WorkflowStep[]) => {
    setSelectedSplits(prev => {
      if (prev[stepId]) {
        const { [stepId]: removed, ...rest } = prev;
        return rest;
      } else {
        return { ...prev, [stepId]: splits };
      }
    });
  };

  const handleApplyAll = () => {
    const newWorkflow = applyStepSplits(workflow, selectedSplits);
    onApplySplits(newWorkflow);
    onClose();
  };

  const handleApplyNone = () => {
    onClose();
  };

  const previewWorkflow = showPreview ? applyStepSplits(workflow, selectedSplits) : workflow;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 z-50 flex flex-col overflow-hidden">
      <div className="bg-white h-full w-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-6 flex-shrink-0 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">⚡ Optimize Workflow</h2>
              <p className="text-blue-100 mt-2 text-lg">
                AI-powered step ordering analysis + complex step detection
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-3 hover:bg-white/20 rounded-lg transition-colors"
              title="Close optimizer"
            >
              <X className="w-7 h-7" />
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel - Step Analysis */}
          <div className="flex-1 p-8 overflow-y-auto border-r border-gray-300 bg-gray-50">
            <div className="space-y-4">
              {/* Summary */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">📊 Analysis Summary</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-blue-700">Total Steps:</span>
                    <span className="ml-2 font-semibold">{totalSteps}</span>
                  </div>
                  <div>
                    <span className="text-blue-700">Complex Steps:</span>
                    <span className="ml-2 font-semibold text-orange-600">{complexCount}</span>
                  </div>
                  <div>
                    <span className="text-blue-700">Selected Splits:</span>
                    <span className="ml-2 font-semibold text-green-600">
                      {Object.keys(selectedSplits).length}
                    </span>
                  </div>
                  <div>
                    <span className="text-blue-700">New Total:</span>
                    <span className="ml-2 font-semibold">
                      {totalSteps + Object.values(selectedSplits).flat().length - Object.keys(selectedSplits).length}
                    </span>
                  </div>
                </div>
              </div>

              {/* AI Ordering Analysis */}
              {isAnalyzingOrder ? (
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600">Analyzing step order...</p>
                </div>
              ) : orderingIssue?.hasIssues ? (
                <div className="bg-orange-50 border-2 border-orange-400 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      <List className="w-5 h-5 text-orange-600 mr-2" />
                      <h3 className="font-semibold text-orange-900">⚠️ Ordering Issues Detected</h3>
                    </div>
                  </div>
                  
                  <p className="text-sm text-orange-800 mb-3">
                    {orderingIssue.reasoning}
                  </p>
                  
                  <div className="bg-white rounded p-3 mb-3">
                    <p className="text-xs text-gray-600 mb-2 font-semibold">Suggested Order:</p>
                    <ol className="text-xs space-y-1">
                      {orderingIssue.suggestedOrder?.map((step: WorkflowStep, idx: number) => (
                        <li key={idx} className="text-gray-700">
                          {idx + 1}. {step.text}
                        </li>
                      ))}
                    </ol>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        if (orderingIssue.suggestedOrder) {
                          onApplySplits(orderingIssue.suggestedOrder);
                        }
                      }}
                      className="flex-1 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors text-sm font-medium"
                    >
                      ✓ Apply Suggested Order
                    </button>
                    <button
                      onClick={() => setOrderingIssue(null)}
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors text-sm font-medium"
                    >
                      Keep Original
                    </button>
                  </div>
                </div>
              ) : orderingIssue ? (
                <div className="bg-green-50 border border-green-400 rounded-lg p-4">
                  <div className="flex items-center text-green-800">
                    <Check className="w-5 h-5 mr-2" />
                    <p className="font-medium">Step Order Looks Good!</p>
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    No ordering issues detected. Steps are in logical sequence.
                  </p>
                </div>
              ) : null}

              {/* Complex Steps */}
              {complexSteps.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Check className="w-12 h-12 mx-auto text-green-500 mb-4" />
                  <p className="text-lg font-medium">All steps are optimized!</p>
                  <p className="text-sm">No complex steps found that need splitting.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 flex items-center">
                    <AlertTriangle className="w-5 h-5 text-orange-500 mr-2" />
                    Complex Steps ({complexCount})
                  </h3>
                  
                  {complexSteps.map((analysis) => {
                    const stepId = analysis.step.id || `step-${analysis.step.number}`;
                    const isSelected = !!selectedSplits[stepId];
                    const splits = analysis.suggestedSplits;
                    
                    return (
                      <div
                        key={stepId}
                        className={`border rounded-lg p-4 transition-all ${
                          isSelected 
                            ? 'border-green-300 bg-green-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {/* Original Step */}
                        <div className="mb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center mb-1">
                                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-2">
                                  Step {analysis.step.number}
                                </span>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  analysis.complexity === 'high' 
                                    ? 'bg-red-100 text-red-800'
                                    : analysis.complexity === 'medium'
                                    ? 'bg-orange-100 text-orange-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {analysis.complexity} complexity
                                </span>
                              </div>
                              <p className="text-sm text-gray-800 mb-1">{analysis.step.text}</p>
                              <p className="text-xs text-gray-500">{analysis.reason}</p>
                            </div>
                            <button
                              onClick={() => handleToggleSplit(stepId, splits)}
                              className={`ml-4 px-3 py-1 rounded text-xs font-medium transition-colors ${
                                isSelected
                                  ? 'bg-green-600 text-white hover:bg-green-700'
                                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              }`}
                            >
                              {isSelected ? 'Selected' : 'Split'}
                            </button>
                          </div>
                        </div>

                        {/* Suggested Splits */}
                        {isSelected && (
                          <div className="bg-white rounded border-l-4 border-green-400 p-3">
                            <h4 className="text-sm font-medium text-green-800 mb-2">
                              Split into {splits.length} steps:
                            </h4>
                            <div className="space-y-2">
                              {splits.map((split, splitIndex) => (
                                <div key={splitIndex} className="flex items-center text-sm">
                                  <ArrowRight className="w-3 h-3 text-green-600 mr-2 flex-shrink-0" />
                                  <span className="text-gray-700">{split.text}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="w-1/3 p-8 bg-white overflow-y-auto border-l border-gray-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Preview</h3>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center text-sm text-blue-600 hover:text-blue-700"
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                {showPreview ? 'Hide' : 'Show'} Preview
              </button>
            </div>

            {showPreview && (
              <div className="space-y-2">
                {previewWorkflow.map((step) => (
                  <div
                    key={step.id || `preview-${step.number}`}
                    className="bg-white rounded border p-3 text-sm"
                  >
                    <div className="flex items-center mb-1">
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-2">
                        {step.number}
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {step.type}
                      </span>
                    </div>
                    <p className="text-gray-800">{step.text}</p>
                  </div>
                ))}
              </div>
            )}

            {!showPreview && (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">Click "Show Preview" to see the optimized workflow</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {Object.keys(selectedSplits).length > 0 ? (
              <>
                {Object.keys(selectedSplits).length} step(s) selected for splitting
              </>
            ) : (
              'No changes selected'
            )}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleApplyNone}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApplyAll}
              disabled={Object.keys(selectedSplits).length === 0}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Apply Changes ({Object.keys(selectedSplits).length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepOptimizationPanel;
