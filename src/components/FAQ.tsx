import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "How does Kovari's AI extract workflows from unstructured documents?",
      answer: "Our advanced AI uses natural language processing and machine learning to analyze documents, emails, and forms. It identifies key processes, decision points, and action items, then structures them into clear, executable workflows. The AI learns from your industry patterns and continuously improves its extraction accuracy."
    },
    {
      question: "What types of documents can Kovari process and transform?",
      answer: "Kovari can process virtually any text-based document including SOPs, policy manuals, email chains, PDFs, Word docs, spreadsheets, and even handwritten notes. Our AI recognizes various formats and languages, extracting actionable workflows regardless of how the information was originally documented."
    },
    {
      question: "How accurate is the AI workflow extraction, and can I edit the results?",
      answer: "Our AI achieves 90%+ accuracy on first extraction, with accuracy improving through machine learning. All generated workflows are fully editable - you can modify steps, add conditions, rearrange processes, and customize to your exact needs. Think of AI as your intelligent starting point."
    },
    {
      question: "Does Kovari work across different industries and compliance requirements?",
      answer: "Yes! Kovari adapts to any industry - from healthcare and finance to manufacturing and government. Our AI understands industry-specific terminology and compliance frameworks. It can generate workflows that meet HIPAA, SOX, ISO, and other regulatory requirements while maintaining your organization's unique processes."
    },
    {
      question: "How does the credit system work for AI features?",
      answer: "Kovari uses a credit-based system for AI processing. Basic workflow creation is free, while AI parsing costs credits based on document complexity. Credits can be purchased in packages, and we offer generous free tiers. Enterprise plans include unlimited AI processing. Think of it as pay-per-intelligence."
    },
    {
      question: "Can Kovari integrate with existing business systems and tools?",
      answer: "Absolutely! Kovari integrates with popular platforms like Slack, Microsoft Teams, SharePoint, Google Workspace, and enterprise systems via APIs. Generated workflows can be exported to project management tools, shared via email, or embedded in your existing documentation systems."
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
            Get answers to the most common questions about Kovari.
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