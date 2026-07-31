/**
 * Notification Repository
 * Repository pattern implementation for Smart Notifications.
 */

import { SmartNotification } from '../../models';
import { dbGetNotifications, dbMarkNotificationAsRead } from '../../lib/db';

export class NotificationRepository {
  public getAll(): SmartNotification[] {
    return dbGetNotifications();
  }

  public getUnread(): SmartNotification[] {
    return dbGetNotifications().filter(n => !n.isRead);
  }

  public markAsRead(id: string): void {
    dbMarkNotificationAsRead(id);
  }
}

export const notificationRepository = new NotificationRepository();
