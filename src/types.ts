export type Specialty = 'Cardiology' | 'Endocrinology' | 'Neurology' | 'Pulmonology' | 'Gastroenterology' | 'Oncology' | 'General Practice';
export type DoctorClass = 'Class A' | 'Class B' | 'Class C';
export type Territory = 'Central District' | 'North Sector' | 'South Bay' | 'Metro West';

export type TabType = 
  | 'splash'
  | 'login'
  | 'home'
  | 'dashboard'
  | 'doctors'
  | 'doctor-profile'
  | 'visit-brief'
  | 'end-visit'
  | 'record-visit'
  | 'visits'
  | 'knowledge'
  | 'objections'
  | 'settings'
  | 'profile'
  | 'analytics'
  | 'intelligence'
  | 'calendar'
  | 'notifications'
  | 'campaigns';

export interface Campaign {
  id: string;
  name: string;
  brand: string;
  targetSpecialty: Specialty | 'All Specialties';
  targetDoctorClass: DoctorClass | 'All Classes';
  targetCount: number;
  completedVisits: number;
  startDate: string;
  endDate: string;
  productsIncluded: string[];
  doctorsIncludedIds: string[];
  status: 'Active' | 'Completed' | 'Upcoming';
  aiRecommendation: string;
  effectivenessScore: number;
  prescriptionImpact: string;
}

export interface SmartCalendarEvent {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: Specialty;
  hospital: string;
  territory: Territory;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "10:00 AM"
  type: 'In-Person' | 'Virtual' | 'Group CADD';
  status: 'Scheduled' | 'Completed' | 'Rescheduled' | 'Cancelled';
  notes?: string;
  reminderSet: boolean;
}

export interface SmartNotification {
  id: string;
  title: string;
  message: string;
  category: 'Doctor Overdue' | 'Coverage Dropping' | 'Frequency Risk' | 'New Campaign' | 'Clinical Update' | 'Competitor Alert' | 'Follow-up Due';
  doctorId?: string;
  doctorName?: string;
  urgency: 'High' | 'Medium' | 'Low';
  date: string;
  isRead: boolean;
  actionType?: 'Schedule' | 'OpenCoach' | 'ViewCampaign' | 'ReadUpdate' | 'RecordVisit';
}

export interface SalesIntelligenceData {
  expectedMonthlySales: number;
  growthRate: number;
  topPotentialDoctors: { doctorId: string; doctorName: string; specialty: string; potentialValue: number; conversionLikelihood: number }[];
  losingMarketShareProducts: { productName: string; dropPercent: number; reason: string; competitorPressure: string }[];
  competitorThreats: { competitorName: string; marketShareImpact: string; keyObjection: string; defenseStrategy: string }[];
  aiRecommendations: { id: string; title: string; desc: string; impact: string; actionText: string }[];
}

export interface Doctor {
  id: string;
  name: string;
  title: string;
  specialty: Specialty;
  doctorClass: DoctorClass;
  territory: Territory;
  area: string;
  hospital: string;
  clinicAddress: string;
  clinic?: string;
  phone: string;
  email: string;
  avatar: string;
  prescribingVolume: 'High' | 'Medium' | 'Low';
  potential: 'High' | 'Medium' | 'Low';
  preferredVisitTime: string;
  lastVisitDate: string;
  followUpStatus: 'Up-to-Date' | 'Overdue' | 'Follow-up Required' | 'Pending';
  nextScheduledVisit?: string;
  totalVisitsThisMonth: number;
  targetVisitsPerMonth: number;
  coverageStatus?: 'Covered' | 'Targeted' | 'Unassigned' | 'Overdue';
  gpsLocation?: { lat: number; lng: number };
  promotedProducts: string[];
  productsUsed?: string[];
  competitorsList?: { brand: string; company?: string; share?: string; notes: string }[];
  visitTimeline?: { id: string; date: string; summary: string; doctorReaction: 'Positive' | 'Neutral' | 'Hesitant' | 'Enthusiastic' | 'Skeptical'; followUpNeeded: boolean; followUpDetails?: string }[];
  previousObjectionsList?: { id: string; objection: string; shortAnswer: string; status: 'Solved' | 'Pending' }[];
  activeObjections: string[];
  personalNotes: string;
  sentiment: 'Promoter' | 'Neutral' | 'Skeptical' | 'Advocate';
  coordinate: { x: number; y: number }; // For visual route/map representation
  createdAt?: string;
  updatedAt?: string;
  syncStatus?: 'synced' | 'pending';
}

export interface ProductFaq {
  id: string;
  question: string;
  answer: string;
}

export interface Product {
  id: string;
  name: string;
  brand?: string;
  genericName: string;
  category: Specialty;
  description: string;
  indications: string[];
  moa?: string; // Mechanism of Action
  dosage: string;
  keyDetailPoints: string[];
  sellingMessages?: string[];
  clinicalHighlights: string;
  clinicalStudies?: ClinicalStudy[];
  competitors?: CompetitorComparison[];
  faqs?: ProductFaq[];
  objectionHandling?: ObjectionBattlecard[];
  sampleStock: number;
  badge?: string;
  image: string;
  createdAt?: string;
  updatedAt?: string;
  syncStatus?: 'synced' | 'pending';
}

export interface Visit {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: Specialty;
  doctorHospital: string;
  date: string;
  time: string;
  durationMinutes?: number;
  type: 'In-Person' | 'Virtual' | 'Group CADD';
  status: 'Completed' | 'Scheduled' | 'Draft';
  objectives?: string;
  notes: string;
  aiTranscript?: string;
  aiSummary: string;
  audioDurationSeconds?: number;
  productsDiscussed: { productName: string; reaction: 'Positive' | 'Neutral' | 'Hesitant' }[];
  samplesGiven: { productName: string; quantity: number; batchNo: string }[];
  objectionsCaptured: string[];
  competitorMentioned?: { brand: string; claim: string };
  nextFollowUpDate: string;
  followUpTask: string;
  prescriptionPotential?: 'High' | 'Medium' | 'Low' | 'Confirmed Commitment';
  visitScore?: number;
  createdAt?: string;
  updatedAt?: string;
  syncStatus?: 'synced' | 'pending';
}

export interface RouteStop {
  id: string;
  stopOrder: number;
  doctorId: string;
  doctorName: string;
  specialty: Specialty;
  hospital: string;
  estimatedArrival: string;
  durationMinutes: number;
  priorityReason: string;
  status: 'Pending' | 'Visited' | 'Skipped';
  distanceKm: number;
}

export interface DoctorAlert {
  id: string;
  doctorId: string;
  doctorName: string;
  type: 'Sample Restock' | 'Competitor Activity' | 'Overdue Visit' | 'Clinical Inquiry';
  message: string;
  urgency: 'High' | 'Medium' | 'Low';
  date: string;
}

export interface NextBestAction {
  id: string;
  doctorId: string;
  doctorName: string;
  actionTitle: string;
  reason: string;
  suggestedProduct: string;
  impactScore: number; // 1-100
  type: 'Visit' | 'Sample' | 'Clinical Share' | 'Objection Followup';
}

export interface ClinicalStudy {
  id: string;
  title: string;
  journal: string;
  year: number;
  productName: string;
  keyFinding: string;
  pVal: string;
  sampleSize: number;
  summary: string;
  pdfUrl?: string;
}

export interface CompetitorComparison {
  id: string;
  ourProduct: string;
  competitorName: string;
  competitorCompany: string;
  ourAdvantage: string;
  theirClaim: string;
  objectionResponse: string;
}

export interface ObjectionBattlecard {
  id: string;
  category: 'Price/Reimbursement' | 'Side Effects' | 'Efficacy' | 'Habit/Loyalty' | 'Formulary';
  objection: string;
  recommendedResponse: string;
  supportingTrial: string;
  associatedProducts: string[];
}

export interface RepProfile {
  name: string;
  title: string;
  territory: Territory;
  employeeId: string;
  avatar: string;
  coverageKpi: number; // e.g. 88%
  frequencyKpi: number; // e.g. 3.4
  monthlyTargetVisits: number;
  completedVisitsThisMonth: number;
  callsTarget?: number;
  callsCompleted?: number;
  salesTarget?: number; // e.g. $120,000
  salesAchieved?: number; // e.g. $104,500
  performanceScore?: number; // e.g. 92
  doctorsInTerritory: number;
  rank: string;
  badges: { title: string; desc: string; iconName: string }[];
  updatedAt?: string;
  syncStatus?: 'synced' | 'pending';
}

export interface AiMorningBriefData {
  greeting: string;
  executiveSummary: string;
  topTargets: string[];
  strategicAdvice: string[];
  weatherOrRouteNote: string;
  recommendedFocusProduct: string;
}
