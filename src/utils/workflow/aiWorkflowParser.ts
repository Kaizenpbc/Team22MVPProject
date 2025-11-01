/**
 * AI-Powered Workflow Parser
 * Uses OpenAI to intelligently parse SOP text into structured workflow steps
 */

import { WorkflowStep } from './workflowEditor';

/**
 * Extract hover details from SOP text for AI-parsed steps
 */
const extractHoverDetailsFromSOP = async (sopText: string, steps: WorkflowStep[]): Promise<WorkflowStep[]> => {
  const lines = sopText.split('\n').filter(line => line.trim());
  const stepsWithDetails = [...steps];
  
  let currentStepIndex = -1;
  let currentStepDetails: string[] = [];
  
  lines.forEach((line) => {
    // Check if this line matches any of our AI-parsed steps
    const matchingStepIndex = steps.findIndex(step => 
      line.toLowerCase().includes(step.text.toLowerCase()) ||
      step.text.toLowerCase().includes(line.toLowerCase())
    );
    
    if (matchingStepIndex >= 0) {
      // Save previous step with its details
      if (currentStepIndex >= 0 && currentStepDetails.length > 0) {
        stepsWithDetails[currentStepIndex].hoverDetails = {
          title: stepsWithDetails[currentStepIndex].text,
          category: getStepCategory(stepsWithDetails[currentStepIndex].text),
          items: currentStepDetails
        };
      }
      
      currentStepIndex = matchingStepIndex;
      currentStepDetails = [];
    } else {
      // Check for bullet points or sub-items under the current step
      const bulletMatch = line.match(/^\s*[•\-\*]\s*(.+)$/);
      const subItemMatch = line.match(/^\s*o\s*(.+)$/);
      
      if ((bulletMatch || subItemMatch) && currentStepIndex >= 0) {
        const detailText = (bulletMatch?.[1] || subItemMatch?.[1] || '').trim();
        if (detailText) {
          currentStepDetails.push(detailText);
        }
      }
    }
  });
  
  // Save the last step's details
  if (currentStepIndex >= 0 && currentStepDetails.length > 0) {
    stepsWithDetails[currentStepIndex].hoverDetails = {
      title: stepsWithDetails[currentStepIndex].text,
      category: getStepCategory(stepsWithDetails[currentStepIndex].text),
      items: currentStepDetails
    };
  }
  
  return stepsWithDetails;
};

/**
 * Determine step category based on step text
 */
const getStepCategory = (stepText: string): string => {
  const text = stepText.toLowerCase();
  
  if (text.includes('qualification') || text.includes('review') || text.includes('assess')) {
    return 'Assessment';
  } else if (text.includes('email') || text.includes('send') || text.includes('notify')) {
    return 'Communication';
  } else if (text.includes('create') || text.includes('setup') || text.includes('configure')) {
    return 'System Setup';
  } else if (text.includes('verify') || text.includes('check') || text.includes('validate')) {
    return 'Verification';
  } else if (text.includes('decision') || text.includes('if') || text.includes('qualify')) {
    return 'Decision Point';
  } else {
    return 'Process';
  }
};

interface AIParseResponse {
  steps: WorkflowStep[];
  confidence: number;
  suggestions: string[];
}

/**
 * Parse SOP text using OpenAI for intelligent step extraction
 */
export const parseWithAI = async (sopText: string): Promise<AIParseResponse> => {
  console.log('🤖 Using OpenAI proxy to avoid CORS issues...');

  try {
    const prompt = `You are an expert at analyzing Standard Operating Procedures (SOPs) and converting them into structured workflow steps.

Analyze the following SOP text and extract workflow steps. For each step:
1. Extract the main action or task
2. Classify the type as: "start", "end", "decision", or "process"
3. Number the steps sequentially
4. Detect implicit decision points where binary choices exist (Yes/No branches)

SOP Text:
"""
${sopText}
"""

Return ONLY valid JSON in this exact format:
{
  "steps": [
    {
      "text": "Clear description of the step",
      "type": "process|decision|start|end",
      "number": 1
    }
  ],
  "confidence": 0.95,
  "suggestions": ["Any recommendations for improving the workflow"]
}

Rules:
- Extract ALL steps, even if not explicitly numbered
- KEEP DUPLICATE STEPS - Do not remove or merge steps that appear multiple times
- Preserve every occurrence of similar or identical steps (users will decide later if they're true duplicates)
- Detect implicit steps (e.g., "After checking, notify manager" = two steps)
- Use "decision" type for conditional steps (if/else, check, verify)
- Use "decision" type for intimate workflow steps that represent binary choices (e.g., "Kiss her next" = decision to continue or stop)
- Use "decision" type for any step where there's an implicit Yes/No choice
- Use "start" for beginning steps, "end" for final steps
- Use "process" for regular action steps
- Provide confidence score (0-1) for extraction quality
- Suggest improvements if workflow has issues (but do not mention duplicates - users have a separate tool for that)`;

    // Use OpenAI proxy to avoid CORS issues
    const { callOpenAIProxy } = await import('../../services/openaiProxy');
    
    const response = await callOpenAIProxy({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert workflow analyst. Return only valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000,
    });

    // Response is already parsed from proxy
    const aiResponse = JSON.parse(response.choices[0].message.content);

    // Add IDs to steps
    const stepsWithIds: WorkflowStep[] = aiResponse.steps.map((step: any, index: number) => ({
      id: `ai-step-${index + 1}`,
      text: step.text,
      type: step.type || 'process',
      number: step.number || index + 1,
      name: step.text
    }));

    // Extract hover details from original SOP text for AI-parsed steps
    const stepsWithHoverDetails = await extractHoverDetailsFromSOP(sopText, stepsWithIds);

    return {
      steps: stepsWithHoverDetails,
      confidence: aiResponse.confidence || 0.8,
      suggestions: aiResponse.suggestions || []
    };

  } catch (error) {
    console.error('AI parsing error:', error);
    throw error;
  }
};

/**
 * Parse with AI and fallback to basic parser if AI fails
 */
export const parseWithAIFallback = async (sopText: string): Promise<WorkflowStep[]> => {
  try {
    const result = await parseWithAI(sopText);
    console.log(`✨ AI parsed ${result.steps.length} steps with ${(result.confidence * 100).toFixed(0)}% confidence`);
    if (result.suggestions.length > 0) {
      console.log('💡 Suggestions:', result.suggestions);
    }
    return result.steps;
  } catch (error) {
    console.warn('AI parsing failed, falling back to basic parser:', error);
    const { parseSteps } = await import('./workflowEditor');
    return parseSteps(sopText);
  }
};

