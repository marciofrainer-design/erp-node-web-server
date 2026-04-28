import * as repo from './repository';
import type { HospedeCreate, HospedeUpdate } from './schema';

export class HospedeService {
  async findAll(idempresa?: number) {
    return repo.getAll(idempresa);
  }

  async findById(id: string) {
    return repo.getById(Number(id));
  }

  async create(data: HospedeCreate) {
    return repo.post(data);
  }

  async update(id: string, data: HospedeUpdate) {
    return repo.put({ ...data, idhospede: Number(id) });
  }

  async delete(id: string) {
    return repo.deleteById(Number(id));
  }
}
