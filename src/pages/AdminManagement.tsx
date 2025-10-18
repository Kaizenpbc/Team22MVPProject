import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { isAdmin } from '../utils/roleUtils';
import { supabase } from '../lib/supabase';
import { auditService } from '../services/auditService';
import { adminSystemService } from '../services/adminSystemService';
import AuditLogsViewer from '../components/audit/AuditLogsViewer';
import ExpirationAlerts from '../components/admin/ExpirationAlerts';
import ActivityDashboard from '../components/admin/ActivityDashboard';
import { ArrowLeft, Users, Shield, UserPlus, Clock, Activity, Mail, UserCheck, UserX, DollarSign } from 'lucide-react';

interface AdminAccount {
  id: string;
  email: string;
  full_name: string;
  role: 'super_admin' | 'admin';
  status: 'active' | 'suspended' | 'pending';
  created_by_email: string;
  expires_at: string;
  last_login: string;
  login_count: number;
  created_at: string;
  updated_at: string;
}

const AdminManagement: React.FC = () => {
  const { user } = useAuth();
  const [admins, setAdmins] = useState<AdminAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminRole, setNewAdminRole] = useState<'super_admin' | 'admin'>('admin');
  const [expirationDays, setExpirationDays] = useState(365);

  useEffect(() => {
    fetchAdmins();
    
    // Initialize admin system when component mounts
    adminSystemService.initialize();
    
    // Cleanup when component unmounts
    return () => {
      adminSystemService.shutdown();
    };
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching admin accounts...');
      
      const { data, error } = await supabase.rpc('get_all_admin_accounts');
      
      if (error) {
        console.error('❌ Error fetching admin accounts:', error);
        throw error;
      }
      
      console.log('✅ Successfully fetched admin accounts:', data?.length || 0);
      setAdmins(data || []);
    } catch (error) {
      console.error('❌ Error fetching admin accounts:', error);
      setAdmins([]);
    } finally {
      setLoading(false);
    }
  };

  const createAdmin = async () => {
    if (!newAdminEmail || !newAdminName) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      console.log('🔧 Creating admin account...');
      
      const { data, error } = await supabase.rpc('create_admin_account', {
        admin_email: newAdminEmail,
        admin_name: newAdminName,
        admin_role: newAdminRole,
        expiration_days: expirationDays
      });
      
      if (error) {
        console.error('❌ Error creating admin account:', error);
        alert('Error creating admin account: ' + error.message);
        return;
      }
      
      console.log('✅ Admin account created successfully:', data);
      alert('Admin account created successfully!');
      
      // Log the admin creation action
      await auditService.logAdminCreation(newAdminEmail, newAdminRole);
      
      // Reset form and close modal
      setNewAdminEmail('');
      setNewAdminName('');
      setNewAdminRole('admin');
      setExpirationDays(365);
      setShowCreateModal(false);
      setShowInviteModal(false);
      
      // Refresh admin list
      await fetchAdmins();
    } catch (error) {
      console.error('❌ Unexpected error:', error);
      alert('Unexpected error occurred. Please check console.');
    }
  };

  const manageAdminStatus = async (adminId: string, newStatus: 'active' | 'suspended') => {
    const action = newStatus === 'active' ? 'activate' : 'suspend';
    if (!confirm(`Are you sure you want to ${action} this admin account?`)) return;
    
    try {
      const { data, error } = await supabase.rpc('manage_admin_status', {
        target_admin_id: adminId,
        new_status: newStatus
      });
      
      if (error) {
        console.error(`❌ Error ${action}ing admin:`, error);
        alert(`Error ${action}ing admin: ` + error.message);
        return;
      }
      
      console.log(`✅ Admin ${action}ed successfully:`, data);
      alert(`Admin ${action}ed successfully!`);
      
      // Log the admin status change
      await auditService.logAdminStatusChange(userEmail, newStatus === 'active' ? 'suspended' : 'active', newStatus);
      
      await fetchAdmins();
    } catch (error) {
      console.error('❌ Unexpected error:', error);
      alert('Unexpected error occurred. Please check console.');
    }
  };

  const extendAdminExpiration = async (adminId: string, additionalDays: number) => {
    try {
      const { data, error } = await supabase.rpc('extend_admin_expiration', {
        target_admin_id: adminId,
        additional_days: additionalDays
      });
      
      if (error) {
        console.error('❌ Error extending admin expiration:', error);
        alert('Error extending admin expiration: ' + error.message);
        return;
      }
      
      console.log('✅ Admin expiration extended successfully:', data);
      alert('Admin expiration extended successfully!');
      
      // Log the admin expiration extension
      await auditService.logAdminExpirationExtension(userEmail, additionalDays);
      
      await fetchAdmins();
    } catch (error) {
      console.error('❌ Unexpected error:', error);
      alert('Unexpected error occurred. Please check console.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading admin accounts...</p>
        </div>
      </div>
    );
  }

  const totalAdmins = admins.length;
  const activeAdmins = admins.filter(a => a.status === 'active').length;
  const suspendedAdmins = admins.filter(a => a.status === 'suspended').length;
  const expiringSoon = admins.filter(a => {
    if (!a.expires_at) return false;
    const expirationDate = new Date(a.expires_at);
    const daysUntilExpiration = Math.ceil((expirationDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiration <= 30 && daysUntilExpiration > 0;
  }).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.history.back()}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                  <Shield className="w-8 h-8 text-blue-600" />
                  Admin Management
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Manage admin accounts, permissions, and access
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => window.location.href = '/tier-management'}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
                title="Manage subscription tiers"
              >
                <DollarSign className="w-4 h-4" />
                Tier Management
              </button>
              <button
                onClick={() => setShowInviteModal(true)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Send Invitation
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                Create Admin
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Admins</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalAdmins}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <UserCheck className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Admins</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{activeAdmins}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <UserX className="w-8 h-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Suspended</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{suspendedAdmins}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Expiring Soon</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{expiringSoon}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Accounts Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Admin Accounts</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Admin
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Expires
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {admins.map((admin) => {
                  const expirationDate = admin.expires_at ? new Date(admin.expires_at) : null;
                  const daysUntilExpiration = expirationDate 
                    ? Math.ceil((expirationDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                    : null;
                  const isExpired = daysUntilExpiration !== null && daysUntilExpiration <= 0;
                  const isExpiringSoon = daysUntilExpiration !== null && daysUntilExpiration <= 30 && daysUntilExpiration > 0;

                  return (
                    <tr key={admin.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {admin.full_name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {admin.email}
                          </div>
                          <div className="text-xs text-gray-400 dark:text-gray-500">
                            Created by: {admin.created_by_email || 'System'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          admin.role === 'super_admin'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        }`}>
                          {admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          admin.status === 'active'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : admin.status === 'suspended'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}>
                          {admin.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {expirationDate ? (
                          <div>
                            <div className={`${isExpired ? 'text-red-600' : isExpiringSoon ? 'text-orange-600' : 'text-gray-600'}`}>
                              {expirationDate.toLocaleDateString()}
                            </div>
                            {daysUntilExpiration !== null && (
                              <div className="text-xs text-gray-400">
                                {isExpired 
                                  ? 'Expired' 
                                  : isExpiringSoon 
                                  ? `${daysUntilExpiration} days left`
                                  : `${daysUntilExpiration} days left`
                                }
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">Never expires</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Activity className="w-4 h-4" />
                          {admin.last_login 
                            ? new Date(admin.last_login).toLocaleDateString()
                            : 'Never'
                          }
                        </div>
                        <div className="text-xs text-gray-400">
                          {admin.login_count} logins
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                          {admin.status === 'active' ? (
                            <button
                              onClick={() => manageAdminStatus(admin.id, 'suspended')}
                              className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                              title="Suspend admin"
                            >
                              <UserX className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => manageAdminStatus(admin.id, 'active')}
                              className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors"
                              title="Activate admin"
                            >
                              <UserCheck className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => extendAdminExpiration(admin.id, 365)}
                            className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                            title="Extend expiration by 1 year"
                          >
                            <Clock className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity Dashboard Section */}
        <div className="mt-8">
          <ActivityDashboard />
        </div>

        {/* Expiration Alerts Section */}
        <div className="mt-8">
          <ExpirationAlerts />
        </div>

        {/* Audit Logs Section */}
        <div className="mt-8">
          <AuditLogsViewer limit={20} showFilters={true} />
        </div>

        {/* Create Admin Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Create New Admin
                </h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="admin@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={newAdminName}
                    onChange={(e) => setNewAdminName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Role
                  </label>
                  <select
                    value={newAdminRole}
                    onChange={(e) => setNewAdminRole(e.target.value as 'super_admin' | 'admin')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Expiration (days)
                  </label>
                  <input
                    type="number"
                    value={expirationDays}
                    onChange={(e) => setExpirationDays(parseInt(e.target.value) || 365)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    min="1"
                    max="3650"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={createAdmin}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                >
                  Create Admin
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Invite Admin Modal */}
        {showInviteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Send Admin Invitation
                </h3>
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="admin@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={newAdminName}
                    onChange={(e) => setNewAdminName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Role
                  </label>
                  <select
                    value={newAdminRole}
                    onChange={(e) => setNewAdminRole(e.target.value as 'super_admin' | 'admin')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Expiration (days)
                  </label>
                  <input
                    type="number"
                    value={expirationDays}
                    onChange={(e) => setExpirationDays(parseInt(e.target.value) || 365)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    min="1"
                    max="3650"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={createAdmin}
                  className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium"
                >
                  Send Invitation
                </button>
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminManagement;
