import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { isAdmin } from '../utils/roleUtils';
import UserWorkflowInterface from '../components/workflow/interfaces/UserWorkflowInterface';
import AdminWorkflowInterface from '../components/workflow/interfaces/AdminWorkflowInterface';

/**
 * Main Workflow Creator Page
 * Displays different interfaces based on user role
 */
const WorkflowCreator: React.FC = () => {
  const { user } = useAuth();
  const [isAdminMode, setIsAdminMode] = useState(false);

  // Check if user has admin privileges using utility function
  const userIsAdmin = isAdmin(user);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Workflow Creator
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Transform your SOPs into intelligent, automated workflows
              </p>
            </div>
            
            {/* Admin Toggle (if user is admin) */}
            {userIsAdmin && (
              <button
                onClick={() => setIsAdminMode(!isAdminMode)}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
              >
                {isAdminMode ? '👤 User Mode' : '⚙️ Admin Mode'}
              </button>
            )}
          </div>
        </div>

        {/* Render appropriate interface */}
        {isAdminMode && userIsAdmin ? (
          <AdminWorkflowInterface />
        ) : (
          <UserWorkflowInterface />
        )}
      </div>
    </div>
  );
};

export default WorkflowCreator;

