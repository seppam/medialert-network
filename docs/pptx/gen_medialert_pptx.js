/**
 * Generate MediAlert Network PPTX
 * Usage: node gen_medialert_pptx.js
 */

const PptxGenJS = require('pptxgenjs');
const fs = require('fs');
const path = require('path');

// ── Color palette ──────────────────────────────────────────────────────────
const NAVY      = '1D3557';
const RED       = 'E63946';
const WHITE     = 'FFFFFF';
const ICE_BLUE  = 'CADCFC';
const DARK_BG   = '0F172A';
const LIGHT_BG  = 'F8FAFC';
const GRAY_TEXT = '64748B';
const ACCENT    = '457B9D';
const GREEN     = '22C55E';
const AMBER     = 'F59E0B';

const pptx = new PptxGenJS();
pptx.layout = 'LAYOUT_WIDE'; // 13.33" x 7.5" (16:9)
pptx.title = 'MediAlert Network — Garuda Hacks 7.0';
pptx.author = 'MediAlert Team';

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE HELPERS
// ═══════════════════════════════════════════════════════════════════════════

function newSlide() { return pptx.addSlide(); }

// ── COVER SLIDE ──────────────────────────────────────────────────────────
function slide_cover() {
  const s = newSlide();
  s.background = { color: DARK_BG };

  // Red accent bar (left)
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.15, h: 7.5,
    fill: { color: RED }, line: { color: RED }
  });

  // Title
  s.addText('MediAlert Network', {
    x: 0.6, y: 1.4, w: 12, h: 1.4,
    fontSize: 64, bold: true, color: WHITE, fontFace: 'Arial'
  });

  // Subtitle
  s.addText('Real-Time Hospital Routing for Mass Casualty Events', {
    x: 0.6, y: 2.9, w: 10, h: 0.7,
    fontSize: 26, color: ICE_BLUE, fontFace: 'Arial'
  });

  // Tagline box
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.6, y: 3.8, w: 8, h: 0.8,
    fill: { color: RED }, line: { color: RED }, rectRadius: 0.05
  });
  s.addText('"Waze for ambulances — routing smarter, saving lives"', {
    x: 0.6, y: 3.8, w: 8, h: 0.8,
    fontSize: 18, bold: true, color: WHITE, fontFace: 'Arial', align: 'center', valign: 'middle'
  });

  // Event info
  s.addText('Garuda Hacks 7.0  |  July 16–18, 2026  |  UMN, Indonesia', {
    x: 0.6, y: 5.0, w: 10, h: 0.5,
    fontSize: 16, color: GRAY_TEXT, fontFace: 'Arial'
  });

  // Track badges
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.6, y: 5.7, w: 2.2, h: 0.55,
    fill: { color: NAVY }, line: { color: ACCENT }, rectRadius: 0.05
  });
  s.addText('🏥 Healthcare', {
    x: 0.6, y: 5.7, w: 2.2, h: 0.55,
    fontSize: 13, bold: true, color: WHITE, fontFace: 'Arial', align: 'center', valign: 'middle'
  });
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 2.95, y: 5.7, w: 2.4, h: 0.55,
    fill: { color: NAVY }, line: { color: ACCENT }, rectRadius: 0.05
  });
  s.addText('🛡️ Public Safety', {
    x: 2.95, y: 5.7, w: 2.4, h: 0.55,
    fontSize: 13, bold: true, color: WHITE, fontFace: 'Arial', align: 'center', valign: 'middle'
  });

  // Stats (bottom right)
  const stats = [
    { val: '23 min', label: 'Avg ambulance wait' },
    { val: '67%', label: 'Hospitals overwhelmed' },
    { val: '<30 sec', label: 'With MediAlert' },
  ];
  stats.forEach((stat, i) => {
    s.addText(stat.val, {
      x: 9.2 + i * 1.4, y: 6.3, w: 1.3, h: 0.6,
      fontSize: 22, bold: true, color: RED, fontFace: 'Arial', align: 'center'
    });
    s.addText(stat.label, {
      x: 9.2 + i * 1.4, y: 6.85, w: 1.3, h: 0.5,
      fontSize: 9, color: GRAY_TEXT, fontFace: 'Arial', align: 'center'
    });
  });
}

// ── PROBLEM SLIDE ────────────────────────────────────────────────────────
function slide_problem() {
  const s = newSlide();
  s.background = { color: LIGHT_BG };

  // Red header bar
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: 13.33, h: 1.2,
    fill: { color: RED }, line: { color: RED }
  });
  s.addText('THE PROBLEM', {
    x: 0.5, y: 0, w: 12, h: 1.2,
    fontSize: 32, bold: true, color: WHITE, fontFace: 'Arial', valign: 'middle', charSpacing: 4
  });

  // Main stat callout
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.5, y: 1.5, w: 5.5, h: 2.8,
    fill: { color: DARK_BG }, line: { color: DARK_BG }, rectRadius: 0.1
  });
  s.addText('34', {
    x: 0.5, y: 1.6, w: 5.5, h: 1.4,
    fontSize: 96, bold: true, color: RED, fontFace: 'Arial', align: 'center'
  });
  s.addText('minutes lost', {
    x: 0.5, y: 2.9, w: 5.5, h: 0.5,
    fontSize: 22, bold: true, color: WHITE, fontFace: 'Arial', align: 'center'
  });
  s.addText('driving to full hospitals before finding one with a bed', {
    x: 0.7, y: 3.5, w: 5.1, h: 0.7,
    fontSize: 14, color: ICE_BLUE, fontFace: 'Arial', align: 'center'
  });

  // Stats grid (right side)
  const problems = [
    { icon: '🚑', stat: '23 min', desc: 'Average ambulance response in Jakarta' },
    { icon: '🏥', stat: '67%', desc: 'Hospitals reach full capacity within 2 hours' },
    { icon: '❤️', stat: '+10%', desc: 'Cardiac mortality per minute of delay' },
    { icon: '📊', stat: '0', desc: 'Existing real-time hospital capacity data' },
  ];
  problems.forEach((p, i) => {
    const row = Math.floor(i / 2);
    const col = i % 2;
    const x = 6.3 + col * 3.4;
    const y = 1.5 + row * 1.5;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x, y, w: 3.2, h: 1.3,
      fill: { color: WHITE }, line: { color: 'E2E8F0' }, rectRadius: 0.08,
      shadow: { type: 'outer', blur: 4, offset: 2, angle: 4, color: '000000', opacity: 0.08 }
    });
    s.addText(p.icon, { x: x + 0.15, y: y + 0.15, w: 0.5, h: 0.5, fontSize: 20 });
    s.addText(p.stat, { x: x + 0.6, y: y + 0.1, w: 2.4, h: 0.5, fontSize: 22, bold: true, color: NAVY, fontFace: 'Arial' });
    s.addText(p.desc, { x: x + 0.6, y: y + 0.6, w: 2.4, h: 0.6, fontSize: 11, color: GRAY_TEXT, fontFace: 'Arial' });
  });

  // Bottom quote
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0.5, y: 4.6, w: 12.33, h: 0.9,
    fill: { color: 'FEE2E2' }, line: { color: 'FECACA' }
  });
  s.addText('"In the last Jakarta flood, ambulance crews drove patients to 5 hospitals before finding one with a bed."', {
    x: 0.7, y: 4.65, w: 12, h: 0.8,
    fontSize: 15, italics: true, color: RED, fontFace: 'Arial', valign: 'middle'
  });

  // Who suffers
  s.addText('WHO SUFFERS MOST:', {
    x: 0.5, y: 5.7, w: 3, h: 0.5,
    fontSize: 12, bold: true, color: NAVY, fontFace: 'Arial'
  });
  ['Cardiac patients', 'Stroke patients ("time is brain")', 'Trauma victims', 'Disaster zone patients'].forEach((item, i) => {
    s.addShape(pptx.shapes.OVAL, {
      x: 0.5 + i * 3.1, y: 6.2, w: 0.18, h: 0.18,
      fill: { color: RED }, line: { color: RED }
    });
    s.addText(item, {
      x: 0.75 + i * 3.1, y: 6.1, w: 2.9, h: 0.4,
      fontSize: 12, color: NAVY, fontFace: 'Arial'
    });
  });
}

// ── SOLUTION SLIDE ───────────────────────────────────────────────────────
function slide_solution() {
  const s = newSlide();
  s.background = { color: LIGHT_BG };

  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: 13.33, h: 1.2,
    fill: { color: NAVY }, line: { color: NAVY }
  });
  s.addText('THE SOLUTION', {
    x: 0.5, y: 0, w: 12, h: 1.2,
    fontSize: 32, bold: true, color: WHITE, fontFace: 'Arial', valign: 'middle', charSpacing: 4
  });

  // Main tagline
  s.addText('A real-time hospital capacity and ambulance routing system', {
    x: 0.5, y: 1.5, w: 12, h: 0.7,
    fontSize: 26, bold: true, color: NAVY, fontFace: 'Arial', align: 'center'
  });
  s.addText('Like Waze — but for life-or-death decisions', {
    x: 0.5, y: 2.1, w: 12, h: 0.5,
    fontSize: 18, color: GRAY_TEXT, fontFace: 'Arial', align: 'center'
  });

  // Three pillars
  const pillars = [
    { icon: '🚑', title: 'Ambulance App', desc: 'Paramedic inputs patient condition\nAI instantly recommends the best hospital\nFull reasoning shown for every decision', color: RED },
    { icon: '🏥', title: 'Dispatcher Dashboard', desc: 'Live map of all hospitals\nReal-time capacity updates (Socket.io)\nIncident management for dispatchers', color: NAVY },
    { icon: '🤖', title: 'Smart Routing Agent', desc: 'Not nearest — BEST hospital\nFactors: specialist, beds, distance\nDeterministic, explainable AI engine', color: ACCENT },
  ];

  pillars.forEach((p, i) => {
    const x = 0.6 + i * 4.2;
    // Card
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x, y: 2.85, w: 3.9, h: 3.8,
      fill: { color: WHITE }, line: { color: 'E2E8F0' }, rectRadius: 0.1,
      shadow: { type: 'outer', blur: 6, offset: 3, angle: 4, color: '000000', opacity: 0.1 }
    });
    // Top color bar
    s.addShape(pptx.shapes.RECTANGLE, {
      x, y: 2.85, w: 3.9, h: 0.6,
      fill: { color: p.color }, line: { color: p.color }
    });
    s.addText(p.icon, { x, y: 2.88, w: 3.9, h: 0.55, fontSize: 22, align: 'center', valign: 'middle' });
    s.addText(p.title, {
      x: x + 0.2, y: 3.55, w: 3.5, h: 0.5,
      fontSize: 17, bold: true, color: NAVY, fontFace: 'Arial', align: 'center'
    });
    // Divider
    s.addShape(pptx.shapes.LINE, {
      x: x + 0.4, y: 4.1, w: 3.1, h: 0,
      line: { color: 'E2E8F0', width: 1 }
    });
    // Description lines
    const lines = p.desc.split('\n');
    lines.forEach((line, li) => {
      s.addText('•  ' + line, {
        x: x + 0.25, y: 4.2 + li * 0.6, w: 3.4, h: 0.55,
        fontSize: 12, color: GRAY_TEXT, fontFace: 'Arial'
      });
    });
  });
}

// ── DEMO SLIDE ───────────────────────────────────────────────────────────
function slide_demo() {
  const s = newSlide();
  s.background = { color: DARK_BG };

  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.15, h: 7.5,
    fill: { color: RED }, line: { color: RED }
  });
  s.addText('LIVE DEMO', {
    x: 0.6, y: 0.4, w: 12, h: 0.7,
    fontSize: 36, bold: true, color: WHITE, fontFace: 'Arial'
  });
  s.addText('Watch MediAlert in action — 90 seconds', {
    x: 0.6, y: 1.0, w: 8, h: 0.5,
    fontSize: 18, color: ICE_BLUE, fontFace: 'Arial'
  });

  // Demo steps
  const steps = [
    { t: '0:00', icon: '🏥', text: 'Dashboard opens — 5 hospitals, all green (beds available)', color: GREEN },
    { t: '0:20', icon: '⚠️', text: 'Click "Simulate Mass Casualty" — 3 incidents fire simultaneously', color: AMBER },
    { t: '0:40', icon: '📉', text: 'Watch capacity bars drop in real-time via Socket.io', color: AMBER },
    { t: '0:55', icon: '🔴', text: 'RSPI Sulianti Saroso turns RED — 0 ER beds available', color: RED },
    { t: '1:00', icon: '❤️', text: 'New patient: Male 52, chest pain, suspected heart attack', color: RED },
    { t: '1:10', icon: '🤖', text: 'AI Routing runs → RSUP Fatmawati (Score: 112) — cardiologist on duty', color: GREEN },
    { t: '1:20', icon: '📍', text: 'Confirm route — ambulance marker animates, ETA countdown shown', color: GREEN },
  ];

  steps.forEach((step, i) => {
    const row = Math.floor(i / 2);
    const col = i % 2;
    const x = 0.6 + col * 6.3;
    const y = 1.7 + row * 1.4;

    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x, y, w: 6.1, h: 1.2,
      fill: { color: '1E293B' }, line: { color: step.color }, rectRadius: 0.08
    });
    // Time badge
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: x + 0.1, y: y + 0.15, w: 0.7, h: 0.4,
      fill: { color: step.color }, line: { color: step.color }, rectRadius: 0.05
    });
    s.addText(step.t, {
      x: x + 0.1, y: y + 0.15, w: 0.7, h: 0.4,
      fontSize: 11, bold: true, color: WHITE, fontFace: 'Arial', align: 'center', valign: 'middle'
    });
    s.addText(step.icon + '  ' + step.text, {
      x: x + 0.9, y: y + 0.1, w: 5.0, h: 1.0,
      fontSize: 13, color: WHITE, fontFace: 'Arial', valign: 'middle'
    });
  });

  // Bottom callout
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.6, y: 6.4, w: 12.1, h: 0.75,
    fill: { color: RED }, line: { color: RED }, rectRadius: 0.08
  });
  s.addText('Without MediAlert: 34 minutes  →  With MediAlert: under 30 seconds', {
    x: 0.6, y: 6.4, w: 12.1, h: 0.75,
    fontSize: 18, bold: true, color: WHITE, fontFace: 'Arial', align: 'center', valign: 'middle'
  });
}

// ── TECHNICAL SLIDE ──────────────────────────────────────────────────────
function slide_technical() {
  const s = newSlide();
  s.background = { color: LIGHT_BG };

  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: 13.33, h: 1.2,
    fill: { color: NAVY }, line: { color: NAVY }
  });
  s.addText('TECHNICAL ARCHITECTURE', {
    x: 0.5, y: 0, w: 12, h: 1.2,
    fontSize: 32, bold: true, color: WHITE, fontFace: 'Arial', valign: 'middle', charSpacing: 4
  });

  // Architecture diagram (left)
  s.addText('System Architecture', {
    x: 0.5, y: 1.4, w: 5, h: 0.5,
    fontSize: 16, bold: true, color: NAVY, fontFace: 'Arial'
  });

  const archLayers = [
    { label: 'Ambulance App (React Native / PWA)', color: RED, y: 1.9 },
    { label: 'Node.js API Server  +  Socket.io', color: NAVY, y: 2.75 },
    { label: 'Real-time Event Bus (Socket.io)', color: ACCENT, y: 3.6 },
    { label: 'AI Routing Agent (Decision Engine)', color: '0F766E', y: 4.45 },
    { label: 'PostgreSQL + PostGIS  |  Mapbox GL JS', color: '7C3AED', y: 5.3 },
  ];
  archLayers.forEach(layer => {
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.5, y: layer.y, w: 5.5, h: 0.7,
      fill: { color: layer.color }, line: { color: layer.color }, rectRadius: 0.06
    });
    s.addText(layer.label, {
      x: 0.5, y: layer.y, w: 5.5, h: 0.7,
      fontSize: 12, bold: true, color: WHITE, fontFace: 'Arial', align: 'center', valign: 'middle'
    });
  });
  // Arrows
  for (let i = 0; i < 4; i++) {
    s.addText('↓', {
      x: 2.8, y: archLayers[i].y + 0.65, w: 0.8, h: 0.15,
      fontSize: 14, color: GRAY_TEXT, fontFace: 'Arial', align: 'center'
    });
  }

  // Key decisions (right)
  s.addText('Key Decisions', {
    x: 6.3, y: 1.4, w: 6, h: 0.5,
    fontSize: 16, bold: true, color: NAVY, fontFace: 'Arial'
  });

  const decisions = [
    { title: 'Real-time: Socket.io', desc: 'Instant capacity updates pushed to all connected clients — ambulance, dispatcher, hospital' },
    { title: 'AI Routing: Decision Tree', desc: 'Deterministic rules, not black-box ML — explainable to judges, runs in milliseconds' },
    { title: 'Maps: Mapbox GL JS', desc: 'Custom styled map with hospital markers, capacity heatmap, routing lines' },
    { title: 'Scalable: REST + WebSocket', desc: 'API-first design — ready to integrate with Dinas Kesehatan SIMRS systems' },
  ];
  decisions.forEach((d, i) => {
    const y = 1.9 + i * 1.3;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 6.3, y, w: 6.5, h: 1.15,
      fill: { color: WHITE }, line: { color: 'E2E8F0' }, rectRadius: 0.08,
      shadow: { type: 'outer', blur: 4, offset: 2, angle: 4, color: '000000', opacity: 0.07 }
    });
    s.addShape(pptx.shapes.RECTANGLE, {
      x: 6.3, y, w: 0.12, h: 1.15,
      fill: { color: ACCENT }, line: { color: ACCENT }
    });
    s.addText(d.title, {
      x: 6.55, y: y + 0.1, w: 6.1, h: 0.4,
      fontSize: 14, bold: true, color: NAVY, fontFace: 'Arial'
    });
    s.addText(d.desc, {
      x: 6.55, y: y + 0.5, w: 6.1, h: 0.55,
      fontSize: 11, color: GRAY_TEXT, fontFace: 'Arial'
    });
  });
}

// ── IMPACT SLIDE ─────────────────────────────────────────────────────────
function slide_impact() {
  const s = newSlide();
  s.background = { color: DARK_BG };

  s.addText('IMPACT', {
    x: 0.5, y: 0.4, w: 12, h: 0.7,
    fontSize: 36, bold: true, color: WHITE, fontFace: 'Arial', charSpacing: 4
  });
  s.addText('In Indonesia\'s most disaster-prone cities, every second is measured in lives', {
    x: 0.5, y: 1.0, w: 12, h: 0.5,
    fontSize: 16, color: ICE_BLUE, fontFace: 'Arial'
  });

  // Impact metrics
  const metrics = [
    { before: '23 min', after: '< 30 sec', label: 'Time to find available hospital', color: RED },
    { before: '40%', after: 'Optimized', label: 'Hospital capacity utilization', color: AMBER },
    { before: 'Thousands', after: 'Dramatically reduced', label: 'Lives at risk from routing errors', color: GREEN },
  ];
  metrics.forEach((m, i) => {
    const x = 0.5 + i * 4.2;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x, y: 1.7, w: 4.0, h: 2.4,
      fill: { color: '1E293B' }, line: { color: m.color }, rectRadius: 0.1
    });
    s.addText('BEFORE', { x, y: 1.8, w: 4.0, h: 0.35, fontSize: 10, color: GRAY_TEXT, fontFace: 'Arial', align: 'center' });
    s.addText(m.before, { x, y: 2.1, w: 4.0, h: 0.7, fontSize: 28, bold: true, color: RED, fontFace: 'Arial', align: 'center' });
    s.addText('→', { x, y: 2.7, w: 4.0, h: 0.4, fontSize: 20, color: GRAY_TEXT, fontFace: 'Arial', align: 'center' });
    s.addText('AFTER', { x, y: 3.0, w: 4.0, h: 0.35, fontSize: 10, color: GRAY_TEXT, fontFace: 'Arial', align: 'center' });
    s.addText(m.after, { x, y: 3.25, w: 4.0, h: 0.7, fontSize: 28, bold: true, color: GREEN, fontFace: 'Arial', align: 'center' });
  });

  // Who benefits
  s.addText('WHO BENEFITS', {
    x: 0.5, y: 4.4, w: 12, h: 0.4,
    fontSize: 14, bold: true, color: WHITE, fontFace: 'Arial', charSpacing: 3
  });
  const beneficiaries = [
    { icon: '🚑', name: 'Paramedics', desc: 'Know where to go instantly' },
    { icon: '🏥', name: 'Hospitals', desc: 'Avoid overcrowding' },
    { icon: '👨‍⚕️', name: 'Patients', desc: 'Get to right care faster' },
    { icon: '🏛️', name: 'BNPB/Government', desc: 'Real-time disaster data' },
  ];
  beneficiaries.forEach((b, i) => {
    const x = 0.5 + i * 3.2;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x, y: 4.85, w: 3.0, h: 2.2,
      fill: { color: '1E293B' }, line: { color: '334155' }, rectRadius: 0.08
    });
    s.addText(b.icon, { x, y: 4.95, w: 3.0, h: 0.6, fontSize: 28, align: 'center' });
    s.addText(b.name, { x, y: 5.55, w: 3.0, h: 0.5, fontSize: 14, bold: true, color: WHITE, fontFace: 'Arial', align: 'center' });
    s.addText(b.desc, { x, y: 6.0, w: 3.0, h: 0.8, fontSize: 11, color: GRAY_TEXT, fontFace: 'Arial', align: 'center' });
  });
}

// ── COMPETITIVE SLIDE ────────────────────────────────────────────────────
function slide_competitive() {
  const s = newSlide();
  s.background = { color: LIGHT_BG };

  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: 13.33, h: 1.2,
    fill: { color: NAVY }, line: { color: NAVY }
  });
  s.addText('COMPETITIVE LANDSCAPE', {
    x: 0.5, y: 0, w: 12, h: 1.2,
    fontSize: 32, bold: true, color: WHITE, fontFace: 'Arial', valign: 'middle', charSpacing: 4
  });

  // Table
  const tableData = [
    [
      { text: 'Feature', options: { fill: { color: NAVY }, color: WHITE, bold: true, fontSize: 13, fontFace: 'Arial' } },
      { text: 'Google Maps', options: { fill: { color: NAVY }, color: WHITE, bold: true, fontSize: 13, fontFace: 'Arial' } },
      { text: 'Existing EMS', options: { fill: { color: NAVY }, color: WHITE, bold: true, fontSize: 13, fontFace: 'Arial' } },
      { text: 'MediAlert', options: { fill: { color: RED }, color: WHITE, bold: true, fontSize: 13, fontFace: 'Arial' } },
    ],
    ['Real-time hospital capacity', '❌', '❌', '✅'],
    ['AI triage routing', '❌', '❌', '✅'],
    ['Specialist availability', '❌', '❌', '✅'],
    ['Disaster-mode resilience', '❌', '❌', '✅'],
    ['Indonesia-specific design', '❌', '❌', '✅'],
  ];

  s.addTable(tableData, {
    x: 1.5, y: 1.6, w: 10.33,
    border: { pt: 0.5, color: 'E2E8F0' },
    fontFace: 'Arial',
    fontSize: 13,
    color: NAVY,
    align: 'center',
    valign: 'middle',
    rowH: 0.55,
    colW: [3.5, 2.2, 2.2, 2.43],
  });

  // Why not built before
  s.addText('Why hasn\'t this been built yet — and why we\'re the ones to build it:', {
    x: 1.5, y: 5.1, w: 10, h: 0.5,
    fontSize: 14, bold: true, color: NAVY, fontFace: 'Arial'
  });
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 1.5, y: 5.6, w: 10.33, h: 1.5,
    fill: { color: WHITE }, line: { color: 'E2E8F0' }, rectRadius: 0.08,
    shadow: { type: 'outer', blur: 4, offset: 2, angle: 4, color: '000000', opacity: 0.08 }
  });
  s.addText([
    { text: '1. ', options: { bold: true, color: RED } },
    { text: 'No existing hospital API in Indonesia — requires new data infrastructure  ', options: { color: GRAY_TEXT } },
    { text: '2. ', options: { bold: true, color: RED } },
    { text: 'No cross-system coordination between ambulances and hospitals  ', options: { color: GRAY_TEXT } },
    { text: '3. ', options: { bold: true, color: RED } },
    { text: 'Requires understanding both emergency medicine AND distributed systems — rare combination', options: { color: GRAY_TEXT } },
  ], {
    x: 1.7, y: 5.7, w: 10, h: 1.3,
    fontSize: 12, fontFace: 'Arial', valign: 'middle'
  });
}

// ── ROADMAP SLIDE ────────────────────────────────────────────────────────
function slide_roadmap() {
  const s = newSlide();
  s.background = { color: LIGHT_BG };

  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: 13.33, h: 1.2,
    fill: { color: NAVY }, line: { color: NAVY }
  });
  s.addText('ROADMAP — FROM PROTOTYPE TO NATIONAL INFRASTRUCTURE', {
    x: 0.5, y: 0, w: 12, h: 1.2,
    fontSize: 28, bold: true, color: WHITE, fontFace: 'Arial', valign: 'middle', charSpacing: 3
  });

  const phases = [
    {
      phase: 'PHASE 1', timeline: 'NOW (Garuda Hacks)', color: RED,
      items: ['5–8 mock hospitals on live map', 'Working ambulance routing demo', 'Pre-scripted mass casualty scenario', 'Real-time Socket.io updates', 'Deployed to Vercel + Railway']
    },
    {
      phase: 'PHASE 2', timeline: '6 MONTHS', color: AMBER,
      items: ['Partner with 1 city (Jakarta pilot)', 'Integrate with SIMRS hospital APIs', 'Connect to BNPB disaster network', 'Add historical analytics', 'User testing with paramedics']
    },
    {
      phase: 'PHASE 3', timeline: '2 YEARS', color: GREEN,
      items: ['Nationwide hospital coverage', 'Integration with Indonesia 119 emergency', 'AI-powered predictive capacity planning', 'Expansion to Surabaya, Semarang', 'Partnership with health insurance cos.']
    },
  ];

  phases.forEach((p, i) => {
    const x = 0.5 + i * 4.3;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x, y: 1.5, w: 4.1, h: 5.5,
      fill: { color: WHITE }, line: { color: 'E2E8F0' }, rectRadius: 0.1,
      shadow: { type: 'outer', blur: 5, offset: 3, angle: 4, color: '000000', opacity: 0.08 }
    });
    // Phase header
    s.addShape(pptx.shapes.RECTANGLE, {
      x, y: 1.5, w: 4.1, h: 1.1,
      fill: { color: p.color }, line: { color: p.color }
    });
    s.addText(p.phase, {
      x, y: 1.55, w: 4.1, h: 0.55,
      fontSize: 18, bold: true, color: WHITE, fontFace: 'Arial', align: 'center'
    });
    s.addText(p.timeline, {
      x, y: 2.05, w: 4.1, h: 0.45,
      fontSize: 12, color: 'FFFFFFCC', fontFace: 'Arial', align: 'center'
    });
    p.items.forEach((item, li) => {
      s.addText('✓  ' + item, {
        x: x + 0.2, y: 2.75 + li * 0.8, w: 3.7, h: 0.7,
        fontSize: 12, color: NAVY, fontFace: 'Arial'
      });
    });
  });
}

// ── CLOSING SLIDE ────────────────────────────────────────────────────────
function slide_closing() {
  const s = newSlide();
  s.background = { color: DARK_BG };

  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.15, h: 7.5,
    fill: { color: RED }, line: { color: RED }
  });

  s.addText('Every minute an ambulance drives', {
    x: 0.6, y: 1.4, w: 12, h: 0.8,
    fontSize: 38, bold: true, color: WHITE, fontFace: 'Arial'
  });
  s.addText('to a full hospital', {
    x: 0.6, y: 2.1, w: 12, h: 0.8,
    fontSize: 38, bold: true, color: RED, fontFace: 'Arial'
  });
  s.addText('is a minute a patient doesn\'t have.', {
    x: 0.6, y: 2.8, w: 12, h: 0.8,
    fontSize: 38, bold: true, color: WHITE, fontFace: 'Arial'
  });
  s.addText('We\'re fixing that.', {
    x: 0.6, y: 3.6, w: 12, h: 0.7,
    fontSize: 38, bold: true, color: GREEN, fontFace: 'Arial'
  });

  // Divider
  s.addShape(pptx.shapes.LINE, {
    x: 0.6, y: 4.5, w: 8, h: 0,
    line: { color: '334155', width: 1 }
  });

  s.addText('MediAlert Network', {
    x: 0.6, y: 4.7, w: 8, h: 0.6,
    fontSize: 22, bold: true, color: ICE_BLUE, fontFace: 'Arial'
  });
  s.addText('Routing smarter. Saving lives.', {
    x: 0.6, y: 5.2, w: 8, h: 0.5,
    fontSize: 16, italics: true, color: GRAY_TEXT, fontFace: 'Arial'
  });

  // Contact
  s.addText('[Your Name(s)]    |    [email@domain.com]    |    [GitHub]    |    [Demo URL]', {
    x: 0.6, y: 6.2, w: 10, h: 0.4,
    fontSize: 12, color: GRAY_TEXT, fontFace: 'Arial'
  });

  // Track badges
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.6, y: 6.7, w: 2.2, h: 0.5,
    fill: { color: NAVY }, line: { color: ACCENT }, rectRadius: 0.05
  });
  s.addText('🏥 Healthcare', {
    x: 0.6, y: 6.7, w: 2.2, h: 0.5,
    fontSize: 12, bold: true, color: WHITE, fontFace: 'Arial', align: 'center', valign: 'middle'
  });
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 2.95, y: 6.7, w: 2.4, h: 0.5,
    fill: { color: NAVY }, line: { color: ACCENT }, rectRadius: 0.05
  });
  s.addText('🛡️ Public Safety', {
    x: 2.95, y: 6.7, w: 2.4, h: 0.5,
    fontSize: 12, bold: true, color: WHITE, fontFace: 'Arial', align: 'center', valign: 'middle'
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// GENERATE
// ═══════════════════════════════════════════════════════════════════════════
slide_cover();
slide_problem();
slide_solution();
slide_demo();
slide_technical();
slide_impact();
slide_competitive();
slide_roadmap();
slide_closing();

const outPath = path.join(__dirname, 'MediAlert_Network_Pitch.pptx');
pptx.writeFile({ fileName: outPath }).then(() => {
  console.log('✅ MediAlert Network PPTX written to:', outPath);
}).catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
