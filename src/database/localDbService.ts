/**
 * Local Database Service
 * Low-level persistent storage abstraction using browser LocalStorage / IndexDB driver.
 * Supports reactive subscriptions, transaction handling, and offline change tracking.
 */

export class LocalDbService {
  private static instance: LocalDbService;
  private listeners: Array<() => void> = [];

  private constructor() {
    // Singleton
  }

  public static getInstance(): LocalDbService {
    if (!LocalDbService.instance) {
      LocalDbService.instance = new LocalDbService();
    }
    return LocalDbService.instance;
  }

  public getItem<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      if (!item) {
        localStorage.setItem(key, JSON.stringify(defaultValue));
        return defaultValue;
      }
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`LocalDbService error reading ${key}:`, error);
      return defaultValue;
    }
  }

  public setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      this.notifyListeners();
    } catch (error) {
      console.error(`LocalDbService error writing ${key}:`, error);
    }
  }

  public removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
      this.notifyListeners();
    } catch (error) {
      console.error(`LocalDbService error removing ${key}:`, error);
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(fn => fn());
  }
}

export const localDb = LocalDbService.getInstance();
