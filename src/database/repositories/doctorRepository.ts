/**
 * Doctor Repository
 * Repository pattern implementation for Doctor CRUD operations & query filtering.
 */

import { Doctor } from '../../models';
import { dbGetDoctors, dbCreateDoctor, dbUpdateDoctor, dbDeleteDoctor } from '../../lib/db';
import { firebaseSyncAdapter } from '../sync/firebaseSyncAdapter';

export class DoctorRepository {
  public getAll(): Doctor[] {
    return dbGetDoctors();
  }

  public getById(id: string): Doctor | undefined {
    return dbGetDoctors().find(d => d.id === id);
  }

  public create(doctor: Doctor): Doctor {
    dbCreateDoctor(doctor);
    firebaseSyncAdapter.enqueueForSync(doctor);
    return doctor;
  }

  public update(doctor: Doctor): Doctor {
    dbUpdateDoctor(doctor);
    firebaseSyncAdapter.enqueueForSync(doctor);
    return doctor;
  }

  public delete(id: string): void {
    dbDeleteDoctor(id);
  }

  public filterBySpecialty(specialty: string): Doctor[] {
    const doctors = this.getAll();
    if (!specialty || specialty === 'All') return doctors;
    return doctors.filter(d => d.specialty === specialty);
  }

  public filterBySearch(query: string): Doctor[] {
    const doctors = this.getAll();
    if (!query) return doctors;
    const q = query.toLowerCase();
    return doctors.filter(
      d =>
        d.name.toLowerCase().includes(q) ||
        d.hospital.toLowerCase().includes(q) ||
        d.specialty.toLowerCase().includes(q)
    );
  }
}

export const doctorRepository = new DoctorRepository();
