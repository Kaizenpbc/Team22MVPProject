import React from 'react';

const Privacy = () => {
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
            Privacy Policy
          </h1>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
            Last updated: {today}
          </p>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            This privacy policy explains how Kovari collects, uses, and protects your personal information when you use our platform and services.
          </p>

          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Information We Collect</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support. This may include your name, email address, and other contact information.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">How We Use Your Information</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices and support messages, and communicate with you about products and services.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Information Sharing and Disclosure</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy or as required by law.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Data Security</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Data Retention</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this policy, unless a longer retention period is required by law.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Your Rights</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                You have the right to access, update, or delete your personal information. You may also have the right to restrict or object to certain processing of your data, depending on applicable law.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">International Data Transfers</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information during such transfers.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Contact Us</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                If you have any questions about this privacy policy or our data practices, please contact us at hello@opscentral.com or through our support channels.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;