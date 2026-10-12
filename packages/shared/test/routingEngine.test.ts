import { describe, expect, it } from 'vitest';
import { MOCK_HOSPITALS, detectCritical, getSpecialtyForInjury, haversineDistance, routePatient } from '../src';
import type { Hospital, Incident } from '../src';

const clone = (): Hospital[] => JSON.parse(JSON.stringify(MOCK_HOSPITALS));
const incident = (over: Partial<Incident> = {}): Incident => ({
  id: 't1', injuryType: 'cardiac', severity: 'medium',
  pickupLat: -6.2088, pickupLng: 106.8456, status: 'pending', createdAt: '2026-01-01T00:00:00Z', ...over,
});

describe('helpers', () => {
  it('computes haversine distance', () => {
    expect(haversineDistance(0, 0, 0, 0)).toBe(0);
    // Jakarta -> Bandung is roughly 115-120 km
    const d = haversineDistance(-6.2088, 106.8456, -6.9175, 107.6191);
    expect(d).toBeGreaterThan(105);
    expect(d).toBeLessThan(125);
  });
  it('maps injuries to specialties', () => {
    expect(getSpecialtyForInjury('Cardiac')).toBe('cardiology');
    expect(getSpecialtyForInjury('burn')).toBe('trauma');
    expect(getSpecialtyForInjury('unknown')).toBe('general');
  });
  it('detects critical patients from severity or vitals', () => {
    expect(detectCritical({ severity: 'critical' })).toBe(true);
    expect(detectCritical({ severity: 'low', vitalSigns: { spo2: 85 } })).toBe(true);
    expect(detectCritical({ severity: 'low', vitalSigns: { heartRate: 160 } })).toBe(true);
    expect(detectCritical({ severity: 'low', vitalSigns: { spo2: 98, heartRate: 80 } })).toBe(false);
  });
});

describe('routePatient', () => {
  it('recommends a hospital with a matching specialist and sorted alternatives', () => {
    const r = routePatient(incident(), clone());
    expect(r.recommended).not.toBeNull();
    expect(r.recommended!.hasSpecialist).toBe(true);
    expect(r.alternatives.length).toBeLessThanOrEqual(3);
    const scores = [r.recommended!, ...r.alternatives].map((h) => h.score);
    expect(scores).toEqual([...scores].sort((a, b) => b - a));
  });

  it('excludes hospitals with no ER beds or inactive hospitals', () => {
    const hs = clone();
    hs.forEach((h) => (h.availableErBeds = 0));
    hs[0].availableErBeds = 3;
    hs[1].isActive = false;
    hs[1].availableErBeds = 10;
    const r = routePatient(incident(), hs);
    expect(r.recommended!.hospitalId).toBe(hs[0].id);
    expect(r.alternatives).toHaveLength(0);
  });

  it('requires an ICU bed for critical patients', () => {
    const hs = clone();
    const r = routePatient(incident({ severity: 'critical' }), hs);
    const noIcu = hs.filter((h) => h.availableIcuBeds < 1).map((h) => h.id);
    const ids = [r.recommended!, ...r.alternatives].map((h) => h.hospitalId);
    expect(noIcu.length).toBeGreaterThan(0);
    for (const id of noIcu) expect(ids).not.toContain(id);
  });

  it('returns null recommendation when nothing is eligible', () => {
    const hs = clone();
    hs.forEach((h) => (h.availableErBeds = 0));
    const r = routePatient(incident(), hs);
    expect(r.recommended).toBeNull();
    expect(r.alternatives).toEqual([]);
  });

  it('does not penalize hospitals for general cases', () => {
    const r = routePatient(incident({ injuryType: 'general' }), clone());
    expect(r.recommended!.reasons.join(' ')).not.toMatch(/No general specialist/);
  });
});
