import React, { useState, useEffect } from 'react';
import { WorkflowStep } from '../../utils/workflow/workflowEditor';
import { analyzeWorkflowSteps, StepAnalysis, applyStepSplits } from '../../utils/workflow/stepOptimizer';
import { analyzeWorkflowOrdering } from '../../utils/workflow/aiOrderingAnalysis';
import { runComprehensiveAnalysis, ComprehensiveAnalysis } from '../../utils/workflow/comprehensiveWorkflowAnalysis';
import { Check, X, AlertTriangle, ArrowRight, RotateCcw, List, Plus, Trash2, Edit3 } from 'lucide-react';

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
  
  // NEW: Comprehensive analysis state
  const [comprehensiveAnalysis, setComprehensiveAnalysis] = useState<ComprehensiveAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [selectedGaps, setSelectedGaps] = useState<string[]>([]);
  const [newSteps, setNewSteps] = useState<WorkflowStep[]>([]);
  const [editingStep, setEditingStep] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  
  // Analyze ordering and comprehensive analysis on mount
  useEffect(() => {
    const runAnalysis = async () => {
      try {
        setIsAnalyzing(true);
        
        // Run comprehensive analysis
        const analysis = await runComprehensiveAnalysis(workflow);
        setComprehensiveAnalysis(analysis);
        
        // Run ordering analysis
        const apiKey = localStorage.getItem('openai_api_key');
        const ordering = await analyzeWorkflowOrdering(workflow, apiKey);
        setOrderingIssue(ordering);
        setIsAnalyzingOrder(false);
        
        setIsAnalyzing(false);
      } catch (error) {
        console.error('Analysis failed:', error);
        setIsAnalyzing(false);
        setIsAnalyzingOrder(false);
      }
    };
    runAnalysis();
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

  // NEW: Gap analysis functions
  const handleAddGap = (gap: any) => {
    const newStep: WorkflowStep = {
      id: `gap-${Date.now()}`,
      text: gap.suggestion,
      type: 'process',
      name: gap.suggestion
    };
    setNewSteps(prev => [...prev, newStep]);
    setSelectedGaps(prev => [...prev, gap.type]);
  };

  const handleRemoveGap = (gapType: string) => {
    setSelectedGaps(prev => prev.filter(id => id !== gapType));
    setNewSteps(prev => prev.filter(step => !step.id.startsWith('gap-')));
  };

  const handleAddCustomStep = () => {
    const newStep: WorkflowStep = {
      id: `custom-${Date.now()}`,
      text: 'New step - click to edit',
      type: 'process',
      name: 'New Step'
    };
    setNewSteps(prev => [...prev, newStep]);
  };

  const handleEditStep = (index: number) => {
    setEditingStep(index);
    setEditText(newSteps[index].text);
  };

  const handleSaveEdit = () => {
    if (editingStep !== null) {
      const updatedSteps = [...newSteps];
      updatedSteps[editingStep] = { ...updatedSteps[editingStep], text: editText };
      setNewSteps(updatedSteps);
      setEditingStep(null);
      setEditText('');
    }
  };

  const handleDeleteStep = (index: number) => {
    setNewSteps(prev => prev.filter((_, i) => i !== index));
  };

  const previewWorkflow = showPreview ? applyStepSplits(workflow, selectedSplits) : workflow;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 z-50 flex flex-col overflow-hidden">
      <div className="bg-white h-full w-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-6 flex-shrink-0 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">⚡ Smart Workflow Optimizer</h2>
              <p className="text-blue-100 mt-2 text-lg">
                AI gap analysis + step optimization + missing task detection
              </p>
              {isAnalyzing && (
                <div className="flex items-center mt-2 text-blue-200">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  <span className="text-sm">Analyzing workflow gaps and optimization opportunities...</span>
                </div>
              )}
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

              {/* NEW: Gap Analysis Section */}
              {comprehensiveAnalysis?.gaps?.internalGaps?.missingSteps && comprehensiveAnalysis.gaps.internalGaps.missingSteps.length > 0 && (
                <div className="bg-orange-50 border-2 border-orange-400 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <AlertTriangle className="w-5 h-5 text-orange-600 mr-2" />
                    <h3 className="font-semibold text-orange-900">🔍 Missing Steps Detected</h3>
                  </div>
                  
                  <div className="space-y-3">
                    {comprehensiveAnalysis.gaps.internalGaps.missingSteps.map((gap, index) => (
                      <div key={index} className="bg-white rounded border border-orange-200 p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                gap.priority === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                                gap.priority === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                                gap.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {gap.priority}
                              </span>
                            </div>
                            <p className="text-sm text-gray-800 mb-1">{gap.suggestion}</p>
                            <p className="text-xs text-gray-500">{gap.reason}</p>
                          </div>
                          <button
                            onClick={() => selectedGaps.includes(gap.type) ? handleRemoveGap(gap.type) : handleAddGap(gap)}
                            className={`ml-3 px-3 py-1 rounded text-xs font-medium transition-colors ${
                              selectedGaps.includes(gap.type)
                                ? 'bg-green-600 text-white hover:bg-green-700'
                                : 'bg-orange-600 text-white hover:bg-orange-700'
                            }`}
                          >
                            {selectedGaps.includes(gap.type) ? '✓ Added' : '+ Add'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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

              {/* NEW: Custom Step Addition */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-blue-900 flex items-center">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Custom Steps
                  </h3>
                  <button
                    onClick={handleAddCustomStep}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors"
                  >
                    + Add Step
                  </button>
                </div>
                
                {newSteps.length > 0 && (
                  <div className="space-y-2">
                    {newSteps.map((step, index) => (
                      <div key={index} className="bg-white rounded border border-blue-200 p-3">
                        <div className="flex items-center gap-2">
                          {editingStep === index ? (
                            <input
                              type="text"
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveEdit();
                                if (e.key === 'Escape') { setEditingStep(null); setEditText(''); }
                              }}
                              className="flex-1 px-2 py-1 border border-blue-300 rounded text-sm"
                              autoFocus
                            />
                          ) : (
                            <span className="flex-1 text-sm text-gray-800">{step.text}</span>
                          )}
                          <div className="flex gap-1">
                            {editingStep === index ? (
                              <>
                                <button
                                  onClick={handleSaveEdit}
                                  className="p-1 text-green-600 hover:bg-green-100 rounded"
                                  title="Save"
                                >
                                  <Check className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => { setEditingStep(null); setEditText(''); }}
                                  className="p-1 text-red-600 hover:bg-red-100 rounded"
                                  title="Cancel"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleEditStep(index)}
                                  className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                                  title="Edit"
                                >
                                  <Edit3 className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => handleDeleteStep(index)}
                                  className="p-1 text-red-600 hover:bg-red-100 rounded"
                                  title="Delete"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

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

          {/* Right Panel - Side-by-Side Comparison */}
          <div className="w-1/2 p-8 bg-white overflow-y-auto border-l border-gray-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Current vs Optimized</h3>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center text-sm text-blue-600 hover:text-blue-700"
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                {showPreview ? 'Hide' : 'Show'} Comparison
              </button>
            </div>

            {showPreview && (
              <div className="grid grid-cols-2 gap-4">
                {/* Current Workflow */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    Current Workflow ({workflow.length} steps)
                  </h4>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {workflow.map((step, index) => (
                      <div key={index} className="bg-blue-50 rounded border border-blue-200 p-3 text-sm">
                        <div className="flex items-center mb-1">
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-2">
                            {index + 1}
                          </span>
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            {step.type || 'process'}
                          </span>
                        </div>
                        <p className="text-gray-800">{step.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Optimized Workflow */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    Optimized Workflow ({workflow.length + newSteps.length} steps)
                  </h4>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {[...workflow, ...newSteps].map((step, index) => (
                      <div key={index} className={`rounded border p-3 text-sm ${
                        newSteps.includes(step) 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-blue-50 border-blue-200'
                      }`}>
                        <div className="flex items-center mb-1">
                          <span className={`text-xs px-2 py-1 rounded-full mr-2 ${
                            newSteps.includes(step)
                              ? 'bg-green-100 text-green-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {index + 1}
                          </span>
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            {step.type || 'process'}
                          </span>
                          {newSteps.includes(step) && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded ml-2">
                              NEW
                            </span>
                          )}
                        </div>
                        <p className="text-gray-800">{step.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {!showPreview && (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">Click "Show Comparison" to see current vs optimized workflow</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {Object.keys(selectedSplits).length > 0 || newSteps.length > 0 ? (
              <>
                {Object.keys(selectedSplits).length} step(s) selected for splitting, {newSteps.length} new step(s) added
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
              onClick={() => {
                const finalWorkflow = [...workflow, ...newSteps];
                onApplySplits(finalWorkflow);
              }}
              disabled={Object.keys(selectedSplits).length === 0 && newSteps.length === 0}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Apply Changes ({Object.keys(selectedSplits).length + newSteps.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepOptimizationPanel;
