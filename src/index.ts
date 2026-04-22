import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { authRouter } from './domain/auth/router';
import { authenticateRequest } from './middleware/auth';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs, resolvers } from './graphql';
import { Express } from 'express';
import { domainRoutes } from './routes/domain.routes';

const app: Express = express();
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

const startServer = async () => {
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  // Apply GraphQL middleware before authenticateRequest so the playground is accessible
  server.applyMiddleware({ app: app as any });

  app.use(authenticateRequest);
  // Apply domain routes after authentication middleware so they are protected, but playground is not
  domainRoutes(app);
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}${server.graphqlPath}`);
  });
};

startServer().catch((err) => {
  console.error('Error starting server:', err);
});
