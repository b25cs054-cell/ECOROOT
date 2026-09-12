export type ScopeType = 'scope1' | 'scope2' | 'scope3';

export interface EmissionFactor {
  id: string;
  category: 'fuel' | 'electricity' | 'transport' | 'waste' | 'materials' | 'water';
  name: string;
  scope: ScopeType;
  unit: string;
  factor: number; // in tCO2e per unit
  source: string;
  gwpVersion: 'AR5' | 'AR6';
  description: string;
}

export interface ActivityData {
  id: string;
  name: string;
  scope: ScopeType;
  factorId: string;
  quantity: number;
  unit: string;
  period: string;
  facility: string;
  calculatedEmissions: number; // tCO2e
  formulaDisplay: string;
}

export interface FiveWhyStep {
  level: number;
  question: string;
  answer: string;
  evidence: string;
  contributingFactor: string;
}

export interface RootCauseAnalysisResult {
  id: string;
  title: string;
  problemStatement: string;
  facility: string;
  category: 'Energy Inefficiency' | 'Combustion & Boiler Loss' | 'Process Waste' | 'Supply Chain Logistics' | 'Refrigerant Leakage' | 'Water & Effluent';
  fishboneCategory: 'Machine' | 'Method' | 'Material' | 'Manpower' | 'Measurement' | 'Milieu (Environment)';
  fiveWhys: FiveWhyStep[];
  ultimateRootCause: string;
  severity: 'High' | 'Critical' | 'Moderate' | 'Low';
  estimatedAnnualLossTCO2e: number;
  estimatedCostLossUSD: number;
  recommendedInterventions: {
    title: string;
    description: string;
    estimatedReductionTCO2e: number;
    difficulty: 'Low' | 'Medium' | 'High';
    paybackMonths: number;
  }[];
  generatedAt: string;
}

export interface LCAStage {
  stage: 'Raw Material' | 'Manufacturing' | 'Packaging & Logistics' | 'Use Phase' | 'End of Life';
  gwpKgCO2e: number;
  waterM3: number;
  energyDemandMJ: number;
  acidificationKgSO2e: number;
  hotspots: string[];
}

export interface LCAProductAssessment {
  id: string;
  productName: string;
  functionalUnit: string;
  baselineStages: LCAStage[];
  improvedStages: LCAStage[];
  baselineTotalGWP: number;
  improvedTotalGWP: number;
  reductionPercentage: number;
  isoStandard: 'ISO 14040/14044' | 'GHG Protocol Product Standard';
  summaryInsight: string;
}

export interface InterventionScenario {
  id: string;
  name: string;
  category: 'Renewables' | 'Energy Efficiency' | 'Circular Materials' | 'Electrification' | 'Waste Reduction';
  description: string;
  capexUSD: number;
  annualOpexSavingsUSD: number;
  annualTCO2eReduction: number;
  implementationMonths: number;
  lifespanYears: number;
  paybackPeriodYears: number;
  abatementCostPerTCO2e: number; // USD per ton reduced
  carbonCreditEligible: boolean;
  activeInSimulation: boolean;
  scalePercentage: number; // 0 to 100%
}

export interface CarbonCreditChecklist {
  additionality: {
    passed: boolean;
    score: number; // 0-100
    rationale: string;
  };
  baselineMRV: {
    passed: boolean;
    score: number;
    rationale: string;
  };
  permanence: {
    passed: boolean;
    score: number;
    bufferReserveRecommendedPercent: number;
    rationale: string;
  };
  leakageRisk: {
    passed: boolean;
    score: number;
    rationale: string;
  };
  registryAlignment: {
    standard: 'Verra VCS' | 'Gold Standard' | 'Puro.earth' | 'American Carbon Registry';
    methodology: string;
    readinessScore: number; // 0-100
  };
}

export interface CarbonCreditReadinessResult {
  overallScore: number; // 0 to 100
  readinessStatus: 'High Readiness' | 'Moderate Readiness' | 'Requires Baseline Hardening' | 'Non-Additional';
  annualIssuableCreditsVCU: number; // 1 VCU = 1 tCO2e
  estimatedCreditValueUSD: {
    conservative: number; // $15/t
    marketAverage: number; // $28/t
    premiumEcosystem: number; // $45/t
  };
  checklist: CarbonCreditChecklist;
  gapRemediationActions: string[];
}

export interface SustainabilityReport {
  title: string;
  organization: string;
  reportingYear: number;
  generatedDate: string;
  executiveSummary: string;
  baselineFootprint: {
    scope1: number;
    scope2: number;
    scope3: number;
    total: number;
  };
  topRootCausesIdentified: string[];
  lcaHighlights: string;
  simulationRecommendations: string;
  carbonCreditRoadmap: string;
  rawMarkdown?: string;
}

export interface MarketTrendItem {
  id: string;
  title: string;
  category: 'Carbon Credits' | 'Sustainable Manufacturing' | 'Policy & CBAM' | 'Industrial Technology' | 'Renewable Energy';
  sourceName: string;
  sourceUrl?: string;
  date: string;
  summary: string;
  impactOnManufacturing: string;
  keyMetric: string;
  tags: string[];
}

export interface GroundingSource {
  title: string;
  url: string;
}

export interface MarketTrendsResponse {
  isLiveGrounded: boolean;
  isFallback?: boolean;
  pulse: string;
  lastUpdated: string;
  marketMetrics: {
    euEtsPrice: string;
    euEtsChange: string;
    vcmTechRemovalPrice: string;
    cbamStatus: string;
    cleanTechInvestment: string;
  };
  items: MarketTrendItem[];
  regulatorySpotlight: {
    title: string;
    timeline: string;
    complianceAction: string;
  };
  searchQueries?: string[];
  groundingSources?: GroundingSource[];
}
