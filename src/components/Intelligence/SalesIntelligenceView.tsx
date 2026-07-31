import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  DollarSign,
  AlertTriangle,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  PieChart,
  Users,
  Target,
  BookOpen,
  Package,
  Layers,
  MapPin
} from 'lucide-react';

export const SalesIntelligenceView: React.FC = () => {
  const { salesIntelligence, doctors, quickNavigateToRecordVisitWithDoctor, aiState } = useApp();
  const [activeSubTab, setActiveSubTab] = useState<'territory' | 'objections' | 'products' | 'revenue'>('territory');
  const [executedRecs, setExecutedRecs] = useState<string[]>([]);

  const territory = aiState.territoryIntelligence;
  const objections = aiState.objectionMetrics;
  const productsIntel = aiState.productIntelligenceList;

  const handleExecute = (id: string) => {
    setExecutedRecs(prev => [...prev, id]);
  };

  return (
    <div className="p-3 sm:p-4 space-y-5 pb-24 text-left max-w-5xl mx-auto">
      {/* Top Banner: Revenue Projection */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-5 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center space-x-1">
                <TrendingUp className="w-3 h-3" />
                <span>AI Core Engine</span>
              </span>
              <span className="text-slate-400 text-xs">Real-Time Intelligence</span>
            </div>
            <h1 className="text-2xl font-black mt-1.5 text-white">Territory & Product Intelligence</h1>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black text-emerald-400">
              ${salesIntelligence.expectedMonthlySales.toLocaleString()}
            </div>
            <div className="text-xs text-emerald-300 font-medium flex items-center justify-end space-x-0.5 mt-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+{salesIntelligence.growthRate}% Monthly Trajectory</span>
            </div>
          </div>
        </div>

        {/* Intelligence Category Selector Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-2xl border border-slate-700/60 overflow-x-auto text-xs mt-3">
          <button
            onClick={() => setActiveSubTab('territory')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeSubTab === 'territory' ? 'bg-indigo-600 text-white shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            <PieChart className="w-3.5 h-3.5" />
            <span>Territory Intelligence</span>
          </button>
          <button
            onClick={() => setActiveSubTab('objections')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeSubTab === 'objections' ? 'bg-indigo-600 text-white shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Objection Intelligence</span>
          </button>
          <button
            onClick={() => setActiveSubTab('products')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeSubTab === 'products' ? 'bg-indigo-600 text-white shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Product Intelligence</span>
          </button>
          <button
            onClick={() => setActiveSubTab('revenue')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeSubTab === 'revenue' ? 'bg-indigo-600 text-white shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Prescribing Opportunities</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: Territory Intelligence */}
      {activeSubTab === 'territory' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-1">Coverage Rate</span>
              <span className="text-2xl font-black text-slate-900">{territory.coveragePercentage}%</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">{territory.visitedDoctorsCount} / {territory.totalDoctorsCount} Doctors Visited</span>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-1">Frequency Index</span>
              <span className="text-2xl font-black text-slate-900">{territory.frequencyPercentage}%</span>
              <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">Optimal Call Pacing</span>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-1">Inactive Physicians</span>
              <span className="text-2xl font-black text-rose-600">{territory.inactiveDoctors.length}</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">&gt;30 Days Since Visit</span>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-1">Overdue Follow-ups</span>
              <span className="text-2xl font-black text-amber-600">{territory.overdueDoctors.length}</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">14–30 Days Deficit</span>
            </div>
          </div>

          {/* AI Territory Recommendations */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
              <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">AI Territory Directives & Audit Recommendations</h3>
            </div>
            <div className="space-y-2">
              {territory.aiRecommendations.map((rec, idx) => (
                <div key={idx} className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl text-xs font-medium text-indigo-950 flex items-start gap-2">
                  <span className="font-bold text-indigo-600">#{idx + 1}</span>
                  <p>{rec}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Overdue Doctors List */}
          {territory.overdueDoctors.length > 0 && (
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
              <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">Overdue & Inactive Doctors Action Queue</h3>
              <div className="space-y-2">
                {territory.overdueDoctors.map((doc) => (
                  <div key={doc.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between gap-2 text-xs">
                    <div>
                      <span className="font-bold text-slate-900 block">{doc.name} ({doc.doctorClass})</span>
                      <span className="text-[11px] text-slate-500">{doc.specialty} • {doc.hospital}</span>
                    </div>
                    <button
                      onClick={() => quickNavigateToRecordVisitWithDoctor(doc)}
                      className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] shrink-0"
                    >
                      Schedule Visit
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: Objection Intelligence */}
      {activeSubTab === 'objections' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                <h2 className="font-bold text-slate-800 text-sm">Automated Objection Intelligence Matrix</h2>
              </div>
              <span className="text-xs font-bold text-slate-400">{objections.length} Categories Auto-Indexed</span>
            </div>

            <div className="space-y-3">
              {objections.map((m, idx) => (
                <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-md">
                        {m.category}
                      </span>
                      <span className="text-xs font-extrabold text-slate-800">{m.relatedProduct}</span>
                    </div>
                    <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                      {m.occurrences} Mentions ({m.percentageOfTotal}%)
                    </span>
                  </div>

                  <div className="text-xs text-indigo-950 bg-indigo-50/70 p-2.5 rounded-lg border border-indigo-100 font-medium">
                    <span className="font-bold text-indigo-900 block mb-0.5">💬 Recommended Counter Response:</span>
                    {m.bestResponse}
                  </div>

                  <div className="text-[11px] text-slate-600 flex items-center gap-1.5 pt-1">
                    <BookOpen className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span className="font-bold text-slate-700">Supporting Evidence:</span>
                    <span>{m.supportingTrial}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: Product Intelligence */}
      {activeSubTab === 'products' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {productsIntel.map((pi, idx) => (
              <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b pb-2 border-slate-100">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm">{pi.product.name}</h3>
                    <span className="text-[11px] text-slate-500 font-medium">{pi.product.category}</span>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    {pi.campaignStatus}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 text-[10px] block">Prescribers</span>
                    <span className="font-extrabold text-slate-900">{pi.doctorsPromotingCount} Doctors</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 text-[10px] block">Monthly Revenue</span>
                    <span className="font-extrabold text-emerald-600">${pi.monthlyImpact.estimatedRevenueUsd.toLocaleString()}</span>
                  </div>
                </div>

                <div className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="font-bold text-slate-900 block mb-0.5">Campaign Direction:</span>
                  {pi.campaignGoal}
                </div>

                <div className="text-xs text-amber-900 bg-amber-50/60 p-2.5 rounded-xl border border-amber-200/60 space-y-1">
                  <span className="font-bold text-amber-900 block">Competitor Pressure: {pi.competitorPressure.competitorName}</span>
                  <p className="text-[11px] text-amber-800">{pi.competitorPressure.repAdvantage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: Revenue & Opportunities */}
      {activeSubTab === 'revenue' && (
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              <h2 className="font-bold text-slate-800 text-sm">Top Prescription Potential Physicians</h2>
            </div>
            <span className="text-xs text-slate-400 font-medium">Ranked by Value</span>
          </div>

          <div className="space-y-3">
            {salesIntelligence.topPotentialDoctors.map((item, idx) => {
              const matchingDoc = doctors.find(d => d.id === item.doctorId);
              return (
                <div 
                  key={item.doctorId} 
                  className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl hover:border-indigo-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-extrabold text-xs flex items-center justify-center">
                        #{idx + 1}
                      </span>
                      <div>
                        <div className="font-bold text-slate-800 text-sm">{item.doctorName}</div>
                        <div className="text-xs text-slate-500">{item.specialty}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-extrabold text-emerald-600">
                        +${item.potentialValue.toLocaleString()}/mo
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium">
                        {item.conversionLikelihood}% Conversion Likelihood
                      </div>
                    </div>
                  </div>

                  {/* Conversion Bar */}
                  <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                    <div className="w-3/5">
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-emerald-500 h-full rounded-full" 
                          style={{ width: `${item.conversionLikelihood}%` }}
                        ></div>
                      </div>
                    </div>
                    {matchingDoc && (
                      <button
                        onClick={() => quickNavigateToRecordVisitWithDoctor(matchingDoc)}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
                      >
                        <span>Prioritize Visit</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
