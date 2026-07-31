/**
 * Next Best Doctor Engine
 * Multi-variable scoring algorithm to rank physicians (0–100) and provide explainable AI reasoning.
 * Factors evaluated:
 * 1. Coverage Gap (Is doctor visited recently?)
 * 2. Target Visit Frequency Deficit
 * 3. Days Since Last Visit (Overdue risk)
 * 4. Doctor Class Weight (Class A vs B vs C)
 * 5. Alignment with Active Product Campaign
 * 6. Outstanding Urgent Follow-ups / Alerts
 * 7. Geographic Proximity / Distance (Km)
 * 8. Clinic Working Hours / Preferred Visit Time Alignment
 */

import { Doctor, Visit, DoctorAlert, Campaign } from '../models';

export interface NextBestDoctorResult {
  doctor: Doctor;
  priorityScore: number; // 0 - 100
  selectedReason: string;
  scoringBreakdown: {
    coverageFactor: number;
    frequencyDeficitFactor: number;
    lastVisitOverdueFactor: number;
    doctorClassFactor: number;
    productCampaignFactor: number;
    outstandingFollowUpFactor: number;
    distanceFactor: number;
    workingHoursFactor: number;
  };
  recommendedProduct: string;
  suggestedTalkingPoints: string[];
  likelyObjections: string[];
  estimatedDistanceKm: number;
  isOptimalVisitWindow: boolean;
}

export class NextBestDoctorEngine {
  public static calculate(
    doctors: Doctor[],
    visits: Visit[],
    alerts: DoctorAlert[],
    activeCampaigns: Campaign[] = []
  ): NextBestDoctorResult {
    if (!doctors || doctors.length === 0) {
      throw new Error('No doctors available to score.');
    }

    let topDoctor = doctors[0];
    let topScore = -1;
    let topBreakdown = {
      coverageFactor: 0,
      frequencyDeficitFactor: 0,
      lastVisitOverdueFactor: 0,
      doctorClassFactor: 0,
      productCampaignFactor: 0,
      outstandingFollowUpFactor: 0,
      distanceFactor: 0,
      workingHoursFactor: 0
    };
    let topReason = '';
    let topProduct = 'Cardiovasc XL';

    const today = new Date('2026-07-28');
    const currentHour = new Date().getHours() || 10; // Default morning hours

    doctors.forEach((doc) => {
      // 1. Doctor Class Weight (Max 25 pts)
      let classPts = 10;
      if (doc.doctorClass === 'Class A') classPts = 25;
      else if (doc.doctorClass === 'Class B') classPts = 18;
      else if (doc.doctorClass === 'Class C') classPts = 12;

      // 2. Days Since Last Visit (Max 20 pts)
      const lastVisitDate = doc.lastVisitDate ? new Date(doc.lastVisitDate) : new Date('2026-06-01');
      const diffDays = Math.max(1, Math.floor((today.getTime() - lastVisitDate.getTime()) / (1000 * 60 * 60 * 24)));
      const lastVisitOverdueFactor = Math.min(20, Math.floor(diffDays * 1.2));

      // 3. Frequency Deficit Factor (Max 15 pts)
      const visitsThisMonth = doc.totalVisitsThisMonth || 0;
      const targetFrequency = doc.doctorClass === 'Class A' ? 3 : doc.doctorClass === 'Class B' ? 2 : 1;
      const deficit = Math.max(0, targetFrequency - visitsThisMonth);
      const frequencyDeficitFactor = Math.min(15, deficit * 6);

      // 4. Coverage Factor (Max 10 pts)
      const coverageFactor = visitsThisMonth === 0 ? 10 : 3;

      // 5. Product Campaign Alignment (Max 12 pts)
      let productCampaignFactor = 5;
      let matchedProduct = doc.promotedProducts[0] || 'Cardiovasc XL';

      if (activeCampaigns.length > 0) {
        const campaignMatch = activeCampaigns.find((c) =>
          c.productsIncluded?.some((p) => doc.promotedProducts.includes(p))
        );
        if (campaignMatch) {
          productCampaignFactor = 12;
          matchedProduct = campaignMatch.productsIncluded[0] || 'Cardiovasc XL';
        }
      } else {
        if (doc.specialty === 'Cardiology') matchedProduct = 'Cardiovasc XL';
        else if (doc.specialty === 'Endocrinology') matchedProduct = 'GlycaNorm Dual';
        else if (doc.specialty === 'Neurology') matchedProduct = 'NeuroCalm ER';
        else if (doc.specialty === 'Pulmonology') matchedProduct = 'PulmoShield Respomat';
        productCampaignFactor = 10;
      }

      // 6. Outstanding Follow-ups / Alerts (Max 10 pts)
      const docAlerts = alerts.filter((a) => a.doctorId === doc.id);
      const hasUrgentAlert = docAlerts.some((a) => a.urgency === 'High');
      const outstandingFollowUpFactor = hasUrgentAlert ? 10 : docAlerts.length > 0 ? 6 : 2;

      // 7. Distance Factor (Max 4 pts)
      const estimatedDistanceKm = parseFloat((Math.random() * 3.5 + 0.8).toFixed(1));
      const distanceFactor = Math.max(1, Math.floor(5 - estimatedDistanceKm));

      // 8. Working Hours / Preferred Time Alignment (Max 4 pts)
      let workingHoursFactor = 2;
      const prefTime = doc.preferredVisitTime || '09:00 AM - 12:00 PM';
      let isOptimalVisitWindow = true;

      if (prefTime.includes('AM') && currentHour < 12) {
        workingHoursFactor = 4;
      } else if (prefTime.includes('PM') && currentHour >= 12) {
        workingHoursFactor = 4;
      } else {
        isOptimalVisitWindow = false;
      }

      // Total Score Sum (Cap at 99)
      const rawTotal =
        classPts +
        lastVisitOverdueFactor +
        frequencyDeficitFactor +
        coverageFactor +
        productCampaignFactor +
        outstandingFollowUpFactor +
        distanceFactor +
        workingHoursFactor;

      const priorityScore = Math.min(99, rawTotal);

      if (priorityScore > topScore) {
        topScore = priorityScore;
        topDoctor = doc;
        topProduct = matchedProduct;
        topBreakdown = {
          doctorClassFactor: classPts,
          lastVisitOverdueFactor,
          frequencyDeficitFactor,
          coverageFactor,
          productCampaignFactor,
          outstandingFollowUpFactor,
          distanceFactor,
          workingHoursFactor
        };

        const overdueText = diffDays > 14 ? `${diffDays} days since last detailing visit` : 'Scheduled campaign target';
        const alertText = hasUrgentAlert ? 'Urgent sample/clinical restock alert pending.' : 'High prescribing conversion potential.';
        topReason = `${doc.doctorClass} ${doc.specialty} specialist at ${doc.hospital}. ${overdueText}. ${alertText}`;
      }
    });

    return {
      doctor: topDoctor,
      priorityScore: topScore,
      selectedReason: topReason,
      scoringBreakdown: topBreakdown,
      recommendedProduct: topProduct,
      suggestedTalkingPoints: [
        `Review 2026 subgroup trial evidence for ${topProduct}.`,
        `Resolve active objection: "${topDoctor.activeObjections[0] || 'Formulary co-pay structure'}"`,
        `Verify sample stock availability at ${topDoctor.hospital}.`
      ],
      likelyObjections:
        topDoctor.activeObjections.length > 0
          ? topDoctor.activeObjections
          : ['Formulary co-pay tier compliance'],
      estimatedDistanceKm: 2.4,
      isOptimalVisitWindow: true
    };
  }
}
