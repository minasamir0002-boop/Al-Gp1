import React from 'react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { Shield, Brain, Sparkles, ArrowRight, Stethoscope, BookOpen, MessageSquare, CheckCircle2 } from 'lucide-react';

export const SplashScreen: React.FC = () => {
  const { setActiveTab } = useApp();

  return (
    <div className="min-h-full bg-gradient-to-b from-blue-50 via-white to-slate-50 flex flex-col justify-between p-6 text-slate-900">
      {/* Top Bar / Branding Badge */}
      <div className="flex justify-between items-center pt-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-100/80 px-3 py-1 rounded-full border border-blue-200">
          Medical Rep Assistant
        </span>
        <span className="text-xs text-slate-400 font-medium">v1.0.0</span>
      </div>

      {/* Main Hero & Logo */}
      <div className="flex flex-col items-center text-center my-auto py-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative mb-6"
        >
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-blue-600 to-blue-500 shadow-xl shadow-blue-500/25 flex items-center justify-center relative z-10">
            <Brain className="w-12 h-12 text-white" />
            <div className="absolute -bottom-1 -right-1 bg-white p-1.5 rounded-full shadow-md">
              <Stethoscope className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <div className="absolute inset-0 bg-blue-400/20 blur-2xl rounded-full -z-0 transform scale-125" />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">
            RepMind <span className="text-blue-600">AI</span>
          </h1>
          <p className="text-base font-medium text-slate-600 italic mb-6">
            "Be Ready Before You Go"
          </p>
        </motion.div>

        {/* Feature Pills */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="grid grid-cols-2 gap-2.5 max-w-xs w-full mb-8 text-left"
        >
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-xs">
            <Shield className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="text-xs font-medium text-slate-700">Pre-Visit Briefs</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-xs">
            <BookOpen className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="text-xs font-medium text-slate-700">Knowledge Base</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-xs">
            <MessageSquare className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="text-xs font-medium text-slate-700">Objection Finder</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="text-xs font-medium text-slate-700">Visit Tracker</span>
          </div>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="space-y-3 pb-4 max-w-sm mx-auto w-full"
      >
        <button
          onClick={() => setActiveTab('login')}
          className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
        >
          <span>Sign In to RepMind</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={() => setActiveTab('home')}
          className="w-full py-3 px-4 bg-white hover:bg-slate-50 text-slate-700 font-medium rounded-2xl border border-slate-200 shadow-xs flex items-center justify-center gap-2 transition-all"
        >
          <span>Explore Demo Home</span>
        </button>
      </motion.div>
    </div>
  );
};
