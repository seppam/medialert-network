import { MOCK_HOSPITALS, type Hospital, type Incident } from '@medialert/shared';

/** In-memory state for the demo. Swap for a database in production. */
export class Store {
  hospitals: Hospital[] = [];
  incidents: Incident[] = [];

  constructor() {
    this.reset();
  }

  reset(): void {
    this.hospitals = MOCK_HOSPITALS.map((h) => ({
      ...h,
      specialists: h.specialists.map((s) => ({ ...s })),
    }));
    this.incidents = [];
  }
}
