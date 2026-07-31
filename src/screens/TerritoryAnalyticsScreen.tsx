/**
 * Territory Analytics Screen
 */

import React from 'react';
import { TerritoryAnalyticsView } from '../components/Analytics/TerritoryAnalyticsView';

export const TerritoryAnalyticsScreen: React.FC = React.memo(() => {
  return <TerritoryAnalyticsView />;
});

TerritoryAnalyticsScreen.displayName = 'TerritoryAnalyticsScreen';
