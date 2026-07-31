import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { calculateNextBestDoctor } from '../../lib/aiSmartEngine';
import { Sparkles, Award, MapPin, ChevronRight, Zap, AlertCircle, HelpCircle, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  onOpenCoach: (doc: any) => void;
}

export const NextBestDoctorCard: React.FC<Props> = ({ onOpenCoach }) => {
  const { aiState, quickNavigateToRecordVisitWithDoctor } = useApp();
  const [showScoreDetail, setShowScoreDetail] = useState(false);

  const recommendation = aiState.nextBestDoctor;
  if (!recommendation) return null;

  const { doctor, priorityScore: aiScore, selectedReason: recommendationReason, scoringBreakdown, recommendedProduct: suggestedProduct } = recommendation;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-xl border border-blue-500/30 relative overflow-hidden text-left"
    >
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Card Header */}
      <div className="flex items-center justify-between border-b border-blue-800/60 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-amber-300">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300 block">AI Smart Engine Priority</span>
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              Next Best Doctor Target
            </h3>
          </div>
        </div>

        {/* AI Score Badge */}
        <button
          onClick={() => setShowScoreDetail(!showScoreDetail)}
          className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white px-3 py-1 rounded-xl shadow-lg flex items-center gap-1.5 transition-all hover:scale-105"
          title="Click to view score calculation breakdown"
        >
          <Award className="w-4 h-4 text-amber-200" />
          <span className="text-xs font-black">AI Score {aiScore}/100</span>
        </button>
      </div>

      {/* Doctor Info Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-blue-950/60 p-3.5 rounded-xl border border-blue-800/40">
        <div className="flex items-center gap-3">
          <img
            src={doctor.avatar}
            alt={doctor.name}
            className="w-12 h-12 rounded-2xl object-cover border-2 border-blue-400/40 shadow-sm"
          />
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-black text-white">{doctor.name}</h4>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30">
                {doctor.doctorClass}
              </span>
            </div>
            <p className="text-xs text-blue-200 font-medium">{doctor.title} • {doctor.specialty}</p>
            <p className="text-[11px] text-slate-300 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-blue-400 shrink-0" />
              {doctor.hospital}
            </p>
          </div>
        </div>

        <div className="text-right sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-blue-800/40">
          <span className="text-[10px] text-blue-300 font-bold uppercase block">Target Campaign Product</span>
          <span className="text-xs font-black text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20 inline-block mt-0.5">
            {suggestedProduct}
          </span>
        </div>
      </div>

      {/* Rationale */}
      <div className="mt-3 text-xs text-blue-100 bg-indigo-950/40 p-2.5 rounded-xl border border-indigo-800/40">
        <span className="font-bold text-amber-300 block mb-0.5 text-[10px] uppercase tracking-wider">AI Rationale:</span>
        <p className="leading-relaxed text-slate-200 text-[11px]">{recommendationReason}</p>
      </div>

      {/* Score Breakdown Dropdown / Drawer */}
      <AnimatePresence>
        {showScoreDetail && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 p-3 bg-blue-950 rounded-xl border border-blue-700/50 space-y-2 text-xs"
          >
            <div className="flex items-center justify-between text-amber-300 font-bold text-[11px] border-b border-blue-800 pb-1">
              <span>Multi-Variable AI Score Breakdown</span>
              <span>{aiScore} Total Points</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
              <div className="bg-blue-900/50 p-2 rounded border border-blue-800">
                <span className="text-slate-400 block">Doctor Class</span>
                <span className="font-bold text-white">+{scoringBreakdown.doctorClassFactor} pts</span>
              </div>
              <div className="bg-blue-900/50 p-2 rounded border border-blue-800">
                <span className="text-slate-400 block">Overdue Boost</span>
                <span className="font-bold text-amber-300">+{scoringBreakdown.lastVisitOverdueFactor} pts</span>
              </div>
              <div className="bg-blue-900/50 p-2 rounded border border-blue-800">
                <span className="text-slate-400 block">Campaign Fit</span>
                <span className="font-bold text-emerald-400">+{scoringBreakdown.productCampaignFactor} pts</span>
              </div>
              <div className="bg-blue-900/50 p-2 rounded border border-blue-800">
                <span className="text-slate-400 block">Follow-up Alert</span>
                <span className="font-bold text-teal-300">+{scoringBreakdown.outstandingFollowUpFactor} pts</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card Action Buttons */}
      <div className="mt-3 pt-3 border-t border-blue-800/60 flex flex-wrap items-center justify-between gap-2 text-xs">
        <button
          onClick={() => onOpenCoach(doctor)}
          className="px-3 py-1.5 rounded-xl bg-indigo-800/80 hover:bg-indigo-700 text-indigo-200 font-bold flex items-center gap-1.5 border border-indigo-600 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Launch AI Pre-Visit Coach</span>
        </button>

        <button
          onClick={() => quickNavigateToRecordVisitWithDoctor(doctor)}
          className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold shadow-md flex items-center gap-1 transition-all hover:scale-105"
        >
          <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
          <span>Execute Visit</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};
