import React from 'react';
import { Visit } from '../../types';
import { useApp } from '../../context/AppContext';
import { X, Sparkles, CheckCircle2, TrendingUp, ShieldAlert, Calendar, Award } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  visit: Visit | null;
  isOpen: boolean;
  onClose: () => void;
  onViewHistory?: () => void;
}

export const AfterVisitAnalysisModal: React.FC<Props> = ({ visit, isOpen, onClose, onViewHistory }) => {
  const { scoreVisit } = useApp();
  if (!isOpen || !visit) return null;

  const visitScores = scoreVisit(visit);

  // Derive Expected Prescription Potential
  const rxPotential = visit.productsDiscussed.some(p => p.reaction === 'Positive')
    ? 'High Potential: Estimated +15 to +20 scripts / month'
    : visit.productsDiscussed.some(p => p.reaction === 'Neutral')
    ? 'Moderate Potential: Estimated +6 to +10 scripts / month'
    : 'Growth Opportunity: Follow-up required to unlock scripts';

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto text-left">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden my-auto"
      >
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-300" /> VISIT SAVED & ANALYZED
            </span>
          </div>

          <h2 className="text-lg font-black text-white">{visit.doctorName}</h2>
          <p className="text-xs text-teal-200 font-medium">{visit.doctorSpecialty} • {visit.doctorHospital}</p>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto text-xs">
          {/* 1. Visit Scoring Engine Score Card */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950 text-white space-y-2 border border-indigo-800/60">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-amber-300 uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" /> Visit Scoring Engine
              </span>
              <span className="text-xs font-black bg-emerald-500 text-white px-2.5 py-0.5 rounded-full shadow">
                Grade: {visitScores.performanceGrade}
              </span>
            </div>

            <div className="flex items-baseline justify-between pt-1">
              <div>
                <span className="text-2xl font-black text-white">{visitScores.overallQualityScore}</span>
                <span className="text-xs text-slate-400"> / 100 Overall Score</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 text-[10px]">
              <div className="bg-slate-800/80 p-2 rounded-xl border border-slate-700/60 text-center">
                <span className="text-slate-400 block">Preparation</span>
                <span className="font-bold text-white text-xs">{visitScores.preparationScore}%</span>
              </div>
              <div className="bg-slate-800/80 p-2 rounded-xl border border-slate-700/60 text-center">
                <span className="text-slate-400 block">Execution</span>
                <span className="font-bold text-emerald-400 text-xs">{visitScores.executionScore}%</span>
              </div>
              <div className="bg-slate-800/80 p-2 rounded-xl border border-slate-700/60 text-center">
                <span className="text-slate-400 block">Follow-up</span>
                <span className="font-bold text-amber-300 text-xs">{visitScores.followUpScore}%</span>
              </div>
            </div>

            {/* AI Automated Coaching Tips */}
            {visitScores.coachingTips.length > 0 && (
              <div className="pt-2 border-t border-indigo-800/60 space-y-1">
                <span className="text-[10px] font-bold text-amber-300 uppercase block">Automated AI Coaching Tip:</span>
                <ul className="space-y-1 text-slate-200 text-[11px] list-disc list-inside">
                  {visitScores.coachingTips.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* 2. AI Executive Visit Summary */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="font-extrabold text-slate-800 uppercase text-[10px] tracking-wider block flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" /> AI Executive Visit Summary
            </span>
            <p className="text-slate-700 leading-relaxed text-xs">
              {visit.aiSummary || `Visit completed with ${visit.doctorName}. Discussed primary portfolio items and delivered requested clinical samples.`}
            </p>
          </div>

          {/* 3. Detected Objections */}
          <div className="space-y-2">
            <span className="font-extrabold text-slate-800 uppercase text-[10px] tracking-wider block flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" /> Detected Objections ({visit.objectionsCaptured.length})
            </span>
            {visit.objectionsCaptured.length > 0 ? (
              <div className="space-y-1.5">
                {visit.objectionsCaptured.map((obj, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-rose-50 text-rose-950 font-medium border border-rose-200/80">
                    • {obj}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-900 font-medium border border-emerald-200 text-[11px]">
                ✓ No active objections raised. Physician receptive to trial messaging.
              </div>
            )}
          </div>

          {/* 4. Expected Prescription Potential */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-950 text-white space-y-1">
            <span className="font-bold text-amber-300 uppercase text-[10px] tracking-wider block flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-amber-300" /> Expected Prescription Potential
            </span>
            <p className="text-white font-extrabold text-xs">
              {rxPotential}
            </p>
          </div>

          {/* 5. Suggested Next Action & Follow-up */}
          <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200/80 space-y-1.5">
            <span className="font-extrabold text-indigo-950 uppercase text-[10px] tracking-wider block flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-600" /> Suggested Next Action & Follow-up
            </span>
            <p className="text-indigo-900 font-semibold text-xs">
              {visit.followUpTask || 'Deliver requested clinical trial slides & re-check sample inventory.'}
            </p>
            <div className="text-[11px] text-indigo-700 font-bold pt-1">
              Scheduled Date: {visit.nextFollowUpDate || 'Within 7 Days'}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2">
          {onViewHistory && (
            <button
              onClick={() => {
                onClose();
                onViewHistory();
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs"
            >
              View Visit History
            </button>
          )}

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow ml-auto"
          >
            Done & Continue
          </button>
        </div>
      </motion.div>
    </div>
  );
};
