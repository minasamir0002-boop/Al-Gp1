/**
 * Objection Intelligence Engine
 * Automatically categorizes physician objections, maps them to product lines,
 * generates optimal counter-responses, links supporting trial whitepapers,
 * and calculates territory objection frequency metrics.
 */

export interface ObjectionCategoryInfo {
  category: 'Efficacy' | 'Safety & Side Effects' | 'Price & Co-pay' | 'Formulary Access' | 'Dosing & Compliance' | 'Clinical Trial Data';
  relatedProduct: string;
  suggestedResponse: string;
  supportingClinicalStudy: string;
  evidenceLinkText: string;
}

export interface ObjectionFrequencyMetric {
  objectionText: string;
  category: string;
  relatedProduct: string;
  occurrences: number;
  percentageOfTotal: number;
  bestResponse: string;
  supportingTrial: string;
}

export class ObjectionIntelligenceEngine {
  private static objectionDatabase: Record<string, ObjectionCategoryInfo> = {
    copay: {
      category: 'Price & Co-pay',
      relatedProduct: 'Cardiovasc XL',
      suggestedResponse: 'Provide the RepOS Instant Co-Pay Savings Card capping patient out-of-pocket expenses at $15/month for commercial insurance plans.',
      supportingClinicalStudy: 'Formulary Assistance Network 2026 Commercial Savings Registry',
      evidenceLinkText: 'Download $15 Co-Pay Voucher & Instant Co-Pay e-Card'
    },
    formulary: {
      category: 'Formulary Access',
      relatedProduct: 'GlycaNorm Dual',
      suggestedResponse: 'GlycaNorm Dual is now designated Tier 2 Preferred across 88% of regional commercial health plans without prior authorization requirement.',
      supportingClinicalStudy: 'Regional Managed Care Formulary Guide Q3 2026',
      evidenceLinkText: 'View Regional Tier 2 Formulary Acceptance Certificate'
    },
    renal: {
      category: 'Efficacy',
      relatedProduct: 'Cardiovasc XL',
      suggestedResponse: 'Cardiovasc XL demonstrated 31% eGFR slope preservation and 24% reduction in CV mortality in high-risk diabetic kidney disease patients.',
      supportingClinicalStudy: 'REPOS-3 Trial (2025): Cardio-Renal Superiority Analysis (n=4,120)',
      evidenceLinkText: 'Download REPOS-3 Renal Preservation Trial Whitepaper'
    },
    sideeffect: {
      category: 'Safety & Side Effects',
      relatedProduct: 'GlycaNorm Dual',
      suggestedResponse: 'Dual SGLT2i + DPP-4i single pill combination exhibits 0.2% rate of GI discontinuation compared to 4.8% with metformin titration.',
      supportingClinicalStudy: 'MET-COMBO Safety Study 2025 (NEJM)',
      evidenceLinkText: 'Download Gastrointestinal Safety Profile Summary'
    },
    dosing: {
      category: 'Dosing & Compliance',
      relatedProduct: 'NeuroCalm ER',
      suggestedResponse: 'Once-daily bedtime dosing delivers sustained 24-hour therapeutic plasma levels, eliminating morning fog and compliance drops.',
      supportingClinicalStudy: 'NEURO-COMPLIANCE Trial 2026 (Lancet Neurology)',
      evidenceLinkText: 'Download 24-Hour Pharmacokinetic Release Curve'
    },
    generic: {
      category: 'Efficacy',
      relatedProduct: 'Cardiovasc XL',
      suggestedResponse: 'While generic ACE/ARB provides baseline control, Cardiovasc XL provides proven incremental end-organ protection and 30-day readmission reduction.',
      supportingClinicalStudy: 'Cardiovascular Superiority vs Standard Generic ARB (2025)',
      evidenceLinkText: 'Download Head-to-Head Generic ARB Trial Data'
    }
  };

  public static categorizeAndResolve(objectionText: string, defaultProduct: string = 'Cardiovasc XL'): ObjectionCategoryInfo {
    const textLower = objectionText.toLowerCase();

    if (textLower.includes('copay') || textLower.includes('cost') || textLower.includes('price') || textLower.includes('expensive')) {
      return this.objectionDatabase.copay;
    }
    if (textLower.includes('formulary') || textLower.includes('tier') || textLower.includes('prior auth') || textLower.includes('insurance')) {
      return this.objectionDatabase.formulary;
    }
    if (textLower.includes('kidney') || textLower.includes('renal') || textLower.includes('egfr') || textLower.includes('efficacy')) {
      return this.objectionDatabase.renal;
    }
    if (textLower.includes('side effect') || textLower.includes('nausea') || textLower.includes('gi') || textLower.includes('safety')) {
      return this.objectionDatabase.sideeffect;
    }
    if (textLower.includes('dosing') || textLower.includes('twice') || textLower.includes('compliance') || textLower.includes('adherence')) {
      return this.objectionDatabase.dosing;
    }

    // Default fallback
    return {
      category: 'Clinical Trial Data',
      relatedProduct: defaultProduct,
      suggestedResponse: `Present the phase 3 clinical superiority evidence for ${defaultProduct} demonstrating significant outcome improvements over standard of care.`,
      supportingClinicalStudy: 'Phase III Multi-Center Clinical Outcomes Trial (2025)',
      evidenceLinkText: 'Download Clinical Trial Executive Summary'
    };
  }

  public static analyzeObjectionFrequency(allObjections: string[]): ObjectionFrequencyMetric[] {
    const counts: Record<string, number> = {};

    allObjections.forEach((obj) => {
      if (!obj) return;
      const info = this.categorizeAndResolve(obj);
      const key = `${info.category} - ${info.relatedProduct}`;
      counts[key] = (counts[key] || 0) + 1;
    });

    const total = Math.max(1, allObjections.length);

    const metrics: ObjectionFrequencyMetric[] = Object.entries(counts).map(([key, count]) => {
      const [category, relatedProduct] = key.split(' - ');
      const info = this.categorizeAndResolve(category, relatedProduct);
      return {
        objectionText: key,
        category,
        relatedProduct,
        occurrences: count,
        percentageOfTotal: Math.round((count / total) * 100),
        bestResponse: info.suggestedResponse,
        supportingTrial: info.supportingClinicalStudy
      };
    });

    return metrics.sort((a, b) => b.occurrences - a.occurrences);
  }
}
