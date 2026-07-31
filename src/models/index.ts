/**
 * Architecture Model Exports
 * Clean type definitions and domain models for RepOS.
 * Prepared for cross-platform expansion (Web, Android, iOS).
 */

export * from '../types';

export interface SyncStatus {
  lastSyncedAt: string | null;
  pendingChangesCount: number;
  isSyncing: boolean;
  error: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface UserSession {
  userId: string;
  email: string;
  role: 'representative' | 'manager' | 'admin';
  isAuthenticated: boolean;
  token?: string;
}

export type ThemeMode = 'light' | 'dark' | 'system';
