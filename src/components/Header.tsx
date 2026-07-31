/**
 * Header Component (Top App Bar Wrapper)
 * Retains compatibility with legacy imports while delegating to the production TopAppBar.
 */

import React from 'react';
import { TopAppBar } from './common/TopAppBar';

export const Header: React.FC = () => {
  return <TopAppBar />;
};
