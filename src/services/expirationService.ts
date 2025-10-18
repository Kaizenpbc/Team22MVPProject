import { supabase } from '../lib/supabase';
import { auditService } from './auditService';

export interface ExpirationAlert {
  admin_id: string;
  admin_email: string;
  admin_name: string;
  expires_at: string;
  days_until_expiration: number;
  status: 'expiring_soon' | 'expired' | 'grace_period';
}

class ExpirationService {
  private static instance: ExpirationService;
  private checkInterval: NodeJS.Timeout | null = null;

  private constructor() {}

  public static getInstance(): ExpirationService {
    if (!ExpirationService.instance) {
      ExpirationService.instance = new ExpirationService();
    }
    return ExpirationService.instance;
  }

  /**
   * Start monitoring admin account expirations
   */
  public startMonitoring(): void {
    if (this.checkInterval) {
      return; // Already monitoring
    }

    // Check for expirations every hour
    this.checkInterval = setInterval(() => {
      this.checkExpirations();
    }, 60 * 60 * 1000);

    // Initial check
    this.checkExpirations();
  }

  /**
   * Stop monitoring admin account expirations
   */
  public stopMonitoring(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  /**
   * Check for admin account expirations and send notifications
   */
  public async checkExpirations(): Promise<void> {
    try {
      console.log('🔍 Checking admin account expirations...');

      // Get all admin accounts with expiration dates
      const { data: adminAccounts, error } = await supabase
        .from('admin_accounts')
        .select('*')
        .not('expires_at', 'is', null)
        .eq('status', 'active');

      if (error) {
        console.error('Error fetching admin accounts for expiration check:', error);
        return;
      }

      if (!adminAccounts || adminAccounts.length === 0) {
        console.log('No admin accounts with expiration dates found');
        return;
      }

      const now = new Date();
      const alerts: ExpirationAlert[] = [];

      for (const admin of adminAccounts) {
        const expirationDate = new Date(admin.expires_at);
        const daysUntilExpiration = Math.ceil((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        if (daysUntilExpiration <= 0) {
          // Account has expired
          alerts.push({
            admin_id: admin.id,
            admin_email: admin.email,
            admin_name: admin.full_name,
            expires_at: admin.expires_at,
            days_until_expiration: daysUntilExpiration,
            status: 'expired'
          });
        } else if (daysUntilExpiration <= 7) {
          // Account is in grace period (expired but within 7 days)
          alerts.push({
            admin_id: admin.id,
            admin_email: admin.email,
            admin_name: admin.full_name,
            expires_at: admin.expires_at,
            days_until_expiration: daysUntilExpiration,
            status: 'grace_period'
          });
        } else if (daysUntilExpiration <= 30) {
          // Account is expiring soon
          alerts.push({
            admin_id: admin.id,
            admin_email: admin.email,
            admin_name: admin.full_name,
            expires_at: admin.expires_at,
            days_until_expiration: daysUntilExpiration,
            status: 'expiring_soon'
          });
        }
      }

      // Process alerts
      for (const alert of alerts) {
        await this.processExpirationAlert(alert);
      }

      console.log(`✅ Expiration check completed. Found ${alerts.length} alerts.`);
    } catch (error) {
      console.error('Error checking admin expirations:', error);
    }
  }

  /**
   * Process a single expiration alert
   */
  private async processExpirationAlert(alert: ExpirationAlert): Promise<void> {
    try {
      const { admin_email, admin_name, days_until_expiration, status } = alert;

      let subject = '';
      let message = '';
      let notificationType = '';

      switch (status) {
        case 'expiring_soon':
          subject = `Admin Account Expiring Soon - ${days_until_expiration} days`;
          message = `Dear ${admin_name},\n\nYour admin account will expire in ${days_until_expiration} days. Please contact the Super Admin to renew your access.\n\nBest regards,\nAdmin Team`;
          notificationType = 'expiration_warning';
          break;

        case 'grace_period':
          subject = `Admin Account Expired - Grace Period Active`;
          message = `Dear ${admin_name},\n\nYour admin account has expired but is still in the grace period. Please contact the Super Admin immediately to renew your access.\n\nBest regards,\nAdmin Team`;
          notificationType = 'expiration_grace';
          break;

        case 'expired':
          subject = `Admin Account Expired - Access Suspended`;
          message = `Dear ${admin_name},\n\nYour admin account has expired and access has been suspended. Please contact the Super Admin to restore your access.\n\nBest regards,\nAdmin Team`;
          notificationType = 'expiration_suspended';
          break;
      }

      // Send notification email
      const { error: emailError } = await supabase.rpc('send_user_notification', {
        recipient_email: admin_email,
        subject,
        message,
        notification_type: notificationType
      });

      if (emailError) {
        console.error('Error sending expiration notification:', emailError);
      } else {
        console.log(`✅ Expiration notification sent to ${admin_email}`);
        
        // Log the notification
        await auditService.logEmailSent(admin_email, subject, notificationType);
      }

      // If account is expired and not in grace period, suspend it
      if (status === 'expired' && days_until_expiration < -7) {
        await this.suspendExpiredAccount(alert.admin_id, admin_email);
      }
    } catch (error) {
      console.error('Error processing expiration alert:', error);
    }
  }

  /**
   * Suspend an expired admin account
   */
  private async suspendExpiredAccount(adminId: string, adminEmail: string): Promise<void> {
    try {
      const { error } = await supabase.rpc('manage_admin_status', {
        target_admin_id: adminId,
        new_status: 'suspended'
      });

      if (error) {
        console.error('Error suspending expired admin account:', error);
      } else {
        console.log(`✅ Expired admin account suspended: ${adminEmail}`);
        
        // Log the suspension
        await auditService.logAdminStatusChange(adminEmail, 'active', 'suspended');
      }
    } catch (error) {
      console.error('Error suspending expired admin account:', error);
    }
  }

  /**
   * Get expiration alerts for display
   */
  public async getExpirationAlerts(): Promise<ExpirationAlert[]> {
    try {
      const { data: adminAccounts, error } = await supabase
        .from('admin_accounts')
        .select('*')
        .not('expires_at', 'is', null)
        .eq('status', 'active');

      if (error) {
        console.error('Error fetching admin accounts for alerts:', error);
        return [];
      }

      if (!adminAccounts || adminAccounts.length === 0) {
        return [];
      }

      const now = new Date();
      const alerts: ExpirationAlert[] = [];

      for (const admin of adminAccounts) {
        const expirationDate = new Date(admin.expires_at);
        const daysUntilExpiration = Math.ceil((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        if (daysUntilExpiration <= 30) {
          alerts.push({
            admin_id: admin.id,
            admin_email: admin.email,
            admin_name: admin.full_name,
            expires_at: admin.expires_at,
            days_until_expiration: daysUntilExpiration,
            status: daysUntilExpiration <= 0 ? 'expired' : daysUntilExpiration <= 7 ? 'grace_period' : 'expiring_soon'
          });
        }
      }

      return alerts.sort((a, b) => a.days_until_expiration - b.days_until_expiration);
    } catch (error) {
      console.error('Error getting expiration alerts:', error);
      return [];
    }
  }

  /**
   * Send manual expiration notification
   */
  public async sendExpirationNotification(adminEmail: string, daysUntilExpiration: number): Promise<void> {
    try {
      let subject = '';
      let message = '';
      let notificationType = '';

      if (daysUntilExpiration <= 0) {
        subject = 'Admin Account Expired - Access Suspended';
        message = `Your admin account has expired. Please contact the Super Admin to restore your access.`;
        notificationType = 'expiration_suspended';
      } else if (daysUntilExpiration <= 7) {
        subject = `Admin Account Expiring Soon - ${daysUntilExpiration} days`;
        message = `Your admin account will expire in ${daysUntilExpiration} days. Please contact the Super Admin to renew your access.`;
        notificationType = 'expiration_warning';
      } else {
        subject = `Admin Account Expiring Soon - ${daysUntilExpiration} days`;
        message = `Your admin account will expire in ${daysUntilExpiration} days. Please contact the Super Admin to renew your access.`;
        notificationType = 'expiration_warning';
      }

      const { error } = await supabase.rpc('send_user_notification', {
        recipient_email: adminEmail,
        subject,
        message,
        notification_type: notificationType
      });

      if (error) {
        console.error('Error sending manual expiration notification:', error);
        throw error;
      }

      // Log the notification
      await auditService.logEmailSent(adminEmail, subject, notificationType);
    } catch (error) {
      console.error('Error sending manual expiration notification:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const expirationService = ExpirationService.getInstance();

// Export convenience functions
export const startExpirationMonitoring = () => expirationService.startMonitoring();
export const stopExpirationMonitoring = () => expirationService.stopExpirationMonitoring();
export const checkExpirations = () => expirationService.checkExpirations();
export const getExpirationAlerts = () => expirationService.getExpirationAlerts();
export const sendExpirationNotification = (adminEmail: string, daysUntilExpiration: number) => 
  expirationService.sendExpirationNotification(adminEmail, daysUntilExpiration);
