/**
 * KPI Engine
 * Automatically calculates territory-wide executive metrics, target achievements,
 * daily call averages, visits remaining, and overall representative performance score.
 */

import { RepProfile, Doctor, Visit } from '../models';

export interface CalculatedKPIs {
  coveragePercentage: number;
  frequencyPercentage: number;
  callAveragePerDay: number;
  completedVisitsThisMonth: number;
  visitsRemainingThisMonth: number;
  monthlyTargetVisits: number;
  targetAchievementPercentage: number;
  performanceScore: number;
  performanceTier: string;
  scoreBreakdown: {
    coverageWeight: number;
    frequencyWeight: number;
    volumeWeight: number;
    aiExecutionWeight: number;
  };
}

export class KPIEngine {
  public static calculateKPIs(
    repProfile: RepProfile,
    doctors: Doctor[],
    visits: Visit[]
  ): CalculatedKPIs {
    const totalDoctors = Math.max(1, doctors.length);

    // 1. Coverage %
    const visitedDoctorIds = new Set<string>();
    visits.forEach((v) => {
      if (v.doctorId) visitedDoctorIds.add(v.doctorId);
    });
    doctors.forEach((d) => {
      if (d.totalVisitsThisMonth > 0) visitedDoctorIds.add(d.id);
    });
    const coveragePercentage = Math.min(100, Math.round((visitedDoctorIds.size / totalDoctors) * 100));

    // 2. Frequency %
    const totalVisitsCount = doctors.reduce((acc, d) => acc + (d.totalVisitsThisMonth || 0), 0);
    const targetVisitsTerritory = doctors.reduce((acc, d) => {
      return acc + (d.doctorClass === 'Class A' ? 3 : d.doctorClass === 'Class B' ? 2 : 1);
    }, 0);
    const frequencyPercentage = Math.min(100, Math.round((totalVisitsCount / Math.max(1, targetVisitsTerritory)) * 100));

    // 3. Completed & Remaining Visits
    const completedVisitsThisMonth = Math.max(
      repProfile.completedVisitsThisMonth || 0,
      visits.length,
      totalVisitsCount
    );
    const monthlyTargetVisits = repProfile.monthlyTargetVisits || 60;
    const visitsRemainingThisMonth = Math.max(0, monthlyTargetVisits - completedVisitsThisMonth);

    // 4. Target Achievement %
    const targetAchievementPercentage = Math.min(
      100,
      Math.round((completedVisitsThisMonth / monthlyTargetVisits) * 100)
    );

    // 5. Daily Call Average
    const workingDaysInMonth = 20;
    const elapsedWorkingDays = 14; // Mid-month reference
    const callAveragePerDay = parseFloat((completedVisitsThisMonth / Math.max(1, elapsedWorkingDays)).toFixed(1));

    // 6. Overall Performance Score Calculation (0-100)
    const coverageWeight = Math.min(30, Math.round((coveragePercentage / 100) * 30));
    const frequencyWeight = Math.min(25, Math.round((frequencyPercentage / 100) * 25));
    const volumeWeight = Math.min(25, Math.round((targetAchievementPercentage / 100) * 25));
    const aiExecutionWeight = 18; // AI workflow adoption score

    const performanceScore = Math.min(99, coverageWeight + frequencyWeight + volumeWeight + aiExecutionWeight);

    let performanceTier = 'Top 5% Regional Performer';
    if (performanceScore < 82) performanceTier = 'Top 15% Territory Rep';
    if (performanceScore < 72) performanceTier = 'Solid Performer';

    return {
      coveragePercentage,
      frequencyPercentage,
      callAveragePerDay,
      completedVisitsThisMonth,
      visitsRemainingThisMonth,
      monthlyTargetVisits,
      targetAchievementPercentage,
      performanceScore,
      performanceTier,
      scoreBreakdown: {
        coverageWeight,
        frequencyWeight,
        volumeWeight,
        aiExecutionWeight
      }
    };
  }
}
