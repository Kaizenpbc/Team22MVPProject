import React, { useState, useEffect } from 'react';
import { tierManagementService, SubscriptionTier, TierFeature } from '../../services/tierManagementService';
import { X, Plus, Trash2, MoveUp, MoveDown, DollarSign, Package, List, Settings } from 'lucide-react';

interface TierEditorProps {
  tier: SubscriptionTier | null;
  onClose: () => void;
  onSave: () => void;
}

const TierEditor: React.FC<TierEditorProps> = ({ tier, onClose, onSave }) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'features' | 'limits'>('basic');
  const [saving, setSaving] = useState(false);

  // Basic info state
  const [name, setName] = useState(tier?.name || '');
  const [tierKey, setTierKey] = useState(tier?.tier_key || '');
  const [description, setDescription] = useState(tier?.description || '');
  const [priceMonthly, setPriceMonthly] = useState(tier?.price_monthly || 0);
  const [priceYearly, setPriceYearly] = useState(tier?.price_yearly || 0);
  const [ctaText, setCtaText] = useState(tier?.cta_text || 'Get Started');
  const [ctaLink, setCtaLink] = useState(tier?.cta_link || '/signup');
  const [icon, setIcon] = useState(tier?.icon || 'Shield');
  const [color, setColor] = useState(tier?.color || 'gray');
  const [isPopular, setIsPopular] = useState(tier?.is_popular || false);
  const [isVisible, setIsVisible] = useState(tier?.is_visible !== false);

  // Features state
  const [features, setFeatures] = useState<TierFeature[]>(tier?.features || []);
  const [newFeatureText, setNewFeatureText] = useState('');
  const [newFeatureType, setNewFeatureType] = useState<'feature' | 'limitation'>('feature');

  // Limits state
  const [limits, setLimits] = useState<{ [key: string]: { value: string; type: string } }>(tier?.limits || {});
  const [newLimitKey, setNewLimitKey] = useState('');
  const [newLimitValue, setNewLimitValue] = useState('');
  const [newLimitType, setNewLimitType] = useState<'numeric' | 'boolean' | 'text'>('numeric');

  const handleSaveBasicInfo = async () => {
    try {
      setSaving(true);

      if (tier) {
        // Update existing tier
        await tierManagementService.updateTier(tier.id, {
          name,
          description,
          price_monthly: priceMonthly,
          price_yearly: priceYearly,
          cta_text: ctaText,
          is_popular: isPopular,
          is_visible: isVisible
        });
      } else {
        // Create new tier
        const newTierId = await tierManagementService.createTier({
          tier_key: tierKey,
          name,
          description,
          price_monthly: priceMonthly,
          price_yearly: priceYearly,
          cta_text: ctaText,
          cta_link: ctaLink,
          icon,
          color,
          is_popular: isPopular,
          is_visible: isVisible,
          display_order: 999
        });
        console.log('New tier created:', newTierId);
      }

      alert('Basic info saved successfully!');
    } catch (error) {
      console.error('Error saving basic info:', error);
      alert('Error saving tier. Please check console.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddFeature = async () => {
    if (!newFeatureText.trim()) return;
    if (!tier) {
      alert('Please save basic info first');
      return;
    }

    try {
      await tierManagementService.addFeature(
        tier.id,
        newFeatureText,
        newFeatureType,
        features.length
      );
      
      // Refresh features
      const updatedTier = await tierManagementService.getTierById(tier.id);
      if (updatedTier) {
        setFeatures(updatedTier.features || []);
      }
      
      setNewFeatureText('');
      alert('Feature added successfully!');
    } catch (error) {
      console.error('Error adding feature:', error);
      alert('Error adding feature');
    }
  };

  const handleDeleteFeature = async (featureId: string) => {
    if (!confirm('Are you sure you want to delete this feature?')) return;

    try {
      await tierManagementService.deleteFeature(featureId);
      setFeatures(features.filter(f => f.id !== featureId));
      alert('Feature deleted successfully!');
    } catch (error) {
      console.error('Error deleting feature:', error);
      alert('Error deleting feature');
    }
  };

  const handleAddLimit = async () => {
    if (!newLimitKey.trim() || !newLimitValue.trim()) return;
    if (!tier) {
      alert('Please save basic info first');
      return;
    }

    try {
      await tierManagementService.updateLimit(
        tier.id,
        newLimitKey,
        newLimitValue,
        newLimitType
      );
      
      setLimits({
        ...limits,
        [newLimitKey]: { value: newLimitValue, type: newLimitType }
      });
      
      setNewLimitKey('');
      setNewLimitValue('');
      alert('Limit added successfully!');
    } catch (error) {
      console.error('Error adding limit:', error);
      alert('Error adding limit');
    }
  };

  const calculateYearlySavings = () => {
    const monthlyTotal = priceMonthly * 12;
    const savings = monthlyTotal - priceYearly;
    return savings > 0 ? savings.toFixed(2) : '0.00';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {tier ? `Edit ${tier.name} Tier` : 'Create New Tier'}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {tier ? 'Modify pricing, features, and limits' : 'Set up a new subscription tier'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 px-6">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('basic')}
              className={`py-3 px-4 border-b-2 font-medium transition-colors ${
                activeTab === 'basic'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Package className="w-4 h-4 inline mr-2" />
              Basic Info
            </button>
            <button
              onClick={() => setActiveTab('features')}
              className={`py-3 px-4 border-b-2 font-medium transition-colors ${
                activeTab === 'features'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              disabled={!tier}
            >
              <List className="w-4 h-4 inline mr-2" />
              Features ({features.length})
            </button>
            <button
              onClick={() => setActiveTab('limits')}
              className={`py-3 px-4 border-b-2 font-medium transition-colors ${
                activeTab === 'limits'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              disabled={!tier}
            >
              <Settings className="w-4 h-4 inline mr-2" />
              Limits ({Object.keys(limits).length})
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'basic' && (
            <div className="space-y-6">
              {/* Tier Key (only for new tiers) */}
              {!tier && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tier Key (unique identifier)
                  </label>
                  <input
                    type="text"
                    value={tierKey}
                    onChange={(e) => setTierKey(e.target.value.toLowerCase().replace(/\s+/g, '_'))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="e.g., pro, enterprise"
                  />
                  <p className="text-xs text-gray-500 mt-1">Used internally, cannot be changed later</p>
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tier Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="e.g., Pro, Enterprise"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Brief description of this tier"
                />
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Monthly Price ($)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={priceMonthly}
                      onChange={(e) => setPriceMonthly(parseFloat(e.target.value) || 0)}
                      step="0.01"
                      min="0"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Yearly Price ($)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={priceYearly}
                      onChange={(e) => setPriceYearly(parseFloat(e.target.value) || 0)}
                      step="0.01"
                      min="0"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  {priceYearly > 0 && priceMonthly > 0 && (
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                      Saves ${calculateYearlySavings()} compared to monthly
                    </p>
                  )}
                </div>
              </div>

              {/* CTA */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    CTA Button Text
                  </label>
                  <input
                    type="text"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    CTA Link
                  </label>
                  <input
                    type="text"
                    value={ctaLink}
                    onChange={(e) => setCtaLink(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Appearance */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Icon
                  </label>
                  <select
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="Shield">Shield</option>
                    <option value="Crown">Crown</option>
                    <option value="Users">Users</option>
                    <option value="Star">Star</option>
                    <option value="Zap">Zap</option>
                    <option value="Package">Package</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Color
                  </label>
                  <select
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="gray">Gray</option>
                    <option value="blue">Blue</option>
                    <option value="purple">Purple</option>
                    <option value="green">Green</option>
                    <option value="red">Red</option>
                    <option value="yellow">Yellow</option>
                  </select>
                </div>
              </div>

              {/* Flags */}
              <div className="space-y-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isPopular}
                    onChange={(e) => setIsPopular(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Mark as "Most Popular"
                  </span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isVisible}
                    onChange={(e) => setIsVisible(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Visible on pricing page
                  </span>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'features' && tier && (
            <div className="space-y-6">
              {/* Add Feature */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                  Add New Feature
                </h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newFeatureText}
                    onChange={(e) => setNewFeatureText(e.target.value)}
                    placeholder="Feature description"
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddFeature()}
                  />
                  <select
                    value={newFeatureType}
                    onChange={(e) => setNewFeatureType(e.target.value as 'feature' | 'limitation')}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="feature">✓ Feature</option>
                    <option value="limitation">✗ Limitation</option>
                  </select>
                  <button
                    onClick={handleAddFeature}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-2">
                {features.map((feature, index) => (
                  <div
                    key={feature.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                  >
                    <span className={feature.type === 'feature' ? 'text-green-600' : 'text-red-600'}>
                      {feature.type === 'feature' ? '✓' : '✗'}
                    </span>
                    <span className="flex-1 text-sm text-gray-900 dark:text-white">
                      {feature.text}
                    </span>
                    <button
                      onClick={() => handleDeleteFeature(feature.id)}
                      className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'limits' && tier && (
            <div className="space-y-6">
              {/* Add Limit */}
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                  Add New Limit
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={newLimitKey}
                    onChange={(e) => setNewLimitKey(e.target.value.replace(/\s+/g, '_'))}
                    placeholder="limit_key"
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <input
                    type="text"
                    value={newLimitValue}
                    onChange={(e) => setNewLimitValue(e.target.value)}
                    placeholder="value"
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <div className="flex gap-2">
                    <select
                      value={newLimitType}
                      onChange={(e) => setNewLimitType(e.target.value as any)}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="numeric">Number</option>
                      <option value="boolean">Boolean</option>
                      <option value="text">Text</option>
                    </select>
                    <button
                      onClick={handleAddLimit}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Limits List */}
              <div className="space-y-2">
                {Object.entries(limits).map(([key, limit]) => (
                  <div
                    key={key}
                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {key}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {limit.value} ({limit.type})
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <div className="flex items-center gap-3">
            {activeTab === 'basic' && (
              <button
                onClick={handleSaveBasicInfo}
                disabled={saving}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors font-medium"
              >
                {saving ? 'Saving...' : tier ? 'Save Changes' : 'Create Tier'}
              </button>
            )}
            {tier && (
              <button
                onClick={onSave}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
              >
                Done
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TierEditor;
