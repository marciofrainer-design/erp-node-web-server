import { Router } from 'express';
import { z } from 'zod';
import * as repo from './repository';

export const empresaRouter = Router();

const EmpresaBodySchema = z.object({
  nmfantasia: z.string().min(1),
  cnpj: z.string().min(1),
  isativo: z.number().int().min(0).max(1),
});

const EmpresaUpdateSchema = EmpresaBodySchema.extend({
  idempresa: z.number().int().positive(),
});

// GET /TEmpresaController/GetAll
empresaRouter.get('/GetAll', async (_req, res) => {
  try {
    const data = await repo.getAll();
    res.json(data);
  } catch (err) {
    console.error('[Empresa] GetAll error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /TEmpresaController/GetById?id=X
empresaRouter.get('/GetById', async (req, res) => {
  const id = Number(req.query.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ message: 'Invalid id' });
    return;
  }
  try {
    const data = await repo.getById(id);
    if (!data) {
      res.status(404).json({ message: 'Empresa not found' });
      return;
    }
    res.json(data);
  } catch (err) {
    console.error('[Empresa] GetById error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /TEmpresaController/
empresaRouter.post('/', async (req, res) => {
  const parsed = EmpresaBodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid body', errors: parsed.error.flatten() });
    return;
  }
  try {
    const data = await repo.save(parsed.data);
    res.status(201).json(data);
  } catch (err) {
    console.error('[Empresa] Save error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT /TEmpresaController/
empresaRouter.put('/', async (req, res) => {
  const parsed = EmpresaUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid body', errors: parsed.error.flatten() });
    return;
  }
  try {
    const data = await repo.update({ ...parsed.data, id: parsed.data.idempresa });
    if (!data) {
      res.status(404).json({ message: 'Empresa not found' });
      return;
    }
    res.json(data);
  } catch (err) {
    console.error('[Empresa] Update error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE /TEmpresaController/:id
empresaRouter.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ message: 'Invalid id' });
    return;
  }
  try {
    await repo.remove(id);
    res.status(204).send();
  } catch (err) {
    console.error('[Empresa] Delete error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});
