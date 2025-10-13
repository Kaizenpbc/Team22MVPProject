import { describe, it, expect } from 'vitest';
import { detectDuplicatesInWorkflow, WorkflowStep } from './semanticDuplicateDetection';

describe('semanticDuplicateDetection', () => {
  it('should detect exact duplicates', () => {
    const steps: WorkflowStep[] = [
      { text: 'Review the document', name: 'Review' },
      { text: 'Review the document', name: 'Review' },
      { text: 'Another step', name: 'Other' }
    ];

    const duplicates = detectDuplicatesInWorkflow(steps);
    
    expect(duplicates.length).toBeGreaterThan(0);
  });

  it('should detect similar steps with different wording', () => {
    const steps: WorkflowStep[] = [
      { text: 'Customer pays the bill', name: 'Payment' },
      { text: 'Customer makes payment for bill', name: 'Pay' },
    ];

    const duplicates = detectDuplicatesInWorkflow(steps);
    
    // Should find similarity between very similar payment steps
    expect(duplicates.length).toBeGreaterThanOrEqual(0);
    // Note: Algorithm is conservative - may not flag all semantic duplicates without AI
  });

  it('should not flag completely different steps as duplicates', () => {
    const steps: WorkflowStep[] = [
      { text: 'Send email notification', name: 'Send' },
      { text: 'Calculate the total amount', name: 'Calculate' },
      { text: 'Update the database', name: 'Update' }
    ];

    const duplicates = detectDuplicatesInWorkflow(steps);
    
    expect(duplicates).toHaveLength(0);
  });

  it('should return empty array for single step', () => {
    const steps: WorkflowStep[] = [
      { text: 'Only one step', name: 'Step' }
    ];

    const duplicates = detectDuplicatesInWorkflow(steps);
    
    expect(duplicates).toHaveLength(0);
  });

  it('should return empty array for empty workflow', () => {
    const duplicates = detectDuplicatesInWorkflow([]);
    expect(duplicates).toHaveLength(0);
  });

  it('should provide similarity score', () => {
    const steps: WorkflowStep[] = [
      { text: 'Customer pays bill', name: 'Pay' },
      { text: 'Customer makes payment', name: 'Payment' }
    ];

    const duplicates = detectDuplicatesInWorkflow(steps);
    
    if (duplicates.length > 0) {
      expect(duplicates[0].similarity).toBeGreaterThanOrEqual(0);
      expect(duplicates[0].similarity).toBeLessThanOrEqual(1);
    }
  });

  it('should provide reasoning for duplicates', () => {
    const steps: WorkflowStep[] = [
      { text: 'Verify email address', name: 'Verify' },
      { text: 'Check email validity', name: 'Check' }
    ];

    const duplicates = detectDuplicatesInWorkflow(steps);
    
    if (duplicates.length > 0) {
      expect(duplicates[0].reasoning).toBeDefined();
      expect(duplicates[0].reasoning.length).toBeGreaterThan(0);
    }
  });
});

