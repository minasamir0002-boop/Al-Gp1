/**
 * RepMind AI Core Application Entry
 * Modern Material 3 UI/UX architecture for Medical Representatives.
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { TopAppBar } from './components/common/TopAppBar';
import { BottomNavigation } from './components/common/BottomNavigation';
import {
  SplashScreen,
  LoginScreen,
  HomeScreen,
  DoctorsScreen,
  DoctorProfileScreen,
  VisitBriefScreen,
  EndVisitScreen,
  KnowledgeScreen,
  ObjectionSearchScreen,
  ProfileScreen,
  VisitsScreen
} from './screens';
import { Wifi, Battery, Signal } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, isMobileFrame } = useApp();

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'splash':
        return <SplashScreen />;
      case 'login':
        return <LoginScreen />;
      case 'home':
      case 'dashboard':
        return <HomeScreen />;
      case 'doctors':
        return <DoctorsScreen />;
      case 'doctor-profile':
        return <DoctorProfileScreen />;
      case 'visit-brief':
        return <VisitBriefScreen />;
      case 'end-visit':
      case 'record-visit':
        return <EndVisitScreen />;
      case 'visits':
        return <VisitsScreen />;
      case 'knowledge':
        return <KnowledgeScreen />;
      case 'objections':
        return <ObjectionSearchScreen />;
      case 'settings':
      case 'profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen />;
    }
  };

  // Full screen splash and login views have their own layout
  const isAuthOrSplash = activeTab === 'splash' || activeTab === 'login';

  if (isMobileFrame) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-2 sm:p-6 transition-colors">
        {/* Mobile Phone Device Bezel */}
        <div className="w-full max-w-[420px] h-[860px] max-h-[94vh] bg-white rounded-[44px] p-2.5 shadow-2xl border-4 border-slate-700/80 relative flex flex-col overflow-hidden ring-1 ring-white/20">
          
          {/* Dynamic Island Notch */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-50 flex items-center justify-between px-3">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-700" />
            <div className="w-2 h-2 rounded-full bg-blue-500/80 animate-pulse" />
          </div>

          {/* Mobile Status Bar */}
          <div className="pt-2 px-6 pb-1 flex items-center justify-between text-[11px] font-bold text-slate-800 z-40 bg-white">
            <span>09:41</span>
            <div className="flex items-center gap-1.5">
              <Signal className="w-3 h-3 text-slate-700" />
              <Wifi className="w-3 h-3 text-slate-700" />
              <Battery className="w-3.5 h-3.5 text-slate-700" />
            </div>
          </div>

          {/* Top App Bar */}
          {!isAuthOrSplash && <TopAppBar />}

          {/* Scrollable Main Screen Canvas */}
          <div className="flex-1 overflow-y-auto bg-slate-50 text-slate-900 custom-scrollbar relative pb-16">
            {renderActiveTab()}
          </div>

          {/* Bottom Navigation */}
          {!isAuthOrSplash && <BottomNavigation />}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      {!isAuthOrSplash && <TopAppBar />}
      <main className="flex-1 pb-20">
        {renderActiveTab()}
      </main>
      {!isAuthOrSplash && <BottomNavigation />}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
