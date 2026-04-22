import { Router } from 'express';
import { ReservaService } from './service';

const router = Router();
const service = new ReservaService();

router.get('/', async (req, res) => {
  const result = await service.findAll();
  res.json(result);
});

router.get('/:id', async (req, res) => {
  const result = await service.findById(req.params.id);
  res.json(result);
});

router.post('/', async (req, res) => {
  const result = await service.create(req.body);
  res.status(201).json(result);
});

router.put('/:id', async (req, res) => {
  const result = await service.update(req.params.id, req.body);
  res.json(result);
});

router.delete('/:id', async (req, res) => {
  await service.delete(req.params.id);
  res.status(204).send();
});

export default router;