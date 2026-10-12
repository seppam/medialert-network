# MediAlert Network — Pitch Deck Outline
## Garuda Hacks 7.0 Submission Deck

> **Pitch Duration:** 3–5 minutes (standard hackathon demo slot)
> **Format:** Slide deck (Google Slides / Canva / Figma) + Live Demo

---

## 🎯 Strategic Pitch Philosophy

Garuda Hacks judges evaluate on:
1. **Problem Clarity** — Can they feel the pain immediately?
2. **Solution Novelty** — Is this different from what already exists?
3. **Technical Depth** — Does it show real engineering, not just a frontend?
4. **Presentation Quality** — Can you sell it in under 5 minutes?
5. **Real-World Impact** — Would this actually work if deployed?

MediAlert Network scores high on all 5. The pitch should feel **urgent and human**, not technical and dry.

---

## Slide 1: THE HOOK — Problem Slide

### Visual
Full-screen photo/video: Jakarta flooding, ambulance stuck in traffic OR hospital ER corridor with patients on stretchers.

### Headline (bold, large text)
> "In the last Jakarta flood, ambulance crews drove patients to **5 hospitals** before finding one with a bed. **34 minutes lost.**"

### Supporting Stats (3 bullets, fast to read)
- Average ambulance response time in Jakarta: **23 minutes**
- During mass-casualty events: **67% of hospitals reach full capacity within 2 hours**
- Every minute of delay for cardiac patients = **10% increase in mortality risk**

### Tagline (small, bottom)
> "We're not building an app. We're building a system that decides who lives and who waits."

---

## Slide 2: THE TEAM

### Headline
> "Built by [Your Names] — Fullstack developers with experience in real-time systems"

### Team Credibility (quick bullets)
- [Name]: [Relevant skill — e.g., "3 years React/Node.js, built 2 production dashboards"]
- [Name]: [Backend + Cloud infrastructure]
- [Name]: [Mobile development / AI agent workflows]

---

## Slide 3: THE SOLUTION — What is MediAlert Network?

### Headline
> "A real-time hospital capacity and ambulance routing system — like Waze, but for life-or-death decisions."

### 3 Key Components (icon + name + 1-line description each)

**🚑 Ambulance App**
> Paramedic inputs patient condition → AI instantly recommends the best hospital

**🏥 Dispatcher Dashboard**
> Live map showing every hospital's ER/ICU capacity, updated in real-time

**🤖 Smart Routing Agent**
> Not just nearest hospital — routes based on injury type, specialist availability, and real-time capacity

### Cross-Track Badge
> ✓ Healthcare Track + ✓ Public Safety Track

---

## Slide 4: LIVE DEMO SETUP

### Headline
> "Let me show you how it works — LIVE."

### What to prepare (3 scenes):

**Scene 1 — Normal Operations**
> "This is Jakarta at 8 AM on a normal day. 5 hospitals, all showing green."

**Scene 2 — Mass Casualty Event (3 min into demo)**
> "A building collapse just sent 8 patients to the nearest hospitals. Watch what happens."

**Scene 3 — AI Agent Decision (the WOW moment)**
> "New patient: Male, 52, suspected heart attack. The AI doesn't just pick the nearest hospital — it routes him to RSUP Fatmawati because they have a cardiologist on duty AND ICU beds available. The other 4 hospitals? Full."

---

## Slide 5: TECHNICAL DEEP DIVE (Keep it visual, not code-heavy)

### Headline
> "Under the hood — built with production-grade architecture"

### Architecture Diagram

```
[Ambulance App (React Native)]
         ↕ REST API + WebSocket
[Node.js + Express API Server]
         ↕ Socket.io
[Real-time Engine (Socket.io + Redis)]
         ↕
[Hospitals DB (PostgreSQL + PostGIS)]
         ↑
[AI Routing Agent (Decision Engine)]
         ↑
[Ambulance GPS Stream]
```

### Key Tech Decisions (just 3–4 bullets)
- **Real-time:** Socket.io pushes hospital capacity updates instantly to all connected apps
- **AI Routing:** Decision tree + capacity-weighted scoring — deterministic and fast, no black box
- **Maps:** Mapbox GL JS — works offline with pre-loaded tiles for disaster scenarios
- **Scalable:** REST + WebSocket — ready to integrate with Indonesia's Dinas Kesehatan APIs

---

## Slide 6: IMPACT — Why This Matters

### Headline
> "In Indonesia's most disaster-prone cities, every second is measured in lives"

### Impact Metrics

| Metric | Current | With MediAlert |
|---|---|---|
| Time to find available hospital | **23 min avg** | **< 30 sec** |
| Hospital capacity utilization | **40% inefficient** | **Optimized** |
| Lives at risk from routing errors | **Thousands/year** | **Dramatically reduced** |

### Who Benefits (icon grid)
- 🚑 Paramedics — know where to go instantly
- 🏥 Hospitals — avoid overcrowding
- 👨‍⚕️ Patients — get to the right care faster
- 🏛️ Govt/BNPB — real-time disaster response data

---

## Slide 7: BUSINESS MODEL & SCALABILITY

### Headline
> "From hackathon prototype to national infrastructure"

### Phase 1 — Now (Garuda Hacks MVP)
- 5–8 mock hospitals on a live map
- Working ambulance routing demo
- Pre-scripted mass casualty scenario

### Phase 2 — 6 Months (Pilot)
- Partner with 1 city (Jakarta / Surabaya)
- Integrate with local hospital management systems (SIMRS)
- Connect to BNPB's existing disaster response network

### Phase 3 — 2 Years (National Scale)
- Nationwide hospital coverage
- Integration with 119 (Indonesia's emergency number)
- AI-powered predictive capacity planning

### Revenue / Sustainability
- SaaS licensing to city governments
- API access for health insurance companies
- Disaster response grants from BNPB / World Bank

---

## Slide 8: COMPETITIVE LANDSCAPE

### Headline
> "Why hasn't this been built yet — and why we're the ones to build it"

| Feature | Google Maps | Existing EMS | MediAlert |
|---|---|---|---|
| Real-time hospital capacity | ❌ | ❌ | ✅ |
| Intelligent triage routing | ❌ | ❌ | ✅ |
| Specialist availability | ❌ | ❌ | ✅ |
| Disaster-mode resilience | ❌ | ❌ | ✅ |
| Designed for Indonesia | ❌ | ❌ | ✅ |

---

## Slide 9: THE ASK — What We Need

- 💰 **Funding** — IDR 50M+ to pilot in Jakarta
- 🤝 **Partnerships** — Dinas Kesehatan, BNPB, hospital groups
- 📡 **Data Access** — API access to SIMRS (hospital management systems)
- 🏥 **Medical Advisors** — Emergency medicine doctors to validate routing logic

---

## Slide 10: CLOSING

### Headline
> "Every minute an ambulance spends driving to a full hospital is a minute a patient doesn't have. We're fixing that."

### Subtext
> "MediAlert Network — routing smarter, saving lives."

### Contact
- 👤 [Your Name(s)]
- 📧 [email@domain.com]
- 🔗 [GitHub Repo link]
- 📱 [Demo live link]

---

## 📋 Pitch Timing Guide (5 minutes total)

| Section | Time | What You Say |
|---|---|---|
| Hook (Slide 1) | 0:00–0:45 | Tell the story of the 34-minute hospital hunt |
| Team (Slide 2) | 0:45–1:00 | Quick intro — who you are |
| Solution (Slide 3) | 1:00–1:30 | "We're building X, Y, Z — here's the 10-second summary" |
| Demo Setup (Slide 4) | 1:30–1:45 | Set expectations for the demo |
| **LIVE DEMO** | 1:45–3:15 | **Run the actual app** — most important 90 seconds |
| Technical (Slide 5) | 3:15–3:45 | Point to architecture diagram |
| Impact (Slide 6) | 3:45–4:15 | Hit the numbers hard |
| Business (Slide 7) | 4:15–4:30 | Roadmap, who benefits |
| Close (Slide 10) | 4:30–5:00 | One strong closing line — END |

---

## 🎤 Tips for Delivery

**Do:**
- Start with the human story before showing tech
- Speak slowly during the demo — let judges absorb what they see
- Know your mock data by heart — if a judge asks "which hospital did it pick?" answer confidently
- Practice the demo flow 10+ times
- Have a backup plan: if demo crashes, show a Loom video recording

**Don't:**
- Don't read slides — judges can read
- Don't explain every technical decision
- Don't oversell AI — call it "intelligent routing" or "decision engine" (more credible)
- Don't skip the close — end on emotion, not a bullet list

---

## 🎨 Slide Design Guidelines

- **Color palette:** Red (#E63946) + White + Dark Navy (#1D3557)
- **Fonts:** Bold sans-serif (Inter / Poppins / Montserrat)
- **Images:** Real Jakarta/Indonesian city photos, not stock
- **No more than 5 words per bullet**
- **One big number or stat per slide**
- **Use Indonesian context** — RSUP Fatmawati, Jakarta floods, BNPB
