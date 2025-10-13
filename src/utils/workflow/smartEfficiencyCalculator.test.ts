import { describe, it, expect } from 'vitest';
import { calculateWeightedEfficiency, WorkflowStep } from './smartEfficiencyCalculator';

describe('smartEfficiencyCalculator', () => {
  it('should return 0 score for empty workflow', () => {
    const result = calculateWeightedEfficiency([]);
    expect(result.overallScore).toBe(0);
    expect(result.breakdown).toHaveLength(0);
  });

  it('should calculate efficiency for simple workflow', () => {
    const steps: WorkflowStep[] = [
      { text: 'Start the process', type: 'start' },
      { text: 'Process the data', type: 'process' },
      { text: 'Complete the task', type: 'end' }
    ];

    const result = calculateWeightedEfficiency(steps);
    
    expect(result.overallScore).toBeGreaterThan(0);
    expect(result.overallScore).toBeLessThanOrEqual(100);
    expect(result.breakdown).toHaveLength(3);
  });

  it('should identify complex steps', () => {
    const steps: WorkflowStep[] = [
      { text: 'If the value is greater than 100 and the user is authenticated and has permission, then verify the transaction and check compliance', type: 'decision' }
    ];

    const result = calculateWeightedEfficiency(steps);
    
    expect(result.breakdown[0].complexity).toBeGreaterThan(0.5);
  });

  it('should calculate total estimated time', () => {
    const steps: WorkflowStep[] = [
      { text: 'Step 1', type: 'process' },
      { text: 'Step 2', type: 'process' },
      { text: 'Step 3', type: 'process' }
    ];

    const result = calculateWeightedEfficiency(steps);
    
    expect(result.totalEstimatedTime).toBeGreaterThan(0);
  });

  it('should provide recommendations for complex workflows', () => {
    const steps: WorkflowStep[] = [
      { text: 'If complex condition then do this and that and verify and check and validate', type: 'decision' },
      { text: 'Enter data manually and calculate and compute', type: 'process' },
      { text: 'Review and analyze for 30 minutes', type: 'process' }
    ];

    const result = calculateWeightedEfficiency(steps);
    
    expect(result.recommendations.length).toBeGreaterThan(0);
  });

  it('should have factors between 0 and 100', () => {
    const steps: WorkflowStep[] = [
      { text: 'Simple step', type: 'process' }
    ];

    const result = calculateWeightedEfficiency(steps);
    
    expect(result.factors.complexity).toBeGreaterThanOrEqual(0);
    expect(result.factors.complexity).toBeLessThanOrEqual(100);
    expect(result.factors.time).toBeGreaterThanOrEqual(0);
    expect(result.factors.time).toBeLessThanOrEqual(100);
    expect(result.factors.quality).toBeGreaterThanOrEqual(0);
    expect(result.factors.quality).toBeLessThanOrEqual(100);
    expect(result.factors.impact).toBeGreaterThanOrEqual(0);
    expect(result.factors.impact).toBeLessThanOrEqual(100);
  });

  it('should calculate higher impact for customer-facing steps', () => {
    const customerStep: WorkflowStep[] = [
      { text: 'Contact customer and provide service', type: 'process' }
    ];
    const internalStep: WorkflowStep[] = [
      { text: 'Update internal file', type: 'process' }
    ];

    const customerResult = calculateWeightedEfficiency(customerStep);
    const internalResult = calculateWeightedEfficiency(internalStep);
    
    expect(customerResult.breakdown[0].businessImpact).toBeGreaterThan(internalResult.breakdown[0].businessImpact);
  });

  it('should identify high-risk steps', () => {
    const steps: WorkflowStep[] = [
      { text: 'Manually enter payment transaction data', type: 'process' },
      { text: 'Simple step', type: 'process' }
    ];

    const result = calculateWeightedEfficiency(steps);
    
    expect(result.summary?.highRiskSteps.length).toBeGreaterThan(0);
  });
});

