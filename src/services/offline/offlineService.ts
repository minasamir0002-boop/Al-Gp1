/**
 * Offline Mode Service
 * Monitors browser network state and manages offline queue & offline indicators.
 */

export class OfflineService {
  private isOnline: boolean = typeof navigator !== 'undefined' ? navigator.onLine : true;
  private listeners: Array<(online: boolean) => void> = [];

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.setOnlineState(true));
      window.addEventListener('offline', () => this.setOnlineState(false));
    }
  }

  private setOnlineState(online: boolean) {
    this.isOnline = online;
    this.listeners.forEach(fn => fn(online));
  }

  public getIsOnline(): boolean {
    return this.isOnline;
  }

  public subscribe(listener: (online: boolean) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
}

export const offlineService = new OfflineService();
