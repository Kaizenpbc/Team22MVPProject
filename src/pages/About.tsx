import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            About Kovari
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
            Kovari is built for product managers who need a single, dependable hub to align workflows, standardise SOPs, and track updates in real time. Our mission is simple: fewer tabs, fewer handoffs, clearer ownership - so teams can move faster with confidence.
          </p>

          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-primary-600 dark:text-primary-400 mb-4">Who we are</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                A focused team of product and engineering folks obsessed with operational clarity and velocity. We believe great product work comes from clear processes, shared context, and automation that gets out of the way.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-primary-600 dark:text-primary-400 mb-4">Why Kovari</h2>
              <div className="space-y-3">
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  <strong className="text-gray-900 dark:text-white">Save time:</strong> Streamline processes and remove duplication.
                </p>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  <strong className="text-gray-900 dark:text-white">Enhance accuracy:</strong> Standardise SOPs with real-time validation.
                </p>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  <strong className="text-gray-900 dark:text-white">Collaborate better:</strong> One central place for updates, assets, and ownership.
                </p>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  <strong className="text-gray-900 dark:text-white">Strengthen security:</strong> Enterprise-grade practices and permissions.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-primary-600 dark:text-primary-400 mb-4">What we're shipping first</h2>
              <div className="space-y-3">
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  <strong className="text-gray-900 dark:text-white">Plan your workflow strategy:</strong> Outline team goals and map requirements.
                </p>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  <strong className="text-gray-900 dark:text-white">Customise your experience:</strong> Tailor features to your team's needs.
                </p>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  <strong className="text-gray-900 dark:text-white">Automate your processes:</strong> Generate and adjust workflows in real time.
                </p>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  <strong className="text-gray-900 dark:text-white">Access anywhere, anytime:</strong> Export and work offline when needed.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-primary-600 dark:text-primary-400 mb-4">Our vision</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                Kovari brings work back together. We're building a secure, scalable hub where product teams standardise how work gets done - then automate it. The result: faster cycles, fewer errors, and more time for real product thinking.
              </p>
              <p className="text-gray-600 dark:text-gray-400 italic">
                - The Kovari Team
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;