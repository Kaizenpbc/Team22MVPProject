import React, { useState, useEffect } from 'react';
import { expirationService, ExpirationAlert } from '../../services/expirationService';
import { Clock, AlertTriangle, XCircle, RefreshCw, Mail } from 'lucide-react';

const ExpirationAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<ExpirationAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const expirationAlerts = await expirationService.getExpirationAlerts();
      setAlerts(expirationAlerts);
    } catch (error) {
      console.error('Error fetching expiration alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshAlerts = async () => {
    setRefreshing(true);
    await fetchAlerts();
    setRefreshing(false);
  };

  const sendNotification = async (alert: ExpirationAlert) => {
    try {
      await expirationService.sendExpirationNotification(alert.admin_email, alert.days_until_expiration);
      alert('Notification sent successfully!');
    } catch (error) {
      console.error('Error sending notification:', error);
      alert('Error sending notification. Please check console.');
    }
  };

  const getAlertIcon = (status: string) => {
    switch (status) {
      case 'expired':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'grace_period':
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'expiring_soon':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getAlertColor = (status: string) => {
    switch (status) {
      case 'expired':
        return 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800';
      case 'grace_period':
        return 'bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800';
      case 'expiring_soon':
        return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800';
      default:
        return 'bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-800';
    }
  };

  const getAlertText = (status: string, days: number) => {
    switch (status) {
      case 'expired':
        return `Expired ${Math.abs(days)} days ago`;
      case 'grace_period':
        return `Grace period - ${Math.abs(days)} days past expiration`;
      case 'expiring_soon':
        return `Expires in ${days} days`;
      default:
        return `${days} days remaining`;
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading expiration alerts...</p>
        </div>
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Expiration Alerts
          </h3>
          <button
            onClick={refreshAlerts}
            disabled={refreshing}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            title="Refresh alerts"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
          <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No admin accounts expiring soon</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Expiration Alerts
          </h3>
          <button
            onClick={refreshAlerts}
            disabled={refreshing}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            title="Refresh alerts"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {alerts.map((alert) => (
          <div key={alert.admin_id} className={`p-4 ${getAlertColor(alert.status)}`}>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                {getAlertIcon(alert.status)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {alert.admin_name}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    ({alert.admin_email})
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  {getAlertText(alert.status, alert.days_until_expiration)}
                </p>
                
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Expires: {new Date(alert.expires_at).toLocaleDateString()}
                </div>
              </div>
              
              <div className="flex-shrink-0">
                <button
                  onClick={() => sendNotification(alert)}
                  className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  title="Send notification"
                >
                  <Mail className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            {alerts.length} admin account{alerts.length !== 1 ? 's' : ''} requiring attention
          </span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-red-600">
              <XCircle className="w-3 h-3" />
              {alerts.filter(a => a.status === 'expired').length} Expired
            </span>
            <span className="flex items-center gap-1 text-orange-600">
              <AlertTriangle className="w-3 h-3" />
              {alerts.filter(a => a.status === 'grace_period').length} Grace Period
            </span>
            <span className="flex items-center gap-1 text-yellow-600">
              <Clock className="w-3 h-3" />
              {alerts.filter(a => a.status === 'expiring_soon').length} Expiring Soon
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpirationAlerts;
