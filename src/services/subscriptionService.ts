// Subscription Service
// Handles user subscription management and SOP access

import { supabase } from '../lib/supabase';

export interface UserAccessStatus {
  user_id: string;
  subscription_status: 'none' | 'trial' | 'active' | 'cancelled' | 'expired';
  subscription_tier: 'starter' | 'professional' | 'enterprise' | null;
  sop_access: boolean;
  demo_completed: boolean;
  subscription_expires_at: string | null;
}

export interface UserJourney {
  id: string;
  user_id: string;
  event: string;
  platform: string;
  metadata: any;
  created_at: string;
}

// Get user's access status
export const getUserAccessStatus = async (userId: string): Promise<UserAccessStatus | null> => {
  try {
    // Try to use RPC function first
    const { data, error } = await supabase.rpc('get_user_access_status', {
      p_user_id: userId
    });

    if (error) {
      // If RPC doesn't exist, return default values
      console.warn('RPC function not available, using defaults:', error);
      return {
        user_id: userId,
        subscription_status: 'none',
        subscription_tier: null,
        sop_access: false,
        demo_completed: false,
        subscription_expires_at: null
      };
    }
    return data?.[0] || null;
  } catch (error: any) {
    console.error('Error getting user access status:', error);
    // Return default values on error
    return {
      user_id: userId,
      subscription_status: 'none',
      subscription_tier: null,
      sop_access: false,
      demo_completed: false,
      subscription_expires_at: null
    };
  }
};

// Track user journey event
export const trackUserJourney = async (
  userId: string, 
  event: string, 
  platform: string = 'opscentral',
  metadata: any = null
): Promise<string | null> => {
  try {
    const { data, error } = await supabase.rpc('track_user_journey', {
      p_user_id: userId,
      p_event: event,
      p_platform: platform,
      p_metadata: metadata
    });

    if (error) {
      // Silently fail if RPC doesn't exist - just log to console
      console.warn('Journey tracking not available:', error.message);
      return null;
    }
    return data;
  } catch (error: any) {
    console.warn('Error tracking user journey:', error.message);
    return null;
  }
};

// Update user demo completion status
export const markDemoCompleted = async (userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_profiles')
      .update({ demo_completed: true })
      .eq('id', userId);

    if (error) throw error;

    // Track the event
    await trackUserJourney(userId, 'demo_completed', 'opscentral', {
      completed_at: new Date().toISOString()
    });

    return true;
  } catch (error: any) {
    console.error('Error marking demo completed:', error);
    return false;
  }
};

// Grant SOP access to user
export const grantSOPAccess = async (userId: string, tier: string): Promise<boolean> => {
  try {
    // Create subscription record first (this will trigger the profile update)
    const { error: subError } = await supabase
      .from('user_subscriptions')
      .insert({
        user_id: userId,
        tier: tier,
        status: 'active',
        start_date: new Date().toISOString()
      });

    if (subError) throw subError;

    // Track the event
    await trackUserJourney(userId, 'sop_access_granted', 'opscentral', {
      tier: tier,
      granted_at: new Date().toISOString()
    });

    return true;
  } catch (error: any) {
    console.error('Error granting SOP access:', error);
    return false;
  }
};

// Revoke SOP access
export const revokeSOPAccess = async (userId: string): Promise<boolean> => {
  try {
    // Update subscription record (this will trigger the profile update)
    const { error } = await supabase
      .from('user_subscriptions')
      .update({ 
        status: 'cancelled',
        end_date: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('status', 'active');

    if (error) throw error;

    // Track the event
    await trackUserJourney(userId, 'sop_access_revoked', 'opscentral', {
      revoked_at: new Date().toISOString()
    });

    return true;
  } catch (error: any) {
    console.error('Error revoking SOP access:', error);
    return false;
  }
};

// Generate SSO token for SOP platform
export const generateSSOToken = (user: any, accessStatus: UserAccessStatus): string => {
  const payload = {
    userId: user.id,
    email: user.email,
    subscriptionTier: accessStatus.subscription_tier,
    sopAccess: accessStatus.sop_access,
    demoCompleted: accessStatus.demo_completed,
    expiresAt: Date.now() + 3600000 // 1 hour
  };

  // In a real implementation, you'd use a proper JWT library with a secret
  // For now, we'll create a simple base64 encoded token
  return btoa(JSON.stringify(payload));
};

// Get user journey events
export const getUserJourney = async (userId: string): Promise<UserJourney[]> => {
  try {
    const { data, error } = await supabase
      .from('user_journey')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error('Error getting user journey:', error);
    return [];
  }
};

// Check if user has active subscription
export const hasActiveSubscription = (accessStatus: UserAccessStatus | null): boolean => {
  if (!accessStatus) return false;
  
  return accessStatus.subscription_status === 'active' && 
         accessStatus.sop_access === true &&
         (accessStatus.subscription_expires_at === null || 
          new Date(accessStatus.subscription_expires_at) > new Date());
};

// Get subscription tier features
export const getSubscriptionFeatures = (tier: string): string[] => {
  const features = {
    starter: ['basic_sop', 'workflow_templates', 'team_collaboration'],
    professional: ['advanced_sop', 'workflow_automation', 'analytics', 'api_access'],
    enterprise: ['all_features', 'custom_workflows', 'priority_support', 'white_label']
  };
  
  return features[tier as keyof typeof features] || [];
};
