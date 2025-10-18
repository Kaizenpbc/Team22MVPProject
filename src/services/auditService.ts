import { supabase } from '../lib/supabase';

export interface AuditLogEntry {
  id: string;
  admin_id: string;
  action: string;
  details: any;
  ip_address: string;
  user_agent: string;
  created_at: string;
}

export interface AdminActivity {
  action: string;
  details?: any;
  timestamp: Date;
  admin_email?: string;
}

class AuditService {
  private static instance: AuditService;
  private activityQueue: AdminActivity[] = [];
  private isProcessing = false;

  private constructor() {
    // Process queued activities every 5 seconds
    setInterval(() => {
      this.processQueue();
    }, 5000);
  }

  public static getInstance(): AuditService {
    if (!AuditService.instance) {
      AuditService.instance = new AuditService();
    }
    return AuditService.instance;
  }

  /**
   * Log an admin activity
   */
  public async logActivity(action: string, details?: any): Promise<void> {
    const activity: AdminActivity = {
      action,
      details,
      timestamp: new Date(),
    };

    // Add to queue for batch processing
    this.activityQueue.push(activity);

    // Try to process immediately
    this.processQueue();
  }

  /**
   * Process the activity queue
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.activityQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    try {
      // Process all activities in the queue
      const activities = [...this.activityQueue];
      this.activityQueue = [];

      for (const activity of activities) {
        await this.sendToDatabase(activity);
      }
    } catch (error) {
      console.error('Error processing audit queue:', error);
      // Re-queue failed activities
      // Note: In production, you might want to implement retry logic with exponential backoff
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Send activity to database
   */
  private async sendToDatabase(activity: AdminActivity): Promise<void> {
    try {
      const { error } = await supabase.rpc('log_admin_activity', {
        activity_action: activity.action,
        activity_details: activity.details ? JSON.stringify(activity.details) : null
      });

      if (error) {
        console.error('Error logging admin activity:', error);
        // In production, you might want to store failed logs locally or send to external service
      } else {
        console.log('✅ Admin activity logged:', activity.action);
      }
    } catch (error) {
      console.error('Unexpected error logging activity:', error);
    }
  }

  /**
   * Get audit logs for a specific admin (if admin) or all logs (if super admin)
   */
  public async getAuditLogs(limit: number = 100, offset: number = 0): Promise<AuditLogEntry[]> {
    try {
      // For now, we'll implement a simple version that gets all logs
      // In the future, this could be filtered by admin role
      const { data, error } = await supabase
        .from('admin_activity_logs')
        .select(`
          id,
          admin_id,
          action,
          details,
          ip_address,
          user_agent,
          created_at,
          admin_accounts!inner(
            email,
            full_name
          )
        `)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('Error fetching audit logs:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Unexpected error fetching audit logs:', error);
      return [];
    }
  }

  /**
   * Get audit logs for a specific action type
   */
  public async getAuditLogsByAction(action: string, limit: number = 100): Promise<AuditLogEntry[]> {
    try {
      const { data, error } = await supabase
        .from('admin_activity_logs')
        .select(`
          id,
          admin_id,
          action,
          details,
          ip_address,
          user_agent,
          created_at,
          admin_accounts!inner(
            email,
            full_name
          )
        `)
        .eq('action', action)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching audit logs by action:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Unexpected error fetching audit logs by action:', error);
      return [];
    }
  }

  /**
   * Convenience methods for common admin actions
   */
  public async logUserSuspension(userId: string, userEmail: string): Promise<void> {
    await this.logActivity('user_suspended', {
      user_id: userId,
      user_email: userEmail,
      timestamp: new Date().toISOString()
    });
  }

  public async logUserActivation(userId: string, userEmail: string): Promise<void> {
    await this.logActivity('user_activated', {
      user_id: userId,
      user_email: userEmail,
      timestamp: new Date().toISOString()
    });
  }

  public async logUserDeletion(userId: string, userEmail: string): Promise<void> {
    await this.logActivity('user_deleted', {
      user_id: userId,
      user_email: userEmail,
      timestamp: new Date().toISOString()
    });
  }

  public async logEmailSent(recipientEmail: string, subject: string, type: string): Promise<void> {
    await this.logActivity('email_sent', {
      recipient_email: recipientEmail,
      subject,
      email_type: type,
      timestamp: new Date().toISOString()
    });
  }

  public async logBulkEmailSent(recipientCount: number, subject: string, type: string): Promise<void> {
    await this.logActivity('bulk_email_sent', {
      recipient_count: recipientCount,
      subject,
      email_type: type,
      timestamp: new Date().toISOString()
    });
  }

  public async logAdminCreation(adminEmail: string, adminRole: string): Promise<void> {
    await this.logActivity('admin_created', {
      admin_email: adminEmail,
      admin_role: adminRole,
      timestamp: new Date().toISOString()
    });
  }

  public async logAdminStatusChange(adminEmail: string, oldStatus: string, newStatus: string): Promise<void> {
    await this.logActivity('admin_status_changed', {
      admin_email: adminEmail,
      old_status: oldStatus,
      new_status: newStatus,
      timestamp: new Date().toISOString()
    });
  }

  public async logAdminExpirationExtension(adminEmail: string, additionalDays: number): Promise<void> {
    await this.logActivity('admin_expiration_extended', {
      admin_email: adminEmail,
      additional_days: additionalDays,
      timestamp: new Date().toISOString()
    });
  }
}

// Export singleton instance
export const auditService = AuditService.getInstance();

// Export convenience functions
export const logActivity = (action: string, details?: any) => auditService.logActivity(action, details);
export const logUserSuspension = (userId: string, userEmail: string) => auditService.logUserSuspension(userId, userEmail);
export const logUserActivation = (userId: string, userEmail: string) => auditService.logUserActivation(userId, userEmail);
export const logUserDeletion = (userId: string, userEmail: string) => auditService.logUserDeletion(userId, userEmail);
export const logEmailSent = (recipientEmail: string, subject: string, type: string) => auditService.logEmailSent(recipientEmail, subject, type);
export const logBulkEmailSent = (recipientCount: number, subject: string, type: string) => auditService.logBulkEmailSent(recipientCount, subject, type);
export const logAdminCreation = (adminEmail: string, adminRole: string) => auditService.logAdminCreation(adminEmail, adminRole);
export const logAdminStatusChange = (adminEmail: string, oldStatus: string, newStatus: string) => auditService.logAdminStatusChange(adminEmail, oldStatus, newStatus);
export const logAdminExpirationExtension = (adminEmail: string, additionalDays: number) => auditService.logAdminExpirationExtension(adminEmail, additionalDays);
