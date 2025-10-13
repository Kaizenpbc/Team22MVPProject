import React from 'react';

interface AssistantLauncherProps {
  onClick: () => void;
}

const AssistantLauncher: React.FC<AssistantLauncherProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      aria-label="Open Kovari Assistant"
      className="fixed right-6 z-50 bg-accent-600 hover:bg-accent-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:scale-105 focus:outline-none focus:ring-4 focus:ring-accent-500/50 flex items-center justify-center w-16 h-16 rounded-full"
      title="Ops Central Assistant"
      style={{
        bottom: 'max(24px, env(safe-area-inset-bottom))',
      }}
    >
      <div className="flex flex-col items-center justify-center text-center">
        <div className="text-[9px] leading-tight font-medium text-white">
          <div>Ops Central</div>
          <div>Assistant</div>
        </div>
      </div>
    </button>
  );
};

export default AssistantLauncher;