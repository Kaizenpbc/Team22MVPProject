import { supabase } from '../lib/supabase';
import { auditService } from './auditService';

export interface AdminActivity {
  admin_id: string;
  admin_email: string;
  admin_name: string;
  last_login: string;
  login_count: number;
  status: string;
  role: string;
  recent_actions: string[];
  activity_score: number;
}

export interface ActivitySummary {
  total_admins: number;
  active_admins: number;
  inactive_admins: number;
  recent_logins: number;
  total_actions: number;
  most_active_admin: string;
  activity_trend: 'increasing' | 'decreasing' | 'stable';
}

class ActivityMonitoringService {
  private static instance: ActivityMonitoringService;
  private monitoringInterval: NodeJS.Timeout | null = null;

  private constructor() {}

  public static getInstance(): ActivityMonitoringService {
    if (!ActivityMonitoringService.instance) {
      ActivityMonitoringService.instance = new ActivityMonitoringService();
    }
    return ActivityMonitoringService.instance;
  }

  /**
   * Start monitoring admin activity
   */
  public startMonitoring(): void {
    if (this.monitoringInterval) {
      return; // Already monitoring
    }

    // Monitor activity every 15 minutes
    this.monitoringInterval = setInterval(() => {
      this.updateLoginActivity();
    }, 15 * 60 * 1000);

    // Initial update
    this.updateLoginActivity();
  }

  /**
   * Stop monitoring admin activity
   */
  public stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
  }

  /**
   * Update login activity for current admin
   */
  public async updateLoginActivity(): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return; // Not logged in
      }

      // Check if this is an admin user
      const { data: adminAccount, error } = await supabase
        .from('admin_accounts')
        .select('*')
        .eq('email', user.email)
        .single();

      if (error || !adminAccount) {
        return; // Not an admin account
      }

      // Update last login and increment login count
      const { error: updateError } = await supabase
        .from('admin_accounts')
        .update({
          last_login: new Date().toISOString(),
          login_count: adminAccount.login_count + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', adminAccount.id);

      if (updateError) {
        console.error('Error updating admin login activity:', updateError);
      } else {
        console.log('✅ Admin login activity updated for:', user.email);
      }
    } catch (error) {
      console.error('Error updating login activity:', error);
    }
  }

  /**
   * Get admin activity summary
   */
  public async getActivitySummary(): Promise<ActivitySummary> {
    try {
      // Get all admin accounts
      const { data: adminAccounts, error } = await supabase
        .from('admin_accounts')
        .select('*');

      if (error || !adminAccounts) {
        throw new Error('Failed to fetch admin accounts');
      }

      const now = new Date();
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      // Calculate summary statistics
      const totalAdmins = adminAccounts.length;
      const activeAdmins = adminAccounts.filter(admin => 
        admin.status === 'active' && 
        admin.last_login && 
        new Date(admin.last_login) > sevenDaysAgo
      ).length;
      const inactiveAdmins = totalAdmins - activeAdmins;
      const recentLogins = adminAccounts.filter(admin => 
        admin.last_login && 
        new Date(admin.last_login) > oneDayAgo
      ).length;

      // Find most active admin
      const mostActiveAdmin = adminAccounts.reduce((prev, current) => 
        (current.login_count > prev.login_count) ? current : prev
      );

      // Get recent activity count
      const { data: recentActions, error: actionsError } = await supabase
        .from('admin_activity_logs')
        .select('id')
        .gte('created_at', oneDayAgo.toISOString());

      const totalActions = recentActions ? recentActions.length : 0;

      // Calculate activity trend (simplified)
      const activityTrend: 'increasing' | 'decreasing' | 'stable' = 
        totalActions > 10 ? 'increasing' : totalActions < 5 ? 'decreasing' : 'stable';

      return {
        total_admins: totalAdmins,
        active_admins: activeAdmins,
        inactive_admins: inactiveAdmins,
        recent_logins: recentLogins,
        total_actions: totalActions,
        most_active_admin: mostActiveAdmin?.email || 'N/A',
        activity_trend: activityTrend
      };
    } catch (error) {
      console.error('Error getting activity summary:', error);
      throw error;
    }
  }

  /**
   * Get detailed admin activity
   */
  public async getAdminActivity(): Promise<AdminActivity[]> {
    try {
      // Get all admin accounts with their recent activity
      const { data: adminAccounts, error } = await supabase
        .from('admin_accounts')
        .select('*')
        .order('last_login', { ascending: false });

      if (error || !adminAccounts) {
        throw new Error('Failed to fetch admin accounts');
      }

      const adminActivities: AdminActivity[] = [];

      for (const admin of adminAccounts) {
        // Get recent actions for this admin
        const { data: recentActions, error: actionsError } = await supabase
          .from('admin_activity_logs')
          .select('action')
          .eq('admin_id', admin.id)
          .order('created_at', { ascending: false })
          .limit(5);

        const recentActionsList = recentActions ? recentActions.map(a => a.action) : [];

        // Calculate activity score based on login count and recent actions
        const daysSinceLastLogin = admin.last_login 
          ? Math.ceil((Date.now() - new Date(admin.last_login).getTime()) / (1000 * 60 * 60 * 24))
          : 999;
        
        const activityScore = Math.max(0, 100 - (daysSinceLastLogin * 10) + (recentActionsList.length * 5));

        adminActivities.push({
          admin_id: admin.id,
          admin_email: admin.email,
          admin_name: admin.full_name,
          last_login: admin.last_login || '',
          login_count: admin.login_count || 0,
          status: admin.status,
          role: admin.role,
          recent_actions: recentActionsList,
          activity_score: Math.min(100, activityScore)
        });
      }

      return adminActivities;
    } catch (error) {
      console.error('Error getting admin activity:', error);
      throw error;
    }
  }

  /**
   * Log admin action manually
   */
  public async logAdminAction(action: string, details?: any): Promise<void> {
    try {
      await auditService.logActivity(action, details);
    } catch (error) {
      console.error('Error logging admin action:', error);
    }
  }

  /**
   * Get activity trends over time
   */
  public async getActivityTrends(days: number = 7): Promise<any[]> {
    try {
      const endDate = new Date();
      const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);

      const { data: activities, error } = await supabase
        .from('admin_activity_logs')
        .select('action, created_at')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .order('created_at', { ascending: true });

      if (error) {
        throw new Error('Failed to fetch activity trends');
      }

      // Group activities by day
      const trends: { [key: string]: number } = {};
      const actionTypes: { [key: string]: number } = {};

      activities?.forEach(activity => {
        const date = new Date(activity.created_at).toISOString().split('T')[0];
        trends[date] = (trends[date] || 0) + 1;
        actionTypes[activity.action] = (actionTypes[activity.action] || 0) + 1;
      });

      return [
        { type: 'daily_activity', data: trends },
        { type: 'action_types', data: actionTypes }
      ];
    } catch (error) {
      console.error('Error getting activity trends:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const activityMonitoringService = ActivityMonitoringService.getInstance();

// Export convenience functions
export const startActivityMonitoring = () => activityMonitoringService.startMonitoring();
export const stopActivityMonitoring = () => activityMonitoringService.stopActivityMonitoring();
export const updateLoginActivity = () => activityMonitoringService.updateLoginActivity();
export const getActivitySummary = () => activityMonitoringService.getActivitySummary();
export const getAdminActivity = () => activityMonitoringService.getAdminActivity();
export const logAdminAction = (action: string, details?: any) => activityMonitoringService.logAdminAction(action, details);
export const getActivityTrends = (days?: number) => activityMonitoringService.getActivityTrends(days);
