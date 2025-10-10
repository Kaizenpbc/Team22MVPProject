import React from 'react';

/**
 * WorkflowVisualization Component
 * 
 * Shows a beautiful, animated workflow diagram demonstrating
 * how OpsCentral transforms unstructured information into structured workflows.
 * 
 * Think of it like: Showing people the magic happening inside the machine!
 */
const WorkflowVisualization = () => {
  return (
    <div className="relative w-full max-w-4xl mx-auto my-12 px-4">
      {/* CSS for animations */}
      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -20;
          }
        }
        .animated-connector {
          stroke-dasharray: 5 5;
          animation: dash 1s linear infinite;
        }
        @keyframes glow {
          0%, 100% { filter: drop-shadow(0 0 5px rgba(13, 148, 136, 0.5)); }
          50% { filter: drop-shadow(0 0 15px rgba(13, 148, 136, 0.8)); }
        }
        .glow-effect {
          animation: glow 2s ease-in-out infinite;
        }
        .delay-300 {
          animation-delay: 0.3s;
        }
        .delay-500 {
          animation-delay: 0.5s;
        }
      `}</style>

      {/* Visualization Container */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
        
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
          viewBox="0 0 800 400" 
          className="w-full h-auto"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Gradient for connectors */}
            <linearGradient id="connector-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0d9488" />
              <stop offset="100%" stopColor="#14b8a6" />
            </linearGradient>
            
            {/* Arrow marker */}
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="3"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <polygon points="0 0, 10 3, 0 6" fill="#0d9488" />
            </marker>

            {/* Background subtle grid */}
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="1" fill="#e5e7eb" opacity="0.3" />
            </pattern>
          </defs>

          <rect width="800" height="400" fill="url(#grid)" />

          {/* BEFORE: Unstructured Input (Left Side) */}
          <g>
            {/* Messy document icon */}
            <rect x="50" y="80" width="120" height="80" rx="8" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" />
            <text x="110" y="115" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#92400e">
              📄 Unstructured
            </text>
            <text x="110" y="135" textAnchor="middle" fontSize="12" fill="#92400e">
              Documents
            </text>
          </g>

          <g>
            {/* Email/text */}
            <rect x="50" y="200" width="120" height="80" rx="8" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2" />
            <text x="110" y="235" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#1e3a8a">
              ✉️ Emails
            </text>
            <text x="110" y="255" textAnchor="middle" fontSize="12" fill="#1e3a8a">
              Messages
            </text>
          </g>

          {/* Arrow from Input to Processing */}
          <path
            d="M 170 120 L 280 200"
            stroke="url(#connector-gradient)"
            strokeWidth="3"
            fill="none"
            markerEnd="url(#arrowhead)"
            className="animated-connector"
          />
          <path
            d="M 170 240 L 280 220"
            stroke="url(#connector-gradient)"
            strokeWidth="3"
            fill="none"
            markerEnd="url(#arrowhead)"
            className="animated-connector delay-500"
          />

          {/* PROCESSING: OpsCentral (Center) */}
          <g className="glow-effect">
            <rect x="280" y="170" width="180" height="100" rx="12" fill="#0d9488" stroke="#14b8a6" strokeWidth="3" />
            <text x="370" y="205" textAnchor="middle" fontSize="16" fontWeight="bold" fill="white">
              ⚡ OpsCentral
            </text>
            <text x="370" y="230" textAnchor="middle" fontSize="13" fill="#d1fae5">
              AI-Powered
            </text>
            <text x="370" y="250" textAnchor="middle" fontSize="13" fill="#d1fae5">
              Workflow Engine
            </text>
          </g>

          {/* Arrow from Processing to Output */}
          <path
            d="M 460 200 L 550 120"
            stroke="url(#connector-gradient)"
            strokeWidth="3"
            fill="none"
            markerEnd="url(#arrowhead)"
            className="animated-connector"
          />
          <path
            d="M 460 220 L 550 240"
            stroke="url(#connector-gradient)"
            strokeWidth="3"
            fill="none"
            markerEnd="url(#arrowhead)"
            className="animated-connector delay-300"
          />

          {/* AFTER: Structured Workflow (Right Side) */}
          
          {/* Start Node */}
          <g>
            <ellipse cx="610" cy="90" rx="50" ry="30" fill="#dcfce7" stroke="#16a34a" strokeWidth="2" />
            <text x="610" y="95" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#14532d">
              Start
            </text>
          </g>

          {/* Connector */}
          <path d="M 610 120 L 610 155" stroke="#16a34a" strokeWidth="2" markerEnd="url(#arrowhead)" />

          {/* Process Node */}
          <g>
            <rect x="550" y="155" width="120" height="50" rx="8" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="2" />
            <text x="610" y="185" textAnchor="middle" fontSize="12" fontWeight="600" fill="#312e81">
              Process Step
            </text>
          </g>

          {/* Connector */}
          <path d="M 610 205 L 610 235" stroke="#4f46e5" strokeWidth="2" markerEnd="url(#arrowhead)" />

          {/* Decision Node */}
          <g>
            <polygon 
              points="610,235 670,260 610,285 550,260" 
              fill="#fef3c7" 
              stroke="#f59e0b" 
              strokeWidth="2"
            />
            <text x="610" y="265" textAnchor="middle" fontSize="11" fontWeight="600" fill="#92400e">
              Decision?
            </text>
          </g>

          {/* Yes branch */}
          <path d="M 670 260 L 720 260" stroke="#16a34a" strokeWidth="2" markerEnd="url(#arrowhead)" />
          <text x="690" y="255" fontSize="10" fontWeight="bold" fill="#16a34a">Yes</text>

          {/* End Node */}
          <g>
            <ellipse cx="720" cy="260" rx="30" ry="20" fill="#fee2e2" stroke="#dc2626" strokeWidth="2" />
            <text x="720" y="265" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#7f1d1d">
              End
            </text>
          </g>

          {/* Badge: Structured & Clear */}
          <g>
            <rect x="540" y="310" width="140" height="30" rx="15" fill="#10b981" opacity="0.2" />
            <text x="610" y="330" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#047857">
              ✓ Structured & Clear
            </text>
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
