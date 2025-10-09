import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink, CheckCircle, Clock, Users, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getUserAccessStatus, trackUserJourney } from '../services/subscriptionService';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [accessStatus, setAccessStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserStatus = async () => {
      if (!user) return;

      try {
        const status = await getUserAccessStatus(user.id);
        setAccessStatus(status);
        
        // Track dashboard visit
        await trackUserJourney(user.id, 'dashboard_visited', 'opscentral', {
          has_subscription: status?.subscription_status === 'active',
          subscription_tier: status?.subscription_tier
        });
      } catch (error) {
        console.error('Error loading user status:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserStatus();
  }, [user]);

  const handleSOPAccess = async () => {
    if (!user) return;

    // Track SOP access attempt
    await trackUserJourney(user.id, 'sop_access_attempted', 'opscentral', {
      subscription_tier: accessStatus?.subscription_tier
    });

    // Get user info
    const userName = user.user_metadata?.full_name || user.email || 'User';
    const userEmail = user.email || '';

    // Redirect to SOP platform with user info
    const sopUrl = `https://outskills-project.netlify.app/?name=${encodeURIComponent(userName)}&email=${encodeURIComponent(userEmail)}`;
    window.open(sopUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Please sign in to access your dashboard.
          </p>
          <Link
            to="/signin"
            className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-all duration-300"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const hasActiveSubscription = accessStatus?.subscription_status === 'active' && accessStatus?.sop_access;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-600">
              {user.user_metadata?.full_name || user.email}
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Manage your workflow optimization platform access
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Subscription Status */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className={`p-3 rounded-lg ${hasActiveSubscription ? 'bg-green-100 dark:bg-green-900' : 'bg-gray-100 dark:bg-gray-700'}`}>
                {hasActiveSubscription ? (
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                ) : (
                  <Clock className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                )}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Subscription
              </h3>
            </div>
            <p className={`text-lg font-medium mb-2 ${
              hasActiveSubscription ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'
            }`}>
              {accessStatus?.subscription_tier ? 
                `${accessStatus.subscription_tier.charAt(0).toUpperCase() + accessStatus.subscription_tier.slice(1)} Plan` : 
                'No Active Plan'
              }
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {hasActiveSubscription ? 'Active' : 'Inactive'}
            </p>
          </div>

          {/* SOP Access */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className={`p-3 rounded-lg ${accessStatus?.sop_access ? 'bg-blue-100 dark:bg-blue-900' : 'bg-gray-100 dark:bg-gray-700'}`}>
                <Zap className={`w-6 h-6 ${accessStatus?.sop_access ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                SOP Access
              </h3>
            </div>
            <p className={`text-lg font-medium mb-2 ${
              accessStatus?.sop_access ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'
            }`}>
              {accessStatus?.sop_access ? 'Granted' : 'Not Available'}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {accessStatus?.sop_access ? 'Full Platform Access' : 'Subscription Required'}
            </p>
          </div>

          {/* Demo Status */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className={`p-3 rounded-lg ${accessStatus?.demo_completed ? 'bg-purple-100 dark:bg-purple-900' : 'bg-gray-100 dark:bg-gray-700'}`}>
                <Users className={`w-6 h-6 ${accessStatus?.demo_completed ? 'text-purple-600 dark:text-purple-400' : 'text-gray-600 dark:text-gray-400'}`} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Demo Status
              </h3>
            </div>
            <p className={`text-lg font-medium mb-2 ${
              accessStatus?.demo_completed ? 'text-purple-600 dark:text-purple-400' : 'text-gray-600 dark:text-gray-400'
            }`}>
              {accessStatus?.demo_completed ? 'Completed' : 'Pending'}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {accessStatus?.demo_completed ? 'Demo Attended' : 'Book Demo'}
            </p>
          </div>
        </div>

        {/* Main Action Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {hasActiveSubscription ? 'Access Your SOP Platform' : 'Get Started with SOP'}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              {hasActiveSubscription 
                ? 'You have full access to the workflow optimization platform. Click below to launch your SOP management system.'
                : 'Complete your demo or subscribe to a plan to access the full workflow optimization platform.'
              }
            </p>

            {hasActiveSubscription ? (
              <button
                onClick={handleSOPAccess}
                className="group inline-flex px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white font-semibold rounded-lg transition-all duration-300 items-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-lg"
              >
                Launch SOP Platform
                <ExternalLink className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {!accessStatus?.demo_completed ? (
                  <Link
                    to="/book"
                    className="group inline-flex px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-all duration-300 items-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-lg"
                  >
                    Book Demo
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </Link>
                ) : (
                  <Link
                    to="/pricing"
                    className="group inline-flex px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white font-semibold rounded-lg transition-all duration-300 items-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-lg"
                  >
                    Subscribe Now
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            to="/book"
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Book Demo
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Schedule a personalized demo
            </p>
          </Link>

          <Link
            to="/pricing"
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              View Plans
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Compare subscription options
            </p>
          </Link>

          <Link
            to="/about"
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Learn More
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Discover platform features
            </p>
          </Link>

          <a
            href="mailto:support@opscentral.com"
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Get Support
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Contact our support team
            </p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
