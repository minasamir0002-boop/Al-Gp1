/**
 * Offline Status Hook
 * Provides real-time network connectivity status.
 */

import { useState, useEffect } from 'react';
import { offlineService } from '../services';

export function useOfflineStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(offlineService.getIsOnline());

  useEffect(() => {
    const unsubscribe = offlineService.subscribe((online) => {
      setIsOnline(online);
    });
    return unsubscribe;
  }, []);

  return { isOnline, isOffline: !isOnline };
}
