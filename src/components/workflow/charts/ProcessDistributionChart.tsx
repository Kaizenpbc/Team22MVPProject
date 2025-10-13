import React from 'react';
import { PieChart } from 'lucide-react';

interface DistributionItem {
  label: string;
  value: number;
  color?: string;
}

interface ProcessDistributionChartProps {
  data: DistributionItem[];
  title?: string;
}

/**
 * Process Distribution Chart Component
 * Shows pie/donut chart of workflow step distribution
 */
const ProcessDistributionChart: React.FC<ProcessDistributionChartProps> = ({ 
  data,
  title = 'Step Distribution'
}) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  const colors = [
    { bg: 'bg-blue-500', text: 'text-blue-600', light: 'bg-blue-100 dark:bg-blue-900' },
    { bg: 'bg-green-500', text: 'text-green-600', light: 'bg-green-100 dark:bg-green-900' },
    { bg: 'bg-yellow-500', text: 'text-yellow-600', light: 'bg-yellow-100 dark:bg-yellow-900' },
    { bg: 'bg-red-500', text: 'text-red-600', light: 'bg-red-100 dark:bg-red-900' },
    { bg: 'bg-purple-500', text: 'text-purple-600', light: 'bg-purple-100 dark:bg-purple-900' },
    { bg: 'bg-pink-500', text: 'text-pink-600', light: 'bg-pink-100 dark:bg-pink-900' },
  ];

  const getColor = (index: number) => colors[index % colors.length];

  // Calculate percentages
  const dataWithPercentages = data.map((item, index) => ({
    ...item,
    percentage: total > 0 ? (item.value / total) * 100 : 0,
    colorSet: getColor(index)
  }));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <PieChart className="w-5 h-5 text-primary-600" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
      </div>

      {/* Visual Distribution */}
      <div className="mb-6">
        <div className="flex w-full h-8 rounded-full overflow-hidden">
          {dataWithPercentages.map((item, index) => (
            <div
              key={index}
              className={`${item.colorSet.bg} transition-all duration-500`}
              style={{ width: `${item.percentage}%` }}
              title={`${item.label}: ${item.value} (${item.percentage.toFixed(1)}%)`}
            />
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-3">
        {dataWithPercentages.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className={`w-4 h-4 rounded ${item.colorSet.bg}`} />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {item.label}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {item.value}
              </span>
              <span className={`text-xs px-2 py-1 rounded-full ${item.colorSet.light} ${item.colorSet.text}`}>
                {item.percentage.toFixed(1)}%
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Total Steps
          </span>
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            {total}
          </span>
        </div>
      </div>

      {/* Empty State */}
      {data.length === 0 && (
        <div className="text-center py-8">
          <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            No distribution data available
          </p>
        </div>
      )}
    </div>
  );
};

export default ProcessDistributionChart;

