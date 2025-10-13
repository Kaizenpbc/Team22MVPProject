import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface EfficiencyGaugeProps {
  score: number;
  label?: string;
  showTrend?: boolean;
  previousScore?: number;
}

/**
 * Efficiency Gauge Component
 * Shows efficiency score with visual gauge and optional trend
 */
const EfficiencyGauge: React.FC<EfficiencyGaugeProps> = ({ 
  score, 
  label = 'Efficiency Score',
  showTrend = false,
  previousScore
}) => {
  // Ensure score is between 0-100
  const normalizedScore = Math.min(Math.max(score, 0), 100);
  
  // Calculate percentage for the gauge
  const percentage = normalizedScore;
  
  // Determine color based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return { primary: 'text-green-600', bg: 'bg-green-500', light: 'bg-green-100' };
    if (score >= 60) return { primary: 'text-yellow-600', bg: 'bg-yellow-500', light: 'bg-yellow-100' };
    if (score >= 40) return { primary: 'text-orange-600', bg: 'bg-orange-500', light: 'bg-orange-100' };
    return { primary: 'text-red-600', bg: 'bg-red-500', light: 'bg-red-100' };
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  const colors = getScoreColor(normalizedScore);
  const scoreLabel = getScoreLabel(normalizedScore);

  // Calculate trend
  const trend = previousScore !== undefined ? normalizedScore - previousScore : 0;
  const TrendIcon = trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus;
  const trendColor = trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-600';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="text-center">
        {/* Label */}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {label}
        </h3>

        {/* Circular Gauge */}
        <div className="relative w-48 h-48 mx-auto mb-4">
          {/* Background circle */}
          <svg className="transform -rotate-90 w-48 h-48">
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              className="text-gray-200 dark:text-gray-700"
            />
            {/* Progress circle */}
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 88}`}
              strokeDashoffset={`${2 * Math.PI * 88 * (1 - percentage / 100)}`}
              className={`${colors.bg} transition-all duration-1000 ease-out`}
              strokeLinecap="round"
            />
          </svg>

          {/* Score in center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className={`text-5xl font-bold ${colors.primary}`}>
              {Math.round(normalizedScore)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              out of 100
            </div>
          </div>
        </div>

        {/* Score Label */}
        <div className={`inline-block px-4 py-2 rounded-full ${colors.light} mb-3`}>
          <span className={`font-semibold ${colors.primary}`}>
            {scoreLabel}
          </span>
        </div>

        {/* Trend (if enabled) */}
        {showTrend && previousScore !== undefined && (
          <div className="flex items-center justify-center gap-2 text-sm">
            <TrendIcon className={`w-4 h-4 ${trendColor}`} />
            <span className={trendColor}>
              {trend > 0 ? '+' : ''}{trend.toFixed(1)} from previous
            </span>
          </div>
        )}

        {/* Score Breakdown Bar */}
        <div className="mt-4 text-left">
          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
            <span>Poor</span>
            <span>Excellent</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full ${colors.bg} transition-all duration-1000 ease-out`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EfficiencyGauge;

