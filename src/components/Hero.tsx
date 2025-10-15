import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import WorkflowVisualization from './WorkflowVisualization';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-20">
      {/* Abstract Background - Hero Section Only */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Flowing Gradient Shapes */}
        <div className="absolute top-20 -left-20 w-96 h-96 bg-gradient-to-r from-primary-500/30 to-primary-400/30 dark:from-primary-600/20 dark:to-primary-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 -right-20 w-80 h-80 bg-gradient-to-r from-primary-600/30 to-primary-500/30 dark:from-primary-700/20 dark:to-primary-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-primary-400/20 to-primary-500/20 dark:from-primary-500/15 dark:to-primary-600/15 rounded-full blur-2xl animate-pulse delay-500"></div>
        
        {/* Creative Abstract Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-20 dark:opacity-10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0d9488" />
              <stop offset="50%" stopColor="#14b8a6" />
              <stop offset="100%" stopColor="#5eead4" />
            </linearGradient>
          </defs>
          <path d="M0,100 Q150,50 300,100 T600,100" stroke="url(#line-gradient)" strokeWidth="2" fill="none" />
          <path d="M100,200 Q250,150 400,200 T700,200" stroke="url(#line-gradient)" strokeWidth="1.5" fill="none" />
          <path d="M-50,300 Q100,250 250,300 T500,300" stroke="url(#line-gradient)" strokeWidth="1" fill="none" />
          <circle cx="200" cy="150" r="3" fill="#0d9488" opacity="0.6" />
          <circle cx="400" cy="250" r="2" fill="#14b8a6" opacity="0.6" />
          <circle cx="600" cy="180" r="2.5" fill="#5eead4" opacity="0.6" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 dark:text-white">
          Transform Documents Into
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500">
            Intelligent Workflows
          </span>
        </h1>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
          by{' '}
          <span className="text-primary-600 dark:text-primary-400 font-semibold">Kovari</span>
          {' '}• Powered by{' '}
          <a 
            href="https://kpbc.ca" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-secondary-500 hover:text-secondary-600 underline hover:no-underline transition-colors font-medium"
          >
            Kaizen
          </a>
        </p>
        
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto font-medium">
          Turn any document into intelligent, automated workflows.
        </p>
        
        <div className="flex flex-wrap justify-center gap-6 mb-8 sm:mb-12 text-sm text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            No coding required
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            Works with any document
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
            Enterprise-ready
          </span>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link 
            to="/book"
            className="group inline-flex px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-bold rounded-2xl transition-all duration-300 items-center gap-3 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 min-h-[56px] text-lg sm:text-xl"
          >
            Book Your Demo Today
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Beautiful Workflow Visualization */}
        <WorkflowVisualization />
      </div>
    </section>
  );
};

export default Hero;