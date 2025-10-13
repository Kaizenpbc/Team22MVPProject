import React from 'react';

const Terms = () => {
  const today = new Date().toLocaleDateString('en-GB', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Terms & Conditions
          </h1>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
            Last updated: {today}
          </p>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            These terms and conditions govern your use of the Kovari platform and services. By accessing or using our services, you agree to be bound by these terms.
          </p>

          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Acceptance of Terms</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                By accessing and using Kovari, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Use of Services</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                You may use our services only for lawful purposes and in accordance with these terms. You agree not to use the services in any way that could damage, disable, or impair the service or interfere with any other party's use.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">User Accounts</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for safeguarding your account credentials and for all activities that occur under your account.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Intellectual Property Rights</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                The service and its original content, features, and functionality are and will remain the exclusive property of Kovari and its licensors. The service is protected by copyright, trademark, and other laws.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">User Content</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Our service may allow you to post, link, store, share and otherwise make available certain information, text, graphics, or other material. You are responsible for the content that you post to the service.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Prohibited Uses</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                You may not use our service for any unlawful purpose, to solicit others to perform unlawful acts, to violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Limitation of Liability</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                In no case shall Kovari, our directors, officers, employees, affiliates, agents, contractors, interns, suppliers, service providers, or licensors be liable for any injury, loss, claim, or any direct, indirect, incidental, punitive, special, or consequential damages of any kind.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Changes to Terms</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                We reserve the right, at our sole discretion, to modify or replace these terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;