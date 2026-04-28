import * as repo from './repository';
import type { CheckInCreate, CheckInUpdate } from './schema';

export class CheckInCheckOutService {
  async findAll(idreserva?: number) {
    return repo.getAll(idreserva);
  }

  async findById(id: string) {
    return repo.getById(Number(id));
  }

  async create(data: CheckInCreate) {
    return repo.post(data);
  }

  async update(id: string, data: CheckInUpdate) {
    return repo.put({ ...data, idcheckin: Number(id) });
  }

  async delete(id: string) {
    return repo.deleteById(Number(id));
  }
}
