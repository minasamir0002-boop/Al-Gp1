import React, { useState } from 'react';
import { DocumentIntelligenceFlow } from './DocumentIntelligenceFlow';
import { PDFDocumentsDashboard } from './PDFManager/PDFDocumentsDashboard';

interface DocumentsSectionProps {
  initialOpenAiFlow?: boolean;
}

export const DocumentsSection: React.FC<DocumentsSectionProps> = ({ initialOpenAiFlow = false }) => {
  const [isAiFlowOpen, setIsAiFlowOpen] = useState<boolean>(initialOpenAiFlow);

  if (isAiFlowOpen) {
    return (
      <DocumentIntelligenceFlow
        onCancel={() => setIsAiFlowOpen(false)}
        onSaveToKnowledgeBase={() => {
          setIsAiFlowOpen(false);
        }}
      />
    );
  }

  return (
    <PDFDocumentsDashboard
      onOpenAiProcessor={() => setIsAiFlowOpen(true)}
    />
  );
};

