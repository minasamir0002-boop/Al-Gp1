/**
 * Reusable Visit Card Component
 * Renders completed and scheduled physician detailing visit logs.
 */

import React from 'react';
import { Visit } from '../../models';
import { Clock, Calendar, MapPin, Sparkles, Package, ChevronRight } from 'lucide-react';

interface VisitCardProps {
  visit: Visit;
  onSelect?: (v: Visit) => void;
}

export const VisitCard: React.FC<VisitCardProps> = React.memo(({ visit, onSelect }) => {
  return (
    <div
      onClick={() => onSelect?.(visit)}
      className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-600 transition-all space-y-3 cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-800 dark:text-white">{visit.doctorName}</span>
            <span className="text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 px-2 py-0.5 rounded-md">
              {visit.doctorSpecialty}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{visit.doctorHospital}</p>
        </div>

        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center space-x-1">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{visit.date}</span>
        </span>
      </div>

      {visit.aiSummary && (
        <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
          <div className="font-bold text-indigo-900 dark:text-indigo-300 flex items-center space-x-1 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>AI Executive Brief:</span>
          </div>
          <p className="leading-relaxed">{visit.aiSummary}</p>
        </div>
      )}

      {visit.productsDiscussed && visit.productsDiscussed.length > 0 && (
        <div className="flex items-center space-x-2 overflow-x-auto text-[11px]">
          <span className="text-slate-400 font-medium">Discussed:</span>
          {visit.productsDiscussed.map((p, idx) => (
            <span
              key={idx}
              className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold px-2 py-0.5 rounded-md whitespace-nowrap"
            >
              {p.productName} ({p.reaction})
            </span>
          ))}
        </div>
      )}

      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>Follow-up: {visit.nextFollowUpDate || 'None scheduled'}</span>
        <span className="text-indigo-600 dark:text-indigo-400 font-semibold flex items-center space-x-1">
          <span>View Call Log</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
});

VisitCard.displayName = 'VisitCard';
