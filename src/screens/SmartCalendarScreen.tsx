/**
 * Smart Calendar Screen
 */

import React from 'react';
import { SmartCalendarView } from '../components/Calendar/SmartCalendarView';

export const SmartCalendarScreen: React.FC = React.memo(() => {
  return <SmartCalendarView />;
});

SmartCalendarScreen.displayName = 'SmartCalendarScreen';
