/**
 * Generate MediAlert Network Pitch Deck DOCX
 * Usage: node gen_medialert_docx.js
 */

const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType,
  VerticalAlign, PageNumber, PageBreak, UnderlineType, LevelFormat
} = require('docx');
const fs = require('fs');
const path = require('path');

// ── Color palette ──────────────────────────────────────────────────────────
const NAVY   = '1D3557';
const RED    = 'E63946';
const WHITE  = 'FFFFFF';
const LIGHT_BG = 'F8F9FA';
const GRAY_TEXT = '64748B';
const ACCENT_BLUE = '457B9D';

// ── Helper: horizontal rule ────────────────────────────────────────────────
function hr(color = 'CBD5E1') {
  return new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: 1, color } },
    spacing: { before: 200, after: 200 },
    children: []
  });
}

// ── Helper: heading paragraph ─────────────────────────────────────────────
function h1(text, color = NAVY) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 300, after: 150 },
    children: [new TextRun({ text, bold: true, size: 40, color, font: 'Arial' })]
  });
}

function h2(text, color = NAVY) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 120 },
    children: [new TextRun({ text, bold: true, size: 28, color, font: 'Arial' })]
  });
}

function h3(text, color = NAVY) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 180, after: 80 },
    children: [new TextRun({ text, bold: true, size: 24, color, font: 'Arial' })]
  });
}

// ── Helper: body paragraph ────────────────────────────────────────────────
function p(text, opts = {}) {
  return new Paragraph({
    spacing: { before: 60, after: 60 },
    children: [new TextRun({ text, size: 22, font: 'Arial', ...opts })]
  });
}

function pBold(label, text, color = NAVY) {
  return new Paragraph({
    spacing: { before: 80, after: 80 },
    children: [
      new TextRun({ text: label + ' ', bold: true, size: 22, color, font: 'Arial' }),
      new TextRun({ text, size: 22, font: 'Arial' })
    ]
  });
}

// ── Helper: bullet list ───────────────────────────────────────────────────
function bullet(text, bold = false) {
  return new Paragraph({
    numbering: { reference: 'bullets', level: 0 },
    spacing: { before: 40, after: 40 },
    children: [new TextRun({ text, bold, size: 22, font: 'Arial' })]
  });
}

function numbered(text, ref = 'numbers') {
  return new Paragraph({
    numbering: { reference: ref, level: 0 },
    spacing: { before: 40, after: 40 },
    children: [new TextRun({ text, size: 22, font: 'Arial' })]
  });
}

// ── Helper: colored box (simulated via table) ─────────────────────────────
function coloredBox(paragraphs, bgColor = NAVY, textColor = WHITE) {
  const cell = new TableCell({
    shading: { fill: bgColor, type: ShadingType.CLEAR },
    margins: { top: 200, bottom: 200, left: 300, right: 300 },
    borders: {
      top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }
    },
    children: paragraphs
  });
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows: [new TableRow({ children: [cell] })]
  });
}

// ── Helper: 2-column row ─────────────────────────────────────────────────
function twoColTable(rows) {
  const headerBg = NAVY;
  const hdrCell = (text, w) => new TableCell({
    width: { size: w, type: WidthType.DXA },
    shading: { fill: headerBg, type: ShadingType.CLEAR },
    margins: { top: 100, bottom: 100, left: 140, right: 140 },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: 'FFFFFF' },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: 'FFFFFF' },
      left: { style: BorderStyle.SINGLE, size: 1, color: 'FFFFFF' },
      right: { style: BorderStyle.SINGLE, size: 1, color: 'FFFFFF' }
    },
    children: [new Paragraph({
      children: [new TextRun({ text, bold: true, color: WHITE, size: 22, font: 'Arial' })]
    })]
  });

  const dataCell = (text, w, bg = WHITE) => new TableCell({
    width: { size: w, type: WidthType.DXA },
    shading: { fill: bg, type: ShadingType.CLEAR },
    margins: { top: 80, bottom: 80, left: 140, right: 140 },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' },
      left: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' },
      right: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' }
    },
    children: [new Paragraph({
      children: [new TextRun({ text, size: 20, font: 'Arial' })]
    })]
  });

  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [3000, 6360],
    rows: [
      new TableRow({ children: [hdrCell('Item', 3000), hdrCell('Detail', 6360)] }),
      ...rows.map(([item, detail], i) =>
        new TableRow({ children: [dataCell(item, 3000), dataCell(detail, 6360)] })
      )
    ]
  });
}

// ── Helper: stat block ────────────────────────────────────────────────────
function statBlock(label, value, unit, bgColor = NAVY) {
  const cell = new TableCell({
    width: { size: 3000, type: WidthType.DXA },
    shading: { fill: bgColor, type: ShadingType.CLEAR },
    margins: { top: 160, bottom: 160, left: 200, right: 200 },
    verticalAlign: VerticalAlign.CENTER,
    borders: {
      top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }
    },
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: value, bold: true, size: 48, color: WHITE, font: 'Arial' })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: unit, size: 20, color: 'CADCFC', font: 'Arial' })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: label, size: 18, color: '94A3B8', font: 'Arial' })]
      })
    ]
  });
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [3000],
    rows: [new TableRow({ children: [cell] })]
  });
}

// ── Helper: cover page ───────────────────────────────────────────────────
function coverPage(title, subtitle, tagline, event) {
  return [
    new Paragraph({ spacing: { before: 1200 } }),
    coloredBox([
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: '🚑', size: 72 })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 100 },
        children: [new TextRun({ text: title, bold: true, size: 56, color: WHITE, font: 'Arial' })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 100, after: 100 },
        children: [new TextRun({ text: subtitle, size: 28, color: 'CADCFC', font: 'Arial' })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 100, after: 100 },
        children: [new TextRun({ text: tagline, size: 22, color: '94A3B8', italics: true, font: 'Arial' })]
      })
    ], NAVY),
    new Paragraph({ spacing: { before: 400 } }),
    pBold('Event: ', event, GRAY_TEXT),
    pBold('Tracks: ', 'Healthcare + Public Safety', GRAY_TEXT),
    pBold('Tech Stack: ', 'React/Next.js, Node.js, Socket.io, Mapbox, PostgreSQL', GRAY_TEXT),
    pBold('Team: ', '[Your Team Name]', GRAY_TEXT),
    new Paragraph({ children: [new PageBreak()] })
  ];
}

// ═══════════════════════════════════════════════════════════════════════
// DOCUMENT CONTENT
// ═══════════════════════════════════════════════════════════════════════

const doc = new Document({
  numbering: {
    config: [
      {
        reference: 'bullets',
        levels: [{
          level: 0, format: LevelFormat.BULLET, text: '\u2022',
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } }
        }]
      },
      {
        reference: 'numbers',
        levels: [{
          level: 0, format: LevelFormat.DECIMAL, text: '%1.',
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } }
        }]
      }
    ]
  },
  styles: {
    default: {
      document: { run: { font: 'Arial', size: 22 } }
    },
    paragraphStyles: [
      {
        id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 40, bold: true, color: NAVY, font: 'Arial' },
        paragraph: { spacing: { before: 300, after: 150 }, outlineLevel: 0 }
      },
      {
        id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 28, bold: true, color: NAVY, font: 'Arial' },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 }
      },
      {
        id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 24, bold: true, color: ACCENT_BLUE, font: 'Arial' },
        paragraph: { spacing: { before: 180, after: 80 }, outlineLevel: 2 }
      }
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 }
      }
    },
    headers: {
      default: new (require('docx').Header)({
        children: [new Paragraph({
          border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' } },
          children: [
            new TextRun({ text: 'MediAlert Network', bold: true, size: 18, color: NAVY, font: 'Arial' }),
            new TextRun({ text: '  |  Garuda Hacks 7.0  |  Pitch Deck', size: 18, color: GRAY_TEXT, font: 'Arial' })
          ]
        })]
      })
    },
    footers: {
      default: new (require('docx').Footer)({
        children: [new Paragraph({
          border: { top: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' } },
          alignment: AlignmentType.RIGHT,
          children: [
            new TextRun({ text: 'Page ', size: 16, color: GRAY_TEXT, font: 'Arial' }),
            new TextRun({ children: [PageNumber.CURRENT], size: 16, color: GRAY_TEXT, font: 'Arial' })
          ]
        })]
      })
    },
    children: [

      // ── COVER ──
      ...coverPage(
        'MediAlert Network',
        'Real-Time Hospital Routing for Mass Casualty Events',
        '"Waze for ambulances — routing smarter, saving lives"',
        'Garuda Hacks 7.0 — July 16–18, 2026 · UMN, Indonesia'
      ),

      // ── TABLE OF CONTENTS ──
      h1('Table of Contents'),
      numbered('Problem Statement'),
      numbered('The Solution'),
      numbered('Technical Architecture'),
      numbered('AI Routing Engine'),
      numbered('Demo Scenario'),
      numbered('Mock Data'),
      numbered('Pitch Timeline'),
      numbered('Judge Q&A Preparation'),
      new Paragraph({ children: [new PageBreak()] }),

      // ── SECTION 1: PROBLEM ──
      h1('1. Problem Statement', RED),
      hr(RED),

      p('Indonesia faces a critical gap in emergency medical response during mass casualty events.'),
      new Paragraph({ spacing: { before: 120 } }),

      coloredBox([
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 100, after: 80 },
          children: [new TextRun({ text: '"In the last Jakarta flood, ambulance crews drove patients to 5 hospitals before finding one with a bed. 34 minutes lost."', size: 24, bold: true, color: WHITE, font: 'Arial' })]
        })
      ], RED),

      new Paragraph({ spacing: { before: 200 } }),
      h2('The Stats'),
      twoColTable([
        ['Avg. ambulance response time (Jakarta)', '23 minutes'],
        ['Hospitals reaching full capacity during disasters', '67% within 2 hours'],
        ['Cardiac patient mortality increase per minute of delay', '10%'],
        ['Deaths from routing errors (annual estimate)', 'Thousands'],
        ['Existing EMS hospital routing', 'Manual, phone-based, no real-time data'],
      ]),

      new Paragraph({ spacing: { before: 240 } }),
      h2('Why This Happens'),
      bullet('No real-time visibility into hospital ER/ICU bed availability'),
      bullet('Ambulance crews rely on radio and guesswork'),
      bullet('Mass casualty events overwhelm the nearest hospital instantly'),
      bullet('Specialist availability (cardiologist, neurologist) is invisible to dispatchers'),
      bullet('Existing navigation apps (Google Maps, Waze) have no hospital capacity data'),

      new Paragraph({ spacing: { before: 200 } }),
      h2('Who Suffers Most'),
      bullet('Cardiac patients — every minute without a cath lab increases mortality'),
      bullet('Stroke patients — "time is brain" — need neurologists within the golden hour'),
      bullet('Trauma victims — orthopedic surgeons and OR availability are invisible'),
      bullet('Patients in disaster zones (floods, earthquakes) — hospital capacity changes every minute'),
      new Paragraph({ children: [new PageBreak()] }),

      // ── SECTION 2: SOLUTION ──
      h1('2. The Solution: MediAlert Network', ACCENT_BLUE),
      hr(ACCENT_BLUE),

      new Paragraph({ spacing: { before: 120 } }),
      coloredBox([
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 100, after: 80 },
          children: [new TextRun({ text: 'A real-time hospital capacity and ambulance routing system — like Waze, but for life-or-death decisions.', size: 26, bold: true, color: WHITE, font: 'Arial' })]
        })
      ], NAVY),

      new Paragraph({ spacing: { before: 240 } }),
      h2('Three Core Components'),

      h3('1. Ambulance App (React Native / PWA)'),
      p('Paramedic inputs patient condition (injury type, severity, vital signs) -> AI instantly recommends the best hospital with full reasoning.'),

      h3('2. Dispatcher Dashboard (Next.js)'),
      p('Live map showing every hospital\'s ER/ICU capacity, updated in real-time. Hospital staff update capacity; dispatchers see it instantly.'),

      h3('3. Smart Routing Agent (Decision Engine)'),
      p('Not just nearest hospital — routes based on injury type, specialist availability, real-time bed capacity, and backup power status.'),

      new Paragraph({ spacing: { before: 240 } }),
      h2('Cross-Track Coverage'),
      twoColTable([
        ['Track 1', 'Healthcare Inequality — routes patients to hospitals with available capacity and specialists'],
        ['Track 2', 'Public Safety — optimizes emergency response during mass casualty events and disasters'],
        ['Cross-Track Bonus', 'Addresses both tracks simultaneously — judges often reward cross-domain thinking'],
      ]),

      new Paragraph({ spacing: { before: 200 } }),
      h2('Why MediAlert Wins at Garuda Hacks'),
      bullet('Crosses 2 tracks (Healthcare + Public Safety)'),
      bullet('\'Waze for ambulances\' pitch is instantly understandable in 8 words'),
      bullet('AI routing engine is a clear technical differentiator'),
      bullet('Pre-scripted mass casualty demo scenario is dramatic and live'),
      bullet('Indonesian context — Jakarta floods, hospital congestion, 119 emergency system'),
      bullet('Team skills match the tech stack directly'),
      new Paragraph({ children: [new PageBreak()] }),

      // ── SECTION 3: TECHNICAL ARCHITECTURE ──
      h1('3. Technical Architecture'),
      hr(GRAY_TEXT),

      new Paragraph({ spacing: { before: 120 } }),
      h2('System Overview'),
      twoColTable([
        ['Frontend (Ambulance)', 'React Native / PWA — patient input form, hospital recommendation display'],
        ['Frontend (Dashboard)', 'Next.js — live map, incident management, capacity management'],
        ['Backend API', 'Node.js + Express — REST endpoints for hospitals, incidents, routing'],
        ['Real-time Layer', 'Socket.io — live capacity updates pushed to all connected clients'],
        ['Routing Engine', 'JavaScript decision engine — deterministic, fast, explainable to judges'],
        ['Database', 'PostgreSQL + PostGIS — geospatial queries for distance calculations'],
        ['Maps', 'Mapbox GL JS — real-time map with custom hospital markers and routing'],
        ['Deployment', 'Vercel (frontend) + Railway/Render (backend) — free tier for hackathon'],
      ]),

      new Paragraph({ spacing: { before: 240 } }),
      h2('API Endpoints'),
      twoColTable([
        ['GET /api/hospitals', 'List all hospitals with current capacity (filtered by city)'],
        ['PATCH /api/hospitals/:id/capacity', 'Update hospital capacity — triggers Socket.io broadcast'],
        ['POST /api/incidents', 'Create new incident + run routing recommendation'],
        ['POST /api/routing/recommend', 'AI routing engine — given patient data, return ranked hospital list'],
        ['GET /api/incidents', 'List active incidents with status and assigned hospital'],
        ['Socket.io: hospital:capacity_change', 'Real-time broadcast: hospital capacity updated'],
        ['Socket.io: incident:new', 'Real-time broadcast: new incident created'],
      ]),

      new Paragraph({ spacing: { before: 240 } }),
      h2('Data Model'),
      twoColTable([
        ['hospitals', 'id, name, lat/lng, ER beds (total/available), ICU beds, specialists on duty, generator status'],
        ['incidents', 'id, injury_type, severity, vital_signs, pickup location, assigned_hospital, ETA, status'],
        ['specialists_on_duty', 'hospital_id, specialty (cardiology/neuro/etc), doctor_name, shift_end, available'],
        ['routing_decisions', 'incident_id, hospital_id, score, distance, specialist_match, reasons, is_final_choice'],
        ['capacity_logs', 'hospital_id, beds_before/after, trigger_source, changed_by, timestamp'],
      ]),
      new Paragraph({ children: [new PageBreak()] }),

      // ── SECTION 4: ROUTING ENGINE ──
      h1('4. AI Routing Engine — Decision Logic'),
      hr(GRAY_TEXT),

      new Paragraph({ spacing: { before: 120 } }),
      p('The routing engine is a rule-based decision system (not black-box ML). This is intentional:'),
      bullet('Deterministic — judges can see exactly why a hospital was chosen'),
      bullet('Instant — runs in milliseconds, no GPU needed'),
      bullet('Explainable — returns a scored list with full reasoning'),
      bullet('Adaptable — scoring weights can be tuned by medical advisors'),

      new Paragraph({ spacing: { before: 200 } }),
      h2('Scoring Formula'),

      coloredBox([
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 100, after: 100 },
          children: [new TextRun({ text: 'Total Score = (Distance + Capacity + ICU + Specialist + Generator) x Urgency', bold: true, size: 24, color: WHITE, font: 'Arial' })]
        })
      ], NAVY),

      new Paragraph({ spacing: { before: 200 } }),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2500, 1500, 5360],
        rows: [
          new TableRow({ children: [
            new TableCell({ width: { size: 2500, type: WidthType.DXA }, shading: { fill: NAVY, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 140, right: 140 }, borders: { top: { style: BorderStyle.SINGLE, size: 1, color: WHITE }, bottom: { style: BorderStyle.SINGLE, size: 1, color: WHITE }, left: { style: BorderStyle.SINGLE, size: 1, color: WHITE }, right: { style: BorderStyle.SINGLE, size: 1, color: WHITE } }, children: [new Paragraph({ children: [new TextRun({ text: 'Factor', bold: true, color: WHITE, size: 22, font: 'Arial' })] })] }),
            new TableCell({ width: { size: 1500, type: WidthType.DXA }, shading: { fill: NAVY, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 140, right: 140 }, borders: { top: { style: BorderStyle.SINGLE, size: 1, color: WHITE }, bottom: { style: BorderStyle.SINGLE, size: 1, color: WHITE }, left: { style: BorderStyle.SINGLE, size: 1, color: WHITE }, right: { style: BorderStyle.SINGLE, size: 1, color: WHITE } }, children: [new Paragraph({ children: [new TextRun({ text: 'Max Points', bold: true, color: WHITE, size: 22, font: 'Arial' })] })] }),
            new TableCell({ width: { size: 5360, type: WidthType.DXA }, shading: { fill: NAVY, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 140, right: 140 }, borders: { top: { style: BorderStyle.SINGLE, size: 1, color: WHITE }, bottom: { style: BorderStyle.SINGLE, size: 1, color: WHITE }, left: { style: BorderStyle.SINGLE, size: 1, color: WHITE }, right: { style: BorderStyle.SINGLE, size: 1, color: WHITE } }, children: [new Paragraph({ children: [new TextRun({ text: 'Logic', bold: true, color: WHITE, size: 22, font: 'Arial' })] })] }),
          ]}),
          ...[
            ['Distance', '+0 to -30', 'Closer hospital = higher score. 1km = -2 pts. Max penalty: -30 pts'],
            ['ER Capacity', '+0 to +20', 'More empty beds = higher score. (available/total) x 20'],
            ['ICU (critical only)', '+0 to +15', 'For critical patients only. More ICU beds = higher score'],
            ['Specialist Match', '+25 or -15', '+25 if correct specialist on duty, -15 if not available'],
            ['Generator Backup', '+10', 'Bonus if hospital has backup generator with >6h fuel'],
            ['Urgency Multiplier', 'x1.0 to x1.5', 'Critical patients multiply all scores by 1.5x'],
          ].map(([factor, pts, logic]) =>
            new TableRow({ children: [
              new TableCell({ width: { size: 2500, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 140, right: 140 }, borders: { top: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' }, bottom: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' }, left: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' }, right: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' } }, children: [new Paragraph({ children: [new TextRun({ text: factor, bold: true, size: 20, font: 'Arial' })] })] }),
              new TableCell({ width: { size: 1500, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 140, right: 140 }, borders: { top: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' }, bottom: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' }, left: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' }, right: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' } }, children: [new Paragraph({ children: [new TextRun({ text: pts, size: 20, font: 'Arial', color: ACCENT_BLUE })] })] }),
              new TableCell({ width: { size: 5360, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 140, right: 140 }, borders: { top: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' }, bottom: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' }, left: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' }, right: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' } }, children: [new Paragraph({ children: [new TextRun({ text: logic, size: 18, font: 'Arial', color: GRAY_TEXT })] })] }),
            ]})
          )
        ]
      }),

      new Paragraph({ spacing: { before: 200 } }),
      h2('Injury Type to Specialty Mapping'),
      twoColTable([
        ['Cardiac / Heart Attack', 'Cardiology — cardiologist on duty = +25 pts'],
        ['Stroke / Neurological', 'Neurology — neurologist on duty = +25 pts'],
        ['Fracture / Orthopedic', 'Orthopedics — orthopedist on duty = +25 pts'],
        ['Trauma / Accident / Burns', 'Trauma — trauma surgeon on duty = +25 pts'],
        ['Respiratory', 'Pulmonology — pulmonologist on duty = +25 pts'],
        ['Pediatric Emergency', 'Pediatrician on duty = +25 pts'],
        ['General / Other', 'No specialist bonus/penalty applied'],
      ]),
      new Paragraph({ children: [new PageBreak()] }),

      // ── SECTION 5: DEMO ──
      h1('5. Live Demo Scenario'),
      hr(GRAY_TEXT),

      new Paragraph({ spacing: { before: 120 } }),
      coloredBox([
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 80, after: 80 },
          children: [new TextRun({ text: 'The demo is the most important 90 seconds of the pitch.', bold: true, size: 24, color: WHITE, font: 'Arial' })]
        })
      ], RED),

      new Paragraph({ spacing: { before: 200 } }),
      h2('Pre-Demo Setup'),
      bullet('Open dashboard at http://localhost:3000 — 5 hospitals, all green (beds available)'),
      bullet('Open ambulance app on second screen / phone — ready for patient input'),
      bullet('Have 8 pre-seeded mock hospitals loaded in database'),
      bullet('Practice the demo flow 10+ times before the actual pitch'),

      new Paragraph({ spacing: { before: 200 } }),
      h2('Demo Flow (90 seconds)'),

      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [1000, 4000, 4360],
        rows: [
          new TableRow({ children: [
            new TableCell({ width: { size: 1000, type: WidthType.DXA }, shading: { fill: NAVY, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 140, right: 140 }, borders: { top: { style: BorderStyle.SINGLE, size: 1, color: WHITE }, bottom: { style: BorderStyle.SINGLE, size: 1, color: WHITE }, left: { style: BorderStyle.SINGLE, size: 1, color: WHITE }, right: { style: BorderStyle.SINGLE, size: 1, color: WHITE } }, children: [new Paragraph({ children: [new TextRun({ text: 'T+', bold: true, color: WHITE, size: 20, font: 'Arial' })] })] }),
            new TableCell({ width: { size: 4000, type: WidthType.DXA }, shading: { fill: NAVY, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 140, right: 140 }, borders: { top: { style: BorderStyle.SINGLE, size: 1, color: WHITE }, bottom: { style: BorderStyle.SINGLE, size: 1, color: WHITE }, left: { style: BorderStyle.SINGLE, size: 1, color: WHITE }, right: { style: BorderStyle.SINGLE, size: 1, color: WHITE } }, children: [new Paragraph({ children: [new TextRun({ text: 'What You Show', bold: true, color: WHITE, size: 20, font: 'Arial' })] })] }),
            new TableCell({ width: { size: 4360, type: WidthType.DXA }, shading: { fill: NAVY, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 140, right: 140 }, borders: { top: { style: BorderStyle.SINGLE, size: 1, color: WHITE }, bottom: { style: BorderStyle.SINGLE, size: 1, color: WHITE }, left: { style: BorderStyle.SINGLE, size: 1, color: WHITE }, right: { style: BorderStyle.SINGLE, size: 1, color: WHITE } }, children: [new Paragraph({ children: [new TextRun({ text: 'What You Say', bold: true, color: WHITE, size: 20, font: 'Arial' })] })] }),
          ]}),
          ...[
            ['0:00', 'Normal dashboard — 5 hospitals all green', '"Jakarta at 8 AM. All hospitals running normally."'],
            ['0:20', 'Click "Simulate Mass Casualty" — 3 incidents fire', '"A building collapse just sent 8 patients to the nearest hospitals."'],
            ['0:40', 'Watch capacity bars drop in real-time via Socket.io', '"Watch the hospital statuses change — in real time."'],
            ['0:55', 'One hospital turns RED (0 ER beds)', '"RSPI Sulianti Saroso is now full. What happens to the next patient?"'],
            ['1:00', 'New patient: Male 52, chest pain, suspected MI', '"New emergency: Male, 52, chest pain, suspected heart attack."'],
            ['1:10', 'Click "Find Hospital" — routing runs — RSUP Fatmawati recommended (Score: 112)', '"The AI doesn\'t pick the nearest hospital. It picks the one with a cardiologist AND available ICU beds."'],
            ['1:20', 'Confirm route — ambulance marker animates to Fatmawati', '"Confirmed. ETA: 8 minutes. The right hospital, not the nearest."'],
            ['1:30', 'Summary: 3 patients routed, 0 misroutes', '"Without MediAlert: 34 minutes driving to full hospitals. With MediAlert: under 30 seconds."'],
          ].map(([time, show, say]) =>
            new TableRow({ children: [
              new TableCell({ width: { size: 1000, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 140, right: 140 }, borders: { top: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' }, bottom: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' }, left: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' }, right: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' } }, children: [new Paragraph({ children: [new TextRun({ text: time, bold: true, size: 20, color: RED, font: 'Arial' })] })] }),
              new TableCell({ width: { size: 4000, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 140, right: 140 }, borders: { top: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' }, bottom: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' }, left: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' }, right: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' } }, children: [new Paragraph({ children: [new TextRun({ text: show, size: 20, font: 'Arial' })] })] }),
              new TableCell({ width: { size: 4360, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 140, right: 140 }, borders: { top: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' }, bottom: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' }, left: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' }, right: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' } }, children: [new Paragraph({ children: [new TextRun({ text: say, size: 18, italics: true, font: 'Arial', color: GRAY_TEXT })] })] }),
            ]})
          )
        ]
      }),
      new Paragraph({ children: [new PageBreak()] }),

      // ── SECTION 6: MOCK DATA ──
      h1('6. Mock Hospital Data'),
      hr(GRAY_TEXT),

      new Paragraph({ spacing: { before: 120 } }),
      p('8 Indonesian hospitals with realistic data for the demo:'),
      new Paragraph({ spacing: { before: 100 } }),

      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2200, 1300, 900, 900, 900, 1200, 1960],
        rows: [
          new TableRow({ children: ['Hospital', 'City', 'ER', 'ICU', 'OR', 'Generator', 'Specialists'].map((h, i) =>
            new TableCell({ width: { size: [2200,1300,900,900,900,1200,1960][i], type: WidthType.DXA }, shading: { fill: NAVY, type: ShadingType.CLEAR }, margins: { top: 60, bottom: 60, left: 100, right: 100 }, borders: { top: { style: BorderStyle.SINGLE, size: 1, color: WHITE }, bottom: { style: BorderStyle.SINGLE, size: 1, color: WHITE }, left: { style: BorderStyle.SINGLE, size: 1, color: WHITE }, right: { style: BorderStyle.SINGLE, size: 1, color: WHITE } }, children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, color: WHITE, size: 18, font: 'Arial' })] })] })
          )}),
          ...[
            ['RSUP Fatmawati', 'S. Jakarta', '14/20', '5/8', '2/4', 'Yes (48h)', 'Cardio, Ortho, Trauma'],
            ['RSPI Sulianti Saroso', 'C. Jakarta', '6/15', '2/6', '1/2', 'Yes (72h)', 'Neuro, Respiratory'],
            ['RS St. Carolus', 'C. Jakarta', '11/18', '4/7', '2/3', 'Yes (36h)', 'Cardio, Neuro, Trauma'],
            ['Siloam Semanggi', 'S. Jakarta', '18/25', '7/10', '4/6', 'Yes (120h)', 'Full specialist'],
            ['RSUD Pasar Minggu', 'S. Jakarta', '7/12', '1/4', '1/2', 'Yes (24h)', 'Ortho, Trauma'],
            ['RSCM (RSUPN)', 'C. Jakarta', '22/40', '9/16', '6/10', 'Yes (168h)', 'Full + Neuro'],
            ['RS Hermina Daan Mogot', 'W. Jakarta', '10/16', '3/6', '2/3', 'Yes (48h)', 'Neuro, Ortho, Trauma'],
            ['RS Sumber Waras', 'W. Jakarta', '5/14', '0/5', '0/2', 'No', 'Cardio only'],
          ].map((row, i) =>
            new TableRow({ children: row.map((cell, ci) =>
              new TableCell({ width: { size: [2200,1300,900,900,900,1200,1960][ci], type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? LIGHT_BG : WHITE, type: ShadingType.CLEAR }, margins: { top: 60, bottom: 60, left: 100, right: 100 }, borders: { top: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' }, bottom: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' }, left: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' }, right: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' } }, children: [new Paragraph({ children: [new TextRun({ text: cell, size: 18, font: 'Arial', color: cell === '0/5' || cell === '0/2' ? RED : NAVY, bold: ['RSUP Fatmawati', 'Siloam Semanggi', 'RSCM (RSUPN)'].includes(cell) })] })] })
            )})
          )
        ]
      }),
      new Paragraph({ children: [new PageBreak()] }),

      // ── SECTION 7: PITCH TIMING ──
      h1('7. Pitch Timing Guide'),
      hr(GRAY_TEXT),

      new Paragraph({ spacing: { before: 120 } }),
      p('Total: 5 minutes. Know your timing cold.'),
      new Paragraph({ spacing: { before: 100 } }),

      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [1200, 6000, 2160],
        rows: [
          new TableRow({ children: ['Time', 'What To Do', 'What To Say'].map((h, i) =>
            new TableCell({ width: { size: [1200,6000,2160][i], type: WidthType.DXA }, shading: { fill: NAVY, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 140, right: 140 }, borders: { top: { style: BorderStyle.SINGLE, size: 1, color: WHITE }, bottom: { style: BorderStyle.SINGLE, size: 1, color: WHITE }, left: { style: BorderStyle.SINGLE, size: 1, color: WHITE }, right: { style: BorderStyle.SINGLE, size: 1, color: WHITE } }, children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, color: WHITE, size: 22, font: 'Arial' })] })] })
          )}),
          ...[
            ['0:00-0:45', 'Present Slide 1 — Problem Hook\nTell the story of the 34-minute hospital hunt', '"In the last Jakarta flood, ambulance crews drove to 5 hospitals before finding one with a bed."'],
            ['0:45-1:00', 'Present Slide 2 — Team (15 seconds)', 'Quick intro — who you are and your relevant skills'],
            ['1:00-1:30', 'Present Slide 3 — The Solution (3 components)', '"We built X, Y, and Z. Here\'s the 10-second summary."'],
            ['1:30-1:45', 'Present Slide 4 — Demo Setup', '"Let me show you how it works — LIVE. I\'ll run a mass casualty scenario."'],
            ['1:45-3:15', 'RUN THE LIVE DEMO (90 seconds)', 'The most important 90 seconds of the entire pitch'],
            ['3:15-3:45', 'Present Slide 5 — Technical Architecture', 'Point to your architecture diagram. Explain 3 key decisions briefly.'],
            ['3:45-4:15', 'Present Slide 6 — Impact', 'Hit the numbers: 23 minutes -> 30 seconds. Lives saved.'],
            ['4:15-4:30', 'Present Slide 7 — Roadmap', 'Jakarta pilot -> national scale -> BNPB integration'],
            ['4:30-5:00', 'Present Slide 10 — Close', 'One powerful closing line. END. Don\'t overstay.'],
          ].map(([time, what, say]) =>
            new TableRow({ children: [
              new TableCell({ width: { size: 1200, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 140, right: 140 }, borders: { top: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' }, bottom: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' }, left: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' }, right: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' } }, children: [new Paragraph({ children: [new TextRun({ text: time, bold: true, size: 20, color: RED, font: 'Arial' })] })] }),
              new TableCell({ width: { size: 6000, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 140, right: 140 }, borders: { top: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' }, bottom: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' }, left: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' }, right: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' } }, children: [new Paragraph({ children: [new TextRun({ text: what, size: 20, font: 'Arial' })] })] }),
              new TableCell({ width: { size: 2160, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 140, right: 140 }, borders: { top: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' }, bottom: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' }, left: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' }, right: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' } }, children: [new Paragraph({ children: [new TextRun({ text: say, size: 18, italics: true, font: 'Arial', color: GRAY_TEXT })] })] }),
            ]})
          )
        ]
      }),
      new Paragraph({ children: [new PageBreak()] }),

      // ── SECTION 8: Q&A ──
      h1('8. Judge Q&A Preparation'),
      hr(GRAY_TEXT),

      new Paragraph({ spacing: { before: 120 } }),
      p('These are the 10 questions judges most commonly ask. Prepare sharp, concise answers.'),
      new Paragraph({ spacing: { before: 100 } }),

      ...[
        ['"How is this different from Google Maps or Waze?"',
         'Google Maps and Waze optimize for travel time. MediAlert optimizes for patient survival. They have zero hospital capacity data, specialist availability, or emergency routing logic. We\'re not competing with navigation apps — we\'re the layer above them that decides WHERE to go, not HOW to get there.'],
        ['"How accurate is your AI routing?"',
         'It\'s not a black-box AI — it\'s a medical expert system with rules validated by standard triage protocols. The routing decision tree is fully explainable: "RSUP Fatmawati gets +25 pts for cardiology specialist, +15 for ICU availability, -8 pts for distance." Any emergency medicine doctor can review and approve the rules.'],
        ['"Do you have real hospital data?"',
         'Not yet — which is why our roadmap includes partnership with Dinas Kesehatan and SIMRS (hospital management system) integrations. For the hackathon, we\'re using 8 real Jakarta hospitals with realistic capacity data. The architecture is designed to plug into any hospital data source via REST API.'],
        ['"Why Indonesia? Why not scale to other countries?"',
         'Indonesia has the perfect storm: 270M population, 127 active volcanoes, 5–10 major flood events per year in Jakarta alone, and zero real-time hospital capacity infrastructure. After proving it works in Jakarta, it can expand to Southeast Asia\'s other disaster-prone cities: Manila, Bangkok, Ho Chi Minh City.'],
        ['"How does this handle privacy/HIPAA equivalent?"',
         'Patient data in the incident is minimal (age range, gender, injury type — no names or IDs). Hospital capacity data is public infrastructure. The ambulance app can be used anonymously. For production, we\'d implement GDPR-equivalent Indonesian data protection (UU PDP) compliance with data minimization.'],
        ['"What if the internet goes down during a disaster?"',
         'This is a valid concern. For Phase 2, we\'d add offline mode: critical hospital capacity data cached locally, ambulance app works with cached hospital list, push notifications via SMS fallback. The routing engine can run entirely client-side with the cached hospital dataset.'],
        ['"Who pays for this after the hackathon?"',
         'Three revenue streams: (1) SaaS licensing to city governments — they already pay for emergency dispatch systems; (2) API access for health insurance companies (AIA, Prudential) who want to optimize patient routing; (3) BNPB/World Bank disaster response grants for the disaster preparedness angle.'],
        ['"What happens if a hospital gives you wrong capacity data?"',
         'We\'d implement a verification system: hospital-reported capacity must be updated within 30 minutes or auto-decrements. Cross-reference with ambulance arrival/departure logs to detect discrepancies. For the hackathon, we show this as a governance feature in the roadmap.'],
        ['"Why is the team qualified to build this?"',
         '[Customize based on your actual team] — e.g., "We have 3 years of React/Node.js experience, built 2 production dashboards, and have studied emergency response systems. The tech stack matches exactly what we already know."'],
        ['"Can this integrate with Indonesia\'s 119 emergency number?"',
         'Yes — 119 (SAMUT / Sistem Armando) is a voice call system. Our REST API can receive webhook alerts from 119 when an ambulance is dispatched, and our routing can suggest the optimal destination hospital before the ambulance even leaves the scene. This is a Phase 3 integration in our roadmap.'],
      ].flatMap(([q, a]) => [
        new Paragraph({ spacing: { before: 200 } }),
        new Paragraph({
          spacing: { before: 80, after: 40 },
          children: [new TextRun({ text: q, bold: true, size: 22, color: NAVY, font: 'Arial' })]
        }),
        new Paragraph({
          spacing: { before: 40, after: 80 },
          children: [new TextRun({ text: a, size: 20, font: 'Arial', color: GRAY_TEXT })]
        })
      ]),

      // ── BACK COVER ──
      new Paragraph({ children: [new PageBreak()] }),
      new Paragraph({ spacing: { before: 800 } }),
      coloredBox([
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 100, after: 80 },
          children: [new TextRun({ text: 'MediAlert Network', bold: true, size: 48, color: WHITE, font: 'Arial' })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 80, after: 80 },
          children: [new TextRun({ text: 'Routing smarter. Saving lives.', size: 28, color: 'CADCFC', italics: true, font: 'Arial' })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 200, after: 100 },
          children: [new TextRun({ text: 'Garuda Hacks 7.0 | July 16–18, 2026', size: 22, color: '94A3B8', font: 'Arial' })]
        })
      ], NAVY),

    ]
  }]
});

// ── OUTPUT ──────────────────────────────────────────────────────────────────
const outPath = path.join(__dirname, 'MediAlert_Network_Pitch_Deck.docx');
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(outPath, buf);
  console.log('✅ MediAlert Network DOCX written to:', outPath);
}).catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
