import { Router, type Request, type Response } from 'express';
import type { Server } from 'socket.io';
import type { Store } from '../store';

const isCount = (v: unknown, max: number): v is number =>
  typeof v === 'number' && Number.isInteger(v) && v >= 0 && v <= max;

export function hospitalsRouter(store: Store, io: Server): Router {
  const router = Router();

  router.get('/', (req: Request, res: Response) => {
    const { city } = req.query;
    let result = [...store.hospitals];
    if (city) result = result.filter((h) => h.city.toLowerCase() === String(city).toLowerCase());
    res.json({ hospitals: result, count: result.length });
  });

  router.get('/:id', (req, res) => {
    const hospital = store.hospitals.find((h) => h.id === req.params.id);
    if (!hospital) return res.status(404).json({ error: 'Hospital not found' });
    res.json({ hospital });
  });

  router.get('/:id/capacity', (req, res) => {
    const h = store.hospitals.find((x) => x.id === req.params.id);
    if (!h) return res.status(404).json({ error: 'Hospital not found' });
    res.json({
      hospitalId: h.id,
      erBeds: { total: h.totalErBeds, available: h.availableErBeds },
      icuBeds: { total: h.totalIcuBeds, available: h.availableIcuBeds },
      orRooms: { total: h.totalOrRooms, available: h.availableOrRooms },
      specialists: h.specialists.filter((s) => s.available),
      generatorStatus: h.hasGenerator,
      generatorFuelHours: h.generatorFuelHours,
      lastUpdated: new Date().toISOString(),
    });
  });

  router.patch('/:id/capacity', (req, res) => {
    const h = store.hospitals.find((x) => x.id === req.params.id);
    if (!h) return res.status(404).json({ error: 'Hospital not found' });

    const { availableErBeds, availableIcuBeds, availableOrRooms, specialistUpdates } = req.body ?? {};
    if (availableErBeds !== undefined && !isCount(availableErBeds, h.totalErBeds))
      return res.status(400).json({ error: `availableErBeds must be an integer 0-${h.totalErBeds}` });
    if (availableIcuBeds !== undefined && !isCount(availableIcuBeds, h.totalIcuBeds))
      return res.status(400).json({ error: `availableIcuBeds must be an integer 0-${h.totalIcuBeds}` });
    if (availableOrRooms !== undefined && !isCount(availableOrRooms, h.totalOrRooms))
      return res.status(400).json({ error: `availableOrRooms must be an integer 0-${h.totalOrRooms}` });

    if (availableErBeds !== undefined) h.availableErBeds = availableErBeds;
    if (availableIcuBeds !== undefined) h.availableIcuBeds = availableIcuBeds;
    if (availableOrRooms !== undefined) h.availableOrRooms = availableOrRooms;
    if (Array.isArray(specialistUpdates)) {
      for (const u of specialistUpdates) {
        const spec = h.specialists.find((s) => s.specialty === u?.specialty);
        if (spec && typeof u.available === 'boolean') spec.available = u.available;
      }
    }

    io.to(`city:${h.city}`).emit('hospital:capacity_change', {
      hospitalId: h.id,
      availableErBeds: h.availableErBeds,
      availableIcuBeds: h.availableIcuBeds,
      availableOrRooms: h.availableOrRooms,
      timestamp: new Date().toISOString(),
    });
    res.json({ success: true, hospital: h });
  });

  return router;
}
