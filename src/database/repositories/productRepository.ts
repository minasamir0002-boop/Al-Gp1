/**
 * Product Repository
 * Repository pattern implementation for Products & detailing library.
 */

import { Product } from '../../models';
import { dbGetProducts } from '../../lib/db';

export class ProductRepository {
  public getAll(): Product[] {
    return dbGetProducts();
  }

  public getById(id: string): Product | undefined {
    return dbGetProducts().find(p => p.id === id);
  }
}

export const productRepository = new ProductRepository();
