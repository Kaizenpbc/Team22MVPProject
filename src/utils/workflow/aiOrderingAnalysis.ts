/**
 * AI Ordering Analysis
 * Analyzes workflow steps for logical sequence issues and provides semantic reasoning
 */

import { WorkflowStep } from './workflowEditor';

export interface OrderingIssue {
  originalSteps: WorkflowStep[];
  suggestedSteps: WorkflowStep[];
  reasoning: string;
  confidence: number;
}

/**
 * Analyze workflow step ordering for logical sequence issues using ChatGPT
 */
export const analyzeWorkflowOrdering = async (steps: WorkflowStep[], apiKey: string | null = null): Promise<OrderingIssue | null> => {
  if (steps.length < 2) return null;

  console.log('🔍 Analyzing workflow ordering for steps:', steps.map(s => s.text));

  // If no API key provided, fall back to pattern matching
  if (!apiKey) {
    console.log('⚠️ No API key provided, using pattern matching fallback');
    return analyzeWorkflowOrderingFallback(steps);
  }

  // Use ChatGPT for true AI reasoning about workflow ordering
  try {
    console.log('🤖 Using ChatGPT for intelligent workflow ordering analysis...');
    
    const { callOpenAIProxy } = await import('../../services/openaiProxy');
    
    const response = await callOpenAIProxy({
      model: 'gpt-4o-mini',
      messages: [{
        role: 'system',
        content: `You are an expert workflow analyst. Analyze the given workflow steps for logical sequencing issues and suggest improvements. Consider:

1. Logical cause-and-effect relationships
2. Safety and best practices
3. Domain-specific knowledge (medical, business, intimate, creative, etc.)
4. Efficiency and user experience
5. Natural progression and flow

Provide a JSON response with:
- "needsReordering": boolean
- "suggestedSteps": array of reordered steps (if needed)
- "reasoning": detailed explanation of why reordering is needed
- "confidence": confidence score (0-1)

If no reordering is needed, set "needsReordering": false and keep original steps.`
      }, {
        role: 'user',
        content: `Analyze this workflow for logical ordering issues:

${steps.map((s, i) => `${i + 1}. ${s.text}`).join('\n')}

Consider the logical sequence, safety, efficiency, and domain-specific best practices. Suggest improvements if needed.`
      }]
    });

    const aiAnalysis = JSON.parse(response.choices[0].message.content);
    
    if (!aiAnalysis.needsReordering) {
      console.log('✅ AI analysis: No reordering needed');
      return null;
    }

    // Convert AI suggestions back to WorkflowStep format
    const suggestedSteps = aiAnalysis.suggestedSteps.map((stepText: string, index: number) => ({
      id: `suggested-${index}`,
      text: stepText,
      type: 'process' as const,
      name: stepText
    }));

    console.log('🧠 AI suggested reordering:', {
      original: steps.map(s => s.text),
      suggested: suggestedSteps.map(s => s.text),
      reasoning: aiAnalysis.reasoning
    });

    return {
      originalSteps: steps,
      suggestedSteps,
      reasoning: aiAnalysis.reasoning,
      confidence: aiAnalysis.confidence || 0.8
    };

  } catch (error) {
    console.error('❌ ChatGPT ordering analysis failed:', error);
    console.log('🔄 Falling back to pattern matching...');
    return analyzeWorkflowOrderingFallback(steps);
  }
};

/**
 * Fallback pattern-based ordering analysis (original logic)
 */
const analyzeWorkflowOrderingFallback = (steps: WorkflowStep[]): OrderingIssue | null => {
  console.log('🔧 Using fallback pattern matching analysis...');

  // Define semantic patterns for logical ordering
  const orderingPatterns = {
    // Hygiene patterns - dirty tasks should come before clean tasks
    hygiene: {
      dirty: ['wipe', 'poop', 'toilet', 'bathroom', 'cleanse', 'dirty', 'soiled'],
      clean: ['wash', 'sanitize', 'clean hands', 'hygiene']
    },
    
    // Food patterns - preparation should come before consumption
    food: {
      preparation: ['cook', 'prepare', 'heat', 'mix', 'chop', 'cut', 'slice'],
      consumption: ['eat', 'drink', 'consume', 'taste', 'sample']
    },
    
    // Work patterns - setup should come before execution
    work: {
      setup: ['open', 'start', 'begin', 'initialize', 'setup', 'prepare'],
      execution: ['process', 'execute', 'run', 'complete', 'finish']
    },
    
    // Communication patterns - send should come after write
    communication: {
      create: ['write', 'draft', 'create', 'compose', 'type'],
      send: ['send', 'email', 'submit', 'transmit', 'deliver']
    },
    
    // Approval patterns - review should come before approval
    approval: {
      review: ['review', 'check', 'examine', 'verify', 'validate'],
      approve: ['approve', 'sign', 'authorize', 'confirm', 'accept']
    },
    
    // Intimate patterns - consent/mood should come before foreplay, foreplay before intimacy
    intimate: {
      consent: ['ask', 'consent', 'permission', 'agree', 'discuss'],
      foreplay: ['kiss', 'touch', 'caress', 'foreplay', 'arousal', 'mood', 'music', 'drink'],
      intimacy: ['sex', 'intercourse', 'intimate', 'penetrat', 'vagina', 'penis']
    }
  };

  // Check for ordering issues
  const issues: Array<{step1Index: number, step2Index: number, reason: string, confidence: number}> = [];

  for (let i = 0; i < steps.length - 1; i++) {
    for (let j = i + 1; j < steps.length; j++) {
      const step1 = steps[i].text.toLowerCase();
      const step2 = steps[j].text.toLowerCase();

      // Check hygiene patterns
      const hygieneIssue = checkHygieneOrdering(step1, step2, i, j, orderingPatterns.hygiene);
      if (hygieneIssue) issues.push(hygieneIssue);

      // Check food patterns  
      const foodIssue = checkFoodOrdering(step1, step2, i, j, orderingPatterns.food);
      if (foodIssue) issues.push(foodIssue);

      // Check work patterns
      const workIssue = checkWorkOrdering(step1, step2, i, j, orderingPatterns.work);
      if (workIssue) issues.push(workIssue);

      // Check communication patterns
      const commIssue = checkCommunicationOrdering(step1, step2, i, j, orderingPatterns.communication);
      if (commIssue) issues.push(commIssue);

      // Check approval patterns
      const approvalIssue = checkApprovalOrdering(step1, step2, i, j, orderingPatterns.approval);
      if (approvalIssue) issues.push(approvalIssue);

      // Check intimate patterns
      const intimateIssue = checkIntimateOrdering(step1, step2, i, j, orderingPatterns.intimate);
      if (intimateIssue) issues.push(intimateIssue);
    }
  }

  console.log('🔍 Found ordering issues:', issues.length);

  if (issues.length === 0) return null;

  // Find the highest confidence issue
  const bestIssue = issues.reduce((best, current) => 
    current.confidence > best.confidence ? current : best
  );

  console.log('🎯 Best ordering issue:', bestIssue);

  // Create comprehensive suggested reordering based on semantic logic
  const suggestedSteps = createSemanticOrdering(steps);

  // Generate comprehensive reasoning
  const comprehensiveReasoning = generateComprehensiveReasoning(steps, suggestedSteps);

  return {
    originalSteps: steps,
    suggestedSteps,
    reasoning: comprehensiveReasoning,
    confidence: bestIssue.confidence
  };
};

/**
 * Check hygiene ordering (dirty tasks should come before clean tasks)
 */
const checkHygieneOrdering = (
  step1: string, 
  step2: string, 
  step1Index: number, 
  step2Index: number,
  patterns: any
): any => {
  const step1IsClean = patterns.clean.some((word: string) => step1.includes(word));
  const step2IsDirty = patterns.dirty.some((word: string) => step2.includes(word));
  
  // Check if clean task comes before dirty task (wrong order)
  if (step1IsClean && step2IsDirty) {
    return {
      step1Index,
      step2Index,
      reason: "The steps were reordered to follow a logical cause-and-effect flow. Dirty tasks should come before clean tasks, so you can wash your hands after completing dirty activities.",
      confidence: 0.9
    };
  }
  
  // Also check if dirty task comes after clean task (wrong order)
  const step1IsDirty = patterns.dirty.some((word: string) => step1.includes(word));
  const step2IsClean = patterns.clean.some((word: string) => step2.includes(word));
  
  if (step1IsDirty && step2IsClean) {
    return {
      step1Index,
      step2Index,
      reason: "The steps were reordered to follow a logical cause-and-effect flow. You should wash your hands AFTER dirty activities, not before.",
      confidence: 0.9
    };
  }
  
  return null;
};

/**
 * Check food ordering (preparation should come before consumption)
 */
const checkFoodOrdering = (
  step1: string, 
  step2: string, 
  step1Index: number, 
  step2Index: number,
  patterns: any
): any => {
  const step1IsConsumption = patterns.consumption.some((word: string) => step1.includes(word));
  const step2IsPreparation = patterns.preparation.some((word: string) => step2.includes(word));
  
  if (step1IsConsumption && step2IsPreparation) {
    return {
      step1Index,
      step2Index,
      reason: "The steps were reordered to follow a logical cause-and-effect flow. Food preparation should come before eating, so you cook before you consume.",
      confidence: 0.9
    };
  }
  return null;
};

/**
 * Check work ordering (setup should come before execution)
 */
const checkWorkOrdering = (
  step1: string, 
  step2: string, 
  step1Index: number, 
  step2Index: number,
  patterns: any
): any => {
  const step1IsExecution = patterns.execution.some((word: string) => step1.includes(word));
  const step2IsSetup = patterns.setup.some((word: string) => step2.includes(word));
  
  if (step1IsExecution && step2IsSetup) {
    return {
      step1Index,
      step2Index,
      reason: "The steps were reordered to follow a logical cause-and-effect flow. Setup tasks should come before execution, so you prepare before you process.",
      confidence: 0.8
    };
  }
  return null;
};

/**
 * Check communication ordering (create should come before send)
 */
const checkCommunicationOrdering = (
  step1: string, 
  step2: string, 
  step1Index: number, 
  step2Index: number,
  patterns: any
): any => {
  const step1IsSend = patterns.send.some((word: string) => step1.includes(word));
  const step2IsCreate = patterns.create.some((word: string) => step2.includes(word));
  
  if (step1IsSend && step2IsCreate) {
    return {
      step1Index,
      step2Index,
      reason: "The steps were reordered to follow a logical cause-and-effect flow. You need to create content before you can send it.",
      confidence: 0.8
    };
  }
  return null;
};

/**
 * Check approval ordering (review should come before approval)
 */
const checkApprovalOrdering = (
  step1: string, 
  step2: string, 
  step1Index: number, 
  step2Index: number,
  patterns: any
): any => {
  const step1IsApprove = patterns.approve.some((word: string) => step1.includes(word));
  const step2IsReview = patterns.review.some((word: string) => step2.includes(word));
  
  if (step1IsApprove && step2IsReview) {
    return {
      step1Index,
      step2Index,
      reason: "The steps were reordered to follow a logical cause-and-effect flow. You need to review something before you can approve it.",
      confidence: 0.8
    };
  }
  return null;
};

/**
 * Create semantic ordering based on logical workflow patterns
 */
const createSemanticOrdering = (steps: WorkflowStep[]): WorkflowStep[] => {
  const stepTexts = steps.map(s => s.text.toLowerCase());
  
  // Define semantic categories
  const categories = {
    food: steps.filter(s => s.text.toLowerCase().includes('eat') || s.text.toLowerCase().includes('food')),
    hygiene: {
      clean: steps.filter(s => s.text.toLowerCase().includes('wash') || s.text.toLowerCase().includes('cleanse')),
      dirty: steps.filter(s => s.text.toLowerCase().includes('wipe') || s.text.toLowerCase().includes('poop') || s.text.toLowerCase().includes('bathroom'))
    },
    intimate: {
      consent: steps.filter(s => {
        const text = s.text.toLowerCase();
        return text.includes('ask') || text.includes('consent') || text.includes('permission') || 
               text.includes('agree') || text.includes('discuss');
      }),
      foreplay: steps.filter(s => {
        const text = s.text.toLowerCase();
        return text.includes('kiss') || text.includes('touch') || text.includes('caress') || 
               text.includes('foreplay') || text.includes('arousal') || text.includes('mood') || 
               text.includes('music') || text.includes('drink');
      }),
      intimacy: steps.filter(s => {
        const text = s.text.toLowerCase();
        return text.includes('sex') || text.includes('intercourse') || text.includes('intimate') || 
               text.includes('penetrat') || text.includes('vagina') || text.includes('penis');
      })
    },
    other: steps.filter(s => {
      const text = s.text.toLowerCase();
      return !text.includes('eat') && !text.includes('food') && 
             !text.includes('wash') && !text.includes('cleanse') &&
             !text.includes('wipe') && !text.includes('poop') && !text.includes('bathroom') &&
             !text.includes('ask') && !text.includes('consent') && !text.includes('permission') &&
             !text.includes('agree') && !text.includes('discuss') &&
             !text.includes('kiss') && !text.includes('touch') && !text.includes('caress') &&
             !text.includes('foreplay') && !text.includes('arousal') && !text.includes('mood') &&
             !text.includes('music') && !text.includes('drink') &&
             !text.includes('sex') && !text.includes('intercourse') && !text.includes('intimate') &&
             !text.includes('penetrat') && !text.includes('vagina') && !text.includes('penis');
    })
  };
  
  // Create logical ordering based on workflow type
  const suggestedSteps: WorkflowStep[] = [];
  
  // Check if this is an intimate workflow
  const hasIntimateSteps = categories.intimate.consent.length > 0 || 
                          categories.intimate.foreplay.length > 0 || 
                          categories.intimate.intimacy.length > 0;
  
  if (hasIntimateSteps) {
    // Intimate workflow ordering: consent -> foreplay -> intimacy -> other
    console.log('🔞 Creating intimate workflow ordering...');
    suggestedSteps.push(...categories.intimate.consent);
    suggestedSteps.push(...categories.intimate.foreplay);
    suggestedSteps.push(...categories.intimate.intimacy);
    suggestedSteps.push(...categories.other);
  } else {
    // Standard workflow ordering: food -> dirty hygiene -> clean hygiene -> other
    suggestedSteps.push(...categories.food);
    suggestedSteps.push(...categories.hygiene.dirty);
    suggestedSteps.push(...categories.hygiene.clean);
    suggestedSteps.push(...categories.other);
  }
  
  console.log('🧠 Semantic ordering created:', {
    food: categories.food.length,
    dirty: categories.hygiene.dirty.length,
    clean: categories.hygiene.clean.length,
    intimate: {
      consent: categories.intimate.consent.length,
      foreplay: categories.intimate.foreplay.length,
      intimacy: categories.intimate.intimacy.length
    },
    other: categories.other.length,
    total: suggestedSteps.length
  });
  
  return suggestedSteps;
};

/**
 * Generate comprehensive reasoning for the reordering
 */
const generateComprehensiveReasoning = (originalSteps: WorkflowStep[], suggestedSteps: WorkflowStep[]): string => {
  const original = originalSteps.map(s => s.text);
  const suggested = suggestedSteps.map(s => s.text);
  
  // Check what changed
  const hasFood = original.some(s => s.toLowerCase().includes('eat') || s.toLowerCase().includes('food'));
  const hasDirty = original.some(s => s.toLowerCase().includes('wipe') || s.toLowerCase().includes('poop'));
  const hasClean = original.some(s => s.toLowerCase().includes('wash') || s.toLowerCase().includes('cleanse'));
  
  if (hasFood && hasDirty && hasClean) {
    return "The steps were reordered to follow a logical cause-and-effect flow. Eating should come first, then bathroom activities (poop, wipe), and finally washing hands to clean up after dirty tasks.";
  } else if (hasDirty && hasClean) {
    return "The steps were reordered to follow a logical cause-and-effect flow. Dirty tasks should come before clean tasks, so you wash your hands after completing dirty activities.";
  } else if (hasFood && hasDirty) {
    return "The steps were reordered to follow a logical cause-and-effect flow. Eating should come before bathroom activities for better digestion timing.";
  } else {
    return "The steps were reordered to follow a logical cause-and-effect flow based on semantic analysis of the workflow steps.";
  }
};

/**
 * Generate detailed semantic reasoning for workflow ordering
 */
export const generateOrderingReasoning = (steps: WorkflowStep[]): string => {
  const stepTexts = steps.map(s => s.text.toLowerCase());
  
  // Check for common logical issues
  if (stepTexts.some(s => s.includes('eat')) && stepTexts.some(s => s.includes('cook'))) {
    const eatIndex = stepTexts.findIndex(s => s.includes('eat'));
    const cookIndex = stepTexts.findIndex(s => s.includes('cook'));
    
    if (eatIndex < cookIndex) {
      return "The steps were reordered to follow a logical cause-and-effect flow. Eating should come after cooking, so you prepare food before you consume it.";
    }
  }
  
  if (stepTexts.some(s => s.includes('wash')) && stepTexts.some(s => s.includes('wipe'))) {
    const washIndex = stepTexts.findIndex(s => s.includes('wash'));
    const wipeIndex = stepTexts.findIndex(s => s.includes('wipe'));
    
    if (washIndex < wipeIndex) {
      return "The steps were reordered to follow a logical cause-and-effect flow. Washing hands should come after wiping, so you clean up after dirty tasks.";
    }
  }
  
  return "The steps were reordered to follow a logical cause-and-effect flow based on semantic analysis of the workflow steps.";
};

/**
 * Check intimate ordering (consent/mood should come before foreplay, foreplay before intimacy)
 */
const checkIntimateOrdering = (
  step1: string, 
  step2: string, 
  step1Index: number, 
  step2Index: number,
  patterns: any
): any => {
  const step1IsIntimacy = patterns.intimacy.some((word: string) => step1.includes(word));
  const step2IsForeplay = patterns.foreplay.some((word: string) => step2.includes(word));
  const step1IsIntimacy2 = patterns.intimacy.some((word: string) => step1.includes(word));
  const step2IsConsent = patterns.consent.some((word: string) => step2.includes(word));
  const step1IsForeplay = patterns.foreplay.some((word: string) => step1.includes(word));
  const step2IsConsent2 = patterns.consent.some((word: string) => step2.includes(word));
  
  // Check if intimacy comes before foreplay (wrong order)
  if (step1IsIntimacy && step2IsForeplay) {
    return {
      step1Index,
      step2Index,
      reason: "The steps were reordered to follow a logical intimate flow. Foreplay and mood-setting should come before intimacy for a better experience.",
      confidence: 0.8
    };
  }
  
  // Check if intimacy comes before consent (wrong order)
  if (step1IsIntimacy2 && step2IsConsent) {
    return {
      step1Index,
      step2Index,
      reason: "The steps were reordered to follow a logical intimate flow. Consent and communication should come before any intimate activities.",
      confidence: 0.9
    };
  }
  
  // Check if foreplay comes before consent (could be improved)
  if (step1IsForeplay && step2IsConsent2) {
    return {
      step1Index,
      step2Index,
      reason: "The steps were reordered to follow a logical intimate flow. Consent and communication should ideally come before foreplay activities.",
      confidence: 0.7
    };
  }
  
  return null;
};
