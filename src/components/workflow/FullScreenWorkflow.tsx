import React, { useState } from 'react';
import { X, Edit3, Trash2, Plus, ArrowUp, ArrowDown, Save, Download } from 'lucide-react';
import { WorkflowStep } from '../../utils/workflow/workflowEditor';

interface FullScreenWorkflowProps {
  initialWorkflow: WorkflowStep[];
  onClose: () => void;
  onSave?: (workflow: WorkflowStep[]) => void;
}

const FullScreenWorkflow: React.FC<FullScreenWorkflowProps> = ({
  initialWorkflow,
  onClose,
  onSave
}) => {
  const [workflow, setWorkflow] = useState<WorkflowStep[]>(initialWorkflow);
  const [editingStep, setEditingStep] = useState<number | null>(null);
  const [editText, setEditText] = useState('');

  const handleEditStep = (index: number) => {
    setEditingStep(index);
    setEditText(workflow[index].text);
  };

  const handleSaveEdit = () => {
    if (editingStep !== null) {
      const updatedWorkflow = [...workflow];
      updatedWorkflow[editingStep] = {
        ...updatedWorkflow[editingStep],
        text: editText
      };
      setWorkflow(updatedWorkflow);
      setEditingStep(null);
      setEditText('');
    }
  };

  const handleDeleteStep = (index: number) => {
    const updatedWorkflow = workflow.filter((_, i) => i !== index);
    setWorkflow(updatedWorkflow);
  };

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      const updatedWorkflow = [...workflow];
      [updatedWorkflow[index - 1], updatedWorkflow[index]] = [updatedWorkflow[index], updatedWorkflow[index - 1]];
      setWorkflow(updatedWorkflow);
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < workflow.length - 1) {
      const updatedWorkflow = [...workflow];
      [updatedWorkflow[index], updatedWorkflow[index + 1]] = [updatedWorkflow[index + 1], updatedWorkflow[index]];
      setWorkflow(updatedWorkflow);
    }
  };

  const handleAddStep = (index: number) => {
    const newStep: WorkflowStep = {
      id: `step-${Date.now()}`,
      text: 'New step',
      type: 'process',
      number: index + 1,
      name: 'New step'
    };
    const updatedWorkflow = [...workflow];
    updatedWorkflow.splice(index + 1, 0, newStep);
    setWorkflow(updatedWorkflow);
  };

  const handleSave = () => {
    if (onSave) {
      onSave(workflow);
    }
    onClose();
  };

  const handleExport = () => {
    const workflowText = workflow.map((step, index) => `${index + 1}. ${step.text}`).join('\n');
    const blob = new Blob([workflowText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'workflow.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-white">📊 Interactive Flowchart Editor</h1>
            <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm">
              {workflow.length} steps
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleExport}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
            <button
              onClick={onClose}
              className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Close</span>
            </button>
          </div>
        </div>
      </div>

      {/* Flowchart Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto">
          {/* Grid Layout - 4 columns on large screens, 3 on medium, 2 on small */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {workflow.map((step, index) => {
              const row = Math.floor(index / (window.innerWidth > 1536 ? 5 : window.innerWidth > 1024 ? 4 : window.innerWidth > 768 ? 3 : 2));
              const col = index % (window.innerWidth > 1536 ? 5 : window.innerWidth > 1024 ? 4 : window.innerWidth > 768 ? 3 : 2);
              const isLastInRow = col === (window.innerWidth > 1536 ? 4 : window.innerWidth > 1024 ? 3 : window.innerWidth > 768 ? 2 : 1);
              const hasNextStep = index < workflow.length - 1;
              const nextRow = Math.floor((index + 1) / (window.innerWidth > 1536 ? 5 : window.innerWidth > 1024 ? 4 : window.innerWidth > 768 ? 3 : 2));
              const isLastRow = row !== nextRow;

              return (
                <div key={step.id} className="group relative">
                  {/* Flowchart Node */}
                  {step.type === 'decision' ? (
                    /* Diamond-shaped Decision Node */
                    <div className="relative bg-white shadow-xl border-2 border-yellow-200 hover:border-yellow-400 transition-all duration-300 hover:shadow-yellow-500/25 hover:shadow-2xl hover:scale-105 cursor-pointer w-48 h-48 mx-auto">
                      {/* Diamond Shape */}
                      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-500 transform rotate-45 rounded-lg"></div>
                      
                      {/* Content Container */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                        {/* Node Header */}
                        <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 mb-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-5 h-5 bg-white/30 rounded-full flex items-center justify-center font-bold text-xs text-white">
                              {index + 1}
                            </div>
                            <span className="text-xs font-medium uppercase tracking-wide text-white">
                              Decision
                            </span>
                          </div>
                        </div>

                        {/* Node Content */}
                        <div className="text-center">
                          {editingStep === index ? (
                            <div className="space-y-2">
                              <textarea
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-xs bg-white"
                                rows={2}
                                autoFocus
                              />
                              <div className="flex space-x-1">
                                <button
                                  onClick={handleSaveEdit}
                                  className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs transition-colors"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingStep(null);
                                    setEditText('');
                                  }}
                                  className="bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 rounded text-xs transition-colors"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-white text-xs leading-relaxed line-clamp-3 font-medium">{step.text}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Regular Rectangle Node */
                    <div className="bg-white rounded-xl shadow-xl border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 hover:shadow-blue-500/25 hover:shadow-2xl hover:scale-105 cursor-pointer h-full">
                      {/* Node Header */}
                      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-t-xl">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center font-bold text-sm">
                              {index + 1}
                            </div>
                            <span className="text-xs font-medium uppercase tracking-wide">
                              {step.type}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Node Content */}
                      <div className="p-4">
                        {editingStep === index ? (
                          <div className="space-y-3">
                            <textarea
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                              rows={3}
                              autoFocus
                            />
                            <div className="flex space-x-2">
                              <button
                                onClick={handleSaveEdit}
                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => {
                                  setEditingStep(null);
                                  setEditText('');
                                }}
                                className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-gray-800 text-sm leading-relaxed line-clamp-4">{step.text}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Hover Actions Overlay - for Decision Nodes */}
                  {step.type === 'decision' && (
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 rounded-lg pointer-events-none">
                      <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-wrap gap-1">
                        <button
                          onClick={() => handleEditStep(index)}
                          className="p-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs transition-colors pointer-events-auto"
                          title="Edit step"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleMoveUp(index)}
                          disabled={index === 0}
                          className="p-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white rounded text-xs transition-colors pointer-events-auto"
                          title="Move up"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleMoveDown(index)}
                          disabled={index === workflow.length - 1}
                          className="p-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white rounded text-xs transition-colors pointer-events-auto"
                          title="Move down"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleAddStep(index)}
                          className="p-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs transition-colors pointer-events-auto"
                          title="Add step after"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteStep(index)}
                          className="p-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs transition-colors pointer-events-auto"
                          title="Delete step"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Hover Actions Overlay - for Regular Nodes */}
                  {step.type !== 'decision' && (
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 rounded-xl pointer-events-none">
                      <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-wrap gap-1">
                        <button
                          onClick={() => handleEditStep(index)}
                          className="p-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs transition-colors pointer-events-auto"
                          title="Edit step"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleMoveUp(index)}
                          disabled={index === 0}
                          className="p-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white rounded text-xs transition-colors pointer-events-auto"
                          title="Move up"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleMoveDown(index)}
                          disabled={index === workflow.length - 1}
                          className="p-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white rounded text-xs transition-colors pointer-events-auto"
                          title="Move down"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleAddStep(index)}
                          className="p-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs transition-colors pointer-events-auto"
                          title="Add step after"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteStep(index)}
                          className="p-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs transition-colors pointer-events-auto"
                          title="Delete step"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Connection Arrows */}
                  {hasNextStep && !isLastRow && (
                    <>
                      {/* Right Arrow */}
                      {!isLastInRow && (
                        <div className="absolute top-1/2 -right-3 transform -translate-y-1/2">
                          <div className="w-0 h-0 border-l-8 border-l-blue-400 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
                        </div>
                      )}
                      
                      {/* Down Arrow (when at end of row) */}
                      {isLastInRow && (
                        <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
                          <div className="w-0 h-0 border-t-8 border-t-blue-400 border-l-4 border-l-transparent border-r-4 border-r-transparent"></div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* Add New Step */}
          <div className="flex justify-center mt-8">
            <button
              onClick={() => handleAddStep(workflow.length - 1)}
              className="flex items-center space-x-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm border-2 border-dashed border-white/40 hover:border-white/60 text-white px-6 py-4 rounded-xl transition-all duration-300 hover:scale-105"
            >
              <Plus className="w-6 h-6" />
              <span className="text-lg font-medium">Add New Step</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullScreenWorkflow;
