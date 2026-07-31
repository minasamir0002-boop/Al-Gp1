/**
 * Reusable Top App Bar Component for RepMind AI
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { Brain, Smartphone, Monitor, Home, LogOut } from 'lucide-react';

export const TopAppBar: React.FC = React.memo(() => {
  const {
    repProfile,
    isMobileFrame,
    setIsMobileFrame,
    activeTab,
    setActiveTab,
  } = useApp();

  return (
    <header className="sticky top-0 z-30 bg-blue-700 text-white shadow-sm border-b border-blue-800">
      <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center justify-between">
        {/* Brand Title & Tagline */}
        <button
          onClick={() => setActiveTab('home')}
          className="flex items-center space-x-2.5 hover:opacity-90 transition-opacity text-left"
        >
          <div className="w-8 h-8 rounded-xl bg-white text-blue-700 flex items-center justify-center font-bold shadow-xs shrink-0">
            <Brain className="w-5 h-5 text-blue-700" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h1 className="text-sm font-extrabold tracking-tight text-white">
                RepMind AI
              </h1>
            </div>
            <p className="text-[10px] text-blue-100 font-medium italic">"Be Ready Before You Go"</p>
          </div>
        </button>

        {/* Right Actions & Navigation */}
        <div className="flex items-center space-x-1.5">
          {/* Home button */}
          <button
            onClick={() => setActiveTab('home')}
            title="Go to Home"
            className={`p-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
              activeTab === 'home' || activeTab === 'dashboard'
                ? 'bg-white/20 text-white'
                : 'hover:bg-white/10 text-blue-100'
            }`}
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline text-xs">Home</span>
          </button>

          {/* Layout Frame Toggle (Mobile Shell vs Desktop) */}
          <button
            onClick={() => setIsMobileFrame(!isMobileFrame)}
            title={isMobileFrame ? 'Expand to Full View' : 'Simulate Mobile Frame'}
            className="p-1.5 rounded-xl hover:bg-white/10 text-blue-100 transition-colors"
          >
            {isMobileFrame ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
          </button>

          {/* User Profile Avatar / Settings */}
          <button
            onClick={() => setActiveTab('settings')}
            className="w-8 h-8 rounded-xl overflow-hidden ring-2 ring-white/40 hover:ring-white transition-all ml-1"
          >
            <img src={repProfile.avatar} alt={repProfile.name} className="w-full h-full object-cover" />
          </button>

          {/* Splash / Sign Out */}
          <button
            onClick={() => setActiveTab('splash')}
            title="Return to Splash"
            className="p-1.5 rounded-xl hover:bg-white/10 text-blue-100 transition-colors ml-1"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
});

TopAppBar.displayName = 'TopAppBar';
