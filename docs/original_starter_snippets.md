# MediAlert Network — Starter Codebase
## Full-stack monorepo scaffold ready for Garuda Hacks 7.0

> **Time to first line of logic:** ~2 minutes (clone + env setup)
> **Purpose:** Skip all boilerplate — start coding business logic from minute 1

---

## 📁 Project Structure

```
medialert-network/
├── apps/
│   ├── web/                    # Dispatcher Dashboard (Next.js)
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx        # Dashboard home
│   │   │   ├── hospitals/
│   │   │   ├── incidents/
│   │   │   └── api/            # Next.js API routes (proxy to backend)
│   │   ├── components/
│   │   ├── lib/
│   │   └── package.json
│   │
│   └── mobile/                 # Ambulance App (React Native / or PWA)
│       ├── screens/
│       ├── components/
│       ├── services/
│       ├── App.tsx
│       └── package.json
│
├── packages/
│   └── shared/                 # Shared types, constants, mock data
│       ├── types.ts
│       ├── constants.ts
│       ├── mockData.ts
│       └── routingEngine.ts     # Shared routing logic
│
├── server/                     # Node.js API + Socket.io backend
│   ├── src/
│   │   ├── index.ts            # Express + Socket.io bootstrap
│   │   ├── routes/
│   │   │   ├── hospitals.ts
│   │   │   ├── incidents.ts
│   │   │   └── routing.ts
│   │   ├── services/
│   │   │   ├── hospitalService.ts
│   │   │   ├── incidentService.ts
│   │   │   └── routingAgent.ts  # AI routing decision engine
│   │   ├── socket/
│   │   │   └── socketHandler.ts
│   │   ├── db/
│   │   │   ├── seed.ts         # Mock data seeder
│   │   │   └── schema.sql      # Database schema
│   │   └── types/
│   │       └── index.ts
│   ├── package.json
│   └── tsconfig.json
│
├── docker-compose.yml           # Local PostgreSQL + Redis
├── .env.example
├── package.json                 # Workspace root
└── README.md
```

---

## 🚀 Quick Start (3 Steps)

```bash
# 1. Clone and enter
git clone <repo> medialert-network
cd medialert-network

# 2. Install dependencies (workspace root)
npm install

# 3. Start everything
docker-compose up -d              # Start Postgres + Redis
npm run db:seed                  # Seed mock hospitals
npm run dev                      # Start all apps (web + server)
```

- **Dashboard:** http://localhost:3000
- **Backend API:** http://localhost:4000
- **API Docs:** http://localhost:4000/api/health

---

## 📦 packages/shared/src/mockData.ts
> The heart of your hackathon demo — all realistic Indonesian hospital data

```typescript
// packages/shared/src/mockData.ts

export const MOCK_HOSPITALS = [
  {
    id: "h-001",
    name: "RSUP Fatmawati",
    shortName: "Fatmawati",
    address: "Jl. RS Fatmawati No.4, RT.4/RW.9, Pd. Labu, Kec. Cilandak, Jakarta Selatan",
    city: "Jakarta",
    latitude: -6.3077,
    longitude: 106.7910,
    totalErBeds: 20,
    availableErBeds: 14,
    totalIcuBeds: 8,
    availableIcuBeds: 5,
    totalOrRooms: 4,
    availableOrRooms: 2,
    hasGenerator: true,
    generatorFuelHours: 48,
    phone: "(021) 750-1524",
    hospitalClass: "type_a",
    district: "Cilandak",
    specialists: [
      { specialty: "cardiology", doctorName: "Dr. A. Wijaya, Sp.JP", available: true, shiftEnd: "20:00" },
      { specialty: "neurology", doctorName: "Dr. B. Hartono, Sp.N", available: false, shiftEnd: "" },
      { specialty: "orthopedics", doctorName: "Dr. C. Santoso, Sp.OT", available: true, shiftEnd: "22:00" },
      { specialty: "trauma", doctorName: "Dr. D. Kusuma, Sp.B", available: true, shiftEnd: "18:00" },
    ]
  },
  {
    id: "h-002",
    name: "RSPI Sulianti Saroso",
    shortName: "RSPI Sulianti Saroso",
    address: "Jl. Percetakan Negara No.17, Johar Baru, Jakarta Pusat",
    city: "Jakarta",
    latitude: -6.1751,
    longitude: 106.8457,
    totalErBeds: 15,
    availableErBeds: 6,
    totalIcuBeds: 6,
    availableIcuBeds: 2,
    totalOrRooms: 2,
    availableOrRooms: 1,
    hasGenerator: true,
    generatorFuelHours: 72,
    phone: "(021) 4214461",
    hospitalClass: "type_a",
    district: "Johar Baru",
    specialists: [
      { specialty: "cardiology", doctorName: "Dr. E. Permani, Sp.JP", available: false, shiftEnd: "" },
      { specialty: "neurology", doctorName: "Dr. F. Nugroho, Sp.N", available: true, shiftEnd: "20:00" },
      { specialty: "respiratory", doctorName: "Dr. G. Dharmawirya, Sp.P", available: true, shiftEnd: "23:00" },
      { specialty: "trauma", doctorName: "Dr. H. Setiadi, Sp.B", available: false, shiftEnd: "" },
    ]
  },
  {
    id: "h-003",
    name: "RS St. Carolus",
    shortName: "St. Carolus",
    address: "Jl. Salemba Raya No.41, RT.11/RW.2, Paseban, Jakarta Pusat",
    city: "Jakarta",
    latitude: -6.1926,
    longitude: 106.8482,
    totalErBeds: 18,
    availableErBeds: 11,
    totalIcuBeds: 7,
    availableIcuBeds: 4,
    totalOrRooms: 3,
    availableOrRooms: 2,
    hasGenerator: true,
    generatorFuelHours: 36,
    phone: "(021) 3908281",
    hospitalClass: "type_b",
    district: "Senen",
    specialists: [
      { specialty: "cardiology", doctorName: "Dr. I. Gunawan, Sp.JP", available: true, shiftEnd: "19:00" },
      { specialty: "neurology", doctorName: "Dr. J. Anwar, Sp.N", available: true, shiftEnd: "21:00" },
      { specialty: "orthopedics", doctorName: "Dr. K. Dharma, Sp.OT", available: false, shiftEnd: "" },
      { specialty: "trauma", doctorName: "Dr. L. Wijanto, Sp.B", available: true, shiftEnd: "17:00" },
    ]
  },
  {
    id: "h-004",
    name: "Siloam Hospitals Semanggi",
    shortName: "Siloam Semanggi",
    address: "Jl. Garnisun No.1-3, RT.1/RW.4, Karet Semanggi, Jakarta Selatan",
    city: "Jakarta",
    latitude: -6.2248,
    longitude: 106.8219,
    totalErBeds: 25,
    availableErBeds: 18,
    totalIcuBeds: 10,
    availableIcuBeds: 7,
    totalOrRooms: 6,
    availableOrRooms: 4,
    hasGenerator: true,
    generatorFuelHours: 120,
    phone: "(021) 5738282",
    hospitalClass: "type_a",
    district: "Setiabudi",
    specialists: [
      { specialty: "cardiology", doctorName: "Dr. M. Taher, Sp.JP", available: true, shiftEnd: "22:00" },
      { specialty: "neurology", doctorName: "Dr. N. Loebis, Sp.N", available: true, shiftEnd: "20:00" },
      { specialty: "orthopedics", doctorName: "Dr. O. Tanoto, Sp.OT", available: true, shiftEnd: "21:00" },
      { specialty: "trauma", doctorName: "Dr. P. Andika, Sp.B", available: true, shiftEnd: "23:00" },
      { specialty: "pediatric", doctorName: "Dr. Q. Hadisaputra, Sp.A", available: true, shiftEnd: "19:00" },
    ]
  },
  {
    id: "h-005",
    name: "RSUD Pasar Minggu",
    shortName: "Pasar Minggu",
    address: "Jl. TB Simatupang No.1, RW.1, Ps. Minggu, Jakarta Selatan",
    city: "Jakarta",
    latitude: -6.2934,
    longitude: 106.8265,
    totalErBeds: 12,
    availableErBeds: 7,
    totalIcuBeds: 4,
    availableIcuBeds: 1,
    totalOrRooms: 2,
    availableOrRooms: 1,
    hasGenerator: true,
    generatorFuelHours: 24,
    phone: "(021) 7801308",
    hospitalClass: "type_b",
    district: "Pasar Minggu",
    specialists: [
      { specialty: "cardiology", doctorName: "Dr. R. Budiman, Sp.JP", available: false, shiftEnd: "" },
      { specialty: "neurology", doctorName: "Dr. S. Heryanti, Sp.N", available: false, shiftEnd: "" },
      { specialty: "orthopedics", doctorName: "Dr. T. Rahardjo, Sp.OT", available: true, shiftEnd: "18:00" },
      { specialty: "trauma", doctorName: "Dr. U. Prasetyo, Sp.B", available: true, shiftEnd: "17:00" },
    ]
  },
  {
    id: "h-006",
    name: "RSCM (RSUPN Cipto Mangunkusumo)",
    shortName: "RSCM",
    address: "Jl. Pangeran Diponegoro No.71, Senen, Jakarta Pusat",
    city: "Jakarta",
    latitude: -6.1880,
    longitude: 106.8449,
    totalErBeds: 40,
    availableErBeds: 22,
    totalIcuBeds: 16,
    availableIcuBeds: 9,
    totalOrRooms: 10,
    availableOrRooms: 6,
    hasGenerator: true,
    generatorFuelHours: 168,
    phone: "(021) 31906799",
    hospitalClass: "type_a",
    district: "Senen",
    specialists: [
      { specialty: "cardiology", doctorName: "Dr. V. Harimurti, Sp.JP", available: true, shiftEnd: "21:00" },
      { specialty: "neurology", doctorName: "Dr. W. Lumenta, Sp.N", available: true, shiftEnd: "22:00" },
      { specialty: "orthopedics", doctorName: "Dr. X. Sukmana, Sp.OT", available: true, shiftEnd: "20:00" },
      { specialty: "trauma", doctorName: "Dr. Y. Tobing, Sp.B", available: true, shiftEnd: "23:00" },
      { specialty: "respiratory", doctorName: "Dr. Z. Wirawan, Sp.P", available: true, shiftEnd: "19:00" },
    ]
  },
  {
    id: "h-007",
    name: "RS Hermina Daan Mogot",
    shortName: "Hermina Daan Mogot",
    address: "Jl. Daan Mogot No.KM.14, RT.11/RW.6, Duri Kosambi, Jakarta Barat",
    city: "Jakarta",
    latitude: -6.1448,
    longitude: 106.7163,
    totalErBeds: 16,
    availableErBeds: 10,
    totalIcuBeds: 6,
    availableIcuBeds: 3,
    totalOrRooms: 3,
    availableOrRooms: 2,
    hasGenerator: true,
    generatorFuelHours: 48,
    phone: "(021) 5408989",
    hospitalClass: "type_b",
    district: "Cengkareng",
    specialists: [
      { specialty: "cardiology", doctorName: "Dr. AA. Santoso, Sp.JP", available: false, shiftEnd: "" },
      { specialty: "neurology", doctorName: "Dr. AB. Handoyo, Sp.N", available: true, shiftEnd: "20:00" },
      { specialty: "orthopedics", doctorName: "Dr. AC. Firmansyah, Sp.OT", available: true, shiftEnd: "18:00" },
      { specialty: "trauma", doctorName: "Dr. AD. Santoso, Sp.B", available: true, shiftEnd: "21:00" },
    ]
  },
  {
    id: "h-008",
    name: "RS Sumber Waras",
    shortName: "Sumber Waras",
    address: "Jl. K.S. Tubun No.1, RT.11/RW.1, Slipi, Jakarta Barat",
    city: "Jakarta",
    latitude: -6.1758,
    longitude: 106.7913,
    totalErBeds: 14,
    availableErBeds: 5,
    totalIcuBeds: 5,
    availableIcuBeds: 0,
    totalOrRooms: 2,
    availableOrRooms: 0,
    hasGenerator: false,
    generatorFuelHours: 0,
    phone: "(021) 5682011",
    hospitalClass: "type_b",
    district: "Palmerah",
    specialists: [
      { specialty: "cardiology", doctorName: "Dr. AE. Priyanto, Sp.JP", available: true, shiftEnd: "19:00" },
      { specialty: "neurology", doctorName: "Dr. AF. Koesnadi, Sp.N", available: false, shiftEnd: "" },
      { specialty: "orthopedics", doctorName: "Dr. AG. Tanujaya, Sp.OT", available: false, shiftEnd: "" },
      { specialty: "trauma", doctorName: "Dr. AH. Budiarjo, Sp.B", available: false, shiftEnd: "" },
    ]
  }
];

export const INJURY_TYPES = [
  { value: "cardiac", label: "Cardiac / Heart Attack", specialty: "cardiology", color: "#EF4444" },
  { value: "stroke", label: "Stroke / Neurological", specialty: "neurology", color: "#8B5CF6" },
  { value: "trauma", label: "Trauma / Accident", specialty: "trauma", color: "#F59E0B" },
  { value: "fracture", label: "Fracture / Orthopedic", specialty: "orthopedics", color: "#3B82F6" },
  { value: "respiratory", label: "Respiratory / Breathing", specialty: "respiratory", color: "#10B981" },
  { value: "burn", label: "Burns", specialty: "trauma", color: "#F97316" },
  { value: "pediatric", label: "Pediatric Emergency", specialty: "pediatric", color: "#EC4899" },
  { value: "general", label: "General / Other", specialty: "general", color: "#6B7280" }
];

export const SEVERITY_LEVELS = [
  { value: "critical", label: "Critical", color: "#DC2626", description: "Life-threatening, immediate care needed" },
  { value: "high", label: "High", color: "#F97316", description: "Serious but stable" },
  { value: "medium", label: "Medium", color: "#FBBF24", description: "Urgent, can wait briefly" },
  { value: "low", label: "Low", color: "#22C55E", description: "Non-urgent, routine" }
];
```

---

## 📦 packages/shared/src/routingEngine.ts
> The AI routing decision engine — shared between server and mobile app

```typescript
// packages/shared/src/routingEngine.ts

import { MOCK_HOSPITALS } from './mockData';
import type { Hospital, Incident, RoutingResult } from './types';

export function routePatient(incident: Incident, hospitals: Hospital[]): RoutingResult {
  const specialtyNeeded = getSpecialtyForInjury(incident.injuryType);
  const isCritical = detectCritical(incident);

  // Step 1: Filter
  const eligible = hospitals.filter(h => {
    if (!h.isActive) return false;
    if (h.availableErBeds < 1) return false;
    if (isCritical && h.availableIcuBeds < 1) return false;
    return true;
  });

  // Step 2: Score
  const scored = eligible.map(hospital => {
    let score = 100;
    const reasons: string[] = [];

    // Distance (penalty: -30 max)
    const distance = haversineDistance(
      incident.pickupLat, incident.pickupLng,
      hospital.latitude, hospital.longitude
    );
    const distancePenalty = Math.min(distance * 2, 30);
    score -= distancePenalty;
    reasons.push(`Distance: ${distance.toFixed(1)}km`);

    // Capacity bonus (+20 max)
    const capacityRatio = h.availableErBeds / h.totalErBeds;
    score += capacityRatio * 20;
    reasons.push(`ER capacity: ${h.availableErBeds}/${h.totalErBeds} beds free`);

    // ICU bonus for critical (+15 max)
    if (isCritical) {
      const icuRatio = hospital.availableIcuBeds / hospital.totalIcuBeds;
      score += icuRatio * 15;
      reasons.push(`ICU capacity: ${hospital.availableIcuBeds}/${hospital.totalIcuBeds}`);
    }

    // Specialist match bonus (+25) or penalty (-15)
    const specialist = hospital.specialists.find(
      s => s.specialty === specialtyNeeded && s.available
    );
    if (specialist) {
      score += 25;
      reasons.push(`✓ ${capitalize(specialtyNeeded)} specialist on duty: ${specialist.doctorName}`);
    } else {
      score -= 15;
      reasons.push(`✗ No ${specialtyNeeded} specialist available`);
    }

    // Generator bonus (+10)
    if (hospital.hasGenerator && hospital.generatorFuelHours > 6) {
      score += 10;
      reasons.push(`✓ Backup generator available (${hospital.generatorFuelHours}h fuel)`);
    }

    return {
      hospitalId: hospital.id,
      name: hospital.name,
      shortName: hospital.shortName,
      score: Math.round(score),
      reasons,
      distanceKm: Math.round(distance * 10) / 10,
      etaMinutes: Math.ceil(distance / 0.5),
      availableEr: hospital.availableErBeds,
      availableIcu: hospital.availableIcuBeds,
      hasSpecialist: !!specialist,
      specialistName: specialist?.doctorName ?? null,
      generatorStatus: hospital.hasGenerator && hospital.generatorFuelHours > 6
    };
  });

  scored.sort((a, b) => b.score - a.score);

  return {
    incidentId: incident.id,
    recommended: scored[0],
    alternatives: scored.slice(1, 4),
    generatedAt: new Date().toISOString()
  };
}

// Haversine distance between two lat/lng points (km)
function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 +
            Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) *
            Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function getSpecialtyForInjury(injuryType: string): string {
  const map: Record<string, string> = {
    'cardiac': 'cardiology', 'heart_attack': 'cardiology',
    'stroke': 'neurology', 'neurological': 'neurology',
    'fracture': 'orthopedics', 'orthopedic': 'orthopedics',
    'trauma': 'trauma', 'accident': 'trauma', 'burn': 'trauma',
    'respiratory': 'respiratory', 'breathing': 'respiratory',
    'pediatric': 'pediatric', 'child': 'pediatric'
  };
  return map[injuryType.toLowerCase()] || 'general';
}

function detectCritical(incident: Incident): boolean {
  if (incident.severity === 'critical') return true;
  if (!incident.vitalSigns) return false;
  const vs = incident.vitalSigns;
  if (vs.spo2 && vs.spo2 < 90) return true;
  if (vs.bpSystolic && vs.bpSystolic < 90) return true;
  if (vs.heartRate && (vs.heartRate > 150 || vs.heartRate < 40)) return true;
  return false;
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
```

---

## 📦 packages/shared/src/types.ts

```typescript
// packages/shared/src/types.ts

export interface Hospital {
  id: string;
  name: string;
  shortName: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  totalErBeds: number;
  availableErBeds: number;
  totalIcuBeds: number;
  availableIcuBeds: number;
  totalOrRooms: number;
  availableOrRooms: number;
  hasGenerator: boolean;
  generatorFuelHours: number;
  phone: string;
  hospitalClass: 'type_a' | 'type_b' | 'type_c' | 'clinic';
  district: string;
  isActive: boolean;
  specialists: Specialist[];
}

export interface Specialist {
  specialty: string;
  doctorName: string;
  available: boolean;
  shiftEnd: string;
}

export interface Incident {
  id: string;
  ambulanceId?: string;
  patientAge?: number;
  patientGender?: 'male' | 'female' | 'other';
  injuryType: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  chiefComplaint?: string;
  vitalSigns?: VitalSigns;
  pickupLat: number;
  pickupLng: number;
  destinationId?: string;
  assignedAt?: string;
  etaMinutes?: number;
  status: 'pending' | 'assigned' | 'en_route' | 'arrived' | 'cancelled';
  createdAt: string;
}

export interface VitalSigns {
  bpSystolic?: number;
  bpDiastolic?: number;
  heartRate?: number;
  spo2?: number;
  temperature?: number;
}

export interface RoutingResult {
  incidentId: string;
  recommended: ScoredHospital;
  alternatives: ScoredHospital[];
  generatedAt: string;
}

export interface ScoredHospital {
  hospitalId: string;
  name: string;
  shortName: string;
  score: number;
  reasons: string[];
  distanceKm: number;
  etaMinutes: number;
  availableEr: number;
  availableIcu: number;
  hasSpecialist: boolean;
  specialistName: string | null;
  generatorStatus: boolean;
}
```

---

## 📦 server/src/routes/hospitals.ts

```typescript
// server/src/routes/hospitals.ts
import { Router, Request, Response } from 'express';
import { MOCK_HOSPITALS } from '@medialert/shared';

const router = Router();

// In-memory store (swap with DB in production)
let hospitals = MOCK_HOSPITALS.map(h => ({ ...h }));

// GET /api/hospitals
router.get('/', (req: Request, res: Response) => {
  const { city, include_specialists } = req.query;
  let result = [...hospitals];
  if (city) {
    result = result.filter(h => h.city.toLowerCase() === String(city).toLowerCase());
  }
  res.json({ hospitals: result, count: result.length });
});

// GET /api/hospitals/:id
router.get('/:id', (req: Request, res: Response) => {
  const hospital = hospitals.find(h => h.id === req.params.id);
  if (!hospital) return res.status(404).json({ error: 'Hospital not found' });
  res.json({ hospital });
});

// GET /api/hospitals/:id/capacity
router.get('/:id/capacity', (req: Request, res: Response) => {
  const hospital = hospitals.find(h => h.id === req.params.id);
  if (!hospital) return res.status(404).json({ error: 'Hospital not found' });
  res.json({
    hospitalId: hospital.id,
    erBeds: { total: hospital.totalErBeds, available: hospital.availableErBeds },
    icuBeds: { total: hospital.totalIcuBeds, available: hospital.availableIcuBeds },
    orRooms: { total: hospital.totalOrRooms, available: hospital.availableOrRooms },
    specialists: hospital.specialists.filter(s => s.available),
    generatorStatus: hospital.hasGenerator,
    generatorFuelHours: hospital.generatorFuelHours,
    lastUpdated: new Date().toISOString()
  });
});

// PATCH /api/hospitals/:id/capacity
router.patch('/:id/capacity', (req: Request, res: Response) => {
  const idx = hospitals.findIndex(h => h.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Hospital not found' });

  const { availableErBeds, availableIcuBeds, availableOrRooms, specialistUpdates } = req.body;

  if (availableErBeds !== undefined) hospitals[idx].availableErBeds = availableErBeds;
  if (availableIcuBeds !== undefined) hospitals[idx].availableIcuBeds = availableIcuBeds;
  if (availableOrRooms !== undefined) hospitals[idx].availableOrRooms = availableOrRooms;
  if (specialistUpdates) {
    specialistUpdates.forEach((update: any) => {
      const spec = hospitals[idx].specialists.find(s => s.specialty === update.specialty);
      if (spec) spec.available = update.available;
    });
  }

  // Broadcast to all Socket.io clients
  const io = req.app.get('io');
  io.to('city:Jakarta').emit('hospital:capacity_change', {
    hospitalId: hospitals[idx].id,
    availableErBeds: hospitals[idx].availableErBeds,
    availableIcuBeds: hospitals[idx].availableIcuBeds,
    availableOrRooms: hospitals[idx].availableOrRooms,
    timestamp: new Date().toISOString()
  });

  res.json({ success: true, hospital: hospitals[idx] });
});

export default router;
```

---

## 📦 server/src/routes/routing.ts

```typescript
// server/src/routes/routing.ts
import { Router, Request, Response } from 'express';
import { routePatient } from '@medialert/shared';
import { MOCK_HOSPITALS } from '@medialert/shared';

const router = Router();

// POST /api/routing/recommend
router.post('/recommend', (req: Request, res: Response) => {
  const { injuryType, severity, pickupLat, pickupLng, vitalSigns, incidentId } = req.body;

  if (!injuryType || pickupLat == null || pickupLng == null) {
    return res.status(400).json({ error: 'Missing required fields: injuryType, pickupLat, pickupLng' });
  }

  const incident = {
    id: incidentId || `inc-${Date.now()}`,
    injuryType,
    severity: severity || 'medium',
    vitalSigns,
    pickupLat: parseFloat(pickupLat),
    pickupLng: parseFloat(pickupLng)
  };

  const result = routePatient(incident, MOCK_HOSPITALS);
  res.json(result);
});

// GET /api/routing/specialties
router.get('/specialties', (req: Request, res: Response) => {
  const specialties = ['cardiology', 'neurology', 'orthopedics', 'trauma', 'respiratory', 'pediatric', 'general'];
  res.json({ specialties });
});

export default router;
```

---

## 📦 server/src/index.ts

```typescript
// server/src/index.ts
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

import hospitalsRouter from './routes/hospitals';
import incidentsRouter from './routes/incidents';
import routingRouter from './routes/routing';

const app = express();
const httpServer = createServer(app);

// Socket.io setup
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Attach io to app for use in routes
app.set('io', io);

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), uptime: process.uptime() });
});

// Routes
app.use('/api/hospitals', hospitalsRouter);
app.use('/api/incidents', incidentsRouter);
app.use('/api/routing', routingRouter);

// Socket.io event handlers
io.on('connection', (socket) => {
  console.log(`[Socket] Client connected: ${socket.id}`);

  socket.on('join:city', ({ city }) => {
    socket.join(`city:${city}`);
    console.log(`[Socket] ${socket.id} joined city:${city}`);
    socket.emit('joined', { city, socketId: socket.id });
  });

  socket.on('leave:city', ({ city }) => {
    socket.leave(`city:${city}`);
    console.log(`[Socket] ${socket.id} left city:${city}`);
  });

  socket.on('disconnect', () => {
    console.log(`[Socket] Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`\n🏥 MediAlert API Server running on http://localhost:${PORT}`);
  console.log(`📡 Socket.io ready for connections`);
  console.log(`✅ Health check: http://localhost:${PORT}/api/health\n`);
});

export { io };
```

---

## 📦 apps/web/app/page.tsx (Dashboard — simplified)

```tsx
// apps/web/app/page.tsx — Dispatcher Dashboard

'use client';
import { useState, useEffect } from 'react';

interface Hospital {
  id: string; name: string; shortName: string;
  latitude: number; longitude: number;
  totalErBeds: number; availableErBeds: number;
  totalIcuBeds: number; availableIcuBeds: number;
  hasGenerator: boolean; generatorFuelHours: number;
  specialists: { specialty: string; doctorName: string; available: boolean }[];
  isActive: boolean;
}

interface Incident {
  id: string; injuryType: string; severity: string;
  pickupLat: number; pickupLng: number;
  destinationId?: string; etaMinutes?: number;
  status: string; createdAt: string;
}

export default function Dashboard() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    // Load initial data
    fetch('http://localhost:4000/api/hospitals?city=Jakarta')
      .then(r => r.json())
      .then(d => setHospitals(d.hospitals));

    fetch('http://localhost:4000/api/incidents?status=pending')
      .then(r => r.json())
      .then(d => setIncidents(d.incidents));

    // Connect Socket.io
    const { io } = require('socket.io-client');
    const s = io('http://localhost:4000');
    s.on('connect', () => {
      console.log('Connected to MediAlert socket');
      s.emit('join:city', { city: 'Jakarta' });
    });

    s.on('hospital:capacity_change', ({ hospitalId, availableErBeds, availableIcuBeds }) => {
      setHospitals(prev => prev.map(h =>
        h.id === hospitalId ? { ...h, availableErBeds, availableIcuBeds } : h
      ));
    });

    s.on('incident:new', ({ incident }) => {
      setIncidents(prev => [incident, ...prev]);
    });

    setSocket(s);
    return () => s.disconnect();
  }, []);

  const getCapacityColor = (h: Hospital) => {
    const ratio = h.availableErBeds / h.totalErBeds;
    if (ratio > 0.5) return '#22C55E';
    if (ratio > 0.2) return '#FBBF24';
    return '#EF4444';
  };

  return (
    <div style={{ padding: '24px', fontFamily: 'Inter, sans-serif', background: '#0F172A', minHeight: '100vh', color: 'white' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', margin: 0 }}>
            🚑 MediAlert Dispatch Center
          </h1>
          <p style={{ color: '#94A3B8', margin: '4px 0 0' }}>Jakarta — Real-time</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <span style={{ background: '#22C55E', padding: '6px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: '600' }}>
            ● LIVE
          </span>
          <button
            onClick={() => {
              fetch('http://localhost:4000/api/incidents/mass-casualty', { method: 'POST' });
            }}
            style={{ background: '#EF4444', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
          >
            ⚠️ Simulate Mass Casualty
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
        {[
          { label: 'Active Incidents', value: incidents.length, color: '#F59E0B' },
          { label: 'Hospitals Online', value: hospitals.length, color: '#22C55E' },
          { label: 'Total ER Beds', value: hospitals.reduce((a, h) => a + h.totalErBeds, 0), color: '#3B82F6' },
          { label: 'Beds Available', value: hospitals.reduce((a, h) => a + h.availableErBeds, 0), color: '#22C55E' },
        ].map((stat) => (
          <div key={stat.label} style={{ background: '#1E293B', borderRadius: '12px', padding: '20px' }}>
            <div style={{ color: '#94A3B8', fontSize: '13px', marginBottom: '8px' }}>{stat.label}</div>
            <div style={{ fontSize: '32px', fontWeight: '700', color: stat.color }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Hospital Cards Grid */}
      <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px' }}>
        Hospital Status — {hospitals.length} Facilities
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {hospitals.map((h) => {
          const erPct = (h.availableErBeds / h.totalErBeds) * 100;
          const color = getCapacityColor(h);
          const activeSpecs = h.specialists.filter(s => s.available);
          return (
            <div key={h.id} style={{ background: '#1E293B', borderRadius: '12px', padding: '20px', borderLeft: `4px solid ${color}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '16px' }}>{h.shortName}</div>
                  <div style={{ color: '#64748B', fontSize: '12px' }}>{h.district}</div>
                </div>
                <span style={{ background: color + '22', color, padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>
                  {erPct.toFixed(0)}% Free
                </span>
              </div>
              {/* ER Progress Bar */}
              <div style={{ background: '#334155', borderRadius: '4px', height: '8px', marginBottom: '8px' }}>
                <div style={{ background: color, height: '8px', borderRadius: '4px', width: `${erPct}%`, transition: 'width 0.3s' }} />
              </div>
              <div style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '12px' }}>
                ER: {h.availableErBeds}/{h.totalErBeds} beds &nbsp;|&nbsp; ICU: {h.availableIcuBeds}/{h.totalIcuBeds}
              </div>
              {/* Specialists */}
              {activeSpecs.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {activeSpecs.map(s => (
                    <span key={s.specialty} style={{ background: '#3B82F622', color: '#60A5FA', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600' }}>
                      {s.specialty.toUpperCase()}
                    </span>
                  ))}
                </div>
              ) : (
                <div style={{ color: '#EF4444', fontSize: '12px' }}>⚠ No specialists on duty</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Active Incidents */}
      {incidents.length > 0 && (
        <>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Active Incidents ({incidents.length})
          </h2>
          <div style={{ display: 'grid', gap: '12px' }}>
            {incidents.map((inc) => (
              <div key={inc.id} style={{ background: '#1E293B', borderRadius: '10px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ background: '#F59E0B22', color: '#F59E0B', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' }}>
                    {inc.injuryType}
                  </span>
                  <span style={{ marginLeft: '12px', color: '#94A3B8', fontSize: '13px' }}>
                    {inc.pickupLat.toFixed(4)}, {inc.pickupLng.toFixed(4)}
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: '700', color: inc.severity === 'critical' ? '#EF4444' : '#F59E0B', textTransform: 'uppercase', fontSize: '12px' }}>
                    {inc.severity}
                  </div>
                  <div style={{ color: '#64748B', fontSize: '12px' }}>
                    {inc.status} {inc.etaMinutes ? `· ETA ${inc.etaMinutes}min` : ''}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
```

---

## 📦 apps/mobile/src/screens/AmbulanceScreen.tsx

```tsx
// apps/mobile/src/screens/AmbulanceScreen.tsx — Ambulance App

'use client';
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { INJURY_TYPES, SEVERITY_LEVELS } from '@medialert/shared';

export default function AmbulanceScreen() {
  const [step, setStep] = useState<'input' | 'result'>('input');
  const [form, setForm] = useState({
    injuryType: '',
    severity: 'medium',
    patientAge: '',
    patientGender: 'male',
    spo2: '',
    heartRate: '',
    bpSystolic: '',
    pickupLat: '-6.2088',
    pickupLng: '106.8456',
    chiefComplaint: ''
  });
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async () => {
    if (!form.injuryType) {
      Alert.alert('Required', 'Please select an injury type');
      return;
    }
    const vitalSigns: any = {};
    if (form.spo2) vitalSigns.spo2 = parseFloat(form.spo2);
    if (form.heartRate) vitalSigns.heartRate = parseFloat(form.heartRate);
    if (form.bpSystolic) vitalSigns.bpSystolic = parseFloat(form.bpSystolic);

    const res = await fetch('http://localhost:4000/api/routing/recommend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, vitalSigns })
    });
    const data = await res.json();
    setResult(data);
    setStep('result');
  };

  if (step === 'result' && result) {
    const r = result.recommended;
    return (
      <ScrollView style={styles.container}>
        <View style={[styles.card, { background: '#DCFCE7', borderColor: '#22C55E' }]}>
          <Text style={{ fontSize: 24, fontWeight: '700', color: '#166534', marginBottom: 4 }}>
            ✅ Recommended Hospital
          </Text>
          <Text style={{ fontSize: 20, fontWeight: '700', color: '#166534' }}>{r.name}</Text>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{r.score}</Text>
              <Text style={styles.statLabel}>Score</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{r.distanceKm}km</Text>
              <Text style={styles.statLabel}>Distance</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{r.etaMinutes}min</Text>
              <Text style={styles.statLabel}>ETA</Text>
            </View>
          </View>
          {r.hasSpecialist && (
            <View style={{ background: '#BBF7D0', padding: 12, borderRadius: 8, marginTop: 12 }}>
              <Text style={{ fontWeight: '700', color: '#166534' }}>
                🩺 Specialist on duty: {r.specialistName}
              </Text>
            </View>
          )}
          <View style={{ marginTop: 12 }}>
            {r.reasons.map((reason: string, i: number) => (
              <Text key={i} style={{ color: '#166534', fontSize: 13, marginBottom: 4 }}>• {reason}</Text>
            ))}
          </View>
        </View>

        {/* Alternatives */}
        <Text style={styles.sectionTitle}>Alternative Options</Text>
        {result.alternatives?.map((alt: any, i: number) => (
          <View key={i} style={[styles.card, { background: '#F8FAFC' }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontWeight: '700', fontSize: 16 }}>{alt.name}</Text>
              <Text style={{ fontWeight: '700', color: '#F59E0B' }}>{alt.score} pts</Text>
            </View>
            <Text style={{ color: '#64748B', fontSize: 13 }}>ETA {alt.etaMinutes}min · {alt.distanceKm}km away</Text>
            {alt.hasSpecialist && (
              <Text style={{ color: '#22C55E', fontSize: 13, marginTop: 4 }}>✓ {alt.specialistName}</Text>
            )}
          </View>
        ))}

        <TouchableOpacity style={styles.secondaryBtn} onPress={() => setStep('input')}>
          <Text style={styles.secondaryBtnText}>← Back to Form</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🚑 New Patient Report</Text>
      <Text style={styles.subtitle}>Enter patient details to find the best hospital</Text>

      {/* Injury Type */}
      <Text style={styles.label}>Injury / Condition Type *</Text>
      <View style={styles.chipGrid}>
        {INJURY_TYPES.map((type) => (
          <TouchableOpacity
            key={type.value}
            style={[styles.chip, form.injuryType === type.value && { background: type.color, borderColor: type.color }]}
            onPress={() => setForm({ ...form, injuryType: type.value })}
          >
            <Text style={[styles.chipText, form.injuryType === type.value && { color: 'white' }]}>
              {type.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Severity */}
      <Text style={styles.label}>Severity</Text>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {SEVERITY_LEVELS.map((sev) => (
          <TouchableOpacity
            key={sev.value}
            style={[styles.severityBtn, form.severity === sev.value && { background: sev.color, borderColor: sev.color }]}
            onPress={() => setForm({ ...form, severity: sev.value })}
          >
            <Text style={[styles.severityBtnText, form.severity === sev.value && { color: 'white' }]}>
              {sev.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Vital Signs */}
      <Text style={styles.label}>Vital Signs (Optional)</Text>
      <View style={styles.row}>
        <TextInput style={styles.input} placeholder="SpO2 %" keyboardType="numeric"
          value={form.spo2} onChangeText={v => setForm({...form, spo2: v})} />
        <TextInput style={styles.input} placeholder="Heart rate" keyboardType="numeric"
          value={form.heartRate} onChangeText={v => setForm({...form, heartRate: v})} />
        <TextInput style={styles.input} placeholder="BP Sys" keyboardType="numeric"
          value={form.bpSystolic} onChangeText={v => setForm({...form, bpSystolic: v})} />
      </View>

      {/* Chief Complaint */}
      <Text style={styles.label}>Chief Complaint</Text>
      <TextInput style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
        placeholder="Describe the patient's main symptoms..."
        multiline value={form.chiefComplaint}
        onChangeText={v => setForm({...form, chiefComplaint: v})} />

      {/* Location */}
      <Text style={styles.label}>Pickup Location (Lat, Lng)</Text>
      <View style={styles.row}>
        <TextInput style={styles.input} placeholder="Latitude" keyboardType="numeric"
          value={form.pickupLat} onChangeText={v => setForm({...form, pickupLat: v})} />
        <TextInput style={styles.input} placeholder="Longitude" keyboardType="numeric"
          value={form.pickupLng} onChangeText={v => setForm({...form, pickupLng: v})} />
      </View>

      <TouchableOpacity style={styles.primaryBtn} onPress={handleSubmit}>
        <Text style={styles.primaryBtnText}>🔍 Find Best Hospital</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, background: '#F8FAFC', padding: 20 },
  title: { fontSize: 24, fontWeight: '700', color: '#1E293B', marginTop: 40 },
  subtitle: { color: '#64748B', marginBottom: 24 },
  label: { fontWeight: '600', color: '#334155', marginBottom: 8, marginTop: 16 },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5, borderColor: '#CBD5E1', background: 'white' },
  chipText: { fontSize: 13, fontWeight: '600', color: '#475569' },
  severityBtn: { flex: 1, paddingVertical: 10, borderRadius: 8, borderWidth: 1.5, borderColor: '#CBD5E1', alignItems: 'center', background: 'white' },
  severityBtnText: { fontWeight: '700', fontSize: 13, color: '#475569' },
  row: { flexDirection: 'row', gap: 10 },
  input: { flex: 1, background: 'white', borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15 },
  primaryBtn: { background: '#EF4444', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 24 },
  primaryBtnText: { color: 'white', fontWeight: '700', fontSize: 17 },
  secondaryBtn: { background: '#E2E8F0', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 16, marginBottom: 40 },
  secondaryBtnText: { color: '#475569', fontWeight: '600', fontSize: 15 },
  card: { background: 'white', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 12 },
  sectionTitle: { fontWeight: '700', fontSize: 16, color: '#334155', marginBottom: 12, marginTop: 8 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 16 },
  stat: { alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: '700', color: '#166534' },
  statLabel: { fontSize: 12, color: '#16A34A' }
});
```
