import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { calculatePerformanceScore } from '../../lib/aiSmartEngine';
import { Award, Target, Zap, TrendingUp, ChevronRight, X, Sparkles, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const PerformanceScoreCard: React.FC = () => {
  const { aiState } = useApp();
  const [showDetail, setShowDetail] = useState(false);

  const kpis = aiState.calculatedKPIs;
  const { performanceScore: score, performanceTier: tier, scoreBreakdown } = kpis;

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm relative text-left">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <Award className="w-4 h-4 text-amber-500" /> AI Rep Performance Score
        </span>
        <button
          onClick={() => setShowDetail(!showDetail)}
          className="text-[10px] font-extrabold text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg border border-blue-200 transition-colors flex items-center gap-1"
        >
          <span>Breakdown</span>
          <ChevronRight className={`w-3 h-3 transition-transform ${showDetail ? 'rotate-90' : ''}`} />
        </button>
      </div>

      <div className="flex items-baseline justify-between mt-1">
        <div>
          <span className="text-3xl font-black text-slate-900 tracking-tight">{score}</span>
          <span className="text-xs font-bold text-slate-400"> / 100</span>
          <span className="text-[11px] font-bold text-emerald-600 block mt-0.5">
            {tier}
          </span>
        </div>

        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center font-black text-lg shadow-md">
          🏆
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200 mt-3">
        <div
          className="h-full bg-gradient-to-r from-amber-500 via-emerald-500 to-blue-600 rounded-full transition-all duration-700"
          style={{ width: `${score}%` }}
        />
      </div>

      {/* Detailed Breakdown Drawer */}
      <AnimatePresence>
        {showDetail && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 pt-3 border-t border-slate-100 space-y-2 text-xs"
          >
            <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
              Score Algorithm Metrics
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 text-[10px] block">Coverage Rate</span>
                <span className="font-bold text-slate-900">{kpis.coveragePercentage}% ({scoreBreakdown.coverageWeight}/30 pts)</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 text-[10px] block">Visit Frequency</span>
                <span className="font-bold text-slate-900">{kpis.frequencyPercentage}% ({scoreBreakdown.frequencyWeight}/25 pts)</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 text-[10px] block">Monthly Target Exec</span>
                <span className="font-bold text-slate-900">{kpis.completedVisitsThisMonth}/{kpis.monthlyTargetVisits} ({scoreBreakdown.volumeWeight}/25 pts)</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 text-[10px] block">AI Action Execution</span>
                <span className="font-bold text-blue-700">High ({scoreBreakdown.aiExecutionWeight}/20 pts)</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
