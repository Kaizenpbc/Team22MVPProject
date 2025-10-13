/**
 * Comprehensive Workflow Analysis
 * Runs all 5 AI logic improvements and combines results
 */

import { WorkflowStep, parseSteps } from './workflowEditor';
import { smartDetectDuplicates } from './semanticDuplicateDetection';
import { calculateWeightedEfficiency, EfficiencyAnalysis } from './smartEfficiencyCalculator';
import { analyzeWorkflowRisks, RiskAnalysis } from './riskMatrixCalculator';
import { analyzeWorkflowOrder, DependencyAnalysis } from './dependencyGraphAnalyzer';
import { detectInternalGaps, getIndustryBestPractices, GapAnalysis } from './intelligentGapDetection';

export interface ComprehensiveAnalysis {
  workflowName: string;
  steps: WorkflowStep[];
  duplicates: any[];
  efficiency: EfficiencyAnalysis | null;
  risks: RiskAnalysis | null;
  dependencies: DependencyAnalysis | null;
  gaps: GapAnalysis | null;
  timestamp: string;
  error?: string;
}

/**
 * Run comprehensive analysis with all 5 AI improvements
 */
export const runComprehensiveAnalysis = async (
  stepsInput: string | WorkflowStep[],
  apiKey: string | null = null,
  workflowName: string = 'Workflow'
): Promise<ComprehensiveAnalysis> => {
  console.log('🧠 Starting comprehensive analysis with 5 AI improvements...');
  
  try {
    // Parse steps if needed
    const steps = typeof stepsInput === 'string' ? parseSteps(stepsInput) : stepsInput;
    
    if (!steps || steps.length === 0) {
      console.warn('⚠️ No steps to analyze');
      return {
        workflowName,
        steps: [],
        duplicates: [],
        efficiency: null,
        risks: null,
        dependencies: null,
        gaps: null,
        timestamp: new Date().toISOString(),
        error: 'No steps to analyze'
      };
    }
    
    console.log(`📊 Analyzing ${steps.length} steps...`);
    
    // Run all 5 analyses in parallel where possible
    const analysisPromises = [];
    
    // 1. Semantic Duplicate Detection (async - uses AI if key provided)
    console.log('1️⃣ Running semantic duplicate detection...');
    analysisPromises.push(
      apiKey 
        ? smartDetectDuplicates(steps, apiKey, 0.75)
        : Promise.resolve([])
    );
    
    // 2. Smart Efficiency Calculator (sync)
    console.log('2️⃣ Calculating smart efficiency scores...');
    analysisPromises.push(
      Promise.resolve(calculateWeightedEfficiency(steps))
    );
    
    // 3. Risk Matrix Calculator (sync)
    console.log('3️⃣ Analyzing risk matrix...');
    analysisPromises.push(
      Promise.resolve(analyzeWorkflowRisks(steps))
    );
    
    // 4. Dependency Graph Analyzer (sync)
    console.log('4️⃣ Building dependency graph...');
    analysisPromises.push(
      Promise.resolve(analyzeWorkflowOrder(steps))
    );
    
    // 5. Intelligent Gap Detection (sync)
    console.log('5️⃣ Detecting logical gaps...');
    analysisPromises.push(
      Promise.resolve({
        internalGaps: detectInternalGaps(steps),
        industryPractices: getIndustryBestPractices(steps)
      })
    );
    
    // Wait for all analyses to complete
    const results = await Promise.all(analysisPromises);
    const duplicates = results[0] as any[];
    const efficiency = results[1] as EfficiencyAnalysis;
    const risks = results[2] as RiskAnalysis;
    const dependencies = results[3] as DependencyAnalysis;
    const gaps = results[4] as GapAnalysis;
    
    console.log('✅ All 5 analyses complete!');
    console.log('📊 Results summary:', {
      duplicates: duplicates.length,
      efficiencyScore: efficiency?.overallScore,
      riskScore: risks?.totalRiskScore,
      needsReordering: dependencies?.needsReordering,
      gapsFound: gaps?.internalGaps?.summary?.total
    });
    
    return {
      workflowName,
      steps,
      duplicates,
      efficiency,
      risks,
      dependencies,
      gaps,
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('❌ Comprehensive analysis failed:', error);
    return {
      workflowName,
      steps: [],
      duplicates: [],
      efficiency: null,
      risks: null,
      dependencies: null,
      gaps: null,
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Get quick summary of analysis results
 */
export const getAnalysisSummary = (analysis: ComprehensiveAnalysis): string[] => {
  const summary: string[] = [];
  
  if (analysis.efficiency) {
    summary.push(`Overall Efficiency: ${analysis.efficiency.overallScore}/100`);
  }
  
  if (analysis.duplicates.length > 0) {
    summary.push(`Found ${analysis.duplicates.length} potential duplicate steps`);
  }
  
  if (analysis.risks && analysis.risks.highRiskSteps.length > 0) {
    summary.push(`${analysis.risks.highRiskSteps.length} high-risk steps identified`);
  }
  
  if (analysis.gaps && analysis.gaps.internalGaps.summary.total > 0) {
    summary.push(`${analysis.gaps.internalGaps.summary.total} potential gaps detected`);
  }
  
  if (summary.length === 0) {
    summary.push('Workflow looks good! No major issues detected.');
  }
  
  return summary;
};

