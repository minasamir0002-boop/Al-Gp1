/**
 * Reusable KPI Card Component
 * Displays territory metrics, progress bars, and high-impact key statistics.
 */

import React from 'react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: { value: string; isPositive: boolean };
  progress?: number;
  badge?: string;
  onClick?: () => void;
}

export const KPICard: React.FC<KPICardProps> = React.memo(({
  title,
  value,
  subtitle,
  icon,
  trend,
  progress,
  badge,
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2 transition-all ${
        onClick ? 'hover:border-indigo-300 dark:hover:border-indigo-600 cursor-pointer' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{title}</span>
        {icon && <div className="p-2 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-xl">{icon}</div>}
      </div>

      <div className="flex items-baseline justify-between">
        <div className="text-2xl font-black text-slate-900 dark:text-white">{value}</div>
        {trend && (
          <span className={`text-xs font-bold ${trend.isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
            {trend.value}
          </span>
        )}
      </div>

      {progress !== undefined && (
        <div className="space-y-1 pt-1">
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 dark:bg-indigo-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        </div>
      )}

      {subtitle && <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{subtitle}</p>}
    </div>
  );
});

KPICard.displayName = 'KPICard';
