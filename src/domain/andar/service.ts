import * as repo from './repository';
import type { PaginationParams } from '../shared/pagination';

const DEFAULT_PAGINATION: PaginationParams = { page: 1, pageCount: 100, limit: 100 };

export class AndarService {
  async findAll() {
    return repo.getAll(undefined, DEFAULT_PAGINATION);
  }

  async findById(id: string) {
    return repo.getById(Number(id));
  }

  async create(data: Record<string, unknown>) {
    return repo.post(data as Parameters<typeof repo.post>[0]);
  }

  async update(id: string, data: Record<string, unknown>) {
    return repo.put({ ...data, idandar: Number(id) } as Parameters<typeof repo.put>[0]);
  }

  async delete(id: string) {
    return repo.deleteById(Number(id));
  }
}