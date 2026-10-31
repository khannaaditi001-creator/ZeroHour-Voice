export interface SymptomItem {
  name: string;
  percentage: number;
  description: string;
}

export interface PharmacyItem {
  item: string;
  changePercent: number;
  status: string;
}

export interface ClinicAlert {
  name: string;
  capacityPercent: number;
  currentWaitTime: string;
  status: string;
  statusType: 'danger' | 'warning' | 'good' | string;
  recommendation: string;
}

export interface Tab1WarningSigns {
  erVisits24h: number;
  erVisitsBaseline: number;
  erIncreasePercent: number;
  topSymptoms: SymptomItem[];
  pharmacySpikes: PharmacyItem[];
  clinicAlerts: ClinicAlert[];
  plainEnglishTakeaway: string;
}

export interface LikelyCause {
  name: string;
  matchPercent: number;
  plainEnglish: string;
  spreadMethod: string;
  duration: string;
}

export interface SafetyGear {
  item: string;
  priority: 'Essential' | 'High' | 'Standard' | string;
  advice: string;
}

export interface PanicBuyingAlert {
  rumorDetected: string;
  debunkFact: string;
  pharmacyDirective: string;
}

export interface Tab2IdentifyIllness {
  likelyCauses: LikelyCause[];
  safetyGearNeeded: SafetyGear[];
  panicBuyingAndRumorAlert: PanicBuyingAlert;
}

export interface ProjectionMeasure {
  label: string;
  description: string;
  peakBeds: number;
  bedsNeeded: number[];
}

export interface NearbyTransfer {
  hospital: string;
  distance: string;
  availableOxygenTanks: number;
  ventilators: number;
  staffAvailable: string;
  status: string;
}

export interface Tab3HospitalSupplies {
  totalAvailableBeds: number;
  projectionDays: number[];
  projections: {
    none: ProjectionMeasure;
    targeted: ProjectionMeasure;
    strict: ProjectionMeasure;
  };
  nearbyTransfers: NearbyTransfer[];
}

export interface PerspectiveQuote {
  role: string;
  icon: string;
  quote: string;
}

export interface ReadyDocument {
  id: string;
  title: string;
  audience: string;
  category: string;
  summary: string;
  fullText: string;
}

export interface Tab4ActionPlan {
  perspectives: PerspectiveQuote[];
  readyDocuments: ReadyDocument[];
}

export interface OutbreakData {
  scenarioId: string;
  title: string;
  location: string;
  severity: string;
  severityColor: 'amber' | 'rose' | 'emerald' | string;
  summary: string;
  tab1_warningSigns: Tab1WarningSigns;
  tab2_identifyIllness: Tab2IdentifyIllness;
  tab3_hospitalSupplies: Tab3HospitalSupplies;
  tab4_actionPlan: Tab4ActionPlan;
}
