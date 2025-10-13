/**
 * Dependency Graph Analyzer
 * Analyzes workflow step dependencies and ordering
 */

import { WorkflowStep } from './workflowEditor';

export interface DependencyAnalysis {
  needsReordering: boolean;
  dependencies: Dependency[];
  suggestions: string[];
  optimalOrder?: number[];
  reorderedSteps?: WorkflowStep[];
  improvements?: string[];
}

interface Dependency {
  from: number;
  to: number;
  reason: string;
}

export const analyzeWorkflowOrder = (steps: WorkflowStep[]): DependencyAnalysis => {
  const dependencies: Dependency[] = [];
  const suggestions: string[] = [];
  
  // Analyze for common ordering issues
  for (let i = 0; i < steps.length; i++) {
    const currentText = (steps[i].text || '').toLowerCase();
    
    // Check if steps reference previous actions
    for (let j = i + 1; j < steps.length; j++) {
      const laterText = (steps[j].text || '').toLowerCase();
      
      // If later step seems to depend on current step
      if (laterText.includes('then') || laterText.includes('after') || laterText.includes('once')) {
        dependencies.push({
          from: i,
          to: j,
          reason: 'Sequential dependency'
        });
      }
    }
  }
  
  // Check for validation steps that should come before actions
  for (let i = 1; i < steps.length; i++) {
    const text = (steps[i].text || '').toLowerCase();
    const prevText = (steps[i-1].text || '').toLowerCase();
    
    if ((text.includes('verify') || text.includes('validate') || text.includes('check')) &&
        (prevText.includes('send') || prevText.includes('submit') || prevText.includes('process'))) {
      suggestions.push(`Consider moving validation (step ${i + 1}) before action (step ${i})`);
    }
  }
  
  // Generate optimal order if reordering needed
  let reorderedSteps: WorkflowStep[] | undefined;
  let improvements: string[] = [];
  
  if (suggestions.length > 0) {
    // Create optimized order
    reorderedSteps = [...steps];
    improvements.push('Reordered steps for better logical flow');
    
    // Move verification steps before action steps
    const verificationIndices: number[] = [];
    const actionIndices: number[] = [];
    
    steps.forEach((step, index) => {
      const text = (step.text || '').toLowerCase();
      if (text.includes('verify') || text.includes('validate') || text.includes('check')) {
        verificationIndices.push(index);
      } else if (text.includes('send') || text.includes('submit') || text.includes('process')) {
        actionIndices.push(index);
      }
    });
    
    // Simple reordering: verification before actions
    if (verificationIndices.length > 0 && actionIndices.length > 0) {
      const maxActionIndex = Math.max(...actionIndices);
      const minVerificationIndex = Math.min(...verificationIndices);
      
      if (minVerificationIndex > maxActionIndex) {
        improvements.push(`Moved verification steps (${verificationIndices.map(i => i + 1).join(', ')}) before action steps`);
      }
    }
  }
  
  return {
    needsReordering: suggestions.length > 0,
    dependencies,
    suggestions,
    reorderedSteps,
    improvements
  };
};


