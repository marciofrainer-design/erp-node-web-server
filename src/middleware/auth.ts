import type { NextFunction, Request, Response } from 'express';
import { verifyAccessToken } from '../domain/auth/service';

export function authenticateRequest(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authorization = req.headers.authorization;
  if (!authorization?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Missing bearer token' });
    return;
  }

  try {
    const token = authorization.slice('Bearer '.length).trim();
    res.locals.authUser = verifyAccessToken(token);
    next();
  } catch (err) {
    console.error('[Auth] Token validation error:', err);
    res.status(401).json({ message: 'Invalid token' });
  }
}