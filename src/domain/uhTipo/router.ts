import { Router } from 'express';
import { z } from 'zod';
import * as repo from './repository';
import { parsePaginationParams } from '../shared/pagination';

export const uhTipoRouter = Router();

const UhTipoBodySchema = z.object({
  idempresa: z.number().int().positive(),
  cduhtipo: z.string().min(1),
  nmuhtipo: z.string().min(1),
  dsuhtipo: z.string().nullable().default(null),
  iduhtipogrupo: z.number().int().positive().nullable().default(null),
  idpai: z.number().int().positive().nullable().default(null),
  qtleito: z.number().int().min(1).default(1),
  fltipocobranca: z.number().int().min(0).max(9).default(1),
  flsituacao: z.number().int().min(0).max(1).default(1),
});

const UhTipoUpdateSchema = UhTipoBodySchema.extend({
  iduhtipo: z.number().int().positive(),
});

// GET /TUhTipoController/GetAll
// Accepts optional header "empresas" to filter by empresa
uhTipoRouter.get('/GetAll', async (req, res) => {
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
    console.error('[UhTipo] GetAll error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /TUhTipoController/GetById?id=X
uhTipoRouter.get('/GetById', async (req, res) => {
  const id = Number(req.query.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ message: 'Invalid id' });
    return;
  }
  try {
    const data = await repo.getById(id);
    if (!data) {
      res.status(404).json({ message: 'UhTipo not found' });
      return;
    }
    res.json(data);
  } catch (err) {
    console.error('[UhTipo] GetById error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /TUhTipoController/
uhTipoRouter.post('/', async (req, res) => {
  const parsed = UhTipoBodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid body', errors: parsed.error.flatten() });
    return;
  }
  try {
    const data = await repo.post(parsed.data);
    res.status(201).json(data);
  } catch (err) {
    console.error('[UhTipo] Save error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT /TUhTipoController/
uhTipoRouter.put('/', async (req, res) => {
  const parsed = UhTipoUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid body', errors: parsed.error.flatten() });
    return;
  }
  try {
    const data = await repo.put(parsed.data);
    if (!data) {
      res.status(404).json({ message: 'UhTipo not found' });
      return;
    }
    res.json(data);
  } catch (err) {
    console.error('[UhTipo] Update error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE /TUhTipoController/?id=X
uhTipoRouter.delete('/', async (req, res) => {
  const id = Number(req.query.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ message: 'Invalid id' });
    return;
  }
  try {
    await repo.deleteById(id);
    res.status(204).send();
  } catch (err) {
    console.error('[UhTipo] Delete error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});
