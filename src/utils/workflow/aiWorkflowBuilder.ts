/**
 * AI Workflow Builder Service
 * Handles conversational workflow building with domain awareness
 */

import { WorkflowStep } from './workflowEditor';
import { findDomain, getAllDomains, DomainTemplate } from './domainKnowledgeBase';

export interface BuilderMessage {
  role: 'ai' | 'user';
  content: string;
  timestamp: Date;
}

export interface BuilderState {
  stage: 'domain' | 'refine' | 'complete';
  domain: DomainTemplate | null;
  messages: BuilderMessage[];
  generatedSteps: WorkflowStep[];
  userModifications: string[];
}

/**
 * Initialize workflow builder conversation
 */
export const initializeBuilder = (): BuilderState => {
  const allDomains = getAllDomains();
  const examples = allDomains.map(d => `     • ${d}`).join('\n');
  
  return {
    stage: 'domain',
    domain: null,
    messages: [{
      role: 'ai',
      content: `👋 Hi! I'm your AI Workflow Assistant!\n\nI'll help you build a complete workflow from scratch, even if you don't know all the steps. Just tell me what industry or type of process you need!\n\n🎯 I'm an expert in ${allDomains.length} industries:\n${examples}\n\n💡 **Examples:**\n     "automotive repair shop"\n     "IT help desk"\n     "real estate transaction"\n     "Or just describe what you do!"\n\nWhat workflow do you need?`,
      timestamp: new Date()
    }],
    generatedSteps: [],
    userModifications: []
  };
};

/**
 * Process user input and generate AI response
 */
export const processUserInput = (
  state: BuilderState,
  userInput: string
): BuilderState => {
  const newState = { ...state };
  
  // Add user message
  newState.messages.push({
    role: 'user',
    content: userInput,
    timestamp: new Date()
  });
  
  if (state.stage === 'domain') {
    // Try to find matching domain
    const domain = findDomain(userInput);
    
    if (domain) {
      // Found a match!
      newState.domain = domain;
      newState.stage = 'refine';
      
      // Generate initial workflow
      newState.generatedSteps = generateWorkflowFromDomain(domain);
      
      // Create AI response
      const stepsList = newState.generatedSteps
        .map((step, i) => `     ${i + 1}. ${step.text}`)
        .join('\n');
      
      newState.messages.push({
        role: 'ai',
        content: `🎯 Perfect! I know ${domain.name}!\n\nHere's a typical workflow I've created for you based on industry best practices:\n\n📋 **YOUR WORKFLOW (${newState.generatedSteps.length} steps):**\n${stepsList}\n\n✨ **What's next?**\nThis is a solid foundation, but you can customize it! You can:\n• ✓ "Looks good, use this" - I'll create it now!\n• ➕ "Add [feature]" - I'll add relevant steps\n• ➖ "Remove [step]" - I'll take it out\n• 📝 Or describe what's different about yours\n\nWhat would you like to do?`,
        timestamp: new Date()
      });
    } else {
      // Couldn't identify domain
      const examples = getAllDomains().slice(0, 4).map(d => `• ${d}`).join('\n     ');
      
      newState.messages.push({
        role: 'ai',
        content: `I'm not sure I understood that industry. Could you describe it differently?\n\nExamples that work well:\n     ${examples}\n\nOr describe what your business does.`,
        timestamp: new Date()
      });
    }
  } else if (state.stage === 'refine') {
    // User is refining the workflow
    const lowerInput = userInput.toLowerCase();
    
    if (lowerInput.includes('looks good') || lowerInput.includes('use this') || lowerInput.includes('perfect') || lowerInput.includes('sounds good')) {
      // User approved!
      newState.stage = 'complete';
      newState.messages.push({
        role: 'ai',
        content: `🎉 Excellent! Creating your professional workflow now...\n\n✅ Generated ${newState.generatedSteps.length} optimized workflow steps\n✅ Added ${newState.generatedSteps.filter(s => s.type === 'decision').length} decision points\n✅ Included ${state.domain?.communications.length || 0} communication touchpoints\n✅ Based on industry best practices\n\n🚀 Your workflow is ready!\n💰 Cost: 5 credits\n\nLoading your interactive flowchart...`,
        timestamp: new Date()
      });
    } else if (lowerInput.includes('add')) {
      // User wants to add something
      const modification = extractModification(userInput);
      newState.userModifications.push(`add:${modification}`);
      
      // Add steps based on modification
      const additionalSteps = generateAdditionalSteps(modification, state.domain);
      newState.generatedSteps = insertStepsIntelligently(
        newState.generatedSteps,
        additionalSteps,
        modification
      );
      
      const stepsList = newState.generatedSteps
        .map((step, i) => `     ${i + 1}. ${step.text}${additionalSteps.includes(step) ? ' ✨ NEW' : ''}`)
        .join('\n');
      
      newState.messages.push({
        role: 'ai',
        content: `✅ Done! I've intelligently added ${additionalSteps.length} step${additionalSteps.length > 1 ? 's' : ''} for ${modification}:\n\n📋 **UPDATED WORKFLOW (${newState.generatedSteps.length} steps):**\n${stepsList}\n\n✨ = Newly added steps\n\n🤔 **What's next?**\n• Add more features\n• Remove something\n• Or say "looks good" to finalize!`,
        timestamp: new Date()
      });
    } else if (lowerInput.includes('remove')) {
      // User wants to remove something
      const toRemove = extractModification(userInput);
      newState.generatedSteps = newState.generatedSteps.filter(
        step => !step.text.toLowerCase().includes(toRemove.toLowerCase())
      );
      
      const stepsList = newState.generatedSteps
        .map((step, i) => `     ${i + 1}. ${step.text}`)
        .join('\n');
      
      newState.messages.push({
        role: 'ai',
        content: `Removed! Updated workflow:\n\n📋 UPDATED FLOW:\n${stepsList}\n\nAnything else to change?`,
        timestamp: new Date()
      });
    } else {
      // General modification or clarification
      newState.messages.push({
        role: 'ai',
        content: `I can help with that! To modify the workflow, you can:\n• "Add steps for [feature]" - I'll add relevant steps\n• "Remove [step name]" - I'll remove it\n• "Looks good" - I'll create the workflow\n\nWhat would you like to do?`,
        timestamp: new Date()
      });
    }
  }
  
  return newState;
};

/**
 * Generate workflow steps from domain template
 */
const generateWorkflowFromDomain = (domain: DomainTemplate): WorkflowStep[] => {
  const steps: WorkflowStep[] = [];
  
  // Add trigger
  if (domain.triggers.length > 0) {
    steps.push({
      id: `step-${steps.length + 1}`,
      text: domain.triggers[0],
      type: 'start',
      number: steps.length + 1,
      name: domain.triggers[0]
    });
  }
  
  // Add common steps
  domain.commonSteps.forEach((stepText, index) => {
    const isDecision = stepText.toLowerCase().includes('approve') || 
                       stepText.toLowerCase().includes('check') ||
                       stepText.includes('?');
    
    steps.push({
      id: `step-${steps.length + 1}`,
      text: stepText,
      type: isDecision ? 'decision' : 'process',
      number: steps.length + 1,
      name: stepText
    });
  });
  
  // Add completion
  if (domain.communications.length > 0) {
    const lastComm = domain.communications[domain.communications.length - 1];
    steps.push({
      id: `step-${steps.length + 1}`,
      text: lastComm,
      type: 'end',
      number: steps.length + 1,
      name: lastComm
    });
  }
  
  return steps;
};

/**
 * Generate additional steps based on user modification
 */
const generateAdditionalSteps = (
  modification: string,
  domain: DomainTemplate | null
): WorkflowStep[] => {
  const steps: WorkflowStep[] = [];
  const lowerMod = modification.toLowerCase();
  
  // Check if domain has industry-specific knowledge
  if (domain?.industrySpecific) {
    for (const [key, specificSteps] of Object.entries(domain.industrySpecific)) {
      if (lowerMod.includes(key)) {
        specificSteps.forEach(stepText => {
          steps.push({
            id: `step-added-${Date.now()}-${steps.length}`,
            text: stepText,
            type: 'process',
            number: 0, // Will be renumbered
            name: stepText
          });
        });
        return steps;
      }
    }
  }
  
  // Generic additions based on keywords
  if (lowerMod.includes('warranty')) {
    steps.push({
      id: `step-added-${Date.now()}`,
      text: 'Check warranty status',
      type: 'decision',
      number: 0,
      name: 'Check warranty'
    });
    steps.push({
      id: `step-added-${Date.now()}-2`,
      text: 'Process warranty claim if applicable',
      type: 'process',
      number: 0,
      name: 'Process warranty'
    });
  }
  
  if (lowerMod.includes('approval') || lowerMod.includes('authorize')) {
    steps.push({
      id: `step-added-${Date.now()}`,
      text: 'Get management approval',
      type: 'decision',
      number: 0,
      name: 'Get approval'
    });
  }
  
  if (lowerMod.includes('notification') || lowerMod.includes('notify')) {
    steps.push({
      id: `step-added-${Date.now()}`,
      text: `Notify relevant parties about ${modification}`,
      type: 'process',
      number: 0,
      name: 'Send notification'
    });
  }
  
  // If no specific match, create generic step
  if (steps.length === 0) {
    steps.push({
      id: `step-added-${Date.now()}`,
      text: `Handle ${modification}`,
      type: 'process',
      number: 0,
      name: modification
    });
  }
  
  return steps;
};

/**
 * Insert steps intelligently into workflow
 */
const insertStepsIntelligently = (
  existingSteps: WorkflowStep[],
  newSteps: WorkflowStep[],
  context: string
): WorkflowStep[] => {
  const lowerContext = context.toLowerCase();
  
  // Try to find best insertion point
  let insertIndex = existingSteps.length - 1; // Default: before last step
  
  // After diagnosis
  if (lowerContext.includes('diagnos') || lowerContext.includes('assessment')) {
    insertIndex = existingSteps.findIndex(s => 
      s.text.toLowerCase().includes('diagnos') || 
      s.text.toLowerCase().includes('assess')
    );
    if (insertIndex >= 0) insertIndex += 1;
  }
  
  // Before approval
  if (lowerContext.includes('before approval') || lowerContext.includes('estimate')) {
    insertIndex = existingSteps.findIndex(s => 
      s.text.toLowerCase().includes('approval') || 
      s.text.toLowerCase().includes('estimate')
    );
  }
  
  // After repair
  if (lowerContext.includes('after repair') || lowerContext.includes('after fix')) {
    insertIndex = existingSteps.findIndex(s => 
      s.text.toLowerCase().includes('repair') || 
      s.text.toLowerCase().includes('fix')
    );
    if (insertIndex >= 0) insertIndex += 1;
  }
  
  // Insert new steps
  const result = [...existingSteps];
  result.splice(insertIndex, 0, ...newSteps);
  
  // Renumber all steps
  return result.map((step, index) => ({
    ...step,
    number: index + 1,
    id: step.id.includes('added') ? step.id : `step-${index + 1}`
  }));
};

/**
 * Extract modification from user input
 */
const extractModification = (input: string): string => {
  const lowerInput = input.toLowerCase();
  
  // Remove command words
  let modification = input
    .replace(/add steps for/i, '')
    .replace(/add/i, '')
    .replace(/remove/i, '')
    .replace(/include/i, '')
    .trim();
  
  return modification;
};

/**
 * Check if workflow is complete
 */
export const isWorkflowComplete = (state: BuilderState): boolean => {
  return state.stage === 'complete' && state.generatedSteps.length > 0;
};

