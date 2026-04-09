import { Router } from 'express';
import { z } from 'zod';
import * as repo from './repository';
import { parsePaginationParams } from '../shared/pagination';

export const caracteristicaRouter = Router();

const CaracteristicaBodySchema = z.object({
  idempresa: z.number().int().positive(),
  dscaracteristica: z.string().min(1),
  dsabreviatura: z.string().min(1),
  fltipo: z.number().int().min(1),
  idcaracteristica_emp: z.number().int().nonnegative(),
  flsituacao: z.number().int().min(0).max(1),
});

const CaracteristicaUpdateSchema = CaracteristicaBodySchema.extend({
  idcaracteristica: z.number().int().positive(),
});

// GET /TCaracteristicaController/GetAll
caracteristicaRouter.get('/GetAll', async (req, res) => {
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
    console.error('[Caracteristica] GetAll error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /TCaracteristicaController/GetById?id=X
caracteristicaRouter.get('/GetById', async (req, res) => {
  const id = Number(req.query.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ message: 'Invalid id' });
    return;
  }
  try {
    const data = await repo.getById(id);
    if (!data) {
      res.status(404).json({ message: 'Caracteristica not found' });
      return;
    }
    res.json(data);
  } catch (err) {
    console.error('[Caracteristica] GetById error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /TCaracteristicaController/
caracteristicaRouter.post('/', async (req, res) => {
  const parsed = CaracteristicaBodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid body', errors: parsed.error.flatten() });
    return;
  }
  try {
    const data = await repo.post(parsed.data);
    res.status(201).json(data);
  } catch (err) {
    console.error('[Caracteristica] Save error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT /TCaracteristicaController/
caracteristicaRouter.put('/', async (req, res) => {
  const parsed = CaracteristicaUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid body', errors: parsed.error.flatten() });
    return;
  }
  try {
    const data = await repo.put(parsed.data);
    if (!data) {
      res.status(404).json({ message: 'Caracteristica not found' });
      return;
    }
    res.json(data);
  } catch (err) {
    console.error('[Caracteristica] Update error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE /TCaracteristicaController/:id
caracteristicaRouter.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ message: 'Invalid id' });
    return;
  }
  try {
    await repo.delete(id);
    res.status(204).send();
  } catch (err) {
    console.error('[Caracteristica] Delete error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});
