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
  
  return {
    needsReordering: suggestions.length > 0,
    dependencies,
    suggestions
  };
};


