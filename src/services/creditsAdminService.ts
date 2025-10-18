import { supabase } from '../lib/supabase';

export interface CreditTransaction {
  id: string;
  user_id: string;
  amount: number;
  balance_after: number;
  transaction_type: 'purchase' | 'usage' | 'bonus' | 'refund' | 'admin_adjustment';
  feature_used?: string;
  workflow_id?: string;
  metadata?: any;
  created_at: string;
}

export interface UserCredits {
  user_id: string;
  user_name: string;
  user_email: string;
  current_credits: number;
  lifetime_purchased: number;
  lifetime_used: number;
  last_purchase: string;
}

class CreditsAdminService {
  private static instance: CreditsAdminService;

  private constructor() {}

  public static getInstance(): CreditsAdminService {
    if (!CreditsAdminService.instance) {
      CreditsAdminService.instance = new CreditsAdminService();
    }
    return CreditsAdminService.instance;
  }

  /**
   * Adjust user credits (admin only)
   */
  public async adjustUserCredits(
    userId: string,
    amount: number,
    reason: string
  ): Promise<void> {
    try {
      const { error } = await supabase.rpc('add_credits', {
        p_user_id: userId,
        p_amount: amount,
        p_transaction_type: 'admin_adjustment',
        p_metadata: {
          reason,
          adjusted_by: (await supabase.auth.getUser()).data.user?.email,
          adjusted_at: new Date().toISOString()
        }
      });

      if (error) {
        console.error('Error adjusting credits:', error);
        throw error;
      }

      console.log(`✅ Credits adjusted: ${amount > 0 ? '+' : ''}${amount} credits for user ${userId}`);
    } catch (error) {
      console.error('Error in adjustUserCredits:', error);
      throw error;
    }
  }

  /**
   * Get user credit balance and history
   */
  public async getUserCredits(userId: string): Promise<UserCredits | null> {
    try {
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('id, full_name, email, credits, lifetime_credits_purchased, lifetime_credits_used, last_credit_purchase_at')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Error fetching user credits:', profileError);
        throw profileError;
      }

      if (!profile) return null;

      return {
        user_id: profile.id,
        user_name: profile.full_name || 'Unknown',
        user_email: profile.email || 'No email',
        current_credits: profile.credits || 0,
        lifetime_purchased: profile.lifetime_credits_purchased || 0,
        lifetime_used: profile.lifetime_credits_used || 0,
        last_purchase: profile.last_credit_purchase_at || 'Never'
      };
    } catch (error) {
      console.error('Error in getUserCredits:', error);
      throw error;
    }
  }

  /**
   * Get user credit transactions
   */
  public async getUserTransactions(userId: string, limit: number = 50): Promise<CreditTransaction[]> {
    try {
      const { data, error } = await supabase
        .from('credit_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching transactions:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getUserTransactions:', error);
      throw error;
    }
  }

  /**
   * Get all users with credit information
   */
  public async getAllUsersCredits(): Promise<UserCredits[]> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, full_name, email, credits, lifetime_credits_purchased, lifetime_credits_used, last_credit_purchase_at')
        .order('credits', { ascending: false });

      if (error) {
        console.error('Error fetching all users credits:', error);
        throw error;
      }

      return (data || []).map(profile => ({
        user_id: profile.id,
        user_name: profile.full_name || 'Unknown',
        user_email: profile.email || 'No email',
        current_credits: profile.credits || 0,
        lifetime_purchased: profile.lifetime_credits_purchased || 0,
        lifetime_used: profile.lifetime_credits_used || 0,
        last_purchase: profile.last_credit_purchase_at || 'Never'
      }));
    } catch (error) {
      console.error('Error in getAllUsersCredits:', error);
      throw error;
    }
  }

  /**
   * Grant bonus credits to user
   */
  public async grantBonusCredits(
    userId: string,
    amount: number,
    reason: string
  ): Promise<void> {
    try {
      const { error } = await supabase.rpc('add_credits', {
        p_user_id: userId,
        p_amount: amount,
        p_transaction_type: 'bonus',
        p_metadata: {
          reason,
          granted_by: (await supabase.auth.getUser()).data.user?.email,
          granted_at: new Date().toISOString()
        }
      });

      if (error) {
        console.error('Error granting bonus credits:', error);
        throw error;
      }

      console.log(`✅ Bonus credits granted: +${amount} credits for user ${userId}`);
    } catch (error) {
      console.error('Error in grantBonusCredits:', error);
      throw error;
    }
  }

  /**
   * Refund credits to user
   */
  public async refundCredits(
    userId: string,
    amount: number,
    reason: string
  ): Promise<void> {
    try {
      const { error } = await supabase.rpc('add_credits', {
        p_user_id: userId,
        p_amount: amount,
        p_transaction_type: 'refund',
        p_metadata: {
          reason,
          refunded_by: (await supabase.auth.getUser()).data.user?.email,
          refunded_at: new Date().toISOString()
        }
      });

      if (error) {
        console.error('Error refunding credits:', error);
        throw error;
      }

      console.log(`✅ Credits refunded: +${amount} credits for user ${userId}`);
    } catch (error) {
      console.error('Error in refundCredits:', error);
      throw error;
    }
  }

  /**
   * Get credit usage statistics
   */
  public async getCreditStats(): Promise<{
    total_users: number;
    total_credits_in_circulation: number;
    total_lifetime_purchased: number;
    total_lifetime_used: number;
    average_credits_per_user: number;
  }> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('credits, lifetime_credits_purchased, lifetime_credits_used');

      if (error) {
        console.error('Error fetching credit stats:', error);
        throw error;
      }

      const stats = (data || []).reduce((acc, user) => {
        acc.total_credits_in_circulation += user.credits || 0;
        acc.total_lifetime_purchased += user.lifetime_credits_purchased || 0;
        acc.total_lifetime_used += user.lifetime_credits_used || 0;
        return acc;
      }, {
        total_users: data?.length || 0,
        total_credits_in_circulation: 0,
        total_lifetime_purchased: 0,
        total_lifetime_used: 0,
        average_credits_per_user: 0
      });

      stats.average_credits_per_user = stats.total_users > 0 
        ? Math.round(stats.total_credits_in_circulation / stats.total_users)
        : 0;

      return stats;
    } catch (error) {
      console.error('Error in getCreditStats:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const creditsAdminService = CreditsAdminService.getInstance();

// Export convenience functions
export const adjustUserCredits = (userId: string, amount: number, reason: string) => 
  creditsAdminService.adjustUserCredits(userId, amount, reason);
export const getUserCredits = (userId: string) => 
  creditsAdminService.getUserCredits(userId);
export const getUserTransactions = (userId: string, limit?: number) => 
  creditsAdminService.getUserTransactions(userId, limit);
export const getAllUsersCredits = () => 
  creditsAdminService.getAllUsersCredits();
export const grantBonusCredits = (userId: string, amount: number, reason: string) => 
  creditsAdminService.grantBonusCredits(userId, amount, reason);
export const refundCredits = (userId: string, amount: number, reason: string) => 
  creditsAdminService.refundCredits(userId, amount, reason);
export const getCreditStats = () => 
  creditsAdminService.getCreditStats();
