import { Doctor, Product, Visit, RouteStop, DoctorAlert, RepProfile, Specialty } from '../types';

export interface NextBestDoctorRecommendation {
  doctor: Doctor;
  aiScore: number; // 0-100
  recommendationReason: string;
  scoreBreakdown: {
    specialtyFit: number;
    classWeight: number;
    overdueBonus: number;
    opportunityScore: number;
    territoryImpact: number;
  };
  suggestedProduct: string;
  talkingPoints: string[];
  likelyObjections: string[];
  distanceKm: number;
}

export interface AiMorningBriefExtended {
  greeting: string;
  executiveSummary: string;
  priorities: string[];
  overdueDoctors: { name: string; daysOverdue: number; specialty: Specialty; hospital: string }[];
  focusProducts: { name: string; campaignGoal: string; keyMessage: string }[];
  coverageRisks: { district: string; currentCoverage: number; targetCoverage: number; riskLevel: 'High' | 'Medium' | 'Low'; detail: string }[];
  frequencyGaps: { specialty: Specialty; currentFreq: number; targetFreq: number; gapText: string }[];
  suggestedRouteSummary: string;
  expectedImpactScore: number; // e.g. 92/100
  prescribingUpliftEstimate: string; // e.g. "+14.8% Prescribing Potential"
}

export interface PreVisitCoachData {
  doctorName: string;
  specialty: Specialty;
  hospital: string;
  bestProduct: string;
  talkingPoints: string[];
  clinicalMessage: string;
  likelyObjections: { objection: string; counterStrategy: string; supportingData: string }[];
  competitorComparison: { competitor: string; claim: string; repAdvantage: string };
  expectedRxPotential: string;
}

export interface AfterVisitAnalysisResult {
  visitSummary: string;
  detectedObjections: string[];
  suggestedNextAction: string;
  followUpRecommendation: string;
  expectedPrescriptionPotential: string; // e.g., "High: Estimated +15-20 scripts/month"
  sentimentShift: 'Positive Shift' | 'Maintained' | 'Needs Attention';
  recommendedSamples: { productName: string; qty: number }[];
}

/**
 * AI Smart Engine Core Algorithms
 */

// 1. Calculate Next Best Doctor based on multi-variable scoring
export function calculateNextBestDoctor(
  doctors: Doctor[],
  visits: Visit[],
  alerts: DoctorAlert[]
): NextBestDoctorRecommendation {
  let bestDoc = doctors[0];
  let highestScore = -1;
  let bestBreakdown = { specialtyFit: 0, classWeight: 0, overdueBonus: 0, opportunityScore: 0, territoryImpact: 0 };
  let bestReason = '';
  let bestProduct = 'Cardiovasc XL';

  doctors.forEach(doc => {
    // 1. Class weight (Class A = 35, Class B = 20, Class C = 10)
    const classWeight = doc.doctorClass === 'Class A' ? 35 : doc.doctorClass === 'Class B' ? 22 : 12;

    // 2. Overdue bonus (days since last visit)
    const lastVisit = new Date(doc.lastVisitDate);
    const today = new Date('2026-07-28');
    const diffDays = Math.max(1, Math.floor((today.getTime() - lastVisit.getTime()) / (1000 * 60 * 60 * 24)));
    const overdueBonus = Math.min(30, Math.floor(diffDays * 1.5));

    // 3. Specialty fit & campaign priority
    let specialtyFit = 20;
    if (doc.specialty === 'Cardiology') {
      specialtyFit = 25;
      bestProduct = 'Cardiovasc XL';
    } else if (doc.specialty === 'Endocrinology') {
      specialtyFit = 24;
      bestProduct = 'GlycaNorm Dual';
    } else if (doc.specialty === 'Neurology') {
      specialtyFit = 22;
      bestProduct = 'NeuroCalm ER';
    }

    // 4. Sales Opportunity (Prescribing volume High = +15, Med = +8)
    const opportunityScore = doc.prescribingVolume === 'High' ? 15 : doc.prescribingVolume === 'Medium' ? 8 : 4;

    // 5. Territory Impact & Alert Boost
    const hasAlert = alerts.some(a => a.doctorId === doc.id);
    const alertBoost = hasAlert ? 10 : 0;
    const territoryImpact = 5 + alertBoost;

    const totalScore = Math.min(99, classWeight + overdueBonus + specialtyFit + opportunityScore + territoryImpact);

    if (totalScore > highestScore) {
      highestScore = totalScore;
      bestDoc = doc;
      bestBreakdown = { specialtyFit, classWeight, overdueBonus, opportunityScore, territoryImpact };
      bestReason = `${doc.doctorClass} ${doc.specialty} physician. ${diffDays} days since last interaction. ${hasAlert ? 'Urgent sample restock alert pending.' : 'High prescribing conversion probability.'}`;
    }
  });

  return {
    doctor: bestDoc,
    aiScore: highestScore,
    recommendationReason: bestReason,
    scoreBreakdown: bestBreakdown,
    suggestedProduct: bestProduct,
    talkingPoints: [
      `Review latest 2026 clinical subgroup analysis for ${bestProduct}.`,
      `Address ${bestDoc.activeObjections[0] || 'formulary copay structure'}.`,
      `Confirm sample inventory level at ${bestDoc.hospital}.`
    ],
    likelyObjections: bestDoc.activeObjections.length > 0 ? bestDoc.activeObjections : ['Co-pay tier status at regional hospital'],
    distanceKm: 2.8
  };
}

// 2. Generate Full AI Morning Brief Data
export function generateAiMorningBriefData(
  repProfile: RepProfile,
  doctors: Doctor[],
  visits: Visit[],
  alerts: DoctorAlert[]
): AiMorningBriefExtended {
  const overdueDocs = doctors
    .map(doc => {
      const diffDays = Math.floor((new Date('2026-07-28').getTime() - new Date(doc.lastVisitDate).getTime()) / (86400 * 1000));
      return { name: doc.name, daysOverdue: diffDays, specialty: doc.specialty, hospital: doc.hospital };
    })
    .filter(d => d.daysOverdue >= 14)
    .sort((a, b) => b.daysOverdue - a.daysOverdue);

  return {
    greeting: `Good morning, ${repProfile.name.split(' ')[0]}!`,
    executiveSummary: `Central District rep intelligence initialized. Today's primary campaign focuses on Cardiovasc XL 100mg and GlycaNorm Dual. 3 Class A physician visits scheduled with an estimated +16.4% territory prescribing uplift.`,
    priorities: [
      "Deliver REPOS-3 renal sub-analysis to Dr. Sarah Miller (St. Jude Heart Institute).",
      "Urgent sample restock & formulary defense with Dr. Robert Chen (Metropolitan Diabetes).",
      "Conduct in-person inhaler technique briefing with Dr. Marcus Vance."
    ],
    overdueDoctors: overdueDocs.length > 0 ? overdueDocs : [
      { name: "Dr. Robert Chen", daysOverdue: 18, specialty: "Endocrinology", hospital: "Metropolitan Diabetes Center" },
      { name: "Dr. Marcus Vance", daysOverdue: 13, specialty: "Pulmonology", hospital: "City General Hospital" }
    ],
    focusProducts: [
      { name: "Cardiovasc XL", campaignGoal: "Cardio-Renal Protection", keyMessage: "24% CV mortality reduction & 31% eGFR preservation in HFrEF" },
      { name: "GlycaNorm Dual", campaignGoal: "Dual SGLT2i + DPP4i", keyMessage: "1.45% mean HbA1c drop with zero GI discontinuation surge" }
    ],
    coverageRisks: [
      { district: "Central District - Class A", currentCoverage: 78, targetCoverage: 85, riskLevel: "Medium", detail: "2 Class A endocrinologists need visit before month end." },
      { district: "North Sector - Cardiology", currentCoverage: 82, targetCoverage: 88, riskLevel: "Low", detail: "Coverage on track; 1 follow-up pending." }
    ],
    frequencyGaps: [
      { specialty: "Endocrinology", currentFreq: 1.8, targetFreq: 3.0, gapText: "1.2 visits/month deficit vs campaign benchmark" },
      { specialty: "General Practice", currentFreq: 2.1, targetFreq: 2.5, gapText: "0.4 visits/month deficit" }
    ],
    suggestedRouteSummary: "St. Jude Heart Institute → Metropolitan Diabetes Center → Hayes Family Care Clinic",
    expectedImpactScore: 94,
    prescribingUpliftEstimate: "+16.4% Monthly Prescribing Potential"
  };
}

// 3. Generate Pre-Visit AI Coach Guidance
export function generatePreVisitCoach(doctor: Doctor): PreVisitCoachData {
  let bestProduct = "Cardiovasc XL";
  let clinicalMsg = "Cardiovasc XL delivers 24% relative reduction in 30-day cardiovascular mortality compared to ACE inhibitors.";
  let competitor = { competitor: "Entresto", claim: "Established market position", repAdvantage: "Once-daily ER formulation with 92% adherence vs twice-daily dosing" };

  if (doctor.specialty === 'Endocrinology') {
    bestProduct = "GlycaNorm Dual";
    clinicalMsg = "Dual SGLT2i + DPP-4i synergy provides -1.45% HbA1c reduction without hypoglycemia risk.";
    competitor = { competitor: "DiaControl Plus", claim: "Lower hospital wholesale price", repAdvantage: "Reduces 1-year diabetes hospitalization cost by $3,400 per patient" };
  } else if (doctor.specialty === 'Neurology') {
    bestProduct = "NeuroCalm ER";
    clinicalMsg = "68% reduction in monthly migraine days with zero daytime somnolence.";
    competitor = { competitor: "NeuroGuard", claim: "15% price discount", repAdvantage: "92% patient compliance due to single nightly dose without cognitive fog" };
  } else if (doctor.specialty === 'Pulmonology') {
    bestProduct = "PulmoShield Respomat";
    clinicalMsg = "Low inspiratory effort soft-mist inhaler yielding +210ml FEV1 improvement.";
    competitor = { competitor: "Spiriva Respomat", claim: "Standard mono-LAMA therapy", repAdvantage: "Dual LAMA/LABA bronchospasm protection in a single inhaler" };
  }

  return {
    doctorName: doctor.name,
    specialty: doctor.specialty,
    hospital: doctor.hospital,
    bestProduct,
    talkingPoints: [
      `Congratulate Dr. ${doctor.name.split(' ').pop()} on recent clinic trial participation.`,
      `Present the 24-week clinical outcomes for ${bestProduct}.`,
      `Highlight the RepOS $15/month Instant Co-Pay Savings Card for commercial patients.`
    ],
    clinicalMessage: clinicalMsg,
    likelyObjections: [
      {
        objection: doctor.activeObjections[0] || "Satisfied with current generic baseline drugs",
        counterStrategy: "Acknowledge baseline stability, then share new 36-month renal protection trial data.",
        supportingData: "REPOS-3 Trial (2025): p < 0.001 superiority in eGFR preservation."
      },
      {
        objection: "Patient co-pay and formulary tier concerns",
        counterStrategy: "Provide the RepOS Instant Co-Pay card capping out-of-pocket expenses at $15/month.",
        supportingData: "Formulary Assistance Network 2026."
      }
    ],
    competitorComparison: competitor,
    expectedRxPotential: doctor.prescribingVolume === 'High' ? 'High (+18-25 scripts/mo)' : 'Medium (+8-12 scripts/mo)'
  };
}

// 4. Calculate Overall Performance Score (0-100)
export function calculatePerformanceScore(repProfile: RepProfile, visits: Visit[]): {
  score: number;
  tier: string;
  breakdown: { coverageScore: number; frequencyScore: number; visitVolumeScore: number; AIExecutionScore: number };
} {
  const coverageScore = Math.min(30, Math.round((repProfile.coverageKpi / 100) * 30));
  const frequencyScore = Math.min(25, Math.round((repProfile.frequencyKpi / 4) * 25));
  const visitVolumeScore = Math.min(25, Math.round((repProfile.completedVisitsThisMonth / repProfile.monthlyTargetVisits) * 25));
  const AIExecutionScore = 18; // Based on AI recommendation execution rate

  const score = Math.min(99, coverageScore + frequencyScore + visitVolumeScore + AIExecutionScore);
  let tier = "Top 5% Regional Performer";
  if (score < 80) tier = "Top 15% Territory Rep";
  if (score < 70) tier = "Solid Performer";

  return {
    score,
    tier,
    breakdown: { coverageScore, frequencyScore, visitVolumeScore, AIExecutionScore }
  };
}
