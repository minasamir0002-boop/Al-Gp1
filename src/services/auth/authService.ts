/**
 * Authentication Service Layer
 * Service abstraction for sales representative profile & authentication tokens.
 * Pluggable for future Firebase Auth / OAuth integration.
 */

import { RepProfile, UserSession } from '../../models';
import { dbGetRepProfile, dbUpdateRepProfile } from '../../lib/db';

export class AuthService {
  private currentSession: UserSession = {
    userId: 'rep-001',
    email: 'm.samir@pharmacore.com',
    role: 'representative',
    isAuthenticated: true
  };

  public getCurrentSession(): UserSession {
    return this.currentSession;
  }

  public getProfile(): RepProfile {
    return dbGetRepProfile();
  }

  public updateProfile(profile: Partial<RepProfile>): void {
    dbUpdateRepProfile(profile);
  }

  public async logout(): Promise<void> {
    this.currentSession.isAuthenticated = false;
    console.log('[AuthService] User logged out.');
  }
}

export const authService = new AuthService();
