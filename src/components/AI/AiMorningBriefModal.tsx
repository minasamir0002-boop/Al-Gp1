import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { generateAiMorningBriefData } from '../../lib/aiSmartEngine';
import { X, Sparkles, Volume2, AlertTriangle, Target, TrendingUp, Route, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AiMorningBriefModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { repProfile, doctors, visits, alerts, quickNavigateToRecordVisitWithDoctor } = useApp();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeTab, setActiveTab] = useState<'summary' | 'overdue' | 'risks' | 'route'>('summary');

  if (!isOpen) return null;

  const briefData = generateAiMorningBriefData(repProfile, doctors, visits, alerts);

  const speakBrief = () => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }
      const text = `${briefData.greeting}. ${briefData.executiveSummary}. Today's priority: ${briefData.priorities.join('. ')}. Expected impact score: ${briefData.expectedImpactScore} out of 100.`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto text-left">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-slate-900 text-white rounded-3xl max-w-2xl w-full border border-indigo-500/40 shadow-2xl overflow-hidden my-auto"
      >
        {/* Header Banner */}
        <div className="p-5 bg-gradient-to-r from-indigo-900 via-blue-950 to-slate-900 border-b border-indigo-800/60 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-amber-300">
                <Sparkles className="w-5 h-5 animate-spin-slow" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest block">RepOS Smart Engine</span>
                <h2 className="text-lg font-black text-white">{briefData.greeting}</h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={speakBrief}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                  isSpeaking
                    ? 'bg-rose-600 text-white border-rose-400'
                    : 'bg-indigo-800/80 hover:bg-indigo-700 text-indigo-100 border-indigo-600'
                }`}
              >
                <Volume2 className="w-4 h-4" />
                <span>{isSpeaking ? 'Stop Audio' : 'Listen Brief'}</span>
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-indigo-900/60 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Impact Score Strip */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="bg-indigo-950/80 p-2.5 rounded-xl border border-indigo-700/50">
              <span className="text-[10px] font-bold text-indigo-300 uppercase block">Expected Impact</span>
              <span className="text-base font-black text-amber-300">{briefData.expectedImpactScore} / 100 Score</span>
            </div>
            <div className="bg-indigo-950/80 p-2.5 rounded-xl border border-indigo-700/50">
              <span className="text-[10px] font-bold text-indigo-300 uppercase block">Prescribing Uplift</span>
              <span className="text-xs font-black text-emerald-400">{briefData.prescribingUpliftEstimate}</span>
            </div>
            <div className="bg-indigo-950/80 p-2.5 rounded-xl border border-indigo-700/50 col-span-2 sm:col-span-1">
              <span className="text-[10px] font-bold text-indigo-300 uppercase block">Overdue Doctors</span>
              <span className="text-xs font-black text-rose-400">{briefData.overdueDoctors.length} Action Required</span>
            </div>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-indigo-900/60 px-5 bg-slate-950 text-xs font-bold">
          <button
            onClick={() => setActiveTab('summary')}
            className={`py-3 px-3 border-b-2 transition-colors ${activeTab === 'summary' ? 'border-amber-400 text-amber-300' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
          >
            Today's Priorities
          </button>
          <button
            onClick={() => setActiveTab('overdue')}
            className={`py-3 px-3 border-b-2 transition-colors ${activeTab === 'overdue' ? 'border-amber-400 text-amber-300' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
          >
            Overdue Doctors ({briefData.overdueDoctors.length})
          </button>
          <button
            onClick={() => setActiveTab('risks')}
            className={`py-3 px-3 border-b-2 transition-colors ${activeTab === 'risks' ? 'border-amber-400 text-amber-300' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
          >
            Risks & Gaps
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 max-h-[60vh] overflow-y-auto space-y-4 text-xs">
          {activeTab === 'summary' && (
            <div className="space-y-4">
              <div className="bg-indigo-950/50 p-3.5 rounded-2xl border border-indigo-800/40 text-slate-200 leading-relaxed">
                <span className="font-bold text-indigo-300 block mb-1 uppercase text-[10px]">Executive Briefing</span>
                {briefData.executiveSummary}
              </div>

              {/* Priorities List */}
              <div className="space-y-2">
                <h4 className="font-bold text-amber-300 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-amber-400" /> Key Strategic Priorities
                </h4>
                <div className="space-y-2">
                  {briefData.priorities.map((pri, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-300 font-bold text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <p className="text-slate-200 leading-snug">{pri}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Campaign Products Focus */}
              <div className="space-y-2 pt-2">
                <h4 className="font-bold text-indigo-300 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-indigo-400" /> Focus Campaign Products
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {briefData.focusProducts.map((p, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-indigo-950/60 border border-indigo-800/50 space-y-1">
                      <span className="font-black text-amber-300 block">{p.name}</span>
                      <span className="text-[10px] text-indigo-200 font-semibold uppercase">{p.campaignGoal}</span>
                      <p className="text-[11px] text-slate-300 mt-1">"{p.keyMessage}"</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'overdue' && (
            <div className="space-y-3">
              <p className="text-slate-300">Physicians past their campaign frequency window in Central District:</p>
              {briefData.overdueDoctors.map((doc, idx) => {
                const matchedDoc = doctors.find(d => d.name === doc.name);
                return (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-800/90 border border-rose-500/30 flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{doc.name}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          {doc.daysOverdue} Days Overdue
                        </span>
                      </div>
                      <p className="text-slate-400 text-[11px]">{doc.specialty} • {doc.hospital}</p>
                    </div>

                    {matchedDoc && (
                      <button
                        onClick={() => {
                          onClose();
                          quickNavigateToRecordVisitWithDoctor(matchedDoc);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shrink-0 transition-colors"
                      >
                        Visit Doctor
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'risks' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-600/40 space-y-2">
                <h4 className="font-bold text-amber-300 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-amber-400" /> Territory Coverage Risks
                </h4>
                {briefData.coverageRisks.map((risk, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-900 border border-amber-800/40 space-y-1">
                    <div className="flex justify-between font-bold">
                      <span className="text-white">{risk.district}</span>
                      <span className="text-amber-300">{risk.currentCoverage}% vs {risk.targetCoverage}% Target</span>
                    </div>
                    <p className="text-slate-300 text-[11px]">{risk.detail}</p>
                  </div>
                ))}
              </div>

              <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-600/40 space-y-2">
                <h4 className="font-bold text-indigo-300 flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-indigo-400" /> Specialty Frequency Gaps
                </h4>
                {briefData.frequencyGaps.map((gap, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-900 border border-indigo-800/40 flex justify-between items-center">
                    <div>
                      <span className="font-bold text-white block">{gap.specialty}</span>
                      <span className="text-slate-400 text-[11px]">{gap.gapText}</span>
                    </div>
                    <span className="font-black text-rose-400 bg-rose-950/60 px-2 py-1 rounded border border-rose-800/50">
                      {gap.currentFreq}x / {gap.targetFreq}x
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-indigo-900/60 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow"
          >
            Acknowledge & Start Shift
          </button>
        </div>
      </motion.div>
    </div>
  );
};
