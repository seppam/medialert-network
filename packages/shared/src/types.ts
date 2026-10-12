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
  /** null when no hospital is eligible */
  recommended: ScoredHospital | null;
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
