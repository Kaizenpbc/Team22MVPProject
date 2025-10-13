import React from 'react';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  TrendingUp,
  Users,
  Zap
} from 'lucide-react';
import { ComprehensiveAnalysis } from '../../../utils/workflow/comprehensiveWorkflowAnalysis';
import EfficiencyGauge from '../charts/EfficiencyGauge';
import PerformanceChart from '../charts/PerformanceChart';
import ProcessDistributionChart from '../charts/ProcessDistributionChart';

interface AnalyticsDashboardProps {
  analysis: ComprehensiveAnalysis;
}

/**
 * Analytics Dashboard Component
 * Comprehensive view of workflow analysis with charts and metrics
 */
const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ analysis }) => {
  
  // Prepare metrics for performance chart
  const performanceMetrics = analysis.efficiency ? [
    { 
      label: 'Complexity Score', 
      value: analysis.efficiency.factors.complexity,
      maxValue: 100,
      color: analysis.efficiency.factors.complexity >= 70 ? 'green' : analysis.efficiency.factors.complexity >= 50 ? 'yellow' : 'red'
    },
    { 
      label: 'Time Efficiency', 
      value: analysis.efficiency.factors.time,
      maxValue: 100,
      color: analysis.efficiency.factors.time >= 70 ? 'green' : analysis.efficiency.factors.time >= 50 ? 'yellow' : 'red'
    },
    { 
      label: 'Quality Score', 
      value: analysis.efficiency.factors.quality,
      maxValue: 100,
      color: analysis.efficiency.factors.quality >= 70 ? 'green' : analysis.efficiency.factors.quality >= 50 ? 'yellow' : 'red'
    },
    { 
      label: 'Business Impact', 
      value: analysis.efficiency.factors.impact,
      maxValue: 100,
      color: analysis.efficiency.factors.impact >= 70 ? 'blue' : analysis.efficiency.factors.impact >= 50 ? 'purple' : 'orange'
    }
  ] : [];

  // Prepare distribution data
  const distributionData = analysis.risks ? [
    { label: 'High Risk', value: analysis.risks.highRiskSteps.length, color: 'red' },
    { label: 'Medium Risk', value: analysis.risks.mediumRiskSteps.length, color: 'yellow' },
    { label: 'Low Risk', value: analysis.risks.lowRiskSteps.length, color: 'green' }
  ] : [];

  // Quick stats
  const stats = [
    {
      label: 'Total Steps',
      value: analysis.steps.length,
      icon: Activity,
      color: 'blue'
    },
    {
      label: 'Duplicates Found',
      value: analysis.duplicates.length,
      icon: AlertTriangle,
      color: analysis.duplicates.length > 0 ? 'red' : 'green'
    },
    {
      label: 'Est. Time',
      value: analysis.efficiency ? `${analysis.efficiency.totalEstimatedTime}m` : 'N/A',
      icon: Clock,
      color: 'purple'
    },
    {
      label: 'Gaps Detected',
      value: analysis.gaps?.internalGaps.summary.total || 0,
      icon: CheckCircle,
      color: (analysis.gaps?.internalGaps.summary.total || 0) > 0 ? 'yellow' : 'green'
    }
  ];

  const getStatColor = (color: string) => {
    switch (color) {
      case 'blue': return { bg: 'bg-blue-100 dark:bg-blue-900', icon: 'text-blue-600 dark:text-blue-400' };
      case 'red': return { bg: 'bg-red-100 dark:bg-red-900', icon: 'text-red-600 dark:text-red-400' };
      case 'green': return { bg: 'bg-green-100 dark:bg-green-900', icon: 'text-green-600 dark:text-green-400' };
      case 'yellow': return { bg: 'bg-yellow-100 dark:bg-yellow-900', icon: 'text-yellow-600 dark:text-yellow-400' };
      case 'purple': return { bg: 'bg-purple-100 dark:bg-purple-900', icon: 'text-purple-600 dark:text-purple-400' };
      default: return { bg: 'bg-gray-100 dark:bg-gray-900', icon: 'text-gray-600 dark:text-gray-400' };
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Workflow Analytics Dashboard</h2>
            <p className="text-white text-opacity-90">
              Comprehensive analysis for: {analysis.workflowName}
            </p>
          </div>
          <TrendingUp className="w-12 h-12 opacity-50" />
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const colors = getStatColor(stat.color);
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-3 rounded-lg ${colors.bg}`}>
                  <Icon className={`w-6 h-6 ${colors.icon}`} />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Efficiency Gauge */}
        {analysis.efficiency && (
          <EfficiencyGauge 
            score={analysis.efficiency.overallScore} 
            label="Overall Workflow Efficiency"
          />
        )}

        {/* Risk Distribution */}
        {analysis.risks && distributionData.length > 0 && (
          <ProcessDistributionChart 
            data={distributionData}
            title="Risk Distribution"
          />
        )}
      </div>

      {/* Performance Metrics */}
      {performanceMetrics.length > 0 && (
        <PerformanceChart 
          metrics={performanceMetrics}
          title="Detailed Performance Factors"
        />
      )}

      {/* Issues & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* High Risk Steps */}
        {analysis.risks && analysis.risks.highRiskSteps.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                High Risk Steps
              </h3>
            </div>
            <div className="space-y-2">
              {analysis.risks.highRiskSteps.slice(0, 5).map((risk, index) => (
                <div key={index} className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900 rounded-lg">
                  <span className="font-bold text-red-600 dark:text-red-400 min-w-[24px]">
                    {risk.index + 1}.
                  </span>
                  <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">
                    {risk.step}
                  </span>
                  <span className="text-xs px-2 py-1 bg-red-200 dark:bg-red-800 text-red-700 dark:text-red-300 rounded">
                    {Math.round(risk.riskScore * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {analysis.efficiency && analysis.efficiency.recommendations.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-yellow-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recommendations
              </h3>
            </div>
            <div className="space-y-3">
              {analysis.efficiency.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {rec}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Gaps & Duplicates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Duplicate Detection */}
        {analysis.duplicates.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-orange-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Duplicate Steps Detected
              </h3>
            </div>
            <div className="space-y-3">
              {analysis.duplicates.slice(0, 3).map((dup: any, index: number) => (
                <div key={index} className="p-3 bg-orange-50 dark:bg-orange-900 rounded-lg">
                  <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    <span className="font-semibold">Step {dup.step1Index + 1}:</span> {dup.step1.text}
                  </div>
                  <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    <span className="font-semibold">Step {dup.step2Index + 1}:</span> {dup.step2.text}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Similarity: {Math.round(dup.similarity * 100)}% - {dup.reasoning}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Gap Detection */}
        {analysis.gaps && analysis.gaps.internalGaps.missingSteps.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Missing Steps Suggestions
              </h3>
            </div>
            <div className="space-y-3">
              {analysis.gaps.internalGaps.missingSteps.map((gap, index) => (
                <div key={index} className="p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
                  <div className="flex items-start gap-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      gap.priority === 'critical' ? 'bg-red-200 dark:bg-red-800 text-red-700 dark:text-red-300' :
                      gap.priority === 'important' ? 'bg-yellow-200 dark:bg-yellow-800 text-yellow-700 dark:text-yellow-300' :
                      'bg-green-200 dark:bg-green-800 text-green-700 dark:text-green-300'
                    }`}>
                      {gap.priority}
                    </span>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                        {gap.suggestion}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {gap.reason}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default AnalyticsDashboard;

