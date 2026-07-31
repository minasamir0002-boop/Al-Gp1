import React from 'react';
import { 
  Swords, 
  Building2, 
  CheckCircle2, 
  AlertTriangle, 
  Package, 
  ShieldAlert
} from 'lucide-react';
import { SAMPLE_COMPETITORS } from '../../data/knowledgeData';

export const CompetitorsSection: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Competitors & Market Battlecards</h2>
            <p className="text-xs text-slate-500">
              Head-to-head clinical and commercial comparisons against primary market rivals.
            </p>
          </div>
          <span className="text-xs font-extrabold bg-rose-50 text-rose-800 px-3 py-1 rounded-full border border-rose-200 self-start sm:self-auto">
            {SAMPLE_COMPETITORS.length} Competitor Brands
          </span>
        </div>
      </div>

      {/* Competitors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {SAMPLE_COMPETITORS.map((comp) => (
          <div
            key={comp.id}
            className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-4">
              {/* Header: Brand Name, Company, Competes Against */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 shrink-0">
                    <Swords className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">
                      {comp.brandName}
                    </h3>
                    <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{comp.company}</span>
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    Competes Against
                  </span>
                  <span className="text-xs font-extrabold bg-blue-50 text-blue-800 px-2.5 py-0.5 rounded-md border border-blue-100 inline-block mt-0.5">
                    {comp.competesAgainst}
                  </span>
                </div>
              </div>

              {/* Main Strength */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-900 font-extrabold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Main Strength</span>
                </div>
                <p className="text-xs text-emerald-950 font-medium leading-relaxed pl-5">
                  {comp.mainStrength}
                </p>
              </div>

              {/* Main Weakness */}
              <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-100 space-y-1">
                <div className="flex items-center gap-1.5 text-rose-900 font-extrabold text-xs">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Main Weakness</span>
                </div>
                <p className="text-xs text-rose-950 font-medium leading-relaxed pl-5">
                  {comp.mainWeakness}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-400">
              <span>Local Battlecard Verified</span>
              <span>RepMind Intelligence</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
