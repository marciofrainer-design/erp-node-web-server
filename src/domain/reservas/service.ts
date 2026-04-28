import * as repo from './repository';
import type { ReservaCreate, ReservaUpdate } from './schema';

export class ReservaService {
  async findAll(idempresa?: number) {
    return repo.getAll(idempresa);
  }

  async findById(id: string) {
    return repo.getById(Number(id));
  }

  async create(data: ReservaCreate) {
    return repo.post(data);
  }

  async update(id: string, data: ReservaUpdate) {
    return repo.put({ ...data, idreserva: Number(id) });
  }

  async delete(id: string) {
    return repo.deleteById(Number(id));
  }
}
