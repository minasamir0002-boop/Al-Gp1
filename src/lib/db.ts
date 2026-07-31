import { Doctor, Product, Visit, RepProfile, RouteStop, DoctorAlert, NextBestAction, Campaign, SmartCalendarEvent, SmartNotification, SalesIntelligenceData } from '../types';
import {
  INITIAL_REP_PROFILE,
  INITIAL_DOCTORS,
  INITIAL_PRODUCTS,
  INITIAL_VISITS,
  INITIAL_ROUTE,
  DOCTOR_ALERTS,
  NEXT_BEST_ACTIONS,
  INITIAL_CAMPAIGNS,
  INITIAL_CALENDAR_EVENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_SALES_INTELLIGENCE
} from '../data/mockData';

const DB_KEYS = {
  DOCTORS: 'repos_db_doctors_v2',
  VISITS: 'repos_db_visits_v2',
  PRODUCTS: 'repos_db_products_v2',
  PROFILE: 'repos_db_rep_profile_v2',
  ROUTE: 'repos_db_route_v2',
  ALERTS: 'repos_db_alerts_v2',
  ACTIONS: 'repos_db_actions_v2',
  CAMPAIGNS: 'repos_db_campaigns_v2',
  CALENDAR: 'repos_db_calendar_v2',
  NOTIFICATIONS: 'repos_db_notifications_v2',
  SALES_INTEL: 'repos_db_sales_intel_v2',
};

// Event emitter listener setup for reactive database updates across components
type DBListener = () => void;
const listeners: DBListener[] = [];

export const subscribeToDb = (listener: DBListener): (() => void) => {
  listeners.push(listener);
  return () => {
    const index = listeners.indexOf(listener);
    if (index > -1) listeners.splice(index, 1);
  };
};

const notifyListeners = () => {
  listeners.forEach(fn => fn());
};

// Internal localStorage helpers
function getStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return defaultValue;
  }
}

function setStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    notifyListeners();
  } catch (error) {
    console.error(`Error writing ${key} to localStorage:`, error);
  }
}

// Initialize default data if not present
export function initLocalDb(): void {
  if (!localStorage.getItem(DB_KEYS.DOCTORS)) {
    setStorage(DB_KEYS.DOCTORS, INITIAL_DOCTORS);
  }
  if (!localStorage.getItem(DB_KEYS.VISITS)) {
    setStorage(DB_KEYS.VISITS, INITIAL_VISITS);
  }
  if (!localStorage.getItem(DB_KEYS.PRODUCTS)) {
    setStorage(DB_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  }
  if (!localStorage.getItem(DB_KEYS.PROFILE)) {
    setStorage(DB_KEYS.PROFILE, {
      ...INITIAL_REP_PROFILE,
      callsTarget: 80,
      callsCompleted: 64,
      salesTarget: 120000,
      salesAchieved: 104500,
      performanceScore: 92,
      updatedAt: new Date().toISOString()
    });
  }
  if (!localStorage.getItem(DB_KEYS.ROUTE)) {
    setStorage(DB_KEYS.ROUTE, INITIAL_ROUTE);
  }
  if (!localStorage.getItem(DB_KEYS.ALERTS)) {
    setStorage(DB_KEYS.ALERTS, DOCTOR_ALERTS);
  }
  if (!localStorage.getItem(DB_KEYS.ACTIONS)) {
    setStorage(DB_KEYS.ACTIONS, NEXT_BEST_ACTIONS);
  }
  if (!localStorage.getItem(DB_KEYS.CAMPAIGNS)) {
    setStorage(DB_KEYS.CAMPAIGNS, INITIAL_CAMPAIGNS);
  }
  if (!localStorage.getItem(DB_KEYS.CALENDAR)) {
    setStorage(DB_KEYS.CALENDAR, INITIAL_CALENDAR_EVENTS);
  }
  if (!localStorage.getItem(DB_KEYS.NOTIFICATIONS)) {
    setStorage(DB_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  }
  if (!localStorage.getItem(DB_KEYS.SALES_INTEL)) {
    setStorage(DB_KEYS.SALES_INTEL, INITIAL_SALES_INTELLIGENCE);
  }
}

// Base DB operations
initLocalDb();

/* ==========================================================================
   DOCTORS CRUD
   ========================================================================== */
export const dbGetDoctors = (): Doctor[] => {
  return getStorage<Doctor[]>(DB_KEYS.DOCTORS, INITIAL_DOCTORS);
};

export const dbGetDoctorById = (id: string): Doctor | undefined => {
  return dbGetDoctors().find(d => d.id === id);
};

export const dbCreateDoctor = (doctorData: Omit<Doctor, 'id'> & { id?: string }): Doctor => {
  const doctors = dbGetDoctors();
  const now = new Date().toISOString();
  const newDoctor: Doctor = {
    ...doctorData,
    id: doctorData.id || `doc-${Date.now()}`,
    createdAt: now,
    updatedAt: now,
    syncStatus: 'pending',
    coverageStatus: doctorData.coverageStatus || 'Targeted',
    coordinate: doctorData.coordinate || { x: Math.floor(Math.random() * 80) + 10, y: Math.floor(Math.random() * 80) + 10 }
  };

  const updated = [newDoctor, ...doctors];
  setStorage(DB_KEYS.DOCTORS, updated);

  // Update rep profile total doctors count
  const profile = dbGetRepProfile();
  dbUpdateRepProfile({ doctorsInTerritory: updated.length });

  return newDoctor;
};

export const dbUpdateDoctor = (updatedDoctor: Doctor): Doctor => {
  const doctors = dbGetDoctors();
  const now = new Date().toISOString();
  const index = doctors.findIndex(d => d.id === updatedDoctor.id);

  const docToSave: Doctor = {
    ...updatedDoctor,
    updatedAt: now,
    syncStatus: 'pending'
  };

  if (index > -1) {
    doctors[index] = docToSave;
    setStorage(DB_KEYS.DOCTORS, doctors);
  } else {
    setStorage(DB_KEYS.DOCTORS, [docToSave, ...doctors]);
  }

  return docToSave;
};

export const dbDeleteDoctor = (id: string): boolean => {
  const doctors = dbGetDoctors();
  const filtered = doctors.filter(d => d.id !== id);
  if (filtered.length !== doctors.length) {
    setStorage(DB_KEYS.DOCTORS, filtered);

    // Update rep profile
    dbUpdateRepProfile({ doctorsInTerritory: filtered.length });
    return true;
  }
  return false;
};

/* ==========================================================================
   VISITS CRUD
   ========================================================================== */
export const dbGetVisits = (): Visit[] => {
  return getStorage<Visit[]>(DB_KEYS.VISITS, INITIAL_VISITS);
};

export const dbGetVisitById = (id: string): Visit | undefined => {
  return dbGetVisits().find(v => v.id === id);
};

export const dbCreateVisit = (visitData: Omit<Visit, 'id'> & { id?: string }): Visit => {
  const visits = dbGetVisits();
  const now = new Date().toISOString();
  const newVisit: Visit = {
    ...visitData,
    id: visitData.id || `vis-${Date.now()}`,
    createdAt: now,
    updatedAt: now,
    syncStatus: 'pending'
  };

  const updated = [newVisit, ...visits];
  setStorage(DB_KEYS.VISITS, updated);

  // Cascade updates to related entities (Doctor, RepProfile, RouteStops)
  const doctor = dbGetDoctorById(newVisit.doctorId);
  if (doctor) {
    const newTotalVisits = (doctor.totalVisitsThisMonth || 0) + 1;
    const combinedObjections = Array.from(new Set([...(doctor.activeObjections || []), ...(newVisit.objectionsCaptured || [])]));
    dbUpdateDoctor({
      ...doctor,
      lastVisitDate: newVisit.date || new Date().toISOString().split('T')[0],
      totalVisitsThisMonth: newTotalVisits,
      activeObjections: combinedObjections,
      sentiment: newVisit.productsDiscussed?.some(p => p.reaction === 'Positive') ? 'Advocate' : doctor.sentiment,
      coverageStatus: 'Covered'
    });
  }

  // Update Rep Profile KPIs
  const profile = dbGetRepProfile();
  const newCompleted = (profile.completedVisitsThisMonth || 0) + 1;
  const newCallsCompleted = (profile.callsCompleted || 0) + 1;
  const newCoverage = Math.min(100, Math.round((newCompleted / (profile.monthlyTargetVisits || 1)) * 100));

  dbUpdateRepProfile({
    completedVisitsThisMonth: newCompleted,
    callsCompleted: newCallsCompleted,
    coverageKpi: newCoverage
  });

  // Mark route stop as Visited if matching
  const routes = dbGetRouteStops();
  const updatedRoutes = routes.map(stop => stop.doctorId === newVisit.doctorId ? { ...stop, status: 'Visited' as const } : stop);
  setStorage(DB_KEYS.ROUTE, updatedRoutes);

  // Dismiss alert if matching
  const alerts = dbGetDoctorAlerts();
  const updatedAlerts = alerts.filter(a => a.doctorId !== newVisit.doctorId);
  setStorage(DB_KEYS.ALERTS, updatedAlerts);

  return newVisit;
};

export const dbUpdateVisit = (updatedVisit: Visit): Visit => {
  const visits = dbGetVisits();
  const now = new Date().toISOString();
  const index = visits.findIndex(v => v.id === updatedVisit.id);

  const visitToSave: Visit = {
    ...updatedVisit,
    updatedAt: now,
    syncStatus: 'pending'
  };

  if (index > -1) {
    visits[index] = visitToSave;
    setStorage(DB_KEYS.VISITS, visits);
  } else {
    setStorage(DB_KEYS.VISITS, [visitToSave, ...visits]);
  }

  return visitToSave;
};

export const dbDeleteVisit = (id: string): boolean => {
  const visits = dbGetVisits();
  const filtered = visits.filter(v => v.id !== id);
  if (filtered.length !== visits.length) {
    setStorage(DB_KEYS.VISITS, filtered);
    return true;
  }
  return false;
};

/* ==========================================================================
   PRODUCTS CRUD
   ========================================================================== */
export const dbGetProducts = (): Product[] => {
  return getStorage<Product[]>(DB_KEYS.PRODUCTS, INITIAL_PRODUCTS);
};

export const dbGetProductById = (id: string): Product | undefined => {
  return dbGetProducts().find(p => p.id === id);
};

export const dbCreateProduct = (productData: Omit<Product, 'id'> & { id?: string }): Product => {
  const products = dbGetProducts();
  const now = new Date().toISOString();
  const newProduct: Product = {
    ...productData,
    id: productData.id || `prod-${Date.now()}`,
    brand: productData.brand || productData.name,
    createdAt: now,
    updatedAt: now,
    syncStatus: 'pending'
  };

  const updated = [newProduct, ...products];
  setStorage(DB_KEYS.PRODUCTS, updated);
  return newProduct;
};

export const dbUpdateProduct = (updatedProduct: Product): Product => {
  const products = dbGetProducts();
  const now = new Date().toISOString();
  const index = products.findIndex(p => p.id === updatedProduct.id);

  const productToSave: Product = {
    ...updatedProduct,
    updatedAt: now,
    syncStatus: 'pending'
  };

  if (index > -1) {
    products[index] = productToSave;
    setStorage(DB_KEYS.PRODUCTS, products);
  } else {
    setStorage(DB_KEYS.PRODUCTS, [productToSave, ...products]);
  }

  return productToSave;
};

export const dbDeleteProduct = (id: string): boolean => {
  const products = dbGetProducts();
  const filtered = products.filter(p => p.id !== id);
  if (filtered.length !== products.length) {
    setStorage(DB_KEYS.PRODUCTS, filtered);
    return true;
  }
  return false;
};

/* ==========================================================================
   REPRESENTATIVE PROFILE CRUD
   ========================================================================== */
export const dbGetRepProfile = (): RepProfile => {
  return getStorage<RepProfile>(DB_KEYS.PROFILE, INITIAL_REP_PROFILE);
};

export const dbUpdateRepProfile = (updates: Partial<RepProfile>): RepProfile => {
  const current = dbGetRepProfile();
  const updatedProfile: RepProfile = {
    ...current,
    ...updates,
    updatedAt: new Date().toISOString(),
    syncStatus: 'pending'
  };
  setStorage(DB_KEYS.PROFILE, updatedProfile);
  return updatedProfile;
};

/* ==========================================================================
   AUXILIARY ENTITIES (RouteStops, Alerts, Actions)
   ========================================================================== */
export const dbGetRouteStops = (): RouteStop[] => {
  return getStorage<RouteStop[]>(DB_KEYS.ROUTE, INITIAL_ROUTE);
};

export const dbSetRouteStops = (stops: RouteStop[]): void => {
  setStorage(DB_KEYS.ROUTE, stops);
};

export const dbGetDoctorAlerts = (): DoctorAlert[] => {
  return getStorage<DoctorAlert[]>(DB_KEYS.ALERTS, DOCTOR_ALERTS);
};

export const dbGetNextBestActions = (): NextBestAction[] => {
  return getStorage<NextBestAction[]>(DB_KEYS.ACTIONS, NEXT_BEST_ACTIONS);
};

/* ==========================================================================
   CAMPAIGNS CRUD
   ========================================================================== */
export const dbGetCampaigns = (): Campaign[] => {
  return getStorage<Campaign[]>(DB_KEYS.CAMPAIGNS, INITIAL_CAMPAIGNS);
};

export const dbCreateCampaign = (campData: Omit<Campaign, 'id'> & { id?: string }): Campaign => {
  const campaigns = dbGetCampaigns();
  const newCamp: Campaign = {
    ...campData,
    id: campData.id || `camp-${Date.now()}`
  };
  const updated = [newCamp, ...campaigns];
  setStorage(DB_KEYS.CAMPAIGNS, updated);
  return newCamp;
};

export const dbUpdateCampaign = (updatedCamp: Campaign): Campaign => {
  const campaigns = dbGetCampaigns();
  const idx = campaigns.findIndex(c => c.id === updatedCamp.id);
  if (idx > -1) {
    campaigns[idx] = updatedCamp;
    setStorage(DB_KEYS.CAMPAIGNS, campaigns);
  }
  return updatedCamp;
};

/* ==========================================================================
   SMART CALENDAR EVENTS CRUD
   ========================================================================== */
export const dbGetCalendarEvents = (): SmartCalendarEvent[] => {
  return getStorage<SmartCalendarEvent[]>(DB_KEYS.CALENDAR, INITIAL_CALENDAR_EVENTS);
};

export const dbCreateCalendarEvent = (evtData: Omit<SmartCalendarEvent, 'id'> & { id?: string }): SmartCalendarEvent => {
  const events = dbGetCalendarEvents();
  const newEvt: SmartCalendarEvent = {
    ...evtData,
    id: evtData.id || `evt-${Date.now()}`
  };
  const updated = [...events, newEvt];
  setStorage(DB_KEYS.CALENDAR, updated);
  return newEvt;
};

export const dbUpdateCalendarEvent = (updatedEvt: SmartCalendarEvent): SmartCalendarEvent => {
  const events = dbGetCalendarEvents();
  const idx = events.findIndex(e => e.id === updatedEvt.id);
  if (idx > -1) {
    events[idx] = updatedEvt;
    setStorage(DB_KEYS.CALENDAR, events);
  }
  return updatedEvt;
};

export const dbDeleteCalendarEvent = (id: string): boolean => {
  const events = dbGetCalendarEvents();
  const filtered = events.filter(e => e.id !== id);
  if (filtered.length !== events.length) {
    setStorage(DB_KEYS.CALENDAR, filtered);
    return true;
  }
  return false;
};

/* ==========================================================================
   SMART NOTIFICATIONS CRUD
   ========================================================================== */
export const dbGetNotifications = (): SmartNotification[] => {
  return getStorage<SmartNotification[]>(DB_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
};

export const dbMarkNotificationAsRead = (id: string): void => {
  const notifs = dbGetNotifications();
  const updated = notifs.map(n => n.id === id ? { ...n, isRead: true } : n);
  setStorage(DB_KEYS.NOTIFICATIONS, updated);
};

export const dbCreateNotification = (notifData: Omit<SmartNotification, 'id'> & { id?: string }): SmartNotification => {
  const notifs = dbGetNotifications();
  const newNotif: SmartNotification = {
    ...notifData,
    id: notifData.id || `notif-${Date.now()}`
  };
  const updated = [newNotif, ...notifs];
  setStorage(DB_KEYS.NOTIFICATIONS, updated);
  return newNotif;
};

/* ==========================================================================
   SALES INTELLIGENCE CRUD
   ========================================================================== */
export const dbGetSalesIntelligence = (): SalesIntelligenceData => {
  return getStorage<SalesIntelligenceData>(DB_KEYS.SALES_INTEL, INITIAL_SALES_INTELLIGENCE);
};

/* ==========================================================================
   SEARCH & FILTER UTILITIES
   ========================================================================== */
export const dbSearchAll = (query: string) => {
  const q = query.trim().toLowerCase();
  if (!q) {
    return {
      doctors: dbGetDoctors(),
      visits: dbGetVisits(),
      products: dbGetProducts()
    };
  }

  const doctors = dbGetDoctors().filter(
    d =>
      d.name.toLowerCase().includes(q) ||
      d.specialty.toLowerCase().includes(q) ||
      d.hospital.toLowerCase().includes(q) ||
      d.territory.toLowerCase().includes(q) ||
      d.promotedProducts.some(p => p.toLowerCase().includes(q))
  );

  const visits = dbGetVisits().filter(
    v =>
      v.doctorName.toLowerCase().includes(q) ||
      v.doctorSpecialty.toLowerCase().includes(q) ||
      v.notes.toLowerCase().includes(q) ||
      v.aiSummary.toLowerCase().includes(q) ||
      v.productsDiscussed.some(p => p.productName.toLowerCase().includes(q))
  );

  const products = dbGetProducts().filter(
    p =>
      p.name.toLowerCase().includes(q) ||
      p.genericName.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.indications.some(i => i.toLowerCase().includes(q))
  );

  return { doctors, visits, products };
};

/* ==========================================================================
   FIREBASE / REMOTE SYNC ARCHITECTURE HOOK
   ========================================================================== */
export const dbExportDatabaseJSON = (): string => {
  return JSON.stringify({
    doctors: dbGetDoctors(),
    visits: dbGetVisits(),
    products: dbGetProducts(),
    profile: dbGetRepProfile(),
    routes: dbGetRouteStops(),
    alerts: dbGetDoctorAlerts(),
    actions: dbGetNextBestActions(),
    campaigns: dbGetCampaigns(),
    calendarEvents: dbGetCalendarEvents(),
    notifications: dbGetNotifications(),
    salesIntelligence: dbGetSalesIntelligence(),
    exportedAt: new Date().toISOString()
  }, null, 2);
};

export const dbResetToDefaults = (): void => {
  localStorage.removeItem(DB_KEYS.DOCTORS);
  localStorage.removeItem(DB_KEYS.VISITS);
  localStorage.removeItem(DB_KEYS.PRODUCTS);
  localStorage.removeItem(DB_KEYS.PROFILE);
  localStorage.removeItem(DB_KEYS.ROUTE);
  localStorage.removeItem(DB_KEYS.ALERTS);
  localStorage.removeItem(DB_KEYS.ACTIONS);
  localStorage.removeItem(DB_KEYS.CAMPAIGNS);
  localStorage.removeItem(DB_KEYS.CALENDAR);
  localStorage.removeItem(DB_KEYS.NOTIFICATIONS);
  localStorage.removeItem(DB_KEYS.SALES_INTEL);
  initLocalDb();
  notifyListeners();
};
