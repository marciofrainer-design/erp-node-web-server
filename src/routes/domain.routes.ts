import { Express } from 'express';

import { empresaRouter } from '../domain/empresa/router';
import { andarRouter } from '../domain/andar/router';
import { uhTipoRouter } from '../domain/uhTipo/router';
import { uhRouter } from '../domain/uh/router';
import { edificacaoRouter } from '../domain/edificacao/router';
import { uhclassificacaoRouter } from '../domain/uhclassificacao/router';
import { caracteristicaRouter } from '../domain/caracteristica/router';
import { hospedesRouter } from '../domain/hospedes/router';
import { reservasRouter } from '../domain/reservas/router';
import { checkinRouter } from '../domain/checkin_checkout/router';

export const domainRoutes = (app: Express) => {
  app.use('/TEmpresaController', empresaRouter);
  app.use('/TAndarController', andarRouter);
  app.use('/TUhTipoController', uhTipoRouter);
  app.use('/TUhController', uhRouter);
  app.use('/TEdificacaoController', edificacaoRouter);
  app.use('/TUhclassificacaoController', uhclassificacaoRouter);
  app.use('/TCaracteristicaController', caracteristicaRouter);
  app.use('/THospedesController', hospedesRouter);
  app.use('/TReservasController', reservasRouter);
  app.use('/TCheckinController', checkinRouter);
}