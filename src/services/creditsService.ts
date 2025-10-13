/**
 * Credits Service
 * Manages user credits for pay-per-use features
 */

import { supabase } from '../lib/supabase';

export const CREDIT_COSTS = {
  AI_PARSE: 5,
  AI_ANALYSIS: 2,
  AI_CHAT_MESSAGE: 1,
  PREMIUM_EXPORT: 1,
  SAVE_WORKFLOW_EXTRA: 2, // Beyond free 3 workflows
} as const;

export interface CreditBalance {
  credits: number;
  lifetime_purchased: number;
  lifetime_used: number;
  last_purchase_at: string | null;
}

export interface CreditTransaction {
  id: string;
  amount: number;
  balance_after: number;
  transaction_type: string;
  feature_used?: string;
  created_at: string;
  metadata?: any;
}

export interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  bonus_credits: number;
  price_cents: number;
  is_popular: boolean;
  total_credits: number; // credits + bonus_credits
  price_display: string; // "$10"
}

/**
 * Get user's credit balance
 */
export const getCreditBalance = async (userId: string): Promise<CreditBalance> => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('credits, lifetime_credits_purchased, lifetime_credits_used, last_credit_purchase_at')
      .eq('id', userId)
      .single();

    if (error) throw error;

    return {
      credits: data?.credits || 0,
      lifetime_purchased: data?.lifetime_credits_purchased || 0,
      lifetime_used: data?.lifetime_credits_used || 0,
      last_purchase_at: data?.last_credit_purchase_at || null
    };
  } catch (error) {
    console.error('Error getting credit balance:', error);
    return {
      credits: 0,
      lifetime_purchased: 0,
      lifetime_used: 0,
      last_purchase_at: null
    };
  }
};

/**
 * Check if user has enough credits
 */
export const hasEnoughCredits = async (userId: string, required: number): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .rpc('has_enough_credits', {
        p_user_id: userId,
        p_required: required
      });

    if (error) throw error;
    return data === true;
  } catch (error) {
    console.error('Error checking credits:', error);
    return false;
  }
};

/**
 * Deduct credits for feature usage
 */
export const deductCredits = async (
  userId: string,
  amount: number,
  feature: string,
  metadata?: any
): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .rpc('deduct_credits', {
        p_user_id: userId,
        p_amount: amount,
        p_feature_used: feature,
        p_metadata: metadata ? JSON.stringify(metadata) : null
      });

    if (error) throw error;
    return data === true;
  } catch (error: any) {
    console.error('Error deducting credits:', error);
    if (error.message?.includes('Insufficient credits')) {
      throw new Error('NOT_ENOUGH_CREDITS');
    }
    throw error;
  }
};

/**
 * Add credits to user account
 */
export const addCredits = async (
  userId: string,
  amount: number,
  transactionType: 'purchase' | 'bonus' | 'refund' | 'admin_adjustment',
  metadata?: any
): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .rpc('add_credits', {
        p_user_id: userId,
        p_amount: amount,
        p_transaction_type: transactionType,
        p_metadata: metadata ? JSON.stringify(metadata) : null
      });

    if (error) throw error;
    return data === true;
  } catch (error) {
    console.error('Error adding credits:', error);
    return false;
  }
};

/**
 * Get credit transaction history
 */
export const getCreditHistory = async (userId: string, limit: number = 50): Promise<CreditTransaction[]> => {
  try {
    const { data, error } = await supabase
      .from('credit_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting credit history:', error);
    return [];
  }
};

/**
 * Get available credit packages
 */
export const getCreditPackages = async (): Promise<CreditPackage[]> => {
  try {
    const { data, error } = await supabase
      .from('credit_packages')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');

    if (error) throw error;

    return (data || []).map(pkg => ({
      ...pkg,
      total_credits: pkg.credits + pkg.bonus_credits,
      price_display: `$${(pkg.price_cents / 100).toFixed(0)}`
    }));
  } catch (error) {
    console.error('Error getting credit packages:', error);
    return [];
  }
};

/**
 * Get feature cost in credits
 */
export const getFeatureCost = (feature: keyof typeof CREDIT_COSTS): number => {
  return CREDIT_COSTS[feature] || 0;
};

/**
 * Check and deduct credits for AI parsing
 */
export const useAIParse = async (userId: string, workflowName?: string): Promise<boolean> => {
  return await deductCredits(userId, CREDIT_COSTS.AI_PARSE, 'ai_parse', { workflowName });
};

/**
 * Check and deduct credits for AI analysis
 */
export const useAIAnalysis = async (userId: string, workflowName?: string): Promise<boolean> => {
  return await deductCredits(userId, CREDIT_COSTS.AI_ANALYSIS, 'ai_analysis', { workflowName });
};

/**
 * Check and deduct credits for AI chat
 */
export const useAIChat = async (userId: string, message: string): Promise<boolean> => {
  return await deductCredits(userId, CREDIT_COSTS.AI_CHAT_MESSAGE, 'ai_chat', { 
    message_preview: message.substring(0, 100) 
  });
};

/**
 * Check and deduct credits for premium export
 */
export const usePremiumExport = async (userId: string, exportFormat: string): Promise<boolean> => {
  return await deductCredits(userId, CREDIT_COSTS.PREMIUM_EXPORT, 'premium_export', { exportFormat });
};

/**
 * Format credits for display
 */
export const formatCredits = (credits: number): string => {
  return credits.toLocaleString();
};

/**
 * Calculate credit value in dollars
 */
export const creditsToUSD = (credits: number): string => {
  const value = credits * 0.10; // $0.10 per credit
  return `$${value.toFixed(2)}`;
};

