/**
 * Reusable Alert Card Component
 * Highlights clinical risk warnings, competitor alerts, and coverage drop notifications.
 */

import React from 'react';
import { SmartNotification } from '../../models';
import { getUrgencyBadgeClass } from '../../utils/formatters';
import { Bell, ArrowRight, Check } from 'lucide-react';

interface AlertCardProps {
  notification: SmartNotification;
  onResolve?: (notif: SmartNotification) => void;
  onMarkRead?: (id: string) => void;
}

export const AlertCard: React.FC<AlertCardProps> = React.memo(({
  notification,
  onResolve,
  onMarkRead
}) => {
  return (
    <div
      className={`p-4 rounded-2xl border transition-all ${
        !notification.isRead
          ? 'bg-white dark:bg-slate-900 border-indigo-200 dark:border-indigo-800 shadow-md ring-1 ring-indigo-100 dark:ring-indigo-900/50'
          : 'bg-slate-50/80 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-80'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className={`w-2.5 h-2.5 rounded-full ${
            notification.urgency === 'High' ? 'bg-rose-500 animate-pulse' : notification.urgency === 'Medium' ? 'bg-amber-500' : 'bg-blue-500'
          }`} />
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{notification.category}</span>
        </div>
        <span className="text-[10px] text-slate-400 font-medium">{notification.date}</span>
      </div>

      <h3 className="font-bold text-slate-800 dark:text-white text-sm mb-1">{notification.title}</h3>
      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">{notification.message}</p>

      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
        {!notification.isRead && onMarkRead ? (
          <button
            onClick={() => onMarkRead(notification.id)}
            className="text-[11px] text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium flex items-center space-x-1"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Mark as Read</span>
          </button>
        ) : (
          <span className="text-[10px] text-slate-400">Read</span>
        )}

        {onResolve && (
          <button
            onClick={() => onResolve(notification)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm flex items-center space-x-1 transition-colors"
          >
            <span>Execute Action</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
});

AlertCard.displayName = 'AlertCard';
