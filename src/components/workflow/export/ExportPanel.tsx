import React from 'react';
import { FileSpreadsheet, FileCode, FileText, Download } from 'lucide-react';
import { WorkflowStep } from '../../../utils/workflow/workflowEditor';

interface ExportPanelProps {
  workflow: WorkflowStep[];
}

/**
 * Export Panel Component
 * Provides various export options for workflows
 */
const ExportPanel: React.FC<ExportPanelProps> = ({ workflow }) => {
  
  // Export as JSON
  const exportJSON = () => {
    const dataStr = JSON.stringify(workflow, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `workflow-${Date.now()}.json`;
    link.click();
  };

  // Export as CSV
  const exportCSV = () => {
    const headers = ['Order', 'ID', 'Type', 'Description'];
    const rows = workflow.map((step, index) => [
      step.number || (index + 1),
      step.id || `step-${index}`,
      step.type || 'process',
      `"${step.text.replace(/"/g, '""')}"`
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `workflow-${Date.now()}.csv`;
    link.click();
  };

  // Export as Markdown
  const exportMarkdown = () => {
    const markdown = [
      '# Workflow',
      '',
      ...workflow.map((step, index) => `${step.number || (index + 1)}. ${step.text}`),
      '',
      '---',
      `Generated on ${new Date().toLocaleDateString()}`
    ].join('\n');
    
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `workflow-${Date.now()}.md`;
    link.click();
  };

  // Export as Text
  const exportText = () => {
    const text = workflow.map((step, index) => `${step.number || (index + 1)}. ${step.text}`).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `workflow-${Date.now()}.txt`;
    link.click();
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        💾 Export Workflow
      </h3>
      
      <div className="grid grid-cols-2 gap-3">
        {/* Excel/CSV Export */}
        <button
          onClick={exportCSV}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
        >
          <FileSpreadsheet className="w-5 h-5" />
          <span className="font-medium text-sm">Excel/CSV</span>
        </button>

        {/* JSON Export */}
        <button
          onClick={exportJSON}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
        >
          <FileCode className="w-5 h-5" />
          <span className="font-medium text-sm">JSON</span>
        </button>

        {/* Markdown Export */}
        <button
          onClick={exportMarkdown}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
        >
          <FileText className="w-5 h-5" />
          <span className="font-medium text-sm">Markdown</span>
        </button>

        {/* Text Export */}
        <button
          onClick={exportText}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <Download className="w-5 h-5" />
          <span className="font-medium text-sm">Text</span>
        </button>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
        Export your workflow in various formats for documentation and sharing
      </p>
    </div>
  );
};

export default ExportPanel;

