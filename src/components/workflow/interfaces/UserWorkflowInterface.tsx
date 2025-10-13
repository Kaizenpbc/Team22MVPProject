import React, { useState } from 'react';
import { BookTemplate, ArrowUpDown, BarChart3, MessageCircle } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import FileUploadComponent from '../core/FileUploadComponent.tsx';
import WorkflowEditor from '../core/WorkflowEditor.tsx';
import WorkflowFlowchart from '../visualization/WorkflowFlowchart.tsx';
import WorkflowAnalysisPanel from '../analysis/WorkflowAnalysisPanel.tsx';
import ExportPanel from '../export/ExportPanel.tsx';
import WorkflowTemplateSelector from '../templates/WorkflowTemplateSelector';
import WorkflowReorderingView from '../visualization/WorkflowReorderingView';
import AnalyticsDashboard from '../analysis/AnalyticsDashboard';
import WorkflowChatPanel from '../chat/WorkflowChatPanel';
import { WorkflowTemplate } from '../../../utils/workflow/workflowTemplates';
import { runComprehensiveAnalysis, ComprehensiveAnalysis } from '../../../utils/workflow/comprehensiveWorkflowAnalysis';
import { WorkflowStep } from '../../../utils/workflow/workflowEditor';

/**
 * User Workflow Interface
 * Simplified interface for regular users to create workflows
 */
const UserWorkflowInterface: React.FC = () => {
  const { user } = useAuth();
  const [sopText, setSopText] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [workflow, setWorkflow] = useState<WorkflowStep[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isParsingWithAI, setIsParsingWithAI] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [showReorderView, setShowReorderView] = useState(false);
  const [showAnalyticsDashboard, setShowAnalyticsDashboard] = useState(false);
  const [showChatPanel, setShowChatPanel] = useState(false);
  const [comprehensiveAnalysis, setComprehensiveAnalysis] = useState<ComprehensiveAnalysis | null>(null);

  // Handle file upload with PDF support
  const handleFileUpload = async (file: File) => {
    if (!file) return;
    
    setUploadedFileName(file.name);
    
    try {
      // Check if it's a PDF file
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        // Use PDF processor
        const { smartPDFExtraction } = await import('../../../utils/workflow/pdfProcessor');
        const { text, method } = await smartPDFExtraction(file);
        setSopText(text);
        console.log(`PDF extracted using ${method}`);
      } else if (file.name.toLowerCase().endsWith('.docx') || file.name.toLowerCase().endsWith('.doc')) {
        // Use Mammoth for Word documents
        const mammoth = await import('mammoth');
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        setSopText(result.value);
        console.log('Word document extracted');
      } else {
        // Plain text file
        const text = await file.text();
        setSopText(text);
      }
    } catch (error) {
      console.error('Error reading file:', error);
      alert(`Error reading file: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`);
    }
  };

  // Handle drag and drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Handle template selection
  const handleTemplateSelect = (template: WorkflowTemplate) => {
    setWorkflow(template.steps);
    setSopText(template.steps.map((step, i) => `${i + 1}. ${step.text}`).join('\n'));
    setShowTemplateSelector(false);
  };

  // Handle workflow reordering
  const handleReorder = (reorderedSteps: WorkflowStep[]) => {
    setWorkflow(reorderedSteps);
    setSopText(reorderedSteps.map((step, i) => `${i + 1}. ${step.text}`).join('\n'));
    setShowReorderView(false);
  };

  // Run comprehensive analysis
  const runAnalysis = async () => {
    if (workflow.length === 0) return;
    
    try {
      const analysis = await runComprehensiveAnalysis(workflow, null, 'My Workflow');
      setComprehensiveAnalysis(analysis);
      setShowAnalyticsDashboard(true);
    } catch (error) {
      console.error('Error running analysis:', error);
    }
  };

  // Create workflow from SOP text using basic parser
  const createWorkflow = async () => {
    if (!sopText.trim()) {
      alert('Please enter some SOP text first!');
      return;
    }

    setIsCreating(true);
    
    try {
      // Use the basic workflow parser
      const { parseSteps } = await import('../../../utils/workflow/workflowEditor');
      const parsedSteps = parseSteps(sopText);
      
      if (parsedSteps.length === 0) {
        // Fallback: treat each non-empty line as a step
        const fallbackSteps = sopText
          .split('\n')
          .filter(line => line.trim())
          .map((line, index) => ({
            id: `step-${index}`,
            text: line.trim(),
            type: 'process',
            name: `Step ${index + 1}`
          })) as WorkflowStep[];
        
        setWorkflow(fallbackSteps);
      } else {
        setWorkflow(parsedSteps);
      }

      // Auto-run analysis after workflow creation
      setTimeout(() => runAnalysis(), 500);
    } catch (error) {
      console.error('Error creating workflow:', error);
      alert('Error creating workflow. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  // Parse with AI using OpenAI
  const parseWithAI = async () => {
    if (!sopText.trim()) {
      alert('Please enter some SOP text first!');
      return;
    }

    setIsParsingWithAI(true);
    
    try {
      const { parseWithAIFallback } = await import('../../../utils/workflow/aiWorkflowParser');
      const aiParsedSteps = await parseWithAIFallback(sopText);
      
      setWorkflow(aiParsedSteps);
      
      // Auto-run analysis after AI parsing
      setTimeout(() => runAnalysis(), 500);
      
      // Show success message
      alert(`✨ AI successfully parsed ${aiParsedSteps.length} workflow steps!`);
    } catch (error) {
      console.error('Error parsing with AI:', error);
      alert(`AI parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}. Try the basic parser instead.`);
    } finally {
      setIsParsingWithAI(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Message with Quick Actions */}
      <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-primary-900 dark:text-primary-100">
            👋 Welcome, <span className="font-semibold">{user?.email}</span>! 
            <span className="ml-2 text-primary-600 dark:text-primary-400 font-bold">(Standard User)</span>
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setShowTemplateSelector(true)}
              className="px-3 py-1 bg-white dark:bg-gray-800 border border-primary-300 dark:border-primary-700 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors text-sm flex items-center gap-2"
            >
              <BookTemplate className="w-4 h-4" />
              Templates
            </button>
            {workflow.length > 0 && (
              <>
                <button
                  onClick={() => setShowReorderView(true)}
                  className="px-3 py-1 bg-white dark:bg-gray-800 border border-primary-300 dark:border-primary-700 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors text-sm flex items-center gap-2"
                >
                  <ArrowUpDown className="w-4 h-4" />
                  Reorder
                </button>
                <button
                  onClick={runAnalysis}
                  className="px-3 py-1 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors text-sm flex items-center gap-2"
                >
                  <BarChart3 className="w-4 h-4" />
                  Analytics
                </button>
                <button
                  onClick={() => setShowChatPanel(true)}
                  className="px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-colors text-sm flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  AI Chat
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column - Input & Controls */}
        <div className="space-y-6">
          
          {/* File Upload */}
          <FileUploadComponent
            onFileUpload={handleFileUpload}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            uploadedFileName={uploadedFileName}
          />

          {/* SOP Text Editor */}
          <WorkflowEditor
            value={sopText}
            onChange={setSopText}
            onCreateWorkflow={createWorkflow}
            onParseWithAI={parseWithAI}
            isCreating={isCreating}
            isParsingWithAI={isParsingWithAI}
          />

          {/* Export Panel */}
          {workflow.length > 0 && (
            <ExportPanel workflow={workflow} />
          )}
        </div>

        {/* Right Column - Visualization & Analysis */}
        <div className="space-y-6">
          
          {/* Workflow Visualization */}
          {workflow.length > 0 ? (
            <WorkflowFlowchart workflow={workflow} />
          ) : (
            <div className="bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 text-center">
              <div className="text-4xl mb-4">📊</div>
              <p className="text-gray-600 dark:text-gray-400">
                Enter SOP text and click "Create Workflow" to see your workflow diagram here
              </p>
            </div>
          )}

          {/* Workflow Analysis */}
          {workflow.length > 0 && (
            <WorkflowAnalysisPanel workflow={workflow} sopText={sopText} />
          )}
        </div>
      </div>

      {/* Template Selector Modal */}
      {showTemplateSelector && (
        <WorkflowTemplateSelector
          onSelectTemplate={handleTemplateSelect}
          onClose={() => setShowTemplateSelector(false)}
        />
      )}

      {/* Reordering View Modal */}
      {showReorderView && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <WorkflowReorderingView
              steps={workflow}
              onReorder={handleReorder}
              onClose={() => setShowReorderView(false)}
            />
          </div>
        </div>
      )}

      {/* Analytics Dashboard Modal */}
      {showAnalyticsDashboard && comprehensiveAnalysis && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-7xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Detailed Analytics
              </h2>
              <button
                onClick={() => setShowAnalyticsDashboard(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
            <AnalyticsDashboard analysis={comprehensiveAnalysis} />
          </div>
        </div>
      )}

      {/* AI Chat Panel Modal */}
      {showChatPanel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="max-w-2xl w-full">
            <WorkflowChatPanel
              steps={workflow}
              analysis={comprehensiveAnalysis}
              onWorkflowEdit={(newSteps) => {
                setWorkflow(newSteps);
                setSopText(newSteps.map((s, i) => `${i + 1}. ${s.text}`).join('\n'));
              }}
              onClose={() => setShowChatPanel(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserWorkflowInterface;

