/**
 * Semantic Duplicate Detection - AI-Powered
 * Uses AI to detect duplicates based on MEANING, not just keywords
 */

import { WorkflowStep } from './workflowEditor';

interface SimilarityResult {
  similarity: number;
  reasoning: string;
  areDuplicates: boolean;
}

interface DuplicatePair {
  step1: WorkflowStep;
  step2: WorkflowStep;
  step1Index: number;
  step2Index: number;
  similarity: number;
  reasoning: string;
}

/**
 * Calculate semantic similarity using AI
 */
export const calculateSemanticSimilarity = async (
  step1: string,
  step2: string,
  apiKey: string | null
): Promise<SimilarityResult> => {
  if (!apiKey) {
    return fallbackKeywordSimilarity(step1, step2);
  }

  try {
    const prompt = `Compare these two workflow steps and determine if they are duplicates (same action/meaning).

Step 1: "${step1}"
Step 2: "${step2}"

Consider:
- Do they describe the SAME action, even with different words?
- Examples of duplicates:
  * "Customer pays bill" = "Customer makes payment" (same action)
  * "Verify email address" = "Check email validity" (same action)
  * "User logs in" = "User authenticates" (same action)

- Examples of NOT duplicates:
  * "Customer pays bill" ≠ "Customer receives invoice" (different actions)
  * "Check if urgent" ≠ "If urgent, call manager" (condition vs action)

Return ONLY valid JSON:
{
  "areDuplicates": true or false,
  "similarity": 0.0 to 1.0,
  "reasoning": "Brief explanation"
}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are an expert at comparing business process steps. Return only valid JSON.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 150
      })
    });

    if (!response.ok) {
      console.error('AI similarity check failed, using fallback');
      return fallbackKeywordSimilarity(step1, step2);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content.trim();
    const result = JSON.parse(aiResponse);
    
    return {
      similarity: result.similarity || 0,
      reasoning: result.reasoning || '',
      areDuplicates: result.areDuplicates || false
    };
    
  } catch (error) {
    console.error('Error in semantic similarity:', error);
    return fallbackKeywordSimilarity(step1, step2);
  }
};

/**
 * Fallback keyword-based similarity (when AI not available)
 */
const fallbackKeywordSimilarity = (step1: string, step2: string): SimilarityResult => {
  const keywords1 = extractKeywords(step1);
  const keywords2 = extractKeywords(step2);
  const common = keywords1.filter(k => keywords2.includes(k));
  
  const similarity = common.length / Math.max(keywords1.length, keywords2.length);
  
  return {
    similarity,
    reasoning: `Keyword match: ${common.length}/${Math.max(keywords1.length, keywords2.length)} common keywords`,
    areDuplicates: similarity > 0.7
  };
};

/**
 * Extract keywords from text
 */
const extractKeywords = (text: string): string[] => {
  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now']);
  
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word));
};

/**
 * Smart detect duplicates using AI
 */
export const smartDetectDuplicates = async (
  steps: WorkflowStep[],
  apiKey: string | null,
  threshold: number = 0.75
): Promise<DuplicatePair[]> => {
  const duplicates: DuplicatePair[] = [];
  
  // If no API key, use fallback detection
  if (!apiKey) {
    return detectDuplicatesInWorkflow(steps);
  }
  
  for (let i = 0; i < steps.length; i++) {
    for (let j = i + 1; j < steps.length; j++) {
      const result = await calculateSemanticSimilarity(
        steps[i].text,
        steps[j].text,
        apiKey
      );
      
      if (result.similarity >= threshold || result.areDuplicates) {
        duplicates.push({
          step1: steps[i],
          step2: steps[j],
          step1Index: i,
          step2Index: j,
          similarity: result.similarity,
          reasoning: result.reasoning
        });
      }
    }
  }
  
  return duplicates;
};

/**
 * Basic duplicate detection (non-AI fallback)
 */
export const detectDuplicatesInWorkflow = (steps: WorkflowStep[]): DuplicatePair[] => {
  const duplicates: DuplicatePair[] = [];
  
  for (let i = 0; i < steps.length; i++) {
    for (let j = i + 1; j < steps.length; j++) {
      const result = fallbackKeywordSimilarity(steps[i].text, steps[j].text);
      
      if (result.areDuplicates) {
        duplicates.push({
          step1: steps[i],
          step2: steps[j],
          step1Index: i,
          step2Index: j,
          similarity: result.similarity,
          reasoning: result.reasoning
        });
      }
    }
  }
  
  return duplicates;
};

