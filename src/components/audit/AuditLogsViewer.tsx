import React, { useState, useEffect } from 'react';
import { auditService, AuditLogEntry } from '../../services/auditService';
import { Activity, User, Mail, Shield, Clock, Eye, Filter } from 'lucide-react';

interface AuditLogsViewerProps {
  limit?: number;
  showFilters?: boolean;
  className?: string;
}

const AuditLogsViewer: React.FC<AuditLogsViewerProps> = ({ 
  limit = 50, 
  showFilters = true, 
  className = '' 
}) => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    fetchLogs();
  }, [filter, offset, limit]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      let fetchedLogs: AuditLogEntry[] = [];

      if (filter === 'all') {
        fetchedLogs = await auditService.getAuditLogs(limit, offset);
      } else {
        fetchedLogs = await auditService.getAuditLogsByAction(filter, limit);
      }

      if (offset === 0) {
        setLogs(fetchedLogs);
      } else {
        setLogs(prev => [...prev, ...fetchedLogs]);
      }
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'user_suspended':
      case 'user_activated':
      case 'user_deleted':
        return <User className="w-4 h-4" />;
      case 'email_sent':
      case 'bulk_email_sent':
        return <Mail className="w-4 h-4" />;
      case 'admin_created':
      case 'admin_status_changed':
      case 'admin_expiration_extended':
        return <Shield className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'user_suspended':
      case 'user_deleted':
        return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      case 'user_activated':
        return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      case 'email_sent':
      case 'bulk_email_sent':
        return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
      case 'admin_created':
      case 'admin_status_changed':
      case 'admin_expiration_extended':
        return 'text-purple-600 bg-purple-50 dark:bg-purple-900/20';
      default:
        return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const formatAction = (action: string) => {
    return action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatDetails = (details: any) => {
    if (!details) return '';
    
    try {
      const parsed = typeof details === 'string' ? JSON.parse(details) : details;
      const keyDetails = [];
      
      if (parsed.user_email) keyDetails.push(`User: ${parsed.user_email}`);
      if (parsed.admin_email) keyDetails.push(`Admin: ${parsed.admin_email}`);
      if (parsed.recipient_email) keyDetails.push(`Recipient: ${parsed.recipient_email}`);
      if (parsed.subject) keyDetails.push(`Subject: ${parsed.subject}`);
      if (parsed.recipient_count) keyDetails.push(`Recipients: ${parsed.recipient_count}`);
      if (parsed.additional_days) keyDetails.push(`Extended by: ${parsed.additional_days} days`);
      
      return keyDetails.join(', ');
    } catch (error) {
      return '';
    }
  };

  const loadMore = () => {
    setOffset(prev => prev + limit);
  };

  const resetFilters = () => {
    setFilter('all');
    setOffset(0);
  };

  if (loading && logs.length === 0) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm ${className}`}>
        <div className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading audit logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Audit Logs
          </h3>
          {showFilters && (
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => {
                  setFilter(e.target.value);
                  setOffset(0);
                }}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              >
                <option value="all">All Actions</option>
                <option value="user_suspended">User Suspended</option>
                <option value="user_activated">User Activated</option>
                <option value="user_deleted">User Deleted</option>
                <option value="email_sent">Email Sent</option>
                <option value="bulk_email_sent">Bulk Email Sent</option>
                <option value="admin_created">Admin Created</option>
                <option value="admin_status_changed">Admin Status Changed</option>
                <option value="admin_expiration_extended">Admin Expiration Extended</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Logs List */}
      <div className="max-h-96 overflow-y-auto">
        {logs.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            No audit logs found
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {logs.map((log) => (
              <div key={log.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${getActionColor(log.action)}`}>
                    {getActionIcon(log.action)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {formatAction(log.action)}
                      </span>
                      {log.admin_accounts && (
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          by {log.admin_accounts.email}
                        </span>
                      )}
                    </div>
                    
                    {formatDetails(log.details) && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        {formatDetails(log.details)}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(log.created_at).toLocaleString()}
                      </div>
                      {log.ip_address && (
                        <div>
                          IP: {log.ip_address}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Load More Button */}
      {logs.length > 0 && logs.length >= limit && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={loadMore}
            disabled={loading}
            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}

      {/* Reset Filters */}
      {filter !== 'all' && (
        <div className="px-6 py-2 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={resetFilters}
            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default AuditLogsViewer;
