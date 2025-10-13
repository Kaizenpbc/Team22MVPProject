import React from 'react';
import { Clock, Target, Users, Shield } from 'lucide-react';

const Benefits = () => {
  const benefits = [
    {
      icon: Clock,
      title: 'Accelerate Digital Transformation',
      description: 'Transform unstructured documents into automated workflows in minutes, not months.',
      color: 'text-primary-600 dark:text-primary-400',
      phrase: 'Speed & Efficiency'
    },
    {
      icon: Target,
      title: 'Ensure Compliance',
      description: 'Maintain audit trails and meet regulatory standards automatically across all workflows.',
      color: 'text-primary-600 dark:text-primary-400',
      phrase: 'Built-In Compliance'
    },
    {
      icon: Users,
      title: 'Unify Your Technology Stack',
      description: 'Seamlessly integrate with existing ERP, CRM, and business systems for a single source of truth.',
      color: 'text-primary-600 dark:text-primary-400',
      phrase: 'Enterprise Integration'
    },
    {
      icon: Shield,
      title: 'Gain Real-Time Insights',
      description: 'Make data-driven decisions with intelligent analytics and performance dashboards.',
      color: 'text-primary-600 dark:text-primary-400',
      phrase: 'Actionable Intelligence'
    }
  ];

  return (
    <section id="benefits" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose Kovari?
          </h2>
          <p className="text-lg text-primary-600 dark:text-primary-300 max-w-2xl mx-auto">
          </p>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Transform how your organization handles workflows, compliance, and data intelligence with our comprehensive AI-powered platform.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <div 
                key={index}
                className="group p-6 sm:p-8 bg-gray-50 dark:bg-gray-800 rounded-xl border-4 border-primary-600 dark:border-primary-600 hover:border-primary-500 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className={`w-6 h-6 text-white`} />
                </div>
                <div className="mb-2">
                  <span className="text-sm font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wide">
                    {benefit.phrase}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3">{benefit.title}</h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">{benefit.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Benefits;