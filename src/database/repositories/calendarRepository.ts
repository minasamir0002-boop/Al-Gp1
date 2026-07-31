/**
 * Calendar Repository
 * Repository pattern implementation for Smart Calendar events.
 */

import { SmartCalendarEvent } from '../../models';
import { dbGetCalendarEvents, dbCreateCalendarEvent, dbUpdateCalendarEvent, dbDeleteCalendarEvent } from '../../lib/db';
import { firebaseSyncAdapter } from '../sync/firebaseSyncAdapter';

export class CalendarRepository {
  public getAll(): SmartCalendarEvent[] {
    return dbGetCalendarEvents();
  }

  public create(event: Omit<SmartCalendarEvent, 'id'>): SmartCalendarEvent {
    const created = dbCreateCalendarEvent(event);
    firebaseSyncAdapter.enqueueForSync(created);
    return created;
  }

  public update(event: SmartCalendarEvent): SmartCalendarEvent {
    dbUpdateCalendarEvent(event);
    firebaseSyncAdapter.enqueueForSync(event);
    return event;
  }

  public delete(id: string): void {
    dbDeleteCalendarEvent(id);
  }
}

export const calendarRepository = new CalendarRepository();
