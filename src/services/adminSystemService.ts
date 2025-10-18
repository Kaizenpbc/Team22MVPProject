import { activityMonitoringService } from './activityMonitoringService';
import { expirationService } from './expirationService';
import { auditService } from './auditService';

/**
 * Admin System Service - Initializes and manages the entire admin system
 */
class AdminSystemService {
  private static instance: AdminSystemService;
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): AdminSystemService {
    if (!AdminSystemService.instance) {
      AdminSystemService.instance = new AdminSystemService();
    }
    return AdminSystemService.instance;
  }

  /**
   * Initialize the admin system
   */
  public initialize(): void {
    if (this.isInitialized) {
      console.log('Admin system already initialized');
      return;
    }

    try {
      console.log('🚀 Initializing Admin System...');

      // Start activity monitoring
      activityMonitoringService.startMonitoring();
      console.log('✅ Activity monitoring started');

      // Start expiration monitoring
      expirationService.startMonitoring();
      console.log('✅ Expiration monitoring started');

      // Log system initialization
      auditService.logActivity('admin_system_initialized', {
        timestamp: new Date().toISOString(),
        services: ['activity_monitoring', 'expiration_monitoring', 'audit_logging']
      });

      this.isInitialized = true;
      console.log('🎉 Admin System initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing admin system:', error);
      throw error;
    }
  }

  /**
   * Shutdown the admin system
   */
  public shutdown(): void {
    if (!this.isInitialized) {
      console.log('Admin system not initialized');
      return;
    }

    try {
      console.log('🛑 Shutting down Admin System...');

      // Stop activity monitoring
      activityMonitoringService.stopMonitoring();
      console.log('✅ Activity monitoring stopped');

      // Stop expiration monitoring
      expirationService.stopMonitoring();
      console.log('✅ Expiration monitoring stopped');

      // Log system shutdown
      auditService.logActivity('admin_system_shutdown', {
        timestamp: new Date().toISOString()
      });

      this.isInitialized = false;
      console.log('✅ Admin System shut down successfully');
    } catch (error) {
      console.error('❌ Error shutting down admin system:', error);
    }
  }

  /**
   * Get system status
   */
  public getStatus(): { initialized: boolean; services: string[] } {
    return {
      initialized: this.isInitialized,
      services: [
        'activity_monitoring',
        'expiration_monitoring',
        'audit_logging'
      ]
    };
  }

  /**
   * Force update login activity
   */
  public updateLoginActivity(): void {
    activityMonitoringService.updateLoginActivity();
  }

  /**
   * Force check expirations
   */
  public checkExpirations(): void {
    expirationService.checkExpirations();
  }

  /**
   * Get system health
   */
  public async getSystemHealth(): Promise<{
    status: 'healthy' | 'warning' | 'error';
    services: { [key: string]: 'running' | 'stopped' | 'error' };
    last_check: string;
  }> {
    try {
      const services: { [key: string]: 'running' | 'stopped' | 'error' } = {};

      // Check activity monitoring
      try {
        await activityMonitoringService.getActivitySummary();
        services.activity_monitoring = 'running';
      } catch (error) {
        services.activity_monitoring = 'error';
      }

      // Check expiration monitoring
      try {
        await expirationService.getExpirationAlerts();
        services.expiration_monitoring = 'running';
      } catch (error) {
        services.expiration_monitoring = 'error';
      }

      // Check audit logging
      try {
        await auditService.getAuditLogs(1);
        services.audit_logging = 'running';
      } catch (error) {
        services.audit_logging = 'error';
      }

      const errorCount = Object.values(services).filter(status => status === 'error').length;
      const status: 'healthy' | 'warning' | 'error' = 
        errorCount === 0 ? 'healthy' : errorCount === 1 ? 'warning' : 'error';

      return {
        status,
        services,
        last_check: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error checking system health:', error);
      return {
        status: 'error',
        services: {},
        last_check: new Date().toISOString()
      };
    }
  }
}

// Export singleton instance
export const adminSystemService = AdminSystemService.getInstance();

// Export convenience functions
export const initializeAdminSystem = () => adminSystemService.initialize();
export const shutdownAdminSystem = () => adminSystemService.shutdown();
export const getAdminSystemStatus = () => adminSystemService.getStatus();
export const updateLoginActivity = () => adminSystemService.updateLoginActivity();
export const checkExpirations = () => adminSystemService.checkExpirations();
export const getSystemHealth = () => adminSystemService.getSystemHealth();
