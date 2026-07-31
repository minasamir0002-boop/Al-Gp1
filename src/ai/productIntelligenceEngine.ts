/**
 * Product Intelligence Engine
 * Generates product-level market analytics, prescriber mapping, objection trends,
 * competitor positioning, suggested target doctors, and monthly financial/prescribing impact.
 */

import { Product, Doctor, Campaign } from '../models';
import { ObjectionIntelligenceEngine } from './objectionIntelligenceEngine';

export interface ProductIntelligenceData {
  product: Product;
  doctorsPromotingCount: number;
  doctorsPromotingList: Doctor[];
  campaignStatus: 'Active Launch' | 'Growth Phase' | 'Established' | 'Formulary Review';
  campaignGoal: string;
  objectionTrends: { objectionText: string; count: number; counterStrategy: string }[];
  competitorPressure: { competitorName: string; marketSharePercent: number; repAdvantage: string };
  suggestedTargetDoctors: Doctor[];
  monthlyImpact: {
    prescriptionsGenerated: number;
    estimatedRevenueUsd: number;
    marketSharePercent: number;
    growthRatePercent: number;
  };
}

export class ProductIntelligenceEngine {
  public static analyzeProduct(
    product: Product,
    allDoctors: Doctor[],
    allCampaigns: Campaign[] = []
  ): ProductIntelligenceData {
    // 1. Doctors promoting product
    const promotingDoctors = allDoctors.filter(
      (d) => d.promotedProducts && d.promotedProducts.includes(product.name)
    );

    // 2. Campaign status and goal
    const matchedCampaign = allCampaigns.find((c) => c.productsIncluded?.includes(product.name));
    const campaignStatus = matchedCampaign ? 'Active Launch' : 'Growth Phase';
    const campaignGoal = matchedCampaign
      ? (matchedCampaign.aiRecommendation || `Promote ${product.name} to target specialists`)
      : `Expand ${product.name} prescribing adoption across Class A specialists.`;

    // 3. Objection trends for this product
    const productObjections: string[] = [];
    promotingDoctors.forEach((d) => {
      if (d.activeObjections) {
        productObjections.push(...d.activeObjections);
      }
    });

    const objectionMetrics = ObjectionIntelligenceEngine.analyzeObjectionFrequency(
      productObjections.length > 0 ? productObjections : ['Co-pay assistance required', 'Formulary tier approval']
    );

    const objectionTrends = objectionMetrics.map((m) => ({
      objectionText: m.objectionText,
      count: m.occurrences,
      counterStrategy: m.bestResponse
    }));

    // 4. Competitor pressure mapping
    let competitorPressure = {
      competitorName: 'Entresto (Novartis)',
      marketSharePercent: 32,
      repAdvantage: 'Once-daily ER formulation with 92% adherence vs twice-daily dosing'
    };

    if (product.name.includes('GlycaNorm')) {
      competitorPressure = {
        competitorName: 'Jardiance (Boehringer)',
        marketSharePercent: 28,
        repAdvantage: 'Dual SGLT2i + DPP-4i synergy with superior HbA1c drop (-1.45%)'
      };
    } else if (product.name.includes('NeuroCalm')) {
      competitorPressure = {
        competitorName: 'Aimovig (Amgen)',
        marketSharePercent: 24,
        repAdvantage: 'Oral once-daily ER tablet eliminates subcutaneous injection hesitancy'
      };
    } else if (product.name.includes('PulmoShield')) {
      competitorPressure = {
        competitorName: 'Spiriva Respomat (BI)',
        marketSharePercent: 35,
        repAdvantage: 'Dual LAMA/LABA bronchospasm protection in a soft-mist inhaler'
      };
    }

    // 5. Suggested Target Doctors (Doctors not currently prescribing but high fit)
    const suggestedTargetDoctors = allDoctors
      .filter((d) => !d.promotedProducts.includes(product.name) && d.doctorClass !== 'Class C')
      .slice(0, 3);

    // 6. Monthly Impact calculation
    const prescriptionsGenerated = promotingDoctors.length * 48 + Math.floor(Math.random() * 20);
    const estimatedRevenueUsd = prescriptionsGenerated * 185;
    const marketSharePercent = Math.min(48, Math.round(18 + promotingDoctors.length * 4.2));

    return {
      product,
      doctorsPromotingCount: promotingDoctors.length,
      doctorsPromotingList: promotingDoctors,
      campaignStatus,
      campaignGoal,
      objectionTrends,
      competitorPressure,
      suggestedTargetDoctors,
      monthlyImpact: {
        prescriptionsGenerated,
        estimatedRevenueUsd,
        marketSharePercent,
        growthRatePercent: 14.8
      }
    };
  }
}
