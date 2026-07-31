/**
 * Reusable Error State Component
 * Handles exception feedback, offline data errors, and retry actions.
 */

import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = React.memo(({
  title = 'An Error Occurred',
  message = 'Failed to load record details. Please check connection and try again.',
  onRetry
}) => {
  return (
    <div className="bg-rose-50 dark:bg-rose-950/30 p-6 rounded-2xl border border-rose-200 dark:border-rose-900/50 text-center space-y-3 my-4">
      <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
      <div>
        <h3 className="text-xs font-bold text-rose-900 dark:text-rose-300">{title}</h3>
        <p className="text-[11px] text-rose-700 dark:text-rose-400 mt-1">{message}</p>
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-sm inline-flex items-center space-x-1.5 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Operation</span>
        </button>
      )}
    </div>
  );
});

ErrorState.displayName = 'ErrorState';
