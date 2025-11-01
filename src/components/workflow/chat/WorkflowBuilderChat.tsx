/**
 * Workflow Builder Chat Component
 * Interactive AI assistant for building workflows from scratch
 */

import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles } from 'lucide-react';
import { WorkflowStep } from '../../../utils/workflow/workflowEditor';
import {
  BuilderState,
  BuilderMessage,
  initializeBuilder,
  processUserInput,
  isWorkflowComplete
} from '../../../utils/workflow/aiWorkflowBuilder';

interface WorkflowBuilderChatProps {
  onComplete: (steps: WorkflowStep[]) => void;
  onClose: () => void;
}

const WorkflowBuilderChat: React.FC<WorkflowBuilderChatProps> = ({
  onComplete,
  onClose
}) => {
  const [state, setState] = useState<BuilderState>(initializeBuilder());
  const [userInput, setUserInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.messages]);

  const handleSend = () => {
    if (!userInput.trim() || isProcessing) return;

    setIsProcessing(true);
    const input = userInput;
    setUserInput('');

    // Simulate small delay for natural feel
    setTimeout(() => {
      const newState = processUserInput(state, input);
      setState(newState);
      setIsProcessing(false);

      // Check if workflow is complete
      if (isWorkflowComplete(newState)) {
        setTimeout(() => {
          onComplete(newState.generatedSteps);
        }, 1000);
      }
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickReply = (reply: string) => {
    setUserInput(reply);
    setTimeout(() => {
      handleSend();
    }, 100);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-3xl h-[600px] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-t-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6" />
            <div>
              <h2 className="text-xl font-bold">AI Workflow Builder Assistant</h2>
              <p className="text-sm text-blue-100">Build your workflow from scratch with AI guidance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 dark:bg-gray-900">
          {state.messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700'
                }`}
              >
                {message.role === 'ai' && (
                  <div className="flex items-center gap-2 mb-2 text-blue-600 dark:text-blue-400 font-semibold text-sm">
                    <Sparkles className="w-4 h-4" />
                    <span>AI Assistant</span>
                  </div>
                )}
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {message.content}
                </div>
              </div>
            </div>
          ))}

          {isProcessing && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 max-w-[80%]">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-sm mb-2">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  <span>AI Assistant</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies (when in refine stage) */}
        {state.stage === 'refine' && !isWorkflowComplete(state) && (
          <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Quick replies:</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleQuickReply('Looks good, use this')}
                className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
              >
                ✓ Looks good
              </button>
              <button
                onClick={() => handleQuickReply('Add warranty handling')}
                className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
              >
                + Add warranty
              </button>
              <button
                onClick={() => handleQuickReply('Add quality check')}
                className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
              >
                + Add quality check
              </button>
            </div>
          </div>
        )}

        {/* Input */}
        {!isWorkflowComplete(state) && (
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-b-xl">
            <div className="flex gap-3">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your answer..."
                disabled={isProcessing}
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={!userInput.trim() || isProcessing}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-lg transition-colors flex items-center gap-2 font-medium disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
                Send
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Press Enter to send • Cost: 5 credits when complete
            </p>
          </div>
        )}

        {/* Complete state */}
        {isWorkflowComplete(state) && (
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-b-xl">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-medium">Workflow ready! Loading...</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkflowBuilderChat;

