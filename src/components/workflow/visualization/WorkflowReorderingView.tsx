import React, { useState } from 'react';
import { 
  GripVertical, 
  ChevronUp, 
  ChevronDown, 
  Trash2,
  Plus,
  Check,
  X,
  AlertCircle,
  Info
} from 'lucide-react';
import { WorkflowStep } from '../../../utils/workflow/workflowEditor';

interface WorkflowReorderingViewProps {
  steps: WorkflowStep[];
  onReorder: (reorderedSteps: WorkflowStep[]) => void;
  onClose?: () => void;
}

/**
 * Drag-and-Drop Workflow Reordering Component
 * Allows users to reorder, add, edit, and delete workflow steps
 */
const WorkflowReorderingView: React.FC<WorkflowReorderingViewProps> = ({ 
  steps: initialSteps, 
  onReorder,
  onClose 
}) => {
  const [steps, setSteps] = useState<WorkflowStep[]>(initialSteps);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  
  // Hover details editing state
  const [editingHoverIndex, setEditingHoverIndex] = useState<number | null>(null);
  const [hoverTitle, setHoverTitle] = useState('');
  const [hoverItems, setHoverItems] = useState<string[]>(['']);
  const [hoverCategory, setHoverCategory] = useState('');

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragEnd = () => {
    if (draggedIndex !== null && dragOverIndex !== null && draggedIndex !== dragOverIndex) {
      const newSteps = [...steps];
      const draggedStep = newSteps[draggedIndex];
      
      // Remove dragged item
      newSteps.splice(draggedIndex, 1);
      
      // Insert at new position
      newSteps.splice(dragOverIndex, 0, draggedStep);
      
      setSteps(newSteps);
      setHasChanges(true);
    }
    
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newSteps = [...steps];
    [newSteps[index - 1], newSteps[index]] = [newSteps[index], newSteps[index - 1]];
    setSteps(newSteps);
    setHasChanges(true);
  };

  const handleMoveDown = (index: number) => {
    if (index === steps.length - 1) return;
    const newSteps = [...steps];
    [newSteps[index], newSteps[index + 1]] = [newSteps[index + 1], newSteps[index]];
    setSteps(newSteps);
    setHasChanges(true);
  };

  const handleDelete = (index: number) => {
    const newSteps = steps.filter((_, i) => i !== index);
    setSteps(newSteps);
    setHasChanges(true);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditText(steps[index].text || '');
  };

  const handleSaveEdit = () => {
    if (editingIndex !== null && editText.trim()) {
      const newSteps = [...steps];
      newSteps[editingIndex] = {
        ...newSteps[editingIndex],
        text: editText.trim()
      };
      setSteps(newSteps);
      setEditingIndex(null);
      setEditText('');
      setHasChanges(true);
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditText('');
  };

  const handleAddStep = (afterIndex: number) => {
    const newStep: WorkflowStep = {
      id: `step-${Date.now()}`,
      text: 'New step - click to edit',
      type: 'process',
      name: 'New Step'
    };
    
    const newSteps = [...steps];
    newSteps.splice(afterIndex + 1, 0, newStep);
    setSteps(newSteps);
    setHasChanges(true);
    
    // Automatically start editing the new step
    setTimeout(() => {
      setEditingIndex(afterIndex + 1);
      setEditText('');
    }, 100);
  };

  const handleApplyChanges = () => {
    onReorder(steps);
    if (onClose) onClose();
  };

  const handleCancel = () => {
    if (onClose) onClose();
  };

  // Hover details editing functions
  const handleEditHoverDetails = (index: number) => {
    const step = steps[index];
    setEditingHoverIndex(index);
    setHoverTitle(step.hoverDetails?.title || '');
    setHoverItems(step.hoverDetails?.items || ['']);
    setHoverCategory(step.hoverDetails?.category || '');
  };

  const handleSaveHoverDetails = () => {
    if (editingHoverIndex !== null) {
      const newSteps = [...steps];
      newSteps[editingHoverIndex] = {
        ...newSteps[editingHoverIndex],
        hoverDetails: {
          title: hoverTitle.trim(),
          items: hoverItems.filter(item => item.trim()),
          category: hoverCategory.trim() || undefined
        }
      };
      setSteps(newSteps);
      setEditingHoverIndex(null);
      setHoverTitle('');
      setHoverItems(['']);
      setHoverCategory('');
      setHasChanges(true);
    }
  };

  const handleCancelHoverEdit = () => {
    setEditingHoverIndex(null);
    setHoverTitle('');
    setHoverItems(['']);
    setHoverCategory('');
  };

  const handleAddHoverItem = () => {
    setHoverItems([...hoverItems, '']);
  };

  const handleRemoveHoverItem = (itemIndex: number) => {
    if (hoverItems.length > 1) {
      setHoverItems(hoverItems.filter((_, i) => i !== itemIndex));
    }
  };

  const handleUpdateHoverItem = (itemIndex: number, value: string) => {
    const newItems = [...hoverItems];
    newItems[itemIndex] = value;
    setHoverItems(newItems);
  };

  const getStepTypeColor = (type: string = 'process') => {
    switch (type) {
      case 'start': return 'bg-green-100 dark:bg-green-900 border-green-500';
      case 'end': return 'bg-red-100 dark:bg-red-900 border-red-500';
      case 'decision': return 'bg-yellow-100 dark:bg-yellow-900 border-yellow-500';
      case 'process':
      default: return 'bg-blue-100 dark:bg-blue-900 border-blue-500';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-accent-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mb-1">Reorder Workflow Steps</h3>
            <p className="text-white text-opacity-90 text-sm">
              Drag steps to reorder, or use the arrow buttons • {steps.length} steps total
            </p>
          </div>
          {hasChanges && (
            <div className="flex items-center gap-2 bg-white bg-opacity-20 px-3 py-1 rounded-full">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">Unsaved changes</span>
            </div>
          )}
        </div>
      </div>

      {/* Steps List */}
      <div className="p-6 max-h-[60vh] overflow-y-auto">
        <div className="space-y-2">
          {steps.map((step, index) => (
            <div key={step.id || index}>
              <div
                draggable={editingIndex !== index}
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`
                  border-2 rounded-lg p-4 transition-all
                  ${draggedIndex === index ? 'opacity-50 scale-95' : ''}
                  ${dragOverIndex === index ? 'border-primary-500 bg-primary-50 dark:bg-primary-900' : 'border-gray-200 dark:border-gray-700'}
                  ${editingIndex === index ? 'ring-2 ring-primary-500' : ''}
                  ${editingIndex === null ? 'hover:border-primary-300 cursor-move' : ''}
                `}
              >
                <div className="flex items-center gap-3">
                  
                  {/* Drag Handle */}
                  {editingIndex !== index && (
                    <div className="cursor-move text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      <GripVertical className="w-5 h-5" />
                    </div>
                  )}

                  {/* Step Number */}
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2
                    ${getStepTypeColor(step.type)}
                  `}>
                    {index + 1}
                  </div>

                  {/* Step Content */}
                  <div className="flex-1 min-w-0">
                    {editingIndex === index ? (
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveEdit();
                          if (e.key === 'Escape') handleCancelEdit();
                        }}
                        className="w-full px-3 py-2 border border-primary-500 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Enter step description..."
                        autoFocus
                      />
                    ) : (
                      <div
                        onClick={() => handleEdit(index)}
                        className="text-gray-900 dark:text-white cursor-pointer hover:text-primary-600 dark:hover:text-primary-400"
                      >
                        {step.text || step.name || 'Untitled step'}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1">
                    {editingIndex === index ? (
                      <>
                        <button
                          onClick={handleSaveEdit}
                          className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900 rounded transition-colors"
                          title="Save"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-colors"
                          title="Cancel"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditHoverDetails(index)}
                          className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 rounded transition-colors"
                          title="Edit hover details"
                        >
                          <Info className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleMoveUp(index)}
                          disabled={index === 0}
                          className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Move up"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleMoveDown(index)}
                          disabled={index === steps.length - 1}
                          className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Move down"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(index)}
                          className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Add Step Button (between steps) */}
              {editingIndex === null && (
                <div className="flex justify-center my-1">
                  <button
                    onClick={() => handleAddStep(index)}
                    className="p-1 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900 rounded-full transition-all group"
                    title="Add step after this"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {steps.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-4">No steps in this workflow</p>
            <button
              onClick={() => handleAddStep(-1)}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add First Step
            </button>
          </div>
        )}
      </div>

      {/* Footer with Action Buttons */}
      <div className="p-6 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {hasChanges ? (
              <span className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                <AlertCircle className="w-4 h-4" />
                You have unsaved changes
              </span>
            ) : (
              <span>Drag steps to reorder, click to edit</span>
            )}
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApplyChanges}
              disabled={!hasChanges}
              className="px-6 py-2 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500"
            >
              Apply Changes
            </button>
          </div>
        </div>
      </div>

      {/* Hover Details Editing Modal */}
      {editingHoverIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-1">Edit Hover Details</h3>
                  <p className="text-white text-opacity-90 text-sm">
                    Add details that will show when users hover over this step in the flowchart
                  </p>
                </div>
                <button
                  onClick={handleCancelHoverEdit}
                  className="text-white text-opacity-70 hover:text-opacity-100 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <div className="space-y-6">
                
                {/* Title Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tooltip Title
                  </label>
                  <input
                    type="text"
                    value={hoverTitle}
                    onChange={(e) => setHoverTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Add name to directory"
                  />
                </div>

                {/* Category Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category (Optional)
                  </label>
                  <input
                    type="text"
                    value={hoverCategory}
                    onChange={(e) => setHoverCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Contact Information"
                  />
                </div>

                {/* Items List */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Details to Show on Hover
                  </label>
                  <div className="space-y-2">
                    {hoverItems.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => handleUpdateHoverItem(itemIndex, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder={`Detail ${itemIndex + 1}`}
                        />
                        {hoverItems.length > 1 && (
                          <button
                            onClick={() => handleRemoveHoverItem(itemIndex)}
                            className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-colors"
                            title="Remove this item"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={handleAddHoverItem}
                      className="w-full py-2 px-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Another Detail
                    </button>
                  </div>
                </div>

                {/* Preview */}
                {hoverTitle && hoverItems.some(item => item.trim()) && (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Preview:</h4>
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                      <div className="font-bold text-blue-600 mb-1">{hoverTitle}</div>
                      {hoverCategory && (
                        <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide">{hoverCategory}</div>
                      )}
                      <ul className="text-sm text-gray-700 dark:text-gray-300">
                        {hoverItems.filter(item => item.trim()).map((item, index) => (
                          <li key={index} className="mb-1">• {item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  These details will appear when users hover over the step in the flowchart
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleCancelHoverEdit}
                    className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveHoverDetails}
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all"
                  >
                    Save Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowReorderingView;

