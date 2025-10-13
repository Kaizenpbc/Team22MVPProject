import React from 'react';
import { Wand2, Sparkles } from 'lucide-react';

interface WorkflowEditorProps {
  value: string;
  onChange: (value: string) => void;
  onCreateWorkflow: () => void;
  onParseWithAI?: () => void;
  isCreating: boolean;
  isParsingWithAI?: boolean;
}

/**
 * Workflow Editor Component
 * Text area for entering SOP content
 */
const WorkflowEditor: React.FC<WorkflowEditorProps> = ({
  value,
  onChange,
  onCreateWorkflow,
  onParseWithAI,
  isCreating,
  isParsingWithAI = false
}) => {
  const lineCount = value.split('\n').filter(line => line.trim()).length;
  const charCount = value.length;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          📝 SOP Text Input
        </h3>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {lineCount} lines • {charCount} chars
        </div>
      </div>
      
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter your SOP text here or upload a file above...

Example:
1. Review incoming customer request
2. Verify customer information in database
3. Check product availability
4. Generate quote and send to customer
5. Follow up within 24 hours"
        className="w-full h-64 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none font-mono text-sm"
      />
      
      <div className="mt-4 space-y-3">
        <button
          onClick={onCreateWorkflow}
          disabled={!value.trim() || isCreating}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white font-semibold rounded-lg transition-colors disabled:cursor-not-allowed"
        >
          {isCreating ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Creating Workflow...
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5" />
              Create Workflow (Basic)
            </>
          )}
        </button>

        <button
          onClick={onParseWithAI || onCreateWorkflow}
          disabled={!value.trim() || isCreating || isParsingWithAI}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:transform-none disabled:cursor-not-allowed"
          title="Use AI to intelligently parse and structure your workflow"
        >
          {isParsingWithAI ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              AI Parsing...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Parse with AI ✨
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default WorkflowEditor;

