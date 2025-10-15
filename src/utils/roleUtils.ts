// Utility functions for checking user roles
import { User } from '@supabase/supabase-js';

/**
 * Check if a user has admin privileges
 * @param user - The Supabase user object
 * @returns boolean - true if user is admin
 */
export const isAdmin = (user: User | null): boolean => {
  if (!user) return false;
  
  // Check multiple ways to determine admin status
  return (
    user.user_metadata?.role === 'admin' ||
    user.user_metadata?.admin === true ||
    user.email?.includes('admin') ||
    user.email?.includes('kpbc.ca') ||
    user.email?.toLowerCase().includes('admin')
  );
};

/**
 * Get user role as a string
 * @param user - The Supabase user object
 * @returns string - 'admin' or 'user'
 */
export const getUserRole = (user: User | null): 'admin' | 'user' => {
  return isAdmin(user) ? 'admin' : 'user';
};

/**
 * Get user display name from user metadata
 * @param user - The Supabase user object
 * @returns string - User's display name
 */
export const getUserDisplayName = (user: User | null): string => {
  if (!user) return 'Guest';
  
  return (
    user.user_metadata?.full_name ||
    user.email?.split('@')[0] ||
    'User'
  );
};

/**
 * Get user display name from user_profiles table (preferred)
 * @param user - The Supabase user object
 * @param profile - Optional profile data from user_profiles table
 * @returns string - User's display name
 */
export const getUserDisplayNameFromProfile = (user: User | null, profile?: any): string => {
  if (!user) return 'Guest';
  
  return (
    profile?.full_name ||
    user.user_metadata?.full_name ||
    user.email?.split('@')[0] ||
    'User'
  );
};

/**
 * Check if user can access admin features
 * @param user - The Supabase user object
 * @returns boolean
 */
export const canAccessAdmin = (user: User | null): boolean => {
  return isAdmin(user);
};
