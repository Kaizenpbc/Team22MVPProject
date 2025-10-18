import React, { useState } from 'react';
import { BookTemplate, ArrowUpDown, BarChart3, MessageCircle } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import FileUploadComponent from '../core/FileUploadComponent.tsx';
import WorkflowEditor from '../core/WorkflowEditor.tsx';
import EnhancedWorkflowFlowchart from '../visualization/EnhancedWorkflowFlowchart';
import WorkflowAnalysisPanel from '../analysis/WorkflowAnalysisPanel.tsx';
import ExportPanel from '../export/ExportPanel.tsx';
import WorkflowTemplateSelector from '../templates/WorkflowTemplateSelector';
import WorkflowReorderingView from '../visualization/WorkflowReorderingView';
import AnalyticsDashboard from '../analysis/AnalyticsDashboard';
import WorkflowChatPanel from '../chat/WorkflowChatPanel';
import GapDetectionPanel from '../analysis/GapDetectionPanel';
import DuplicateDetectionPanel from '../analysis/DuplicateDetectionPanel';
import { DomainAgnosticGapPanel } from '../analysis/DomainAgnosticGapPanel';
import { WorkflowTemplate } from '../../../utils/workflow/workflowTemplates';
import { runComprehensiveAnalysis, ComprehensiveAnalysis } from '../../../utils/workflow/comprehensiveWorkflowAnalysis';
import { WorkflowStep } from '../../../utils/workflow/workflowEditor';
import { hasEnoughCredits, useAIParse, useAIAnalysis, CREDIT_COSTS, getCreditBalance } from '../../../services/creditsService';
import FullScreenWorkflow from '../FullScreenWorkflow';
import StepOptimizationPanel from '../StepOptimizationPanel';

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
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [showStepOptimization, setShowStepOptimization] = useState(false);
  const [comprehensiveAnalysis, setComprehensiveAnalysis] = useState<ComprehensiveAnalysis | null>(null);
  
  // Resizable panel state
  const [leftWidth, setLeftWidth] = useState(50); // percentage
  const [isDragging, setIsDragging] = useState(false);

  // Handle divider drag
  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    const container = document.getElementById('resizable-container');
    if (!container) return;
    
    const containerRect = container.getBoundingClientRect();
    const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
    
    // Constrain between 20% and 80%
    if (newLeftWidth >= 20 && newLeftWidth <= 80) {
      setLeftWidth(newLeftWidth);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add/remove mouse event listeners for dragging
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove as any);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleMouseMove as any);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove as any);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };
  }, [isDragging]);

  // Handle file upload with PDF support
  const handleFileUpload = async (file: File) => {
    if (!file) return;
    
    setUploadedFileName(file.name);
    
    // Clear all previous workflow data when loading a new document
    setWorkflow([]);
    setComprehensiveAnalysis(null);
    
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

  // Run comprehensive analysis (WITH CREDIT CHECK)
  const runAnalysis = async () => {
    if (workflow.length === 0) return;

    if (!user) {
      alert('Please sign in to use AI analysis!');
      return;
    }

    // Check if user has an API key configured (BYOK model)
    // Exempt test users and admins - they use system API key
    const isTestUser = user.email?.includes('test@') || user.email?.includes('@test.');
    const isAdminUser = user.email?.includes('admin') || user.email?.includes('@kpbc.ca');
    const isExempt = isTestUser || isAdminUser;
    
    if (!isExempt) {
      const { hasAPIKey } = await import('../../../services/apiKeyService');
      if (!hasAPIKey()) {
        const confirmed = window.confirm(
          '🔑 OpenAI API Key Required\n\n' +
          'AI Analysis requires your own OpenAI API key.\n\n' +
          'This is part of our BYOK (Bring Your Own Key) pricing model.\n' +
          'You only pay OpenAI directly for what you use (~$0.01 per analysis).\n\n' +
          'Would you like to configure your API key now?'
        );
        if (confirmed) {
          window.location.href = '/settings';
        }
        return;
      }
    } else {
      console.log('🔓 Exempt user (test/admin) - using system API key for analysis');
    }

    // Check if user has enough credits
    const hasCredits = await hasEnoughCredits(user.id, CREDIT_COSTS.AI_ANALYSIS);
    if (!hasCredits) {
      const balance = await getCreditBalance(user.id);
      const confirmed = window.confirm(
        `⚠️ Not Enough Credits!\n\n` +
        `You have: ${balance.credits} credits\n` +
        `AI Analysis costs: ${CREDIT_COSTS.AI_ANALYSIS} credits\n\n` +
        `Would you like to buy more credits?`
      );
      if (confirmed) {
        window.location.href = '/credits';
      }
      return;
    }
    
    try {
      // DEDUCT CREDITS FIRST
      const deducted = await useAIAnalysis(user.id, 'Workflow');
      if (!deducted) {
        throw new Error('Failed to deduct credits');
      }

      // Then run analysis
      const analysis = await runComprehensiveAnalysis(workflow, null, 'My Workflow');
      setComprehensiveAnalysis(analysis);
      setShowAnalyticsDashboard(true);

      // Update balance
      const newBalance = await getCreditBalance(user.id);
      console.log(`✅ Analysis complete! ${CREDIT_COSTS.AI_ANALYSIS} credits used. Balance: ${newBalance.credits}`);
    } catch (error) {
      console.error('Error running analysis:', error);
      if (error instanceof Error && error.message === 'NOT_ENOUGH_CREDITS') {
        alert('Not enough credits! Please buy more credits.');
        window.location.href = '/credits';
      }
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
        
        // Update input area with numbered fallback steps
        const { stepsToText } = await import('../../../utils/workflow/workflowEditor');
        const numberedText = stepsToText(fallbackSteps);
        setSopText(numberedText);
      } else {
        setWorkflow(parsedSteps);
        
        // Update input area with numbered parsed steps
        const { stepsToText } = await import('../../../utils/workflow/workflowEditor');
        const numberedText = stepsToText(parsedSteps);
        setSopText(numberedText);
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

  // Parse with AI using OpenAI (WITH CREDIT CHECK)
  const parseWithAI = async () => {
    if (!sopText.trim()) {
      alert('Please enter some SOP text first!');
      return;
    }

    if (!user) {
      alert('Please sign in to use AI features!');
      return;
    }

    // Check if user has an API key configured (BYOK model)
    // Exempt test users and admins - they use system API key
    const isTestUser = user.email?.includes('test@') || user.email?.includes('@test.');
    const isAdminUser = user.email?.includes('admin') || user.email?.includes('@kpbc.ca');
    const isExempt = isTestUser || isAdminUser;
    
    if (!isExempt) {
      const { hasAPIKey } = await import('../../../services/apiKeyService');
      if (!hasAPIKey()) {
        const confirmed = window.confirm(
          '🔑 OpenAI API Key Required\n\n' +
          'AI features require your own OpenAI API key.\n\n' +
          'This is part of our BYOK (Bring Your Own Key) pricing model.\n' +
          'You only pay OpenAI directly for what you use (~$0.02 per workflow).\n\n' +
          'Would you like to configure your API key now?'
        );
        if (confirmed) {
          window.location.href = '/settings';
        }
        return;
      }
    } else {
      console.log('🔓 Exempt user (test/admin) - using system API key');
    }

    console.log('🔍 Starting AI Parse for user:', user.email);
    console.log('📝 SOP Text length:', sopText.length);

    // Check if user has enough credits
    try {
      const hasCredits = await hasEnoughCredits(user.id, CREDIT_COSTS.AI_PARSE);
      console.log('💰 Credit check result:', hasCredits);
      
      if (!hasCredits) {
        const balance = await getCreditBalance(user.id);
        console.log('💳 User balance:', balance);
        const confirmed = window.confirm(
          `⚠️ Not Enough Credits!\n\n` +
          `You have: ${balance.credits} credits\n` +
          `AI Parse costs: ${CREDIT_COSTS.AI_PARSE} credits\n\n` +
          `Would you like to buy more credits?`
        );
        if (confirmed) {
          window.location.href = '/credits';
        }
        return;
      }
    } catch (error) {
      console.error('❌ Credit check failed:', error);
      alert(`Credit check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return;
    }

    setIsParsingWithAI(true);
    
    try {
      console.log('💳 Deducting credits...');
      // DEDUCT CREDITS FIRST
      const deducted = await useAIParse(user.id, 'Workflow');
      console.log('✅ Credits deducted:', deducted);
      
      if (!deducted) {
        throw new Error('Failed to deduct credits');
      }

      console.log('🤖 Starting AI parsing...');
      // Then run AI parsing
      const { parseWithAIFallback } = await import('../../../utils/workflow/aiWorkflowParser');
      const aiParsedSteps = await parseWithAIFallback(sopText);
      console.log('✨ AI parsing completed:', aiParsedSteps.length, 'steps');

      setWorkflow(aiParsedSteps);
      
      // Update input area with numbered steps
      const { stepsToText } = await import('../../../utils/workflow/workflowEditor');
      const numberedText = stepsToText(aiParsedSteps);
      setSopText(numberedText);
      
      // Auto-run analysis after AI parsing  
      setTimeout(() => runAnalysis(), 500);
      
      // Update credit balance in parent
      const newBalance = await getCreditBalance(user.id);
      
      // Show success message with credit usage
      alert(`✨ AI successfully parsed ${aiParsedSteps.length} workflow steps!\n\n` +
            `Credits used: ${CREDIT_COSTS.AI_PARSE}\n` +
            `Remaining balance: ${newBalance.credits} credits`);
    } catch (error) {
      console.error('❌ AI parsing failed:', error);
      
      // Show detailed error message
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      if (error instanceof Error && error.message === 'NOT_ENOUGH_CREDITS') {
        alert('Not enough credits! Please buy more credits to use AI features.');
        window.location.href = '/credits';
      } else {
        alert(`🚨 AI Parsing Failed!\n\nError: ${errorMessage}\n\nTry the basic parser instead or check:\n1. OpenAI API key is configured\n2. You have enough credits\n3. Internet connection is working`);
      }
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
          <div className="flex gap-2 flex-wrap">
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
                  onClick={() => setShowFullScreen(true)}
                  className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm flex items-center gap-2"
                  title="Open interactive full screen editor"
                >
                  🖥️ Full Screen
                </button>
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
                <button
                  onClick={() => setShowStepOptimization(true)}
                  className="px-3 py-1 bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 text-white rounded-lg transition-colors text-sm flex items-center gap-2"
                  title="Optimize complex workflow steps"
                >
                  ⚡ Optimize
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Orange Warning Boxes - Gaps & Duplicates - Show First! */}
      {comprehensiveAnalysis && (
        <div className="space-y-4 mb-6">
          {/* Gap Detection Orange Box */}
          {comprehensiveAnalysis.gaps?.internalGaps?.missingSteps && comprehensiveAnalysis.gaps.internalGaps.missingSteps.length > 0 && (
            <GapDetectionPanel
              missingSteps={comprehensiveAnalysis.gaps.internalGaps.missingSteps}
              onAddStep={(stepText) => {
                // Add the missing step to the workflow
                const newStep = {
                  id: `added-step-${Date.now()}`,
                  text: stepText,
                  type: 'process',
                  name: stepText
                };
                const newSteps = [...workflow, newStep];
                setWorkflow(newSteps);
                setSopText(newSteps.map((s, i) => `${i + 1}. ${s.text}`).join('\n'));
              }}
            />
          )}

          {/* Duplicate Detection Orange Box */}
          {comprehensiveAnalysis.duplicates && comprehensiveAnalysis.duplicates.length > 0 && (
            <DuplicateDetectionPanel
              duplicates={comprehensiveAnalysis.duplicates}
              onMergeSteps={(step1Index, step2Index) => {
                // Merge the two steps
                const newSteps = [...workflow];
                const mergedText = `${newSteps[step1Index].text} AND ${newSteps[step2Index].text}`;
                newSteps[step1Index] = {
                  ...newSteps[step1Index],
                  text: mergedText,
                  name: mergedText
                };
                newSteps.splice(step2Index, 1);
                setWorkflow(newSteps);
                setSopText(newSteps.map((s, i) => `${i + 1}. ${s.text}`).join('\n'));
                // Re-run analysis after merging
                setTimeout(() => runAnalysis(), 500);
              }}
              onKeepBoth={(index) => {
                // Just acknowledge - keep both steps
                console.log('User chose to keep both steps for duplicate pair', index);
              }}
            />
          )}

          {/* Domain-Agnostic Gap Detection Orange Box */}
          {comprehensiveAnalysis.domainAgnosticGaps && comprehensiveAnalysis.domainAgnosticGaps.summary.total > 0 && (
            <DomainAgnosticGapPanel
              analysis={comprehensiveAnalysis.domainAgnosticGaps}
              onAddStep={(stepText, position) => {
                // Add the missing step to the workflow at the specified position
                const newStep = {
                  id: `added-step-${Date.now()}`,
                  text: stepText,
                  type: 'process',
                  name: stepText
                };
                const newSteps = [...workflow];
                if (position === 0) {
                  newSteps.unshift(newStep);
                } else if (position >= newSteps.length) {
                  newSteps.push(newStep);
                } else {
                  newSteps.splice(position, 0, newStep);
                }
                setWorkflow(newSteps);
                setSopText(newSteps.map((s, i) => `${i + 1}. ${s.text}`).join('\n'));
                // Re-run analysis after adding step
                setTimeout(() => runAnalysis(), 500);
              }}
            />
          )}

          {/* Show message if analysis ran but no issues found */}
          {comprehensiveAnalysis && 
           (!comprehensiveAnalysis.gaps?.internalGaps?.missingSteps || comprehensiveAnalysis.gaps.internalGaps.missingSteps.length === 0) &&
           (!comprehensiveAnalysis.duplicates || comprehensiveAnalysis.duplicates.length === 0) &&
           (!comprehensiveAnalysis.domainAgnosticGaps || comprehensiveAnalysis.domainAgnosticGaps.summary.total === 0) && (
            <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-400 rounded-xl p-6 text-center">
              <div className="text-4xl mb-3">✅</div>
              <h3 className="text-lg font-bold text-green-800 dark:text-green-200 mb-2">
                Workflow Looks Great!
              </h3>
              <p className="text-green-700 dark:text-green-300">
                No gaps or duplicates detected. Your workflow is well-structured!
              </p>
            </div>
          )}
        </div>
      )}

      {/* Main Resizable Layout */}
      <div id="resizable-container" className="flex gap-0 relative" style={{ maxHeight: 'calc(100vh - 200px)' }}>
        
        {/* Left Column - Input & Controls */}
        <div 
          className="space-y-6 overflow-y-auto pr-3 h-full"
          style={{ width: `${leftWidth}%`, minWidth: '300px' }}
        >
          
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

        {/* Draggable Divider */}
        <div
          onMouseDown={handleMouseDown}
          className="w-1 bg-gray-300 dark:bg-gray-600 hover:bg-primary-500 dark:hover:bg-primary-400 cursor-col-resize transition-colors relative group"
          style={{ minWidth: '4px' }}
        >
          <div className="absolute inset-y-0 -left-1 -right-1 group-hover:bg-primary-500/20" />
        </div>

        {/* Right Column - Visualization & Analysis */}
        <div 
          className="space-y-6 overflow-y-auto pl-3 h-full"
          style={{ width: `${100 - leftWidth}%`, minWidth: '300px' }}
        >
          
          {/* Workflow Visualization - Interactive ReactFlow */}
          {workflow.length > 0 ? (
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-4 bg-gradient-to-r from-primary-600 to-accent-600 text-white">
                <h3 className="font-bold text-lg">🔄 Interactive Workflow Diagram</h3>
                <p className="text-sm text-white text-opacity-90">Drag nodes • Zoom with mouse wheel • Pan by dragging</p>
              </div>
              <EnhancedWorkflowFlowchart 
                steps={workflow} 
                analysis={comprehensiveAnalysis}
              />
            </div>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 text-center">
              <div className="text-4xl mb-4">📊</div>
              <p className="text-gray-600 dark:text-gray-400">
                Enter SOP text and click "Create Workflow" to see your interactive flowchart here
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

      {/* Full Screen Workflow Editor */}
      {showFullScreen && (
        <FullScreenWorkflow
          initialWorkflow={workflow}
          onClose={() => setShowFullScreen(false)}
          onSave={(updatedWorkflow) => {
            setWorkflow(updatedWorkflow);
            setShowFullScreen(false);
          }}
        />
      )}

      {/* Step Optimization Panel */}
      {showStepOptimization && (
        <StepOptimizationPanel
          workflow={workflow}
          onApplySplits={(newWorkflow) => {
            setWorkflow(newWorkflow);
            setShowStepOptimization(false);
          }}
          onClose={() => setShowStepOptimization(false)}
        />
      )}
    </div>
  );
};

export default UserWorkflowInterface;

