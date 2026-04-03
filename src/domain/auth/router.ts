import { Router } from 'express';
import { z } from 'zod';
import { authenticateRequest } from '../../middleware/auth';
import { AuthenticationError, getCurrentUser, login } from './service';

export const authRouter = Router();

const LoginSchema = z.object({
  login: z.string().min(1),
  password: z.string().min(1),
});

authRouter.post('/Login', async (req, res) => {
  const parsed = LoginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid body', errors: parsed.error.flatten() });
    return;
  }

  try {
    const result = await login(parsed.data.login, parsed.data.password);
    res.json(result);
  } catch (err) {
    if (err instanceof AuthenticationError) {
      res.status(401).json({ message: err.message });
      return;
    }

    console.error('[Auth] Login error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

authRouter.get('/Me', authenticateRequest, async (_req, res) => {
  try {
    const currentUserId = Number(res.locals.authUser.sub);
    const user = await getCurrentUser(currentUserId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json(user);
  } catch (err) {
    console.error('[Auth] Me error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});