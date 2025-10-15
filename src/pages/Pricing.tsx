import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Star, ArrowRight, Zap, Users, Building } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { grantSOPAccess, trackUserJourney } from '../services/subscriptionService';

interface PricingTier {
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  icon: React.ReactNode;
  color: string;
}

const Pricing: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);

  const pricingTiers: PricingTier[] = [
    {
      name: 'Free',
      price: 0,
      period: 'forever',
      description: 'Perfect for individuals exploring workflow optimization',
      icon: <Star className="w-6 h-6" />,
      color: 'from-gray-400 to-gray-500',
      features: [
        '3 Workflows',
        'Basic Templates',
        '1 User',
        'Community Support',
        'Core Features'
      ]
    },
    {
      name: 'Starter',
      price: 29,
      period: 'month',
      description: 'Perfect for small teams getting started with workflow optimization',
      icon: <Zap className="w-6 h-6" />,
      color: 'from-blue-500 to-blue-600',
      features: [
        '50 Workflows',
        'Basic SOP Management',
        'Workflow Templates',
        'Team Collaboration (up to 5 users)',
        'Email Support',
        'Basic Analytics'
      ]
    },
    {
      name: 'Professional',
      price: 79,
      period: 'month',
      description: 'Advanced features for growing teams and complex workflows',
      icon: <Users className="w-6 h-6" />,
      color: 'from-purple-500 to-purple-600',
      popular: true,
      features: [
        'Unlimited Workflows',
        'Advanced SOP Management',
        'Workflow Automation',
        'Team Collaboration (up to 25 users)',
        'Priority Support',
        'Advanced Analytics',
        'Custom Workflows',
        'API Access'
      ]
    },
    {
      name: 'Enterprise',
      price: 199,
      period: 'month',
      description: 'Complete solution for large organizations with custom needs',
      icon: <Building className="w-6 h-6" />,
      color: 'from-orange-500 to-orange-600',
      features: [
        'Everything in Professional',
        'Unlimited Workflows',
        'Unlimited Users',
        'White-label Solution',
        'Dedicated Support',
        'Advanced Security',
        'Custom Integrations',
        'SLA Guarantee'
      ]
    }
  ];

  const handleSubscribe = async (tier: string) => {
    // Free tier - just sign up!
    if (tier === 'free') {
      if (!user) {
        window.location.href = '/signup';
      } else {
        window.location.href = '/dashboard';
      }
      return;
    }

    // Paid tiers
    if (!user) {
      // Redirect to signup if not authenticated
      window.location.href = '/signup';
      return;
    }

    setLoading(tier);

    try {
      // Track subscription attempt
      await trackUserJourney(user.id, 'subscription_attempted', 'opscentral', {
        tier: tier,
        timestamp: new Date().toISOString()
      });

      // In a real implementation, you'd integrate with Stripe or another payment processor
      // For now, we'll simulate granting access
      const success = await grantSOPAccess(user.id, tier);
      
      if (success) {
        // Track successful subscription
        await trackUserJourney(user.id, 'subscription_completed', 'opscentral', {
          tier: tier,
          timestamp: new Date().toISOString()
        });

        // Show success message and redirect
        alert(`Welcome to ${tier}! Your SOP platform access has been granted.`);
        window.location.href = '/dashboard';
      } else {
        alert('There was an error processing your subscription. Please try again.');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      alert('There was an error processing your subscription. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-600">Plan</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
            Unlock the power of centralized workflow management. Start your journey to optimized operations today.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span>30-day money-back guarantee</span>
            <span>•</span>
            <span>Cancel anytime</span>
            <span>•</span>
            <span>No setup fees</span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
          {pricingTiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 ${
                tier.popular 
                  ? 'border-primary-500 scale-105' 
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-primary-600 to-accent-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="p-8">
                {/* Tier Header */}
                <div className="text-center mb-8">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r ${tier.color} text-white mb-4`}>
                    {tier.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {tier.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {tier.description}
                  </p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      ${tier.price}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">/{tier.period}</span>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-8">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => handleSubscribe(tier.name.toLowerCase())}
                  disabled={loading === tier.name.toLowerCase()}
                  className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                    tier.popular
                      ? 'bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white shadow-lg hover:shadow-xl'
                      : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100'
                  } ${
                    loading === tier.name.toLowerCase()
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:transform hover:-translate-y-1'
                  }`}
                >
                  {loading === tier.name.toLowerCase() ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : tier.name === 'Free' ? (
                    <>
                      {user ? 'Current Plan' : 'Start Free'}
                      <ArrowRight className="w-5 h-5" />
                    </>
                  ) : (
                    <>
                      Get Started
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Can I change my plan later?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Is there a free trial?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                We offer a 30-day money-back guarantee. If you're not satisfied, we'll refund your payment.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Do you offer custom pricing?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Yes! Contact our sales team for custom Enterprise solutions and volume discounts.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Transform Your Workflows?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Join thousands of product managers who've revolutionized their operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/book"
              className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Book a Demo
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/contact"
              className="px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
