// SPRINT 5.0: AI Core Module Entry Point
// Clean modular exports for AI Core interfaces and service implementations.

export * from './interfaces';
export * from './services';
export * from './providers';

import {
  LocalDocumentAnalyzerService,
  LocalKnowledgeExtractorService,
  LocalObjectionMatcherService,
  LocalDoctorMemoryEngineService,
  LocalPredictionEngineService,
  LocalVisitBriefGeneratorService,
  LocalKnowledgeSearchEngineService
} from './services';

// Export singleton instances for application-wide use
export const documentAnalyzer = new LocalDocumentAnalyzerService();
export const knowledgeExtractor = new LocalKnowledgeExtractorService();
export const objectionMatcher = new LocalObjectionMatcherService();
export const doctorMemoryEngine = new LocalDoctorMemoryEngineService();
export const predictionEngine = new LocalPredictionEngineService();
export const visitBriefGenerator = new LocalVisitBriefGeneratorService();
export const knowledgeSearchEngine = new LocalKnowledgeSearchEngineService();
