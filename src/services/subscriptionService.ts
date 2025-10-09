// Subscription Service
// Handles user subscription management and SOP access

import { supabase } from '../lib/supabase';

export interface UserAccessStatus {
  user_id: string;
  subscription_status: 'none' | 'trial' | 'active' | 'cancelled' | 'expired';
  subscription_tier: 'free' | 'starter' | 'professional' | 'enterprise' | null;
  sop_access: boolean;
  demo_completed: boolean;
  subscription_expires_at: string | null;
  workflow_limit?: number;
  user_limit?: number;
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
      // If RPC doesn't exist, try to get from user_profiles directly
      console.warn('RPC function not available, querying user_profiles:', error);
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError || !profileData) {
        // Return free tier defaults for new users
        return {
          user_id: userId,
          subscription_status: 'active',
          subscription_tier: 'free',
          sop_access: true,
          demo_completed: false,
          subscription_expires_at: null,
          workflow_limit: 3,
          user_limit: 1
        };
      }

      return {
        user_id: profileData.id,
        subscription_status: profileData.subscription_status || 'active',
        subscription_tier: profileData.subscription_tier || 'free',
        sop_access: profileData.sop_access !== false, // Default to true
        demo_completed: profileData.demo_completed || false,
        subscription_expires_at: profileData.subscription_expires_at,
        workflow_limit: profileData.workflow_limit || 3,
        user_limit: profileData.user_limit || 1
      };
    }
    return data?.[0] || null;
  } catch (error: any) {
    console.error('Error getting user access status:', error);
    // Return free tier defaults on error
    return {
      user_id: userId,
      subscription_status: 'active',
      subscription_tier: 'free',
      sop_access: true,
      demo_completed: false,
      subscription_expires_at: null,
      workflow_limit: 3,
      user_limit: 1
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

// Check if user has active subscription (including free tier!)
export const hasActiveSubscription = (accessStatus: UserAccessStatus | null): boolean => {
  if (!accessStatus) return false;
  
  // Free tier users have access too!
  return accessStatus.subscription_status === 'active' && 
         accessStatus.sop_access === true &&
         (accessStatus.subscription_expires_at === null || 
          new Date(accessStatus.subscription_expires_at) > new Date());
};

// Check if user is on free tier
export const isFreeTier = (accessStatus: UserAccessStatus | null): boolean => {
  return accessStatus?.subscription_tier === 'free';
};

// Check if user is on paid tier
export const isPaidTier = (accessStatus: UserAccessStatus | null): boolean => {
  return accessStatus?.subscription_tier !== 'free' && accessStatus?.subscription_tier !== null;
};

// Get subscription tier features
export const getSubscriptionFeatures = (tier: string): string[] => {
  const features = {
    free: ['3_workflows', 'basic_templates', '1_user', 'community_support'],
    starter: ['50_workflows', 'basic_sop', 'workflow_templates', '5_users', 'email_support'],
    professional: ['unlimited_workflows', 'advanced_sop', 'workflow_automation', '25_users', 'analytics', 'api_access', 'priority_support'],
    enterprise: ['unlimited_workflows', 'all_features', 'custom_workflows', 'unlimited_users', 'dedicated_support', 'white_label', 'sla']
  };
  
  return features[tier as keyof typeof features] || [];
};

// Get workflow limits by tier
export const getWorkflowLimit = (tier: string | null): number => {
  const limits = {
    free: 3,
    starter: 50,
    professional: -1, // unlimited
    enterprise: -1  // unlimited
  };
  
  return limits[tier as keyof typeof limits] || 3;
};

// Get user limits by tier
export const getUserLimit = (tier: string | null): number => {
  const limits = {
    free: 1,
    starter: 5,
    professional: 25,
    enterprise: -1  // unlimited
  };
  
  return limits[tier as keyof typeof limits] || 1;
};

// Auto-create free tier profile for new users
export const createFreeTierProfile = async (userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_profiles')
      .insert({
        id: userId,
        subscription_status: 'active',
        subscription_tier: 'free',
        sop_access: true,
        demo_completed: false,
        workflow_limit: 3,
        user_limit: 1
      });

    if (error) {
      // Profile might already exist, try to update instead
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({
          subscription_status: 'active',
          subscription_tier: 'free',
          sop_access: true,
          workflow_limit: 3,
          user_limit: 1
        })
        .eq('id', userId);

      if (updateError) throw updateError;
    }

    // Track the event
    await trackUserJourney(userId, 'free_tier_granted', 'opscentral', {
      tier: 'free',
      granted_at: new Date().toISOString()
    });

    return true;
  } catch (error: any) {
    console.error('Error creating free tier profile:', error);
    return false;
  }
};
