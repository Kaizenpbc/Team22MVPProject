import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Sparkles, AlertCircle } from 'lucide-react';
import { WorkflowStep } from '../../../utils/workflow/workflowEditor';
import { ComprehensiveAnalysis } from '../../../utils/workflow/comprehensiveWorkflowAnalysis';
import {
  ChatMessage,
  getChatResponse,
  buildWorkflowContext,
  parseEditCommand,
  applyWorkflowEdit
} from '../../../utils/workflow/workflowChat';

interface WorkflowChatPanelProps {
  steps: WorkflowStep[];
  analysis: ComprehensiveAnalysis | null;
  onWorkflowEdit: (newSteps: WorkflowStep[]) => void;
  onClose?: () => void;
}

/**
 * AI Chat Panel for Workflow Editing
 * Users can ask questions and request workflow edits via natural language
 */
const WorkflowChatPanel: React.FC<WorkflowChatPanelProps> = ({
  steps,
  analysis,
  onWorkflowEdit,
  onClose
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'assistant',
      message: '👋 Hi! I can help optimize your workflow! Ask me to:\n\n• Add steps\n• Remove steps\n• Reorder steps\n• Merge steps\n• Explain your analytics\n\nTry: "Add a verification step after step 2"',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [pendingEdit, setPendingEdit] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isSending) return;

    if (!apiKey) {
      alert('OpenAI API key not configured. Please add VITE_OPENAI_API_KEY to your .env file.');
      return;
    }

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      message: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsSending(true);

    try {
      const context = buildWorkflowContext(steps, analysis);
      const aiResponse = await getChatResponse(inputMessage, context, messages, apiKey);

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        sender: 'assistant',
        message: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMsg]);

      // Check if AI response contains an edit command
      const editCommand = parseEditCommand(aiResponse);
      if (editCommand) {
        setPendingEdit(editCommand);
      }

    } catch (error) {
      const errorMsg: ChatMessage = {
        id: `msg-${Date.now()}-error`,
        sender: 'assistant',
        message: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsSending(false);
    }
  };

  const handleApplyEdit = () => {
    if (!pendingEdit) return;

    const newSteps = applyWorkflowEdit(steps, pendingEdit);
    onWorkflowEdit(newSteps);
    
    const confirmMsg: ChatMessage = {
      id: `msg-${Date.now()}-confirm`,
      sender: 'assistant',
      message: '✅ Workflow updated successfully!',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, confirmMsg]);
    setPendingEdit(null);
  };

  const handleCancelEdit = () => {
    setPendingEdit(null);
    const cancelMsg: ChatMessage = {
      id: `msg-${Date.now()}-cancel`,
      sender: 'assistant',
      message: 'Edit cancelled. What else can I help with?',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, cancelMsg]);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 h-[600px] flex flex-col">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MessageCircle className="w-6 h-6" />
          <div>
            <h3 className="font-bold text-lg">AI Workflow Assistant</h3>
            <p className="text-xs text-white text-opacity-90">Ask me to edit your workflow!</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-900">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] px-4 py-2 rounded-lg ${
                msg.sender === 'user'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
              }`}
            >
              {msg.sender === 'assistant' && (
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span className="text-xs font-semibold text-purple-600">AI Assistant</span>
                </div>
              )}
              <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
              <p className="text-xs opacity-70 mt-1">
                {msg.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        
        {/* Pending Edit Confirmation */}
        {pendingEdit && (
          <div className="bg-yellow-50 dark:bg-yellow-900 border-2 border-yellow-400 dark:border-yellow-600 rounded-lg p-4">
            <div className="flex items-start gap-3 mb-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
                  Confirm Workflow Edit
                </p>
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  {pendingEdit.command}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleApplyEdit}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-semibold"
              >
                ✓ Apply
              </button>
              <button
                onClick={handleCancelEdit}
                className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors font-semibold"
              >
                ✗ Cancel
              </button>
            </div>
          </div>
        )}

        {isSending && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-3 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask me to edit your workflow..."
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            disabled={isSending}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isSending}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg transition-all disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            Send
          </button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Try: "Add a verification step after step 2" or "Remove duplicate steps"
        </p>
      </div>
    </div>
  );
};

export default WorkflowChatPanel;

