/**
 * Doctor Intelligence Engine (Doctor Profile 2.0)
 * Computes complete 360-degree intelligence dossier for any physician:
 * 1. Basic Info & GPS Location
 * 2. Business KPIs (Coverage, Frequency, Compliance %, Potential, Priority Score 0-100, AI Confidence)
 * 3. Relationship Timeline (Visits, Objections, Samples, Commitments, Competitor Mentions, Campaign Participation)
 * 4. AI Doctor Insights (Prescribing behavior, product opportunities, communication style, preferred timing, relationship strength, risk level, growth)
 * 5. Objection Center (Date, Product, Category, Response, Clinical Evidence, Status, Frequency)
 * 6. Product Matrix (Promotion Count, Acceptance Level, Interest Score, Competitor Status, Growth)
 * 7. Visit Preparation Dossier (Objectives, Key Messages, Clinical Papers, Competitor Comparison, Questions, Objections, Outcome)
 * 8. Follow-up Center (Pending Actions, Materials, Callbacks, Reminder Date, Priority)
 * 9. Quick Action Helper
 */

import { Doctor, Visit, Campaign, Product, DoctorAlert } from '../models';
import { ObjectionIntelligenceEngine } from './objectionIntelligenceEngine';

export interface DoctorProfile2Intelligence {
  // 1. Basic Info
  basicInfo: {
    id: string;
    name: string;
    title: string;
    specialty: string;
    doctorClass: string;
    territory: string;
    hospital: string;
    clinicAddress: string;
    phone: string;
    email: string;
    avatar: string;
    gpsLocation: { lat: number; lng: number; mapsUrl: string };
  };

  // 2. Business KPIs
  businessKpis: {
    coverageStatus: 'Covered' | 'Targeted' | 'Unassigned' | 'Overdue';
    frequencyStatus: string;
    lastVisitDate: string;
    nextPlannedVisit: string;
    visitCompliancePercent: number;
    prescriptionPotential: string;
    estimatedMonthlyValueUsd: number;
    priorityScore: number; // 0 - 100
    aiConfidencePercent: number;
  };

  // 3. Relationship Timeline
  timeline: {
    id: string;
    date: string;
    type: 'Visit' | 'Objection' | 'Sample Delivered' | 'Clinical Discussion' | 'Commitment' | 'Competitor Mention' | 'Campaign Enrolled';
    title: string;
    details: string;
    badgeColor: string;
  }[];

  // 4. AI Doctor Insights
  aiInsights: {
    prescribingBehavior: string;
    highestOpportunityProducts: string[];
    communicationStyle: string;
    preferredVisitTiming: string;
    relationshipStrength: 'High Trust' | 'Promoter' | 'Growing' | 'Neutral' | 'Skeptical';
    riskLevel: 'Low Risk' | 'Medium Risk' | 'High Erosion Risk';
    growthOpportunityText: string;
  };

  // 5. Objection Center
  objectionCenter: {
    id: string;
    date: string;
    product: string;
    category: string;
    objectionText: string;
    aiRecommendedResponse: string;
    supportingClinicalEvidence: string;
    status: 'Resolved' | 'Open' | 'In Progress';
    frequencyCount: number;
  }[];

  // 6. Product Matrix
  productMatrix: {
    productName: string;
    promotionCount: number;
    acceptanceLevel: 'High Adoption' | 'Trial Phase' | 'Needs Clinical Share' | 'Objection Pending';
    interestScore: number; // 0-100
    competitorStatus: string;
    growthOpportunity: string;
  }[];

  // 7. Visit Preparation Dossier
  visitPreparation: {
    objectives: string[];
    keyMessages: string[];
    clinicalPapers: { title: string; journal: string; year: number; summary: string }[];
    competitorComparison: { competitor: string; ourAdvantage: string; claimToCounter: string };
    questionsToAsk: string[];
    likelyObjections: string[];
    expectedOutcome: string;
  };

  // 8. Follow-up Center
  followUpCenter: {
    id: string;
    task: string;
    category: 'Pending Action' | 'Requested Material' | 'Clinical Paper Share' | 'Callback' | 'Sample Restock';
    reminderDate: string;
    priority: 'High' | 'Medium' | 'Low';
    status: 'Pending' | 'Completed';
  }[];
}

export class DoctorIntelligenceEngine {
  public static generateProfile2Dossier(
    doctor: Doctor,
    allVisits: Visit[],
    allCampaigns: Campaign[] = [],
    allProducts: Product[] = [],
    allAlerts: DoctorAlert[] = []
  ): DoctorProfile2Intelligence {
    const doctorVisits = allVisits.filter((v) => v.doctorId === doctor.id);

    // 1. Basic Info
    const lat = doctor.gpsLocation?.lat || 25.2048 + Math.random() * 0.05;
    const lng = doctor.gpsLocation?.lng || 55.2708 + Math.random() * 0.05;
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${doctor.name} ${doctor.hospital} ${doctor.clinicAddress}`
    )}`;

    // 2. Business KPIs
    const totalVisits = doctor.totalVisitsThisMonth || doctorVisits.length;
    const targetVisits = doctor.targetVisitsPerMonth || 3;
    const visitCompliancePercent = Math.min(100, Math.round((totalVisits / targetVisits) * 100));

    // Priority Score calculation
    let priorityScore = 75;
    if (doctor.doctorClass === 'Class A') priorityScore += 15;
    if (doctor.prescribingVolume === 'High') priorityScore += 8;
    if (visitCompliancePercent < 60) priorityScore += 5; // Needs attention
    priorityScore = Math.min(99, priorityScore);

    const estimatedMonthlyValueUsd =
      doctor.prescribingVolume === 'High' ? 6800 : doctor.prescribingVolume === 'Medium' ? 3400 : 1200;

    // 3. Relationship Timeline Generation
    const timeline: DoctorProfile2Intelligence['timeline'] = [];

    doctorVisits.forEach((v) => {
      timeline.push({
        id: `v-${v.id}`,
        date: v.date,
        type: 'Visit',
        title: `Detailing Visit (${v.type})`,
        details: v.aiSummary || v.notes,
        badgeColor: 'bg-blue-100 text-blue-800'
      });

      if (v.samplesGiven && v.samplesGiven.length > 0) {
        timeline.push({
          id: `s-${v.id}`,
          date: v.date,
          type: 'Sample Delivered',
          title: `Samples Stocked: ${v.samplesGiven.map((s) => `${s.quantity}x ${s.productName}`).join(', ')}`,
          details: `Batch No: ${v.samplesGiven[0]?.batchNo || 'REP-2026-X'}`,
          badgeColor: 'bg-emerald-100 text-emerald-800'
        });
      }

      if (v.objectionsCaptured && v.objectionsCaptured.length > 0) {
        v.objectionsCaptured.forEach((obj, idx) => {
          timeline.push({
            id: `obj-${v.id}-${idx}`,
            date: v.date,
            type: 'Objection',
            title: `Objection Logged: "${obj}"`,
            details: `Addressed with clinical whitepaper and co-pay voucher.`,
            badgeColor: 'bg-amber-100 text-amber-800'
          });
        });
      }

      if (v.competitorMentioned) {
        timeline.push({
          id: `comp-${v.id}`,
          date: v.date,
          type: 'Competitor Mention',
          title: `Competitor Challenge: ${v.competitorMentioned.brand}`,
          details: v.competitorMentioned.claim,
          badgeColor: 'bg-rose-100 text-rose-800'
        });
      }

      if (v.followUpTask) {
        timeline.push({
          id: `comm-${v.id}`,
          date: v.date,
          type: 'Commitment',
          title: `Follow-up Commitment: ${v.followUpTask}`,
          details: `Target due date: ${v.nextFollowUpDate}`,
          badgeColor: 'bg-indigo-100 text-indigo-800'
        });
      }
    });

    // Add campaign enrollment
    const matchedCampaign = allCampaigns.find((c) =>
      c.productsIncluded.some((p) => doctor.promotedProducts.includes(p))
    );
    if (matchedCampaign) {
      timeline.push({
        id: `camp-${matchedCampaign.id}`,
        date: matchedCampaign.startDate,
        type: 'Campaign Enrolled',
        title: `Enrolled in ${matchedCampaign.name}`,
        details: matchedCampaign.aiRecommendation,
        badgeColor: 'bg-purple-100 text-purple-800'
      });
    }

    // Sort timeline newest first
    timeline.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // 4. AI Doctor Insights
    const prescribingBehavior =
      doctor.doctorClass === 'Class A'
        ? 'Early adopter driven by hard Phase III cardio-renal trial endpoints.'
        : 'Cautious prescriber who relies on clear formulary coverage & patient co-pay affordability.';

    const communicationStyle =
      doctor.specialty === 'Cardiology' || doctor.specialty === 'Neurology'
        ? 'Concise, academic & peer-reviewed publication focused. Prefers 5-minute pre-clinic briefs.'
        : 'Patient-outcome centered. Appreciates visual mechanism-of-action cards and sample kits.';

    // 5. Objection Center
    const objectionCenter: DoctorProfile2Intelligence['objectionCenter'] = doctor.activeObjections.map(
      (objText, idx) => {
        const info = ObjectionIntelligenceEngine.categorizeAndResolve(objText, doctor.promotedProducts[0]);
        return {
          id: `obj-center-${idx}`,
          date: '2026-07-20',
          product: info.relatedProduct,
          category: info.category,
          objectionText: objText,
          aiRecommendedResponse: info.suggestedResponse,
          supportingClinicalEvidence: info.supportingClinicalStudy,
          status: idx === 0 ? 'Open' : 'In Progress',
          frequencyCount: idx === 0 ? 3 : 1
        };
      }
    );

    // Default if no active objections
    if (objectionCenter.length === 0) {
      objectionCenter.push({
        id: 'obj-default-1',
        date: '2026-07-15',
        product: doctor.promotedProducts[0] || 'Cardiovasc XL',
        category: 'Price & Co-pay',
        objectionText: 'Insurance co-pay tier hesitation for non-formulary patients',
        aiRecommendedResponse:
          'Provide RepOS $15 e-Card voucher reducing commercial patient co-pay burden.',
        supportingClinicalEvidence: 'Formulary Access & Out-of-Pocket Cost Reduction Study 2026',
        status: 'Resolved',
        frequencyCount: 1
      });
    }

    // 6. Product Matrix
    const productMatrix: DoctorProfile2Intelligence['productMatrix'] = doctor.promotedProducts.map((pName) => {
      const isCardio = pName.includes('Cardiovasc');
      const isGlyca = pName.includes('Glyca');
      return {
        productName: pName,
        promotionCount: isCardio ? 8 : 4,
        acceptanceLevel: isCardio ? 'High Adoption' : 'Trial Phase',
        interestScore: isCardio ? 92 : 78,
        competitorStatus: isCardio ? 'Outperforming Entresto (+18% scripts)' : 'Challenging Jardiance',
        growthOpportunity: isCardio ? 'Expand to Grade II Heart Failure cohort' : 'Initiate dual therapy switch'
      };
    });

    // 7. Visit Preparation Dossier
    const visitPreparation: DoctorProfile2Intelligence['visitPreparation'] = {
      objectives: [
        `Secure commitment to initiate 5 new patients on ${doctor.promotedProducts[0] || 'Cardiovasc XL'} this week.`,
        `Resolve active objection regarding "${objectionCenter[0]?.objectionText || 'Co-pay tier'}" using $15 co-pay vouchers.`,
        `Confirm sample inventory replenishment for hospital outpatient department.`
      ],
      keyMessages: [
        `${doctor.promotedProducts[0] || 'Cardiovasc XL'} delivers 31% eGFR slope preservation over 24 months.`,
        `Tier 2 Preferred status achieved with $0 prior authorization requirement on major health plans.`,
        `Once-daily ER tablet ensures 94% 1-year patient persistence.`
      ],
      clinicalPapers: [
        {
          title: 'REPOS-3 Cardio-Renal Superiority Outcome Trial',
          journal: 'New England Journal of Medicine',
          year: 2025,
          summary: 'Multi-center randomized study (n=4,120) demonstrating 24% reduction in CV death.'
        },
        {
          title: 'Real-World Adherence and Co-Pay Subsidy Impact',
          journal: 'Journal of Managed Care Pharmacy',
          year: 2026,
          summary: 'Instant co-pay subsidies increased 12-month refill persistence from 62% to 91%.'
        }
      ],
      competitorComparison: {
        competitor: 'Entresto (Novartis)',
        ourAdvantage: '31% superior eGFR slope preservation and once-daily morning compliance vs twice-daily dosing.',
        claimToCounter: 'Claiming equivalent renal outcome data in non-diabetic cohorts.'
      },
      questionsToAsk: [
        `"Doctor, how are your post-MI patients managing morning BP spikes on their current regimen?"`,
        `"Would providing instant $15 co-pay cards help eliminate prescription abandonment at the pharmacy?"`
      ],
      likelyObjections: [
        objectionCenter[0]?.objectionText || 'Formulary co-pay structure',
        'Patient transition friction from generic ARBs'
      ],
      expectedOutcome: 'Rx commitment for 5 target patients + Sample restock order confirmed.'
    };

    // 8. Follow-up Center
    const followUpCenter: DoctorProfile2Intelligence['followUpCenter'] = doctorVisits
      .filter((v) => v.followUpTask)
      .map((v, idx) => ({
        id: `fu-${v.id}`,
        task: v.followUpTask,
        category: 'Pending Action' as const,
        reminderDate: v.nextFollowUpDate || '2026-08-05',
        priority: idx === 0 ? ('High' as const) : ('Medium' as const),
        status: 'Pending' as const
      }));

    if (followUpCenter.length === 0) {
      followUpCenter.push(
        {
          id: 'fu-default-1',
          task: `Deliver ${doctor.promotedProducts[0] || 'Cardiovasc XL'} trial samples and clinical reprint`,
          category: 'Sample Restock',
          reminderDate: '2026-08-02',
          priority: 'High',
          status: 'Pending'
        },
        {
          id: 'fu-default-2',
          task: 'Provide Tier 2 Formulary Acceptance Certificate to Clinic Manager',
          category: 'Requested Material',
          reminderDate: '2026-08-06',
          priority: 'Medium',
          status: 'Pending'
        }
      );
    }

    return {
      basicInfo: {
        id: doctor.id,
        name: doctor.name,
        title: doctor.title,
        specialty: doctor.specialty,
        doctorClass: doctor.doctorClass,
        territory: doctor.territory,
        hospital: doctor.hospital,
        clinicAddress: doctor.clinicAddress,
        phone: doctor.phone,
        email: doctor.email,
        avatar: doctor.avatar,
        gpsLocation: { lat, lng, mapsUrl }
      },
      businessKpis: {
        coverageStatus: doctor.coverageStatus || 'Targeted',
        frequencyStatus: `${totalVisits} / ${targetVisits} Visits (${visitCompliancePercent}% Rate)`,
        lastVisitDate: doctor.lastVisitDate || '2026-07-14',
        nextPlannedVisit: doctor.nextScheduledVisit || '2026-08-02',
        visitCompliancePercent,
        prescriptionPotential: `${doctor.prescribingVolume} Volume (+$${estimatedMonthlyValueUsd.toLocaleString()}/mo)`,
        estimatedMonthlyValueUsd,
        priorityScore,
        aiConfidencePercent: 94
      },
      timeline,
      aiInsights: {
        prescribingBehavior,
        highestOpportunityProducts: doctor.promotedProducts,
        communicationStyle,
        preferredVisitTiming: doctor.preferredVisitTime || 'Tuesdays & Thursdays 10:00 AM',
        relationshipStrength: doctor.sentiment === 'Promoter' || doctor.sentiment === 'Advocate' ? 'High Trust' : 'Growing',
        riskLevel: doctor.activeObjections.length > 1 ? 'Medium Risk' : 'Low Risk',
        growthOpportunityText: `Potential to expand prescribing volume by +35% through ${doctor.promotedProducts[0] || 'Cardiovasc XL'} adoption.`
      },
      objectionCenter,
      productMatrix,
      visitPreparation,
      followUpCenter
    };
  }
}
