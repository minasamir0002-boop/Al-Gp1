/**
 * Unified Database Service Layer
 * Wraps repositories and local database service to provide a single interface for domain actions.
 */

import {
  doctorRepository,
  visitRepository,
  campaignRepository,
  calendarRepository,
  notificationRepository,
  productRepository
} from '../../database';
import { Doctor, Visit, Campaign, SmartCalendarEvent, SmartNotification, Product } from '../../models';

export class DatabaseService {
  // Doctors
  public getDoctors(): Doctor[] {
    return doctorRepository.getAll();
  }
  public saveDoctor(doctor: Doctor): Doctor {
    return doctor.createdAt ? doctorRepository.update(doctor) : doctorRepository.create(doctor);
  }
  public removeDoctor(id: string): void {
    doctorRepository.delete(id);
  }

  // Visits
  public getVisits(): Visit[] {
    return visitRepository.getAll();
  }
  public recordVisit(visit: Visit): Visit {
    return visitRepository.create(visit);
  }

  // Campaigns
  public getCampaigns(): Campaign[] {
    return campaignRepository.getAll();
  }
  public createCampaign(campaign: Omit<Campaign, 'id'>): Campaign {
    return campaignRepository.create(campaign);
  }

  // Calendar
  public getCalendarEvents(): SmartCalendarEvent[] {
    return calendarRepository.getAll();
  }
  public saveCalendarEvent(event: Omit<SmartCalendarEvent, 'id'>): SmartCalendarEvent {
    return calendarRepository.create(event);
  }
  public updateCalendarEvent(event: SmartCalendarEvent): SmartCalendarEvent {
    return calendarRepository.update(event);
  }
  public deleteCalendarEvent(id: string): void {
    calendarRepository.delete(id);
  }

  // Notifications
  public getNotifications(): SmartNotification[] {
    return notificationRepository.getAll();
  }
  public markNotificationAsRead(id: string): void {
    notificationRepository.markAsRead(id);
  }

  // Products
  public getProducts(): Product[] {
    return productRepository.getAll();
  }
}

export const databaseService = new DatabaseService();
