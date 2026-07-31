/**
 * Notification Service Layer
 * Controls urgent medical alert triggers, badges, and read status management.
 */

import { notificationRepository } from '../../database';
import { SmartNotification } from '../../models';

export class NotificationService {
  public getAllAlerts(): SmartNotification[] {
    return notificationRepository.getAll();
  }

  public getUnreadCount(): number {
    return notificationRepository.getUnread().length;
  }

  public markRead(id: string): void {
    notificationRepository.markAsRead(id);
  }
}

export const notificationService = new NotificationService();
