import { Router } from 'express';
import { z } from 'zod';
import * as repo from './repository';

export const andarRouter = Router();

const AndarBodySchema = z.object({
  idempresa: z.number().int().positive(),
  cdandar: z.string().min(1),
  nmandar: z.string().min(1),
  isativo: z.number().int().min(0).max(1),
});

const AndarUpdateSchema = AndarBodySchema.extend({
  idandar: z.number().int().positive(),
});

// GET /TAndarController/GetAll
// Accepts optional header "empresas" to filter by empresa
andarRouter.get('/GetAll', async (req, res) => {
  const empresaId = req.headers['empresas']
    ? Number(req.headers['empresas'])
    : undefined;
  try {
    const data = await repo.getAll(
      empresaId && Number.isInteger(empresaId) ? empresaId : undefined,
    );
    res.json(data);
  } catch (err) {
    console.error('[Andar] GetAll error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /TAndarController/GetById?id=X
andarRouter.get('/GetById', async (req, res) => {
  const id = Number(req.query.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ message: 'Invalid id' });
    return;
  }
  try {
    const data = await repo.getById(id);
    if (!data) {
      res.status(404).json({ message: 'Andar not found' });
      return;
    }
    res.json(data);
  } catch (err) {
    console.error('[Andar] GetById error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /TAndarController/
andarRouter.post('/', async (req, res) => {
  const parsed = AndarBodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid body', errors: parsed.error.flatten() });
    return;
  }
  try {
    const data = await repo.save(parsed.data);
    res.status(201).json(data);
  } catch (err) {
    console.error('[Andar] Save error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT /TAndarController/
andarRouter.put('/', async (req, res) => {
  const parsed = AndarUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid body', errors: parsed.error.flatten() });
    return;
  }
  try {
    const data = await repo.update({ ...parsed.data, id: parsed.data.idandar, nmempresa: '' });
    if (!data) {
      res.status(404).json({ message: 'Andar not found' });
      return;
    }
    res.json(data);
  } catch (err) {
    console.error('[Andar] Update error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE /TAndarController/:id
andarRouter.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ message: 'Invalid id' });
    return;
  }
  try {
    await repo.remove(id);
    res.status(204).send();
  } catch (err) {
    console.error('[Andar] Delete error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});
