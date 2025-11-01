/**
 * Workflow Editor Utility - Parse and apply workflow edit operations
 */

export interface WorkflowStep {
  id?: string;
  text: string;
  name?: string;
  type?: string;
  number?: number;
  originalLine?: string;
  // NEW: Hover tooltip details
  hoverDetails?: {
    title: string;
    items: string[];
    category?: string;
  };
}

/**
 * Detect if a step represents an implicit decision in intimate workflows
 */
const isIntimateDecisionStep = (text: string): boolean => {
  const lowerText = text.toLowerCase();
  
  // Intimate workflow decision patterns - steps that represent binary choices
  const intimateDecisionPatterns = [
    // Foreplay decisions
    /kiss.*next/i,
    /touch.*partner/i,
    /caress.*her/i,
    /foreplay/i,
    
    // Mood/consent decisions  
    /ask.*permission/i,
    /check.*consent/i,
    /verify.*comfort/i,
    
    // Intimacy decisions
    /insert.*vagina/i,
    /penetrat/i,
    /intimate.*relations/i,
    
    // Mood-setting decisions
    /play.*music/i,
    /have.*drink/i,
    /set.*mood/i,
    
    // Any step that implies a choice to continue or stop
    /next.*step/i,
    /continue.*with/i,
    /proceed.*to/i
  ];
  
  return intimateDecisionPatterns.some(pattern => pattern.test(lowerText));
};

/**
 * Parse workflow steps from SOP text with automatic hover details extraction
 */
export const parseSteps = (sopText: string): WorkflowStep[] => {
  if (!sopText || typeof sopText !== 'string') return [];
  
  const lines = sopText.split('\n').filter(line => line.trim());
  const steps: WorkflowStep[] = [];
  let currentStepIndex = -1;
  let currentStepDetails: string[] = [];
  
  lines.forEach((line, index) => {
    // Match numbered steps like "1. Step text" or "1) Step text"
    const match = line.match(/^\s*(\d+)[\.\)]\s*(.+)$/);
    if (match) {
      // Save previous step with its details
      if (currentStepIndex >= 0 && currentStepDetails.length > 0) {
        steps[currentStepIndex].hoverDetails = {
          title: steps[currentStepIndex].text,
          category: getStepCategory(steps[currentStepIndex].text),
          items: currentStepDetails
        };
      }
      
      const text = match[2].trim();
      
      // Detect step type
      let type = 'task';
      if (text.toLowerCase().includes('if ') || text.includes('?') || 
          text.toLowerCase().includes('decision point') || 
          text.toLowerCase().includes('qualification')) {
        type = 'decision';
      } else if (text.toLowerCase().includes('start') || text.toLowerCase().includes('begin')) {
        type = 'start';
      } else if (text.toLowerCase().includes('end') || text.toLowerCase().includes('complete')) {
        type = 'end';
      } else if (isIntimateDecisionStep(text)) {
        type = 'decision';
      }
      
      steps.push({
        id: `step-${parseInt(match[1])}`,
        number: parseInt(match[1]),
        text,
        name: text,
        type,
        originalLine: line
      });
      
      currentStepIndex = steps.length - 1;
      currentStepDetails = [];
    } else {
      // Check for bullet points or sub-items under the current step
      const bulletMatch = line.match(/^\s*[•\-\*]\s*(.+)$/);
      const subItemMatch = line.match(/^\s*o\s*(.+)$/);
      
      if ((bulletMatch || subItemMatch) && currentStepIndex >= 0) {
        const detailText = (bulletMatch?.[1] || subItemMatch?.[1] || '').trim();
        if (detailText) {
          currentStepDetails.push(detailText);
        }
      }
    }
  });
  
  // Save the last step's details
  if (currentStepIndex >= 0 && currentStepDetails.length > 0) {
    steps[currentStepIndex].hoverDetails = {
      title: steps[currentStepIndex].text,
      category: getStepCategory(steps[currentStepIndex].text),
      items: currentStepDetails
    };
  }
  
  return steps;
};

/**
 * Determine step category based on step text
 */
const getStepCategory = (stepText: string): string => {
  const text = stepText.toLowerCase();
  
  if (text.includes('qualification') || text.includes('review') || text.includes('assess')) {
    return 'Assessment';
  } else if (text.includes('email') || text.includes('send') || text.includes('notify')) {
    return 'Communication';
  } else if (text.includes('create') || text.includes('setup') || text.includes('configure')) {
    return 'System Setup';
  } else if (text.includes('verify') || text.includes('check') || text.includes('validate')) {
    return 'Verification';
  } else if (text.includes('decision') || text.includes('if') || text.includes('qualify')) {
    return 'Decision Point';
  } else {
    return 'Process';
  }
};

/**
 * Convert steps array back to SOP text
 */
export const stepsToText = (steps: WorkflowStep[]): string => {
  return steps.map((step, idx) => `${idx + 1}. ${step.text}`).join('\n');
};

/**
 * Add a step at specified position
 */
export const addStep = (steps: WorkflowStep[], stepText: string, position: number = 0): WorkflowStep[] => {
  const newSteps = [...steps];
  const newStep: WorkflowStep = { text: stepText };
  
  if (position === 0 || position > steps.length) {
    newSteps.push(newStep);
  } else {
    newSteps.splice(position - 1, 0, newStep);
  }
  
  return newSteps;
};

/**
 * Remove a step by number
 */
export const removeStep = (steps: WorkflowStep[], stepNumber: number): WorkflowStep[] => {
  const newSteps = [...steps];
  if (stepNumber >= 1 && stepNumber <= steps.length) {
    newSteps.splice(stepNumber - 1, 1);
  }
  return newSteps;
};

/**
 * Move a step to a new position
 */
export const moveStep = (steps: WorkflowStep[], fromPosition: number, toPosition: number): WorkflowStep[] => {
  const newSteps = [...steps];
  
  if (fromPosition >= 1 && fromPosition <= steps.length &&
      toPosition >= 1 && toPosition <= steps.length &&
      fromPosition !== toPosition) {
    const [movedStep] = newSteps.splice(fromPosition - 1, 1);
    newSteps.splice(toPosition - 1, 0, movedStep);
  }
  
  return newSteps;
};

/**
 * Edit/rename a step
 */
export const editStep = (steps: WorkflowStep[], stepNumber: number, newText: string): WorkflowStep[] => {
  const newSteps = [...steps];
  if (stepNumber >= 1 && stepNumber <= steps.length) {
    newSteps[stepNumber - 1] = { ...newSteps[stepNumber - 1], text: newText };
  }
  return newSteps;
};

/**
 * Merge two consecutive steps
 */
export const mergeSteps = (steps: WorkflowStep[], step1Number: number, step2Number: number): WorkflowStep[] => {
  if (step1Number >= 1 && step2Number >= 1 && 
      step1Number <= steps.length && step2Number <= steps.length &&
      step1Number !== step2Number) {
    const newSteps = [...steps];
    const mergedText = `${newSteps[step1Number - 1].text} AND ${newSteps[step2Number - 1].text}`;
    newSteps[step1Number - 1] = { ...newSteps[step1Number - 1], text: mergedText };
    newSteps.splice(step2Number - 1, 1);
    return newSteps;
  }
  return steps;
};

/**
 * Split a step into two
 */
export const splitStep = (steps: WorkflowStep[], stepNumber: number, part1: string, part2: string): WorkflowStep[] => {
  if (stepNumber >= 1 && stepNumber <= steps.length) {
    const newSteps = [...steps];
    newSteps[stepNumber - 1] = { ...newSteps[stepNumber - 1], text: part1 };
    newSteps.splice(stepNumber, 0, { text: part2 });
    return newSteps;
  }
  return steps;
};

/**
 * Apply edit command to workflow
 */
export const applyEdit = (steps: WorkflowStep[], command: string): WorkflowStep[] => {
  const cmd = command.toLowerCase().trim();
  
  // Add step: "add [text] at [position]"
  const addMatch = cmd.match(/^add (.+?) at (\d+)$/i);
  if (addMatch) {
    return addStep(steps, addMatch[1], parseInt(addMatch[2]));
  }
  
  // Remove step: "remove step [number]"
  const removeMatch = cmd.match(/^remove step (\d+)$/i);
  if (removeMatch) {
    return removeStep(steps, parseInt(removeMatch[1]));
  }
  
  // Move step: "move step [from] to [to]"
  const moveMatch = cmd.match(/^move step (\d+) to (\d+)$/i);
  if (moveMatch) {
    return moveStep(steps, parseInt(moveMatch[1]), parseInt(moveMatch[2]));
  }
  
  // Edit step: "edit step [number] to [text]"
  const editMatch = cmd.match(/^edit step (\d+) to (.+)$/i);
  if (editMatch) {
    return editStep(steps, parseInt(editMatch[1]), editMatch[2]);
  }
  
  return steps;
};


