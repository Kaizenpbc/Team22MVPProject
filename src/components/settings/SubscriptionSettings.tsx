/**
 * Subscription Settings Component
 * Manages user subscription tiers (Free/Pro/Enterprise)
 */

import React, { useState, useEffect } from 'react';
import { Crown, Users, Shield, CheckCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SubscriptionSettingsProps {
  onSubscriptionChange?: () => void;
}

export const SubscriptionSettings: React.FC<SubscriptionSettingsProps> = ({ 
  onSubscriptionChange 
}) => {
  const { user } = useAuth();
  const [currentTier, setCurrentTier] = useState<'free' | 'pro' | 'enterprise'>('free');
  const [isLoading, setIsLoading] = useState(false);

  // Load current subscription from localStorage or user profile
  useEffect(() => {
    const savedTier = localStorage.getItem('subscription_tier') as 'free' | 'pro' | 'enterprise';
    if (savedTier) {
      setCurrentTier(savedTier);
    }
  }, []);

  const handleUpgrade = async (tier: 'pro' | 'enterprise') => {
    setIsLoading(true);
    
    // Simulate Stripe checkout process
    try {
      // In a real implementation, this would redirect to Stripe
      console.log(`Upgrading to ${tier} tier...`);
      
      // For now, just simulate the upgrade
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCurrentTier(tier);
      localStorage.setItem('subscription_tier', tier);
      
      if (onSubscriptionChange) {
        onSubscriptionChange();
      }
    } catch (error) {
      console.error('Upgrade failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDowngrade = () => {
    setCurrentTier('free');
    localStorage.setItem('subscription_tier', 'free');
    
    if (onSubscriptionChange) {
      onSubscriptionChange();
    }
  };

  const tiers = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for exploring the platform',
      features: [
        '3 workflows',
        'Basic parsing (no AI)',
        'Manual workflow creation',
        'Interactive flowchart',
        'Basic exports',
        'Community support'
      ],
      limitations: [
        'No AI features',
        'Limited to 3 workflows',
        'No premium exports'
      ],
      buttonText: 'Current Plan',
      buttonDisabled: true,
      icon: Shield,
      color: 'gray'
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$19',
      period: 'month',
      description: 'For regular users who want AI features',
      features: [
        'Unlimited workflows',
        'AI parsing & analysis',
        'AI chat assistance',
        'All export formats',
        'Advanced analytics',
        'Priority email support',
        'API access',
        'Workflow templates'
      ],
      limitations: [],
      buttonText: currentTier === 'pro' ? 'Current Plan' : 'Upgrade to Pro',
      buttonDisabled: currentTier === 'pro' || isLoading,
      icon: Crown,
      color: 'blue',
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '$49',
      period: 'month',
      description: 'For teams and organizations',
      features: [
        'Everything in Pro',
        'Team collaboration (10 users)',
        'Shared workflow library',
        'Advanced analytics dashboard',
        'White-label option',
        'Custom integrations',
        'Priority phone support',
        'Dedicated account manager',
        'SLA guarantees'
      ],
      limitations: [],
      buttonText: currentTier === 'enterprise' ? 'Current Plan' : 'Upgrade to Enterprise',
      buttonDisabled: currentTier === 'enterprise' || isLoading,
      icon: Users,
      color: 'purple'
    }
  ];

  const getButtonClass = (tier: typeof tiers[0]) => {
    if (tier.buttonDisabled) {
      return 'w-full py-3 px-4 rounded-lg font-semibold cursor-not-allowed bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500';
    }
    
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
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
          <Crown className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Subscription Plan
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Choose the plan that fits your needs
          </p>
        </div>
      </div>

      {/* Current Plan Status */}
      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-blue-900 dark:text-blue-100">
              Current Plan: {tiers.find(t => t.id === currentTier)?.name}
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              {currentTier === 'free' 
                ? 'You can upgrade anytime to unlock AI features'
                : 'Thank you for your subscription!'
              }
            </p>
          </div>
          {currentTier !== 'free' && (
            <button
              onClick={handleDowngrade}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Downgrade to Free
            </button>
          )}
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {tiers.map((tier) => {
          const Icon = tier.icon;
          return (
            <div
              key={tier.id}
              className={`relative rounded-xl border-2 p-6 transition-all ${
                tier.popular
                  ? 'border-blue-500 shadow-lg scale-105'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <div className={`w-12 h-12 mx-auto mb-4 rounded-lg flex items-center justify-center ${
                  tier.color === 'blue' 
                    ? 'bg-blue-100 dark:bg-blue-900' 
                    : tier.color === 'purple'
                    ? 'bg-purple-100 dark:bg-purple-900'
                    : 'bg-gray-100 dark:bg-gray-700'
                }`}>
                  <Icon className={`w-6 h-6 ${
                    tier.color === 'blue'
                      ? 'text-blue-600 dark:text-blue-400'
                      : tier.color === 'purple'
                      ? 'text-purple-600 dark:text-purple-400'
                      : 'text-gray-600 dark:text-gray-400'
                  }`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {tier.name}
                </h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    {tier.price}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    /{tier.period}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {tier.description}
                </p>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-6">
                {tier.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {/* Button */}
              <button
                onClick={() => handleUpgrade(tier.id as 'pro' | 'enterprise')}
                disabled={tier.buttonDisabled}
                className={getButtonClass(tier)}
              >
                {tier.buttonText}
                {!tier.buttonDisabled && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          );
        })}
      </div>

      {/* AI Costs Info */}
      <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
          💡 About AI Costs
        </h4>
        <p className="text-sm text-green-800 dark:text-green-200 mb-2">
          With Pro and Enterprise plans, you use your own OpenAI API key:
        </p>
        <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
          <li>• AI Parse: ~$0.02 per workflow</li>
          <li>• AI Analysis: ~$0.01 per analysis</li>
          <li>• AI Chat: ~$0.005 per message</li>
          <li>• You pay OpenAI directly - no markup from us!</li>
        </ul>
      </div>
    </div>
  );
};
