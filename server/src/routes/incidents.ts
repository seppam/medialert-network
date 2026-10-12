import { Router } from 'express';
import type { Server } from 'socket.io';
import { detectCritical, routePatient, type Incident } from '@medialert/shared';
import type { Store } from '../store';

const SEVERITIES = ['critical', 'high', 'medium', 'low'] as const;
type IncidentInput = Pick<Incident, 'injuryType' | 'severity' | 'pickupLat' | 'pickupLng' | 'vitalSigns' | 'chiefComplaint'>;

export function parseIncidentInput(body: any): { value: IncidentInput } | { error: string } {
  const { injuryType, severity = 'medium', vitalSigns, chiefComplaint } = body ?? {};
  const pickupLat = Number(body?.pickupLat);
  const pickupLng = Number(body?.pickupLng);
  if (typeof injuryType !== 'string' || !injuryType || body?.pickupLat == null || body?.pickupLng == null) {
    return { error: 'Missing required fields: injuryType, pickupLat, pickupLng' };
  }
  if (!Number.isFinite(pickupLat) || !Number.isFinite(pickupLng) || Math.abs(pickupLat) > 90 || Math.abs(pickupLng) > 180) {
    return { error: 'pickupLat/pickupLng must be valid coordinates' };
  }
  if (!SEVERITIES.includes(severity)) {
    return { error: `severity must be one of: ${SEVERITIES.join(', ')}` };
  }
  return {
    value: {
      injuryType,
      severity,
      pickupLat,
      pickupLng,
      vitalSigns: vitalSigns && typeof vitalSigns === 'object' ? vitalSigns : undefined,
      chiefComplaint: typeof chiefComplaint === 'string' ? chiefComplaint.slice(0, 500) : undefined,
    },
  };
}

export function incidentsRouter(store: Store, io: Server): Router {
  const router = Router();
  let counter = 0;

  /** Create an incident, pick a hospital, reserve a bed and broadcast. */
  function createIncident(input: IncidentInput) {
    const incident: Incident = {
      id: `inc-${Date.now()}-${++counter}`,
      ...input,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    const routing = routePatient(incident, store.hospitals);
    if (routing.recommended) {
      const h = store.hospitals.find((x) => x.id === routing.recommended!.hospitalId)!;
      h.availableErBeds = Math.max(0, h.availableErBeds - 1);
      if (detectCritical(incident)) h.availableIcuBeds = Math.max(0, h.availableIcuBeds - 1);
      incident.destinationId = h.id;
      incident.etaMinutes = routing.recommended.etaMinutes;
      incident.assignedAt = new Date().toISOString();
      incident.status = 'assigned';
      io.to(`city:${h.city}`).emit('hospital:capacity_change', {
        hospitalId: h.id,
        availableErBeds: h.availableErBeds,
        availableIcuBeds: h.availableIcuBeds,
        availableOrRooms: h.availableOrRooms,
        timestamp: new Date().toISOString(),
      });
    }
    store.incidents.unshift(incident);
    io.to('city:Jakarta').emit('incident:new', { incident });
    return { incident, routing };
  }

  router.get('/', (req, res) => {
    const { status } = req.query;
    // Default: "active" = anything that has not arrived or been cancelled.
    const list = status
      ? store.incidents.filter((i) => i.status === status)
      : store.incidents.filter((i) => i.status !== 'arrived' && i.status !== 'cancelled');
    res.json({ incidents: list, count: list.length });
  });

  router.post('/', (req, res) => {
    const parsed = parseIncidentInput(req.body);
    if ('error' in parsed) return res.status(400).json({ error: parsed.error });
    const { incident, routing } = createIncident(parsed.value);
    res.status(201).json({ incident, routing });
  });

  // Demo scenario: three simultaneous incidents (building collapse).
  router.post('/mass-casualty', (_req, res) => {
    const base = { pickupLat: -6.2088, pickupLng: 106.8456 };
    const scenario: IncidentInput[] = [
      { ...base, injuryType: 'trauma', severity: 'critical' },
      { ...base, injuryType: 'fracture', severity: 'high' },
      { ...base, injuryType: 'respiratory', severity: 'critical', vitalSigns: { spo2: 86 } },
    ];
    const results = scenario.map(createIncident);
    io.to('city:Jakarta').emit('alert:mass_casualty', { incidentCount: results.length });
    res.status(201).json({ incidents: results.map((r) => r.incident) });
  });

  router.post('/reset', (_req, res) => {
    store.reset();
    io.to('city:Jakarta').emit('state:reset', {});
    res.json({ success: true });
  });

  router.get('/:id', (req, res) => {
    const incident = store.incidents.find((i) => i.id === req.params.id);
    if (!incident) return res.status(404).json({ error: 'Incident not found' });
    res.json({ incident });
  });

  router.patch('/:id/arrive', (req, res) => {
    const incident = store.incidents.find((i) => i.id === req.params.id);
    if (!incident) return res.status(404).json({ error: 'Incident not found' });
    incident.status = 'arrived';
    io.to('city:Jakarta').emit('incident:arrived', {
      incidentId: incident.id,
      hospitalId: incident.destinationId,
      timestamp: new Date().toISOString(),
    });
    res.json({ incident });
  });

  return router;
}
