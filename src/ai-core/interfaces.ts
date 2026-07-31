// SPRINT 5.0: AI Core Architecture (MVP) - Interfaces
// Clean architecture contracts ready for future real AI/LLM integration.
// No cloud, no external AI API yet - modular interfaces & models only.

import { KBDocument, KBObjection } from '../data/knowledgeData';
import { Doctor } from '../types';

export interface ExtractedKnowledgeItem {
  id: string;
  product: string;
  specialty: string;
  objection: string;
  scientificAnswer: string;
  evidence: string;
  references: string[] | string;
  competitor: string;
  confidenceScore: number;
  sourceDocument: string;
  extractionDate: string;
  status: 'Pending Review' | 'Approved' | 'Rejected';
  originalAiVersion?: {
    objection: string;
    scientificAnswer: string;
    evidence: string;
    references: string;
    competitor: string;
    confidenceScore: number;
  };
  editedVersion?: {
    objection: string;
    scientificAnswer: string;
    evidence: string;
    references: string;
    competitor: string;
    confidenceScore: number;
  };
  auditHistory?: AuditLogEntry[];
}

export interface AuditLogEntry {
  id: string;
  whoEdited: string;
  timestamp: string;
  whatChanged: string;
  originalVersion: string;
  currentVersion: string;
}

// 1. Document Analyzer Interface
export interface DocumentAnalyzerService {
  analyzeDocument(document: KBDocument): Promise<{
    textSummary: string;
    sectionCount: number;
    detectedProducts: string[];
    detectedCompetitors: string[];
  }>;
  validateDocumentFormat(fileName: string): boolean;
}

// 2. Knowledge Extractor Interface
export interface KnowledgeExtractorService {
  extractObjectionsFromDocument(document: KBDocument): Promise<ExtractedKnowledgeItem[]>;
  extractClinicalEvidence(document: KBDocument): Promise<{
    trialName: string;
    patientCount: number;
    primaryOutcome: string;
    significanceValue: string;
  }[]>;
}

// 3. Objection Matcher Interface
export interface ObjectionMatcherService {
  matchDoctorObjection(doctorQuery: string, product: string): Promise<{
    matchedObjection: KBObjection | null;
    confidenceScore: number;
    recommendedAnswer: string;
    evidenceQuote: string;
  }>;
  findSimilarObjections(objectionText: string): Promise<KBObjection[]>;
}

// 4. Doctor Memory Engine Interface
export interface DoctorMemoryEngineService {
  synthesizeCommunicationStyle(doctor: Doctor): Promise<string>;
  analyzeDoctorPatterns(doctor: Doctor): Promise<{
    mostRepeatedObjections: string[];
    mostRequestedStudies: string[];
    productsDiscussedOverTime: { date: string; product: string; sentiment: string }[];
    visitFrequencyScore: number;
  }>;
}

// 5. Prediction Engine Interface
export interface PredictionEngineService {
  predictLikelyDiscussionTopics(doctor: Doctor): Promise<{
    topic: string;
    probabilityPercent: number;
    rationale: string;
  }[]>;
  recommendNextBestActions(doctor: Doctor): Promise<{
    actionTitle: string;
    category: 'Study' | 'FollowUp' | 'PatientProfile' | 'Strategy';
    priority: 'High' | 'Medium';
    reason: string;
  }[]>;
}

// 6. Visit Brief Generator Interface
export interface VisitBriefGeneratorService {
  generateVisitBrief(doctor: Doctor, focusProduct: string): Promise<{
    executiveSummary: string;
    keyTalkingPoints: string[];
    anticipatedObjections: { objection: string; counterAnswer: string }[];
    clinicalStudyToPresent: string;
    callToActions: string[];
  }>;
}

// 7. Knowledge Search Engine Interface
export interface KnowledgeSearchEngineService {
  searchKnowledgeBase(query: string, filters?: {
    product?: string;
    specialty?: string;
    category?: string;
  }): Promise<{
    objections: KBObjection[];
    documents: KBDocument[];
    totalResultsCount: number;
  }>;
}
