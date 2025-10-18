import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Shield } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import UserWorkflowInterface from './UserWorkflowInterface';

/**
 * Admin Workflow Interface
 * Extended interface with advanced controls for administrators
 */
const AdminWorkflowInterface: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [advancedSettings, setAdvancedSettings] = useState({
    aiModel: 'gpt-4',
    analysisDepth: 'comprehensive',
    autoOptimize: true,
  });

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-900 dark:text-purple-100">
              ⚙️ <span className="font-semibold">{user?.email}</span> 
              <span className="ml-2 text-purple-600 dark:text-purple-400 font-bold">(Administrator)</span>
            </p>
            <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
              You have access to advanced workflow features and analytics
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/admin-management')}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium"
              title="Manage admin tier and permissions"
            >
              <Shield className="w-4 h-4" />
              Admin Tier Management
            </button>
            <button
              onClick={() => navigate('/settings', { state: { activeTab: 'admin-users' } })}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium"
              title="View all registered users"
            >
              <Users className="w-4 h-4" />
              View All Users
            </button>
          </div>
        </div>
      </div>

      {/* Advanced Settings Panel */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          ⚡ Advanced Settings
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* AI Model Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              AI Model
            </label>
            <select
              value={advancedSettings.aiModel}
              onChange={(e) => setAdvancedSettings({ ...advancedSettings, aiModel: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="gpt-4">GPT-4 (Most Accurate)</option>
              <option value="gpt-3.5">GPT-3.5 (Faster)</option>
              <option value="claude">Claude</option>
            </select>
          </div>

          {/* Analysis Depth */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Analysis Depth
            </label>
            <select
              value={advancedSettings.analysisDepth}
              onChange={(e) => setAdvancedSettings({ ...advancedSettings, analysisDepth: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="basic">Basic</option>
              <option value="standard">Standard</option>
              <option value="comprehensive">Comprehensive</option>
            </select>
          </div>

          {/* Auto Optimize */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Auto-Optimization
            </label>
            <button
              onClick={() => setAdvancedSettings({ ...advancedSettings, autoOptimize: !advancedSettings.autoOptimize })}
              className={`w-full px-3 py-2 rounded-lg font-medium transition-colors ${
                advancedSettings.autoOptimize
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {advancedSettings.autoOptimize ? '✓ Enabled' : '✗ Disabled'}
            </button>
          </div>
        </div>
      </div>

      {/* Main User Interface (with admin features enabled) */}
      <UserWorkflowInterface />
    </div>
  );
};

export default AdminWorkflowInterface;

