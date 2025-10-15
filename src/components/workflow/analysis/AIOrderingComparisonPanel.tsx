import React, { useState } from 'react';
import { GripVertical, ChevronDown, Trash2, Check, Bot } from 'lucide-react';
import { WorkflowStep } from '../../../utils/workflow/workflowEditor';

interface OrderingIssue {
  originalSteps: WorkflowStep[];
  suggestedSteps: WorkflowStep[];
  reasoning: string;
  confidence: number;
}

interface AIOrderingComparisonPanelProps {
  orderingIssue: OrderingIssue;
  onApplySuggestedOrder: (newSteps: WorkflowStep[]) => void;
  onKeepOriginal: () => void;
}

/**
 * AI Ordering Comparison Panel
 * Shows side-by-side comparison of original vs AI suggested order with semantic reasoning
 */
const AIOrderingComparisonPanel: React.FC<AIOrderingComparisonPanelProps> = ({
  orderingIssue,
  onApplySuggestedOrder,
  onKeepOriginal
}) => {
  console.log('🧡 AI Ordering Comparison Panel rendering with:', orderingIssue);
  
  const [isExpanded, setIsExpanded] = useState(true);
  const [suggestedSteps, setSuggestedSteps] = useState<WorkflowStep[]>(orderingIssue.suggestedSteps);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    console.log('🖱️ Drag start:', index);
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    console.log('🖱️ Drag over:', index);
    setDragOverIndex(index);
  };

  const handleDragEnd = () => {
    console.log('🖱️ Drag end:', { draggedIndex, dragOverIndex });
    if (draggedIndex !== null && dragOverIndex !== null && draggedIndex !== dragOverIndex) {
      const newSteps = [...suggestedSteps];
      const draggedStep = newSteps[draggedIndex];
      
      console.log('🔄 Reordering:', { from: draggedIndex, to: dragOverIndex, step: draggedStep.text });
      
      // Remove dragged item
      newSteps.splice(draggedIndex, 1);
      
      // Insert at new position
      newSteps.splice(dragOverIndex, 0, draggedStep);
      
      setSuggestedSteps(newSteps);
    }
    
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleRemoveStep = (index: number) => {
    const newSteps = suggestedSteps.filter((_, i) => i !== index);
    setSuggestedSteps(newSteps);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-100 text-green-800 border-green-300';
    if (confidence >= 0.6) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-orange-100 text-orange-800 border-orange-300';
  };

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 0.8) return 'High Confidence';
    if (confidence >= 0.6) return 'Medium Confidence';
    return 'Low Confidence';
  };

  return (
    <div className="bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-300 rounded-xl shadow-lg">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white p-4 rounded-t-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bot className="w-6 h-6" />
            <div>
              <h3 className="text-lg font-bold">🧠 AI Ordering Analysis</h3>
              <p className="text-sm text-orange-100">
                Semantic reasoning detected logical sequence issues
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-orange-100 hover:text-white transition-colors"
          >
            <ChevronDown className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="p-6">
          
          {/* AI Analysis Banner */}
          <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Bot className="w-5 h-5 text-yellow-700 mt-0.5" />
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-yellow-800">AI Analysis:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold border ${getConfidenceColor(orderingIssue.confidence)}`}>
                    {getConfidenceText(orderingIssue.confidence)} ({Math.round(orderingIssue.confidence * 100)}%)
                  </span>
                </div>
                <p className="text-yellow-800 text-sm leading-relaxed">
                  {orderingIssue.reasoning}
                </p>
              </div>
            </div>
          </div>

          {/* Side-by-Side Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Original Order */}
            <div className="bg-white border-2 border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-red-600 text-2xl">❌</span>
                <h4 className="text-lg font-bold text-red-800">ORIGINAL ORDER (FROM DOCUMENT)</h4>
              </div>
              
              <div className="space-y-2">
                {orderingIssue.originalSteps.map((step, index) => (
                  <div
                    key={step.id || index}
                    className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-3"
                  >
                    <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <span className="text-red-800 font-medium">{step.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Suggested Order */}
            <div className="bg-white border-2 border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-green-600 text-2xl">✅</span>
                <h4 className="text-lg font-bold text-green-800">AI SUGGESTED ORDER (DRAG TO CUSTOMIZE)</h4>
              </div>
              
              <div className="space-y-2">
                {suggestedSteps.map((step, index) => (
                  <div
                    key={step.id || index}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`
                      bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-3 cursor-move
                      transition-all hover:bg-green-100
                      ${draggedIndex === index ? 'opacity-50 scale-95' : ''}
                      ${dragOverIndex === index ? 'border-green-400 bg-green-100' : ''}
                    `}
                  >
                    {/* Drag Handle */}
                    <GripVertical className="w-4 h-4 text-green-600" />
                    
                    {/* Step Number */}
                    <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    
                    {/* Step Text */}
                    <span className="text-green-800 font-medium flex-1">{step.text}</span>
                    
                    {/* Checkmark */}
                    <Check className="w-4 h-4 text-green-600" />
                    
                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveStep(index)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-100 p-1 rounded transition-colors"
                      title="Remove step"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Connecting Arrow */}
          <div className="flex justify-center my-6">
            <div className="flex items-center gap-2">
              <div className="w-16 h-1 bg-orange-400"></div>
              <div className="text-orange-600 text-2xl">→</div>
              <div className="w-16 h-1 bg-orange-400"></div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-orange-200">
            <button
              onClick={onKeepOriginal}
              className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium"
            >
              Keep Original Order
            </button>
            
            <div className="text-sm text-gray-600">
              <span className="font-medium">{suggestedSteps.length}</span> steps in suggested order
            </div>
            
            <button
              onClick={() => onApplySuggestedOrder(suggestedSteps)}
              className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg transition-colors font-medium"
            >
              Apply Suggested Order
            </button>
          </div>

          {/* Help Text */}
          <div className="mt-4 p-3 bg-orange-100 border border-orange-200 rounded-lg">
            <p className="text-orange-800 text-sm">
              💡 <strong>Tip:</strong> The AI analyzed your workflow steps and suggested a more logical sequence. 
              You can drag steps in the right panel to customize the suggested order before applying it.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIOrderingComparisonPanel;
