import express from 'express';
import cors from 'cors';
import { createServer, type Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import { Store } from './store';
import { hospitalsRouter } from './routes/hospitals';
import { incidentsRouter } from './routes/incidents';
import { routingRouter } from './routes/routing';

export function createApp(frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000') {
  const app = express();
  const httpServer: HttpServer = createServer(app);
  const io = new Server(httpServer, { cors: { origin: frontendUrl, methods: ['GET', 'POST'] } });
  const store = new Store();

  app.use(cors({ origin: frontendUrl }));
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString(), uptime: process.uptime() });
  });
  app.use('/api/hospitals', hospitalsRouter(store, io));
  app.use('/api/incidents', incidentsRouter(store, io));
  app.use('/api/routing', routingRouter(store));

  io.on('connection', (socket) => {
    socket.on('join:city', ({ city }: { city: string }) => {
      socket.join(`city:${city}`);
      socket.emit('joined', { city, socketId: socket.id });
    });
    socket.on('leave:city', ({ city }: { city: string }) => socket.leave(`city:${city}`));
  });

  return { app, httpServer, io, store };
}
