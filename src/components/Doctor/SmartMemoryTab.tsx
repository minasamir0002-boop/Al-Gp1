import React from 'react';
import { motion } from 'motion/react';
import {
  BrainCircuit,
  Stethoscope,
  Calendar,
  Pill,
  ShieldAlert,
  Clock,
  Sparkles,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  FileText,
  ChevronRight,
  UserCheck,
  Target,
  Award
} from 'lucide-react';
import { Doctor } from '../../types';

interface SmartMemoryTabProps {
  doctor: Doctor;
  onPrepareBrief: () => void;
}

export const SmartMemoryTab: React.FC<SmartMemoryTabProps> = ({ doctor, onPrepareBrief }) => {
  const doctorArea = doctor.area || doctor.territory || 'Central District';
  const visitsCompleted = (doctor.visitTimeline && doctor.visitTimeline.length) || 12;
  const lastVisitDate = (doctor.visitTimeline && doctor.visitTimeline[0]?.date) || '2026-07-22';
  const favoriteProduct = (doctor.productsUsed && doctor.productsUsed[0]) || 'Cardiovasc XL 100mg';
  const mostDiscussedProduct = 'Cardiovasc XL 100mg';
  const mostFrequentObjection = 'Renal Safety in Elderly (eGFR < 45)';
  const pendingFollowUp = 'Deliver REPOS-3 renal subgroup paper';

  const predictedTopics = [
    { label: 'Safety & Renal Preservation', percent: 92, color: 'bg-emerald-500' },
    { label: 'Clinical Evidence (REPOS-3 Trial)', percent: 88, color: 'bg-blue-600' },
    { label: 'Guideline Position & ESC Endorsement', percent: 81, color: 'bg-indigo-500' },
    { label: 'Cost & Formulary Co-pay Cards', percent: 46, color: 'bg-amber-500' }
  ];

  const nextBestActions = [
    {
      title: 'Bring REPOS-3 Renal Subgroup Study',
      tag: 'Clinical Study',
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      reason: 'Directly addresses pending objection from July 22 session.'
    },
    {
      title: 'Follow-up previous discussion on patient coupon redemptions',
      tag: 'Follow-up',
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      reason: 'Ensure clinic nurses have sufficient instant savings cards.'
    },
    {
      title: 'Ask about previous elderly heart failure patients (>75 yrs)',
      tag: 'Patient Care',
      color: 'bg-purple-50 text-purple-700 border-purple-200',
      reason: 'Aligns with doctor’s primary geriatric patient mix.'
    },
    {
      title: 'Avoid starting with pricing or formulary tiers',
      tag: 'Strategy Tip',
      color: 'bg-amber-50 text-amber-800 border-amber-200',
      reason: 'Doctor prefers scientific data before any administrative or cost discussion.'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 text-white shadow-xl border border-blue-400/20 space-y-3">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-amber-300 text-[10px] font-black uppercase tracking-wider">
            <BrainCircuit className="w-3.5 h-3.5" />
            <span>Sprint 3.0 • Smart Memory Engine</span>
          </div>
          <span className="text-xs bg-white/10 px-3 py-1 rounded-full text-blue-200 font-bold">
            Local Persistent Intelligence
          </span>
        </div>
        <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
          <span>Complete Memory & Behavioral Snapshot</span>
          <Sparkles className="w-4 h-4 text-amber-300" />
        </h2>
        <p className="text-xs text-blue-100/90 leading-relaxed max-w-2xl">
          RepMind AI synthesizes every recorded detailing visit, objection raised, study requested, and reaction to provide an instantaneous recall profile for {doctor.name}.
        </p>
      </div>

      {/* SECTION 1: DOCTOR SNAPSHOT */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
          <Target className="w-4 h-4 text-blue-600" />
          <span>Section 1: Doctor Snapshot</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Visits Completed</span>
            <span className="text-base font-black text-slate-900 block">{visitsCompleted} Sessions</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Last Visit Date</span>
            <span className="text-base font-black text-blue-600 block">{lastVisitDate}</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Most Discussed</span>
            <span className="text-xs font-black text-slate-900 block truncate">{mostDiscussedProduct}</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Favorite Product</span>
            <span className="text-xs font-black text-emerald-700 block truncate">{favoriteProduct}</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Most Frequent Objection</span>
            <span className="text-xs font-bold text-amber-800 block truncate">{mostFrequentObjection}</span>
          </div>

          <div className="p-3.5 bg-blue-50/70 rounded-2xl border border-blue-200/80 space-y-1">
            <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider block">Pending Follow-up</span>
            <span className="text-xs font-black text-blue-900 block truncate">{pendingFollowUp}</span>
          </div>
        </div>
      </div>

      {/* SECTION 2: COMMUNICATION STYLE */}
      <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 rounded-3xl p-5 sm:p-6 border border-amber-300/60 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <h3 className="text-sm font-extrabold text-amber-950">
            Section 2: Communication Style Summary
          </h3>
        </div>
        <p className="text-xs sm:text-sm font-semibold text-amber-950 leading-relaxed bg-white/80 p-4 rounded-2xl border border-amber-200">
          "This doctor prefers scientific discussions with supporting clinical evidence. Usually asks for long-term safety data before discussing pricing. Highly responsive to peer-reviewed cardiology subgroup trials and values concise 5-minute visual slide decks."
        </p>
      </div>

      {/* SECTION 3: PATTERN ANALYSIS */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
          <TrendingUp className="w-4 h-4 text-blue-600" />
          <span>Section 3: Behavioral Pattern Analysis</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <span className="text-[11px] font-extrabold text-slate-900 block">Most Repeated Objections</span>
            <ul className="space-y-1.5 text-slate-700 font-medium">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                <span>Renal Safety in Elderly Patients (4 visits)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                <span>Formulary Copay Tier 3 Restrictions (3 visits)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                <span>Head-to-head vs Entresto 200mg (2 visits)</span>
              </li>
            </ul>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <span className="text-[11px] font-extrabold text-slate-900 block">Most Requested Studies</span>
            <ul className="space-y-1.5 text-slate-700 font-medium">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                <span>REPOS-3 Renal Subgroup Analysis (2026)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                <span>PARADIGM-CV Hospital Readmission Data</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                <span>GERIA-CARDIO Geriatric Safety Whitepaper</span>
              </li>
            </ul>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <span className="text-[11px] font-extrabold text-slate-900 block">Products Discussed Over Time</span>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span>Cardiovasc XL 100mg</span>
                <span className="font-bold text-blue-600">75% of visits</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full w-[75%]" />
              </div>
              <div className="flex items-center justify-between pt-1">
                <span>AtheroStat 20mg</span>
                <span className="font-bold text-emerald-600">25% of visits</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full w-[25%]" />
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <span className="text-[11px] font-extrabold text-slate-900 block">Visit Frequency Score</span>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-slate-900">88 / 100</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2.5 py-1 rounded-full">
                High Access KOL
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Averages 1 visit every 14 days. Consistently welcomes scheduled clinical calls.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 4: PREDICTED DISCUSSION */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
          <BrainCircuit className="w-4 h-4 text-purple-600" />
          <span>Section 4: Today's Predicted Discussion Topics</span>
        </h3>

        <div className="space-y-3">
          {predictedTopics.map((item, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span>• {item.label}</span>
                <span className="font-black text-slate-900">{item.percent}% Probability</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full ${item.color} transition-all duration-500`}
                  style={{ width: `${item.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 5: NEXT BEST ACTION */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
          <Award className="w-4 h-4 text-emerald-600" />
          <span>Section 5: Recommended Next Best Actions</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {nextBestActions.map((action, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 flex flex-col justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-md border ${action.color}`}>
                    {action.tag}
                  </span>
                </div>
                <h4 className="text-xs font-extrabold text-slate-900 pt-1">
                  {action.title}
                </h4>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                {action.reason}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 6: TIMELINE */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span>Section 6: Smart Memory Visit Timeline</span>
          </h3>
          <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            Detailed Audit Trail
          </span>
        </div>

        <div className="space-y-4 relative pl-5 border-l-2 border-blue-200">
          {(doctor.visitTimeline && doctor.visitTimeline.length > 0 ? doctor.visitTimeline : [
            {
              id: "t1",
              date: "2026-07-22",
              summary: "Presented Cardiovasc XL 100mg renal outcomes trial.",
              doctorReaction: "Positive",
              followUpNeeded: true,
              followUpDetails: "Deliver REPOS-3 renal subgroup paper"
            },
            {
              id: "t2",
              date: "2026-07-08",
              summary: "Reviewed PARADIGM-CV trial data regarding 30-day heart failure hospital readmissions.",
              doctorReaction: "Enthusiastic",
              followUpNeeded: false
            },
            {
              id: "t3",
              date: "2026-06-24",
              summary: "Provided 10 starter packs of Cardiovasc XL. Addressed copay tier concern.",
              doctorReaction: "Neutral",
              followUpNeeded: true,
              followUpDetails: "Follow-up on patient coupon redemptions"
            }
          ]).map((vt) => (
            <div key={vt.id} className="relative space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs">
              <span className="absolute -left-[27px] top-4 w-3.5 h-3.5 bg-blue-600 rounded-full ring-4 ring-white" />
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  {vt.date}
                </span>
                <span className="text-[10px] font-extrabold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-md">
                  Reaction: {vt.doctorReaction}
                </span>
              </div>
              <p className="text-slate-700 font-medium leading-relaxed">{vt.summary}</p>
              {vt.followUpNeeded && vt.followUpDetails && (
                <div className="pt-2 mt-1 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-blue-800 font-bold bg-blue-50/80 p-2 rounded-xl">
                  <span>Follow-up: {vt.followUpDetails}</span>
                  <span className="text-[9px] bg-blue-600 text-white px-2 py-0.5 rounded-md">Pending</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* FIXED BOTTOM ACTION BAR: PREPARE ME */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 p-4 shadow-2xl">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="hidden sm:block">
            <span className="text-xs font-extrabold text-slate-900 block">{doctor.name} • Smart Memory</span>
            <span className="text-[11px] text-slate-500">Ready to synthesize personalized call strategy</span>
          </div>

          <button
            onClick={onPrepareBrief}
            className="w-full sm:w-auto flex-1 py-4 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-black rounded-2xl shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2.5 transition-all active:scale-[0.99]"
          >
            <Stethoscope className="w-5 h-5" />
            <span>Prepare Me (Launch Visit Brief)</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
