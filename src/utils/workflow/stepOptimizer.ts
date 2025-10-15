import { WorkflowStep } from './workflowEditor';

/**
 * Analyze a workflow step to determine if it should be split
 */
export interface StepAnalysis {
  step: WorkflowStep;
  shouldSplit: boolean;
  reason: string;
  complexity: 'low' | 'medium' | 'high';
  suggestedSplits: WorkflowStep[];
}

/**
 * Analyze all steps in a workflow to identify which ones could be split
 */
export const analyzeWorkflowSteps = (workflow: WorkflowStep[]): StepAnalysis[] => {
  return workflow.map(step => {
    const text = step.text;
    const shouldSplit = shouldSplitStep(text);
    
    return {
      step,
      shouldSplit,
      reason: getSplitReason(text),
      complexity: getComplexity(text),
      suggestedSplits: shouldSplit ? generateSuggestedSplits(step) : []
    };
  });
};

/**
 * Determine if a step should be split based on various criteria
 */
const shouldSplitStep = (text: string): boolean => {
  // Check for multiple criteria that indicate splitting is beneficial
  
  // 1. Length check (too long)
  if (text.length > 80) return true;
  
  // 2. Multiple actions (and, then, after, followed by)
  const multiActionPatterns = [
    /\band\s+then\b/i,
    /\bafter\s+\w+,?\s+\w+/i,
    /\bfollowed\s+by\b/i,
    /\bwhen\s+\w+\s+happens,?\s+\w+/i,
    /\bif\s+\w+,?\s+\w+/i,
    /\bwhile\s+\w+,?\s+\w+/i
  ];
  
  if (multiActionPatterns.some(pattern => pattern.test(text))) return true;
  
  // 3. Multiple actors (different people/roles doing different things)
  const actorPatterns = [
    /\b(customer|client|user)\b.*\b(staff|employee|manager|admin)\b/i,
    /\b(system|automated)\b.*\b(manual|human|staff)\b/i
  ];
  
  if (actorPatterns.some(pattern => pattern.test(text))) return true;
  
  // 4. Complex conditional logic
  const conditionalPatterns = [
    /\bif\s+\w+\s+then\s+\w+\s+else\s+\w+/i,
    /\bcheck\s+\w+\s+and\s+\w+/i,
    /\bverify\s+\w+\s+before\s+\w+/i
  ];
  
  if (conditionalPatterns.some(pattern => pattern.test(text))) return true;
  
  return false;
};

/**
 * Get the reason why a step should be split
 */
const getSplitReason = (text: string): string => {
  if (text.length > 80) return 'Step is too long for clear visualization';
  
  if (/\band\s+then\b/i.test(text)) return 'Contains multiple sequential actions';
  if (/\bafter\s+\w+,?\s+\w+/i.test(text)) return 'Contains temporal dependencies';
  if (/\bwhen\s+\w+\s+happens,?\s+\w+/i.test(text)) return 'Contains trigger-action pattern';
  if (/\bif\s+\w+,?\s+\w+/i.test(text)) return 'Contains conditional logic';
  
  if (/\b(customer|client|user)\b.*\b(staff|employee|manager|admin)\b/i.test(text)) {
    return 'Contains multiple actors with different roles';
  }
  
  return 'Complex step could be simplified';
};

/**
 * Determine complexity level of a step
 */
const getComplexity = (text: string): 'low' | 'medium' | 'high' => {
  const complexityIndicators = [
    text.length > 100, // Very long
    (text.match(/\band\b/g) || []).length > 2, // Many conjunctions
    (text.match(/\bif\b|\bwhen\b|\bwhile\b|\bafter\b/g) || []).length > 1, // Multiple conditions
    /\b(verify|check|validate|confirm)\b.*\b(and|then|after)\b/i.test(text) // Complex verification
  ];
  
  const score = complexityIndicators.filter(Boolean).length;
  
  if (score >= 3) return 'high';
  if (score >= 1) return 'medium';
  return 'low';
};

/**
 * Generate suggested splits for a step using AI-like logic
 */
const generateSuggestedSplits = (step: WorkflowStep): WorkflowStep[] => {
  const text = step.text;
  
  // Pattern-based splitting (could be enhanced with AI later)
  const splits: WorkflowStep[] = [];
  
  // Handle "when X happens, do Y" pattern
  const whenPattern = /^(.+?)\s+when\s+(.+)$/i;
  const whenMatch = text.match(whenPattern);
  if (whenMatch) {
    splits.push({
      ...step,
      text: whenMatch[2].trim(),
      number: step.number
    });
    splits.push({
      ...step,
      text: whenMatch[1].trim(),
      number: step.number + 0.5
    });
    return splits;
  }
  
  // Handle "if X, then Y" pattern
  const ifPattern = /^(.+?)\s+if\s+(.+)$/i;
  const ifMatch = text.match(ifPattern);
  if (ifMatch) {
    splits.push({
      ...step,
      text: ifMatch[2].trim(),
      type: 'decision',
      number: step.number
    });
    splits.push({
      ...step,
      text: ifMatch[1].trim(),
      number: step.number + 0.5
    });
    return splits;
  }
  
  // Handle "X and then Y" pattern
  const andThenPattern = /^(.+?)\s+and\s+then\s+(.+)$/i;
  const andThenMatch = text.match(andThenPattern);
  if (andThenMatch) {
    splits.push({
      ...step,
      text: andThenMatch[1].trim(),
      number: step.number
    });
    splits.push({
      ...step,
      text: andThenMatch[2].trim(),
      number: step.number + 0.5
    });
    return splits;
  }
  
  // Default: split by sentence if very long
  if (text.length > 100) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    if (sentences.length > 1) {
      return sentences.map((sentence, index) => ({
        ...step,
        text: sentence.trim(),
        number: step.number + (index * 0.5)
      }));
    }
  }
  
  // Fallback: split by comma if multiple clauses
  const clauses = text.split(',').filter(c => c.trim().length > 0);
  if (clauses.length > 1 && clauses.length <= 3) {
    return clauses.map((clause, index) => ({
      ...step,
      text: clause.trim(),
      number: step.number + (index * 0.5)
    }));
  }
  
  // If no good split found, return empty array
  return [];
};

/**
 * Apply step splits to a workflow
 */
export const applyStepSplits = (
  workflow: WorkflowStep[], 
  splitsToApply: { [stepId: string]: WorkflowStep[] }
): WorkflowStep[] => {
  const newWorkflow: WorkflowStep[] = [];
  
  workflow.forEach((step, index) => {
    if (splitsToApply[step.id]) {
      // Add the split steps
      newWorkflow.push(...splitsToApply[step.id]);
    } else {
      // Keep original step, but update number
      newWorkflow.push({
        ...step,
        number: newWorkflow.length + 1
      });
    }
  });
  
  // Renumber all steps sequentially
  return newWorkflow.map((step, index) => ({
    ...step,
    number: index + 1
  }));
};
