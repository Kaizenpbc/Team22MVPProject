import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "How does OpsCentral integrate with existing product management tools?",
      answer: "OpsCentral seamlessly integrates with popular tools like Jira, Trello, Asana, and Slack through our robust API connections. Our platform acts as a centralised hub that pulls data from your existing tools whilst maintaining your current workflows, ensuring a smooth transition without disrupting your team's productivity."
    },
    {
      question: "Can I customise workflows to match my team's specific processes?",
      answer: "Absolutely! Our platform is built with flexibility in mind. You can create custom workflow templates, define approval processes, set automated triggers, and tailor every aspect of the system to match your team's unique requirements. The drag-and-drop interface makes customisation intuitive and quick."
    },
    {
      question: "What kind of real-time updates and notifications does the platform provide?",
      answer: "OpsCentral provides instant notifications for task updates, approval requests, deadline reminders, and process completions. You can customise notification preferences, choose delivery methods (email, in-app, mobile push), and set up smart alerts that only notify relevant team members based on their roles and responsibilities."
    },
    {
      question: "Is there a learning curve for new users, and what support is available?",
      answer: "We've designed OpsCentral to be intuitive for product managers. Most users are productive within their first day. We provide comprehensive onboarding, video tutorials, live training sessions, and 24/7 customer support. Our dedicated customer success team ensures smooth adoption and ongoing optimisation of your workflows."
    },
    {
      question: "How secure is my data, and what compliance standards do you meet?",
      answer: "Security is our top priority. We employ enterprise-grade encryption, regular security audits, and comply with GDPR, SOC 2 Type II, and ISO 27001 standards. Your data is stored in secure, geographically distributed data centres with automatic backups and disaster recovery protocols to ensure 99.9% uptime and complete data protection."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-primary-600 dark:text-primary-300">
          </p>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
            Get answers to the most common questions about OpsCentral.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-gray-900 rounded-lg border-4 border-primary-600 dark:border-primary-600 overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-4 sm:px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors min-h-[44px]"
              >
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white pr-4">
                  {faq.question}
                </h3>
                <div className="flex-shrink-0">
                  {openIndex === index ? (
                    <Minus className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  ) : (
                    <Plus className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  )}
                </div>
              </button>
              
              {openIndex === index && (
                <div className="px-4 sm:px-6 pb-4">
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;