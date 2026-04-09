import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { authRouter } from './domain/auth/router';
import { empresaRouter } from './domain/empresa/router';
import { andarRouter } from './domain/andar/router';
import { uhTipoRouter } from './domain/uhTipo/router';
import { uhRouter } from './domain/uh/router';
import { edificacaoRouter } from './domain/edificacao/router';
import { uhclassificacaoRouter } from './domain/uhclassificacao/router';
import { caracteristicaRouter } from './domain/caracteristica/router';
import { authenticateRequest } from './middleware/auth';

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const SIMULATED_REQUEST_DELAY_MS = 0;

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin ${origin} not allowed`));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type', 'empresas'],
  }),
);
app.use(express.json());

app.use(async (req, _res, next) => {
  if (req.method === 'OPTIONS' || SIMULATED_REQUEST_DELAY_MS <= 0) {
    next();
    return;
  }

  await new Promise((resolve) => setTimeout(resolve, SIMULATED_REQUEST_DELAY_MS));
  next();
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/TAuthController', authRouter);
app.use(authenticateRequest);

app.use('/TEmpresaController', empresaRouter);
app.use('/TAndarController', andarRouter);
app.use('/TUhTipoController', uhTipoRouter);
app.use('/TUhController', uhRouter);
app.use('/TEdificacaoController', edificacaoRouter);
app.use('/TUhclassificacaoController', uhclassificacaoRouter);
app.use('/TCaracteristicaController', caracteristicaRouter);

app.use((_req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`[Server] Running on http://localhost:${PORT}`);
});
