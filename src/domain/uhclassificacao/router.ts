import { Router } from 'express';
import { z } from 'zod';
import * as repo from './repository';
import { parsePaginationParams } from '../shared/pagination';

export const uhclassificacaoRouter = Router();

const UhClassificacaoBodySchema = z.object({
  idempresa: z.number().int().positive(),
  dsidentificador: z.string().min(1),
  nmclassificacao: z.string().min(1),
  isativo: z.number().int().min(0).max(1),
});

const UhClassificacaoUpdateSchema = UhClassificacaoBodySchema.extend({
  iduhclassificacao: z.number().int().positive(),
});

// GET /TUhclassificacaoController/GetAll
uhclassificacaoRouter.get('/GetAll', async (req, res) => {
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
    console.error('[UhClassificacao] GetAll error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /TUhclassificacaoController/GetById?id=X
uhclassificacaoRouter.get('/GetById', async (req, res) => {
  const id = Number(req.query.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ message: 'Invalid id' });
    return;
  }
  try {
    const data = await repo.getById(id);
    if (!data) {
      res.status(404).json({ message: 'UhClassificacao not found' });
      return;
    }
    res.json(data);
  } catch (err) {
    console.error('[UhClassificacao] GetById error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /TUhclassificacaoController/
uhclassificacaoRouter.post('/', async (req, res) => {
  const parsed = UhClassificacaoBodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid body', errors: parsed.error.flatten() });
    return;
  }
  try {
    const data = await repo.post(parsed.data);
    res.status(201).json(data);
  } catch (err) {
    console.error('[UhClassificacao] Save error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT /TUhclassificacaoController/
uhclassificacaoRouter.put('/', async (req, res) => {
  const parsed = UhClassificacaoUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid body', errors: parsed.error.flatten() });
    return;
  }
  try {
    const data = await repo.put(parsed.data);
    if (!data) {
      res.status(404).json({ message: 'UhClassificacao not found' });
      return;
    }
    res.json(data);
  } catch (err) {
    console.error('[UhClassificacao] Update error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE /TUhclassificacaoController/:id
uhclassificacaoRouter.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ message: 'Invalid id' });
    return;
  }
  try {
    await repo.delete(id);
    res.status(204).send();
  } catch (err) {
    console.error('[UhClassificacao] Delete error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});
