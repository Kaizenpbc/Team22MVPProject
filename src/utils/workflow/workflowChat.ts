/**
 * Workflow Chat Utility - AI-powered chat assistant for workflow optimization
 * Can EDIT workflows using natural language commands
 */

import { WorkflowStep } from './workflowEditor';
import { ComprehensiveAnalysis } from './comprehensiveWorkflowAnalysis';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  message: string;
  timestamp: Date;
}

export interface WorkflowEdit {
  type: 'add' | 'remove' | 'move' | 'edit' | 'merge';
  command: string;
  stepNumber?: number;
  stepNumber2?: number;
  newText?: string;
  position?: number;
}

/**
 * Build context from workflow and analysis
 */
export const buildWorkflowContext = (
  steps: WorkflowStep[],
  analysis: ComprehensiveAnalysis | null
): string => {
  const context: string[] = [];
  
  context.push("=== CURRENT WORKFLOW ===");
  context.push(`Total Steps: ${steps.length}`);
  
  if (analysis?.efficiency) {
    context.push(`\nEfficiency Score: ${analysis.efficiency.overallScore}%`);
    context.push(`- Complexity: ${analysis.efficiency.factors.complexity}%`);
    context.push(`- Time: ${analysis.efficiency.factors.time}%`);
    context.push(`- Quality: ${analysis.efficiency.factors.quality}%`);
  }
  
  if (analysis?.duplicates && analysis.duplicates.length > 0) {
    context.push(`\nDuplicates Found: ${analysis.duplicates.length}`);
  }
  
  if (analysis?.gaps?.internalGaps.summary.total > 0) {
    context.push(`\nGaps Detected: ${analysis.gaps.internalGaps.summary.total}`);
    context.push(`- Critical: ${analysis.gaps.internalGaps.summary.critical}`);
  }
  
  if (analysis?.risks) {
    context.push(`\nHigh Risk Steps: ${analysis.risks.highRiskSteps.length}`);
  }
  
  return context.join('\n');
};

/**
 * Get system prompt for AI chat
 */
export const getSystemPrompt = (): string => {
  return `You are a workflow optimization assistant. You can EDIT workflows using these EXACT commands:

EDIT COMMANDS (use exact format):
1. Add 'Step text here' after step 3
2. Remove step 5
3. Move step 3 to step 7
4. Edit step 2 to 'New step text'
5. Merge steps 4 and 5

When user asks to edit workflow:
- Acknowledge request
- State what you'll do
- Use EXACT command phrase
- Ask for confirmation

Example:
User: "Add a verification step after step 2"
You: "I'll add a verification step for you. Add 'Verify data accuracy' after step 2. Shall I apply this?"

Keep responses concise (under 200 words).
Only discuss workflow optimization topics.`;
};

/**
 * Call OpenAI for chat response
 */
export const getChatResponse = async (
  userMessage: string,
  workflowContext: string,
  conversationHistory: ChatMessage[],
  apiKey: string
): Promise<string> => {
  if (!apiKey) {
    throw new Error('OpenAI API key not configured');
  }

  const messages = [
    { role: 'system', content: getSystemPrompt() },
    { role: 'system', content: `Workflow context:\n${workflowContext}` },
    ...conversationHistory.slice(-5).map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.message
    })),
    { role: 'user', content: userMessage }
  ];

  try {
    // Use OpenAI proxy to avoid CORS issues
    const { callOpenAIProxy } = await import('../../services/openaiProxy');
    
    const response = await callOpenAIProxy({
      model: 'gpt-4o-mini',
      messages: messages as any,
      temperature: 0.7,
      max_tokens: 300
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Chat API error:', error);
    throw error;
  }
};

/**
 * Parse workflow edit commands from AI response
 */
export const parseEditCommand = (aiResponse: string): WorkflowEdit | null => {
  const text = aiResponse.toLowerCase();
  
  // Add step: "Add 'text' after step 3"
  const addMatch = text.match(/add ['"](.+?)['"] after step (\d+)/);
  if (addMatch) {
    return {
      type: 'add',
      command: aiResponse,
      newText: addMatch[1],
      position: parseInt(addMatch[2])
    };
  }
  
  // Remove step: "Remove step 5"
  const removeMatch = text.match(/remove step (\d+)/);
  if (removeMatch) {
    return {
      type: 'remove',
      command: aiResponse,
      stepNumber: parseInt(removeMatch[1])
    };
  }
  
  // Move step: "Move step 3 to step 7"
  const moveMatch = text.match(/move step (\d+) to step (\d+)/);
  if (moveMatch) {
    return {
      type: 'move',
      command: aiResponse,
      stepNumber: parseInt(moveMatch[1]),
      position: parseInt(moveMatch[2])
    };
  }
  
  // Edit step: "Edit step 2 to 'new text'"
  const editMatch = text.match(/edit step (\d+) to ['"](.+?)['"]/);
  if (editMatch) {
    return {
      type: 'edit',
      command: aiResponse,
      stepNumber: parseInt(editMatch[1]),
      newText: editMatch[2]
    };
  }
  
  // Merge steps: "Merge steps 4 and 5"
  const mergeMatch = text.match(/merge steps (\d+) and (\d+)/);
  if (mergeMatch) {
    return {
      type: 'merge',
      command: aiResponse,
      stepNumber: parseInt(mergeMatch[1]),
      stepNumber2: parseInt(mergeMatch[2])
    };
  }
  
  return null;
};

/**
 * Apply workflow edit
 */
export const applyWorkflowEdit = (
  steps: WorkflowStep[],
  edit: WorkflowEdit
): WorkflowStep[] => {
  const newSteps = [...steps];
  
  switch (edit.type) {
    case 'add':
      if (edit.position && edit.newText) {
        const newStep: WorkflowStep = {
          id: `step-${Date.now()}`,
          text: edit.newText,
          type: 'process',
          name: edit.newText
        };
        newSteps.splice(edit.position, 0, newStep);
      }
      break;
      
    case 'remove':
      if (edit.stepNumber && edit.stepNumber > 0 && edit.stepNumber <= steps.length) {
        newSteps.splice(edit.stepNumber - 1, 1);
      }
      break;
      
    case 'move':
      if (edit.stepNumber && edit.position) {
        const [movedStep] = newSteps.splice(edit.stepNumber - 1, 1);
        newSteps.splice(edit.position - 1, 0, movedStep);
      }
      break;
      
    case 'edit':
      if (edit.stepNumber && edit.newText) {
        newSteps[edit.stepNumber - 1] = {
          ...newSteps[edit.stepNumber - 1],
          text: edit.newText,
          name: edit.newText
        };
      }
      break;
      
    case 'merge':
      if (edit.stepNumber && edit.stepNumber2) {
        const mergedText = `${newSteps[edit.stepNumber - 1].text} AND ${newSteps[edit.stepNumber2 - 1].text}`;
        newSteps[edit.stepNumber - 1] = {
          ...newSteps[edit.stepNumber - 1],
          text: mergedText,
          name: mergedText
        };
        newSteps.splice(edit.stepNumber2 - 1, 1);
      }
      break;
  }
  
  return newSteps;
};

