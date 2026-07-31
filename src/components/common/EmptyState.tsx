/**
 * Reusable Empty State Component
 * Standard placeholder UI when search or list filters return empty results.
 */

import React from 'react';
import { Inbox, Plus } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  message?: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = React.memo(({
  title = 'No Records Found',
  message = 'There are no items matching your current filters or search query.',
  actionText,
  onAction,
  icon
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-3">
      {icon || <Inbox className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />}
      <div>
        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">{title}</h3>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">{message}</p>
      </div>

      {actionText && onAction && (
        <button
          onClick={onAction}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-sm inline-flex items-center space-x-1.5 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{actionText}</span>
        </button>
      )}
    </div>
  );
});

EmptyState.displayName = 'EmptyState';
