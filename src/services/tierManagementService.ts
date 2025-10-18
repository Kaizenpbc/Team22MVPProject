import { supabase } from '../lib/supabase';

export interface SubscriptionTier {
  id: string;
  tier_key: string;
  name: string;
  display_order: number;
  is_active: boolean;
  is_visible: boolean;
  is_popular: boolean;
  price_monthly: number;
  price_yearly: number;
  currency: string;
  description: string;
  icon: string;
  color: string;
  cta_text: string;
  cta_link: string;
  features?: TierFeature[];
  limits?: { [key: string]: TierLimit };
  created_at: string;
  updated_at: string;
}

export interface TierFeature {
  id: string;
  text: string;
  type: 'feature' | 'limitation';
  is_highlighted: boolean;
}

export interface TierLimit {
  value: string;
  type: 'numeric' | 'boolean' | 'text';
}

export interface TierUpdate {
  name?: string;
  price_monthly?: number;
  price_yearly?: number;
  description?: string;
  is_popular?: boolean;
  is_visible?: boolean;
  cta_text?: string;
}

class TierManagementService {
  private static instance: TierManagementService;

  private constructor() {}

  public static getInstance(): TierManagementService {
    if (!TierManagementService.instance) {
      TierManagementService.instance = new TierManagementService();
    }
    return TierManagementService.instance;
  }

  /**
   * Get all subscription tiers (admin view - includes inactive)
   */
  public async getAllTiers(includeInactive: boolean = false): Promise<SubscriptionTier[]> {
    try {
      let query = supabase
        .from('subscription_tiers')
        .select(`
          *,
          features:tier_features(*),
          limits:tier_limits(*)
        `)
        .order('display_order', { ascending: true });

      if (!includeInactive) {
        query = query.eq('is_active', true);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching tiers:', error);
        throw error;
      }

      return (data || []).map(tier => ({
        ...tier,
        features: tier.features?.map((f: any) => ({
          id: f.id,
          text: f.feature_text,
          type: f.feature_type,
          is_highlighted: f.is_highlighted
        })),
        limits: tier.limits?.reduce((acc: any, l: any) => {
          acc[l.limit_key] = {
            value: l.limit_value,
            type: l.limit_type
          };
          return acc;
        }, {})
      }));
    } catch (error) {
      console.error('Error in getAllTiers:', error);
      throw error;
    }
  }

  /**
   * Get active, visible tiers (public view)
   */
  public async getActiveTiers(): Promise<SubscriptionTier[]> {
    try {
      const { data, error } = await supabase.rpc('get_active_subscription_tiers');

      if (error) {
        console.error('Error fetching active tiers:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getActiveTiers:', error);
      throw error;
    }
  }

  /**
   * Get a single tier by ID
   */
  public async getTierById(tierId: string): Promise<SubscriptionTier | null> {
    try {
      const { data, error } = await supabase
        .from('subscription_tiers')
        .select(`
          *,
          features:tier_features(*),
          limits:tier_limits(*)
        `)
        .eq('id', tierId)
        .single();

      if (error) {
        console.error('Error fetching tier:', error);
        throw error;
      }

      if (!data) return null;

      return {
        ...data,
        features: data.features?.map((f: any) => ({
          id: f.id,
          text: f.feature_text,
          type: f.feature_type,
          is_highlighted: f.is_highlighted
        })),
        limits: data.limits?.reduce((acc: any, l: any) => {
          acc[l.limit_key] = {
            value: l.limit_value,
            type: l.limit_type
          };
          return acc;
        }, {})
      };
    } catch (error) {
      console.error('Error in getTierById:', error);
      throw error;
    }
  }

  /**
   * Update a subscription tier
   */
  public async updateTier(tierId: string, updates: TierUpdate): Promise<void> {
    try {
      const { error } = await supabase.rpc('update_subscription_tier', {
        p_tier_id: tierId,
        p_updates: updates
      });

      if (error) {
        console.error('Error updating tier:', error);
        throw error;
      }

      console.log('✅ Tier updated successfully');
    } catch (error) {
      console.error('Error in updateTier:', error);
      throw error;
    }
  }

  /**
   * Add a feature to a tier
   */
  public async addFeature(
    tierId: string,
    featureText: string,
    featureType: 'feature' | 'limitation' = 'feature',
    displayOrder: number = 999
  ): Promise<void> {
    try {
      const { error } = await supabase.rpc('manage_tier_feature', {
        p_tier_id: tierId,
        p_feature_text: featureText,
        p_feature_type: featureType,
        p_display_order: displayOrder,
        p_action: 'add'
      });

      if (error) {
        console.error('Error adding feature:', error);
        throw error;
      }

      console.log('✅ Feature added successfully');
    } catch (error) {
      console.error('Error in addFeature:', error);
      throw error;
    }
  }

  /**
   * Update a feature
   */
  public async updateFeature(
    featureId: string,
    featureText?: string,
    featureType?: 'feature' | 'limitation',
    displayOrder?: number
  ): Promise<void> {
    try {
      const { error } = await supabase.rpc('manage_tier_feature', {
        p_feature_id: featureId,
        p_feature_text: featureText,
        p_feature_type: featureType,
        p_display_order: displayOrder,
        p_action: 'update'
      });

      if (error) {
        console.error('Error updating feature:', error);
        throw error;
      }

      console.log('✅ Feature updated successfully');
    } catch (error) {
      console.error('Error in updateFeature:', error);
      throw error;
    }
  }

  /**
   * Delete a feature
   */
  public async deleteFeature(featureId: string): Promise<void> {
    try {
      const { error } = await supabase.rpc('manage_tier_feature', {
        p_feature_id: featureId,
        p_action: 'delete'
      });

      if (error) {
        console.error('Error deleting feature:', error);
        throw error;
      }

      console.log('✅ Feature deleted successfully');
    } catch (error) {
      console.error('Error in deleteFeature:', error);
      throw error;
    }
  }

  /**
   * Update tier limit
   */
  public async updateLimit(
    tierId: string,
    limitKey: string,
    limitValue: string,
    limitType: 'numeric' | 'boolean' | 'text' = 'numeric'
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('tier_limits')
        .upsert({
          tier_id: tierId,
          limit_key: limitKey,
          limit_value: limitValue,
          limit_type: limitType,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'tier_id,limit_key'
        });

      if (error) {
        console.error('Error updating limit:', error);
        throw error;
      }

      console.log('✅ Limit updated successfully');
    } catch (error) {
      console.error('Error in updateLimit:', error);
      throw error;
    }
  }

  /**
   * Get tier change history
   */
  public async getTierHistory(tierId: string, limit: number = 50): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('tier_change_history')
        .select('*')
        .eq('tier_id', tierId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching tier history:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getTierHistory:', error);
      throw error;
    }
  }

  /**
   * Create a new tier
   */
  public async createTier(tier: Partial<SubscriptionTier>): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('subscription_tiers')
        .insert({
          tier_key: tier.tier_key,
          name: tier.name,
          display_order: tier.display_order || 999,
          price_monthly: tier.price_monthly || 0,
          price_yearly: tier.price_yearly || 0,
          description: tier.description || '',
          icon: tier.icon || 'Shield',
          color: tier.color || 'gray',
          cta_text: tier.cta_text || 'Get Started',
          cta_link: tier.cta_link || '/signup',
          is_popular: tier.is_popular || false,
          created_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select('id')
        .single();

      if (error) {
        console.error('Error creating tier:', error);
        throw error;
      }

      console.log('✅ Tier created successfully');
      return data.id;
    } catch (error) {
      console.error('Error in createTier:', error);
      throw error;
    }
  }

  /**
   * Delete/deactivate a tier
   */
  public async deleteTier(tierId: string, hardDelete: boolean = false): Promise<void> {
    try {
      if (hardDelete) {
        const { error } = await supabase
          .from('subscription_tiers')
          .delete()
          .eq('id', tierId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('subscription_tiers')
          .update({ is_active: false, updated_at: new Date().toISOString() })
          .eq('id', tierId);

        if (error) throw error;
      }

      console.log('✅ Tier deleted successfully');
    } catch (error) {
      console.error('Error in deleteTier:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const tierManagementService = TierManagementService.getInstance();

// Export convenience functions
export const getAllTiers = (includeInactive?: boolean) => 
  tierManagementService.getAllTiers(includeInactive);
export const getActiveTiers = () => 
  tierManagementService.getActiveTiers();
export const getTierById = (tierId: string) => 
  tierManagementService.getTierById(tierId);
export const updateTier = (tierId: string, updates: TierUpdate) => 
  tierManagementService.updateTier(tierId, updates);
export const addFeature = (tierId: string, featureText: string, featureType?: 'feature' | 'limitation', displayOrder?: number) => 
  tierManagementService.addFeature(tierId, featureText, featureType, displayOrder);
export const updateFeature = (featureId: string, featureText?: string, featureType?: 'feature' | 'limitation', displayOrder?: number) => 
  tierManagementService.updateFeature(featureId, featureText, featureType, displayOrder);
export const deleteFeature = (featureId: string) => 
  tierManagementService.deleteFeature(featureId);
export const updateLimit = (tierId: string, limitKey: string, limitValue: string, limitType?: 'numeric' | 'boolean' | 'text') => 
  tierManagementService.updateLimit(tierId, limitKey, limitValue, limitType);
export const getTierHistory = (tierId: string, limit?: number) => 
  tierManagementService.getTierHistory(tierId, limit);
export const createTier = (tier: Partial<SubscriptionTier>) => 
  tierManagementService.createTier(tier);
export const deleteTier = (tierId: string, hardDelete?: boolean) => 
  tierManagementService.deleteTier(tierId, hardDelete);
