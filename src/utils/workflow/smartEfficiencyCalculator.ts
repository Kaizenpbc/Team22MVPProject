/**
 * Smart Efficiency Calculator
 * Weighted efficiency scoring based on real business factors
 */

import { WorkflowStep } from './workflowEditor';

export interface EfficiencyAnalysis {
  overallScore: number;
  factors: {
    complexity: number;
    time: number;
    quality: number;
    impact: number;
  };
  breakdown: StepAnalysis[];
  totalEstimatedTime: number;
  averageErrorRate: number;
  recommendations: string[];
  summary?: {
    bestSteps: string[];
    worstSteps: string[];
    highRiskSteps: string[];
  };
}

interface StepAnalysis {
  step: string;
  complexity: number;
  estimatedTime: number;
  errorRate: number;
  businessImpact: number;
  stepEfficiency: number;
  weightedScore: number;
  issues: string[];
}

const calculateStepComplexity = (step: WorkflowStep): number => {
  const text = (step.text || step.name || '').toLowerCase();
  let complexity = 0.3;
  
  if (text.includes('if ') || text.includes('check ') || text.includes('?')) {
    complexity += 0.3;
  }
  
  const actionWords = ['and', 'then', 'also', 'while', 'during'];
  const actionCount = actionWords.filter(word => text.includes(word)).length;
  complexity += actionCount * 0.1;
  
  const technicalWords = ['verify', 'validate', 'authenticate', 'configure', 'integrate', 'analyze'];
  const techCount = technicalWords.filter(word => text.includes(word)).length;
  complexity += techCount * 0.05;
  
  if (text.length > 50) complexity += 0.1;
  if (text.length > 100) complexity += 0.1;
  
  return Math.min(complexity, 1.0);
};

const estimateStepTime = (step: WorkflowStep): number => {
  const text = (step.text || step.name || '').toLowerCase();
  let minutes = 2;
  
  if (text.includes('if ') || text.includes('check ')) minutes += 3;
  if (text.includes('enter') || text.includes('input') || text.includes('approve')) minutes += 5;
  if (text.includes('review') || text.includes('analyze') || text.includes('investigate')) minutes += 10;
  if (text.includes('call') || text.includes('email') || text.includes('notify') || text.includes('contact')) minutes += 5;
  if (text.includes('wait') || text.includes('schedule') || text.includes('queue')) minutes += 15;
  
  const complexity = calculateStepComplexity(step);
  minutes += complexity * 10;
  
  return minutes;
};

const estimateErrorRate = (step: WorkflowStep): number => {
  const text = (step.text || step.name || '').toLowerCase();
  let errorRate = 0.05;
  
  if (text.includes('enter') || text.includes('input') || text.includes('type')) errorRate += 0.15;
  if (text.includes('calculate') || text.includes('compute') || text.includes('add up')) errorRate += 0.10;
  if (!text.includes('verify') && !text.includes('check') && !text.includes('validate')) errorRate += 0.05;
  
  const complexity = calculateStepComplexity(step);
  errorRate += complexity * 0.1;
  
  if (text.includes('manual')) errorRate += 0.10;
  
  return Math.min(errorRate, 0.5);
};

const calculateBusinessImpact = (step: WorkflowStep): number => {
  const text = (step.text || step.name || '').toLowerCase();
  let impact = 0.3;
  
  if (step.type === 'start' || step.type === 'end') impact = 0.9;
  if (step.type === 'decision' || text.includes('if ') || text.includes('check ')) impact += 0.25;
  if (text.includes('customer') || text.includes('client') || text.includes('user')) impact += 0.35;
  if (text.includes('pay') || text.includes('bill') || text.includes('invoice') || text.includes('cost') || text.includes('transaction')) impact += 0.35;
  if (text.includes('approve') || text.includes('authorize') || text.includes('sign')) impact += 0.20;
  if (text.includes('complian') || text.includes('security') || text.includes('audit') || text.includes('legal') || text.includes('regulat')) impact += 0.30;
  if (text.includes('error') || text.includes('fail') || text.includes('exception')) impact += 0.15;
  
  const hasHighImpactKeywords = text.includes('customer') || text.includes('pay') || 
                                 text.includes('approve') || text.includes('complian') || 
                                 text.includes('security');
  const isLowImpact = text.includes('file') || text.includes('internal') || text.includes('log') || text.includes('record');
  
  if (isLowImpact && !hasHighImpactKeywords) {
    impact = 0.2;
  }
  
  return Math.min(impact, 1.0);
};

export const calculateWeightedEfficiency = (steps: WorkflowStep[]): EfficiencyAnalysis => {
  if (!steps || steps.length === 0) {
    return {
      overallScore: 0,
      factors: { complexity: 0, time: 0, quality: 0, impact: 0 },
      breakdown: [],
      totalEstimatedTime: 0,
      averageErrorRate: 0,
      recommendations: []
    };
  }

  const stepAnalysis: StepAnalysis[] = steps.map(step => {
    const complexity = calculateStepComplexity(step);
    const estimatedTime = estimateStepTime(step);
    const errorRate = estimateErrorRate(step);
    const businessImpact = calculateBusinessImpact(step);
    
    const stepEfficiency = 
      (1 - complexity * 0.3) *
      (1 - Math.min(estimatedTime / 60, 1) * 0.2) *
      (1 - errorRate * 0.5);
    
    const weightedScore = stepEfficiency * businessImpact;
    
    return {
      step: step.text || step.name || `Step ${steps.indexOf(step) + 1}`,
      complexity,
      estimatedTime,
      errorRate,
      businessImpact,
      stepEfficiency,
      weightedScore,
      issues: []
    };
  });

  const totalImpact = stepAnalysis.reduce((sum, s) => sum + s.businessImpact, 0);
  const totalWeightedScore = stepAnalysis.reduce((sum, s) => sum + s.weightedScore, 0);
  const overallScore = Math.round((totalWeightedScore / totalImpact) * 100);
  
  const avgComplexity = stepAnalysis.reduce((sum, s) => sum + s.complexity, 0) / steps.length;
  const complexityScore = Math.round((1 - avgComplexity) * 100);
  
  const totalTime = stepAnalysis.reduce((sum, s) => sum + s.estimatedTime, 0);
  const timeScore = Math.round(Math.max(0, 100 - (totalTime / steps.length) * 2));
  
  const avgErrorRate = stepAnalysis.reduce((sum, s) => sum + s.errorRate, 0) / steps.length;
  const qualityScore = Math.round((1 - avgErrorRate) * 100);
  
  const avgImpact = stepAnalysis.reduce((sum, s) => sum + s.businessImpact, 0) / steps.length;
  const impactScore = Math.round(avgImpact * 100);
  
  const recommendations: string[] = [];
  
  const highComplexitySteps = stepAnalysis.filter(s => s.complexity > 0.7);
  if (highComplexitySteps.length > 0) {
    recommendations.push(`Break down ${highComplexitySteps.length} complex steps into simpler sub-steps`);
  }
  
  const highErrorSteps = stepAnalysis.filter(s => s.errorRate > 0.2);
  if (highErrorSteps.length > 0) {
    recommendations.push(`Add validation checks to ${highErrorSteps.length} error-prone steps`);
  }
  
  const slowSteps = stepAnalysis.filter(s => s.estimatedTime > 15);
  if (slowSteps.length > 0) {
    recommendations.push(`Consider automation for ${slowSteps.length} time-consuming steps`);
  }
  
  if (overallScore < 60) {
    recommendations.push('Workflow needs significant optimization - consider redesigning process flow');
  } else if (overallScore < 80) {
    recommendations.push('Workflow is functional but has room for improvement');
  }

  return {
    overallScore,
    factors: {
      complexity: complexityScore,
      time: timeScore,
      quality: qualityScore,
      impact: impactScore
    },
    breakdown: stepAnalysis,
    totalEstimatedTime: Math.round(totalTime),
    averageErrorRate: Math.round(avgErrorRate * 100),
    recommendations,
    summary: {
      bestSteps: stepAnalysis
        .sort((a, b) => b.weightedScore - a.weightedScore)
        .slice(0, 3)
        .map(s => s.step),
      worstSteps: stepAnalysis
        .sort((a, b) => a.weightedScore - b.weightedScore)
        .slice(0, 3)
        .map(s => s.step),
      highRiskSteps: stepAnalysis
        .filter(s => s.errorRate > 0.2)
        .map(s => s.step)
    }
  };
};


