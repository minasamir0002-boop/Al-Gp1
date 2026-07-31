import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { 
  Stethoscope, 
  Target, 
  BookOpen, 
  ShieldAlert, 
  CheckSquare, 
  Square, 
  ArrowLeft, 
  Pill, 
  Sparkles, 
  FileText, 
  Building2,
  Clock,
  MessageSquare,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Zap,
  Award,
  Lightbulb
} from 'lucide-react';

export const VisitBriefScreen: React.FC = () => {
  const { selectedDoctorForModal, doctors, setActiveTab } = useApp();
  const doctor = selectedDoctorForModal || doctors[0];

  const [objectivesChecked, setObjectivesChecked] = useState<{ [key: string]: boolean }>({
    obj1: true,
    obj2: false,
    obj3: false
  });

  const toggleObjective = (key: string) => {
    setObjectivesChecked(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (!doctor) {
    return (
      <div className="p-6 text-center text-slate-500">
        <p>No doctor selected for visit prep.</p>
        <button onClick={() => setActiveTab('doctors')} className="text-blue-600 font-semibold underline mt-2">
          Select Doctor from Directory
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-4xl mx-auto pb-28 relative">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveTab('doctor-profile')}
          className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Doctor Profile</span>
        </button>

        <span className="text-xs font-extrabold bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-1 border border-blue-200">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Pre-Visit Prep Brief</span>
        </span>
      </div>

      {/* Doctor Summary Card */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
            Doctor Profile Summary
          </span>
          <span className="text-xs text-slate-400 font-medium">RepMind AI Intelligence</span>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={doctor.avatar}
              alt={doctor.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-100 shadow-xs shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-slate-900">{doctor.name}</h1>
                <span className="text-[10px] font-extrabold bg-slate-900 text-white px-2 py-0.5 rounded-md">
                  {doctor.doctorClass}
                </span>
              </div>
              <p className="text-xs font-bold text-blue-600 mt-0.5">{doctor.title} • {doctor.specialty}</p>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>{doctor.hospital}</span>
              </p>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs shrink-0 space-y-1 w-full sm:w-auto">
            <span className="text-[10px] text-slate-400 font-bold block">Best Visit Window</span>
            <span className="font-extrabold text-slate-800 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              {doctor.preferredVisitTime}
            </span>
          </div>
        </div>
      </motion.div>

      {/* AI Pre-Visit Coach Advice Box */}
      <div className="bg-gradient-to-r from-blue-900 to-slate-900 rounded-3xl p-5 text-white shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-300" />
            <h3 className="text-sm font-extrabold text-white">AI Pre-Visit Coach Advice</h3>
          </div>
          <span className="text-[10px] bg-amber-400/20 text-amber-300 font-extrabold px-2.5 py-0.5 rounded-full border border-amber-300/30">
            Tailored Pitch Strategy
          </span>
        </div>
        <p className="text-xs text-blue-100/90 leading-relaxed font-normal">
          "{doctor.name} prefers structured, clinical trial evidence over introductory conversation. Open immediately with the <strong>24-month renal safety outcomes</strong> from REPOS-3 to counter generic ARB pricing objections."
        </p>
      </div>

      {/* Product To Detail Card */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-3">
        <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
          <Pill className="w-4 h-4 text-blue-600" />
          <span>Product To Detail</span>
        </h3>

        <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-100 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h4 className="font-extrabold text-sm text-blue-950">Cardiovasc XL (20mg / 10mg)</h4>
              <span className="text-[10px] bg-blue-600 text-white font-bold px-2 py-0.5 rounded-md">
                1st Line ARB
              </span>
            </div>
            <span className="text-xs font-bold text-blue-700">Dose: Once Daily</span>
          </div>
          <p className="text-xs text-blue-900/80 leading-relaxed">
            <strong>Key Trial Result:</strong> Achieved 14.2 mmHg systolic BP reduction vs 9.1 mmHg with baseline therapy (p &lt; 0.001) with superior 24-month eGFR preservation.
          </p>
        </div>
      </div>

      {/* Core Clinical Talking Points */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-3">
        <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
          <MessageSquare className="w-4 h-4 text-blue-600" />
          <span>Key Talking Points</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-1">
            <span className="font-extrabold text-blue-700 block">1. Superior Blood Pressure Reduction</span>
            <p className="text-slate-600 leading-relaxed font-medium">
              Demonstrated 14.2 mmHg systolic BP reduction vs 9.1 mmHg with baseline generic SGLT2/ARB combinations (p &lt; 0.001).
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-1">
            <span className="font-extrabold text-blue-700 block">2. Renal Outcome Preservation</span>
            <p className="text-slate-600 leading-relaxed font-medium">
              32% lower risk of eGFR decline over 24-month clinical follow-up in high-risk cardiology cohorts.
            </p>
          </div>
        </div>
      </div>

      {/* Objection Pre-loader */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <span>Objection Pre-Loader</span>
          </h3>
          <button 
            onClick={() => setActiveTab('objections')}
            className="text-xs text-blue-600 font-bold hover:underline"
          >
            Objection Finder
          </button>
        </div>

        <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 text-xs space-y-2">
          <div className="font-extrabold text-amber-950 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Expected Objection: "Is the cost justified vs generic ARB therapy?"</span>
          </div>
          <p className="text-amber-900 leading-relaxed font-medium pl-5">
            <strong className="font-bold text-amber-950">Suggested Answer:</strong> Highlight hospital readmission savings ($4,200 avg per patient/yr) driven by a 28% reduction in cardiovascular event hospitalizations.
          </p>
        </div>
      </div>

      {/* Scientific Documents */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span>Scientific Documents to Present</span>
          </h3>
          <button 
            onClick={() => setActiveTab('knowledge')}
            className="text-xs text-blue-600 font-bold hover:underline"
          >
            Knowledge Base
          </button>
        </div>

        <div className="p-3.5 bg-indigo-50/60 rounded-2xl border border-indigo-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <FileText className="w-4 h-4 text-indigo-600" />
            <div>
              <span className="font-bold text-indigo-950 block">REPOS-3 Renal Outcomes Clinical Trial (2025)</span>
              <span className="text-[10px] text-indigo-700 font-medium">Lancet Cardiology • Peer Reviewed • PDF (2.4 MB)</span>
            </div>
          </div>
          <button 
            onClick={() => setActiveTab('knowledge')}
            className="p-2 bg-white text-indigo-600 rounded-xl border border-indigo-200 hover:bg-indigo-50 font-bold"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 p-3 sm:p-4 shadow-2xl">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div className="hidden sm:block">
            <span className="text-xs font-extrabold text-slate-900 block">Ready to enter doctor office?</span>
            <span className="text-[11px] text-slate-500">Log notes & outcomes after the call</span>
          </div>

          <button
            onClick={() => setActiveTab('end-visit')}
            className="w-full sm:w-auto flex-1 py-3.5 px-6 bg-blue-600 hover:bg-blue-700 text-white text-sm font-extrabold rounded-2xl shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
          >
            <Stethoscope className="w-5 h-5" />
            <span>Start Call & Log Visit</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

