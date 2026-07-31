/**
 * Navigation Component (Bottom App Bar Wrapper)
 * Retains compatibility with legacy imports while delegating to the production BottomNavigation.
 */

import React from 'react';
import { BottomNavigation } from './common/BottomNavigation';

export const Navigation: React.FC = () => {
  return <BottomNavigation />;
};
