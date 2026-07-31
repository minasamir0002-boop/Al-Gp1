/**
 * Sales Intelligence Screen
 */

import React from 'react';
import { SalesIntelligenceView } from '../components/Intelligence/SalesIntelligenceView';

export const SalesIntelligenceScreen: React.FC = React.memo(() => {
  return <SalesIntelligenceView />;
});

SalesIntelligenceScreen.displayName = 'SalesIntelligenceScreen';
