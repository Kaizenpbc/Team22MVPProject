# 🛡️ Admin Tier Management System - Complete User Guide

## 📋 Overview

The Admin Tier Management System provides comprehensive administrative capabilities for managing user accounts, admin permissions, and system monitoring. This system is designed for organizations that need granular control over user access and administrative privileges.

## 🎯 Key Features

### ✅ **Completed Features:**

1. **Admin Account Management**
   - Create new admin accounts (direct creation and email invitations)
   - Manage admin roles (Super Admin vs Admin)
   - Suspend/activate admin accounts
   - Set and manage expiration dates
   - Extend admin account expiration periods

2. **User Management**
   - View all registered users
   - Suspend/reactivate user accounts
   - Delete user accounts
   - Send individual and bulk email notifications
   - Track user activity and credits

3. **Audit Logging System**
   - Comprehensive activity tracking
   - Admin action logging
   - User management action logging
   - Email notification logging
   - Searchable and filterable audit logs

4. **Expiration Management**
   - Automatic expiration monitoring
   - Expiration alerts and notifications
   - Grace period management
   - Automatic account suspension for expired admins
   - Manual expiration notifications

5. **Activity Monitoring**
   - Real-time admin activity tracking
   - Login activity monitoring
   - Activity scoring system
   - Activity trends and analytics
   - Admin performance metrics

## 🚀 Getting Started

### **Accessing Admin Management**

1. **Login as Super Admin**
   - Use an account with `@kpbc.ca` domain or containing 'admin' in the email
   - Navigate to `/workflow-creator` to access admin interface

2. **Access Admin Management**
   - Click "View All Users" button in admin interface
   - Navigate to "Manage Users" tab in Settings
   - Click "Manage Admins" button to access admin management

### **Admin Management Interface**

The admin management interface provides:

- **Statistics Dashboard**: Overview of admin accounts, active users, and system status
- **Admin Accounts Table**: Complete listing of all admin accounts with status and expiration info
- **Activity Dashboard**: Real-time monitoring of admin activity and performance
- **Expiration Alerts**: Notifications for accounts expiring soon or expired
- **Audit Logs**: Comprehensive activity tracking and logging

## 👥 Admin Roles and Permissions

### **Super Admin**
- **Full System Access**: Complete control over all admin functions
- **Admin Creation**: Can create new admin accounts and send invitations
- **User Management**: Full access to user suspension, activation, and deletion
- **System Monitoring**: Access to all monitoring and logging features
- **Expiration Management**: Can extend admin expiration dates

### **Admin**
- **Limited Access**: Basic administrative functions
- **User Management**: Can suspend/activate users and send notifications
- **View-Only Access**: Can view audit logs and activity data
- **No Admin Creation**: Cannot create new admin accounts

## 🔧 Core Functions

### **1. Creating Admin Accounts**

#### **Direct Creation:**
1. Click "Create Admin" button
2. Fill in required fields:
   - Email address
   - Full name
   - Role (Admin or Super Admin)
   - Expiration period (default: 365 days)
3. Click "Create Admin"

#### **Email Invitation:**
1. Click "Send Invitation" button
2. Fill in invitation details:
   - Email address
   - Full name
   - Role selection
   - Expiration period
3. Click "Send Invitation"

### **2. Managing Admin Status**

#### **Suspend Admin:**
- Click the suspend button (❌) next to admin account
- Confirm suspension action
- Admin will be notified via email

#### **Activate Admin:**
- Click the activate button (✅) next to suspended admin
- Confirm activation action
- Admin will be notified via email

#### **Extend Expiration:**
- Click the clock button (🕐) next to admin account
- Expiration will be extended by 1 year
- Action will be logged in audit trail

### **3. User Management**

#### **Suspend User:**
1. Navigate to "Manage Users" tab
2. Click suspend button next to user
3. Confirm suspension
4. User receives notification email
5. Action logged in audit trail

#### **Send Email Notifications:**
1. Click "Send Email" button next to user
2. Select email type (notification, warning, etc.)
3. Enter subject and message
4. Send email
5. Action logged in audit trail

#### **Bulk Email:**
1. Click "Email All Users" button
2. Select email type and enter message
3. Send to all users
4. Action logged in audit trail

## 📊 Monitoring and Analytics

### **Activity Dashboard**

The Activity Dashboard provides:

- **Admin Activity Overview**: Real-time activity scores and status
- **Login Tracking**: Last login times and login counts
- **Recent Actions**: Latest admin actions and activities
- **Activity Trends**: Increasing, decreasing, or stable activity patterns
- **Performance Metrics**: Activity scoring system (0-100%)

### **Expiration Alerts**

Expiration monitoring includes:

- **Expiring Soon**: Accounts expiring within 30 days
- **Grace Period**: Expired accounts within 7-day grace period
- **Expired**: Accounts past grace period (automatically suspended)
- **Manual Notifications**: Send expiration warnings manually

### **Audit Logs**

Comprehensive logging includes:

- **Admin Actions**: All admin account management actions
- **User Management**: User suspension, activation, deletion
- **Email Notifications**: All email communications
- **System Events**: System initialization and shutdown
- **Filtering**: Filter logs by action type, date, or admin

## 🔐 Security Features

### **Access Control**
- Role-based permissions (Super Admin vs Admin)
- Email domain restrictions for Super Admin access
- Secure database functions with proper authentication

### **Audit Trail**
- Complete activity logging
- IP address tracking
- User agent logging
- Timestamp recording
- Action details and context

### **Expiration Management**
- Automatic account expiration
- Grace period handling
- Automatic suspension for expired accounts
- Manual extension capabilities

## 🚨 Troubleshooting

### **Common Issues**

1. **Cannot Access Admin Management**
   - Ensure you're logged in with admin privileges
   - Check email domain (@kpbc.ca) or 'admin' in email
   - Verify admin account status is 'active'

2. **Admin Account Not Found**
   - Check if admin account exists in admin_accounts table
   - Verify email address matches exactly
   - Ensure account status is 'active'

3. **Expiration Notifications Not Working**
   - Check expiration monitoring service status
   - Verify email notification functions are working
   - Check audit logs for notification attempts

4. **Audit Logs Not Showing**
   - Verify audit logging service is running
   - Check database connectivity
   - Ensure proper permissions for audit functions

### **Database Functions**

The system uses several database functions:

- `create_admin_account()` - Create new admin accounts
- `get_all_admin_accounts()` - Fetch all admin accounts
- `manage_admin_status()` - Suspend/activate admin accounts
- `extend_admin_expiration()` - Extend admin expiration dates
- `log_admin_activity()` - Log admin activities
- `suspend_user()` - Suspend user accounts
- `reactivate_user()` - Reactivate user accounts
- `delete_user()` - Delete user accounts
- `send_user_notification()` - Send email notifications

## 📈 System Health Monitoring

### **Health Check**
The system provides health monitoring for:
- Activity monitoring service status
- Expiration monitoring service status
- Audit logging service status
- Database connectivity
- Email notification system

### **Performance Metrics**
- Admin activity scores
- Login frequency tracking
- Action completion rates
- System response times
- Error rates and logging

## 🔄 System Initialization

The admin system automatically initializes when:
- AdminManagement component mounts
- Admin system services start
- Activity monitoring begins
- Expiration monitoring starts
- Audit logging activates

## 📝 Best Practices

### **Admin Account Management**
1. **Regular Review**: Periodically review admin accounts and their access
2. **Expiration Monitoring**: Monitor expiration dates and extend as needed
3. **Role Assignment**: Assign appropriate roles based on responsibilities
4. **Access Auditing**: Regularly review audit logs for suspicious activity

### **User Management**
1. **Clear Communication**: Provide clear reasons for user suspensions
2. **Documentation**: Document all user management actions
3. **Notification Timing**: Send notifications promptly for status changes
4. **Follow-up**: Follow up on user issues and resolutions

### **Security**
1. **Regular Audits**: Review audit logs regularly
2. **Access Control**: Limit admin access to necessary functions only
3. **Expiration Management**: Keep expiration dates current
4. **Monitoring**: Monitor system health and performance

## 🎉 Conclusion

The Admin Tier Management System provides comprehensive administrative capabilities with robust security, monitoring, and audit features. The system is designed to scale with your organization's needs while maintaining security and compliance standards.

For additional support or feature requests, please contact the development team.

---

**System Version**: 1.0.0  
**Last Updated**: January 2025  
**Compatibility**: Supabase, React, TypeScript
