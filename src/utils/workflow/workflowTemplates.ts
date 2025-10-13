/**
 * Workflow Templates System
 * Pre-built workflow templates for common business processes
 */

import { WorkflowStep } from './workflowEditor';

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  industry: string;
  steps: WorkflowStep[];
  estimatedTime: number;
  complexity: 'simple' | 'moderate' | 'complex';
  icon: string;
  tags: string[];
}

export const TEMPLATE_CATEGORIES = [
  'Customer Service',
  'Sales',
  'Human Resources',
  'Finance',
  'Operations',
  'IT & Technology',
  'Marketing',
  'General Business'
];

/**
 * Pre-built Workflow Templates
 */
export const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
  // Customer Service Templates
  {
    id: 'customer-onboarding',
    name: 'Customer Onboarding',
    description: 'Standard process for onboarding new customers',
    category: 'Customer Service',
    industry: 'General',
    complexity: 'moderate',
    estimatedTime: 30,
    icon: '👋',
    tags: ['customer', 'onboarding', 'welcome'],
    steps: [
      { id: '1', text: 'Receive new customer registration', type: 'start', name: 'Start' },
      { id: '2', text: 'Verify customer information and documentation', type: 'process', name: 'Verify Info' },
      { id: '3', text: 'Create customer account in system', type: 'process', name: 'Create Account' },
      { id: '4', text: 'Send welcome email with login credentials', type: 'process', name: 'Send Welcome Email' },
      { id: '5', text: 'Assign account manager', type: 'process', name: 'Assign Manager' },
      { id: '6', text: 'Schedule onboarding call', type: 'process', name: 'Schedule Call' },
      { id: '7', text: 'Conduct onboarding training session', type: 'process', name: 'Training' },
      { id: '8', text: 'Customer onboarding complete', type: 'end', name: 'Complete' }
    ]
  },
  {
    id: 'customer-complaint',
    name: 'Customer Complaint Resolution',
    description: 'Handle and resolve customer complaints effectively',
    category: 'Customer Service',
    industry: 'General',
    complexity: 'moderate',
    estimatedTime: 45,
    icon: '🎧',
    tags: ['complaint', 'support', 'resolution'],
    steps: [
      { id: '1', text: 'Receive customer complaint', type: 'start', name: 'Receive Complaint' },
      { id: '2', text: 'Log complaint details in system', type: 'process', name: 'Log Complaint' },
      { id: '3', text: 'Acknowledge complaint to customer within 24 hours', type: 'process', name: 'Acknowledge' },
      { id: '4', text: 'Investigate issue and gather facts', type: 'process', name: 'Investigate' },
      { id: '5', text: 'Is this a critical issue?', type: 'decision', name: 'Critical?' },
      { id: '6', text: 'Escalate to manager immediately', type: 'process', name: 'Escalate' },
      { id: '7', text: 'Develop resolution plan', type: 'process', name: 'Create Plan' },
      { id: '8', text: 'Implement solution', type: 'process', name: 'Implement' },
      { id: '9', text: 'Contact customer with resolution', type: 'process', name: 'Notify Customer' },
      { id: '10', text: 'Follow up after 48 hours for satisfaction', type: 'process', name: 'Follow Up' },
      { id: '11', text: 'Close complaint ticket', type: 'end', name: 'Close' }
    ]
  },
  
  // Sales Templates
  {
    id: 'sales-lead-qualification',
    name: 'Sales Lead Qualification',
    description: 'Qualify and prioritize sales leads',
    category: 'Sales',
    industry: 'General',
    complexity: 'simple',
    estimatedTime: 20,
    icon: '💰',
    tags: ['sales', 'leads', 'qualification'],
    steps: [
      { id: '1', text: 'Receive new lead', type: 'start', name: 'New Lead' },
      { id: '2', text: 'Review lead information', type: 'process', name: 'Review' },
      { id: '3', text: 'Check if lead meets basic criteria (budget, authority, need, timeline)', type: 'decision', name: 'BANT Check' },
      { id: '4', text: 'Mark as unqualified and add to nurture campaign', type: 'process', name: 'Nurture' },
      { id: '5', text: 'Assign priority score (hot/warm/cold)', type: 'process', name: 'Score Lead' },
      { id: '6', text: 'Assign to appropriate sales rep', type: 'process', name: 'Assign Rep' },
      { id: '7', text: 'Schedule initial contact within 24 hours', type: 'process', name: 'Schedule Contact' },
      { id: '8', text: 'Lead qualification complete', type: 'end', name: 'Complete' }
    ]
  },
  
  // HR Templates
  {
    id: 'employee-onboarding',
    name: 'Employee Onboarding',
    description: 'Comprehensive new employee onboarding process',
    category: 'Human Resources',
    industry: 'General',
    complexity: 'complex',
    estimatedTime: 120,
    icon: '👤',
    tags: ['hr', 'onboarding', 'employee'],
    steps: [
      { id: '1', text: 'New hire accepts offer', type: 'start', name: 'Offer Accepted' },
      { id: '2', text: 'Send pre-boarding paperwork', type: 'process', name: 'Send Paperwork' },
      { id: '3', text: 'Set up IT accounts and equipment', type: 'process', name: 'IT Setup' },
      { id: '4', text: 'Prepare workspace and access badges', type: 'process', name: 'Workspace' },
      { id: '5', text: 'Schedule orientation session', type: 'process', name: 'Schedule Orientation' },
      { id: '6', text: 'First day: Welcome and orientation', type: 'process', name: 'Day 1' },
      { id: '7', text: 'Complete HR paperwork and compliance training', type: 'process', name: 'Compliance' },
      { id: '8', text: 'Assign mentor or buddy', type: 'process', name: 'Assign Mentor' },
      { id: '9', text: 'Week 1: Department training', type: 'process', name: 'Training Week 1' },
      { id: '10', text: 'Week 2-4: Job-specific training', type: 'process', name: 'Job Training' },
      { id: '11', text: '30-day check-in with manager', type: 'process', name: '30-Day Check' },
      { id: '12', text: '90-day performance review', type: 'process', name: '90-Day Review' },
      { id: '13', text: 'Onboarding complete', type: 'end', name: 'Complete' }
    ]
  },
  
  // Finance Templates
  {
    id: 'invoice-processing',
    name: 'Invoice Processing',
    description: 'Process and approve vendor invoices for payment',
    category: 'Finance',
    industry: 'General',
    complexity: 'moderate',
    estimatedTime: 25,
    icon: '💳',
    tags: ['finance', 'invoice', 'payment'],
    steps: [
      { id: '1', text: 'Receive invoice from vendor', type: 'start', name: 'Receive Invoice' },
      { id: '2', text: 'Verify invoice details match purchase order', type: 'process', name: 'Verify PO' },
      { id: '3', text: 'Does invoice match PO?', type: 'decision', name: 'Match?' },
      { id: '4', text: 'Contact vendor to resolve discrepancy', type: 'process', name: 'Resolve Issue' },
      { id: '5', text: 'Code invoice to correct account', type: 'process', name: 'Code Invoice' },
      { id: '6', text: 'Route for department approval', type: 'process', name: 'Get Approval' },
      { id: '7', text: 'Is amount over $10,000?', type: 'decision', name: 'High Value?' },
      { id: '8', text: 'Get CFO approval', type: 'process', name: 'CFO Approval' },
      { id: '9', text: 'Enter into payment system', type: 'process', name: 'Enter Payment' },
      { id: '10', text: 'Schedule payment according to terms', type: 'process', name: 'Schedule' },
      { id: '11', text: 'Process payment', type: 'process', name: 'Pay' },
      { id: '12', text: 'Send payment confirmation to vendor', type: 'process', name: 'Confirm' },
      { id: '13', text: 'File invoice and close', type: 'end', name: 'Complete' }
    ]
  },
  
  // IT Templates
  {
    id: 'it-helpdesk-ticket',
    name: 'IT Helpdesk Ticket Resolution',
    description: 'Handle and resolve IT support tickets',
    category: 'IT & Technology',
    industry: 'Technology',
    complexity: 'simple',
    estimatedTime: 30,
    icon: '💻',
    tags: ['it', 'helpdesk', 'support'],
    steps: [
      { id: '1', text: 'User submits support ticket', type: 'start', name: 'Ticket Submitted' },
      { id: '2', text: 'Auto-assign ticket number and priority', type: 'process', name: 'Assign Number' },
      { id: '3', text: 'IT support reviews ticket', type: 'process', name: 'Review' },
      { id: '4', text: 'Is this a critical system issue?', type: 'decision', name: 'Critical?' },
      { id: '5', text: 'Escalate to senior technician immediately', type: 'process', name: 'Escalate' },
      { id: '6', text: 'Attempt remote resolution', type: 'process', name: 'Remote Fix' },
      { id: '7', text: 'Can issue be resolved remotely?', type: 'decision', name: 'Remote Success?' },
      { id: '8', text: 'Schedule on-site visit', type: 'process', name: 'Schedule Visit' },
      { id: '9', text: 'Document solution in knowledge base', type: 'process', name: 'Document' },
      { id: '10', text: 'Notify user of resolution', type: 'process', name: 'Notify User' },
      { id: '11', text: 'Request user confirmation', type: 'process', name: 'Confirm' },
      { id: '12', text: 'Close ticket', type: 'end', name: 'Close' }
    ]
  },
  
  // Operations Templates
  {
    id: 'purchase-order',
    name: 'Purchase Order Creation',
    description: 'Create and approve purchase orders',
    category: 'Operations',
    industry: 'General',
    complexity: 'moderate',
    estimatedTime: 20,
    icon: '📦',
    tags: ['purchasing', 'procurement', 'orders'],
    steps: [
      { id: '1', text: 'Department submits purchase request', type: 'start', name: 'Request' },
      { id: '2', text: 'Verify budget availability', type: 'process', name: 'Check Budget' },
      { id: '3', text: 'Get quotes from vendors (minimum 3)', type: 'process', name: 'Get Quotes' },
      { id: '4', text: 'Select best vendor based on price and quality', type: 'process', name: 'Select Vendor' },
      { id: '5', text: 'Create purchase order in system', type: 'process', name: 'Create PO' },
      { id: '6', text: 'Is amount over approval threshold?', type: 'decision', name: 'Needs Approval?' },
      { id: '7', text: 'Route for manager approval', type: 'process', name: 'Get Approval' },
      { id: '8', text: 'Send PO to vendor', type: 'process', name: 'Send PO' },
      { id: '9', text: 'Vendor confirms order', type: 'process', name: 'Confirm' },
      { id: '10', text: 'Track delivery status', type: 'process', name: 'Track' },
      { id: '11', text: 'Receive and verify goods', type: 'process', name: 'Receive' },
      { id: '12', text: 'Close PO', type: 'end', name: 'Complete' }
    ]
  },
  
  // Marketing Templates
  {
    id: 'content-approval',
    name: 'Content Approval Workflow',
    description: 'Review and approve marketing content before publication',
    category: 'Marketing',
    industry: 'General',
    complexity: 'simple',
    estimatedTime: 15,
    icon: '📝',
    tags: ['marketing', 'content', 'approval'],
    steps: [
      { id: '1', text: 'Content creator submits draft', type: 'start', name: 'Submit Draft' },
      { id: '2', text: 'Marketing manager reviews content', type: 'process', name: 'Review' },
      { id: '3', text: 'Check brand guidelines compliance', type: 'process', name: 'Brand Check' },
      { id: '4', text: 'Does content meet standards?', type: 'decision', name: 'Approved?' },
      { id: '5', text: 'Request revisions from creator', type: 'process', name: 'Revise' },
      { id: '6', text: 'Legal review (if required)', type: 'process', name: 'Legal Review' },
      { id: '7', text: 'Final approval from director', type: 'process', name: 'Final Approval' },
      { id: '8', text: 'Schedule publication', type: 'process', name: 'Schedule' },
      { id: '9', text: 'Publish content', type: 'process', name: 'Publish' },
      { id: '10', text: 'Monitor performance', type: 'end', name: 'Monitor' }
    ]
  },
  
  // General Business Templates
  {
    id: 'meeting-management',
    name: 'Meeting Management',
    description: 'Plan, conduct, and follow up on business meetings',
    category: 'General Business',
    industry: 'General',
    complexity: 'simple',
    estimatedTime: 10,
    icon: '📅',
    tags: ['meeting', 'collaboration', 'productivity'],
    steps: [
      { id: '1', text: 'Identify meeting need and objectives', type: 'start', name: 'Plan' },
      { id: '2', text: 'Create agenda with topics and time allocations', type: 'process', name: 'Agenda' },
      { id: '3', text: 'Schedule meeting and send calendar invites', type: 'process', name: 'Schedule' },
      { id: '4', text: 'Send pre-read materials 24 hours in advance', type: 'process', name: 'Send Materials' },
      { id: '5', text: 'Conduct meeting following agenda', type: 'process', name: 'Conduct' },
      { id: '6', text: 'Take notes and document decisions', type: 'process', name: 'Document' },
      { id: '7', text: 'Assign action items with owners and deadlines', type: 'process', name: 'Action Items' },
      { id: '8', text: 'Distribute meeting notes within 24 hours', type: 'process', name: 'Share Notes' },
      { id: '9', text: 'Follow up on action items', type: 'end', name: 'Follow Up' }
    ]
  },
  
  {
    id: 'document-approval',
    name: 'Document Approval',
    description: 'Multi-level document review and approval process',
    category: 'General Business',
    industry: 'General',
    complexity: 'simple',
    estimatedTime: 15,
    icon: '📄',
    tags: ['document', 'approval', 'workflow'],
    steps: [
      { id: '1', text: 'Employee creates document', type: 'start', name: 'Create' },
      { id: '2', text: 'Self-review and spell check', type: 'process', name: 'Self Review' },
      { id: '3', text: 'Submit to supervisor for review', type: 'process', name: 'Submit' },
      { id: '4', text: 'Supervisor reviews and provides feedback', type: 'process', name: 'Supervisor Review' },
      { id: '5', text: 'Is document approved?', type: 'decision', name: 'Approved?' },
      { id: '6', text: 'Make requested revisions', type: 'process', name: 'Revise' },
      { id: '7', text: 'Route to department head for final approval', type: 'process', name: 'Final Review' },
      { id: '8', text: 'Archive approved document', type: 'process', name: 'Archive' },
      { id: '9', text: 'Distribute to stakeholders', type: 'end', name: 'Distribute' }
    ]
  }
];

/**
 * Get templates by category
 */
export const getTemplatesByCategory = (category: string): WorkflowTemplate[] => {
  return WORKFLOW_TEMPLATES.filter(t => t.category === category);
};

/**
 * Get templates by industry
 */
export const getTemplatesByIndustry = (industry: string): WorkflowTemplate[] => {
  return WORKFLOW_TEMPLATES.filter(t => t.industry === industry);
};

/**
 * Get template by ID
 */
export const getTemplateById = (id: string): WorkflowTemplate | undefined => {
  return WORKFLOW_TEMPLATES.find(t => t.id === id);
};

/**
 * Search templates by keyword
 */
export const searchTemplates = (keyword: string): WorkflowTemplate[] => {
  const lowerKeyword = keyword.toLowerCase();
  return WORKFLOW_TEMPLATES.filter(t => 
    t.name.toLowerCase().includes(lowerKeyword) ||
    t.description.toLowerCase().includes(lowerKeyword) ||
    t.tags.some(tag => tag.toLowerCase().includes(lowerKeyword))
  );
};

/**
 * Get popular templates (sorted by complexity - simpler ones first)
 */
export const getPopularTemplates = (limit: number = 5): WorkflowTemplate[] => {
  return WORKFLOW_TEMPLATES
    .sort((a, b) => {
      const complexityOrder = { 'simple': 1, 'moderate': 2, 'complex': 3 };
      return complexityOrder[a.complexity] - complexityOrder[b.complexity];
    })
    .slice(0, limit);
};

