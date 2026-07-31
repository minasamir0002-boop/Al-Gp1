import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Target, Award, RefreshCw, Volume2, ArrowRight, MapPin, AlertCircle, CheckCircle2, Zap, HeartPulse, ShieldAlert, ChevronRight } from 'lucide-react';
import { NextBestDoctorCard } from '../AI/NextBestDoctorCard';
import { PerformanceScoreCard } from '../AI/PerformanceScoreCard';
import { AiMorningBriefModal } from '../AI/AiMorningBriefModal';
import { PreVisitCoachModal } from '../AI/PreVisitCoachModal';
import { Doctor } from '../../types';

export const DashboardView: React.FC = () => {
  const {
    repProfile,
    morningBrief,
    isLoadingBrief,
    fetchMorningBrief,
    nextBestActions,
    alerts,
    routeStops,
    products,
    quickNavigateToRecordVisitWithDoctor,
    doctors,
    setActiveTab,
    optimizeRouteWithAi,
    aiState
  } = useApp();

  const kpis = aiState.calculatedKPIs;

  const [isSpeakingBrief, setIsSpeakingBrief] = useState(false);
  const [isOptimizingRoute, setIsOptimizingRoute] = useState(false);
  const [isBriefModalOpen, setIsBriefModalOpen] = useState(false);
  const [selectedCoachDoctor, setSelectedCoachDoctor] = useState<Doctor | null>(null);

  const speakBrief = () => {
    if (!morningBrief) return;
    if ('speechSynthesis' in window) {
      if (isSpeakingBrief) {
        window.speechSynthesis.cancel();
        setIsSpeakingBrief(false);
        return;
      }
      const textToSpeak = `${morningBrief.greeting}. ${morningBrief.executiveSummary}. Strategic advice: ${morningBrief.strategicAdvice.join('. ')}`;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 1.0;
      utterance.onend = () => setIsSpeakingBrief(false);
      utterance.onerror = () => setIsSpeakingBrief(false);
      setIsSpeakingBrief(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleRouteOptimize = async () => {
    setIsOptimizingRoute(true);
    await optimizeRouteWithAi();
    setTimeout(() => setIsOptimizingRoute(false), 600);
  };

  const completedStops = routeStops.filter(s => s.status === 'Visited').length;
  const totalStops = routeStops.length;
  const missionProgressPercent = totalStops > 0 ? Math.round((completedStops / totalStops) * 100) : 0;

  return (
    <div className="space-y-4 pb-20 pt-2 px-3 sm:px-4 max-w-5xl mx-auto text-left">
      {/* Top Banner: Rep Welcome & Quick Status */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white rounded-3xl p-4 sm:p-6 shadow-xl border border-blue-900/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                ACTIVE SHIFT • {repProfile.territory}
              </span>
              <span className="text-xs text-slate-400">Target: 4 Visits Today</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Hello, {repProfile.name.split(' ')[0]} 👋
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-lg">
              RepOS AI Engine active. Next Best Doctor calculated with 96/100 priority score.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setIsBriefModalOpen(true)}
              className="px-3 py-2 rounded-2xl bg-indigo-900/80 hover:bg-indigo-800 text-indigo-200 border border-indigo-700/60 font-bold text-xs flex items-center gap-1.5 shadow"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Full AI Brief</span>
            </button>

            <button
              onClick={() => setActiveTab('record-visit')}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-500/30 flex items-center gap-2 border border-blue-400/30 transition-all hover:scale-105"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>Record New Visit</span>
            </button>
          </div>
        </div>
      </div>

      {/* AI Next Best Doctor Highlight Component */}
      <NextBestDoctorCard onOpenCoach={(doc) => setSelectedCoachDoctor(doc)} />

      {/* 1. Today's Mission & KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
        {/* Performance Score Card */}
        <PerformanceScoreCard />

        {/* Mission Progress Card */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Target className="w-4 h-4 text-blue-600" /> Today's Mission
            </span>
            <span className="text-xs font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
              {completedStops} / {totalStops} Done
            </span>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-2xl font-black text-slate-900">{missionProgressPercent}%</span>
              <span className="text-xs text-slate-500">Route Progress</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500"
                style={{ width: `${missionProgressPercent}%` }}
              />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-2.5 line-clamp-1">
            Next Stop: Dr. Sarah Miller @ 09:45 AM
          </p>
        </div>

        {/* Coverage KPI */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Coverage KPI
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-slate-900">{kpis.coveragePercentage}%</span>
              <span className="text-xs font-bold text-emerald-600">↑ Active</span>
            </div>
            <span className="text-[11px] text-slate-500 block mt-1">{kpis.completedVisitsThisMonth} / {kpis.monthlyTargetVisits} Visits Completed</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-extrabold text-sm">
            🎯
          </div>
        </div>

        {/* Frequency KPI */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Frequency KPI
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-slate-900">{kpis.frequencyPercentage}%</span>
              <span className="text-xs font-bold text-emerald-600">Optimal Rate</span>
            </div>
            <span className="text-[11px] text-slate-500 block mt-1">{kpis.callAveragePerDay} Calls/Day Average</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 font-extrabold text-sm">
            ⚡
          </div>
        </div>
      </div>

      {/* 2. AI Morning Brief Card */}
      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-950 text-white rounded-2xl p-4 sm:p-5 shadow-lg border border-indigo-500/30 relative">
        <div className="flex items-center justify-between border-b border-indigo-800/60 pb-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin-slow" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                AI Morning Briefing
              </h3>
              <p className="text-[11px] text-indigo-200">Generated by Gemini 3.6 Flash</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsBriefModalOpen(true)}
              className="px-2.5 py-1 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/30 font-bold text-xs hover:bg-amber-400/30"
            >
              Expand Deep Dive
            </button>

            <button
              onClick={speakBrief}
              disabled={!morningBrief}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1 border transition-colors ${
                isSpeakingBrief
                  ? 'bg-rose-500 text-white border-rose-400'
                  : 'bg-indigo-800/80 hover:bg-indigo-700 text-indigo-200 border-indigo-700'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{isSpeakingBrief ? 'Stop' : 'Listen'}</span>
            </button>

            <button
              onClick={fetchMorningBrief}
              disabled={isLoadingBrief}
              className="p-1.5 rounded-xl bg-indigo-800/80 hover:bg-indigo-700 text-indigo-200 border border-indigo-700 transition-colors"
              title="Refresh AI Brief"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingBrief ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {isLoadingBrief ? (
          <div className="py-6 text-center text-indigo-200 text-xs flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
            Analyzing doctor visit logs & territory metrics...
          </div>
        ) : morningBrief ? (
          <div className="space-y-3 text-xs text-left">
            <p className="text-indigo-100 font-medium leading-relaxed">
              {morningBrief.executiveSummary}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 bg-indigo-950/60 p-3 rounded-xl border border-indigo-800/50">
              <div>
                <span className="font-bold text-amber-300 block mb-1 text-[11px] uppercase tracking-wider">
                  Top Priority Targets
                </span>
                <ul className="space-y-1 text-slate-200 text-[11px]">
                  {morningBrief.topTargets.map((t, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="font-bold text-indigo-300 block mb-1 text-[11px] uppercase tracking-wider">
                  Strategic Advice
                </span>
                <ul className="space-y-1 text-slate-200 text-[11px]">
                  {morningBrief.strategicAdvice.map((a, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-indigo-400 mt-0.5">•</span>
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between text-[11px] text-indigo-300 pt-1">
              <span><strong>Product Focus:</strong> {morningBrief.recommendedFocusProduct}</span>
              <span className="text-indigo-400">{morningBrief.weatherOrRouteNote}</span>
            </div>
          </div>
        ) : null}
      </div>

      {/* 3. Next Best Actions & Doctor Alerts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Next Best Actions */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500 fill-amber-500" /> Next Best Actions
            </h3>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              AI Recommendations
            </span>
          </div>

          <div className="space-y-2.5">
            {nextBestActions.map((nba) => {
              const matchedDoctor = doctors.find(d => d.id === nba.doctorId);
              return (
                <div
                  key={nba.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 transition-all group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {nba.doctorName}
                      </span>
                      <h4 className="text-xs font-semibold text-slate-700 mt-0.5">
                        {nba.actionTitle}
                      </h4>
                    </div>
                    <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full shrink-0">
                      Score {nba.impactScore}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">{nba.reason}</p>
                  
                  <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-slate-200/60">
                    <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                      Pitches: {nba.suggestedProduct}
                    </span>
                    <div className="flex items-center gap-1">
                      {matchedDoctor && (
                        <button
                          onClick={() => setSelectedCoachDoctor(matchedDoctor)}
                          className="text-[10px] font-bold text-purple-700 hover:text-purple-900 px-2 py-1 rounded bg-purple-100/60"
                        >
                          Coach
                        </button>
                      )}
                      <button
                        onClick={() => matchedDoctor && quickNavigateToRecordVisitWithDoctor(matchedDoctor)}
                        className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        <span>Execute</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Doctor Alerts */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-500" /> Urgent Doctor Alerts
            </h3>
            <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
              {alerts.length} Action Needed
            </span>
          </div>

          <div className="space-y-2.5">
            {alerts.map((alt) => {
              const matchedDoctor = doctors.find(d => d.id === alt.doctorId);
              return (
                <div
                  key={alt.id}
                  className="p-3 rounded-xl bg-rose-50/40 border border-rose-100 hover:border-rose-300 transition-all"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900">{alt.doctorName}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      alt.urgency === 'High' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {alt.type}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600">{alt.message}</p>

                  <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-rose-100/80 text-[10px]">
                    <span className="text-slate-400">{alt.date}</span>
                    {matchedDoctor && (
                      <button
                        onClick={() => quickNavigateToRecordVisitWithDoctor(matchedDoctor)}
                        className="font-bold text-rose-700 hover:text-rose-900 flex items-center gap-1"
                      >
                        Visit Now <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Today's Route Section */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-blue-600" /> Today's AI Optimized Route
            </h3>
            <p className="text-[11px] text-slate-500">Distance, priority, and appointment time optimized • 18 min drive saved</p>
          </div>

          <button
            onClick={handleRouteOptimize}
            disabled={isOptimizingRoute}
            className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold flex items-center gap-1 border border-blue-200 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isOptimizingRoute ? 'animate-spin' : ''}`} />
            <span>{isOptimizingRoute ? 'Re-optimizing...' : 'AI Re-Optimize'}</span>
          </button>
        </div>

        <div className="space-y-2">
          {routeStops.map((stop, idx) => {
            const matchedDoc = doctors.find(d => d.id === stop.doctorId);
            return (
              <div
                key={stop.id}
                className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                  stop.status === 'Visited'
                    ? 'bg-slate-50 border-slate-200 text-slate-400'
                    : 'bg-white border-slate-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs shrink-0 ${
                    stop.status === 'Visited'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-blue-600 text-white shadow-sm'
                  }`}>
                    {stop.status === 'Visited' ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900">{stop.doctorName}</h4>
                      <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                        {stop.specialty}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{stop.hospital}</p>
                    <p className="text-[10px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded inline-block mt-1">
                      {stop.priorityReason}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-800">{stop.estimatedArrival}</div>
                    <div className="text-[10px] text-slate-400">{stop.distanceKm} km drive</div>
                  </div>

                  {matchedDoc && stop.status !== 'Visited' && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setSelectedCoachDoctor(matchedDoc)}
                        className="px-2.5 py-1.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 text-xs font-bold border border-purple-200"
                        title="AI Pre-Visit Coach"
                      >
                        Coach
                      </button>
                      <button
                        onClick={() => quickNavigateToRecordVisitWithDoctor(matchedDoc)}
                        className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-colors"
                      >
                        Start Visit
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Product Focus & AI Coach Quick Access */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {/* Product Focus */}
        <div className="md:col-span-2 bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <HeartPulse className="w-4 h-4 text-purple-600" /> Today's Product Detail Focus
            </h3>
            <button onClick={() => setActiveTab('knowledge')} className="text-xs font-bold text-blue-600 hover:underline">
              View All Products
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {products.slice(0, 2).map((prod) => (
              <div key={prod.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900">{prod.name}</span>
                  {prod.badge && (
                    <span className="text-[9px] font-bold bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded">
                      {prod.badge}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2">{prod.description}</p>
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] font-bold text-slate-700 block">Key Detail Message:</span>
                  <p className="text-[10px] text-blue-800 font-medium bg-blue-50/80 p-1.5 rounded border border-blue-100">
                    "{prod.keyDetailPoints[0]}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Coach Card */}
        <div className="bg-gradient-to-br from-purple-900 to-indigo-950 text-white rounded-2xl p-4 shadow-sm flex flex-col justify-between border border-purple-800/40">
          <div>
            <div className="flex items-center gap-1.5 text-purple-300 text-xs font-bold mb-2">
              <Sparkles className="w-4 h-4 text-amber-300" /> RepOS AI Coach
            </div>
            <h4 className="text-sm font-extrabold text-white">Visit Roleplay & Objections</h4>
            <p className="text-xs text-purple-200 mt-1.5 leading-snug">
              Prepare for Dr. Miller's renal trial objection or practice Dr. Chen's formulary pitch.
            </p>
          </div>

          <button
            onClick={() => setSelectedCoachDoctor(doctors[0])}
            className="mt-4 w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow transition-colors"
          >
            Launch AI Pre-Visit Coach
          </button>
        </div>
      </div>

      {/* AI Modals */}
      <AiMorningBriefModal isOpen={isBriefModalOpen} onClose={() => setIsBriefModalOpen(false)} />
      <PreVisitCoachModal
        doctor={selectedCoachDoctor}
        isOpen={!!selectedCoachDoctor}
        onClose={() => setSelectedCoachDoctor(null)}
        onStartVisit={(doc) => quickNavigateToRecordVisitWithDoctor(doc)}
      />
    </div>
  );
};

