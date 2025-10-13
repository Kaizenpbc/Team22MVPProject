import React from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';

interface PerformanceMetric {
  label: string;
  value: number;
  maxValue?: number;
  color?: string;
}

interface PerformanceChartProps {
  metrics: PerformanceMetric[];
  title?: string;
}

/**
 * Performance Chart Component
 * Displays horizontal bar chart for workflow performance metrics
 */
const PerformanceChart: React.FC<PerformanceChartProps> = ({ 
  metrics,
  title = 'Performance Metrics'
}) => {
  const getColorClass = (color?: string) => {
    switch (color) {
      case 'green': return 'bg-green-500';
      case 'yellow': return 'bg-yellow-500';
      case 'orange': return 'bg-orange-500';
      case 'red': return 'bg-red-500';
      case 'blue': return 'bg-blue-500';
      case 'purple': return 'bg-purple-500';
      default: return 'bg-primary-500';
    }
  };

  const getLightColorClass = (color?: string) => {
    switch (color) {
      case 'green': return 'bg-green-100 dark:bg-green-900';
      case 'yellow': return 'bg-yellow-100 dark:bg-yellow-900';
      case 'orange': return 'bg-orange-100 dark:bg-orange-900';
      case 'red': return 'bg-red-100 dark:bg-red-900';
      case 'blue': return 'bg-blue-100 dark:bg-blue-900';
      case 'purple': return 'bg-purple-100 dark:bg-purple-900';
      default: return 'bg-primary-100 dark:bg-primary-900';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary-600" />
          {title}
        </h3>
        <TrendingUp className="w-5 h-5 text-gray-400" />
      </div>

      {/* Metrics */}
      <div className="space-y-4">
        {metrics.map((metric, index) => {
          const maxValue = metric.maxValue || 100;
          const percentage = Math.min((metric.value / maxValue) * 100, 100);
          
          return (
            <div key={index}>
              {/* Label and Value */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {metric.label}
                </span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {metric.value}{metric.maxValue ? `/${maxValue}` : ''}
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className={`w-full ${getLightColorClass(metric.color)} rounded-full h-3 overflow-hidden`}>
                <div 
                  className={`h-full ${getColorClass(metric.color)} transition-all duration-1000 ease-out rounded-full`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {metrics.length === 0 && (
        <div className="text-center py-8">
          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            No performance data available
          </p>
        </div>
      )}
    </div>
  );
};

export default PerformanceChart;

