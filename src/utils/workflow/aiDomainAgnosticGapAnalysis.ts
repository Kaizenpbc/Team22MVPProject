/**
 * AI Domain-Agnostic Gap Analysis
 * Uses AI to understand ANY workflow domain and detect missing steps
 * Combines: Domain Analysis + Causal Chain Analysis + Pattern Recognition
 */

import { WorkflowStep } from './workflowEditor';

export interface DomainAgnosticGap {
  position: number;
  suggestion: string;
  reason: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  type: string;
  description: string;
  impact: string;
  source: 'AI_DOMAIN_ANALYSIS' | 'AI_CAUSAL_ANALYSIS' | 'AI_PATTERN_ANALYSIS';
  confidence: number;
  domain?: string;
}

export interface ComprehensiveGapAnalysis {
  domainGaps: DomainAgnosticGap[];
  causalGaps: DomainAgnosticGap[];
  patternGaps: DomainAgnosticGap[];
  domain: string;
  confidence: number;
  summary: {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

/**
 * Main function to analyze gaps in any workflow domain
 */
export const analyzeDomainAgnosticGaps = async (
  steps: WorkflowStep[],
  apiKey: string | null = null
): Promise<ComprehensiveGapAnalysis> => {
  console.log('🧠 Starting domain-agnostic gap analysis...');
  console.log('📝 Analyzing steps:', steps.map(s => s.text));
  
  const allGaps: DomainAgnosticGap[] = [];
  
  // 1. AI-Powered Domain Analysis
  console.log('1️⃣ Running AI domain analysis...');
  const domainAnalysis = await analyzeDomainSpecificGaps(steps, apiKey);
  allGaps.push(...domainAnalysis.gaps);
  
  // 2. Causal Chain Analysis
  console.log('2️⃣ Running causal chain analysis...');
  const causalGaps = analyzeCausalChainGaps(steps);
  allGaps.push(...causalGaps);
  
  // 3. Pattern Recognition Analysis
  console.log('3️⃣ Running pattern recognition analysis...');
  const patternGaps = analyzePatternBasedGaps(steps);
  allGaps.push(...patternGaps);
  
  // Sort by priority and remove duplicates
  const uniqueGaps = removeDuplicateGaps(allGaps);
  const sortedGaps = uniqueGaps.sort((a, b) => {
    const priorityOrder = { CRITICAL: 1, HIGH: 2, MEDIUM: 3, LOW: 4 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
  
  console.log('🎯 Domain-agnostic analysis complete:', {
    totalGaps: sortedGaps.length,
    domain: domainAnalysis.domain,
    confidence: domainAnalysis.confidence
  });
  
  // Categorize gaps
  const domainGaps = sortedGaps.filter(g => g.source === 'AI_DOMAIN_ANALYSIS');
  const causalChainGaps = sortedGaps.filter(g => g.source === 'AI_CAUSAL_ANALYSIS');
  const patternBasedGaps = sortedGaps.filter(g => g.source === 'AI_PATTERN_ANALYSIS');
  
  return {
    domainGaps,
    causalGaps: causalChainGaps,
    patternGaps: patternBasedGaps,
    domain: domainAnalysis.domain,
    confidence: domainAnalysis.confidence,
    summary: {
      total: sortedGaps.length,
      critical: sortedGaps.filter(g => g.priority === 'CRITICAL').length,
      high: sortedGaps.filter(g => g.priority === 'HIGH').length,
      medium: sortedGaps.filter(g => g.priority === 'MEDIUM').length,
      low: sortedGaps.filter(g => g.priority === 'LOW').length
    }
  };
};

/**
 * AI-Powered Domain Analysis
 * Uses AI to understand the domain and suggest missing steps
 */
const analyzeDomainSpecificGaps = async (
  steps: WorkflowStep[],
  apiKey: string | null
): Promise<{ gaps: DomainAgnosticGap[]; domain: string; confidence: number }> => {
  if (!apiKey) {
    return fallbackDomainAnalysis(steps);
  }
  
  try {
    const prompt = `You are a business process expert. Analyze this BUSINESS workflow and suggest ONLY relevant business process improvements.

Workflow steps:
${steps.map((s, i) => `${i + 1}. ${s.text}`).join('\n')}

IMPORTANT: This is a BUSINESS workflow. Do NOT suggest:
- Personal hygiene steps (washing hands, etc.)
- Medical procedures
- Cooking/food preparation steps
- Generic life advice

Focus ONLY on business process improvements like:
- Documentation steps
- Communication steps  
- Quality control steps
- Approval processes
- Follow-up actions
- Data collection
- Stakeholder notifications

Instructions:
1. Identify the business domain (sales, customer service, operations, etc.)
2. Suggest 1-2 relevant business process steps that are commonly missing
3. Each suggestion must be directly related to the workflow's business purpose

Return ONLY valid JSON:
{
  "domain": "business domain (sales, customer service, operations, etc.)",
  "confidence": 0.0 to 1.0,
  "missingSteps": [
    {
      "position": number (where to insert, 0-based),
      "suggestion": "business process step description",
      "reason": "why this business step is missing",
      "priority": "CRITICAL|HIGH|MEDIUM|LOW",
      "description": "detailed business description",
      "impact": "business impact if missing"
    }
  ]
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
          { role: 'system', content: 'You are an expert workflow analyst. Analyze workflows from any domain and identify missing steps. Return only valid JSON.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 800
      })
    });

    if (!response.ok) {
      console.error('AI domain analysis failed, using fallback');
      return fallbackDomainAnalysis(steps);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content.trim();
    const result = JSON.parse(aiResponse);
    
    const gaps: DomainAgnosticGap[] = result.missingSteps.map((gap: any) => ({
      position: gap.position,
      suggestion: gap.suggestion,
      reason: gap.reason,
      priority: gap.priority,
      type: `ai-domain-${result.domain}`,
      description: gap.description,
      impact: gap.impact,
      source: 'AI_DOMAIN_ANALYSIS' as const,
      confidence: result.confidence,
      domain: result.domain
    }));
    
    return {
      gaps,
      domain: result.domain,
      confidence: result.confidence
    };
    
  } catch (error) {
    console.error('Error in AI domain analysis:', error);
    return fallbackDomainAnalysis(steps);
  }
};

/**
 * Causal Chain Analysis
 * Analyzes logical dependencies and cause-and-effect relationships
 */
const analyzeCausalChainGaps = (steps: WorkflowStep[]): DomainAgnosticGap[] => {
  const gaps: DomainAgnosticGap[] = [];
  const stepTexts = steps.map(s => s.text.toLowerCase());
  
  console.log('🔗 Analyzing causal chains for steps:', stepTexts);
  
  // Analyze causal dependencies
  for (let i = 0; i < steps.length - 1; i++) {
    const currentStep = stepTexts[i];
    const nextStep = stepTexts[i + 1];
    
    // Check for missing prerequisites
    const missingPrerequisite = checkMissingPrerequisites(currentStep, nextStep, i);
    if (missingPrerequisite) {
      console.log('🚨 Found missing prerequisite:', missingPrerequisite.suggestion);
      gaps.push(missingPrerequisite);
    }
    
    // Check for missing consequences
    const missingConsequence = checkMissingConsequences(currentStep, nextStep, i);
    if (missingConsequence) {
      console.log('🚨 Found missing consequence:', missingConsequence.suggestion);
      gaps.push(missingConsequence);
    }
  }
  
  console.log('🔗 Causal chain analysis found', gaps.length, 'gaps');
  return gaps;
};

/**
 * Pattern Recognition Analysis
 * Detects missing steps based on common workflow patterns
 */
const analyzePatternBasedGaps = (steps: WorkflowStep[]): DomainAgnosticGap[] => {
  const gaps: DomainAgnosticGap[] = [];
  
  console.log('🔍 Analyzing patterns for steps:', steps.map(s => s.text));
  
  // Universal patterns
  const patterns = [
    analyzeSetupExecuteCleanupPattern(steps),
    analyzePreparationActionVerificationPattern(steps),
    analyzeInputProcessOutputPattern(steps),
    analyzeSafetyFirstPattern(steps),
    analyzeConsentPattern(steps)
  ];
  
  patterns.forEach((patternGaps, index) => {
    if (patternGaps.length > 0) {
      console.log(`🔍 Pattern ${index + 1} found`, patternGaps.length, 'gaps');
    }
    gaps.push(...patternGaps);
  });
  
  console.log('🔍 Pattern analysis found', gaps.length, 'total gaps');
  return gaps;
};

/**
 * Check for missing prerequisites
 */
const checkMissingPrerequisites = (
  currentStep: string, 
  nextStep: string, 
  index: number
): DomainAgnosticGap | null => {
  console.log(`🔍 Checking prerequisites: "${currentStep}" → "${nextStep}"`);
  
  // Cooking patterns
  if (currentStep.includes('cook') && !nextStep.includes('heat') && !nextStep.includes('preheat')) {
    console.log('🚨 Found cooking prerequisite gap');
    return {
      position: index,
      suggestion: 'Preheat cooking equipment',
      reason: 'You\'re cooking but never preheated the equipment first',
      priority: 'HIGH',
      type: 'missing-prerequisite',
      description: 'Cooking requires preheated equipment for proper execution',
      impact: 'Food may not cook properly or safely',
      source: 'AI_CAUSAL_ANALYSIS',
      confidence: 0.8
    };
  }
  
  // Medical patterns
  if (currentStep.includes('diagnose') && !nextStep.includes('examine') && !nextStep.includes('check')) {
    console.log('🚨 Found medical prerequisite gap');
    return {
      position: index,
      suggestion: 'Examine patient/symptoms first',
      reason: 'You\'re diagnosing but never examined the patient first',
      priority: 'CRITICAL',
      type: 'missing-prerequisite',
      description: 'Diagnosis requires examination as a prerequisite',
      impact: 'Incorrect diagnosis without proper examination',
      source: 'AI_CAUSAL_ANALYSIS',
      confidence: 0.9
    };
  }
  
  // Hygiene patterns - eating without washing hands first
  if (/\beat\b/.test(currentStep) || /\beating\b/.test(currentStep)) {
    if (!nextStep.includes('wash') && !nextStep.includes('cleanse')) {
      console.log('🚨 Found hygiene prerequisite gap');
      return {
        position: index,
        suggestion: 'Wash hands before eating',
        reason: 'You\'re eating but never washed your hands first',
        priority: 'HIGH',
        type: 'missing-prerequisite',
        description: 'Eating requires clean hands as a prerequisite',
        impact: 'Risk of ingesting germs and bacteria',
        source: 'AI_CAUSAL_ANALYSIS',
        confidence: 0.8
      };
    }
  }
  
  return null;
};

/**
 * Check for missing consequences
 */
const checkMissingConsequences = (
  currentStep: string, 
  nextStep: string, 
  index: number
): DomainAgnosticGap | null => {
  console.log(`🔍 Checking consequences: "${currentStep}" → "${nextStep}"`);
  
  // Hygiene patterns
  if (currentStep.includes('poop') && !nextStep.includes('flush') && !nextStep.includes('wipe')) {
    console.log('🚨 Found toilet consequence gap');
    return {
      position: index + 1,
      suggestion: 'Flush toilet and clean up',
      reason: 'You used the toilet but never cleaned up afterward',
      priority: 'CRITICAL',
      type: 'missing-consequence',
      description: 'Using the toilet requires cleanup as a consequence',
      impact: 'Unhygienic conditions',
      source: 'AI_CAUSAL_ANALYSIS',
      confidence: 0.9
    };
  }
  
  // Hygiene patterns - wiping without proper disposal
  if (currentStep.includes('wipe') && !nextStep.includes('dispose') && !nextStep.includes('flush')) {
    console.log('🚨 Found wiping consequence gap');
    return {
      position: index + 1,
      suggestion: 'Dispose of toilet paper properly',
      reason: 'You wiped but never disposed of the toilet paper afterward',
      priority: 'HIGH',
      type: 'missing-consequence',
      description: 'Wiping requires proper disposal as a consequence',
      impact: 'Unhygienic bathroom conditions',
      source: 'AI_CAUSAL_ANALYSIS',
      confidence: 0.8
    };
  }
  
  return null;
};

/**
 * Setup → Execute → Cleanup pattern
 */
const analyzeSetupExecuteCleanupPattern = (steps: WorkflowStep[]): DomainAgnosticGap[] => {
  const gaps: DomainAgnosticGap[] = [];
  const stepTexts = steps.map(s => s.text.toLowerCase());
  
  console.log('🔍 Analyzing Setup→Execute→Cleanup pattern for:', stepTexts);
  
  const hasSetup = stepTexts.some(s => 
    s.includes('setup') || s.includes('prepare') || s.includes('open') ||
    s.includes('wash') || s.includes('cleanse') // Hygiene setup
  );
  const hasExecution = stepTexts.some(s => 
    s.includes('execute') || s.includes('run') || s.includes('do') || 
    s.includes('perform') || /\beat\b/.test(s) || /\beating\b/.test(s) || 
    s.includes('poop') || s.includes('wipe') // Hygiene execution
  );
  const hasCleanup = stepTexts.some(s => 
    s.includes('cleanup') || s.includes('close') || s.includes('finish') || 
    s.includes('dispose') || s.includes('flush') // Toilet cleanup
  );
  
  console.log('🔍 Pattern check:', { hasSetup, hasExecution, hasCleanup });
  
  if (hasExecution && !hasSetup) {
    console.log('🚨 Found missing setup pattern');
    gaps.push({
      position: 0,
      suggestion: 'Setup/prepare before execution',
      reason: 'You\'re executing actions but never set up or prepared first',
      priority: 'HIGH',
      type: 'missing-setup',
      description: 'Execution typically requires setup as a prerequisite',
      impact: 'Execution may fail without proper setup',
      source: 'AI_PATTERN_ANALYSIS',
      confidence: 0.7
    });
  }
  
  if (hasExecution && !hasCleanup) {
    console.log('🚨 Found missing cleanup pattern');
    gaps.push({
      position: steps.length,
      suggestion: 'Cleanup after execution',
      reason: 'You\'re executing actions but never cleaned up afterward',
      priority: 'MEDIUM',
      type: 'missing-cleanup',
      description: 'Execution typically requires cleanup as a consequence',
      impact: 'Unfinished workflow, potential mess or issues',
      source: 'AI_PATTERN_ANALYSIS',
      confidence: 0.7
    });
  }
  
  console.log('🔍 Setup→Execute→Cleanup pattern found', gaps.length, 'gaps');
  return gaps;
};

/**
 * Safety First pattern
 */
const analyzeSafetyFirstPattern = (steps: WorkflowStep[]): DomainAgnosticGap[] => {
  const gaps: DomainAgnosticGap[] = [];
  const stepTexts = steps.map(s => s.text.toLowerCase());
  
  const hasDangerousAction = stepTexts.some(s => 
    s.includes('cut') || s.includes('burn') || s.includes('chemical') || 
    s.includes('operate') || s.includes('machinery') || s.includes('knife')
  );
  const hasSafetyCheck = stepTexts.some(s => 
    s.includes('safety') || s.includes('protect') || s.includes('helmet') || 
    s.includes('glove') || s.includes('check')
  );
  
  if (hasDangerousAction && !hasSafetyCheck) {
    gaps.push({
      position: 0,
      suggestion: 'Perform safety check before dangerous activities',
      reason: 'You\'re doing dangerous activities but never checked safety first',
      priority: 'CRITICAL',
      type: 'missing-safety',
      description: 'Dangerous activities require safety checks as a prerequisite',
      impact: 'High risk of injury or accident',
      source: 'AI_PATTERN_ANALYSIS',
      confidence: 0.9
    });
  }
  
  return gaps;
};

/**
 * Consent pattern (for intimate/medical/sensitive activities)
 */
const analyzeConsentPattern = (steps: WorkflowStep[]): DomainAgnosticGap[] => {
  const gaps: DomainAgnosticGap[] = [];
  const stepTexts = steps.map(s => s.text.toLowerCase());
  
  const hasIntimateAction = stepTexts.some(s => 
    s.includes('touch') || s.includes('kiss') || s.includes('intimate') || 
    s.includes('foreplay') || s.includes('sexual')
  );
  const hasConsent = stepTexts.some(s => 
    s.includes('consent') || s.includes('permission') || s.includes('ask') || 
    s.includes('agree') || s.includes('ok')
  );
  
  if (hasIntimateAction && !hasConsent) {
    gaps.push({
      position: 0,
      suggestion: 'Obtain consent before intimate activities',
      reason: 'You\'re doing intimate activities but never obtained consent first',
      priority: 'CRITICAL',
      type: 'missing-consent',
      description: 'Intimate activities require consent as a prerequisite',
      impact: 'Legal and ethical violations',
      source: 'AI_PATTERN_ANALYSIS',
      confidence: 0.95
    });
  }
  
  return gaps;
};

/**
 * Preparation → Action → Verification pattern
 */
const analyzePreparationActionVerificationPattern = (steps: WorkflowStep[]): DomainAgnosticGap[] => {
  const gaps: DomainAgnosticGap[] = [];
  // Implementation for preparation-action-verification pattern
  return gaps;
};

/**
 * Input → Process → Output pattern
 */
const analyzeInputProcessOutputPattern = (steps: WorkflowStep[]): DomainAgnosticGap[] => {
  const gaps: DomainAgnosticGap[] = [];
  // Implementation for input-process-output pattern
  return gaps;
};

/**
 * Fallback domain analysis when AI is not available
 */
const fallbackDomainAnalysis = (steps: WorkflowStep[]): { gaps: DomainAgnosticGap[]; domain: string; confidence: number } => {
  // Basic keyword-based domain detection
  const stepTexts = steps.map(s => s.text.toLowerCase()).join(' ');
  
  let domain = 'general';
  if (stepTexts.includes('cook') || stepTexts.includes('food') || stepTexts.includes('recipe')) {
    domain = 'culinary';
  } else if (stepTexts.includes('patient') || stepTexts.includes('medical') || stepTexts.includes('diagnose')) {
    domain = 'medical';
  } else if (stepTexts.includes('kiss') || stepTexts.includes('touch') || stepTexts.includes('intimate')) {
    domain = 'intimate';
  } else if (stepTexts.includes('wash') || stepTexts.includes('cleanse') || stepTexts.includes('hygiene')) {
    domain = 'hygiene';
  }
  
  return {
    gaps: [],
    domain,
    confidence: 0.3
  };
};

/**
 * Remove duplicate gaps based on similar suggestions
 */
const removeDuplicateGaps = (gaps: DomainAgnosticGap[]): DomainAgnosticGap[] => {
  const unique = new Map<string, DomainAgnosticGap>();
  
  gaps.forEach(gap => {
    const key = gap.suggestion.toLowerCase().replace(/[^\w\s]/g, '').trim();
    if (!unique.has(key) || unique.get(key)!.confidence < gap.confidence) {
      unique.set(key, gap);
    }
  });
  
  return Array.from(unique.values());
};
