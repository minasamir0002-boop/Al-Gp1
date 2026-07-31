/**
 * Pull-To-Refresh Visual Indicator Component
 */

import React from 'react';
import { RefreshCw } from 'lucide-react';

interface PullToRefreshIndicatorProps {
  isRefreshing: boolean;
  pullDistance: number;
}

export const PullToRefreshIndicator: React.FC<PullToRefreshIndicatorProps> = React.memo(({
  isRefreshing,
  pullDistance
}) => {
  if (pullDistance === 0 && !isRefreshing) return null;

  return (
    <div
      className="flex items-center justify-center py-2 transition-all duration-200 text-indigo-600 dark:text-indigo-400"
      style={{ height: `${Math.min(pullDistance, 50)}px` }}
    >
      <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
      <span className="text-xs font-bold ml-2">
        {isRefreshing ? 'Refreshing RepOS Sync...' : pullDistance > 60 ? 'Release to Refresh' : 'Pull down to refresh'}
      </span>
    </div>
  );
});

PullToRefreshIndicator.displayName = 'PullToRefreshIndicator';
