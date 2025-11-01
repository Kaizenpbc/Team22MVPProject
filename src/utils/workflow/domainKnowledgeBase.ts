/**
 * Domain Knowledge Base
 * Pre-built workflow templates and industry best practices
 * for the AI Workflow Builder Assistant
 */

export interface DomainTemplate {
  name: string;
  description: string;
  triggers: string[];
  commonSteps: string[];
  decisions: string[];
  communications: string[];
  industrySpecific?: {
    [key: string]: string[];
  };
}

export const DOMAIN_KNOWLEDGE: { [key: string]: DomainTemplate } = {
  automotive: {
    name: "Automotive Repair Shop",
    description: "Vehicle repair and maintenance services",
    triggers: [
      "Customer calls with problem",
      "Customer brings vehicle in",
      "Vehicle arrives for scheduled service"
    ],
    commonSteps: [
      "Record customer and vehicle information",
      "Perform initial inspection",
      "Diagnose issue",
      "Check parts availability",
      "Create repair estimate",
      "Get customer approval",
      "Perform repairs",
      "Quality check inspection",
      "Road test vehicle",
      "Generate invoice",
      "Process payment",
      "Return vehicle to customer"
    ],
    decisions: [
      "Customer approves estimate?",
      "Parts in stock?",
      "Warranty applicable?",
      "Additional repairs needed?"
    ],
    communications: [
      "Notify customer of diagnosis",
      "Send estimate to customer",
      "Notify customer when ready",
      "Send receipt/invoice"
    ],
    industrySpecific: {
      warranty: [
        "Check warranty status",
        "Contact warranty provider",
        "Submit warranty claim",
        "Process warranty coverage"
      ],
      parts: [
        "Order parts from supplier",
        "Wait for parts delivery",
        "Verify parts received"
      ]
    }
  },

  healthcare: {
    name: "Healthcare Patient Care",
    description: "Patient admission, treatment, and discharge",
    triggers: [
      "Patient arrives at facility",
      "Patient scheduled for appointment",
      "Emergency admission"
    ],
    commonSteps: [
      "Patient check-in and registration",
      "Verify insurance information",
      "Initial assessment by nurse",
      "Doctor examination",
      "Order diagnostic tests",
      "Review test results",
      "Create treatment plan",
      "Administer treatment",
      "Monitor patient progress",
      "Discharge planning",
      "Patient education",
      "Schedule follow-up"
    ],
    decisions: [
      "Admission required?",
      "Additional tests needed?",
      "Specialist consultation required?",
      "Ready for discharge?"
    ],
    communications: [
      "Notify family members",
      "Send treatment plan to patient",
      "Provide discharge instructions",
      "Schedule follow-up appointment"
    ]
  },

  retail: {
    name: "Retail Order Fulfillment",
    description: "Processing and fulfilling customer orders",
    triggers: [
      "Customer places order online",
      "Order received in store",
      "Phone order placed"
    ],
    commonSteps: [
      "Receive customer order",
      "Verify payment information",
      "Check inventory availability",
      "Reserve items for order",
      "Pick items from warehouse",
      "Pack order securely",
      "Print shipping label",
      "Ship package",
      "Update order status",
      "Send tracking information"
    ],
    decisions: [
      "Items in stock?",
      "Payment approved?",
      "International shipping?",
      "Gift wrapping requested?"
    ],
    communications: [
      "Send order confirmation",
      "Notify of shipping",
      "Send tracking number",
      "Request feedback"
    ],
    industrySpecific: {
      returns: [
        "Process return request",
        "Generate return label",
        "Inspect returned items",
        "Issue refund"
      ]
    }
  },

  hr: {
    name: "HR Employee Onboarding",
    description: "New employee onboarding process",
    triggers: [
      "Job offer accepted",
      "New hire start date confirmed",
      "Contractor agreement signed"
    ],
    commonSteps: [
      "Create employee record",
      "Send welcome packet",
      "Collect required documents",
      "Set up workstation",
      "Create system accounts",
      "Assign equipment",
      "Schedule orientation",
      "Conduct first day orientation",
      "Assign buddy/mentor",
      "Enroll in benefits",
      "Complete required training",
      "Schedule 30-day check-in"
    ],
    decisions: [
      "All documents received?",
      "Background check cleared?",
      "Equipment available?",
      "Training completed?"
    ],
    communications: [
      "Send welcome email",
      "Share first day schedule",
      "Introduce to team",
      "Schedule regular check-ins"
    ]
  },

  manufacturing: {
    name: "Manufacturing Production",
    description: "Product manufacturing and quality assurance",
    triggers: [
      "Production order received",
      "Materials arrive",
      "Customer order placed"
    ],
    commonSteps: [
      "Review production order",
      "Check raw materials availability",
      "Set up production line",
      "Perform equipment checks",
      "Start production run",
      "Monitor production process",
      "Conduct in-process quality checks",
      "Complete production",
      "Final quality inspection",
      "Package finished goods",
      "Update inventory",
      "Ship to warehouse"
    ],
    decisions: [
      "Materials sufficient?",
      "Quality standards met?",
      "Equipment functioning?",
      "Rework required?"
    ],
    communications: [
      "Notify production manager",
      "Alert quality team",
      "Update inventory system",
      "Notify shipping department"
    ]
  },

  foodservice: {
    name: "Food Service Operations",
    description: "Restaurant food preparation and service",
    triggers: [
      "Customer places order",
      "Reservation confirmed",
      "Delivery request received"
    ],
    commonSteps: [
      "Receive order from customer",
      "Send order to kitchen",
      "Prepare ingredients",
      "Cook food items",
      "Plate and garnish",
      "Quality check",
      "Serve to customer",
      "Check customer satisfaction",
      "Clear table",
      "Process payment"
    ],
    decisions: [
      "Ingredients available?",
      "Special dietary requirements?",
      "Dine-in or takeout?",
      "Customer satisfied?"
    ],
    communications: [
      "Confirm order with customer",
      "Notify kitchen staff",
      "Update customer on wait time",
      "Send receipt"
    ],
    industrySpecific: {
      delivery: [
        "Assign delivery driver",
        "Package for delivery",
        "Track delivery",
        "Confirm delivery"
      ]
    }
  },

  finance: {
    name: "Financial Services",
    description: "Loan application and approval process",
    triggers: [
      "Customer submits application",
      "Pre-approval request received",
      "Refinance inquiry"
    ],
    commonSteps: [
      "Receive loan application",
      "Verify customer identity",
      "Check credit score",
      "Review financial documents",
      "Assess risk",
      "Calculate loan terms",
      "Submit for approval",
      "Notify customer of decision",
      "Prepare loan documents",
      "Sign agreements",
      "Disburse funds"
    ],
    decisions: [
      "Credit score acceptable?",
      "Income verification passed?",
      "Collateral required?",
      "Application approved?"
    ],
    communications: [
      "Send application confirmation",
      "Request additional documents",
      "Notify of decision",
      "Send closing instructions"
    ]
  },

  education: {
    name: "Educational Institution",
    description: "Student enrollment and registration",
    triggers: [
      "Application submitted",
      "Student accepted",
      "Registration period opens"
    ],
    commonSteps: [
      "Receive student application",
      "Review academic records",
      "Verify prerequisites",
      "Process admission decision",
      "Send acceptance letter",
      "Collect enrollment deposit",
      "Schedule orientation",
      "Register for classes",
      "Assign student ID",
      "Set up accounts",
      "Distribute course materials"
    ],
    decisions: [
      "Meets admission criteria?",
      "Financial aid needed?",
      "Housing required?",
      "Prerequisites met?"
    ],
    communications: [
      "Send application status",
      "Share acceptance letter",
      "Send orientation details",
      "Provide course schedule"
    ]
  },

  legal: {
    name: "Legal Services",
    description: "Law firm case management",
    triggers: [
      "Client consultation requested",
      "New case opened",
      "Legal matter referred"
    ],
    commonSteps: [
      "Initial client consultation",
      "Gather case information",
      "Perform conflict check",
      "Review applicable laws",
      "Develop case strategy",
      "File necessary documents",
      "Conduct legal research",
      "Prepare arguments",
      "Represent client",
      "Negotiate settlement",
      "Finalize case resolution",
      "Close case file"
    ],
    decisions: [
      "Accept case?",
      "Conflict of interest exists?",
      "Settlement acceptable?",
      "Proceed to trial?"
    ],
    communications: [
      "Send engagement letter",
      "Update client on progress",
      "Notify of court dates",
      "Send final case summary"
    ],
    industrySpecific: {
      billing: [
        "Track billable hours",
        "Generate invoice",
        "Process retainer payment"
      ]
    }
  },

  itsupport: {
    name: "IT Support / Help Desk",
    description: "Technical support and troubleshooting",
    triggers: [
      "Support ticket submitted",
      "User calls help desk",
      "System alert received"
    ],
    commonSteps: [
      "Receive support request",
      "Log ticket in system",
      "Categorize issue priority",
      "Assign to technician",
      "Diagnose problem",
      "Research solution",
      "Implement fix",
      "Test resolution",
      "Document solution",
      "Update user",
      "Close ticket",
      "Follow up with user"
    ],
    decisions: [
      "Critical priority?",
      "Escalation required?",
      "Hardware replacement needed?",
      "User satisfied?"
    ],
    communications: [
      "Send ticket confirmation",
      "Notify of assignment",
      "Update on progress",
      "Confirm resolution"
    ],
    industrySpecific: {
      escalation: [
        "Escalate to senior tech",
        "Contact vendor support",
        "Notify IT manager"
      ]
    }
  },

  marketing: {
    name: "Marketing Campaign",
    description: "Campaign planning and execution",
    triggers: [
      "Campaign approved",
      "Product launch scheduled",
      "Marketing budget allocated"
    ],
    commonSteps: [
      "Define campaign objectives",
      "Identify target audience",
      "Develop creative concepts",
      "Create campaign materials",
      "Get stakeholder approval",
      "Set up tracking systems",
      "Launch campaign",
      "Monitor performance metrics",
      "Optimize based on data",
      "Generate campaign report",
      "Analyze ROI",
      "Document learnings"
    ],
    decisions: [
      "Budget approved?",
      "Creative approved?",
      "Performance meets targets?",
      "Continue or pause?"
    ],
    communications: [
      "Present campaign plan",
      "Send progress updates",
      "Share performance report",
      "Deliver final results"
    ],
    industrySpecific: {
      digital: [
        "Set up ad campaigns",
        "Configure tracking pixels",
        "A/B test variations",
        "Analyze conversion rates"
      ]
    }
  },

  realestate: {
    name: "Real Estate Transaction",
    description: "Property sale or purchase process",
    triggers: [
      "Property listed",
      "Offer submitted",
      "Buyer shows interest"
    ],
    commonSteps: [
      "List property details",
      "Schedule property showing",
      "Receive purchase offer",
      "Negotiate terms",
      "Accept offer",
      "Order property inspection",
      "Review inspection report",
      "Arrange financing",
      "Order title search",
      "Schedule closing date",
      "Sign closing documents",
      "Transfer ownership"
    ],
    decisions: [
      "Offer acceptable?",
      "Inspection issues found?",
      "Financing approved?",
      "Clear title?"
    ],
    communications: [
      "Notify seller of offer",
      "Update on inspection",
      "Confirm closing details",
      "Send congratulations"
    ],
    industrySpecific: {
      contingencies: [
        "Review contingencies",
        "Remove contingencies",
        "Extend deadline if needed"
      ]
    }
  },

  logistics: {
    name: "Logistics & Shipping",
    description: "Package delivery and tracking",
    triggers: [
      "Shipping request received",
      "Pickup scheduled",
      "Package arrived at facility"
    ],
    commonSteps: [
      "Receive shipment details",
      "Verify shipping address",
      "Calculate shipping cost",
      "Generate shipping label",
      "Schedule pickup",
      "Scan package at origin",
      "Transport to hub",
      "Sort by destination",
      "Load onto delivery vehicle",
      "Deliver to recipient",
      "Obtain signature",
      "Update tracking status"
    ],
    decisions: [
      "Address valid?",
      "Special handling required?",
      "Delivery attempted?",
      "Signature obtained?"
    ],
    communications: [
      "Send pickup confirmation",
      "Provide tracking number",
      "Notify of delays",
      "Confirm delivery"
    ],
    industrySpecific: {
      exceptions: [
        "Attempt redelivery",
        "Hold at facility",
        "Return to sender"
      ]
    }
  }
};

/**
 * Get domain template by name or keywords
 */
export const findDomain = (userInput: string): DomainTemplate | null => {
  const input = userInput.toLowerCase();
  
  // Direct matches
  for (const [key, domain] of Object.entries(DOMAIN_KNOWLEDGE)) {
    if (input.includes(key) || input.includes(domain.name.toLowerCase())) {
      return domain;
    }
  }
  
  // Keyword matches
  const keywordMap: { [key: string]: string } = {
    'car': 'automotive',
    'vehicle': 'automotive',
    'repair': 'automotive',
    'mechanic': 'automotive',
    'auto': 'automotive',
    'patient': 'healthcare',
    'hospital': 'healthcare',
    'clinic': 'healthcare',
    'medical': 'healthcare',
    'doctor': 'healthcare',
    'nurse': 'healthcare',
    'order': 'retail',
    'shop': 'retail',
    'ecommerce': 'retail',
    'store': 'retail',
    'customer': 'retail',
    'employee': 'hr',
    'onboard': 'hr',
    'hire': 'hr',
    'recruit': 'hr',
    'hr': 'hr',
    'production': 'manufacturing',
    'factory': 'manufacturing',
    'assembly': 'manufacturing',
    'manufacture': 'manufacturing',
    'restaurant': 'foodservice',
    'food': 'foodservice',
    'kitchen': 'foodservice',
    'menu': 'foodservice',
    'chef': 'foodservice',
    'loan': 'finance',
    'bank': 'finance',
    'credit': 'finance',
    'mortgage': 'finance',
    'financial': 'finance',
    'student': 'education',
    'school': 'education',
    'university': 'education',
    'college': 'education',
    'course': 'education',
    'lawyer': 'legal',
    'attorney': 'legal',
    'legal': 'legal',
    'law': 'legal',
    'case': 'legal',
    'litigation': 'legal',
    'it': 'itsupport',
    'support': 'itsupport',
    'helpdesk': 'itsupport',
    'ticket': 'itsupport',
    'technical': 'itsupport',
    'troubleshoot': 'itsupport',
    'marketing': 'marketing',
    'campaign': 'marketing',
    'advertising': 'marketing',
    'promotion': 'marketing',
    'brand': 'marketing',
    'property': 'realestate',
    'real estate': 'realestate',
    'realtor': 'realestate',
    'house': 'realestate',
    'home': 'realestate',
    'closing': 'realestate',
    'shipping': 'logistics',
    'delivery': 'logistics',
    'warehouse': 'logistics',
    'logistics': 'logistics',
    'freight': 'logistics',
    'transport': 'logistics'
  };
  
  for (const [keyword, domainKey] of Object.entries(keywordMap)) {
    if (input.includes(keyword)) {
      return DOMAIN_KNOWLEDGE[domainKey];
    }
  }
  
  return null;
};

/**
 * Get list of all available domains
 */
export const getAllDomains = (): string[] => {
  return Object.values(DOMAIN_KNOWLEDGE).map(d => d.name);
};

