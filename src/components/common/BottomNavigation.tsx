/**
 * Reusable Bottom Navigation Component for RepMind AI
 */

import React from 'react';
import { useApp, TabType } from '../../context/AppContext';
import {
  Home,
  Users,
  CalendarCheck,
  BookOpen,
  HelpCircle,
  Settings
} from 'lucide-react';

export const BottomNavigation: React.FC = React.memo(() => {
  const { activeTab, setActiveTab } = useApp();

  const navItems: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { id: 'doctors', label: 'Doctors', icon: <Users className="w-5 h-5" /> },
    { id: 'visits', label: 'Visits', icon: <CalendarCheck className="w-5 h-5" /> },
    { id: 'knowledge', label: 'Knowledge', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'objections', label: 'Objections', icon: <HelpCircle className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-lg py-1.5 px-2">
      <div className="max-w-md mx-auto flex items-center justify-around space-x-1 px-1">
        {navItems.map((item) => {
          const isActive = 
            activeTab === item.id || 
            (item.id === 'home' && activeTab === 'dashboard') ||
            (item.id === 'settings' && activeTab === 'profile') ||
            (item.id === 'doctors' && activeTab === 'doctor-profile') ||
            (item.id === 'visits' && (activeTab === 'visit-brief' || activeTab === 'end-visit' || activeTab === 'record-visit'));

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex-1 flex flex-col items-center py-1.5 px-1 transition-all rounded-xl relative ${
                isActive
                  ? 'text-blue-600 font-bold bg-blue-50/80'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div>{item.icon}</div>
              <span className="text-[10px] mt-0.5 tracking-tight font-medium whitespace-nowrap">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
});

BottomNavigation.displayName = 'BottomNavigation';
