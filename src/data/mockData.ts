import { Doctor, Product, Visit, RouteStop, DoctorAlert, NextBestAction, ClinicalStudy, CompetitorComparison, ObjectionBattlecard, RepProfile } from '../types';

export const INITIAL_REP_PROFILE: RepProfile = {
  name: "Alex Vance",
  title: "Senior Medical Executive",
  territory: "Central District",
  employeeId: "REP-88392",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
  coverageKpi: 88,
  frequencyKpi: 3.4,
  monthlyTargetVisits: 75,
  completedVisitsThisMonth: 64,
  doctorsInTerritory: 42,
  rank: "#2 in Regional Division",
  badges: [
    { title: "Cardio Specialist", desc: "Top 5% prescribing conversion in Cardiology", iconName: "HeartPulse" },
    { title: "Objection Master", desc: "Successfully addressed 50+ physician concerns", iconName: "ShieldCheck" },
    { title: "Coverage Champion", desc: "Maintained >85% Class A doctor coverage for 3 consecutive months", iconName: "Award" },
    { title: "AI Power User", desc: "Utilizes RepOS Next Best Actions daily", iconName: "Zap" }
  ]
};

export const INITIAL_DOCTORS: Doctor[] = [
  {
    id: "doc-1",
    name: "Dr. Sarah Miller",
    title: "Chief of Cardiology",
    specialty: "Cardiology",
    doctorClass: "Class A",
    territory: "Central District",
    area: "Central District",
    hospital: "St. Jude Heart Institute",
    clinicAddress: "450 Medical Center Plaza, Suite 300",
    clinic: "St. Jude Cardiology Clinic Suite 300",
    phone: "+1 (555) 234-5678",
    email: "smiller@stjudeheart.org",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=250",
    prescribingVolume: "High",
    potential: "High",
    preferredVisitTime: "09:30 AM - 11:00 AM (Tue/Thu)",
    lastVisitDate: "2026-07-22",
    followUpStatus: "Up-to-Date",
    nextScheduledVisit: "2026-07-28",
    totalVisitsThisMonth: 3,
    targetVisitsPerMonth: 4,
    coverageStatus: "Covered",
    promotedProducts: ["Cardiovasc XL", "AtheroStat 20mg"],
    productsUsed: ["Cardiovasc XL 100mg", "AtheroStat 20mg"],
    competitorsList: [
      { brand: "Entresto 200mg", company: "Novartis", share: "35% Share", notes: "Primary competitor in post-MI cardiac patients." },
      { brand: "Diovan 160mg", company: "Novartis", share: "20% Share", notes: "Used for mild hypertension monotherapy." }
    ],
    visitTimeline: [
      { id: "vt-101", date: "2026-07-22", summary: "Presented Cardiovasc XL 100mg renal outcomes. Dr. Miller noted excellent patient tolerance in post-MI cohort.", doctorReaction: "Positive", followUpNeeded: true, followUpDetails: "Deliver REPOS-3 renal subgroup paper" },
      { id: "vt-102", date: "2026-07-08", summary: "Reviewed PARADIGM-CV trial data regarding 30-day heart failure hospital readmissions.", doctorReaction: "Enthusiastic", followUpNeeded: false },
      { id: "vt-103", date: "2026-06-24", summary: "Provided 10 starter packs of Cardiovasc XL. Addressed copay tier concern.", doctorReaction: "Neutral", followUpNeeded: true, followUpDetails: "Follow-up on patient coupon redemptions" },
      { id: "vt-104", date: "2026-06-10", summary: "Discussed comparative safety profile against Entresto for chronic heart failure.", doctorReaction: "Hesitant", followUpNeeded: true, followUpDetails: "Provide renal safety comparative slides" },
      { id: "vt-105", date: "2026-05-27", summary: "Initial introductory detailing call. Introduced product mechanism of action.", doctorReaction: "Neutral", followUpNeeded: false }
    ],
    previousObjectionsList: [
      { id: "po-101", objection: "Concerned about renal safety in elderly patients with eGFR < 45.", shortAnswer: "REPOS-3 subgroup trial proved 31% slower eGFR decline over 36 months.", status: "Solved" },
      { id: "po-102", objection: "High copay tier on local hospital formulary.", shortAnswer: "Provided RepOS Instant Savings Co-pay Card capping monthly cost at $15.", status: "Solved" },
      { id: "po-103", objection: "Requests long-term renal safety outcome whitepaper before expanded adoption.", shortAnswer: "Whitepaper scheduled for drop-off on next visit.", status: "Pending" }
    ],
    activeObjections: ["Requests long-term renal safety outcome data", "Price vs generic Statins"],
    personalNotes: "Prefers concise data slides. Interested in the latest REPOS-3 trial renal subgroup analysis.",
    sentiment: "Advocate",
    coordinate: { x: 25, y: 30 }
  },
  {
    id: "doc-2",
    name: "Dr. Robert Chen",
    title: "Senior Endocrinologist",
    specialty: "Endocrinology",
    doctorClass: "Class A",
    territory: "Central District",
    area: "Central District",
    hospital: "Metropolitan Diabetes Center",
    clinicAddress: "120 University Avenue, Wing B",
    clinic: "Metropolitan Endocrine Clinic Wing B",
    phone: "+1 (555) 876-5432",
    email: "rchen@metrobg.org",
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=250",
    prescribingVolume: "High",
    potential: "High",
    preferredVisitTime: "01:30 PM - 03:00 PM (Mon/Wed)",
    lastVisitDate: "2026-07-10",
    followUpStatus: "Overdue",
    nextScheduledVisit: "2026-07-28",
    totalVisitsThisMonth: 1,
    targetVisitsPerMonth: 3,
    coverageStatus: "Overdue",
    promotedProducts: ["GlycaNorm Dual"],
    productsUsed: ["GlycaNorm Dual 10mg/5mg"],
    competitorsList: [
      { brand: "DiaControl Plus", company: "Merck", share: "45% Share", notes: "Aggressive hospital pricing promotion active." },
      { brand: "Jardiance 10mg", company: "Boehringer", share: "25% Share", notes: "Widely prescribed SGLT2i monotherapy." }
    ],
    visitTimeline: [
      { id: "vt-201", date: "2026-07-10", summary: "Discussed GlycaNorm Dual HbA1c reduction (-1.45% at 24 weeks). Doctor requested sample restock.", doctorReaction: "Hesitant", followUpNeeded: true, followUpDetails: "Urgent sample restocking" },
      { id: "vt-202", date: "2026-06-26", summary: "Reviewed EMPA-REG cardiorenal trial data with diabetes care unit team.", doctorReaction: "Positive", followUpNeeded: false },
      { id: "vt-203", date: "2026-06-12", summary: "Addressed gastrointestinal side effect queries in elderly type 2 diabetic patients.", doctorReaction: "Skeptical", followUpNeeded: true, followUpDetails: "Provide GI tolerability trial digest" },
      { id: "vt-204", date: "2026-05-29", summary: "Presented dual SGLT2/DPP4 combination benefit for patient compliance.", doctorReaction: "Neutral", followUpNeeded: true, followUpDetails: "Follow up on compliance rates" },
      { id: "vt-205", date: "2026-05-15", summary: "Delivered 15 sample packs to clinic staff and reviewed dosage guidelines.", doctorReaction: "Positive", followUpNeeded: false }
    ],
    previousObjectionsList: [
      { id: "po-201", objection: "GI side effects in elderly patients.", shortAnswer: "Dual-release enteric matrix formulation reduces upper GI adverse events to <1.8%.", status: "Solved" },
      { id: "po-202", objection: "Formulary tier 3 status at Metropolitan Hospital.", shortAnswer: "Submit hospital P&T committee appeal with 1-year cost-effectiveness ROI model.", status: "Pending" }
    ],
    activeObjections: ["Gastrointestinal side effects in elderly patients", "Formulary tier 3 status at Metro Hospital"],
    personalNotes: "Has not been visited in 18 days. High risk of competitor DiaControl conversion. Needs sample re-stock.",
    sentiment: "Skeptical",
    coordinate: { x: 60, y: 45 }
  },
  {
    id: "doc-3",
    name: "Dr. Elena Rostova",
    title: "Director of Neurology",
    specialty: "Neurology",
    doctorClass: "Class A",
    territory: "Central District",
    area: "Central District",
    hospital: "Brain & Spine Medical Tower",
    clinicAddress: "880 Neuro Way, 5th Floor",
    clinic: "Brain & Spine Neuro Clinic",
    phone: "+1 (555) 345-6789",
    email: "erostova@neurobrain.org",
    avatar: "https://images.unsplash.com/photo-1594824813566-78a9c33ef199?auto=format&fit=crop&q=80&w=250",
    prescribingVolume: "High",
    potential: "High",
    preferredVisitTime: "11:30 AM - 01:00 PM (Wed/Fri)",
    lastVisitDate: "2026-07-20",
    followUpStatus: "Up-to-Date",
    nextScheduledVisit: "2026-07-29",
    totalVisitsThisMonth: 2,
    targetVisitsPerMonth: 3,
    coverageStatus: "Covered",
    promotedProducts: ["NeuroCalm ER"],
    productsUsed: ["NeuroCalm ER 16mg"],
    competitorsList: [
      { brand: "Topamax 50mg", company: "Janssen", share: "40% Share", notes: "Legacy standard but associated with high cognitive fatigue." },
      { brand: "Aimovig 70mg", company: "Amgen", share: "30% Share", notes: "Injectable CGRP mAb with high reimbursement friction." }
    ],
    visitTimeline: [
      { id: "vt-301", date: "2026-07-20", summary: "Presented NeuroCalm ER trial data. Dr. Rostova agreed to initiate 5 refractory migraine patients.", doctorReaction: "Enthusiastic", followUpNeeded: true, followUpDetails: "Review patient feedback charts" },
      { id: "vt-302", date: "2026-07-06", summary: "Shared NEURO-3 study showing 68% reduction in monthly migraine days.", doctorReaction: "Positive", followUpNeeded: false },
      { id: "vt-303", date: "2026-06-22", summary: "Discussed low daytime somnolence rate (2.1%) versus Topiramate.", doctorReaction: "Positive", followUpNeeded: true, followUpDetails: "Provide patient headache diary cards" },
      { id: "vt-304", date: "2026-06-08", summary: "Addressed onset time query regarding nightly extended-release dosing.", doctorReaction: "Neutral", followUpNeeded: false },
      { id: "vt-305", date: "2026-05-25", summary: "Initial briefing on novel central neuro-modulator mechanism of action.", doctorReaction: "Neutral", followUpNeeded: true, followUpDetails: "Send Phase III publication summary" }
    ],
    previousObjectionsList: [
      { id: "po-301", objection: "Concern regarding daytime sedation compared to standard agents.", shortAnswer: "NEURO-3 trial demonstrated only 2.1% somnolence rate due to nightly ER release.", status: "Solved" },
      { id: "po-302", objection: "Patients inquiring about digital headache symptom tracking app.", shortAnswer: "Provide digital QR patient onboarding code for mobile migraine log.", status: "Solved" }
    ],
    activeObjections: ["Onset time compared to standard Benzodiazepines"],
    personalNotes: "Very receptive to evidence-based discussions. Key opinion leader in migraine prophylaxis.",
    sentiment: "Promoter",
    coordinate: { x: 40, y: 70 }
  },
  {
    id: "doc-4",
    name: "Dr. Marcus Vance",
    title: "Pulmonology Specialist",
    specialty: "Pulmonology",
    doctorClass: "Class B",
    territory: "Metro West",
    area: "Metro West",
    hospital: "City General Hospital",
    clinicAddress: "500 Pulmonary Drive, Suite 100",
    clinic: "City General Respiratory Care Clinic",
    phone: "+1 (555) 987-6543",
    email: "mvance@citygeneral.org",
    avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=250",
    prescribingVolume: "Medium",
    potential: "Medium",
    preferredVisitTime: "08:00 AM - 09:30 AM (Daily)",
    lastVisitDate: "2026-07-15",
    followUpStatus: "Follow-up Required",
    nextScheduledVisit: "2026-08-01",
    totalVisitsThisMonth: 2,
    targetVisitsPerMonth: 2,
    coverageStatus: "Covered",
    promotedProducts: ["PulmoShield Respomat"],
    productsUsed: ["PulmoShield Respomat Soft Mist"],
    competitorsList: [
      { brand: "Spiriva Respomat", company: "Boehringer", share: "50% Share", notes: "Market leader in COPD maintenance monotherapy." },
      { brand: "Symbicort Turbuhaler", company: "AstraZeneca", share: "30% Share", notes: "Popular ICS/LABA combination." }
    ],
    visitTimeline: [
      { id: "vt-401", date: "2026-07-15", summary: "Reviewed PulmoShield soft mist inhaler device technique. Addressed elderly coordination concerns.", doctorReaction: "Hesitant", followUpNeeded: true, followUpDetails: "Deliver QR video instruction cards" },
      { id: "vt-402", date: "2026-07-01", summary: "Presented DYNAGITO trial FEV1 improvement results (+210ml over 24 hours).", doctorReaction: "Positive", followUpNeeded: false },
      { id: "vt-403", date: "2026-06-17", summary: "Discussed COPD exacerbation reduction rates in high-risk patients.", doctorReaction: "Neutral", followUpNeeded: true, followUpDetails: "Provide exacerbation rate comparison chart" },
      { id: "vt-404", date: "2026-06-03", summary: "Delivered 2 demo trainer inhaler units for patient instruction.", doctorReaction: "Positive", followUpNeeded: false },
      { id: "vt-405", date: "2026-05-20", summary: "Initial detailing call at City General Hospital pulmonary outpatient wing.", doctorReaction: "Neutral", followUpNeeded: true, followUpDetails: "Schedule follow-up call" }
    ],
    previousObjectionsList: [
      { id: "po-401", objection: "Inhaler device learning curve for frail elderly COPD patients.", shortAnswer: "Soft mist requires low inspiratory effort; provided patient video instruction QR cards.", status: "Solved" },
      { id: "po-402", objection: "Hospital formulary review delay.", shortAnswer: "P&T committee presentation scheduled for next month.", status: "Pending" }
    ],
    activeObjections: ["Inhaler device learning curve for elderly"],
    personalNotes: "Requests patient instruction video links for inhaler technique.",
    sentiment: "Neutral",
    coordinate: { x: 75, y: 25 }
  },
  {
    id: "doc-5",
    name: "Dr. Amanda Hayes",
    title: "General Practitioner & Clinic Owner",
    specialty: "General Practice",
    doctorClass: "Class B",
    territory: "North Sector",
    area: "North Sector",
    hospital: "Hayes Family Care Clinic",
    clinicAddress: "14 Executive Park Road",
    clinic: "Hayes Family Practice Center",
    phone: "+1 (555) 456-7890",
    email: "ahayes@hayescare.com",
    avatar: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=250",
    prescribingVolume: "Medium",
    potential: "Medium",
    preferredVisitTime: "02:00 PM - 04:00 PM (Thu/Fri)",
    lastVisitDate: "2026-07-02",
    followUpStatus: "Pending",
    nextScheduledVisit: "2026-08-05",
    totalVisitsThisMonth: 1,
    targetVisitsPerMonth: 2,
    coverageStatus: "Targeted",
    promotedProducts: ["AtheroStat 20mg", "GlycaNorm Dual"],
    productsUsed: ["AtheroStat 20mg", "GlycaNorm Dual"],
    competitorsList: [
      { brand: "Lipitor Generic", company: "Viatris", share: "60% Share", notes: "Heavy generic statin usage in primary care." }
    ],
    visitTimeline: [
      { id: "vt-501", date: "2026-07-02", summary: "Provided patient starter kits and dosage quick-reference cards for primary care.", doctorReaction: "Positive", followUpNeeded: true, followUpDetails: "Check starter kit stock" },
      { id: "vt-502", date: "2026-06-18", summary: "Discussed cardiovascular risk reduction in diabetic primary care patients.", doctorReaction: "Positive", followUpNeeded: false },
      { id: "vt-503", date: "2026-06-04", summary: "Reviewed patient co-pay assistance coupon program availability.", doctorReaction: "Neutral", followUpNeeded: true, followUpDetails: "Restock physical copay cards" },
      { id: "vt-504", date: "2026-05-21", summary: "Delivered 8 sample starter packs of AtheroStat 20mg.", doctorReaction: "Positive", followUpNeeded: false },
      { id: "vt-505", date: "2026-05-07", summary: "Introductory practice meeting with clinic staff and nurses.", doctorReaction: "Neutral", followUpNeeded: false }
    ],
    previousObjectionsList: [
      { id: "po-501", objection: "Missing printed co-pay coupons for uninsured primary care patients.", shortAnswer: "Restocked physical coupon booklet and provided digital discount portal link.", status: "Solved" }
    ],
    activeObjections: ["Patient co-pay assistance coupons missing"],
    personalNotes: "Appreciates printed dosage guides and patient starter kits.",
    sentiment: "Neutral",
    coordinate: { x: 15, y: 80 }
  },
  {
    id: "doc-6",
    name: "Dr. James Wilson",
    title: "Head of Gastroenterology",
    specialty: "Gastroenterology",
    doctorClass: "Class A",
    territory: "South Bay",
    area: "South Bay",
    hospital: "St. Luke Medical Center",
    clinicAddress: "78 Gastroenterology Suites",
    clinic: "St. Luke GI Specialty Clinic",
    phone: "+1 (555) 654-3210",
    email: "jwilson@stluke.org",
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=250",
    prescribingVolume: "High",
    potential: "High",
    preferredVisitTime: "10:00 AM - 12:00 PM (Mon/Thu)",
    lastVisitDate: "2026-07-25",
    followUpStatus: "Up-to-Date",
    nextScheduledVisit: "2026-08-08",
    totalVisitsThisMonth: 3,
    targetVisitsPerMonth: 3,
    coverageStatus: "Covered",
    promotedProducts: ["GastroShield ER 40mg"],
    productsUsed: ["GastroShield ER 40mg"],
    competitorsList: [
      { brand: "Nexium 40mg", company: "AstraZeneca", share: "40% Share", notes: "Strong brand presence in severe GERD." },
      { brand: "Dexilant 60mg", company: "Takeda", share: "25% Share", notes: "Dual delayed release formulation competitor." }
    ],
    visitTimeline: [
      { id: "vt-601", date: "2026-07-25", summary: "Detailed GastroShield ER 24-hour acid suppression in erosive esophagitis. Doctor agreed to increase Rx volume.", doctorReaction: "Enthusiastic", followUpNeeded: false },
      { id: "vt-602", date: "2026-07-11", summary: "Reviewed endoscopic healing rates at 8 weeks from clinical phase III trials.", doctorReaction: "Positive", followUpNeeded: true, followUpDetails: "Provide endoscopic comparison charts" },
      { id: "vt-603", date: "2026-06-27", summary: "Addressed patient nighttime breakthrough reflux queries.", doctorReaction: "Neutral", followUpNeeded: true, followUpDetails: "Deliver nocturnal pH study summary" },
      { id: "vt-604", date: "2026-06-13", summary: "Delivered 12 sample packs for trial in refractory GERD patients.", doctorReaction: "Positive", followUpNeeded: false },
      { id: "vt-605", date: "2026-05-30", summary: "Initial product introduction and mechanism of dual ER beads.", doctorReaction: "Neutral", followUpNeeded: true, followUpDetails: "Follow up after sample trial" }
    ],
    previousObjectionsList: [
      { id: "po-601", objection: "Nighttime breakthrough acid secretion in nocturnal reflux.", shortAnswer: "Bimodal ER bead technology maintains pH > 4.0 for 22.4 hours.", status: "Solved" },
      { id: "po-602", objection: "Prior authorization requirements from private insurance payers.", shortAnswer: "Provide streamlined 1-page PA fax template to clinic coordinator.", status: "Solved" }
    ],
    activeObjections: [],
    personalNotes: "High-volume prescriber. Very responsive to mucosal healing speed evidence.",
    sentiment: "Promoter",
    coordinate: { x: 50, y: 35 }
  },
  {
    id: "doc-7",
    name: "Dr. Patricia Thorne",
    title: "Chief Medical Oncologist",
    specialty: "Oncology",
    doctorClass: "Class A",
    territory: "Metro West",
    area: "Metro West",
    hospital: "National Cancer Research Institute",
    clinicAddress: "900 Hope Blvd, Suite 400",
    clinic: "NCRI Outpatient Oncology Center",
    phone: "+1 (555) 789-0123",
    email: "pthorne@ncri.org",
    avatar: "https://images.unsplash.com/photo-1594824813566-78a9c33ef199?auto=format&fit=crop&q=80&w=250",
    prescribingVolume: "High",
    potential: "High",
    preferredVisitTime: "01:00 PM - 02:30 PM (Wed/Fri)",
    lastVisitDate: "2026-07-18",
    followUpStatus: "Follow-up Required",
    nextScheduledVisit: "2026-08-02",
    totalVisitsThisMonth: 2,
    targetVisitsPerMonth: 3,
    coverageStatus: "Covered",
    promotedProducts: ["OncoSupport ER", "NeuroCalm ER"],
    productsUsed: ["NeuroCalm ER 16mg", "OncoSupport ER"],
    competitorsList: [
      { brand: "Zofran ODT", company: "Novartis", share: "50% Share", notes: "Standard chemotherapy anti-emetic." }
    ],
    visitTimeline: [
      { id: "vt-701", date: "2026-07-18", summary: "Presented clinical trial data on chemotherapy-induced nausea prevention. Dr. Thorne requested full trial PDF.", doctorReaction: "Positive", followUpNeeded: true, followUpDetails: "Send full trial PDF reprint" },
      { id: "vt-702", date: "2026-07-04", summary: "Discussed quality of life scoring in solid tumor outpatient chemotherapy clinics.", doctorReaction: "Enthusiastic", followUpNeeded: false },
      { id: "vt-703", date: "2026-06-20", summary: "Addressed drug interaction queries with platinum-based regimens.", doctorReaction: "Neutral", followUpNeeded: true, followUpDetails: "Provide drug interaction study matrix" },
      { id: "vt-704", date: "2026-06-06", summary: "Delivered clinical study reprints to oncology department library.", doctorReaction: "Positive", followUpNeeded: false },
      { id: "vt-705", date: "2026-05-23", summary: "Introductory session with Dr. Thorne and chief oncology pharmacist.", doctorReaction: "Neutral", followUpNeeded: true, followUpDetails: "Schedule department presentation" }
    ],
    previousObjectionsList: [
      { id: "po-701", objection: "Potential QT prolongation interaction with concomitant anti-emetics.", shortAnswer: "ECG monitoring subgroup analysis showed zero clinically significant QTc changes.", status: "Solved" },
      { id: "po-702", objection: "Requests full published trial PDF for hospital grand rounds presentation.", shortAnswer: "Sending full PDF paper via email and physical reprint.", status: "Pending" }
    ],
    activeObjections: ["Requests full published trial PDF for grand rounds"],
    personalNotes: "Key oncology influencer. Focus on patient quality-of-life parameters.",
    sentiment: "Advocate",
    coordinate: { x: 80, y: 60 }
  },
  {
    id: "doc-8",
    name: "Dr. David Kim",
    title: "Senior Cardiologist",
    specialty: "Cardiology",
    doctorClass: "Class B",
    territory: "North Sector",
    area: "North Sector",
    hospital: "Mercy General Clinic",
    clinicAddress: "330 Mercy Way, Wing A",
    clinic: "Mercy General Heart Care Clinic",
    phone: "+1 (555) 890-1234",
    email: "dkim@mercyclinic.org",
    avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=250",
    prescribingVolume: "Medium",
    potential: "Medium",
    preferredVisitTime: "08:30 AM - 10:00 AM (Mon/Tue)",
    lastVisitDate: "2026-06-28",
    followUpStatus: "Overdue",
    nextScheduledVisit: "2026-08-04",
    totalVisitsThisMonth: 1,
    targetVisitsPerMonth: 2,
    coverageStatus: "Overdue",
    promotedProducts: ["Cardiovasc XL 100mg"],
    productsUsed: ["Cardiovasc XL 100mg"],
    competitorsList: [
      { brand: "Vasotec 10mg", company: "Merck", share: "55% Share", notes: "Generic Enalapril monotherapy favored for low cost." }
    ],
    visitTimeline: [
      { id: "vt-801", date: "2026-06-28", summary: "Discussed switching stable hypertensive patients from generic ACEi to Cardiovasc XL.", doctorReaction: "Skeptical", followUpNeeded: true, followUpDetails: "Provide patient savings cards and sample restock" },
      { id: "vt-802", date: "2026-06-14", summary: "Reviewed 24-hour ambulatory blood pressure monitoring study results.", doctorReaction: "Neutral", followUpNeeded: false },
      { id: "vt-803", date: "2026-05-31", summary: "Provided 5 sample starter boxes and patient education brochures.", doctorReaction: "Positive", followUpNeeded: true, followUpDetails: "Order printed BP log booklets" },
      { id: "vt-804", date: "2026-05-17", summary: "Detailed cardiovascular death risk reduction data.", doctorReaction: "Neutral", followUpNeeded: false },
      { id: "vt-805", date: "2026-05-03", summary: "Initial clinic visit to establish prescribing habits.", doctorReaction: "Neutral", followUpNeeded: true, followUpDetails: "Follow up call" }
    ],
    previousObjectionsList: [
      { id: "po-801", objection: "Patient financial resistance to non-generic cardiac medications.", shortAnswer: "Activated RepOS $15 monthly copay assistance program.", status: "Solved" },
      { id: "po-802", objection: "Clinic needs updated patient blood pressure log cards.", shortAnswer: "Order 50 printed patient BP log booklets for clinic waiting room.", status: "Pending" }
    ],
    activeObjections: ["Patient financial resistance to non-generic cardiac medications"],
    personalNotes: "Conservative prescriber. Responds well to patient cost-reduction programs.",
    sentiment: "Neutral",
    coordinate: { x: 20, y: 20 }
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Cardiovasc XL",
    genericName: "Sacubitril / Valsartan ER 100mg",
    category: "Cardiology",
    description: "Next-generation dual ARNI therapy indicated for chronic heart failure with reduced ejection fraction and hypertension.",
    indications: ["Heart Failure with Reduced Ejection Fraction (HFrEF)", "Hypertension in high-risk CV patients"],
    dosage: "100mg once daily orally, titration up to 200mg after 2 weeks.",
    keyDetailPoints: [
      "24% relative reduction in 30-day cardiovascular mortality vs ACE inhibitors",
      "Superior blood pressure target attainment within 14 days",
      "Favorable renal outcomes shown in REPOS-Cardio trial (p < 0.001)"
    ],
    clinicalHighlights: "PARADIGM-CV Trial: Demonstrated statistical significance in reducing HF hospitalizations by 21%.",
    sampleStock: 48,
    badge: "Top Focus",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "prod-2",
    name: "GlycaNorm Dual",
    genericName: "Empagliflozin / Linagliptin 10mg/5mg",
    category: "Endocrinology",
    description: "Synergistic SGLT2 inhibitor & DPP-4 inhibitor combination offering robust HbA1c control without weight gain.",
    indications: ["Type 2 Diabetes Mellitus with High CV Risk", "Diabetic Kidney Disease slowing"],
    dosage: "One tablet daily in the morning with or without food.",
    keyDetailPoints: [
      "Mean HbA1c reduction of -1.45% at 24 weeks",
      "Proven cardiorenal protection with 38% drop in CV death risk",
      "Low incidence of hypoglycemia (<1.2%)"
    ],
    clinicalHighlights: "EMPA-REG Outcome: Showed dramatic preservation of eGFR in diabetic nephropathy.",
    sampleStock: 32,
    badge: "Growth Focus",
    image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "prod-3",
    name: "NeuroCalm ER",
    genericName: "Galantamine / Extended Relief 16mg",
    category: "Neurology",
    description: "Novel central neuro-modulator for neuropathic pain and migraine prophylaxis with minimal sedation.",
    indications: ["Refractory Neuropathic Pain", "Chronic Migraine Prophylaxis"],
    dosage: "16mg once daily at bedtime.",
    keyDetailPoints: [
      "Rapid onset within 72 hours vs 3 weeks for traditional tricyclics",
      "92% patient compliance due to single nightly dosing",
      "Zero anticholinergic burden scores"
    ],
    clinicalHighlights: "NEURO-3 Study: 68% reduction in monthly migraine days.",
    sampleStock: 15,
    image: "https://images.unsplash.com/photo-1576602976047-174e57a47881?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "prod-4",
    name: "PulmoShield Respomat",
    genericName: "Tiotropium / Olodaterol Inhalation",
    category: "Pulmonology",
    description: "Soft mist inhaler combining LAMA/LABA for comprehensive bronchodilator coverage in COPD and persistent Asthma.",
    indications: ["COPD Maintenance", "Severe Asthma Dual Bronchodilation"],
    dosage: "2 puffs once daily at the same time.",
    keyDetailPoints: [
      "Low inspiratory effort required - ideal for severe elderly patients",
      "24-hour continuous FEV1 improvement (+210ml)",
      "44% reduction in moderate-to-severe exacerbations"
    ],
    clinicalHighlights: "DYNAGITO Trial: Proven superiority in lung function outcomes.",
    sampleStock: 20,
    image: "https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&q=80&w=300"
  }
];

export const INITIAL_VISITS: Visit[] = [
  {
    id: "vis-101",
    doctorId: "doc-1",
    doctorName: "Dr. Sarah Miller",
    doctorSpecialty: "Cardiology",
    doctorHospital: "St. Jude Heart Institute",
    date: "2026-07-22",
    time: "10:15 AM",
    type: "In-Person",
    status: "Completed",
    notes: "Detailed Cardiovasc XL 100mg. Dr. Miller noted excellent patient tolerance in her post-MI cohort. Discussed REPOS-3 subgroup data.",
    aiSummary: "Doctor expressed strong interest in Cardiovasc XL for heart failure patients with elevated BP. Requested renal safety comparison slides for next visit.",
    audioDurationSeconds: 142,
    productsDiscussed: [
      { productName: "Cardiovasc XL", reaction: "Positive" },
      { productName: "AtheroStat 20mg", reaction: "Neutral" }
    ],
    samplesGiven: [
      { productName: "Cardiovasc XL", quantity: 5, batchNo: "LOT-CV9021" }
    ],
    objectionsCaptured: ["Requests long-term renal safety outcome data"],
    competitorMentioned: { brand: "Entresto", claim: "Competitor rep claimed higher patient copay discounts." },
    nextFollowUpDate: "2026-07-28",
    followUpTask: "Deliver renal subgroup whitepaper & 10 sample packs."
  },
  {
    id: "vis-102",
    doctorId: "doc-3",
    doctorName: "Dr. Elena Rostova",
    doctorSpecialty: "Neurology",
    doctorHospital: "Brain & Spine Medical Tower",
    date: "2026-07-20",
    time: "11:45 AM",
    type: "In-Person",
    status: "Completed",
    notes: "Presented NeuroCalm ER. Dr. Rostova agreed to start 5 new refractory migraine patients on trial therapy.",
    aiSummary: "High commitment visit. Dr. Rostova will trial NeuroCalm ER in refractory migraine patients. Requested digital patient diary access.",
    audioDurationSeconds: 98,
    productsDiscussed: [
      { productName: "NeuroCalm ER", reaction: "Positive" }
    ],
    samplesGiven: [
      { productName: "NeuroCalm ER", quantity: 6, batchNo: "LOT-NC4410" }
    ],
    objectionsCaptured: [],
    nextFollowUpDate: "2026-08-04",
    followUpTask: "Review 5 trial patient feedback charts."
  },
  {
    id: "vis-103",
    doctorId: "doc-4",
    doctorName: "Dr. Marcus Vance",
    doctorSpecialty: "Pulmonology",
    doctorHospital: "City General Hospital",
    date: "2026-07-15",
    time: "08:45 AM",
    type: "In-Person",
    status: "Completed",
    notes: "Reviewed PulmoShield Respomat device technique. Dr. Vance was concerned about elderly patient coordination.",
    aiSummary: "Addressed inhaler usability. Provided demonstration kit. Doctor requested patient instructional video QR cards.",
    audioDurationSeconds: 110,
    productsDiscussed: [
      { productName: "PulmoShield Respomat", reaction: "Hesitant" }
    ],
    samplesGiven: [
      { productName: "PulmoShield Respomat", quantity: 2, batchNo: "LOT-PS112" }
    ],
    objectionsCaptured: ["Inhaler device learning curve for elderly"],
    nextFollowUpDate: "2026-08-01",
    followUpTask: "Send QR code cards for video inhalation instructions."
  }
];

export const INITIAL_ROUTE: RouteStop[] = [
  {
    id: "rt-1",
    stopOrder: 1,
    doctorId: "doc-1",
    doctorName: "Dr. Sarah Miller",
    specialty: "Cardiology",
    hospital: "St. Jude Heart Institute",
    estimatedArrival: "09:45 AM",
    durationMinutes: 25,
    priorityReason: "Class A Target - Scheduled follow-up & Renal trial data drop-off",
    status: "Pending",
    distanceKm: 2.4
  },
  {
    id: "rt-2",
    stopOrder: 2,
    doctorId: "doc-2",
    doctorName: "Dr. Robert Chen",
    specialty: "Endocrinology",
    hospital: "Metropolitan Diabetes Center",
    estimatedArrival: "11:30 AM",
    durationMinutes: 30,
    priorityReason: "CRITICAL ALERT: 18 days overdue, sample re-stock needed, competitor threat",
    status: "Pending",
    distanceKm: 4.1
  },
  {
    id: "rt-3",
    stopOrder: 3,
    doctorId: "doc-5",
    doctorName: "Dr. Amanda Hayes",
    specialty: "General Practice",
    hospital: "Hayes Family Care Clinic",
    estimatedArrival: "02:15 PM",
    durationMinutes: 20,
    priorityReason: "Proximity match (0.8km from Dr. Chen). Deliver patient starter packs",
    status: "Pending",
    distanceKm: 0.8
  }
];

export const DOCTOR_ALERTS: DoctorAlert[] = [
  {
    id: "alt-1",
    doctorId: "doc-2",
    doctorName: "Dr. Robert Chen",
    type: "Sample Restock",
    message: "Clinic staff called: GlycaNorm Dual sample stock exhausted. High risk of competitor DiaControl substitution.",
    urgency: "High",
    date: "Today, 07:15 AM"
  },
  {
    id: "alt-2",
    doctorId: "doc-1",
    doctorName: "Dr. Sarah Miller",
    type: "Clinical Inquiry",
    message: "Requested full PDF of REPOS-3 Cardio-Renal sub-analysis before Thursday grand rounds.",
    urgency: "Medium",
    date: "Yesterday"
  },
  {
    id: "alt-3",
    doctorId: "doc-3",
    doctorName: "Dr. Elena Rostova",
    type: "Competitor Activity",
    message: "Competitor NeuroGuard launching 15% price promotion in Central District hospitals.",
    urgency: "Medium",
    date: "2 days ago"
  }
];

export const NEXT_BEST_ACTIONS: NextBestAction[] = [
  {
    id: "nba-1",
    doctorId: "doc-2",
    doctorName: "Dr. Robert Chen",
    actionTitle: "Deliver GlycaNorm Samples & Defend Formulary",
    reason: "Has not been visited in 18 days. Competitor DiaControl rep visited yesterday.",
    suggestedProduct: "GlycaNorm Dual",
    impactScore: 96,
    type: "Sample"
  },
  {
    id: "nba-2",
    doctorId: "doc-1",
    doctorName: "Dr. Sarah Miller",
    actionTitle: "Share REPOS-3 Renal Subgroup Trial Paper",
    reason: "Dr. Miller specifically asked for renal safety data during last visit.",
    suggestedProduct: "Cardiovasc XL",
    impactScore: 89,
    type: "Clinical Share"
  },
  {
    id: "nba-3",
    doctorId: "doc-4",
    doctorName: "Dr. Marcus Vance",
    actionTitle: "Inhaler Device Demo & QR Cards",
    reason: "Resolve Dr. Vance's concern regarding elderly patient inhaler technique.",
    suggestedProduct: "PulmoShield Respomat",
    impactScore: 78,
    type: "Objection Followup"
  }
];

export const CLINICAL_STUDIES: ClinicalStudy[] = [
  {
    id: "std-1",
    title: "REPOS-3 Cardio-Renal Trial: Sacubitril/Valsartan in High-Risk CV Patients",
    journal: "The New England Journal of Cardiology",
    year: 2025,
    productName: "Cardiovasc XL",
    keyFinding: "24% reduction in CV mortality & 31% slower eGFR decline over 36 months.",
    pVal: "p < 0.001",
    sampleSize: 8420,
    summary: "Multicenter double-blind randomized trial evaluating Cardiovasc XL versus standard ACE inhibitor therapy. Primary endpoint met with statistical significance across all prespecified age subgroups."
  },
  {
    id: "std-2",
    title: "EMPA-DUAL 24-Week Efficacy in Type 2 Diabetes with Established Nephropathy",
    journal: "Diabetes Care & Metabolism",
    year: 2025,
    productName: "GlycaNorm Dual",
    keyFinding: "Mean HbA1c reduction of -1.45% with weight loss of 2.8kg and zero severe hypoglycemia episodes.",
    pVal: "p < 0.001",
    sampleSize: 3150,
    summary: "Demonstrated that combining SGLT2i + DPP4i in a single daily pill improves patient compliance by 41% compared to two separate tablets."
  },
  {
    id: "std-3",
    title: "NEURO-3 Migraine Prevention Trial: Novel Extended-Release Modulation",
    journal: "Lancet Neurology",
    year: 2024,
    productName: "NeuroCalm ER",
    keyFinding: "68% reduction in mean monthly migraine days at 12 weeks with night-time dosing.",
    pVal: "p = 0.002",
    sampleSize: 1890,
    summary: "Phase III evaluation proving significantly lower daytime somnolence (2.1%) compared to Topiramate (14.5%)."
  }
];

export const COMPETITOR_COMPARISONS: CompetitorComparison[] = [
  {
    id: "cmp-1",
    ourProduct: "Cardiovasc XL",
    competitorName: "Entresto",
    competitorCompany: "Novartis",
    ourAdvantage: "Once-daily ER formulation (vs twice daily), 18% lower patient monthly copay with RepOS assistance.",
    theirClaim: "First-to-market ARNI with extensive legacy data.",
    objectionResponse: "Emphasize once-daily compliance advantage (92% vs 71% adherence) and equal clinical endpoint efficacy verified in head-to-head trial."
  },
  {
    id: "cmp-2",
    ourProduct: "GlycaNorm Dual",
    competitorName: "DiaControl Plus",
    competitorCompany: "Merck",
    ourAdvantage: "Proven cardiorenal mortality reduction in diabetic nephropathy + complimentary patient starter packs.",
    theirClaim: "Lower wholesale acquisition cost for hospital pharmacies.",
    objectionResponse: "Highlight total cost of care: GlycaNorm reduces 1-year diabetes hospitalization rate by $3,400 per patient."
  }
];

export const OBJECTION_BATTLECARDS: ObjectionBattlecard[] = [
  {
    id: "obj-1",
    category: "Efficacy",
    objection: "I am satisfied with my current generic Statin/ACEi regimen and see no reason to switch.",
    recommendedResponse: "Acknowledge baseline stability, then pivot: 'Doctor, while generic ACEi controls BP, Cardiovasc XL uniquely provides dual neurohormonal blockade that reduces 30-day heart failure readmissions by an additional 24% as shown in the REPOS-3 trial.'",
    supportingTrial: "REPOS-3 Trial (2025)",
    associatedProducts: ["Cardiovasc XL"]
  },
  {
    id: "obj-2",
    category: "Side Effects",
    objection: "My elderly patients experience severe GI upset with SGLT2 inhibitors.",
    recommendedResponse: "Explain formulation: 'GlycaNorm Dual utilizes an enteric dual-release matrix that minimizes upper GI exposure. In clinical trials, GI adverse events were comparable to placebo (<1.8%).'",
    supportingTrial: "EMPA-DUAL Study",
    associatedProducts: ["GlycaNorm Dual"]
  },
  {
    id: "obj-3",
    category: "Price/Reimbursement",
    objection: "Cardiovasc XL is Tier 3 on my local hospital formulary; copay is too high.",
    recommendedResponse: "Provide solution: 'We offer the RepOS Instant Savings Co-Pay Card which caps patient out-of-pocket cost at $15/month for all commercial insurance patients. Here is a digital activation QR code.'",
    supportingTrial: "Formulary Assistance Guide 2026",
    associatedProducts: ["Cardiovasc XL", "GlycaNorm Dual"]
  }
];

export const INITIAL_CAMPAIGNS: any[] = [
  {
    id: "camp-1",
    name: "Cardiovasc XL First-Line Launch",
    brand: "Cardiovasc XL",
    targetSpecialty: "Cardiology",
    targetDoctorClass: "Class A",
    targetCount: 18,
    completedVisits: 14,
    startDate: "2026-07-01",
    endDate: "2026-08-15",
    productsIncluded: ["Cardiovasc XL 100mg", "AtheroStat 20mg"],
    doctorsIncludedIds: ["doc-1", "doc-2", "doc-3"],
    status: "Active",
    aiRecommendation: "Focus detailing on REPOS-3 renal subgroup safety results with Class A cardiologists who are currently prescribing Entresto.",
    effectivenessScore: 92,
    prescriptionImpact: "+24% Rx volume conversion in targeted hospital accounts"
  },
  {
    id: "camp-2",
    name: "GlycaNorm Dual Cardio-Renal Push",
    brand: "GlycaNorm Dual",
    targetSpecialty: "Endocrinology",
    targetDoctorClass: "Class A",
    targetCount: 15,
    completedVisits: 9,
    startDate: "2026-07-10",
    endDate: "2026-08-30",
    productsIncluded: ["GlycaNorm Dual"],
    doctorsIncludedIds: ["doc-2", "doc-4"],
    status: "Active",
    aiRecommendation: "Highlight 31% reduction in diabetic nephropathy progression to high-volume endocrinologists.",
    effectivenessScore: 88,
    prescriptionImpact: "+18% commitment growth in Central District"
  },
  {
    id: "camp-3",
    name: "NeuroShield Class A Activation",
    brand: "NeuroCalm ER",
    targetSpecialty: "Neurology",
    targetDoctorClass: "Class B",
    targetCount: 12,
    completedVisits: 3,
    startDate: "2026-07-15",
    endDate: "2026-09-01",
    productsIncluded: ["NeuroCalm ER"],
    doctorsIncludedIds: ["doc-3"],
    status: "Active",
    aiRecommendation: "Distribute starter packs alongside 12-week somnolence study comparisons.",
    effectivenessScore: 81,
    prescriptionImpact: "+12% market share gain expected"
  }
];

export const INITIAL_CALENDAR_EVENTS: any[] = [
  {
    id: "evt-1",
    doctorId: "doc-1",
    doctorName: "Dr. Sarah Miller",
    doctorSpecialty: "Cardiology",
    hospital: "St. Jude Heart Institute",
    territory: "Central District",
    date: "2026-07-28",
    time: "09:30 AM",
    type: "In-Person",
    status: "Scheduled",
    notes: "Present REPOS-3 renal sub-analysis & deliver 10 Cardiovasc XL sample packs.",
    reminderSet: true
  },
  {
    id: "evt-2",
    doctorId: "doc-2",
    doctorName: "Dr. Robert Chen",
    doctorSpecialty: "Endocrinology",
    hospital: "Metropolitan Diabetes Center",
    territory: "Central District",
    date: "2026-07-28",
    time: "11:15 AM",
    type: "In-Person",
    status: "Scheduled",
    notes: "Sample restock required. Review GlycaNorm Dual patient copay voucher.",
    reminderSet: true
  },
  {
    id: "evt-3",
    doctorId: "doc-3",
    doctorName: "Dr. Elena Rostova",
    doctorSpecialty: "Neurology",
    hospital: "NeuroScience Specialist Clinic",
    territory: "North Sector",
    date: "2026-07-29",
    time: "02:00 PM",
    type: "Virtual",
    status: "Scheduled",
    notes: "Virtual call to address migraine prevention somnolence query.",
    reminderSet: true
  },
  {
    id: "evt-4",
    doctorId: "doc-4",
    doctorName: "Dr. Marcus Vance",
    doctorSpecialty: "Pulmonology",
    hospital: "St. Jude Respiratory Wing",
    territory: "South Bay",
    date: "2026-07-30",
    time: "10:00 AM",
    type: "Group CADD",
    status: "Scheduled",
    notes: "Group CADD clinical presentation on PulmoVent Duo for hospital staff.",
    reminderSet: true
  }
];

export const INITIAL_NOTIFICATIONS: any[] = [
  {
    id: "notif-1",
    title: "Doctor Overdue Alert",
    message: "Dr. Marcus Vance (Class A) has not been visited in 24 days. High risk of losing prescription share to competitor.",
    category: "Doctor Overdue",
    doctorId: "doc-4",
    doctorName: "Dr. Marcus Vance",
    urgency: "High",
    date: "Today, 08:15 AM",
    isRead: false,
    actionType: "Schedule"
  },
  {
    id: "notif-2",
    title: "Coverage Dropping in South Bay",
    message: "South Bay territory coverage dropped to 64%. 4 Class B doctors require call visits before month end.",
    category: "Coverage Dropping",
    urgency: "High",
    date: "Today, 07:30 AM",
    isRead: false,
    actionType: "ViewCampaign"
  },
  {
    id: "notif-3",
    title: "Competitor Alert: Entresto Co-Pay Promotion",
    message: "Novartis launched a $0 co-pay card for Entresto in Metro West. Counter with RepOS $15 Instant Savings card.",
    category: "Competitor Alert",
    doctorId: "doc-1",
    doctorName: "Dr. Sarah Miller",
    urgency: "High",
    date: "Yesterday, 04:45 PM",
    isRead: false,
    actionType: "OpenCoach"
  },
  {
    id: "notif-4",
    title: "New Campaign Launched",
    message: "GlycaNorm Dual Cardio-Renal Push campaign is active. 15 target endocrinologists assigned to your schedule.",
    category: "New Campaign",
    urgency: "Medium",
    date: "2 days ago",
    isRead: true,
    actionType: "ViewCampaign"
  },
  {
    id: "notif-5",
    title: "Clinical Trial Update Available",
    message: "New 3-year REPOS-3 Renal Sub-analysis published in Journal of Cardiology. PDF available in Knowledge center.",
    category: "Clinical Update",
    urgency: "Low",
    date: "3 days ago",
    isRead: true,
    actionType: "ReadUpdate"
  },
  {
    id: "notif-6",
    title: "Follow-Up Task Due",
    message: "Deliver REPOS-3 trial renal whitepaper to Dr. Sarah Miller following up on last week's visit promise.",
    category: "Follow-up Due",
    doctorId: "doc-1",
    doctorName: "Dr. Sarah Miller",
    urgency: "Medium",
    date: "Today",
    isRead: false,
    actionType: "RecordVisit"
  }
];

export const INITIAL_SALES_INTELLIGENCE = {
  expectedMonthlySales: 138500,
  growthRate: 14.2,
  topPotentialDoctors: [
    { doctorId: "doc-1", doctorName: "Dr. Sarah Miller", specialty: "Cardiology", potentialValue: 42000, conversionLikelihood: 88 },
    { doctorId: "doc-2", doctorName: "Dr. Robert Chen", specialty: "Endocrinology", potentialValue: 35000, conversionLikelihood: 82 },
    { doctorId: "doc-4", doctorName: "Dr. Marcus Vance", specialty: "Pulmonology", potentialValue: 28000, conversionLikelihood: 74 }
  ],
  losingMarketShareProducts: [
    {
      productName: "AtheroStat 20mg",
      dropPercent: 8.5,
      reason: "High generic statin substitution in community clinics",
      competitorPressure: "Atorvastatin Generic Co-pay $0"
    },
    {
      productName: "GastroShield ER",
      dropPercent: 4.2,
      reason: "Formulary restriction at St. Jude Hospital",
      competitorPressure: "Nexium OTC pricing competition"
    }
  ],
  competitorThreats: [
    {
      competitorName: "Entresto (Novartis)",
      marketShareImpact: "High Threat in Cardiology",
      keyObjection: "Legacy 5-year mortality clinical trial dataset",
      defenseStrategy: "Emphasize 24-hour single dose compliance and $15 RepOS copay card"
    },
    {
      competitorName: "DiaControl Plus (Merck)",
      marketShareImpact: "Moderate Threat in Endocrinology",
      keyObjection: "Lower hospital wholesale acquisition price",
      defenseStrategy: "Present 31% renal hospitalization cost avoidance ROI model"
    }
  ],
  aiRecommendations: [
    {
      id: "rec-1",
      title: "Schedule REPOS-3 Renal Lunch & Learn with St. Jude Cardiology Department",
      desc: "Dr. Sarah Miller and 4 associate cardiologists are hesitant due to renal safety queries. A department lunch presentation will lock in $42,000 monthly prescribing volume.",
      impact: "+$42,000 Monthly Potential",
      actionText: "Schedule Department Event"
    },
    {
      id: "rec-2",
      title: "Distribute 20 GlycaNorm Starter Packs to Dr. Robert Chen",
      desc: "Dr. Chen has 15 diabetic patients pending SGLT2i initiation. Providing immediate trial stock will prevent competitor DiaControl substitution.",
      impact: "+15 New Patients Initiated",
      actionText: "Deliver Starter Packs"
    }
  ]
};

