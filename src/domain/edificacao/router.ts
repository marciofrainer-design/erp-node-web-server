import { Router } from 'express';
import { z } from 'zod';
import * as repo from './repository';
import { parsePaginationParams } from '../shared/pagination';

export const edificacaoRouter = Router();

const EdificacaoBodySchema = z.object({
  idempresa: z.number().int().positive(),
  cdedificacao: z.string().min(1),
  nmedificacao: z.string().min(1),
  isativo: z.number().int().min(0).max(1),
});

const EdificacaoUpdateSchema = EdificacaoBodySchema.extend({
  idedificacao: z.number().int().positive(),
});

// GET /TEdificacaoController/GetAll
edificacaoRouter.get('/GetAll', async (req, res) => {
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
    console.error('[Edificacao] GetAll error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /TEdificacaoController/GetById?id=X
edificacaoRouter.get('/GetById', async (req, res) => {
  const id = Number(req.query.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ message: 'Invalid id' });
    return;
  }
  try {
    const data = await repo.getById(id);
    if (!data) {
      res.status(404).json({ message: 'Edificacao not found' });
      return;
    }
    res.json(data);
  } catch (err) {
    console.error('[Edificacao] GetById error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /TEdificacaoController/
edificacaoRouter.post('/', async (req, res) => {
  const parsed = EdificacaoBodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid body', errors: parsed.error.flatten() });
    return;
  }
  try {
    const data = await repo.post(parsed.data);
    res.status(201).json(data);
  } catch (err) {
    console.error('[Edificacao] Save error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT /TEdificacaoController/
edificacaoRouter.put('/', async (req, res) => {
  const parsed = EdificacaoUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid body', errors: parsed.error.flatten() });
    return;
  }
  try {
    const data = await repo.put(parsed.data);
    if (!data) {
      res.status(404).json({ message: 'Edificacao not found' });
      return;
    }
    res.json(data);
  } catch (err) {
    console.error('[Edificacao] Update error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE /TEdificacaoController/:id
edificacaoRouter.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ message: 'Invalid id' });
    return;
  }
  try {
    await repo.delete(id);
    res.status(204).send();
  } catch (err) {
    console.error('[Edificacao] Delete error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});
