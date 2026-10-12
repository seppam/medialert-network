import type { Hospital, Incident, RoutingResult, ScoredHospital } from './types';

/** Average assumed ambulance speed: 30 km/h => 0.5 km per minute. */
const KM_PER_MINUTE = 0.5;

/**
 * Rule-based hospital recommendation.
 * 1. Filter: active, at least one free ER bed (and ICU bed for critical patients).
 * 2. Score: distance, ER/ICU capacity, specialist on duty, backup power.
 * 3. Rank by score and return the best match plus up to three alternatives.
 *
 * DEMO ONLY: this is not a clinical decision tool.
 */
export function routePatient(incident: Incident, hospitals: Hospital[]): RoutingResult {
  const specialtyNeeded = getSpecialtyForInjury(incident.injuryType);
  const isCritical = detectCritical(incident);

  const eligible = hospitals.filter((h) => {
    if (!h.isActive) return false;
    if (h.availableErBeds < 1) return false;
    if (isCritical && h.availableIcuBeds < 1) return false;
    return true;
  });

  const scored: ScoredHospital[] = eligible.map((hospital) => {
    let score = 100;
    const reasons: string[] = [];

    const distance = haversineDistance(
      incident.pickupLat,
      incident.pickupLng,
      hospital.latitude,
      hospital.longitude,
    );
    score -= Math.min(distance * 2, 30);
    reasons.push(`Distance: ${distance.toFixed(1)}km`);

    const erRatio = hospital.totalErBeds > 0 ? hospital.availableErBeds / hospital.totalErBeds : 0;
    score += erRatio * 20;
    reasons.push(`ER capacity: ${hospital.availableErBeds}/${hospital.totalErBeds} beds free`);

    if (isCritical) {
      const icuRatio = hospital.totalIcuBeds > 0 ? hospital.availableIcuBeds / hospital.totalIcuBeds : 0;
      score += icuRatio * 15;
      reasons.push(`ICU capacity: ${hospital.availableIcuBeds}/${hospital.totalIcuBeds}`);
    }

    const specialist = hospital.specialists.find((s) => s.specialty === specialtyNeeded && s.available);
    if (specialtyNeeded === 'general') {
      reasons.push('General case: no specialist required');
    } else if (specialist) {
      score += 25;
      reasons.push(`Specialist on duty (${capitalize(specialtyNeeded)}): ${specialist.doctorName}`);
    } else {
      score -= 15;
      reasons.push(`No ${specialtyNeeded} specialist available`);
    }

    const hasPower = hospital.hasGenerator && hospital.generatorFuelHours > 6;
    if (hasPower) {
      score += 10;
      reasons.push(`Backup generator available (${hospital.generatorFuelHours}h fuel)`);
    }

    return {
      hospitalId: hospital.id,
      name: hospital.name,
      shortName: hospital.shortName,
      score: Math.round(score),
      reasons,
      distanceKm: Math.round(distance * 10) / 10,
      etaMinutes: Math.ceil(distance / KM_PER_MINUTE),
      availableEr: hospital.availableErBeds,
      availableIcu: hospital.availableIcuBeds,
      hasSpecialist: !!specialist,
      specialistName: specialist?.doctorName ?? null,
      generatorStatus: hasPower,
    };
  });

  scored.sort((a, b) => b.score - a.score);

  return {
    incidentId: incident.id,
    recommended: scored[0] ?? null,
    alternatives: scored.slice(1, 4),
    generatedAt: new Date().toISOString(),
  };
}

export function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function getSpecialtyForInjury(injuryType: string): string {
  const map: Record<string, string> = {
    cardiac: 'cardiology',
    heart_attack: 'cardiology',
    stroke: 'neurology',
    neurological: 'neurology',
    fracture: 'orthopedics',
    orthopedic: 'orthopedics',
    trauma: 'trauma',
    accident: 'trauma',
    burn: 'trauma',
    respiratory: 'respiratory',
    breathing: 'respiratory',
    pediatric: 'pediatric',
    child: 'pediatric',
  };
  return map[injuryType.toLowerCase()] || 'general';
}

export function detectCritical(incident: Pick<Incident, 'severity' | 'vitalSigns'>): boolean {
  if (incident.severity === 'critical') return true;
  const vs = incident.vitalSigns;
  if (!vs) return false;
  if (vs.spo2 && vs.spo2 < 90) return true;
  if (vs.bpSystolic && vs.bpSystolic < 90) return true;
  if (vs.heartRate && (vs.heartRate > 150 || vs.heartRate < 40)) return true;
  return false;
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
