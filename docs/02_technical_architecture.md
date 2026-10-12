# MediAlert Network — Technical Architecture
## System Design, Database Schema, API Contracts, and Real-time Events

---

## 1. SYSTEM OVERVIEW

MediAlert Network has **3 main interfaces**:

1. **Dispatcher Dashboard** (web — Next.js) — For hospital coordinators and disaster response teams
2. **Ambulance App** (mobile — React Native / or PWA) — For paramedics in the field
3. **AI Routing Engine** (backend service — Node.js) — The decision-making brain
4. **Real-time Event Bus** (Socket.io) — Powers all live updates

```
┌──────────────────────────────────────────────────────────────┐
│                     MEDIALERT NETWORK                         │
│                                                              │
│  ┌──────────────┐    REST + WS     ┌──────────────────┐     │
│  │ Ambulance    │ ←──────────────→ │   API Server     │     │
│  │ App (RN/PWA)│                  │  Express + Node  │     │
│  └──────────────┘                  └────────┬─────────┘     │
│                                             │                │
│                          ┌──────────────────┼─────────────┐   │
│                          ↓                  ↓             ↓   │
│               ┌──────────────┐  ┌──────────────┐  ┌────────┐ │
│               │ Socket.io    │  │  Routing     │  │Hospital│ │
│               │ Real-time    │  │  Agent       │  │  Data  │ │
│               │ Event Bus    │  │  (Decision   │  │ Service│ │
│               └──────┬───────┘  │  Engine)     │  └────────┘ │
│                      │          └──────────────┘              │
│          ┌───────────┼──────────────────────────────────┐    │
│          ↓           ↓                                      ↓    │
│  ┌──────────────┐  ┌──────────────┐              ┌───────────┐ │
│  │ Dispatcher   │  │ Hospital     │              │ GPS/Map   │ │
│  │ Dashboard   │  │ Status Feed  │              │ Services  │ │
│  │ (Next.js)   │  │ (Real-time)  │              │           │ │
│  └──────────────┘  └──────────────┘              └───────────┘ │
└──────────────────────────────────────────────────────────────┘
```

---

## 2. DATABASE SCHEMA (PostgreSQL + PostGIS)

```sql
-- ============================================================
-- MEDIALERT NETWORK — Database Schema (PostgreSQL + PostGIS)
-- ============================================================

-- Hospitals table
CREATE TABLE hospitals (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            VARCHAR(255) NOT NULL,          -- e.g., "RSUP Fatmawati"
  short_name      VARCHAR(100),                   -- e.g., "Fatmawati"
  address         TEXT,
  city            VARCHAR(100) DEFAULT 'Jakarta',
  latitude        DECIMAL(10, 8) NOT NULL,
  longitude       DECIMAL(11, 8) NOT NULL,
  location        GEOMETRY(Point, 4326),          -- PostGIS point

  -- Capacity
  total_er_beds   INTEGER DEFAULT 0,
  available_er_beds INTEGER DEFAULT 0,
  total_icu_beds  INTEGER DEFAULT 0,
  available_icu_beds INTEGER DEFAULT 0,
  total_or_rooms  INTEGER DEFAULT 0,             -- Operating rooms
  available_or_rooms INTEGER DEFAULT 0,

  -- Power backup
  has_generator   BOOLEAN DEFAULT false,
  generator_fuel_hours INTEGER,                   -- Hours of fuel remaining

  -- Contact
  phone           VARCHAR(20),
  emergency_line  VARCHAR(20),

  -- Metadata
  hospital_class  VARCHAR(20),                     -- 'type_a', 'type_b', 'type_c', 'clinic'
  district        VARCHAR(100),                   -- Jakarta administrative district
  is_active       BOOLEAN DEFAULT true,
  last_updated    TIMESTAMPTZ DEFAULT NOW(),

  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Specialists on duty
CREATE TABLE specialists_on_duty (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id     UUID REFERENCES hospitals(id) ON DELETE CASCADE,
  specialty       VARCHAR(100) NOT NULL,          -- 'cardiology', 'neurology', 'orthopedics', 'trauma'
  doctor_name     VARCHAR(255),
  available       BOOLEAN DEFAULT true,
  shift_end       TIMESTAMPTZ,                    -- When this specialist's shift ends
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Emergency incidents (active patient transports)
CREATE TABLE incidents (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ambulance_id    UUID,                            -- References ambulance/paramedic

  -- Patient info
  patient_age     INTEGER,
  patient_gender  VARCHAR(10),
  injury_type     VARCHAR(100) NOT NULL,           -- 'cardiac', 'stroke', 'trauma', 'respiratory', etc.
  severity        VARCHAR(20) DEFAULT 'medium',   -- 'critical', 'high', 'medium', 'low'

  -- Triage details
  chief_complaint TEXT,
  vital_signs     JSONB,                           -- { bp: "90/60", hr: 110, spo2: 88, temp: 38.5 }
  triage_notes    TEXT,

  -- Routing
  pickup_lat      DECIMAL(10, 8),
  pickup_lng      DECIMAL(11, 8),
  destination_id  UUID REFERENCES hospitals(id),   -- Hospital assigned
  assigned_at     TIMESTAMPTZ,
  eta_minutes     INTEGER,

  -- Status: pending | assigned | en_route | arrived | cancelled
  status          VARCHAR(20) DEFAULT 'pending',
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Incident routing decision log (audit trail)
CREATE TABLE routing_decisions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id     UUID REFERENCES incidents(id),
  hospital_id     UUID REFERENCES hospitals(id),
  score           DECIMAL(6, 2),                   -- Routing score for this hospital
  distance_km     DECIMAL(6, 2),
  available_beds INTEGER,
  specialist_match BOOLEAN,
  reasons         JSONB,                           -- Why this hospital was chosen/rejected
  is_final_choice BOOLEAN DEFAULT false,
  decided_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Dispatcher users
CREATE TABLE dispatchers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            VARCHAR(255),
  email           VARCHAR(255) UNIQUE,
  role            VARCHAR(50) DEFAULT 'dispatcher',  -- 'admin', 'dispatcher', 'hospital_staff'
  assigned_city   VARCHAR(100),
  is_online       BOOLEAN DEFAULT false,
  last_seen       TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Hospital capacity update log (for analytics)
CREATE TABLE capacity_logs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id     UUID REFERENCES hospitals(id),
  er_beds_before  INTEGER,
  er_beds_after   INTEGER,
  icu_beds_before INTEGER,
  icu_beds_after INTEGER,
  trigger_source  VARCHAR(50),                    -- 'manual', 'auto', 'incident_arrival'
  changed_by      UUID,                           -- Dispatcher who made the change
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_hospitals_location ON hospitals USING GIST(location);
CREATE INDEX idx_hospitals_city ON hospitals(city);
CREATE INDEX idx_incidents_status ON incidents(status);
CREATE INDEX idx_incidents_created ON incidents(created_at DESC);
CREATE INDEX idx_specialists_hospital ON specialists_on_duty(hospital_id);
CREATE INDEX idx_specialists_available ON specialists_on_duty(specialty) WHERE available = true;
CREATE INDEX idx_routing_incident ON routing_decisions(incident_id);
CREATE INDEX idx_capacity_logs_hospital ON capacity_logs(hospital_id, created_at DESC);
```

---

## 3. API ENDPOINTS

### 3.1 Hospital Endpoints

```
GET    /api/hospitals
       → List all hospitals with current capacity
       → Query params: ?city=Jakarta&include_specialists=true
       → Response: { hospitals: [...], count: 8 }

GET    /api/hospitals/:id
       → Single hospital detail with specialists on duty
       → Response: { hospital: {...}, specialists: [...] }

GET    /api/hospitals/:id/capacity
       → Real-time capacity snapshot for one hospital
       → Response: { er_beds: { total: 20, available: 8 }, icu_beds: {...}, specialists: [...] }

PATCH  /api/hospitals/:id/capacity
       → Update hospital capacity (dispatcher or hospital staff)
       → Body: { available_er_beds: 7, available_icu_beds: 3 }
       → Triggers: Socket.io broadcast to all clients
       → Response: { success: true, hospital: {...} }
```

### 3.2 Incident & Routing Endpoints

```
POST   /api/incidents
       → Create new incident / request hospital recommendation
       → Body: { patient_age, patient_gender, injury_type, severity, chief_complaint,
                 vital_signs: { bp, hr, spo2, temp }, pickup_lat, pickup_lng }
       → Response: { incident_id, recommended_hospital, routing_scores: [...] }

GET    /api/incidents
       → List active incidents
       → Query: ?status=pending&city=Jakarta
       → Response: { incidents: [...], count: 5 }

GET    /api/incidents/:id
       → Single incident with routing decision details
       → Response: { incident: {...}, routing_decision: {...}, hospital: {...} }

PATCH  /api/incidents/:id
       → Update incident status
       → Body: { status: 'assigned', destination_id: 'uuid', eta_minutes: 8 }
       → Triggers: Socket.io event

PATCH  /api/incidents/:id/arrive
       → Mark patient as arrived at hospital
       → Triggers: Hospital capacity auto-update (decrement bed count)
       → Triggers: Socket.io broadcast
```

### 3.3 Routing Engine Endpoints

```
POST   /api/routing/recommend
       → The AI routing agent — given patient data, return ranked hospital list
       → Body: { injury_type, severity, pickup_lat, pickup_lng, vital_signs }
       → Response: {
           recommended: { hospital_id, name, score, reasons, eta_minutes },
           alternatives: [
             { hospital_id, name, score, reasons, eta_minutes },
             ...
           ]
         }

GET    /api/routing/specialties
       → List all tracked specialties
       → Response: ['cardiology', 'neurology', 'orthopedics', 'trauma', 'pediatric', 'general']
```

### 3.4 WebSocket Events

```
Client → Server:
  'join:city'        { city: 'Jakarta' }          -- Subscribe to city updates
  'leave:city'       { city: 'Jakarta' }           -- Unsubscribe
  'incident:create'  { ...incidentData }           -- Create new incident
  'hospital:update'  { hospitalId, capacityData }  -- Manual capacity update

Server → Client:
  'hospital:capacity_change'  { hospitalId, er_beds, icu_beds, timestamp }
  'incident:new'             { incident }
  'incident:updated'         { incidentId, status, destination }
  'incident:arrived'         { incidentId, hospitalId, timestamp }
  'alert:mass_casualty'      { incident_count, hospitals_affected, severity }
```

---

## 4. AI ROUTING AGENT — Decision Logic

This is the **core intelligence** of MediAlert. It's a **rule-based decision engine** (not black-box ML — deterministic, fast, explainable to judges).

```javascript
// routingAgent.js — Simplified routing decision logic

function routePatient(incident, hospitals) {
  // Step 1: Filter hospitals by basic criteria
  const eligible = hospitals.filter(h => {
    if (!h.is_active) return false;
    if (h.available_er_beds < 1) return false;           // Must have at least 1 ER bed
    if (h.available_icu_beds < 1 && isCritical(incident)) return false; // Critical = ICU needed
    return true;
  });

  // Step 2: Score each hospital
  const scored = eligible.map(hospital => {
    let score = 100;

    // Distance penalty (0–30 points)
    const distance = calculateDistance(incident.pickup_lat, incident.pickup_lng,
                                      hospital.latitude, hospital.longitude);
    score -= Math.min(distance * 2, 30);  // 1km = -2 pts, max -30 pts

    // Capacity bonus (0–20 points)
    const capacityScore = (hospital.available_er_beds / hospital.total_er_beds) * 20;
    score += capacityScore;

    // ICU bonus for critical patients (0–15 points)
    if (isCritical(incident) && hospital.available_icu_beds > 0) {
      score += (hospital.available_icu_beds / hospital.total_icu_beds) * 15;
    }

    // Specialist match bonus (0–25 points) — THE KEY DIFFERENTIAIATOR
    const specialistNeeded = getSpecialtyForInjury(incident.injury_type);
    const hasSpecialist = hospital.specialists.some(s =>
      s.specialty === specialistNeeded && s.available && s.shift_end > new Date()
    );
    if (hasSpecialist) score += 25;
    else score -= 15; // Penalty for no specialist

    // Generator/backup power bonus (0–10 points)
    if (hospital.has_generator && hospital.generator_fuel_hours > 6) {
      score += 10;
    }

    // ETA estimation
    const eta_minutes = Math.ceil(distance / 0.5);  // Rough: 0.5 km/min in Jakarta traffic

    return {
      hospital_id: hospital.id,
      name: hospital.name,
      score: Math.round(score),
      reasons: buildReasons(hospital, incident, distance, specialistNeeded, hasSpecialist),
      distance_km: Math.round(distance * 10) / 10,
      eta_minutes,
      available_er: hospital.available_er_beds,
      available_icu: hospital.available_icu_beds,
      has_specialist: hasSpecialist,
      specialist_name: hasSpecialist ?
        hospital.specialists.find(s => s.specialty === specialistNeeded)?.doctor_name : null
    };
  });

  // Step 3: Sort by score (highest first)
  scored.sort((a, b) => b.score - a.score);

  return {
    recommended: scored[0],
    alternatives: scored.slice(1, 4)  // Top 3 alternatives
  };
}

// Helper: Map injury type → needed specialty
function getSpecialtyForInjury(injuryType) {
  const map = {
    'cardiac': 'cardiology',
    'heart_attack': 'cardiology',
    'stroke': 'neurology',
    'neurological': 'neurology',
    'fracture': 'orthopedics',
    'trauma': 'trauma',
    'accident': 'trauma',
    'burn': 'trauma',
    'respiratory': 'pulmonology',
    'pediatric': 'pediatric'
  };
  return map[injuryType.toLowerCase()] || 'general';
}

// Helper: Determine if patient is critical
function isCritical(incident) {
  const criticalSigns = ['spo2 < 90', 'bp_systolic < 80', 'hr > 150', 'hr < 40'];
  if (!incident.vital_signs) return incident.severity === 'critical';
  const vs = incident.vital_signs;
  if (vs.spo2 && vs.spo2 < 90) return true;
  if (vs.bp && vs.bp < 80) return true;
  if (vs.hr && (vs.hr > 150 || vs.hr < 40)) return true;
  return incident.severity === 'critical';
}
```

### Routing Score Breakdown

```
Total Score = 100 (base)
─────────────────────────
Distance:           -30 pts max  (penalty — farther = worse)
Capacity (ER beds):  +20 pts max  (bonus — more empty beds = better)
ICU (critical):     +15 pts max  (bonus — for critical patients only)
Specialist Match:    +25 pts max  (MAJOR bonus — specialist on duty = huge)
No Specialist:       -15 pts       (penalty — no specialist available)
Generator backup:    +10 pts max  (bonus — reliable power)
─────────────────────────
Max Score:          ~140 pts
```

---

## 5. MOCK DATA — Indonesian Hospital Names

Use these realistic Indonesian hospital names for the demo:

```
01. RSUP Fatmawati         — South Jakarta    (Type A, large capacity)
02. RSPI Sulianti Saroso   — North Jakarta   (Infectious disease specialty)
03. RS St. Carolus         — Central Jakarta  (Catholic, well-known)
04. RS Siloam Semanggi     — South Jakarta   (Private, modern facilities)
05. RSUD Pasar Minggu      — South Jakarta    (Government district hospital)
06. RS Cipto Mangunkusumo  — Central Jakarta  (National referral hospital)
07. RS Hermina Daan Mogot  — West Jakarta     (Private, 24/7 emergency)
08. RS Sumber Waras        — West Jakarta     (Historic public hospital)
```

---

## 6. PRE-SCRIPTED DEMO SCENARIO

This is how you run the live demo in 5 minutes:

```
T+0:00  — Open dashboard. 5 hospitals, all green (available beds > 0).
          Point and say: "Jakarta at 8 AM. All hospitals running normally."

T+0:30  — Click "Simulate Mass Casualty" button.
          System triggers 3 incidents simultaneously (building collapse):
          - Incident 1: Trauma patient → nearest hospital (auto-routed)
          - Incident 2: Cardiac patient → routed to RSUP Fatmawati (cardio on duty)
          - Incident 3: Stroke patient → routed to RSCM (neuro on duty)

T+1:00  — Watch as hospital capacity bars drop in real-time (Socket.io update).
          All 3 ambulance markers move on the map simultaneously.

T+1:30  — Hospital RSPI Sulianti Saroso: capacity hits RED (0 ER beds).
          Watch it turn red on the map + alert fires.

T+2:00  — NEW PATIENT: "Male, 52, chest pain, suspected MI, BP 90/60"
          Click "Find Hospital" → routing agent runs → result shows:
          "RSUP Fatmawati — Score: 112 ( cardiologist on duty, 3 ICU beds, ETA 8 min)"
          Explain why NOT nearest: "Nearest hospital has 0 beds. Second nearest
          has no cardiologist. This one has both."

T+2:30  — Confirm routing → ambulance marker animates to Fatmawati.
          ETA countdown appears. Hospital capacity updates live.

T+3:00  — Show dispatcher dashboard: incident timeline, hospital statuses.
          Summary: "3 patients routed, 0 full-hospital reroutes needed."
```

---

## 7. KEY TECHNICAL DECISIONS EXPLAINED

### Why Node.js + Socket.io over other options?

| Option | Why NOT | Why MediAlert chose Node.js |
|---|---|---|
| Python + Django | No native WebSocket, needs extra lib (Django Channels) | Express + Socket.io is native real-time |
| Firebase Realtime DB | Too expensive at scale, not self-hostable | Self-hostable on Vercel/Railway |
| AWS API Gateway + Lambda | Cold starts kill real-time, latency too high | Persistent Socket.io connections |
| Go | Fast but overkill for this use case | Node.js is faster to code for 30h |

### Why NOT full ML / AI model?

- Hackathon judges can't verify ML model accuracy in 5 minutes
- Deterministic rule-based = explainable ("here's WHY we picked this hospital")
- Runs instantly without GPU
- Easy to demonstrate: "cardiac → cardiologist on duty = +25 points"

### Why Mapbox over Google Maps?

- Cheaper for hackathon/demo budgets
- Better offline tile support (critical for disaster scenarios)
- Open-source friendly
- Free tier sufficient for MVP (50K loads/month)

---

## 8. REAL-TIME SOCKET.IO ARCHITECTURE

```javascript
// server/socket/index.js — Socket.io server setup

const { Server } = require('socket.io');

function setupSocketServer(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL,  // Vercel URL or localhost
      methods: ['GET', 'POST']
    }
  });

  // Rooms: one per city for scalable subscriptions
  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Subscribe to a city's hospital updates
    socket.on('join:city', ({ city }) => {
      socket.join(`city:${city}`);
      socket.emit('joined', { city, socketId: socket.id });
    });

    socket.on('leave:city', ({ city }) => {
      socket.leave(`city:${city}`);
    });

    // Hospital capacity update — broadcast to all subscribers
    socket.on('hospital:update', async (data) => {
      const { hospitalId, capacityData } = data;
      await updateHospitalCapacity(hospitalId, capacityData);
      io.to(`city:${data.city}`).emit('hospital:capacity_change', {
        hospitalId,
        ...capacityData,
        timestamp: new Date().toISOString()
      });
    });

    // New incident — notify dispatcher dashboard
    socket.on('incident:create', async (incidentData) => {
      const incident = await createIncident(incidentData);
      const routing = await routePatient(incident, await getHospitals(incident.city));
      await saveRoutingDecision(incident.id, routing);

      // Broadcast to dispatcher dashboards
      io.to(`city:${incident.city}`).emit('incident:new', { incident, routing });

      // Send result back to ambulance app
      socket.emit('routing:result', routing);
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  return io;
}
```

---

## 9. INFRASTRUCTURE DEPLOYMENT (for post-hackathon)

```
┌─────────────────────────────────────────────────┐
│  Vercel / Railway / Render                      │
│  ├── Next.js Dashboard   (vercel.com)           │
│  └── Node.js API Server   (api + Socket.io)     │
│                                                 │
│  Supabase / Railway PostgreSQL                  │
│  └── Hospital data, incidents, routing logs      │
│                                                 │
│  Mapbox GL JS                                   │
│  └── Map tiles + geocoding + routing            │
│                                                 │
│  Optional: Redis (Upstash)                      │
│  └── Socket.io adapter for horizontal scaling   │
└─────────────────────────────────────────────────┘
```

**Hackathon Deployment (free tier):**
- Frontend: Vercel (Next.js) — free
- Backend: Railway hobby tier / Render free tier
- Database: Supabase free tier (PostgreSQL)
- Maps: Mapbox free tier (50K loads/month)
- Socket.io: bundled in Node.js server (same host as API)
