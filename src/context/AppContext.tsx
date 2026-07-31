import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Doctor,
  Product,
  Visit,
  RouteStop,
  DoctorAlert,
  NextBestAction,
  RepProfile,
  AiMorningBriefData,
  TabType,
  Campaign,
  SmartCalendarEvent,
  SmartNotification,
  SalesIntelligenceData
} from '../types';
import { CentralAiEngine, CentralAiState, VisitScoreResult } from '../ai';
import {
  dbGetDoctors,
  dbCreateDoctor,
  dbUpdateDoctor,
  dbDeleteDoctor,
  dbGetVisits,
  dbCreateVisit,
  dbUpdateVisit,
  dbDeleteVisit,
  dbGetProducts,
  dbCreateProduct,
  dbUpdateProduct,
  dbDeleteProduct,
  dbGetRepProfile,
  dbUpdateRepProfile,
  dbGetRouteStops,
  dbSetRouteStops,
  dbGetDoctorAlerts,
  dbGetNextBestActions,
  dbGetCampaigns,
  dbCreateCampaign,
  dbUpdateCampaign,
  dbGetCalendarEvents,
  dbCreateCalendarEvent,
  dbUpdateCalendarEvent,
  dbDeleteCalendarEvent,
  dbGetNotifications,
  dbMarkNotificationAsRead,
  dbCreateNotification,
  dbGetSalesIntelligence,
  subscribeToDb,
  dbResetToDefaults
} from '../lib/db';

export type { TabType };

interface AppContextType {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isMobileFrame: boolean;
  setIsMobileFrame: (val: boolean | ((prev: boolean) => boolean)) => void;
  doctors: Doctor[];
  visits: Visit[];
  products: Product[];
  routeStops: RouteStop[];
  alerts: DoctorAlert[];
  nextBestActions: NextBestAction[];
  campaigns: Campaign[];
  calendarEvents: SmartCalendarEvent[];
  notifications: SmartNotification[];
  salesIntelligence: SalesIntelligenceData;
  repProfile: RepProfile;

  selectedDoctorForModal: Doctor | null;
  setSelectedDoctorForModal: (doc: Doctor | null) => void;
  selectedDoctorForVisit: Doctor | null;
  setSelectedDoctorForVisit: (doc: Doctor | null) => void;
  prepDoctorModalTarget: Doctor | null;
  setPrepDoctorModalTarget: (doc: Doctor | null) => void;

  isVoiceAssistantOpen: boolean;
  setIsVoiceAssistantOpen: (open: boolean) => void;

  morningBrief: AiMorningBriefData | null;
  isLoadingBrief: boolean;
  fetchMorningBrief: () => Promise<void>;

  // CRUD Operations
  addDoctor: (docData: Omit<Doctor, 'id'> & { id?: string }) => Doctor;
  updateDoctor: (doc: Doctor) => void;
  deleteDoctor: (id: string) => boolean;

  addVisit: (newVisit: Visit) => void;
  updateVisit: (visit: Visit) => void;
  deleteVisit: (id: string) => boolean;

  addProduct: (productData: Omit<Product, 'id'> & { id?: string }) => Product;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => boolean;

  addCampaign: (campData: Omit<Campaign, 'id'> & { id?: string }) => Campaign;
  updateCampaign: (campaign: Campaign) => void;

  addCalendarEvent: (evtData: Omit<SmartCalendarEvent, 'id'> & { id?: string }) => SmartCalendarEvent;
  updateCalendarEvent: (evt: SmartCalendarEvent) => void;
  deleteCalendarEvent: (id: string) => boolean;

  markNotificationAsRead: (id: string) => void;
  addNotification: (notifData: Omit<SmartNotification, 'id'> & { id?: string }) => SmartNotification;

  updateRepProfile: (updates: Partial<RepProfile>) => void;
  resetDbToDefaults: () => void;

  reorderRoute: (stops: RouteStop[]) => void;
  optimizeRouteWithAi: () => Promise<void>;
  notificationCount: number;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  quickNavigateToRecordVisitWithDoctor: (doc: Doctor) => void;

  aiState: CentralAiState;
  scoreVisit: (visit: Partial<Visit>) => VisitScoreResult;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(true);

  // DB Synced State
  const [doctors, setDoctors] = useState<Doctor[]>(() => dbGetDoctors());
  const [visits, setVisits] = useState<Visit[]>(() => dbGetVisits());
  const [products, setProducts] = useState<Product[]>(() => dbGetProducts());
  const [repProfile, setRepProfileState] = useState<RepProfile>(() => dbGetRepProfile());
  const [routeStops, setRouteStopsState] = useState<RouteStop[]>(() => dbGetRouteStops());
  const [alerts, setAlerts] = useState<DoctorAlert[]>(() => dbGetDoctorAlerts());
  const [nextBestActions, setNextBestActions] = useState<NextBestAction[]>(() => dbGetNextBestActions());
  const [campaigns, setCampaigns] = useState<Campaign[]>(() => dbGetCampaigns());
  const [calendarEvents, setCalendarEvents] = useState<SmartCalendarEvent[]>(() => dbGetCalendarEvents());
  const [notifications, setNotifications] = useState<SmartNotification[]>(() => dbGetNotifications());
  const [salesIntelligence, setSalesIntelligence] = useState<SalesIntelligenceData>(() => dbGetSalesIntelligence());

  const [selectedDoctorForModal, setSelectedDoctorForModal] = useState<Doctor | null>(null);
  const [selectedDoctorForVisit, setSelectedDoctorForVisit] = useState<Doctor | null>(null);
  const [prepDoctorModalTarget, setPrepDoctorModalTarget] = useState<Doctor | null>(null);
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState<boolean>(false);

  const [morningBrief, setMorningBrief] = useState<AiMorningBriefData | null>(null);
  const [isLoadingBrief, setIsLoadingBrief] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Synchronize state with local database changes automatically
  const reloadFromDb = useCallback(() => {
    setDoctors(dbGetDoctors());
    setVisits(dbGetVisits());
    setProducts(dbGetProducts());
    setRepProfileState(dbGetRepProfile());
    setRouteStopsState(dbGetRouteStops());
    setAlerts(dbGetDoctorAlerts());
    setNextBestActions(dbGetNextBestActions());
    setCampaigns(dbGetCampaigns());
    setCalendarEvents(dbGetCalendarEvents());
    setNotifications(dbGetNotifications());
    setSalesIntelligence(dbGetSalesIntelligence());
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToDb(() => {
      reloadFromDb();
    });
    return unsubscribe;
  }, [reloadFromDb]);

  const notificationCount = notifications.filter(n => !n.isRead && n.urgency === 'High').length;

  const fetchMorningBrief = async () => {
    setIsLoadingBrief(true);
    try {
      const res = await fetch('/api/ai/morning-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repName: repProfile.name,
          doctors: doctors.slice(0, 3).map(d => ({ name: d.name, specialty: d.specialty, class: d.doctorClass, lastVisit: d.lastVisitDate })),
          alerts: alerts.slice(0, 2).map(a => a.message)
        })
      });
      const data = await res.json();
      if (data.brief) {
        setMorningBrief(data.brief);
      }
    } catch (err) {
      console.error('Failed to fetch morning brief:', err);
    } finally {
      setIsLoadingBrief(false);
    }
  };

  useEffect(() => {
    fetchMorningBrief();
  }, []);

  // Doctor CRUD
  const addDoctor = (docData: Omit<Doctor, 'id'> & { id?: string }) => {
    const created = dbCreateDoctor(docData);
    reloadFromDb();
    return created;
  };

  const updateDoctor = (doc: Doctor) => {
    dbUpdateDoctor(doc);
    reloadFromDb();
    if (selectedDoctorForModal?.id === doc.id) {
      setSelectedDoctorForModal(doc);
    }
  };

  const deleteDoctor = (id: string) => {
    const success = dbDeleteDoctor(id);
    reloadFromDb();
    if (selectedDoctorForModal?.id === id) {
      setSelectedDoctorForModal(null);
    }
    return success;
  };

  // Visit CRUD
  const addVisit = (newVisit: Visit) => {
    dbCreateVisit(newVisit);
    reloadFromDb();
  };

  const updateVisit = (updatedVisit: Visit) => {
    dbUpdateVisit(updatedVisit);
    reloadFromDb();
  };

  const deleteVisit = (id: string) => {
    const res = dbDeleteVisit(id);
    reloadFromDb();
    return res;
  };

  // Product CRUD
  const addProduct = (productData: Omit<Product, 'id'> & { id?: string }) => {
    const created = dbCreateProduct(productData);
    reloadFromDb();
    return created;
  };

  const updateProduct = (product: Product) => {
    dbUpdateProduct(product);
    reloadFromDb();
  };

  const deleteProduct = (id: string) => {
    const res = dbDeleteProduct(id);
    reloadFromDb();
    return res;
  };

  // Campaign CRUD
  const addCampaign = (campData: Omit<Campaign, 'id'> & { id?: string }) => {
    const created = dbCreateCampaign(campData);
    reloadFromDb();
    return created;
  };

  const updateCampaign = (campaign: Campaign) => {
    dbUpdateCampaign(campaign);
    reloadFromDb();
  };

  // Calendar Event CRUD
  const addCalendarEvent = (evtData: Omit<SmartCalendarEvent, 'id'> & { id?: string }) => {
    const created = dbCreateCalendarEvent(evtData);
    reloadFromDb();
    return created;
  };

  const updateCalendarEvent = (evt: SmartCalendarEvent) => {
    dbUpdateCalendarEvent(evt);
    reloadFromDb();
  };

  const deleteCalendarEvent = (id: string) => {
    const res = dbDeleteCalendarEvent(id);
    reloadFromDb();
    return res;
  };

  // Notification CRUD
  const markNotificationAsRead = (id: string) => {
    dbMarkNotificationAsRead(id);
    reloadFromDb();
  };

  const addNotification = (notifData: Omit<SmartNotification, 'id'> & { id?: string }) => {
    const created = dbCreateNotification(notifData);
    reloadFromDb();
    return created;
  };

  // Rep Profile CRUD
  const updateRepProfile = (updates: Partial<RepProfile>) => {
    dbUpdateRepProfile(updates);
    reloadFromDb();
  };

  const resetDbToDefaults = () => {
    dbResetToDefaults();
    reloadFromDb();
  };

  const reorderRoute = (newRoute: RouteStop[]) => {
    const updated = newRoute.map((stop, idx) => ({ ...stop, stopOrder: idx + 1 }));
    dbSetRouteStops(updated);
    reloadFromDb();
  };

  const optimizeRouteWithAi = async () => {
    const sorted = [...routeStops].sort((a, b) => {
      if (a.status === 'Visited' && b.status !== 'Visited') return 1;
      if (a.status !== 'Visited' && b.status === 'Visited') return -1;
      if (a.priorityReason.includes('CRITICAL') && !b.priorityReason.includes('CRITICAL')) return -1;
      return a.distanceKm - b.distanceKm;
    });
    reorderRoute(sorted);
  };

  const quickNavigateToRecordVisitWithDoctor = (doc: Doctor) => {
    setSelectedDoctorForVisit(doc);
    setActiveTab('record-visit');
  };

  // Central AI Intelligence Auto-Calculation
  const aiState: CentralAiState = CentralAiEngine.computeFullIntelligence(
    doctors,
    visits,
    alerts,
    campaigns,
    products,
    repProfile
  );

  const scoreVisit = (visit: Partial<Visit>): VisitScoreResult => {
    return CentralAiEngine.scoreVisit(visit);
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        isMobileFrame,
        setIsMobileFrame,
        doctors,
        visits,
        products,
        routeStops,
        alerts,
        nextBestActions,
        campaigns,
        calendarEvents,
        notifications,
        salesIntelligence,
        repProfile,

        selectedDoctorForModal,
        setSelectedDoctorForModal,
        selectedDoctorForVisit,
        setSelectedDoctorForVisit,
        prepDoctorModalTarget,
        setPrepDoctorModalTarget,

        isVoiceAssistantOpen,
        setIsVoiceAssistantOpen,

        morningBrief,
        isLoadingBrief,
        fetchMorningBrief,

        addDoctor,
        updateDoctor,
        deleteDoctor,

        addVisit,
        updateVisit,
        deleteVisit,

        addProduct,
        updateProduct,
        deleteProduct,

        addCampaign,
        updateCampaign,

        addCalendarEvent,
        updateCalendarEvent,
        deleteCalendarEvent,

        markNotificationAsRead,
        addNotification,

        updateRepProfile,
        resetDbToDefaults,

        reorderRoute,
        optimizeRouteWithAi,
        notificationCount,
        searchQuery,
        setSearchQuery,
        quickNavigateToRecordVisitWithDoctor,

        aiState,
        scoreVisit,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
