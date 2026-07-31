/**
 * Reusable Doctor Card Component
 * Supports dark mode, touch target sizing, and high-contrast actions.
 */

import React from 'react';
import { Doctor } from '../../models';
import { getDoctorClassBadgeClass } from '../../utils/formatters';
import { MapPin, Calendar, Clock, Phone, Sparkles, Zap } from 'lucide-react';

interface DoctorCardProps {
  doctor: Doctor;
  onViewDetails?: (doc: Doctor) => void;
  onPrep?: (doc: Doctor) => void;
  onCoach?: (doc: Doctor) => void;
  onStartVisit?: (doc: Doctor) => void;
}

export const DoctorCard: React.FC<DoctorCardProps> = React.memo(({
  doctor,
  onViewDetails,
  onPrep,
  onCoach,
  onStartVisit
}) => {
  return (
    <div
      onClick={() => onViewDetails?.(doctor)}
      className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-600 transition-all space-y-3 cursor-pointer"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center space-x-3">
          <img
            src={doctor.avatar}
            alt={doctor.name}
            className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-100 dark:ring-slate-800"
          />
          <div>
            <div className="flex items-center space-x-1.5">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">{doctor.name}</h3>
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${getDoctorClassBadgeClass(doctor.doctorClass)}`}>
                {doctor.doctorClass}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{doctor.specialty} • {doctor.hospital}</p>
          </div>
        </div>
      </div>

      <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
        <div className="flex items-center space-x-1 text-[11px]">
          <MapPin className="w-3.5 h-3.5 text-slate-400" />
          <span className="truncate">{doctor.clinicAddress}</span>
        </div>
        <div className="flex items-center justify-between text-[11px] pt-1">
          <span className="flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Prefers: {doctor.preferredVisitTime}</span>
          </span>
          <span className="font-semibold text-indigo-600 dark:text-indigo-400">
            Last Visit: {doctor.lastVisitDate}
          </span>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2" onClick={e => e.stopPropagation()}>
        <div className="flex items-center space-x-1.5 overflow-x-auto">
          {onViewDetails && (
            <button
              onClick={() => onViewDetails(doctor)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors"
            >
              Details
            </button>
          )}
          {onPrep && (
            <button
              onClick={() => onPrep(doctor)}
              className="px-2.5 py-1.5 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 hover:bg-indigo-200 dark:hover:bg-indigo-900 text-indigo-900 dark:text-indigo-300 text-xs font-extrabold flex items-center space-x-1 border border-indigo-200 dark:border-indigo-800 shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-700 dark:text-indigo-400 fill-indigo-700 dark:fill-indigo-400" />
              <span>Prep</span>
            </button>
          )}
          {onCoach && (
            <button
              onClick={() => onCoach(doctor)}
              className="px-2.5 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-950/80 hover:bg-amber-200 dark:hover:bg-amber-900 text-amber-900 dark:text-amber-300 text-xs font-extrabold flex items-center space-x-1 border border-amber-200 dark:border-amber-800 shrink-0"
            >
              <Zap className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400 fill-amber-700 dark:fill-amber-400" />
              <span>Coach</span>
            </button>
          )}
        </div>

        {onStartVisit && (
          <button
            onClick={() => onStartVisit(doctor)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm flex items-center space-x-1 shrink-0"
          >
            <span>Start Visit</span>
          </button>
        )}
      </div>
    </div>
  );
});

DoctorCard.displayName = 'DoctorCard';
