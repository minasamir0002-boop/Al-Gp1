/**
 * Central AI Engine Coordinator
 * Unified facade integrating all 6 specialized RepOS intelligence engines:
 * 1. Next Best Doctor Engine
 * 2. Visit Scoring Engine
 * 3. Territory Intelligence Engine
 * 4. Objection Intelligence Engine
 * 5. Product Intelligence Engine
 * 6. KPI Engine
 *
 * Exposes real-time state recalculation whenever data changes across the application.
 */

import { Doctor, Visit, DoctorAlert, Campaign, Product, RepProfile } from '../models';
import { NextBestDoctorEngine, NextBestDoctorResult } from './nextBestDoctorEngine';
import { VisitScoringEngine, VisitScoreResult } from './visitScoringEngine';
import { TerritoryIntelligenceEngine, TerritoryIntelligenceAnalysis } from './territoryIntelligenceEngine';
import { ObjectionIntelligenceEngine, ObjectionFrequencyMetric } from './objectionIntelligenceEngine';
import { ProductIntelligenceEngine, ProductIntelligenceData } from './productIntelligenceEngine';
import { KPIEngine, CalculatedKPIs } from './kpiEngine';

export interface CentralAiState {
  nextBestDoctor: NextBestDoctorResult | null;
  territoryIntelligence: TerritoryIntelligenceAnalysis;
  calculatedKPIs: CalculatedKPIs;
  objectionMetrics: ObjectionFrequencyMetric[];
  productIntelligenceList: ProductIntelligenceData[];
  lastCalculatedAt: string;
}

export class CentralAiEngine {
  public static computeFullIntelligence(
    doctors: Doctor[],
    visits: Visit[],
    alerts: DoctorAlert[],
    campaigns: Campaign[],
    products: Product[],
    repProfile: RepProfile
  ): CentralAiState {
    // 1. Next Best Doctor calculation
    const nextBestDoctor = doctors.length > 0
      ? NextBestDoctorEngine.calculate(doctors, visits, alerts, campaigns)
      : null;

    // 2. Territory Intelligence analysis
    const territoryIntelligence = TerritoryIntelligenceEngine.analyze(doctors, visits, campaigns);

    // 3. KPI calculation
    const calculatedKPIs = KPIEngine.calculateKPIs(repProfile, doctors, visits);

    // 4. Objection Frequency & Analysis
    const allObjections: string[] = [];
    doctors.forEach((d) => {
      if (d.activeObjections) allObjections.push(...d.activeObjections);
    });
    visits.forEach((v) => {
      if (v.objectionsCaptured) allObjections.push(...v.objectionsCaptured);
    });

    const objectionMetrics = ObjectionIntelligenceEngine.analyzeObjectionFrequency(allObjections);

    // 5. Product Intelligence mapping
    const productIntelligenceList = products.map((p) =>
      ProductIntelligenceEngine.analyzeProduct(p, doctors, campaigns)
    );

    return {
      nextBestDoctor,
      territoryIntelligence,
      calculatedKPIs,
      objectionMetrics,
      productIntelligenceList,
      lastCalculatedAt: new Date().toISOString()
    };
  }

  // Delegate helper methods
  public static scoreVisit(visit: Partial<Visit>): VisitScoreResult {
    return VisitScoringEngine.scoreVisit(visit);
  }
}
