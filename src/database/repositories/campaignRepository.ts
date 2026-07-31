/**
 * Campaign Repository
 * Repository pattern implementation for Campaign management.
 */

import { Campaign } from '../../models';
import { dbGetCampaigns, dbCreateCampaign } from '../../lib/db';
import { firebaseSyncAdapter } from '../sync/firebaseSyncAdapter';

export class CampaignRepository {
  public getAll(): Campaign[] {
    return dbGetCampaigns();
  }

  public create(campaign: Omit<Campaign, 'id'>): Campaign {
    const created = dbCreateCampaign(campaign);
    firebaseSyncAdapter.enqueueForSync(created);
    return created;
  }
}

export const campaignRepository = new CampaignRepository();
