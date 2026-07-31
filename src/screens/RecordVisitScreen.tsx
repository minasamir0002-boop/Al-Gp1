/**
 * Record Visit Screen
 */

import React from 'react';
import { RecordVisitView } from '../components/RecordVisit/RecordVisitView';

export const RecordVisitScreen: React.FC = React.memo(() => {
  return <RecordVisitView />;
});

RecordVisitScreen.displayName = 'RecordVisitScreen';
