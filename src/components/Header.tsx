import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Workflow, LogOut, User as UserIcon, Coins, Settings as SettingsIcon } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../contexts/AuthContext';
import { APIKeyStatusCompact } from './common/APIKeyStatus';
import { getCreditBalance } from '../services/creditsService';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [credits, setCredits] = React.useState<number>(0);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) {
      loadCredits();
    }
  }, [user]);

  const loadCredits = async () => {
    if (!user) return;
    const balance = await getCreditBalance(user.id);
    setCredits(balance.credits);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/'); // Navigate to home page after sign out
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg">
              <Workflow className="w-6 h-6 text-white" />
            </div>
            <Link to="/" className="text-xl font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
              Kovari
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/about" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors">About</Link>
            <Link to="/pricing" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors">Pricing</Link>
            <a href="/#features" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors">Features</a>
            <a href="/#benefits" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors">Benefits</a>
            <a href="/#faq" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors">FAQ</a>
          </nav>
          
          {/* Desktop CTA and Theme Toggle */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            {user ? (
              <>
                    {/* API Key Status */}
                    <APIKeyStatusCompact onClick={() => navigate('/settings')} />
                    
                    <Link
                      to="/credits"
                      className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all shadow-md hover:shadow-lg"
                      title="Buy Credits"
                    >
                      <Coins className="w-4 h-4" />
                      <span className="font-bold">{credits}</span>
                    </Link>
                    
                    <Link
                      to="/settings"
                      className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
                      title="Settings"
                    >
                      <SettingsIcon className="w-5 h-5" />
                    </Link>
                    
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
                    >
                      <UserIcon className="w-5 h-5" />
                      <span>{user.user_metadata?.full_name || user.email}</span>
                    </Link>
                    
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 font-medium transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
              </>
            ) : (
              <>
                <Link to="/signin" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors">
                  Sign In
                </Link>
                <Link to="/signup" className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors">
                  Sign Up
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6 text-gray-700 dark:text-gray-300" /> : <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <nav className="flex flex-col gap-4">
              <Link to="/about" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium">About</Link>
              <Link to="/pricing" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium">Pricing</Link>
              <a href="/#features" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium">Features</a>
              <a href="/#benefits" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium">Benefits</a>
              <a href="/#faq" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium">FAQ</a>
              <div className="flex flex-col gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <ThemeToggle />
                {user ? (
                  <>
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <UserIcon className="w-5 h-5" />
                      <span className="font-medium">{user.user_metadata?.full_name || user.email}</span>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <div className="flex gap-2">
                    <Link to="/signin" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium">Sign In</Link>
                    <Link to="/signup" className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg">
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;