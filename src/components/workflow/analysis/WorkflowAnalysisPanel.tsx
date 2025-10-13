import React, { useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle, TrendingUp, Shield, GitBranch, Sparkles } from 'lucide-react';
import { runComprehensiveAnalysis, ComprehensiveAnalysis } from '../../../utils/workflow/comprehensiveWorkflowAnalysis';
import { WorkflowStep } from '../../../utils/workflow/workflowEditor';

interface WorkflowAnalysisPanelProps {
  workflow: WorkflowStep[];
  sopText: string;
}

/**
 * Workflow Analysis Panel
 * Shows REAL AI-powered insights about the workflow
 */
const WorkflowAnalysisPanel: React.FC<WorkflowAnalysisPanelProps> = ({ workflow, sopText }) => {
  const [analysis, setAnalysis] = useState<ComprehensiveAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Run comprehensive analysis when workflow changes
  useEffect(() => {
    if (workflow.length === 0) {
      setAnalysis(null);
      return;
    }
    
    const runAnalysis = async () => {
      setIsAnalyzing(true);
      try {
        // Get API key from localStorage (user can set it)
        const apiKey = localStorage.getItem('openai_api_key');
        
        const result = await runComprehensiveAnalysis(
          workflow,
          apiKey,
          'User Workflow'
        );
        setAnalysis(result);
      } catch (error) {
        console.error('Analysis error:', error);
      } finally {
        setIsAnalyzing(false);
      }
    };
    
    runAnalysis();
  }, [workflow]);
  
  if (isAnalyzing) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-400">Running AI analysis...</span>
        </div>
      </div>
    );
  }
  
  if (!analysis) return null;
  
  const { efficiency, risks, duplicates, gaps, dependencies } = analysis;
  
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-primary-600" />
        AI Comprehensive Analysis
      </h3>
      
      <div className="space-y-4">
        {/* Efficiency Score */}
        {efficiency && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
              <h4 className="font-semibold text-green-900 dark:text-green-100">Efficiency Score</h4>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <p className="text-3xl font-bold text-green-700 dark:text-green-300">
                {efficiency.overallScore}
              </p>
              <p className="text-sm text-green-600 dark:text-green-400">/100</p>
            </div>
            <p className="text-sm text-green-700 dark:text-green-300">
              Est. Time: {efficiency.totalEstimatedTime} min • Error Rate: {efficiency.averageErrorRate}%
            </p>
          </div>
        )}

        {/* Risk Analysis */}
        {risks && risks.highRiskSteps.length > 0 && (
          <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-red-600 dark:text-red-400" />
              <h4 className="font-semibold text-red-900 dark:text-red-100">Risk Analysis</h4>
            </div>
            <p className="text-sm text-red-700 dark:text-red-300">
              {risks.highRiskSteps.length} high-risk steps detected
            </p>
          </div>
        )}

        {/* Duplicates */}
        {duplicates && duplicates.length > 0 && (
          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              <h4 className="font-semibold text-yellow-900 dark:text-yellow-100">Duplicate Detection</h4>
            </div>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              Found {duplicates.length} potential duplicate steps
            </p>
          </div>
        )}

        {/* Gaps */}
        {gaps && gaps.internalGaps.summary.total > 0 && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <GitBranch className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h4 className="font-semibold text-purple-900 dark:text-purple-100">Gap Detection</h4>
            </div>
            <p className="text-sm text-purple-700 dark:text-purple-300">
              {gaps.internalGaps.summary.total} potential gaps found
              {gaps.internalGaps.summary.critical > 0 && ` (${gaps.internalGaps.summary.critical} critical)`}
            </p>
          </div>
        )}

        {/* Recommendations */}
        {efficiency && efficiency.recommendations.length > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h4 className="font-semibold text-blue-900 dark:text-blue-100">Recommendations</h4>
            </div>
            <ul className="text-sm text-blue-700 dark:text-blue-300 list-disc list-inside space-y-1">
              {efficiency.recommendations.map((rec, idx) => (
                <li key={idx}>{rec}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{workflow.length}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Total Steps</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {efficiency?.totalEstimatedTime || 0}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Est. Minutes</p>
          </div>
        </div>

        {/* API Key Notice */}
        {!localStorage.getItem('openai_api_key') && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-xs text-blue-700 dark:text-blue-300">
              💡 <strong>Tip:</strong> Add your OpenAI API key in settings for enhanced AI analysis (semantic duplicate detection)
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkflowAnalysisPanel;



