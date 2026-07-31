// SPRINT 5.0: AI Core Architecture (MVP) - Service Implementations
// Provides clean local implementations of all 7 AI Core services.
// Ready for drop-in LLM / API integration in future sprints.

import {
  DocumentAnalyzerService,
  KnowledgeExtractorService,
  ObjectionMatcherService,
  DoctorMemoryEngineService,
  PredictionEngineService,
  VisitBriefGeneratorService,
  KnowledgeSearchEngineService,
  ExtractedKnowledgeItem
} from './interfaces';
import { KBDocument, KBObjection, SAMPLE_OBJECTIONS, SAMPLE_DOCUMENTS } from '../data/knowledgeData';
import { Doctor } from '../types';

export class LocalDocumentAnalyzerService implements DocumentAnalyzerService {
  async analyzeDocument(document: KBDocument) {
    return {
      textSummary: `AI Summary of ${document.name} (${document.product}): Evaluates clinical cardiovascular and renal outcomes with high statistical significance.`,
      sectionCount: 6,
      detectedProducts: [document.product, 'Cardiovasc XL', 'AtheroStat'],
      detectedCompetitors: ['Entresto', 'Farxiga', 'Jardiance']
    };
  }

  validateDocumentFormat(fileName: string): boolean {
    const validExtensions = ['.pdf', '.docx', '.pptx', '.jpg', '.png'];
    return validExtensions.some(ext => fileName.toLowerCase().endsWith(ext));
  }
}

export class LocalKnowledgeExtractorService implements KnowledgeExtractorService {
  async extractObjectionsFromDocument(document: KBDocument): Promise<ExtractedKnowledgeItem[]> {
    const now = new Date().toISOString().split('T')[0];
    return [
      {
        id: `ext-${Date.now()}-1`,
        product: document.product || 'Cardiovasc XL',
        specialty: 'Cardiology',
        objection: 'Concern regarding renal safety and eGFR dip in elderly patients (>75 yrs).',
        scientificAnswer: 'REPOS-3 Trial demonstrated that initial eGFR dip ≤10% is hemodynamic and protective, resulting in 31% slower long-term eGFR decline.',
        evidence: '3,420 elderly patients randomized; p < 0.001 for sustained renal preservation over 36 months.',
        references: ['NEJM 2025; 392:114-126', 'REPOS-3 Subgroup Analysis'],
        competitor: 'Entresto 200mg',
        confidenceScore: 96,
        sourceDocument: document.name,
        extractionDate: now,
        status: 'Pending Review'
      },
      {
        id: `ext-${Date.now()}-2`,
        product: document.product || 'Cardiovasc XL',
        specialty: 'Nephrology',
        objection: 'Hesitation due to potential hyperkalemia risk when combined with ACE inhibitors.',
        scientificAnswer: 'Clinical data shows hyperkalemia incidence (<2.4%) was statistically comparable to placebo when potassium is monitored at baseline.',
        evidence: 'Pooled safety data across 4 Phase-III trials (n=8,120).',
        references: ['Lancet Cardiol 2025; 44:812-824'],
        competitor: 'Farxiga 10mg',
        confidenceScore: 91,
        sourceDocument: document.name,
        extractionDate: now,
        status: 'Pending Review'
      }
    ];
  }

  async extractClinicalEvidence(document: KBDocument) {
    return [
      {
        trialName: `Clinical Evidence from ${document.name}`,
        patientCount: 4250,
        primaryOutcome: '28% reduction in CV death and heart failure hospitalization',
        significanceValue: 'p < 0.0001'
      }
    ];
  }
}

export class LocalObjectionMatcherService implements ObjectionMatcherService {
  async matchDoctorObjection(doctorQuery: string, product: string) {
    const matched = SAMPLE_OBJECTIONS.find(o => 
      o.title.toLowerCase().includes(doctorQuery.toLowerCase()) ||
      o.category.toLowerCase().includes(doctorQuery.toLowerCase()) ||
      (o.relatedProduct && o.relatedProduct.toLowerCase() === product.toLowerCase())
    ) || SAMPLE_OBJECTIONS[0];

    return {
      matchedObjection: matched || null,
      confidenceScore: 94,
      recommendedAnswer: matched ? matched.shortScientificAnswer : 'Recommend discussing primary trial endpoints and long-term safety data.',
      evidenceQuote: 'Clinical trial n=4,200 demonstrated superior efficacy.'
    };
  }

  async findSimilarObjections(objectionText: string): Promise<KBObjection[]> {
    return SAMPLE_OBJECTIONS.slice(0, 3);
  }
}

export class LocalDoctorMemoryEngineService implements DoctorMemoryEngineService {
  async synthesizeCommunicationStyle(doctor: Doctor): Promise<string> {
    return `This doctor prefers scientific discussions with supporting clinical evidence. Usually asks for long-term safety data before discussing pricing. Highly receptive to peer-reviewed subgroup trials.`;
  }

  async analyzeDoctorPatterns(doctor: Doctor) {
    return {
      mostRepeatedObjections: [
        'Renal Safety in Elderly (eGFR < 45)',
        'Hospital Formulary Tier 3 Copay',
        'Head-to-Head vs Entresto Outcomes'
      ],
      mostRequestedStudies: [
        'REPOS-3 Renal Subgroup Analysis (2026)',
        'PARADIGM-CV 36-Month Hospital Readmission Data',
        'GERIA-CARDIO Elderly Tolerability Whitepaper'
      ],
      productsDiscussedOverTime: [
        { date: '2026-07-22', product: 'Cardiovasc XL 100mg', sentiment: 'Positive' },
        { date: '2026-07-08', product: 'Cardiovasc XL 100mg', sentiment: 'Enthusiastic' },
        { date: '2026-06-24', product: 'AtheroStat 20mg', sentiment: 'Neutral' },
        { date: '2026-06-10', product: 'Cardiovasc XL 100mg', sentiment: 'Hesitant' }
      ],
      visitFrequencyScore: 88
    };
  }
}

export class LocalPredictionEngineService implements PredictionEngineService {
  async predictLikelyDiscussionTopics(doctor: Doctor) {
    return [
      { topic: 'Safety & Renal Preservation', probabilityPercent: 92, rationale: 'Raised eGFR dip question in 2 previous visits' },
      { topic: 'Clinical Evidence (REPOS-3)', probabilityPercent: 88, rationale: 'Requested subgroup trial reprint on July 22' },
      { topic: 'Guideline Position & ESC Endorsement', probabilityPercent: 81, rationale: 'KOL involved in hospital formulary protocol' },
      { topic: 'Cost & Co-pay Assistance Card', probabilityPercent: 46, rationale: 'Previous copay objection marked as solved' }
    ];
  }

  async recommendNextBestActions(doctor: Doctor) {
    return [
      {
        actionTitle: 'Bring REPOS-3 Renal Subgroup Study',
        category: 'Study' as const,
        priority: 'High' as const,
        reason: 'Directly addresses pending objection from July 22 session.'
      },
      {
        actionTitle: 'Follow-up on patient coupon redemptions',
        category: 'FollowUp' as const,
        priority: 'High' as const,
        reason: 'Ensure clinic nurses have sufficient starter savings cards.'
      },
      {
        actionTitle: 'Ask about elderly heart failure patients (>75 yrs)',
        category: 'PatientProfile' as const,
        priority: 'Medium' as const,
        reason: 'Aligns with doctor’s primary geriatric patient mix.'
      },
      {
        actionTitle: 'Avoid starting with pricing or formulary tiers',
        category: 'Strategy' as const,
        priority: 'High' as const,
        reason: 'Doctor prefers scientific data before any administrative or cost discussion.'
      }
    ];
  }
}

export class LocalVisitBriefGeneratorService implements VisitBriefGeneratorService {
  async generateVisitBrief(doctor: Doctor, focusProduct: string) {
    return {
      executiveSummary: `Targeted clinical call for ${doctor.name} (${doctor.specialty}). Focus on ${focusProduct} renal safety profile and 36-month cardiovascular outcome data.`,
      keyTalkingPoints: [
        'Highlight REPOS-3 eGFR preservation curve vs standard care.',
        'Emphasize zero increased hyperkalemia risk with standard K+ monitoring.',
        'Present new 2026 ESC Guideline Class I Recommendation.'
      ],
      anticipatedObjections: [
        {
          objection: 'Renal safety in elderly patients with eGFR < 45',
          counterAnswer: 'Show REPOS-3 Figure 2 demonstrating 31% slower renal function decline over 3 years.'
        },
        {
          objection: 'Formulary copay restrictions',
          counterAnswer: 'Provide RepMind Instant Co-pay Card ($15/month max out of pocket).'
        }
      ],
      clinicalStudyToPresent: 'REPOS-3 Cardiovascular & Renal Subgroup Trial (2026)',
      callToActions: [
        'Secure agreement to prescribe Cardiovasc XL for next 3 post-MI heart failure patients.',
        'Schedule follow-up lunch & learn with clinic nursing team.'
      ]
    };
  }
}

export class LocalKnowledgeSearchEngineService implements KnowledgeSearchEngineService {
  async searchKnowledgeBase(query: string) {
    const q = query.toLowerCase();
    const matchedObjs = SAMPLE_OBJECTIONS.filter(o =>
      o.title.toLowerCase().includes(q) ||
      o.category.toLowerCase().includes(q) ||
      o.shortScientificAnswer.toLowerCase().includes(q) ||
      (o.relatedProduct && o.relatedProduct.toLowerCase().includes(q))
    );
    const matchedDocs = SAMPLE_DOCUMENTS.filter(d =>
      d.name.toLowerCase().includes(q) ||
      d.product.toLowerCase().includes(q)
    );
    return {
      objections: matchedObjs,
      documents: matchedDocs,
      totalResultsCount: matchedObjs.length + matchedDocs.length
    };
  }
}
