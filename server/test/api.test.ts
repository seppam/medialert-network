import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import { io as connect, type Socket } from 'socket.io-client';
import type { AddressInfo } from 'net';
import { createApp } from '../src/app';

const ctx = createApp('http://localhost:3000');
let port = 0;

beforeAll(async () => {
  await new Promise<void>((r) => ctx.httpServer.listen(0, r));
  port = (ctx.httpServer.address() as AddressInfo).port;
});
afterAll(async () => {
  ctx.io.close();
});
beforeEach(() => ctx.store.reset());

describe('REST API', () => {
  it('health', async () => {
    const res = await request(ctx.app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('lists and filters hospitals', async () => {
    const all = await request(ctx.app).get('/api/hospitals?city=Jakarta');
    expect(all.body.count).toBe(8);
    const none = await request(ctx.app).get('/api/hospitals?city=Nowhere');
    expect(none.body.count).toBe(0);
    expect((await request(ctx.app).get('/api/hospitals/h-999')).status).toBe(404);
  });

  it('validates and applies capacity updates', async () => {
    const bad = await request(ctx.app).patch('/api/hospitals/h-001/capacity').send({ availableErBeds: 999 });
    expect(bad.status).toBe(400);
    const ok = await request(ctx.app).patch('/api/hospitals/h-001/capacity').send({ availableErBeds: 2 });
    expect(ok.status).toBe(200);
    const cap = await request(ctx.app).get('/api/hospitals/h-001/capacity');
    expect(cap.body.erBeds.available).toBe(2);
  });

  it('recommends a hospital and rejects bad input', async () => {
    const bad = await request(ctx.app).post('/api/routing/recommend').send({ injuryType: 'cardiac' });
    expect(bad.status).toBe(400);
    const ok = await request(ctx.app)
      .post('/api/routing/recommend')
      .send({ injuryType: 'cardiac', severity: 'high', pickupLat: '-6.2088', pickupLng: '106.8456' });
    expect(ok.status).toBe(200);
    expect(ok.body.recommended.name).toBeTruthy();
  });

  it('recommend reflects live capacity changes', async () => {
    const before = await request(ctx.app)
      .post('/api/routing/recommend')
      .send({ injuryType: 'trauma', pickupLat: -6.2088, pickupLng: 106.8456 });
    const topId = before.body.recommended.hospitalId;
    await request(ctx.app).patch(`/api/hospitals/${topId}/capacity`).send({ availableErBeds: 0 });
    const after = await request(ctx.app)
      .post('/api/routing/recommend')
      .send({ injuryType: 'trauma', pickupLat: -6.2088, pickupLng: 106.8456 });
    expect(after.body.recommended.hospitalId).not.toBe(topId);
  });

  it('creates an incident, assigns a hospital and reserves a bed', async () => {
    const hBefore = ctx.store.hospitals.map((h) => h.availableErBeds).reduce((a, b) => a + b, 0);
    const res = await request(ctx.app)
      .post('/api/incidents')
      .send({ injuryType: 'stroke', severity: 'critical', pickupLat: -6.2, pickupLng: 106.8 });
    expect(res.status).toBe(201);
    expect(res.body.incident.status).toBe('assigned');
    const hAfter = ctx.store.hospitals.map((h) => h.availableErBeds).reduce((a, b) => a + b, 0);
    expect(hAfter).toBe(hBefore - 1);

    const list = await request(ctx.app).get('/api/incidents');
    expect(list.body.count).toBe(1);
    const arrive = await request(ctx.app).patch(`/api/incidents/${res.body.incident.id}/arrive`);
    expect(arrive.body.incident.status).toBe('arrived');
    expect((await request(ctx.app).get('/api/incidents')).body.count).toBe(0);
  });

  it('simulates a mass casualty event', async () => {
    const res = await request(ctx.app).post('/api/incidents/mass-casualty');
    expect(res.status).toBe(201);
    expect(res.body.incidents).toHaveLength(3);
  });
});

describe('Socket.io', () => {
  it('broadcasts capacity changes to clients in the city room', async () => {
    const client: Socket = connect(`http://localhost:${port}`, { transports: ['websocket'] });
    await new Promise<void>((resolve) => {
      client.on('joined', () => resolve());
      client.on('connect', () => client.emit('join:city', { city: 'Jakarta' }));
    });
    const event = new Promise<any>((resolve) => client.on('hospital:capacity_change', resolve));
    await request(ctx.app).patch('/api/hospitals/h-002/capacity').send({ availableErBeds: 1 });
    const payload = await event;
    expect(payload.hospitalId).toBe('h-002');
    expect(payload.availableErBeds).toBe(1);
    client.close();
  });
});
