/**
 * Notifications & Smart Alerts Screen
 */

import React from 'react';
import { NotificationsView } from '../components/Notifications/NotificationsView';

export const NotificationsScreen: React.FC = React.memo(() => {
  return <NotificationsView />;
});

NotificationsScreen.displayName = 'NotificationsScreen';
