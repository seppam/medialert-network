'use client';
import { useState } from 'react';
import { INJURY_TYPES, SEVERITY_LEVELS, type RoutingResult } from '@medialert/shared';
import { API_URL } from '../../lib/api';

const input = { background: 'white', color: '#0F172A', border: '1px solid #CBD5E1', borderRadius: 8, padding: '10px 12px', fontSize: 15, width: '100%', boxSizing: 'border-box' } as const;
const label = { display: 'block', fontWeight: 600, color: '#CBD5E1', margin: '18px 0 8px' } as const;

export default function AmbulancePage() {
  const [form, setForm] = useState({ injuryType: '', severity: 'medium', spo2: '', heartRate: '', bpSystolic: '', pickupLat: '-6.2088', pickupLng: '106.8456', chiefComplaint: '' });
  const [result, setResult] = useState<RoutingResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.injuryType) return setError('Please select an injury type');
    setBusy(true);
    setError(null);
    const vitalSigns: Record<string, number> = {};
    if (form.spo2) vitalSigns.spo2 = Number(form.spo2);
    if (form.heartRate) vitalSigns.heartRate = Number(form.heartRate);
    if (form.bpSystolic) vitalSigns.bpSystolic = Number(form.bpSystolic);
    try {
      const res = await fetch(`${API_URL}/api/incidents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ injuryType: form.injuryType, severity: form.severity, pickupLat: form.pickupLat, pickupLng: form.pickupLng, chiefComplaint: form.chiefComplaint, vitalSigns }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed');
      setResult(data.routing);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Cannot reach API');
    } finally {
      setBusy(false);
    }
  }

  if (result) {
    const r = result.recommended;
    return (
      <main style={{ maxWidth: 640, margin: '0 auto', padding: 24 }}>
        {r ? (
          <div style={{ background: '#DCFCE7', color: '#166534', borderRadius: 12, padding: 20, border: '1px solid #22C55E' }}>
            <div style={{ fontSize: 22, fontWeight: 700 }}>Recommended hospital</div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{r.name}</div>
            <div style={{ display: 'flex', justifyContent: 'space-around', margin: '16px 0' }}>
              <Stat v={r.score} l="Score" /><Stat v={`${r.distanceKm} km`} l="Distance" /><Stat v={`${r.etaMinutes} min`} l="ETA" />
            </div>
            {r.hasSpecialist && <div style={{ background: '#BBF7D0', padding: 10, borderRadius: 8, fontWeight: 700 }}>Specialist on duty: {r.specialistName}</div>}
            <ul style={{ fontSize: 13 }}>{r.reasons.map((x, i) => <li key={i}>{x}</li>)}</ul>
          </div>
        ) : (
          <div role="alert" style={{ background: '#FEE2E2', color: '#991B1B', padding: 20, borderRadius: 12 }}>No eligible hospital found. Contact dispatch.</div>
        )}
        {result.alternatives.length > 0 && <h2 style={{ marginTop: 24 }}>Alternatives</h2>}
        {result.alternatives.map((a) => (
          <div key={a.hospitalId} style={{ background: '#1E293B', borderRadius: 10, padding: 14, marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><strong>{a.name}</strong><span style={{ color: '#F59E0B' }}>{a.score} pts</span></div>
            <div style={{ color: '#94A3B8', fontSize: 13 }}>ETA {a.etaMinutes} min · {a.distanceKm} km{a.hasSpecialist ? ` · ${a.specialistName}` : ''}</div>
          </div>
        ))}
        <button onClick={() => setResult(null)} style={{ ...input, background: '#334155', color: 'white', cursor: 'pointer', marginTop: 12 }}>Back to form</button>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 640, margin: '0 auto', padding: 24 }}>
      <h1>New patient report</h1>
      <p style={{ color: '#94A3B8' }}>Enter fictional patient details to find the best hospital. Submitting creates a demo incident and reserves a bed.</p>
      <form onSubmit={submit}>
        <span style={label}>Injury / condition type *</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {INJURY_TYPES.map((t) => (
            <button type="button" key={t.value} onClick={() => set('injuryType', t.value)} aria-pressed={form.injuryType === t.value}
              style={{ padding: '8px 14px', borderRadius: 20, border: `1.5px solid ${form.injuryType === t.value ? t.color : '#475569'}`, background: form.injuryType === t.value ? t.color : 'transparent', color: 'white', cursor: 'pointer' }}>{t.label}</button>
          ))}
        </div>
        <span style={label}>Severity</span>
        <div style={{ display: 'flex', gap: 8 }}>
          {SEVERITY_LEVELS.map((s) => (
            <button type="button" key={s.value} onClick={() => set('severity', s.value)} aria-pressed={form.severity === s.value}
              style={{ flex: 1, padding: '10px 0', borderRadius: 8, border: `1.5px solid ${form.severity === s.value ? s.color : '#475569'}`, background: form.severity === s.value ? s.color : 'transparent', color: 'white', cursor: 'pointer', fontWeight: 700 }}>{s.label}</button>
          ))}
        </div>
        <span style={label}>Vital signs (optional)</span>
        <div style={{ display: 'flex', gap: 10 }}>
          <input style={input} placeholder="SpO2 %" inputMode="numeric" value={form.spo2} onChange={(e) => set('spo2', e.target.value)} aria-label="SpO2" />
          <input style={input} placeholder="Heart rate" inputMode="numeric" value={form.heartRate} onChange={(e) => set('heartRate', e.target.value)} aria-label="Heart rate" />
          <input style={input} placeholder="BP systolic" inputMode="numeric" value={form.bpSystolic} onChange={(e) => set('bpSystolic', e.target.value)} aria-label="BP systolic" />
        </div>
        <span style={label}>Chief complaint</span>
        <textarea style={{ ...input, height: 70 }} value={form.chiefComplaint} onChange={(e) => set('chiefComplaint', e.target.value)} aria-label="Chief complaint" />
        <span style={label}>Pickup location (lat, lng)</span>
        <div style={{ display: 'flex', gap: 10 }}>
          <input style={input} value={form.pickupLat} onChange={(e) => set('pickupLat', e.target.value)} aria-label="Latitude" />
          <input style={input} value={form.pickupLng} onChange={(e) => set('pickupLng', e.target.value)} aria-label="Longitude" />
        </div>
        {error && <div role="alert" style={{ color: '#FCA5A5', marginTop: 16 }}>{error}</div>}
        <button type="submit" disabled={busy} style={{ ...input, background: '#EF4444', color: 'white', fontWeight: 700, fontSize: 17, marginTop: 24, cursor: 'pointer', border: 0 }}>{busy ? 'Routing...' : 'Find best hospital'}</button>
      </form>
    </main>
  );
}

function Stat({ v, l }: { v: string | number; l: string }) {
  return <div style={{ textAlign: 'center' }}><div style={{ fontSize: 24, fontWeight: 700 }}>{v}</div><div style={{ fontSize: 12 }}>{l}</div></div>;
}
