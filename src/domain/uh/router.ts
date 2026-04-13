import { Router } from 'express';
import { z } from 'zod';
import * as repo from './repository';
import { parsePaginationParams } from '../shared/pagination';

export const uhRouter = Router();

const UhCaracteristicaInputSchema = z.object({
  idcaracteristica: z.number().int().positive(),
  isprincipal: z.number().int().min(0).max(1).default(0),
});

const UhBodySchema = z.object({
  idempresa: z.number().int().positive(),
  cduh: z.string().min(1).max(20),
  dsuh: z.string().min(1).max(255),
  iduhtipo: z.number().int().positive().nullable().default(null),
  nmandar: z.string().max(100).nullable().default(null),
  nmedificacao: z.string().max(100).nullable().default(null),
  qtquarto: z.number().int().min(1).default(1),
  iduhclassificacao: z.number().int().min(1).default(1),
  isativo: z.number().int().min(0).max(1).default(1),
  isacessibilidade: z.number().int().min(0).max(1).default(0),
  caracteristicas: z.array(UhCaracteristicaInputSchema).default([]),
});

const UhUpdateSchema = UhBodySchema.extend({
  iduh: z.number().int().positive(),
});

// GET /TUhController/GetAll
// Accepts optional header "empresas" to filter by empresa
uhRouter.get('/GetAll', async (req, res) => {
  const empresaId = req.headers['empresas']
    ? Number(req.headers['empresas'])
    : undefined;
  const pagination = parsePaginationParams({
    page: req.query.page,
    pageCount: req.query.pageCount,
    limit: req.query.limit,
  });

  try {
    const data = await repo.getAll(
      empresaId && Number.isInteger(empresaId) ? empresaId : undefined,
      pagination,
    );
    res.json(data);
  } catch (err) {
    console.error('[Uh] GetAll error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /TUhController/GetById?id=X
uhRouter.get('/GetById', async (req, res) => {
  const id = Number(req.query.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ message: 'Invalid id' });
    return;
  }
  try {
    const data = await repo.getById(id);
    if (!data) {
      res.status(404).json({ message: 'Uh not found' });
      return;
    }
    res.json(data);
  } catch (err) {
    console.error('[Uh] GetById error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /TUhController/
uhRouter.post('/', async (req, res) => {
  const parsed = UhBodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid body', errors: parsed.error.flatten() });
    return;
  }
  try {
    const data = await repo.post(parsed.data);
    res.status(201).json(data);
  } catch (err) {
    console.error('[Uh] Save error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT /TUhController/
uhRouter.put('/', async (req, res) => {
  const parsed = UhUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid body', errors: parsed.error.flatten() });
    return;
  }
  try {
    const data = await repo.put(parsed.data);
    if (!data) {
      res.status(404).json({ message: 'Uh not found' });
      return;
    }
    res.json(data);
  } catch (err) {
    console.error('[Uh] Update error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE /TUhController/?id=X
uhRouter.delete('/', async (req, res) => {
  const id = Number(req.query.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ message: 'Invalid id' });
    return;
  }
  try {
    await repo.deleteById(id);
    res.status(204).send();
  } catch (err) {
    console.error('[Uh] Delete error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});
