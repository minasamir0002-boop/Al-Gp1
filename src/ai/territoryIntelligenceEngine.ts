/**
 * Territory Intelligence Engine
 * Conducts automated territory-wide audit across doctors, visit logs, and active campaigns:
 * - Coverage % (Doctors visited / Total territory doctors)
 * - Frequency % (Average visits per doctor vs benchmark target)
 * - Missed Doctors (0 visits recorded this month)
 * - Inactive Doctors (>30 days since last interaction)
 * - Overdue Doctors (14-30 days since last interaction)
 * - Campaign Progress %
 * - Strategic AI Territory Optimization Recommendations
 */

import { Doctor, Visit, Campaign } from '../models';

export interface TerritoryIntelligenceAnalysis {
  coveragePercentage: number;
  frequencyPercentage: number;
  totalDoctorsCount: number;
  visitedDoctorsCount: number;
  missedDoctors: Doctor[];
  inactiveDoctors: Doctor[];
  overdueDoctors: Doctor[];
  campaignProgressPercentage: number;
  aiRecommendations: string[];
  territoryHealthStatus: 'Optimal' | 'At Risk' | 'Requires Attention';
}

export class TerritoryIntelligenceEngine {
  public static analyze(
    doctors: Doctor[],
    visits: Visit[],
    campaigns: Campaign[] = []
  ): TerritoryIntelligenceAnalysis {
    const totalDoctorsCount = doctors.length;
    if (totalDoctorsCount === 0) {
      return {
        coveragePercentage: 0,
        frequencyPercentage: 0,
        totalDoctorsCount: 0,
        visitedDoctorsCount: 0,
        missedDoctors: [],
        inactiveDoctors: [],
        overdueDoctors: [],
        campaignProgressPercentage: 0,
        aiRecommendations: ['No doctor records found in territory.'],
        territoryHealthStatus: 'Requires Attention'
      };
    }

    const today = new Date('2026-07-28');

    // 1. Visited Doctors & Coverage %
    const visitedSet = new Set<string>();
    visits.forEach((v) => {
      if (v.doctorId) visitedSet.add(v.doctorId);
    });
    doctors.forEach((d) => {
      if (d.totalVisitsThisMonth > 0) visitedSet.add(d.id);
    });

    const visitedDoctorsCount = visitedSet.size;
    const coveragePercentage = Math.min(100, Math.round((visitedDoctorsCount / totalDoctorsCount) * 100));

    // 2. Frequency Calculation
    const totalVisitsThisMonth = doctors.reduce((acc, d) => acc + (d.totalVisitsThisMonth || 0), 0);
    const targetVisitsTerritory = doctors.reduce((acc, d) => {
      return acc + (d.doctorClass === 'Class A' ? 3 : d.doctorClass === 'Class B' ? 2 : 1);
    }, 0);
    const frequencyPercentage = Math.min(100, Math.round((totalVisitsThisMonth / Math.max(1, targetVisitsTerritory)) * 100));

    // 3. Categorize Missed, Inactive, and Overdue Doctors
    const missedDoctors: Doctor[] = [];
    const inactiveDoctors: Doctor[] = [];
    const overdueDoctors: Doctor[] = [];

    doctors.forEach((doc) => {
      const lastVisit = doc.lastVisitDate ? new Date(doc.lastVisitDate) : new Date('2026-05-01');
      const diffDays = Math.floor((today.getTime() - lastVisit.getTime()) / (1000 * 60 * 60 * 24));

      if (doc.totalVisitsThisMonth === 0) {
        missedDoctors.push(doc);
      }

      if (diffDays > 30) {
        inactiveDoctors.push(doc);
      } else if (diffDays >= 14) {
        overdueDoctors.push(doc);
      }
    });

    // 4. Campaign Progress Calculation
    let campaignProgressPercentage = 75;
    if (campaigns.length > 0) {
      const activeCamps = campaigns.filter((c) => c.status === 'Active');
      if (activeCamps.length > 0) {
        const avg = activeCamps.reduce((acc, c) => acc + (c.completedVisits / (c.targetCount || 1) * 100), 0) / activeCamps.length;
        campaignProgressPercentage = Math.round(avg);
      }
    }

    // 5. Strategic AI Recommendations
    const aiRecommendations: string[] = [];

    if (inactiveDoctors.length > 0) {
      aiRecommendations.push(
        `Re-engage ${inactiveDoctors.length} inactive physicians (>30 days since visit) starting with ${inactiveDoctors[0].name} (${inactiveDoctors[0].doctorClass}).`
      );
    }
    if (coveragePercentage < 80) {
      aiRecommendations.push(
        `Coverage deficit detected (${coveragePercentage}% vs 85% target). Prioritize missed Class A/B doctors in your weekly route plan.`
      );
    }
    if (overdueDoctors.length > 0) {
      aiRecommendations.push(
        `${overdueDoctors.length} doctors are overdue for follow-up. Schedule a visit cluster near ${overdueDoctors[0].hospital}.`
      );
    }
    aiRecommendations.push(
      `Campaign target for ${campaigns[0]?.name || 'Cardiovasc XL Launch'} is at ${campaignProgressPercentage}%. Focus detailing on high-volume prescribers.`
    );

    // Territory Health
    let territoryHealthStatus: TerritoryIntelligenceAnalysis['territoryHealthStatus'] = 'Optimal';
    if (coveragePercentage < 70 || inactiveDoctors.length > 3) {
      territoryHealthStatus = 'Requires Attention';
    } else if (coveragePercentage < 82 || overdueDoctors.length > 3) {
      territoryHealthStatus = 'At Risk';
    }

    return {
      coveragePercentage,
      frequencyPercentage,
      totalDoctorsCount,
      visitedDoctorsCount,
      missedDoctors,
      inactiveDoctors,
      overdueDoctors,
      campaignProgressPercentage,
      aiRecommendations,
      territoryHealthStatus
    };
  }
}
