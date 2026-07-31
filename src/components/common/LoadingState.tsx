/**
 * Reusable Loading State Component
 * Displayed during asynchronous data fetching, AI Dossier generation, or sync routines.
 */

import React from 'react';

interface LoadingStateProps {
  message?: string;
  subtext?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = React.memo(({
  message = 'Loading RepOS Intelligence...',
  subtext = 'Fetching territory records & AI insights'
}) => {
  return (
    <div className="py-16 text-center space-y-3">
      <div className="w-10 h-10 border-3 border-indigo-600 dark:border-indigo-400 border-t-transparent rounded-full animate-spin mx-auto" />
      <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">{message}</h3>
      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{subtext}</p>
    </div>
  );
});

LoadingState.displayName = 'LoadingState';
