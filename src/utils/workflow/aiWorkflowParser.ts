/**
 * AI-Powered Workflow Parser
 * Uses OpenAI to intelligently parse SOP text into structured workflow steps
 */

import { WorkflowStep } from './workflowEditor';

interface AIParseResponse {
  steps: WorkflowStep[];
  confidence: number;
  suggestions: string[];
}

/**
 * Parse SOP text using OpenAI for intelligent step extraction
 */
export const parseWithAI = async (sopText: string): Promise<AIParseResponse> => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OpenAI API key not found. Please add VITE_OPENAI_API_KEY to your .env file.');
  }

  try {
    const prompt = `You are an expert at analyzing Standard Operating Procedures (SOPs) and converting them into structured workflow steps.

Analyze the following SOP text and extract workflow steps. For each step:
1. Extract the main action or task
2. Classify the type as: "start", "end", "decision", or "process"
3. Number the steps sequentially

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
- Detect implicit steps (e.g., "After checking, notify manager" = two steps)
- Use "decision" type for conditional steps (if/else, check, verify)
- Use "start" for beginning steps, "end" for final steps
- Use "process" for regular action steps
- Provide confidence score (0-1) for extraction quality
- Suggest improvements if workflow has issues`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
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
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const aiResponse = JSON.parse(data.choices[0].message.content);

    // Add IDs to steps
    const stepsWithIds: WorkflowStep[] = aiResponse.steps.map((step: any, index: number) => ({
      id: `ai-step-${index + 1}`,
      text: step.text,
      type: step.type || 'process',
      number: step.number || index + 1,
      name: step.text
    }));

    return {
      steps: stepsWithIds,
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

