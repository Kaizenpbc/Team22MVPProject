import React from 'react';
import { ArrowDown } from 'lucide-react';
import { WorkflowStep } from '../../../utils/workflow/workflowEditor';

interface WorkflowFlowchartProps {
  workflow: WorkflowStep[];
}

/**
 * Workflow Flowchart Component
 * Visual representation of workflow steps
 */
const WorkflowFlowchart: React.FC<WorkflowFlowchartProps> = ({ workflow }) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        📊 Workflow Diagram
      </h3>
      
      <div className="space-y-4">
        {workflow.map((step, index) => (
          <div key={step.id}>
            {/* Step Card */}
            <div className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border-2 border-primary-300 dark:border-primary-700 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                {/* Step Number */}
                <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {step.number || index + 1}
                </div>
                
                {/* Step Text */}
                <div className="flex-1">
                  <p className="text-gray-900 dark:text-white font-medium">
                    {step.text}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {step.type} • ID: {step.id}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Arrow between steps */}
            {index < workflow.length - 1 && (
              <div className="flex justify-center py-2">
                <ArrowDown className="w-6 h-6 text-primary-400 dark:text-primary-600" />
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Summary Footer */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
          Total Steps: <span className="font-semibold text-primary-600 dark:text-primary-400">{workflow.length}</span>
        </p>
      </div>
    </div>
  );
};

export default WorkflowFlowchart;

