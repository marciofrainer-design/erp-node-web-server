import { Router } from 'express';
import { CheckInCheckOutService } from './service';

const router = Router();
const service = new CheckInCheckOutService();

router.get('/GetAll', async (_req, res) => {
  const result = await service.findAll();
  res.json(result);
});

router.get('/GetById', async (req, res) => {
  const id = String((req.query as { id?: string }).id ?? (req.params as { id?: string }).id);
  const result = await service.findById(id);
  res.json(result);
});

router.post('/', async (req, res) => {
  const result = await service.create(req.body);
  res.status(201).json(result);
});

router.put('/', async (req, res) => {
  const result = await service.update(String(req.body.id), req.body);
  res.json(result);
});

router.delete('/', async (req, res) => {
  const id = String(req.query.id ?? req.body.id);
  await service.delete(id);
  res.status(204).send();
});

export const checkinRouter = router;
