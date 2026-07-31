import React from 'react';
import {
  BookOpen,
  ShieldAlert,
  CheckCircle2,
  Pill,
  Sparkles,
  TrendingUp,
  Award,
  FileText,
  Target
} from 'lucide-react';
import { Doctor } from '../../types';

interface KnowledgeUsageTabProps {
  doctor: Doctor;
}

export const KnowledgeUsageTab: React.FC<KnowledgeUsageTabProps> = ({ doctor }) => {
  const usedObjectionsCount = 4;
  const knowledgeImpactScore = 94;
  const successfulAnswersCount = 3;

  const mostSuccessfulAnswers = [
    {
      objectionTitle: 'Renal Safety in Elderly Patients (eGFR < 45)',
      scientificAnswer: 'REPOS-3 Trial demonstrated that initial eGFR dip ≤10% is hemodynamic and protective, resulting in 31% slower long-term eGFR decline over 36 months.',
      outcome: 'Solved • Resulted in 5 new Rx starts',
      evidenceSource: 'NEJM 2025; 392:114-126'
    },
    {
      objectionTitle: 'Hospital Formulary Tier 3 Copay Restrictions',
      scientificAnswer: 'Provided RepMind Instant Co-pay Card ($15/month max out of pocket) and formulary override letter.',
      outcome: 'Solved • Copay barrier cleared',
      evidenceSource: 'RepMind Co-pay Savings Program'
    },
    {
      objectionTitle: 'Head-to-Head Efficacy vs Entresto 200mg',
      scientificAnswer: 'PARADIGM-CV 36-month hospital readmission data demonstrated statistically superior readmission prevention (p < 0.001).',
      outcome: 'Solved • KOL endorsed protocol',
      evidenceSource: 'Lancet Cardiol 2025; 44:812-824'
    }
  ];

  const frequentlyDiscussedProducts = [
    {
      name: 'Cardiovasc XL 100mg',
      share: '75% of Sessions',
      status: 'Primary Detail Focus',
      keyObjectionResolved: 'Renal Safety & eGFR threshold'
    },
    {
      name: 'AtheroStat 20mg',
      share: '25% of Sessions',
      status: 'Secondary Adjunct Focus',
      keyObjectionResolved: 'Statin-intolerant myalgia rate'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 rounded-3xl p-6 text-white shadow-xl border border-purple-500/30 space-y-3">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-purple-300 text-[10px] font-black uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Sprint 5.0 • Knowledge Usage Analytics</span>
          </div>
          <span className="text-xs bg-white/10 px-3 py-1 rounded-full text-purple-200 font-bold">
            Live Knowledge Base Sync
          </span>
        </div>
        <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
          <span>Doctor Knowledge Utilization & Impact</span>
          <Sparkles className="w-4 h-4 text-amber-300" />
        </h2>
        <p className="text-xs text-purple-100/90 leading-relaxed max-w-2xl">
          Tracks how many approved objections and scientific counter-answers from the RepMind Knowledge Base have been utilized during detailing calls with {doctor.name}.
        </p>
      </div>

      {/* STATS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-1">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
            Objections Utilized
          </span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-slate-900">{usedObjectionsCount} Objections</span>
            <span className="p-2 bg-amber-50 rounded-xl text-amber-600">
              <ShieldAlert className="w-5 h-5" />
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Retrieved from Knowledge Base
          </p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-1">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
            Successful Counter-Answers
          </span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-emerald-700">{successfulAnswersCount} Solved</span>
            <span className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </span>
          </div>
          <p className="text-[11px] text-emerald-700 font-bold">
            75% First-Call Resolution Rate
          </p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-1">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
            Knowledge Impact Score
          </span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-purple-700">{knowledgeImpactScore} / 100</span>
            <span className="p-2 bg-purple-50 rounded-xl text-purple-600">
              <Award className="w-5 h-5" />
            </span>
          </div>
          <p className="text-[11px] text-purple-700 font-bold">
            Top 5% KOL Conversion Efficacy
          </p>
        </div>
      </div>

      {/* MOST SUCCESSFUL ANSWERS */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Most Successful Scientific Answers Used With Doctor</span>
        </h3>

        <div className="space-y-4">
          {mostSuccessfulAnswers.map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
              <div className="flex items-start justify-between gap-3">
                <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{item.objectionTitle}</span>
                </span>
                <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full shrink-0">
                  {item.outcome}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200 text-slate-800 font-medium">
                "{item.scientificAnswer}"
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  <span>Source: {item.evidenceSource}</span>
                </span>
                <span className="text-blue-600 font-bold">Synced from Knowledge Base</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FREQUENTLY DISCUSSED PRODUCTS */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
          <Pill className="w-4 h-4 text-blue-600" />
          <span>Frequently Discussed Products</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {frequentlyDiscussedProducts.map((prod, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-2 text-xs">
              <div className="flex items-center justify-between font-bold text-blue-950">
                <span className="flex items-center gap-1.5">
                  <Pill className="w-4 h-4 text-blue-600" />
                  <span>{prod.name}</span>
                </span>
                <span className="text-[10px] bg-blue-600 text-white px-2.5 py-0.5 rounded-full">
                  {prod.share}
                </span>
              </div>
              <p className="text-[11px] text-blue-800 font-semibold">
                Status: {prod.status}
              </p>
              <div className="pt-2 border-t border-blue-200/60 flex items-center justify-between text-[11px] text-slate-600">
                <span>Key Objection Resolved:</span>
                <span className="font-bold text-slate-800">{prod.keyObjectionResolved}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
