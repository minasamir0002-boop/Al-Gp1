import React, { useState } from 'react';
import { Doctor } from '../../types';
import { generatePreVisitCoach } from '../../lib/aiSmartEngine';
import { X, Sparkles, MessageSquare, ShieldAlert, Award, FileText, CheckCircle2, Zap, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  doctor: Doctor | null;
  isOpen: boolean;
  onClose: () => void;
  onStartVisit?: (doc: Doctor) => void;
}

export const PreVisitCoachModal: React.FC<Props> = ({ doctor, isOpen, onClose, onStartVisit }) => {
  if (!isOpen || !doctor) return null;

  const coachData = generatePreVisitCoach(doctor);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto text-left">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden my-auto"
      >
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-300" /> AI PRE-VISIT COACH
            </span>
          </div>

          <h2 className="text-lg font-black text-white">{doctor.name}</h2>
          <p className="text-xs text-purple-200 font-medium">{doctor.title} • {doctor.specialty} • {doctor.hospital}</p>

          <div className="mt-3 bg-purple-950/60 p-2.5 rounded-xl border border-purple-700/50 flex items-center justify-between text-xs">
            <span className="text-purple-200 font-semibold">Target Product Fit:</span>
            <span className="font-black text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded border border-amber-400/30">
              {coachData.bestProduct}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 max-h-[65vh] overflow-y-auto text-xs">
          {/* 1. Core Clinical Message */}
          <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200/80 space-y-1">
            <span className="font-black text-blue-900 uppercase text-[10px] tracking-wider block">1. Recommended Clinical Message</span>
            <p className="text-blue-950 font-medium text-xs leading-relaxed">
              "{coachData.clinicalMessage}"
            </p>
          </div>

          {/* 2. Key Talking Points */}
          <div className="space-y-2">
            <h4 className="font-extrabold text-slate-800 uppercase text-[10px] tracking-wider flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-indigo-600" /> 2. Tailored Talking Points
            </h4>
            <div className="space-y-1.5">
              {coachData.talkingPoints.map((tp, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-slate-700 font-medium">{tp}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Likely Objections & Counter-Strategy */}
          <div className="space-y-2">
            <h4 className="font-extrabold text-slate-800 uppercase text-[10px] tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-600" /> 3. Anticipated Objections & Counter-Pitches
            </h4>
            {coachData.likelyObjections.map((obj, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-rose-50/50 border border-rose-200/80 space-y-1.5">
                <span className="font-bold text-rose-900 block text-xs">Objection: "{obj.objection}"</span>
                <p className="text-slate-700 text-[11px] leading-relaxed">
                  <strong>Strategy:</strong> {obj.counterStrategy}
                </p>
                <span className="text-[10px] font-bold text-rose-800 bg-rose-100/80 px-2 py-0.5 rounded inline-block">
                  Evidence: {obj.supportingData}
                </span>
              </div>
            ))}
          </div>

          {/* 4. Competitor Comparison */}
          <div className="p-3.5 rounded-2xl bg-slate-900 text-white space-y-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-amber-300 text-[11px] uppercase tracking-wider">4. Competitor Battlecard vs {coachData.competitorComparison.competitor}</span>
              <span className="text-[10px] text-slate-400">Head-to-Head</span>
            </div>
            <div className="text-[11px] space-y-1 text-slate-200">
              <p><strong>Competitor Pitch:</strong> "{coachData.competitorComparison.claim}"</p>
              <p className="text-emerald-300"><strong>Our Rep Advantage:</strong> {coachData.competitorComparison.repAdvantage}</p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Expected Prescription Potential</span>
            <span className="text-xs font-black text-emerald-700">{coachData.expectedRxPotential}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs transition-colors"
            >
              Close
            </button>

            {onStartVisit && (
              <button
                onClick={() => {
                  onClose();
                  onStartVisit(doctor);
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition-colors"
              >
                <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                <span>Start Visit Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
