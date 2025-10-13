/**
 * Risk Matrix Calculator
 * Identifies and scores workflow risks
 */

import { WorkflowStep } from './workflowEditor';

export interface RiskAnalysis {
  totalRiskScore: number;
  highRiskSteps: RiskStep[];
  mediumRiskSteps: RiskStep[];
  lowRiskSteps: RiskStep[];
  recommendations: string[];
}

interface RiskStep {
  step: string;
  index: number;
  probability: number;
  impact: number;
  riskScore: number;
  category: string;
}

const calculateRiskProbability = (step: WorkflowStep): number => {
  const text = (step.text || '').toLowerCase();
  let probability = 0.2; // Base probability
  
  // Manual steps = higher probability of issues
  if (text.includes('manual') || text.includes('enter') || text.includes('input')) {
    probability += 0.3;
  }
  
  // Complex decision points
  if (text.includes('if ') || text.includes('check') || text.includes('decide')) {
    probability += 0.2;
  }
  
  // External dependencies
  if (text.includes('wait') || text.includes('third party') || text.includes('external')) {
    probability += 0.3;
  }
  
  return Math.min(probability, 1.0);
};

const calculateRiskImpact = (step: WorkflowStep): number => {
  const text = (step.text || '').toLowerCase();
  let impact = 0.3; // Base impact
  
  // Financial impact
  if (text.includes('payment') || text.includes('invoice') || text.includes('transaction')) {
    impact += 0.4;
  }
  
  // Customer-facing
  if (text.includes('customer') || text.includes('client')) {
    impact += 0.3;
  }
  
  // Compliance/Legal
  if (text.includes('compliance') || text.includes('legal') || text.includes('regulatory')) {
    impact += 0.4;
  }
  
  return Math.min(impact, 1.0);
};

export const analyzeWorkflowRisks = (steps: WorkflowStep[]): RiskAnalysis => {
  const riskSteps: RiskStep[] = steps.map((step, index) => {
    const probability = calculateRiskProbability(step);
    const impact = calculateRiskImpact(step);
    const riskScore = probability * impact;
    
    let category = 'low';
    if (riskScore > 0.6) category = 'high';
    else if (riskScore > 0.3) category = 'medium';
    
    return {
      step: step.text || `Step ${index + 1}`,
      index,
      probability,
      impact,
      riskScore,
      category
    };
  });
  
  const highRiskSteps = riskSteps.filter(s => s.category === 'high');
  const mediumRiskSteps = riskSteps.filter(s => s.category === 'medium');
  const lowRiskSteps = riskSteps.filter(s => s.category === 'low');
  
  const totalRiskScore = riskSteps.reduce((sum, s) => sum + s.riskScore, 0) / riskSteps.length;
  
  const recommendations: string[] = [];
  if (highRiskSteps.length > 0) {
    recommendations.push(`${highRiskSteps.length} high-risk steps require mitigation plans`);
  }
  if (mediumRiskSteps.length > 2) {
    recommendations.push('Consider adding validation or approval steps');
  }
  
  return {
    totalRiskScore: Math.round(totalRiskScore * 100),
    highRiskSteps,
    mediumRiskSteps,
    lowRiskSteps,
    recommendations
  };
};


