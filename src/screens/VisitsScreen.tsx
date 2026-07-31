/**
 * Visits Log Screen
 */

import React from 'react';
import { VisitsView } from '../components/Visits/VisitsView';

export const VisitsScreen: React.FC = React.memo(() => {
  return <VisitsView />;
});

VisitsScreen.displayName = 'VisitsScreen';
