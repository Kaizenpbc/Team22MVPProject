import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { isAdmin } from '../utils/roleUtils';
import { supabase } from '../lib/supabase';
import { auditService } from '../services/auditService';
import { creditsAdminService } from '../services/creditsAdminService';
import { ArrowLeft, Users, Mail, Shield, Coins, Calendar, UserX, UserCheck, Trash2, Settings, Plus, Minus } from 'lucide-react';

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: string;
  credits: number;
  subscription_tier: string;
  subscription_status: string;
  created_at: string;
  updated_at: string;
}

const AdminUsers: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [emailType, setEmailType] = useState('general');
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [creditUser, setCreditUser] = useState<UserProfile | null>(null);
  const [creditAmount, setCreditAmount] = useState(0);
  const [creditReason, setCreditReason] = useState('');

  useEffect(() => {
    // Check if user is admin
    if (!user || !isAdmin(user)) {
      navigate('/dashboard');
      return;
    }

    fetchUsers();
  }, [user, navigate]);

  const fetchUsers = async () => {
    try {
      console.log('🔍 Fetching users from database...');
      setUsers([]); // Clear existing users
      
      // Get users from user_profiles table (now includes email data from migration)
      console.log('🔍 Fetching users from user_profiles table with email data...');
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .neq('subscription_status', 'deleted') // Don't show deleted users
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('❌ Error fetching from user_profiles:', error);
        throw error;
      }
      
      console.log('✅ Successfully fetched users from user_profiles:', data?.length || 0, 'users');
      console.log('📧 First user data:', data?.[0]);
      console.log('📧 First user email:', data?.[0]?.email);
      
      setUsers(data || []);
    } catch (error) {
      console.error('❌ Error fetching users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const populateAllUsers = async () => {
    try {
      console.log('🔧 Attempting to populate all users with email data...');
      
      // Use the new function that includes email data
      const { data, error } = await supabase.rpc('populate_user_profiles_with_email');
      
      if (error) {
        console.error('❌ Error populating users:', error);
        alert('Error populating users. Please check console for details.');
        return;
      }
      
      console.log('✅ Users populated successfully with emails:', data);
      
      // Since email data isn't being populated properly, let's try to get it manually
      console.log('🔍 Attempting to get email data manually...');
      
      // Try to get email data from auth.users using a simple approach
      try {
        const { data: authData } = await supabase.auth.getUser();
        console.log('📧 Current user email data:', authData?.user?.email);
        
        // For now, let's just refresh and show the helpful messages
        alert('Users populated successfully! Note: Email data may need to be added manually. Refreshing...');
      } catch (authErr) {
        console.log('⚠️ Could not get auth data:', authErr);
        alert('Users populated successfully! Refreshing...');
      }
      
      // Wait a moment for the database to update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Force refresh the user list
      setLoading(true);
      setUsers([]); // Clear current users first
      await fetchUsers();
    } catch (error) {
      console.error('❌ Unexpected error:', error);
      alert('Unexpected error occurred. Please check console.');
    }
  };

  const suspendUser = async (userId: string, userEmail: string) => {
    if (!confirm(`Are you sure you want to suspend ${userEmail}?`)) return;
    
    try {
      const { data, error } = await supabase.rpc('suspend_user', { user_id: userId });
      
      if (error) {
        console.error('❌ Error suspending user:', error);
        alert('Error suspending user: ' + error.message);
        return;
      }
      
      alert('User suspended successfully: ' + data);
      
      // Log the suspension action
      await auditService.logUserSuspension(userId, userEmail);
      
      // Send suspension notification email
      try {
        await supabase.rpc('send_user_notification', {
          recipient_email: userEmail,
          subject: 'Account Suspended',
          message: `Dear ${userEmail},\n\nYour account has been suspended. Please contact support for more information.\n\nBest regards,\nAdmin Team`,
          notification_type: 'suspension'
        });
        console.log('✅ Suspension notification email sent');
        
        // Log the email sent
        await auditService.logEmailSent(userEmail, 'Account Suspended', 'suspension');
      } catch (emailError) {
        console.log('⚠️ Failed to send suspension email:', emailError);
      }
      
      await fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('❌ Unexpected error:', error);
      alert('Unexpected error occurred. Please check console.');
    }
  };

  const reactivateUser = async (userId: string, userEmail: string) => {
    if (!confirm(`Are you sure you want to reactivate ${userEmail}?`)) return;
    
    try {
      const { data, error } = await supabase.rpc('reactivate_user', { user_id: userId });
      
      if (error) {
        console.error('❌ Error reactivating user:', error);
        alert('Error reactivating user: ' + error.message);
        return;
      }
      
      alert('User reactivated successfully: ' + data);
      
      // Log the reactivation action
      await auditService.logUserActivation(userId, userEmail);
      
      // Send reactivation notification email
      try {
        await supabase.rpc('send_user_notification', {
          recipient_email: userEmail,
          subject: 'Account Reactivated',
          message: `Dear ${userEmail},\n\nYour account has been reactivated and you can now access all features.\n\nBest regards,\nAdmin Team`,
          notification_type: 'reactivation'
        });
        console.log('✅ Reactivation notification email sent');
        
        // Log the email sent
        await auditService.logEmailSent(userEmail, 'Account Reactivated', 'reactivation');
      } catch (emailError) {
        console.log('⚠️ Failed to send reactivation email:', emailError);
      }
      
      await fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('❌ Unexpected error:', error);
      alert('Unexpected error occurred. Please check console.');
    }
  };

  const deleteUser = async (userId: string, userEmail: string) => {
    if (!confirm(`⚠️ WARNING: Are you sure you want to DELETE ${userEmail}?\n\nThis action cannot be undone!`)) return;
    
    try {
      const { data, error } = await supabase.rpc('delete_user', { user_id: userId });
      
      if (error) {
        console.error('❌ Error deleting user:', error);
        alert('Error deleting user: ' + error.message);
        return;
      }
      
      alert('User deleted successfully: ' + data);
      
      // Log the deletion action
      await auditService.logUserDeletion(userId, userEmail);
      
      await fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('❌ Unexpected error:', error);
      alert('Unexpected error occurred. Please check console.');
    }
  };

  const sendEmail = async () => {
    if (!selectedUser) return;
    
    try {
      const { data, error } = await supabase.rpc('send_user_notification', {
        recipient_email: selectedUser.email,
        subject: emailSubject,
        message: emailMessage,
        notification_type: emailType
      });
      
      if (error) {
        console.error('❌ Error sending email:', error);
        alert('Error sending email: ' + error.message);
        return;
      }
      
      alert('Email sent successfully: ' + data);
      
      // Log the email sent
      await auditService.logEmailSent(selectedUser.email, emailSubject, emailType);
      
      setShowEmailModal(false);
      setEmailSubject('');
      setEmailMessage('');
    } catch (error) {
      console.error('❌ Unexpected error:', error);
      alert('Unexpected error occurred. Please check console.');
    }
  };

  const sendBulkEmail = async () => {
    if (!confirm(`Are you sure you want to send this email to ALL users?\n\nSubject: ${emailSubject}`)) return;
    
    try {
      const { data, error } = await supabase.rpc('send_bulk_notification', {
        subject: emailSubject,
        message: emailMessage,
        notification_type: emailType,
        user_filter: 'all'
      });
      
      if (error) {
        console.error('❌ Error sending bulk email:', error);
        alert('Error sending bulk email: ' + error.message);
        return;
      }
      
      alert('Bulk email sent successfully: ' + data);
      
      // Log the bulk email sent
      await auditService.logBulkEmailSent(users.length, emailSubject, emailType);
      
      setShowEmailModal(false);
      setEmailSubject('');
      setEmailMessage('');
    } catch (error) {
      console.error('❌ Unexpected error:', error);
      alert('Unexpected error occurred. Please check console.');
    }
  };

  const openCreditModal = (user: UserProfile) => {
    setCreditUser(user);
    setCreditAmount(0);
    setCreditReason('');
    setShowCreditModal(true);
  };

  const adjustCredits = async () => {
    if (!creditUser || creditAmount === 0) {
      alert('Please enter a credit amount');
      return;
    }

    if (!creditReason.trim()) {
      alert('Please provide a reason for the adjustment');
      return;
    }

    try {
      await creditsAdminService.adjustUserCredits(
        creditUser.id,
        creditAmount,
        creditReason
      );

      alert(`Credits adjusted successfully: ${creditAmount > 0 ? '+' : ''}${creditAmount} credits`);
      setShowCreditModal(false);
      await fetchUsers();
    } catch (error) {
      console.error('Error adjusting credits:', error);
      alert('Error adjusting credits. Please check console.');
    }
  };

  const openEmailModal = (user: UserProfile | null = null) => {
    setSelectedUser(user);
    setShowEmailModal(true);
    
    // Pre-fill template based on user status
    if (user) {
      if (user.subscription_status === 'suspended') {
        setEmailSubject('Account Suspension Notice');
        setEmailMessage(`Dear ${user.full_name || user.email},\n\nYour account has been suspended. Please contact support for more information.\n\nBest regards,\nAdmin Team`);
        setEmailType('suspension');
      } else {
        setEmailSubject('Account Notification');
        setEmailMessage(`Dear ${user.full_name || user.email},\n\nThis is a notification regarding your account.\n\nBest regards,\nAdmin Team`);
        setEmailType('general');
      }
    } else {
      setEmailSubject('Important Update');
      setEmailMessage('Dear User,\n\nThis is an important update from our team.\n\nBest regards,\nAdmin Team');
      setEmailType('general');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading users...</p>
        </div>
      </div>
    );
  }

  const totalUsers = users.length;
  const admins = users.filter(u => u.role === 'admin').length;
  const regularUsers = users.filter(u => u.role === 'user' || !u.role).length;
  const totalCredits = users.reduce((sum, u) => sum + (u.credits || 0), 0);

  // Debug logging
  console.log('📊 User Statistics:', {
    totalUsers,
    admins,
    regularUsers,
    totalCredits,
    usersData: users
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Dashboard
              </button>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Users className="w-6 h-6" />
                Registered Users
              </h1>
            </div>
            <div className="flex items-center gap-4">
              {totalUsers === 1 && (
                <div className="text-sm text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-3 py-2 rounded-lg border border-orange-200 dark:border-orange-800">
                  ⚠️ Only 1 user found, but there should be 10+ users
                </div>
              )}
              <button
                onClick={() => navigate('/admin-management')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium"
              >
                <Settings className="w-4 h-4 inline mr-2" />
                Manage Admins
              </button>
              <button
                onClick={() => openEmailModal(null)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium"
              >
                📧 Email All Users
              </button>
              <button
                onClick={() => {
                  setLoading(true);
                  fetchUsers();
                }}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
              >
                🔄 Refresh Users
              </button>
              <button
                onClick={populateAllUsers}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
              >
                🔧 Populate All Users
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalUsers}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Admins</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{admins}</p>
              </div>
              <Shield className="w-8 h-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Regular Users</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{regularUsers}</p>
              </div>
              <Users className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Credits</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalCredits}</p>
              </div>
              <Coins className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">User Directory</h2>
          </div>

          <div className="overflow-x-auto overflow-y-auto" style={{ maxHeight: 'calc(100vh - 400px)' }}>
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider sticky left-0 bg-gray-50 dark:bg-gray-700 z-20">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider sticky left-0 bg-gray-50 dark:bg-gray-700 z-20" style={{ left: '250px' }}>
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Credits
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Tier
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" style={{ minWidth: '200px' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {users.map((userProfile) => (
                  <tr key={userProfile.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap sticky left-0 bg-white dark:bg-gray-800 z-10 group-hover:bg-gray-50 dark:group-hover:bg-gray-700 shadow-[2px_0_4px_rgba(0,0,0,0.05)]">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {userProfile.full_name || 'No Name'}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {userProfile.email || (
                              <span className="text-gray-400 italic">
                                Email not available
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap sticky bg-white dark:bg-gray-800 z-10 group-hover:bg-gray-50 dark:group-hover:bg-gray-700 shadow-[2px_0_4px_rgba(0,0,0,0.05)]" style={{ left: '250px' }}>
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        userProfile.role === 'admin'
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {userProfile.role === 'admin' ? '👑 Admin' : '👤 User'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-sm text-gray-900 dark:text-white">
                        <Coins className="w-4 h-4 text-yellow-500" />
                        {userProfile.credits || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {userProfile.subscription_tier || 'free'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        userProfile.subscription_status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {userProfile.subscription_status || 'active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(userProfile.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1 flex-wrap">
                        {userProfile.subscription_status === 'suspended' ? (
                          <button
                            onClick={() => reactivateUser(userProfile.id, userProfile.email || userProfile.full_name || 'Unknown User')}
                            className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors"
                            title="Reactivate user"
                          >
                            <UserCheck className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => suspendUser(userProfile.id, userProfile.email || userProfile.full_name || 'Unknown User')}
                            className="p-1 text-orange-600 hover:text-orange-800 hover:bg-orange-50 rounded transition-colors"
                            title="Suspend user"
                          >
                            <UserX className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => openCreditModal(userProfile)}
                          className="p-1 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded transition-colors"
                          title="Adjust credits"
                        >
                          <Coins className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEmailModal(userProfile)}
                          className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                          title="Send email to user"
                        >
                          <Mail className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteUser(userProfile.id, userProfile.email || userProfile.full_name || 'Unknown User')}
                          className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                          title="Delete user"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {selectedUser ? `Send Email to ${selectedUser.full_name || selectedUser.email}` : 'Send Email to All Users'}
              </h3>
              <button
                onClick={() => setShowEmailModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Email subject"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Email message"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Type
                </label>
                <select
                  value={emailType}
                  onChange={(e) => setEmailType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="general">General</option>
                  <option value="suspension">Suspension Notice</option>
                  <option value="reactivation">Reactivation Notice</option>
                  <option value="deletion">Account Deletion</option>
                  <option value="maintenance">Maintenance Notice</option>
                  <option value="update">System Update</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              {selectedUser ? (
                <button
                  onClick={sendEmail}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                >
                  📧 Send Email
                </button>
              ) : (
                <button
                  onClick={sendBulkEmail}
                  className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium"
                >
                  📧 Send to All Users
                </button>
              )}
              <button
                onClick={() => setShowEmailModal(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Credit Adjustment Modal */}
      {showCreditModal && creditUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Coins className="w-5 h-5 text-purple-600" />
                Adjust Credits for {creditUser.full_name || creditUser.email}
              </h3>
              <button
                onClick={() => setShowCreditModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Current Credits Display */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Current Credits</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {creditUser.credits || 0} credits
                </p>
              </div>

              {/* Credit Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Credit Adjustment
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCreditAmount(Math.max(-creditUser.credits, creditAmount - 100))}
                    className="p-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    value={creditAmount}
                    onChange={(e) => setCreditAmount(parseInt(e.target.value) || 0)}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center"
                    placeholder="0"
                  />
                  <button
                    onClick={() => setCreditAmount(creditAmount + 100)}
                    className="p-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => setCreditAmount(-100)}
                    className="flex-1 px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded text-xs hover:bg-red-200 dark:hover:bg-red-900/40"
                  >
                    -100
                  </button>
                  <button
                    onClick={() => setCreditAmount(100)}
                    className="flex-1 px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded text-xs hover:bg-green-200 dark:hover:bg-green-900/40"
                  >
                    +100
                  </button>
                  <button
                    onClick={() => setCreditAmount(500)}
                    className="flex-1 px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded text-xs hover:bg-green-200 dark:hover:bg-green-900/40"
                  >
                    +500
                  </button>
                  <button
                    onClick={() => setCreditAmount(1000)}
                    className="flex-1 px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded text-xs hover:bg-green-200 dark:hover:bg-green-900/40"
                  >
                    +1000
                  </button>
                </div>
                {creditAmount !== 0 && (
                  <p className={`text-sm mt-2 ${creditAmount > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    New balance: {(creditUser.credits || 0) + creditAmount} credits
                  </p>
                )}
              </div>

              {/* Reason */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Reason for Adjustment <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={creditReason}
                  onChange={(e) => setCreditReason(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="e.g., Bonus credits for beta testing, Refund for service issue, etc."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={adjustCredits}
                disabled={creditAmount === 0 || !creditReason.trim()}
                className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-lg transition-colors font-medium"
              >
                {creditAmount > 0 ? '➕ Add Credits' : '➖ Remove Credits'}
              </button>
              <button
                onClick={() => setShowCreditModal(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
            </div>

            {/* Info Notice */}
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <p className="text-xs text-yellow-800 dark:text-yellow-200">
                ℹ️ All credit adjustments are logged and tracked with full audit trail.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;

