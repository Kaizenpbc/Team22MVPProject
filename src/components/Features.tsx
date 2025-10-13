import React from 'react';
import { Brain, Link2, BarChart3, Workflow, Shield } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Brain,
      title: "Kovari",
      tagline: "AI-powered workflow intelligence",
      description: "Kovari is the central platform that transforms unstructured and structured data into actionable workflows, creating clarity, efficiency, and compliance across industries.",
      phrase: "Flagship Product"
    },
    {
      icon: Link2,
      title: "Kovari Nexus",
      tagline: "Integrations & APIs",
      description: "Seamlessly connects Kovari with your existing ERP, CRM, and business systems, ensuring a single source of truth across the enterprise.",
      phrase: "Connect Everything"
    },
    {
      icon: BarChart3,
      title: "Kovari Insights",
      tagline: "Analytics & Reporting",
      description: "Transforms workflow data into real-time insights, compliance dashboards, and decision-ready reports, empowering smarter strategic choices.",
      phrase: "Data-Driven Decisions"
    },
    {
      icon: Workflow,
      title: "Kovari Flow",
      tagline: "Process Automation Builder",
      description: "Empowers teams to design, optimize, and automate workflows with an intuitive, drag-and-drop interface without coding expertise.",
      phrase: "No-Code Automation"
    },
    {
      icon: Shield,
      title: "Kovari Guard",
      tagline: "Security & Compliance",
      description: "Delivers end-to-end data protection, audit trails, and regulatory compliance for every workflow, building trust with regulators and stakeholders.",
      phrase: "Enterprise-Grade Security"
    }
  ];

  return (
    <section id="features" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            The Kovari Product Suite
          </h2>
          <p className="text-lg text-primary-600 dark:text-primary-300 max-w-2xl mx-auto">
          </p>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            A complete ecosystem of intelligent tools that transform how your organization manages workflows, data, and compliance.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div 
                key={index}
                className="group p-6 sm:p-8 bg-white dark:bg-gray-900 rounded-xl border-4 border-primary-600 dark:border-primary-600 hover:border-primary-500 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="inline-flex p-3 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <div className="mb-2">
                  <span className="text-sm font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wide">
                    {feature.phrase}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 italic">{feature.tagline}</p>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;