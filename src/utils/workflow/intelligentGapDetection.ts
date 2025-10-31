/**
 * Intelligent Gap Detection
 * Two-tier system:
 * 1. Internal Gap Detection - from workflow's own logic
 * 2. Industry Best Practices - external suggestions (optional)
 */

import { WorkflowStep } from './workflowEditor';

export interface GapAnalysis {
  internalGaps: {
    missingSteps: GapSuggestion[];
    summary: {
      total: number;
      critical: number;
      important: number;
    };
  };
  industryPractices: IndustryPractices | null;
}

interface GapSuggestion {
  position: number;
  suggestion: string;
  reason: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  type: string;
  description: string;
  impact: string;
  source: 'YOUR_WORKFLOW_LOGIC';
}

interface IndustryPractices {
  industry: string;
  industryName: string;
  warning: string;
  disclaimer: string;
  practices: IndustryPractice[];
}

interface IndustryPractice {
  step: string;
  priority: string;
  reason: string;
  commonlyUsedBy: string;
  source: 'EXTERNAL_INDUSTRY_STANDARD';
}

export const detectInternalGaps = (steps: WorkflowStep[]): GapAnalysis['internalGaps'] => {
  const missingSteps: GapSuggestion[] = [];
  const stepTexts = steps.map(s => (s.text || '').toLowerCase());
  
  // CRITICAL GAPS - Break workflow logic
  
  // Hygiene gaps - specific missing steps in hygiene workflows
  const hasToiletUse = stepTexts.some(s => 
    s.includes('poop') || s.includes('pee') || s.includes('toilet') || s.includes('bathroom')
  );
  const hasFlush = stepTexts.some(s => 
    s.includes('flush') || s.includes('flush toilet')
  );
  
  if (hasToiletUse && !hasFlush) {
    missingSteps.push({
      position: steps.length,
      suggestion: 'Flush the toilet',
      reason: 'Based on YOUR workflow: You used the toilet but never flushed it',
      priority: 'CRITICAL',
      type: 'missing-toilet-flush',
      description: 'Your workflow includes toilet use but missing the flush step',
      impact: 'Unhygienic and unsanitary conditions',
      source: 'YOUR_WORKFLOW_LOGIC'
    });
  }
  
  // Wiping without proper disposal
  const hasWiping = stepTexts.some(s => 
    s.includes('wipe') || s.includes('toilet paper')
  );
  const hasDisposal = stepTexts.some(s => 
    s.includes('dispose') || s.includes('throw away') || s.includes('trash')
  );
  
  if (hasWiping && !hasDisposal) {
    missingSteps.push({
      position: steps.length,
      suggestion: 'Dispose of toilet paper properly',
      reason: 'Based on YOUR workflow: You wiped but never disposed of the toilet paper',
      priority: 'HIGH',
      type: 'missing-disposal',
      description: 'Your workflow includes wiping but missing proper disposal',
      impact: 'Unhygienic bathroom conditions',
      source: 'YOUR_WORKFLOW_LOGIC'
    });
  }
  
  // Eating without washing hands before
  const hasEating = stepTexts.some(s => 
    /\beat\b/.test(s) || /\beating\b/.test(s) || /\bfood\b/.test(s) || /\bmeal\b/.test(s)
  );
  const hasHandWashingBefore = stepTexts.some((s, index) => 
    (s.includes('wash') || s.includes('cleanse')) && 
    s.includes('hand') && 
    index < stepTexts.findIndex(step => /\beat\b/.test(step) || /\beating\b/.test(step) || /\bfood\b/.test(step))
  );
  
  if (hasEating && !hasHandWashingBefore) {
    missingSteps.push({
      position: 0,
      suggestion: 'Wash hands before eating',
      reason: 'Based on YOUR workflow: You eat food but never wash your hands first',
      priority: 'HIGH',
      type: 'missing-pre-eating-hygiene',
      description: 'Your workflow includes eating but missing hand washing before',
      impact: 'Risk of ingesting germs and bacteria',
      source: 'YOUR_WORKFLOW_LOGIC'
    });
  }
  
  // Data entry without verification
  const hasDataEntry = stepTexts.some(s =>
    s.includes('enter') || s.includes('input') || s.includes('type') || s.includes('collect')
  );
  const hasVerification = stepTexts.some(s =>
    s.includes('verify') || s.includes('validate') || s.includes('check') || s.includes('confirm')
  );
  
  if (hasDataEntry && !hasVerification) {
    missingSteps.push({
      position: steps.length,
      suggestion: 'Verify entered data',
      reason: 'Based on YOUR workflow: Unverified data can cause errors downstream',
      priority: 'CRITICAL',
      type: 'missing-verification',
      description: 'Your workflow collects data but never verifies its accuracy',
      impact: 'High risk of data errors propagating through workflow',
      source: 'YOUR_WORKFLOW_LOGIC'
    });
  }
  
  // Payment without confirmation
  const hasPayment = stepTexts.some(s =>
    s.includes('pay') || s.includes('charge') || s.includes('transaction')
  );
  const hasConfirmation = stepTexts.some(s =>
    (s.includes('confirm') || s.includes('notify') || s.includes('send')) &&
    (s.includes('email') || s.includes('notification') || s.includes('message'))
  );
  
  if (hasPayment && !hasConfirmation) {
    missingSteps.push({
      position: steps.length,
      suggestion: 'Send payment confirmation',
      reason: 'Based on YOUR workflow: Customer needs payment confirmation for records',
      priority: 'CRITICAL',
      type: 'missing-confirmation',
      description: 'Your workflow processes payments but does not confirm with customer',
      impact: 'Customer confusion and potential disputes',
      source: 'YOUR_WORKFLOW_LOGIC'
    });
  }
  
  // Approval without submission
  const hasApproval = stepTexts.some(s =>
    s.includes('approve') || s.includes('review') || s.includes('sign off')
  );
  const hasSubmission = stepTexts.some(s =>
    s.includes('submit') || s.includes('send for') || s.includes('request')
  );
  
  if (hasApproval && !hasSubmission) {
    missingSteps.push({
      position: 0,
      suggestion: 'Submit for approval',
      reason: 'Based on YOUR workflow: Need something to approve',
      priority: 'CRITICAL',
      type: 'missing-submission',
      description: 'Your workflow has approval but nothing being submitted',
      impact: 'Approval process cannot function',
      source: 'YOUR_WORKFLOW_LOGIC'
    });
  }
  
  // HIGH PRIORITY GAPS
  
  // Error handling for complex processes
  const hasComplexProcess = stepTexts.some(s =>
    s.includes('process') || s.includes('calculate') || s.includes('integrate')
  );
  const hasErrorHandling = stepTexts.some(s =>
    s.includes('error') || s.includes('fail') || s.includes('exception') || s.includes('if failed')
  );
  
  if (hasComplexProcess && !hasErrorHandling && steps.length > 5) {
    missingSteps.push({
      position: steps.length,
      suggestion: 'Add error handling (e.g., "If error, notify administrator")',
      reason: 'Based on YOUR workflow: Complex processes can fail',
      priority: 'HIGH',
      type: 'missing-error-handling',
      description: 'Your workflow has processing steps but no error handling',
      impact: 'Workflow may break without recovery path',
      source: 'YOUR_WORKFLOW_LOGIC'
    });
  }
  
  // MEDIUM PRIORITY GAPS
  
  // No clear start
  const hasExplicitStart = stepTexts.some(s =>
    s.includes('start') || s.includes('begin') || s.includes('receive') || s.includes('open')
  );
  
  if (!hasExplicitStart && steps.length > 3) {
    missingSteps.push({
      position: 0,
      suggestion: 'Add trigger (e.g., "Receive customer order")',
      reason: 'Based on YOUR workflow: Workflows should have clear triggers',
      priority: 'MEDIUM',
      type: 'missing-initialization',
      description: 'Your workflow jumps into action without defining what triggers it',
      impact: 'Unclear when workflow should begin',
      source: 'YOUR_WORKFLOW_LOGIC'
    });
  }
  
  // No clear end
  const hasExplicitEnd = stepTexts.some(s =>
    s.includes('close') || s.includes('complete') || s.includes('finish') || s.includes('end')
  );
  
  if (!hasExplicitEnd && steps.length > 3) {
    missingSteps.push({
      position: steps.length,
      suggestion: 'Add completion (e.g., "Close case")',
      reason: 'Based on YOUR workflow: Workflows should have clear endings',
      priority: 'MEDIUM',
      type: 'missing-finalization',
      description: 'Your workflow has no defined completion point',
      impact: 'Unclear when workflow is done',
      source: 'YOUR_WORKFLOW_LOGIC'
    });
  }
  
  // Customer communication
  const hasCustomerAction = stepTexts.some(s => s.includes('customer') || s.includes('client'));
  const hasCommunication = stepTexts.some(s =>
    s.includes('notify') || s.includes('email') || s.includes('inform') || s.includes('contact')
  );
  
  if (hasCustomerAction && !hasCommunication && steps.length >= 4) {
    missingSteps.push({
      position: steps.length,
      suggestion: 'Notify customer of status',
      reason: 'Based on YOUR workflow: Customers mentioned but no communication',
      priority: 'MEDIUM',
      type: 'missing-communication',
      description: 'Your workflow involves customers but never communicates with them',
      impact: 'Poor customer experience',
      source: 'YOUR_WORKFLOW_LOGIC'
    });
  }
  
  // LOW PRIORITY GAPS
  
  // Documentation/logging for critical actions
  const hasCriticalAction = stepTexts.some(s =>
    s.includes('approve') || s.includes('delete') || s.includes('payment') || s.includes('close')
  );
  const hasLogging = stepTexts.some(s =>
    s.includes('log') || s.includes('record') || s.includes('document') || s.includes('save')
  );
  
  if (hasCriticalAction && !hasLogging && steps.length > 5) {
    missingSteps.push({
      position: steps.length,
      suggestion: 'Log action for audit trail',
      reason: 'Based on YOUR workflow: Critical actions should be logged',
      priority: 'LOW',
      type: 'missing-audit',
      description: 'Your workflow has important actions but no audit trail',
      impact: 'No record of what happened',
      source: 'YOUR_WORKFLOW_LOGIC'
    });
  }
  
  // Sort by priority
  const priorityOrder: Record<string, number> = { CRITICAL: 1, HIGH: 2, MEDIUM: 3, LOW: 4 };
  missingSteps.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  
  return {
    missingSteps,
    summary: {
      total: missingSteps.length,
      critical: missingSteps.filter(s => s.priority === 'CRITICAL').length,
      important: missingSteps.filter(s => s.priority === 'HIGH').length
    }
  };
};

/**
 * Detect workflow industry type
 */
const detectWorkflowIndustry = (steps: WorkflowStep[]): string => {
  const stepTexts = steps.map(s => (s.text || '').toLowerCase()).join(' ');
  
  if (stepTexts.includes('order') || stepTexts.includes('cart') ||
      stepTexts.includes('payment') || stepTexts.includes('ship')) {
    return 'ecommerce';
  }
  
  if (stepTexts.includes('patient') || stepTexts.includes('medical') ||
      stepTexts.includes('doctor') || stepTexts.includes('diagnosis')) {
    return 'healthcare';
  }
  
  if (stepTexts.includes('invoice') || stepTexts.includes('bill') ||
      stepTexts.includes('expense') || stepTexts.includes('reimbursement')) {
    return 'finance';
  }
  
  if (stepTexts.includes('employee') || stepTexts.includes('hire') ||
      stepTexts.includes('onboard') || stepTexts.includes('recruit')) {
    return 'hr';
  }
  
  if (stepTexts.includes('ticket') || stepTexts.includes('support') ||
      stepTexts.includes('complaint') || stepTexts.includes('issue')) {
    return 'customer-support';
  }
  
  return 'general';
};

/**
 * Get industry-specific best practices
 */
export const getIndustryBestPractices = (steps: WorkflowStep[]): IndustryPractices => {
  const industry = detectWorkflowIndustry(steps);
  
  const industryNames: Record<string, string> = {
    'ecommerce': 'E-Commerce / Online Retail',
    'healthcare': 'Healthcare / Medical',
    'finance': 'Finance / Accounting',
    'hr': 'Human Resources',
    'customer-support': 'Customer Support / Service',
    'general': 'General Business Process'
  };
  
  const basePractices: IndustryPractices = {
    industry,
    industryName: industryNames[industry] || 'General',
    warning: '⚠️ THESE ARE EXTERNAL SUGGESTIONS - NOT FROM YOUR DOCUMENT',
    disclaimer: 'These are general industry standards. Your specific process may differ.',
    practices: []
  };
  
  switch (industry) {
    case 'ecommerce':
      basePractices.practices = [
        {
          step: 'Fraud detection check',
          priority: 'HIGH',
          reason: 'Industry standard: Prevent fraudulent transactions',
          commonlyUsedBy: '85% of e-commerce companies',
          source: 'EXTERNAL_INDUSTRY_STANDARD'
        },
        {
          step: 'Inventory verification before shipping',
          priority: 'MEDIUM',
          reason: 'Industry standard: Prevent overselling',
          commonlyUsedBy: '78% of e-commerce companies',
          source: 'EXTERNAL_INDUSTRY_STANDARD'
        }
      ];
      break;
      
    case 'finance':
      basePractices.practices = [
        {
          step: 'Dual approval for transactions over threshold',
          priority: 'HIGH',
          reason: 'Industry standard: Prevent fraud',
          commonlyUsedBy: '85% of financial institutions',
          source: 'EXTERNAL_INDUSTRY_STANDARD'
        },
        {
          step: 'Audit trail logging',
          priority: 'HIGH',
          reason: 'Regulatory requirement: SOX compliance',
          commonlyUsedBy: '100% of public companies (required)',
          source: 'EXTERNAL_INDUSTRY_STANDARD'
        }
      ];
      break;
      
    case 'hr':
      basePractices.practices = [
        {
          step: 'Background check',
          priority: 'HIGH',
          reason: 'Industry standard: Verify candidate information',
          commonlyUsedBy: '80% of companies',
          source: 'EXTERNAL_INDUSTRY_STANDARD'
        }
      ];
      break;
      
    default:
      basePractices.practices = [
        {
          step: 'Error handling and recovery',
          priority: 'HIGH',
          reason: 'General best practice: Handle failures gracefully',
          commonlyUsedBy: 'Recommended for all workflows',
          source: 'EXTERNAL_INDUSTRY_STANDARD'
        }
      ];
  }
  
  return basePractices;
};


