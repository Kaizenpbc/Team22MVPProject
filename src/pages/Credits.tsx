import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Coins, Sparkles, Zap, TrendingUp, ArrowRight, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getCreditBalance, getCreditPackages, CreditPackage, CreditBalance } from '../services/creditsService';

const Credits: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [balance, setBalance] = useState<CreditBalance | null>(null);
  const [packages, setPackages] = useState<CreditPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    
    const [balanceData, packagesData] = await Promise.all([
      getCreditBalance(user.id),
      getCreditPackages()
    ]);
    
    setBalance(balanceData);
    setPackages(packagesData);
    setLoading(false);
  };

  const handlePurchase = async (pkg: CreditPackage) => {
    if (!user) {
      navigate('/signin');
      return;
    }

    setPurchasing(pkg.id);
    
    // TODO: Integrate with Stripe
    // For now, show coming soon message
    alert(`🚧 Stripe integration coming soon!\n\nYou selected: ${pkg.name}\nPrice: ${pkg.price_display}\nCredits: ${pkg.total_credits} (${pkg.credits} + ${pkg.bonus_credits} bonus)`);
    
    setPurchasing(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading credits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header with Balance */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl shadow-2xl mb-6">
            <Coins className="w-8 h-8" />
            <div className="text-left">
              <div className="text-sm opacity-90">Your Balance</div>
              <div className="text-3xl font-bold">{balance?.credits || 0} Credits</div>
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Buy Credits
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Pay only for what you use. Credits never expire. No monthly commitment.
          </p>
        </div>

        {/* Credit Packages */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-2 overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                pkg.is_popular 
                  ? 'border-purple-500 dark:border-purple-400' 
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              {/* Popular Badge */}
              {pkg.is_popular && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 text-sm font-bold rounded-bl-lg">
                  🔥 POPULAR
                </div>
              )}

              <div className="p-6">
                {/* Package Name */}
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {pkg.name}
                </h3>

                {/* Credits */}
                <div className="mb-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-primary-600 dark:text-primary-400">
                      {pkg.total_credits}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">credits</span>
                  </div>
                  {pkg.bonus_credits > 0 && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {pkg.credits} + {pkg.bonus_credits} bonus
                      </span>
                      <span className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded text-xs font-bold">
                        {Math.round((pkg.bonus_credits / pkg.credits) * 100)}% OFF
                      </span>
                    </div>
                  )}
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    {pkg.price_display}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    ${(pkg.price_cents / 100 / pkg.total_credits).toFixed(3)}/credit
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <Check className="w-4 h-4 text-green-600" />
                    {Math.floor(pkg.total_credits / 5)} AI Parses
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <Check className="w-4 h-4 text-green-600" />
                    {Math.floor(pkg.total_credits / 2)} AI Analyses
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <Check className="w-4 h-4 text-green-600" />
                    {pkg.total_credits} AI Chat messages
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <Check className="w-4 h-4 text-green-600" />
                    Credits never expire
                  </div>
                </div>

                {/* Buy Button */}
                <button
                  onClick={() => handlePurchase(pkg)}
                  disabled={purchasing !== null}
                  className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                    pkg.is_popular
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl'
                      : 'bg-primary-600 hover:bg-primary-700 text-white'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {purchasing === pkg.id ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Buy Now
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* What Credits Buy */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            What Do Credits Buy?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-start gap-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <Sparkles className="w-8 h-8 text-purple-600 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">AI Parse</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Intelligently extract workflow steps from any SOP text
                </p>
                <div className="text-purple-600 dark:text-purple-400 font-bold">5 credits</div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Zap className="w-8 h-8 text-blue-600 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">AI Analysis</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Comprehensive workflow analysis with gaps, duplicates, risks
                </p>
                <div className="text-blue-600 dark:text-blue-400 font-bold">2 credits</div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
              <TrendingUp className="w-8 h-8 text-pink-600 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">AI Chat</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Chat with AI to edit and optimize your workflows
                </p>
                <div className="text-pink-600 dark:text-pink-400 font-bold">1 credit/message</div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <Coins className="w-8 h-8 text-green-600 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">Premium Exports</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Mermaid, Draw.io, Notion formats
                </p>
                <div className="text-green-600 dark:text-green-400 font-bold">1 credit each</div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <Check className="w-8 h-8 text-yellow-600 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">Extra Workflows</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Save more than 3 workflows (first 3 are free!)
                </p>
                <div className="text-yellow-600 dark:text-yellow-400 font-bold">2 credits each</div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <Sparkles className="w-8 h-8 text-gray-600 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">Free Features</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Templates, basic parsing, manual editing, basic exports
                </p>
                <div className="text-gray-600 dark:text-gray-400 font-bold">0 credits</div>
              </div>
            </div>
          </div>
        </div>

        {/* Why Credits */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Why Buy Credits?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">💰</div>
              <h3 className="font-bold mb-2">Pay Only What You Use</h3>
              <p className="text-white text-opacity-90 text-sm">
                No monthly fees. Buy credits when you need them.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">⏳</div>
              <h3 className="font-bold mb-2">Never Expire</h3>
              <p className="text-white text-opacity-90 text-sm">
                Buy once, use whenever you want. No pressure.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🎁</div>
              <h3 className="font-bold mb-2">Bonus Credits</h3>
              <p className="text-white text-opacity-90 text-sm">
                Buy more, get more! Up to 66% bonus credits.
              </p>
            </div>
          </div>
        </div>

        {/* Usage Stats */}
        {balance && balance.lifetime_purchased > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Your Usage</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {balance.lifetime_purchased}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Purchased</div>
              </div>
              <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                  {balance.lifetime_used}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Used</div>
              </div>
              <div className="text-center p-6 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                  {balance.credits}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Remaining</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Credits;

