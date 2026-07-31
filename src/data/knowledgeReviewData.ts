// SPRINT 5.0: Review Queue & Audit History Data Layer
// Stores extracted AI knowledge items pending review and audit logs for approved items.

import { ExtractedKnowledgeItem, AuditLogEntry } from '../ai-core/interfaces';

export const SAMPLE_REVIEW_QUEUE: ExtractedKnowledgeItem[] = [
  {
    id: 'rev-001',
    product: 'Cardiovasc XL',
    specialty: 'Cardiology',
    objection: 'Concern regarding renal safety and initial eGFR dip in elderly patients (>75 yrs).',
    scientificAnswer: 'REPOS-3 Trial demonstrated that initial eGFR dip ≤10% is hemodynamic and protective, resulting in 31% slower long-term eGFR decline over 36 months.',
    evidence: '3,420 elderly patients randomized; p < 0.001 for sustained renal preservation.',
    references: ['NEJM 2025; 392:114-126', 'REPOS-3 Subgroup Analysis'],
    competitor: 'Entresto 200mg',
    confidenceScore: 96,
    sourceDocument: 'REPOS-4 Cardiovascular Outcome Trial Subgroup Analysis (2026).pdf',
    extractionDate: '2026-07-30',
    status: 'Pending Review',
    originalAiVersion: {
      objection: 'Concern regarding renal safety and initial eGFR dip in elderly patients (>75 yrs).',
      scientificAnswer: 'REPOS-3 Trial demonstrated that initial eGFR dip ≤10% is hemodynamic and protective, resulting in 31% slower long-term eGFR decline over 36 months.',
      evidence: '3,420 elderly patients randomized; p < 0.001 for sustained renal preservation.',
      references: 'NEJM 2025; 392:114-126 • REPOS-3 Subgroup Analysis',
      competitor: 'Entresto 200mg',
      confidenceScore: 96
    }
  },
  {
    id: 'rev-002',
    product: 'Cardiovasc XL',
    specialty: 'Nephrology',
    objection: 'Hesitation due to potential hyperkalemia risk when combined with ACE inhibitors or ARBs.',
    scientificAnswer: 'Clinical data shows hyperkalemia incidence (<2.4%) was statistically comparable to placebo when serum potassium is monitored at baseline.',
    evidence: 'Pooled safety data across 4 Phase-III trials (n=8,120 patients).',
    references: ['Lancet Cardiol 2025; 44:812-824'],
    competitor: 'Farxiga 10mg',
    confidenceScore: 91,
    sourceDocument: 'Cardiovasc XL Product Monograph & Renal Guidance.pdf',
    extractionDate: '2026-07-29',
    status: 'Pending Review',
    originalAiVersion: {
      objection: 'Hesitation due to potential hyperkalemia risk when combined with ACE inhibitors or ARBs.',
      scientificAnswer: 'Clinical data shows hyperkalemia incidence (<2.4%) was statistically comparable to placebo when serum potassium is monitored at baseline.',
      evidence: 'Pooled safety data across 4 Phase-III trials (n=8,120 patients).',
      references: 'Lancet Cardiol 2025; 44:812-824',
      competitor: 'Farxiga 10mg',
      confidenceScore: 91
    }
  },
  {
    id: 'rev-003',
    product: 'AtheroStat',
    specialty: 'Endocrinology',
    objection: 'Inquiry on myalgia incidence compared to moderate-intensity rosuvastatin.',
    scientificAnswer: 'AtheroStat 20mg demonstrated a 45% lower incidence of muscle symptoms in statin-intolerant diabetic cohorts.',
    evidence: 'STAT-SHIELD Multicenter Trial (n=1,850), 24-week follow-up.',
    references: ['JACC 2026; 78:101-112'],
    competitor: 'Lipitor 40mg',
    confidenceScore: 89,
    sourceDocument: 'AtheroStat Phase-IV Lipid Management Report.pdf',
    extractionDate: '2026-07-28',
    status: 'Pending Review',
    originalAiVersion: {
      objection: 'Inquiry on myalgia incidence compared to moderate-intensity rosuvastatin.',
      scientificAnswer: 'AtheroStat 20mg demonstrated a 45% lower incidence of muscle symptoms in statin-intolerant diabetic cohorts.',
      evidence: 'STAT-SHIELD Multicenter Trial (n=1,850), 24-week follow-up.',
      references: 'JACC 2026; 78:101-112',
      competitor: 'Lipitor 40mg',
      confidenceScore: 89
    }
  }
];

export const SAMPLE_AUDIT_HISTORY: { [itemId: string]: AuditLogEntry[] } = {
  'rev-approved-101': [
    {
      id: 'audit-001',
      whoEdited: 'Dr. Elena Rostova (Medical Director)',
      timestamp: '2026-07-25 14:32',
      whatChanged: 'Refined scientific answer to mention eGFR threshold specifically.',
      originalVersion: 'REPOS-2 showed slower renal decline.',
      currentVersion: 'REPOS-3 Trial demonstrated that initial eGFR dip ≤10% is hemodynamic and protective, resulting in 31% slower long-term eGFR decline over 36 months.'
    }
  ]
};
