import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { Mail, Lock, Building2, MapPin, ArrowRight, ShieldCheck, UserCheck, Stethoscope } from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { setActiveTab, repProfile } = useApp();
  const [email, setEmail] = useState('alex.vance@repmind.med');
  const [password, setPassword] = useState('••••••••••••');
  const [territory, setTerritory] = useState(repProfile.territory || 'Central District');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveTab('home');
  };

  const handleDemoLogin = () => {
    setActiveTab('home');
  };

  return (
    <div className="min-h-full bg-slate-50 flex flex-col justify-between p-6 text-slate-900">
      {/* Top Bar */}
      <div className="flex justify-between items-center pt-2 mb-4">
        <button 
          onClick={() => setActiveTab('splash')} 
          className="text-xs font-semibold text-blue-600 flex items-center gap-1 hover:underline"
        >
          ← Back to Splash
        </button>
        <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-white px-2.5 py-1 rounded-full border border-slate-200 shadow-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          <span>Secure Enterprise Portal</span>
        </div>
      </div>

      <div className="max-w-md mx-auto w-full my-auto space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Stethoscope className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Welcome to RepMind AI</h2>
          <p className="text-xs text-slate-500">Sign in to access your doctor preparation engine</p>
        </div>

        {/* Login Form Card */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-4"
        >
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Medical Representative Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@pharma.com"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Assigned Territory
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <select
                  value={territory}
                  onChange={(e) => setTerritory(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800 appearance-none"
                >
                  <option value="Central District">Central District</option>
                  <option value="North Sector">North Sector</option>
                  <option value="South Bay">South Bay</option>
                  <option value="Metro West">Metro West</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99] mt-2"
            >
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={handleDemoLogin}
              className="w-full py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              <UserCheck className="w-4 h-4" />
              <span>Quick Login as Demo Representative</span>
            </button>
          </div>
        </motion.div>

        {/* Footer info */}
        <p className="text-center text-[11px] text-slate-400">
          RepMind AI Platform • Powered by Medical Representative Intelligence
        </p>
      </div>
    </div>
  );
};
