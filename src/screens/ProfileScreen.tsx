/**
 * Rep Profile Screen
 */

import React from 'react';
import { ProfileView } from '../components/Profile/ProfileView';

export const ProfileScreen: React.FC = React.memo(() => {
  return <ProfileView />;
});

ProfileScreen.displayName = 'ProfileScreen';
