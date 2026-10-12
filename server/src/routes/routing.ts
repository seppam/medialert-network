import { Router } from 'express';
import { routePatient, type Incident } from '@medialert/shared';
import type { Store } from '../store';
import { parseIncidentInput } from './incidents';

export function routingRouter(store: Store): Router {
  const router = Router();

  // Stateless recommendation: does not create an incident or reserve beds.
  router.post('/recommend', (req, res) => {
    const parsed = parseIncidentInput(req.body);
    if ('error' in parsed) return res.status(400).json({ error: parsed.error });
    const incident: Incident = {
      id: `inc-${Date.now()}`,
      ...parsed.value,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    res.json(routePatient(incident, store.hospitals));
  });

  router.get('/specialties', (_req, res) => {
    res.json({
      specialties: ['cardiology', 'neurology', 'orthopedics', 'trauma', 'respiratory', 'pediatric', 'general'],
    });
  });

  return router;
}
