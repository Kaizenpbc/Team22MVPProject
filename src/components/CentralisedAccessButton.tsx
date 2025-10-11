import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getUserAccessStatus, trackUserJourney, hasActiveSubscription } from '../services/subscriptionService';
import { getSession } from '../services/authService';

interface ButtonState {
  text: string;
  destination: string;
  isExternal: boolean;
  disabled: boolean;
  variant: 'primary' | 'secondary' | 'success';
}

const CentralisedAccessButton: React.FC = () => {
  const { user } = useAuth();
  const [buttonState, setButtonState] = useState<ButtonState>({
    text: 'Get Centralised Access',
    destination: '/book',
    isExternal: false,
    disabled: false,
    variant: 'primary'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const updateButtonState = async () => {
      if (!user) {
        setButtonState({
          text: 'Get Centralised Access',
          destination: '/signup',
          isExternal: false,
          disabled: false,
          variant: 'primary'
        });
        setLoading(false);
        return;
      }

      try {
        const accessStatus = await getUserAccessStatus(user.id);
        
        if (hasActiveSubscription(accessStatus)) {
          // User has active subscription - direct SOP access with user info AND tier
          const userName = user.user_metadata?.full_name || user.email || 'User';
          const userEmail = user.email || '';
          const tier = accessStatus?.subscription_tier || 'free';
          const workflowLimit = accessStatus?.workflow_limit || 3;
          const timestamp = Date.now();
          
          // Get the current session token to pass to SOP platform
          const session = await getSession();
          const accessToken = session.session?.access_token || '';
          
          // LOCAL TESTING: Use localhost:5174 for development, Netlify for production
          const sopBaseUrl = import.meta.env.DEV ? 'http://localhost:5176' : 'https://outskills-project.netlify.app';
          const sopUrlWithParams = `${sopBaseUrl}/?name=${encodeURIComponent(userName)}&email=${encodeURIComponent(userEmail)}&tier=${tier}&workflow_limit=${workflowLimit}&token=${encodeURIComponent(accessToken)}&interface=user&t=${timestamp}`;
          
          setButtonState({
            text: 'Access SOP Platform',
            destination: sopUrlWithParams,
            isExternal: true,
            disabled: false,
            variant: 'success'
          });
        } else {
          // TEMPORARY: For testing, always show SOP access
          const userName = user.user_metadata?.full_name || user.email || 'User';
          const userEmail = user.email || '';
          const timestamp = Date.now();
          
          // Get the current session token to pass to SOP platform
          const session = await getSession();
          const accessToken = session.session?.access_token || '';
          
          // LOCAL TESTING: Use localhost:5174 for development, Netlify for production
          const sopBaseUrl = import.meta.env.DEV ? 'http://localhost:5176' : 'https://outskills-project.netlify.app';
          const sopUrlWithParams = `${sopBaseUrl}/?name=${encodeURIComponent(userName)}&email=${encodeURIComponent(userEmail)}&tier=free&workflow_limit=3&token=${encodeURIComponent(accessToken)}&interface=user&t=${timestamp}&v=${Math.random()}&cache=${Date.now()}`;
          
          setButtonState({
            text: 'Access SOP Platform (Test)',
            destination: sopUrlWithParams,
            isExternal: true,
            disabled: false,
            variant: 'success'
          });
        }
      } catch (error) {
        console.error('Error updating button state:', error);
        // Fallback to demo booking
        setButtonState({
          text: 'Get Centralised Access',
          destination: '/book',
          isExternal: false,
          disabled: false,
          variant: 'primary'
        });
      } finally {
        setLoading(false);
      }
    };

    updateButtonState();
  }, [user]);

  const handleClick = async (e: React.MouseEvent) => {
    console.log('Button clicked!', { user, buttonState });
    
    if (!user) {
      console.log('No user, returning');
      return;
    }

    // Track the button click
    await trackUserJourney(user.id, 'centralised_access_clicked', 'opscentral', {
      destination: buttonState.destination,
      user_status: user ? 'authenticated' : 'anonymous'
    });

    // If accessing SOP platform (Netlify or localhost), open in new tab
    if (buttonState.isExternal && (buttonState.destination.includes('outskills-project.netlify.app') || buttonState.destination.includes('localhost:5176'))) {
      e.preventDefault(); // Prevent default navigation
      console.log('Opening SOP with params:', buttonState.destination);
      window.open(buttonState.destination, '_blank');
    } else {
      console.log('Not an external SOP link:', { isExternal: buttonState.isExternal, destination: buttonState.destination });
    }
  };

  const getButtonClasses = () => {
    const baseClasses = "group inline-flex px-6 sm:px-8 py-3 sm:py-4 font-semibold rounded-lg transition-all duration-300 items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1 min-h-[44px] text-base sm:text-lg";
    
    switch (buttonState.variant) {
      case 'success':
        return `${baseClasses} bg-green-600 hover:bg-green-700 text-white`;
      case 'secondary':
        return `${baseClasses} bg-gray-600 hover:bg-gray-700 text-white`;
      default:
        return `${baseClasses} bg-accent-600 hover:bg-accent-700 text-white`;
    }
  };

  if (loading) {
    return (
      <div className="group inline-flex px-6 sm:px-8 py-3 sm:py-4 bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 font-semibold rounded-lg items-center gap-2 shadow-lg min-h-[44px] text-base sm:text-lg">
        Loading...
      </div>
    );
  }

  const buttonContent = (
    <>
      {buttonState.text}
      {buttonState.isExternal ? (
        <ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      ) : (
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      )}
    </>
  );

  if (buttonState.isExternal) {
    return (
      <button
        className={getButtonClasses()}
        onClick={handleClick}
      >
        {buttonContent}
      </button>
    );
  }

  return (
    <Link
      to={buttonState.destination}
      className={getButtonClasses()}
      onClick={handleClick}
    >
      {buttonContent}
    </Link>
  );
};

export default CentralisedAccessButton;
