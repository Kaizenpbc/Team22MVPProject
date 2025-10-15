import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { isAdmin, getUserRole, getUserDisplayName } from '../utils/roleUtils';

/**
 * Component to display user role information
 */
const UserRoleDisplay: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) {
    return (
      <div className="text-sm text-gray-500">
        Not logged in
      </div>
    );
  }

  const role = getUserRole(user);
  const displayName = getUserDisplayName(user);
  const isUserAdmin = isAdmin(user);

  return (
    <div className="flex items-center gap-2 text-sm">
      <div className="flex items-center gap-1">
        <span className="font-medium">{displayName}</span>
        <span 
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            isUserAdmin 
              ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' 
              : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
          }`}
        >
          {role.toUpperCase()}
        </span>
      </div>
    </div>
  );
};

export default UserRoleDisplay;
