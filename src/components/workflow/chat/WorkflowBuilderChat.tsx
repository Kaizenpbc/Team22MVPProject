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
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-6 py-4 rounded-t-xl flex items-center justify-between shadow-lg animate-gradient">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Sparkles className="w-7 h-7 animate-pulse" />
              <div className="absolute inset-0 w-7 h-7 animate-ping opacity-20">
                <Sparkles className="w-7 h-7" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                AI Workflow Builder
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">BETA</span>
              </h2>
              <p className="text-sm text-blue-100">Build from scratch • 13 Industries • 5 credits</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-all hover:rotate-90 duration-300"
            title="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
          {state.messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
            >
              <div
                className={`max-w-[80%] rounded-xl px-5 py-4 shadow-md transition-all hover:shadow-lg ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-2 border-purple-200 dark:border-purple-800'
                }`}
              >
                {message.role === 'ai' && (
                  <div className="flex items-center gap-2 mb-3 text-purple-600 dark:text-purple-400 font-bold text-sm">
                    <Sparkles className="w-4 h-4 animate-pulse" />
                    <span>AI Workflow Expert</span>
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

        {/* Example Industry Prompts (when in domain stage) */}
        {state.stage === 'domain' && (
          <div className="px-6 py-3 border-t-2 border-blue-200 dark:border-blue-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-3 h-3 text-blue-600 dark:text-blue-400" />
              <p className="text-xs font-semibold text-blue-700 dark:text-blue-300">Popular industries (click to try):</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleQuickReply('automotive repair shop')}
                className="px-3 py-1.5 bg-white dark:bg-gray-700 text-blue-700 dark:text-blue-300 border-2 border-blue-300 dark:border-blue-600 rounded-full text-sm font-medium hover:bg-blue-50 dark:hover:bg-gray-600 transition-all transform hover:scale-105"
              >
                🚗 Auto Repair
              </button>
              <button
                onClick={() => handleQuickReply('restaurant food service')}
                className="px-3 py-1.5 bg-white dark:bg-gray-700 text-orange-700 dark:text-orange-300 border-2 border-orange-300 dark:border-orange-600 rounded-full text-sm font-medium hover:bg-orange-50 dark:hover:bg-gray-600 transition-all transform hover:scale-105"
              >
                🍽️ Restaurant
              </button>
              <button
                onClick={() => handleQuickReply('IT support helpdesk')}
                className="px-3 py-1.5 bg-white dark:bg-gray-700 text-green-700 dark:text-green-300 border-2 border-green-300 dark:border-green-600 rounded-full text-sm font-medium hover:bg-green-50 dark:hover:bg-gray-600 transition-all transform hover:scale-105"
              >
                💻 IT Support
              </button>
              <button
                onClick={() => handleQuickReply('healthcare patient care')}
                className="px-3 py-1.5 bg-white dark:bg-gray-700 text-red-700 dark:text-red-300 border-2 border-red-300 dark:border-red-600 rounded-full text-sm font-medium hover:bg-red-50 dark:hover:bg-gray-600 transition-all transform hover:scale-105"
              >
                🏥 Healthcare
              </button>
              <button
                onClick={() => handleQuickReply('retail order fulfillment')}
                className="px-3 py-1.5 bg-white dark:bg-gray-700 text-purple-700 dark:text-purple-300 border-2 border-purple-300 dark:border-purple-600 rounded-full text-sm font-medium hover:bg-purple-50 dark:hover:bg-gray-600 transition-all transform hover:scale-105"
              >
                🛍️ Retail
              </button>
            </div>
          </div>
        )}

        {/* Quick Replies (when in refine stage) */}
        {state.stage === 'refine' && !isWorkflowComplete(state) && (
          <div className="px-6 py-3 border-t-2 border-purple-200 dark:border-purple-700 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-800">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-3 h-3 text-purple-600 dark:text-purple-400" />
              <p className="text-xs font-semibold text-purple-700 dark:text-purple-300">Suggested actions:</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleQuickReply('Looks good, use this')}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full text-sm font-medium hover:from-green-600 hover:to-green-700 transition-all shadow-sm hover:shadow-md transform hover:scale-105"
              >
                ✓ Looks Perfect - Create It!
              </button>
              <button
                onClick={() => handleQuickReply('Add warranty handling')}
                className="px-3 py-1.5 bg-white dark:bg-gray-700 text-blue-700 dark:text-blue-300 border-2 border-blue-300 dark:border-blue-600 rounded-full text-sm font-medium hover:bg-blue-50 dark:hover:bg-gray-600 transition-all"
              >
                + Warranty
              </button>
              <button
                onClick={() => handleQuickReply('Add error handling')}
                className="px-3 py-1.5 bg-white dark:bg-gray-700 text-orange-700 dark:text-orange-300 border-2 border-orange-300 dark:border-orange-600 rounded-full text-sm font-medium hover:bg-orange-50 dark:hover:bg-gray-600 transition-all"
              >
                + Error Handling
              </button>
              <button
                onClick={() => handleQuickReply('Add quality check')}
                className="px-3 py-1.5 bg-white dark:bg-gray-700 text-purple-700 dark:text-purple-300 border-2 border-purple-300 dark:border-purple-600 rounded-full text-sm font-medium hover:bg-purple-50 dark:hover:bg-gray-600 transition-all"
              >
                + Quality Check
              </button>
            </div>
          </div>
        )}

        {/* Input */}
        {!isWorkflowComplete(state) && (
          <div className="p-6 border-t-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-b-xl">
            <div className="flex gap-3">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={state.stage === 'domain' ? "e.g., 'automotive repair shop' or 'IT helpdesk'" : "e.g., 'Add warranty handling' or 'Looks good'"}
                disabled={isProcessing}
                className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white disabled:opacity-50 transition-all"
              />
              <button
                onClick={handleSend}
                disabled={!userInput.trim() || isProcessing}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 dark:disabled:from-gray-600 dark:disabled:to-gray-700 text-white rounded-xl transition-all flex items-center gap-2 font-semibold disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
              >
                <Send className="w-5 h-5" />
                Send
              </button>
            </div>
            <div className="flex items-center justify-between mt-3">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                💡 Press <kbd className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">Enter</kbd> to send
              </p>
              <p className="text-xs font-medium text-purple-600 dark:text-purple-400">
                💰 5 credits • Builds complete workflow
              </p>
            </div>
          </div>
        )}

        {/* Complete state */}
        {isWorkflowComplete(state) && (
          <div className="p-6 border-t-2 border-green-200 dark:border-green-700 bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 dark:from-gray-800 dark:to-gray-800 rounded-b-xl">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl shadow-lg animate-bounce">
                <svg className="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-bold text-lg">Workflow Created Successfully!</span>
                <Sparkles className="w-5 h-5 animate-spin" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                🎨 Generating your interactive flowchart...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkflowBuilderChat;

