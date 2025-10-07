import React from 'react';
import { Settings, Palette, Zap, Download } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Settings,
      title: "Outline your team's workflow needs and goals",
      description: "Define clear objectives and map out your team's unique requirements with our intuitive planning tools.",
      phrase: "Plan your workflow strategy"
    },
    {
      icon: Palette,
      title: "Tailor features to perfectly match your teams' needs and preferences",
      description: "Customise every aspect of the platform to align with your team's working style and operational requirements.",
      phrase: "Customise your experience"
    },
    {
      icon: Zap,
      title: "Automatically produced, tailored workflows and updates in real time",
      description: "Experience intelligent automation that creates and adjusts workflows dynamically based on your team's patterns.",
      phrase: "Automate your processes"
    },
    {
      icon: Download,
      title: "Easily export your workflows for offline access",
      description: "Take your workflows anywhere with seamless export functionality for complete operational flexibility.",
      phrase: "Access anywhere, anytime"
    }
  ];

  return (
    <section id="features" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Powerful Features for Modern Teams
          </h2>
          <p className="text-lg text-primary-600 dark:text-primary-300 max-w-2xl mx-auto">
          </p>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover the comprehensive tools that make OpsCentral the ultimate platform for streamlined operations.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
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
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
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