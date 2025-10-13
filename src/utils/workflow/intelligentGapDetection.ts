/**
 * Intelligent Gap Detection
 * Finds missing steps and suggests improvements
 */

import { WorkflowStep } from './workflowEditor';

export interface GapAnalysis {
  internalGaps: {
    missingSteps: GapSuggestion[];
    summary: {
      total: number;
      critical: number;
      important: number;
    };
  };
  industryPractices: string[];
}

interface GapSuggestion {
  position: number;
  suggestion: string;
  reason: string;
  priority: 'critical' | 'important' | 'optional';
}

export const detectInternalGaps = (steps: WorkflowStep[]): GapAnalysis['internalGaps'] => {
  const missingSteps: GapSuggestion[] = [];
  
  // Check for missing error handling
  const hasErrorHandling = steps.some(s => 
    (s.text || '').toLowerCase().includes('error') || 
    (s.text || '').toLowerCase().includes('fail')
  );
  
  if (!hasErrorHandling && steps.length > 3) {
    missingSteps.push({
      position: steps.length,
      suggestion: 'Add error handling step',
      reason: 'No error handling detected in workflow',
      priority: 'critical'
    });
  }
  
  // Check for missing validation
  const hasValidation = steps.some(s => 
    (s.text || '').toLowerCase().includes('verify') ||
    (s.text || '').toLowerCase().includes('validate') ||
    (s.text || '').toLowerCase().includes('check')
  );
  
  if (!hasValidation && steps.length > 2) {
    missingSteps.push({
      position: Math.floor(steps.length / 2),
      suggestion: 'Add validation step',
      reason: 'No validation detected in workflow',
      priority: 'important'
    });
  }
  
  // Check for notification/confirmation
  const hasNotification = steps.some(s => 
    (s.text || '').toLowerCase().includes('notify') ||
    (s.text || '').toLowerCase().includes('email') ||
    (s.text || '').toLowerCase().includes('confirm')
  );
  
  if (!hasNotification && steps.length > 4) {
    missingSteps.push({
      position: steps.length - 1,
      suggestion: 'Add confirmation/notification step',
      reason: 'No user notification detected',
      priority: 'important'
    });
  }
  
  const critical = missingSteps.filter(s => s.priority === 'critical').length;
  const important = missingSteps.filter(s => s.priority === 'important').length;
  
  return {
    missingSteps,
    summary: {
      total: missingSteps.length,
      critical,
      important
    }
  };
};

export const getIndustryBestPractices = (steps: WorkflowStep[]): string[] => {
  const practices: string[] = [];
  
  practices.push('Document all decision criteria clearly');
  practices.push('Add time estimates for each step');
  practices.push('Include escalation procedures');
  practices.push('Define success criteria');
  
  return practices;
};


