import React from 'react';
import { Link } from 'react-router-dom';
import { Workflow, Mail, Phone, MapPin, Twitter, Linkedin, Github, Instagram, Facebook, ArrowRight } from 'lucide-react';
import CentralisedAccessButton from './CentralisedAccessButton';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* CTA Section */}
        <div className="text-center mb-16 pb-16 border-b border-gray-300 dark:border-gray-700">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Transform Your Workflow Today
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Are you ready to revolutionise how your team handles workflows and SOPs?
          </p>
          <CentralisedAccessButton />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg">
                <Workflow className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-primary-600 dark:text-primary-400">OpsCentral</span>
            </div>
            <p className="text-sm sm:text-base text-gray-700 dark:text-white mb-6 max-w-md">
              The centralised hub that transforms how product managers handle internal workflows, 
              SOP management, and real-time updates.
            </p>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <a 
                href="https://twitter.com/OpsCentral" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="OpsCentral Twitter"
                className="p-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-all duration-300 border-4 border-primary-600 dark:border-primary-600 hover:scale-110 hover:shadow-lg hover:shadow-primary-500/25 cursor-pointer"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="https://linkedin.com/company/OpsCentral" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="OpsCentral LinkedIn"
                className="p-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-all duration-300 border-4 border-primary-600 dark:border-primary-600 hover:scale-110 hover:shadow-lg hover:shadow-primary-500/25 cursor-pointer"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="https://instagram.com/OpsCentral" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="OpsCentral Instagram"
                className="p-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-all duration-300 border-4 border-primary-600 dark:border-primary-600 hover:scale-110 hover:shadow-lg hover:shadow-primary-500/25 cursor-pointer"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://facebook.com/OpsCentral" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="OpsCentral Facebook"
                className="p-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-all duration-300 border-4 border-primary-600 dark:border-primary-600 hover:scale-110 hover:shadow-lg hover:shadow-primary-500/25 cursor-pointer"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://github.com/OpsCentral" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="OpsCentral GitHub"
                className="p-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-all duration-300 border-4 border-primary-600 dark:border-primary-600 hover:scale-110 hover:shadow-lg hover:shadow-primary-500/25 cursor-pointer"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-sm sm:text-base font-semibold mb-4 text-primary-600 dark:text-primary-400">Quick Links</h3>
            <ul className="space-y-2 text-xs">
              <li><Link to="/about" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">About</Link></li>
              <li><a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Features</a></li>
              <li><a href="#benefits" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Benefits</a></li>
              <li><a href="#testimonials" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Testimonials</a></li>
              <li><a href="#faq" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">FAQ</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Documentation</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Support</a></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-sm sm:text-base font-semibold mb-4 text-primary-600 dark:text-primary-400">Contact</h3>
            <ul className="space-y-3 text-xs">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                <a href="mailto:hello@opscentral.com" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors break-all">
                  hello@opscentral.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                <span className="text-gray-600 dark:text-gray-300">+44 20 7123 4567</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gray-600 dark:text-gray-300 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-300">London, United Kingdom</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-300 dark:border-gray-700 pt-8 mt-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:pr-0 md:pr-0 lg:pr-28 xl:pr-32">
            <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
              © 2025 OpsCentral. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-4 sm:gap-6 text-xs sm:text-sm justify-center text-center">
              <Link to="/privacy" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Terms & Conditions</Link>
              <Link to="/cookies" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Cookie Settings</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;