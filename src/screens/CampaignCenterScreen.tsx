/**
 * Campaign Center Screen
 */

import React from 'react';
import { CampaignCenterView } from '../components/Campaigns/CampaignCenterView';

export const CampaignCenterScreen: React.FC = React.memo(() => {
  return <CampaignCenterView />;
});

CampaignCenterScreen.displayName = 'CampaignCenterScreen';
