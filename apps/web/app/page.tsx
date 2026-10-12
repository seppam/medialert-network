'use client';
import { useCallback, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import type { Hospital, Incident } from '@medialert/shared';
import { API_URL } from '../lib/api';

const card = { background: '#1E293B', borderRadius: 12, padding: 20 } as const;
const heading = { fontSize: 18, fontWeight: 600, margin: '0 0 16px', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1 } as const;

export default function Dashboard() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [live, setLive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const [h, i] = await Promise.all([
        fetch(`${API_URL}/api/hospitals?city=Jakarta`).then((r) => r.json()),
        fetch(`${API_URL}/api/incidents`).then((r) => r.json()),
      ]);
      setHospitals(h.hospitals);
      setIncidents(i.incidents);
      setError(null);
    } catch {
      setError(`Cannot reach API at ${API_URL}. Start it with "npm run dev".`);
    }
  }, []);

  useEffect(() => {
    load();
    const s = io(API_URL);
    s.on('connect', () => {
      setLive(true);
      s.emit('join:city', { city: 'Jakarta' });
    });
    s.on('disconnect', () => setLive(false));
    s.on('hospital:capacity_change', (p: { hospitalId: string; availableErBeds: number; availableIcuBeds: number; availableOrRooms: number }) =>
      setHospitals((prev) => prev.map((h) => (h.id === p.hospitalId ? { ...h, availableErBeds: p.availableErBeds, availableIcuBeds: p.availableIcuBeds, availableOrRooms: p.availableOrRooms } : h))),
    );
    s.on('incident:new', ({ incident }: { incident: Incident }) => setIncidents((prev) => [incident, ...prev]));
    s.on('incident:arrived', ({ incidentId }: { incidentId: string }) => setIncidents((prev) => prev.filter((i) => i.id !== incidentId)));
    s.on('state:reset', load);
    return () => {
      s.disconnect();
    };
  }, [load]);

  const post = (path: string) => fetch(`${API_URL}${path}`, { method: 'POST' }).catch(() => setError('Request failed'));
  const arrive = (id: string) => fetch(`${API_URL}/api/incidents/${id}/arrive`, { method: 'PATCH' });
  const nameOf = (id?: string) => hospitals.find((h) => h.id === id)?.shortName ?? 'Unassigned';

  const color = (h: Hospital) => {
    const r = h.availableErBeds / h.totalErBeds;
    return r > 0.5 ? '#22C55E' : r > 0.2 ? '#FBBF24' : '#EF4444';
  };

  return (
    <main style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 28, margin: 0 }}>MediAlert Dispatch Center</h1>
          <p style={{ color: '#94A3B8', margin: '4px 0 0' }}>Jakarta, real-time (fictional demo data)</p>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{ background: live ? '#22C55E' : '#64748B', padding: '6px 16px', borderRadius: 20, fontSize: 14, fontWeight: 600 }}>
            {live ? 'LIVE' : 'OFFLINE'}
          </span>
          <button onClick={() => post('/api/incidents/mass-casualty')} style={{ background: '#EF4444', color: 'white', border: 0, padding: '10px 20px', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
            Simulate mass casualty
          </button>
          <button onClick={() => post('/api/incidents/reset')} style={{ background: '#334155', color: 'white', border: 0, padding: '10px 20px', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
            Reset demo
          </button>
        </div>
      </div>

      {error && <div role="alert" style={{ ...card, borderLeft: '4px solid #EF4444', marginBottom: 24 }}>{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Active incidents', value: incidents.length, color: '#F59E0B' },
          { label: 'Hospitals online', value: hospitals.filter((h) => h.isActive).length, color: '#22C55E' },
          { label: 'Total ER beds', value: hospitals.reduce((a, h) => a + h.totalErBeds, 0), color: '#3B82F6' },
          { label: 'ER beds available', value: hospitals.reduce((a, h) => a + h.availableErBeds, 0), color: '#22C55E' },
        ].map((s) => (
          <div key={s.label} style={card}>
            <div style={{ color: '#94A3B8', fontSize: 13, marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontSize: 32, fontWeight: 700, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <h2 style={heading}>Hospital status ({hospitals.length} facilities)</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, marginBottom: 32 }}>
        {hospitals.map((h) => {
          const pct = (h.availableErBeds / h.totalErBeds) * 100;
          const c = color(h);
          const specs = h.specialists.filter((s) => s.available);
          return (
            <div key={h.id} data-testid="hospital-card" style={{ ...card, borderLeft: `4px solid ${c}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{h.shortName}</div>
                  <div style={{ color: '#64748B', fontSize: 12 }}>{h.district}</div>
                </div>
                <span style={{ background: c + '22', color: c, padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600, height: 'fit-content' }}>{pct.toFixed(0)}% free</span>
              </div>
              <div style={{ background: '#334155', borderRadius: 4, height: 8, marginBottom: 8 }}>
                <div style={{ background: c, height: 8, borderRadius: 4, width: `${pct}%`, transition: 'width 0.3s' }} />
              </div>
              <div style={{ fontSize: 13, color: '#94A3B8', marginBottom: 12 }}>
                ER: {h.availableErBeds}/{h.totalErBeds} beds | ICU: {h.availableIcuBeds}/{h.totalIcuBeds}
              </div>
              {specs.length ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {specs.map((s) => (
                    <span key={s.specialty} style={{ background: '#3B82F622', color: '#60A5FA', padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600 }}>{s.specialty.toUpperCase()}</span>
                  ))}
                </div>
              ) : (
                <div style={{ color: '#EF4444', fontSize: 12 }}>No specialists on duty</div>
              )}
            </div>
          );
        })}
      </div>

      <h2 style={heading}>Active incidents ({incidents.length})</h2>
      {incidents.length === 0 && <p style={{ color: '#64748B' }}>No active incidents. Use "Simulate mass casualty" or the Ambulance app.</p>}
      <div style={{ display: 'grid', gap: 12 }}>
        {incidents.map((inc) => (
          <div key={inc.id} data-testid="incident-row" style={{ ...card, padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <div>
              <span style={{ background: '#F59E0B22', color: '#F59E0B', padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 700, textTransform: 'uppercase' }}>{inc.injuryType}</span>
              <span style={{ marginLeft: 12, color: '#94A3B8', fontSize: 13 }}>to {nameOf(inc.destinationId)}</span>
            </div>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 700, color: inc.severity === 'critical' ? '#EF4444' : '#F59E0B', textTransform: 'uppercase', fontSize: 12 }}>{inc.severity}</div>
                <div style={{ color: '#64748B', fontSize: 12 }}>{inc.status}{inc.etaMinutes ? ` · ETA ${inc.etaMinutes} min` : ''}</div>
              </div>
              <button onClick={() => arrive(inc.id)} style={{ background: '#334155', color: 'white', border: 0, padding: '8px 12px', borderRadius: 6, cursor: 'pointer' }}>Mark arrived</button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
