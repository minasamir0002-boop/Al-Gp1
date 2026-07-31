/**
 * Visit Repository
 * Repository pattern implementation for Visit record creation & queries.
 */

import { Visit } from '../../models';
import { dbGetVisits, dbCreateVisit } from '../../lib/db';
import { firebaseSyncAdapter } from '../sync/firebaseSyncAdapter';

export class VisitRepository {
  public getAll(): Visit[] {
    return dbGetVisits();
  }

  public getById(id: string): Visit | undefined {
    return dbGetVisits().find(v => v.id === id);
  }

  public getByDoctorId(doctorId: string): Visit[] {
    return dbGetVisits().filter(v => v.doctorId === doctorId);
  }

  public create(visit: Visit): Visit {
    dbCreateVisit(visit);
    firebaseSyncAdapter.enqueueForSync(visit);
    return visit;
  }
}

export const visitRepository = new VisitRepository();
