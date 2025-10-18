import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { isAdmin } from '../utils/roleUtils';
import { tierManagementService, SubscriptionTier } from '../services/tierManagementService';
import { ArrowLeft, Plus, Eye, EyeOff, Edit2, Trash2, DollarSign, Star, Package } from 'lucide-react';
import TierEditor from '../components/tier/TierEditor';

const TierManagement: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tiers, setTiers] = useState<SubscriptionTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [showInactive, setShowInactive] = useState(false);

  useEffect(() => {
    // Check admin access
    if (!user || !isAdmin(user)) {
      navigate('/dashboard');
      return;
    }

    fetchTiers();
  }, [user, navigate, showInactive]);

  const fetchTiers = async () => {
    try {
      setLoading(true);
      const data = await tierManagementService.getAllTiers(showInactive);
      setTiers(data);
    } catch (error) {
      console.error('Error fetching tiers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditTier = (tier: SubscriptionTier) => {
    setSelectedTier(tier);
    setShowEditor(true);
  };

  const handleCreateTier = () => {
    setSelectedTier(null);
    setShowEditor(true);
  };

  const handleToggleVisibility = async (tier: SubscriptionTier) => {
    try {
      await tierManagementService.updateTier(tier.id, {
        is_visible: !tier.is_visible
      });
      await fetchTiers();
    } catch (error) {
      console.error('Error toggling visibility:', error);
      alert('Error updating tier visibility');
    }
  };

  const handleTogglePopular = async (tier: SubscriptionTier) => {
    try {
      await tierManagementService.updateTier(tier.id, {
        is_popular: !tier.is_popular
      });
      await fetchTiers();
    } catch (error) {
      console.error('Error toggling popular:', error);
      alert('Error updating tier popularity');
    }
  };

  const handleDeleteTier = async (tier: SubscriptionTier) => {
    if (!confirm(`Are you sure you want to deactivate the ${tier.name} tier?`)) return;

    try {
      await tierManagementService.deleteTier(tier.id, false);
      await fetchTiers();
      alert('Tier deactivated successfully');
    } catch (error) {
      console.error('Error deleting tier:', error);
      alert('Error deactivating tier');
    }
  };

  const getTierColor = (color: string) => {
    const colors: { [key: string]: string } = {
      gray: 'bg-gray-100 text-gray-800 border-gray-300',
      blue: 'bg-blue-100 text-blue-800 border-blue-300',
      purple: 'bg-purple-100 text-purple-800 border-purple-300',
      green: 'bg-green-100 text-green-800 border-green-300',
      red: 'bg-red-100 text-red-800 border-red-300',
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-300'
    };
    return colors[color] || colors.gray;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading subscription tiers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/admin-management')}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                  <Package className="w-8 h-8 text-blue-600" />
                  Subscription Tier Management
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Manage pricing, features, and limits for all subscription tiers
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <input
                  type="checkbox"
                  checked={showInactive}
                  onChange={(e) => setShowInactive(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                Show inactive tiers
              </label>
              <button
                onClick={() => navigate('/pricing')}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Preview Pricing Page
              </button>
              <button
                onClick={handleCreateTier}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create New Tier
              </button>
            </div>
          </div>
        </div>

        {/* Tiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg border-2 ${
                tier.is_popular ? 'border-blue-500' : 'border-gray-200 dark:border-gray-700'
              } overflow-hidden transition-all hover:shadow-xl`}
            >
              {/* Tier Header */}
              <div className={`p-6 border-b border-gray-200 dark:border-gray-700 ${getTierColor(tier.color)}`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold">{tier.name}</h3>
                    {tier.is_popular && (
                      <Star className="w-5 h-5 fill-current text-yellow-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {!tier.is_active && (
                      <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                        Inactive
                      </span>
                    )}
                    {!tier.is_visible && (
                      <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">
                        Hidden
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-sm opacity-75">{tier.description}</p>
              </div>

              {/* Pricing */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-baseline gap-2 mb-2">
                  <DollarSign className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    {tier.price_monthly}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">/month</span>
                </div>
                {tier.price_yearly > 0 && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    ${tier.price_yearly}/year
                    {tier.price_yearly < tier.price_monthly * 12 && (
                      <span className="ml-2 text-green-600 dark:text-green-400 font-medium">
                        Save ${(tier.price_monthly * 12 - tier.price_yearly).toFixed(2)}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Features Preview */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Features: {tier.features?.filter(f => f.type === 'feature').length || 0}
                </p>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {tier.features?.slice(0, 5).map((feature) => (
                    <div key={feature.id} className="flex items-start gap-2 text-sm">
                      <span className={feature.type === 'feature' ? 'text-green-600' : 'text-red-600'}>
                        {feature.type === 'feature' ? '✓' : '✗'}
                      </span>
                      <span className="text-gray-700 dark:text-gray-300">{feature.text}</span>
                    </div>
                  ))}
                  {(tier.features?.length || 0) > 5 && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      +{(tier.features?.length || 0) - 5} more features
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 flex items-center gap-2">
                <button
                  onClick={() => handleEditTier(tier)}
                  className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleToggleVisibility(tier)}
                  className="p-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                  title={tier.is_visible ? 'Hide tier' : 'Show tier'}
                >
                  {tier.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => handleTogglePopular(tier)}
                  className={`p-2 rounded-lg transition-colors ${
                    tier.is_popular
                      ? 'bg-yellow-200 text-yellow-800 hover:bg-yellow-300'
                      : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300'
                  }`}
                  title={tier.is_popular ? 'Remove popular badge' : 'Mark as popular'}
                >
                  <Star className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteTier(tier)}
                  className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  title="Deactivate tier"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {tiers.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No tiers found
            </p>
            <button
              onClick={handleCreateTier}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
            >
              Create Your First Tier
            </button>
          </div>
        )}
      </div>

      {/* Tier Editor Modal */}
      {showEditor && (
        <TierEditor
          tier={selectedTier}
          onClose={() => {
            setShowEditor(false);
            setSelectedTier(null);
          }}
          onSave={async () => {
            setShowEditor(false);
            setSelectedTier(null);
            await fetchTiers();
          }}
        />
      )}
    </div>
  );
};

export default TierManagement;
