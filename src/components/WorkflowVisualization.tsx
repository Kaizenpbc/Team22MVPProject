import React from 'react';

/**
 * WorkflowVisualization Component
 * 
 * Shows a clean, modern workflow diagram demonstrating
 * how Kovari transforms unstructured inputs into structured workflows.
 * 
 * Features flowing connectors with animated movement!
 */
const WorkflowVisualization = () => {
  return (
    <div className="relative w-full max-w-5xl mx-auto my-12 px-4">
      {/* CSS for flowing animations */}
      <style>{`
        @keyframes flow {
          0% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: -60;
          }
        }
        .flowing-connector {
          stroke-dasharray: 20 20;
          animation: flow 1.2s linear infinite;
        }
        @keyframes flow-reverse {
          0% {
            stroke-dashoffset: 60;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
        .flowing-connector-reverse {
          stroke-dasharray: 20 20;
          animation: flow-reverse 1.2s linear infinite;
        }
        .delay-1 { animation-delay: 0.3s; }
      `}</style>

      {/* Visualization Container */}
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
        
        {/* Title */}
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            See the Magic in Action
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Transform chaos into clarity in seconds
          </p>
        </div>

        {/* SVG Workflow Diagram */}
        <svg 
          viewBox="0 0 900 300" 
          className="w-full h-auto"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Gradient for connectors */}
            <linearGradient id="flow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0ea5e9" />
              <stop offset="50%" stopColor="#d946ef" />
              <stop offset="100%" stopColor="#eab308" />
            </linearGradient>
            
            {/* Arrow markers */}
            <marker
              id="arrowhead"
              markerWidth="12"
              markerHeight="12"
              refX="11"
              refY="6"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <polygon points="0 0, 12 6, 0 12" fill="#0ea5e9" />
            </marker>
            <marker
              id="arrowhead-reverse"
              markerWidth="12"
              markerHeight="12"
              refX="1"
              refY="6"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <polygon points="12 0, 0 6, 12 12" fill="#0ea5e9" />
            </marker>

            {/* Background subtle grid */}
            <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <circle cx="15" cy="15" r="1" fill="#e5e7eb" opacity="0.2" />
            </pattern>
          </defs>

          <rect width="900" height="300" fill="url(#grid)" />

          {/* Unstructured Inputs Box */}
          <g>
            <rect x="50" y="80" width="200" height="140" rx="12" 
                 fill="none" stroke="#0ea5e9" strokeWidth="3" 
                 className="dark:stroke-blue-400" />
            <text x="150" y="105" textAnchor="middle" fontSize="16" fontWeight="bold" 
                  fill="#1e40af" className="dark:fill-blue-300">
              Unstructured Inputs
            </text>
            
            {/* Document Icon */}
            <g>
              <rect x="80" y="125" width="20" height="25" rx="2" fill="#3b82f6" opacity="0.8" />
              <rect x="82" y="127" width="16" height="2" fill="white" />
              <rect x="82" y="131" width="16" height="2" fill="white" />
              <rect x="82" y="135" width="12" height="2" fill="white" />
              <text x="110" y="145" fontSize="14" fill="#1e40af" className="dark:fill-blue-300">
                Documents
              </text>
            </g>
            
            {/* Email Icon */}
            <g>
              <rect x="80" y="165" width="20" height="15" rx="2" fill="#3b82f6" opacity="0.8" />
              <polygon points="90,165 85,175 95,175" fill="white" />
              <text x="110" y="178" fontSize="14" fill="#1e40af" className="dark:fill-blue-300">
                Emails
              </text>
            </g>
            
            {/* Forms Icon */}
            <g>
              <rect x="80" y="195" width="20" height="20" rx="2" fill="#3b82f6" opacity="0.8" />
              <rect x="82" y="197" width="16" height="1" fill="white" />
              <rect x="82" y="200" width="12" height="1" fill="white" />
              <rect x="82" y="203" width="14" height="1" fill="white" />
              <rect x="82" y="206" width="10" height="1" fill="white" />
              <text x="110" y="210" fontSize="14" fill="#1e40af" className="dark:fill-blue-300">
                Forms
              </text>
            </g>
          </g>

          {/* First Flowing Connector - Multiple lines for enhanced flow */}
          <path
            d="M 250 140 L 380 140"
            stroke="url(#flow-gradient)"
            strokeWidth="3"
            fill="none"
            markerEnd="url(#arrowhead)"
            className="flowing-connector"
          />
          <path
            d="M 250 150 L 380 150"
            stroke="url(#flow-gradient)"
            strokeWidth="4"
            fill="none"
            markerEnd="url(#arrowhead)"
            className="flowing-connector-reverse"
          />
          <path
            d="M 250 160 L 380 160"
            stroke="url(#flow-gradient)"
            strokeWidth="3"
            fill="none"
            markerEnd="url(#arrowhead)"
            className="flowing-connector delay-1"
          />

          {/* Kovari AI Engine Box */}
          <g>
            <rect x="380" y="100" width="200" height="100" rx="16" 
                 fill="#d946ef" stroke="#c026d3" strokeWidth="4" />
            <text x="480" y="135" textAnchor="middle" fontSize="24" fontWeight="bold" fill="white">
              Kovari
            </text>
            <text x="480" y="155" textAnchor="middle" fontSize="14" fill="#d1fae5">
              AI Engine
            </text>
          </g>

          {/* Second Flowing Connector - Multiple lines for enhanced flow */}
          <path
            d="M 580 140 L 710 140"
            stroke="url(#flow-gradient)"
            strokeWidth="3"
            fill="none"
            markerEnd="url(#arrowhead)"
            className="flowing-connector"
          />
          <path
            d="M 580 150 L 710 150"
            stroke="url(#flow-gradient)"
            strokeWidth="4"
            fill="none"
            markerEnd="url(#arrowhead)"
            className="flowing-connector-reverse"
          />
          <path
            d="M 580 160 L 710 160"
            stroke="url(#flow-gradient)"
            strokeWidth="3"
            fill="none"
            markerEnd="url(#arrowhead)"
            className="flowing-connector delay-1"
          />

          {/* Structured Workflows Box */}
          <g>
            <rect x="710" y="80" width="200" height="140" rx="12" 
                 fill="none" stroke="#eab308" strokeWidth="3" 
                 className="dark:stroke-yellow-400" />
            <text x="810" y="105" textAnchor="middle" fontSize="16" fontWeight="bold" 
                  fill="#047857" className="dark:fill-green-300">
              Structured Workflows
            </text>
            
            {/* Actions Icon */}
            <g>
              <circle cx="740" cy="130" r="10" fill="#10b981" opacity="0.8" />
              <path d="M 736 130 L 740 134 L 744 130" stroke="white" strokeWidth="2" 
                    fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <text x="760" y="137" fontSize="14" fill="#047857" className="dark:fill-green-300">
                Actions
              </text>
            </g>
            
            {/* Approvals Icon */}
            <g>
              <circle cx="740" cy="160" r="10" fill="#10b981" opacity="0.8" />
              <circle cx="740" cy="160" r="6" fill="white" />
              <circle cx="740" cy="160" r="2" fill="#10b981" />
              <text x="760" y="167" fontSize="14" fill="#047857" className="dark:fill-green-300">
                Approvals
              </text>
            </g>
            
            {/* Automation Icon */}
            <g>
              <circle cx="740" cy="190" r="10" fill="#10b981" opacity="0.8" />
              <circle cx="738" cy="188" r="1.5" fill="white" />
              <circle cx="742" cy="188" r="1.5" fill="white" />
              <circle cx="738" cy="192" r="1.5" fill="white" />
              <circle cx="742" cy="192" r="1.5" fill="white" />
              <text x="760" y="197" fontSize="14" fill="#047857" className="dark:fill-green-300">
                Automation
              </text>
            </g>
          </g>
        </svg>

        {/* Stats below visualization */}
        <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
              90%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Time Saved
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
              5min
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              To Create
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
              100%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Clarity
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowVisualization;
