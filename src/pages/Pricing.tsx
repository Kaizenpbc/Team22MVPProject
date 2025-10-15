/**
 * Pricing Page Component
 * Updated with new BYOK (Bring Your Own Key) model
 */

import React, { useState } from 'react';
import { Crown, Users, Shield, CheckCircle, ArrowRight, Key, Zap } from 'lucide-react';

const Pricing: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const tiers = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for exploring the platform',
      icon: Shield,
      color: 'gray',
      features: [
        '3 workflows',
        'Basic parsing (no AI)',
        'Manual workflow creation',
        'Interactive flowchart',
        'Basic exports (JSON, CSV, Text, Markdown)',
        '10 pre-built templates',
        'Community support'
      ],
      limitations: [
        'No AI features',
        'Limited to 3 workflows',
        'No premium exports'
      ],
      cta: 'Get Started Free',
      ctaLink: '/signup',
      popular: false
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$19',
      period: billingCycle === 'yearly' ? 'year' : 'month',
      description: 'For regular users who want AI features',
      icon: Crown,
      color: 'blue',
      features: [
        'Unlimited workflows',
        'AI parsing (uses your OpenAI API key)',
        'AI analysis (comprehensive gap detection)',
        'AI chat (workflow assistance)',
        'All export formats (Mermaid, Draw.io, Notion)',
        'Interactive flowchart with decision nodes',
        'Advanced workflow analytics',
        'Priority email support',
        'API access',
        'Workflow templates library'
      ],
      limitations: [],
      cta: 'Start Pro Trial',
      ctaLink: '/signup?plan=pro',
      popular: true,
      savings: billingCycle === 'yearly' ? 'Save 20%' : null
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '$49',
      period: billingCycle === 'yearly' ? 'year' : 'month',
      description: 'For teams and organizations',
      icon: Users,
      color: 'purple',
      features: [
        'Everything in Pro',
        'Team collaboration (up to 10 users)',
        'Shared workflow library',
        'Advanced analytics dashboard',
        'White-label option (remove Kovari branding)',
        'Custom integrations (API webhooks)',
        'Priority phone support',
        'Dedicated account manager',
        'Custom onboarding',
        'SLA guarantees'
      ],
      limitations: [],
      cta: 'Contact Sales',
      ctaLink: '/contact',
      popular: false,
      savings: billingCycle === 'yearly' ? 'Save 20%' : null
    }
  ];

  const getButtonClass = (tier: typeof tiers[0]) => {
    const baseClass = 'w-full py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2';
    
    switch (tier.color) {
      case 'blue':
        return `${baseClass} bg-blue-600 hover:bg-blue-700 text-white`;
      case 'purple':
        return `${baseClass} bg-purple-600 hover:bg-purple-700 text-white`;
      default:
        return `${baseClass} bg-gray-600 hover:bg-gray-700 text-white`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
              Bring your own OpenAI API key and pay only for what you use. 
              No markup, no hidden costs, no surprises.
            </p>
            
            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                Monthly
              </span>
              <button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700 transition-colors"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                Yearly
                <span className="ml-1 text-green-600 dark:text-green-400 text-xs">(Save 20%)</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {tiers.map((tier) => {
            const Icon = tier.icon;
            const yearlyPrice = billingCycle === 'yearly' ? Math.round(parseInt(tier.price.slice(1)) * 12 * 0.8) : null;
            
            return (
              <div
                key={tier.id}
                className={`relative rounded-2xl border-2 p-8 transition-all ${
                  tier.popular
                    ? 'border-blue-500 shadow-xl scale-105 bg-white dark:bg-gray-800'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                    tier.color === 'blue' 
                      ? 'bg-blue-100 dark:bg-blue-900' 
                      : tier.color === 'purple'
                      ? 'bg-purple-100 dark:bg-purple-900'
                      : 'bg-gray-100 dark:bg-gray-700'
                  }`}>
                    <Icon className={`w-8 h-8 ${
                      tier.color === 'blue'
                        ? 'text-blue-600 dark:text-blue-400'
                        : tier.color === 'purple'
                        ? 'text-purple-600 dark:text-purple-400'
                        : 'text-gray-600 dark:text-gray-400'
                    }`} />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {tier.name}
                  </h3>
                  
                  <div className="mb-4">
                    <span className="text-5xl font-bold text-gray-900 dark:text-white">
                      {billingCycle === 'yearly' && yearlyPrice ? `$${yearlyPrice}` : tier.price}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400 ml-2">
                      /{tier.period}
                    </span>
                  </div>
                  
                  {tier.savings && (
                    <div className="inline-block bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm font-semibold px-3 py-1 rounded-full mb-4">
                      {tier.savings}
                    </div>
                  )}
                  
                  <p className="text-gray-600 dark:text-gray-400">
                    {tier.description}
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  {tier.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Limitations */}
                {tier.limitations.length > 0 && (
                  <div className="mb-8">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                      Limitations:
                    </h4>
                    <ul className="space-y-2">
                      {tier.limitations.map((limitation, index) => (
                        <li key={index} className="flex items-start gap-3 text-gray-600 dark:text-gray-400">
                          <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                          {limitation}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* CTA Button */}
                <a
                  href={tier.ctaLink}
                  className={getButtonClass(tier)}
                >
                  {tier.cta}
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Costs Section */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Transparent AI Costs
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              With Pro and Enterprise plans, you use your own OpenAI API key. 
              You pay OpenAI directly - we never markup AI costs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-blue-50 dark:bg-blue-950 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                AI Parse
              </h3>
              <p className="text-2xl font-bold text-blue-800 dark:text-blue-200 mb-2">
                ~$0.02
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                per workflow
              </p>
            </div>

            <div className="bg-purple-50 dark:bg-purple-950 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Key className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-2">
                AI Analysis
              </h3>
              <p className="text-2xl font-bold text-purple-800 dark:text-purple-200 mb-2">
                ~$0.01
              </p>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                per analysis
              </p>
            </div>

            <div className="bg-green-50 dark:bg-green-950 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
                AI Chat
              </h3>
              <p className="text-2xl font-bold text-green-800 dark:text-green-200 mb-2">
                ~$0.005
              </p>
              <p className="text-sm text-green-700 dark:text-green-300">
                per message
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Why do I need my own OpenAI API key?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                This allows us to offer transparent pricing with no markup on AI costs. 
                You pay OpenAI directly for AI usage, plus our simple platform fee. 
                This saves you money compared to competitors who markup AI costs.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Is my API key secure?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Yes! Your API key is stored locally in your browser and never transmitted to our servers. 
                You can remove it anytime, and we never see or store your key.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                What happens if I exceed my OpenAI usage limits?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                You'll need to add credits to your OpenAI account or upgrade your OpenAI plan. 
                This gives you full control over your AI usage and costs.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Can I cancel anytime?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Yes! You can cancel your subscription anytime. You'll keep access until the end of your billing period, 
                and you can always use the Free plan with basic features.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;