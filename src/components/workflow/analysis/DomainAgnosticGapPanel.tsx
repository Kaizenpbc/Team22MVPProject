/**
 * Domain-Agnostic Gap Detection Panel
 * Displays AI-detected missing steps from comprehensive gap analysis
 */

import React from 'react';
import { AlertTriangle, Plus, Sparkles } from 'lucide-react';
import { ComprehensiveGapAnalysis } from '../../../utils/workflow/aiDomainAgnosticGapAnalysis';

interface DomainAgnosticGapPanelProps {
  analysis: ComprehensiveGapAnalysis;
  onAddStep: (stepText: string, position: number) => void;
}

export const DomainAgnosticGapPanel: React.FC<DomainAgnosticGapPanelProps> = ({
  analysis,
  onAddStep
}) => {
  const [expandedGaps, setExpandedGaps] = React.useState<Set<number>>(new Set());

  const toggleGap = (index: number) => {
    const newExpanded = new Set(expandedGaps);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedGaps(newExpanded);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return 'bg-red-100 dark:bg-red-900 border-red-400 dark:border-red-600 text-red-900 dark:text-red-100';
      case 'HIGH':
        return 'bg-orange-100 dark:bg-orange-900 border-orange-400 dark:border-orange-600 text-orange-900 dark:text-orange-100';
      case 'MEDIUM':
        return 'bg-yellow-100 dark:bg-yellow-900 border-yellow-400 dark:border-yellow-600 text-yellow-900 dark:text-yellow-100';
      case 'LOW':
        return 'bg-blue-100 dark:bg-blue-900 border-blue-400 dark:border-blue-600 text-blue-900 dark:text-blue-100';
      default:
        return 'bg-gray-100 dark:bg-gray-900 border-gray-400 dark:border-gray-600 text-gray-900 dark:text-gray-100';
    }
  };

  const getPriorityBadge = (priority: string) => {
    const baseClasses = "px-2 py-0.5 text-xs font-semibold text-white flex items-center justify-center";
    const triangleStyle = { clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' };
    switch (priority) {
      case 'CRITICAL':
        return { className: `${baseClasses} bg-red-600`, style: triangleStyle };
      case 'HIGH':
        return { className: `${baseClasses} bg-orange-600`, style: triangleStyle };
      case 'MEDIUM':
        return { className: `${baseClasses} bg-yellow-600`, style: triangleStyle };
      case 'LOW':
        return { className: `${baseClasses} bg-blue-600`, style: triangleStyle };
      default:
        return { className: `${baseClasses} bg-gray-600`, style: triangleStyle };
    }
  };

  // Combine all gaps into a single array for display
  const allGaps = [
    ...analysis.domainGaps.map(g => ({ ...g, category: 'Domain-Specific' })),
    ...analysis.causalGaps.map(g => ({ ...g, category: 'Causal Chain' })),
    ...analysis.patternGaps.map(g => ({ ...g, category: 'Pattern-Based' }))
  ];

  if (allGaps.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-950 dark:to-yellow-950 border-4 border-orange-400 dark:border-orange-600 rounded-lg shadow-lg p-6 mb-6">
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-orange-500 flex items-center justify-center" style={{clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'}}>
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-orange-900 dark:text-orange-100 mb-2">
            AI Domain-Agnostic Gap Analysis
          </h3>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 border-2 border-orange-300 dark:border-orange-700">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-300">Detected Domain:</span>
                <p className="text-lg font-bold text-orange-600 dark:text-orange-400 capitalize">{analysis.domain}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-300">Confidence:</span>
                <p className="text-lg font-bold text-orange-600 dark:text-orange-400">{(analysis.confidence * 100).toFixed(0)}%</p>
              </div>
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-300">Total Gaps:</span>
                <p className="text-lg font-bold text-orange-600 dark:text-orange-400">{analysis.summary.total}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-300">Critical:</span>
                <p className="text-lg font-bold text-red-600 dark:text-red-400">{analysis.summary.critical}</p>
              </div>
            </div>
          </div>
          <p className="text-gray-700 dark:text-gray-300">
            AI has analyzed your workflow using <strong>domain detection</strong>, <strong>causal chain analysis</strong>, 
            and <strong>pattern recognition</strong> to identify missing steps that could improve completeness and safety.
          </p>
        </div>
      </div>

      {/* Gap Categories */}
      <div className="space-y-3">
        {/* Domain-Specific Gaps */}
        {analysis.domainGaps.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-orange-800 dark:text-orange-200 mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Domain-Specific Gaps ({analysis.domainGaps.length})
            </h4>
            <div className="space-y-2">
              {analysis.domainGaps.map((gap, index) => (
                <div
                  key={`domain-${index}`}
                  className={`border-2 rounded-lg p-4 ${getPriorityColor(gap.priority)}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={getPriorityBadge(gap.priority).className} style={getPriorityBadge(gap.priority).style}>{gap.priority}</span>
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                          Position: {gap.position === 0 ? 'Start' : gap.position}
                        </span>
                      </div>
                      <p className="font-semibold text-lg mb-1">💡 {gap.suggestion}</p>
                      <p className="text-sm mb-2"><strong>Why:</strong> {gap.reason}</p>
                      {expandedGaps.has(index) && (
                        <div className="mt-2 pt-2 border-t border-current/20 text-sm space-y-1">
                          <p><strong>Description:</strong> {gap.description}</p>
                          <p><strong>Impact:</strong> {gap.impact}</p>
                          <p><strong>Confidence:</strong> {(gap.confidence * 100).toFixed(0)}%</p>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => onAddStep(gap.suggestion, gap.position)}
                        className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-semibold flex items-center gap-1 whitespace-nowrap"
                      >
                        <Plus className="w-4 h-4" />
                        Add
                      </button>
                      <button
                        onClick={() => toggleGap(index)}
                        className="px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-xs"
                      >
                        {expandedGaps.has(index) ? 'Less' : 'More'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Causal Chain Gaps */}
        {analysis.causalGaps.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-orange-800 dark:text-orange-200 mb-2 flex items-center gap-2">
              🔗 Causal Chain Gaps ({analysis.causalGaps.length})
            </h4>
            <div className="space-y-2">
              {analysis.causalGaps.map((gap, index) => (
                <div
                  key={`causal-${index}`}
                  className={`border-2 rounded-lg p-4 ${getPriorityColor(gap.priority)}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={getPriorityBadge(gap.priority).className} style={getPriorityBadge(gap.priority).style}>{gap.priority}</span>
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                          Position: {gap.position === 0 ? 'Start' : gap.position}
                        </span>
                      </div>
                      <p className="font-semibold text-lg mb-1">💡 {gap.suggestion}</p>
                      <p className="text-sm mb-2"><strong>Why:</strong> {gap.reason}</p>
                      {expandedGaps.has(1000 + index) && (
                        <div className="mt-2 pt-2 border-t border-current/20 text-sm space-y-1">
                          <p><strong>Description:</strong> {gap.description}</p>
                          <p><strong>Impact:</strong> {gap.impact}</p>
                          <p><strong>Confidence:</strong> {(gap.confidence * 100).toFixed(0)}%</p>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => onAddStep(gap.suggestion, gap.position)}
                        className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-semibold flex items-center gap-1 whitespace-nowrap"
                      >
                        <Plus className="w-4 h-4" />
                        Add
                      </button>
                      <button
                        onClick={() => toggleGap(1000 + index)}
                        className="px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-xs"
                      >
                        {expandedGaps.has(1000 + index) ? 'Less' : 'More'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pattern-Based Gaps */}
        {analysis.patternGaps.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-orange-800 dark:text-orange-200 mb-2 flex items-center gap-2">
              🔍 Pattern-Based Gaps ({analysis.patternGaps.length})
            </h4>
            <div className="space-y-2">
              {analysis.patternGaps.map((gap, index) => (
                <div
                  key={`pattern-${index}`}
                  className={`border-2 rounded-lg p-4 ${getPriorityColor(gap.priority)}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={getPriorityBadge(gap.priority).className} style={getPriorityBadge(gap.priority).style}>{gap.priority}</span>
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                          Position: {gap.position === 0 ? 'Start' : gap.position}
                        </span>
                      </div>
                      <p className="font-semibold text-lg mb-1">💡 {gap.suggestion}</p>
                      <p className="text-sm mb-2"><strong>Why:</strong> {gap.reason}</p>
                      {expandedGaps.has(2000 + index) && (
                        <div className="mt-2 pt-2 border-t border-current/20 text-sm space-y-1">
                          <p><strong>Description:</strong> {gap.description}</p>
                          <p><strong>Impact:</strong> {gap.impact}</p>
                          <p><strong>Confidence:</strong> {(gap.confidence * 100).toFixed(0)}%</p>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => onAddStep(gap.suggestion, gap.position)}
                        className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-semibold flex items-center gap-1 whitespace-nowrap"
                      >
                        <Plus className="w-4 h-4" />
                        Add
                      </button>
                      <button
                        onClick={() => toggleGap(2000 + index)}
                        className="px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-xs"
                      >
                        {expandedGaps.has(2000 + index) ? 'Less' : 'More'}
                      </button>
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

