/**
 * Dashboard Screen
 * Screen component for main rep dashboard view with pull-to-refresh & performance memoization.
 */

import React from 'react';
import { DashboardView } from '../components/Dashboard/DashboardView';

export const DashboardScreen: React.FC = React.memo(() => {
  return <DashboardView />;
});

DashboardScreen.displayName = 'DashboardScreen';
