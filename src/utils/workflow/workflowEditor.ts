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
}

/**
 * Parse workflow steps from SOP text
 */
export const parseSteps = (sopText: string): WorkflowStep[] => {
  if (!sopText || typeof sopText !== 'string') return [];
  
  const lines = sopText.split('\n').filter(line => line.trim());
  const steps: WorkflowStep[] = [];
  
  lines.forEach(line => {
    // Match numbered steps like "1. Step text" or "1) Step text"
    const match = line.match(/^\s*(\d+)[\.\)]\s*(.+)$/);
    if (match) {
      const text = match[2].trim();
      
      // Detect step type
      let type = 'task';
      if (text.toLowerCase().includes('if ') || text.includes('?')) {
        type = 'decision';
      } else if (text.toLowerCase().includes('start') || text.toLowerCase().includes('begin')) {
        type = 'start';
      } else if (text.toLowerCase().includes('end') || text.toLowerCase().includes('complete')) {
        type = 'end';
      }
      
      steps.push({
        id: `step-${parseInt(match[1])}`,
        number: parseInt(match[1]),
        text,
        name: text,
        type,
        originalLine: line
      });
    }
  });
  
  return steps;
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


