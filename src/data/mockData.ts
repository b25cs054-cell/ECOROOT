import { EmissionFactor, ActivityData, RootCauseAnalysisResult, LCAProductAssessment, InterventionScenario, CarbonCreditReadinessResult } from '../types';

export const DEFAULT_EMISSION_FACTORS: EmissionFactor[] = [
  {
    id: 'ef-natgas',
    category: 'fuel',
    name: 'Natural Gas (Pipeline)',
    scope: 'scope1',
    unit: 'm³',
    factor: 0.00202, // tCO2e per m3 (EPA GHG Factors 2024 / IPCC AR6)
    source: 'EPA GHG Hub 2024 & IPCC AR6',
    gwpVersion: 'AR6',
    description: 'Direct stationary combustion factor including CO2 (53.06 kg/mmBtu), CH4, and N2O.',
  },
  {
    id: 'ef-diesel',
    category: 'fuel',
    name: 'Diesel Fuel (Stationary / Generators)',
    scope: 'scope1',
    unit: 'Liters',
    factor: 0.00268, // tCO2e per Liter
    source: 'UK DEFRA / DESNZ 2024',
    gwpVersion: 'AR6',
    description: 'Direct combustion in diesel generators and industrial fleet.',
  },
  {
    id: 'ef-r410a',
    category: 'fuel',
    name: 'Refrigerant R-410A Fugitive Leakage',
    scope: 'scope1',
    unit: 'kg',
    factor: 2.088, // tCO2e per kg (IPCC AR6 GWP100 = 2088)
    source: 'IPCC 6th Assessment Report GWP100',
    gwpVersion: 'AR6',
    description: 'Hydrofluorocarbon blend (HFC-32 / HFC-125) fugitive HVAC loss.',
  },
  {
    id: 'ef-grid-us',
    category: 'electricity',
    name: 'Grid Electricity (US Average eGRID)',
    scope: 'scope2',
    unit: 'MWh',
    factor: 0.386, // tCO2e per MWh
    source: 'US EPA eGRID 2024 (US National Average)',
    gwpVersion: 'AR6',
    description: 'Location-based average grid emission intensity for commercial & industrial power.',
  },
  {
    id: 'ef-grid-eu',
    category: 'electricity',
    name: 'Grid Electricity (EU-27 Residual Mix)',
    scope: 'scope2',
    unit: 'MWh',
    factor: 0.215, // tCO2e per MWh
    source: 'European Environment Agency (EEA 2024)',
    gwpVersion: 'AR6',
    description: 'Average market residual intensity across European interconnected systems.',
  },
  {
    id: 'ef-grid-renewables',
    category: 'electricity',
    name: 'On-site Solar PV / Wind PPA',
    scope: 'scope2',
    unit: 'MWh',
    factor: 0.015, // tCO2e per MWh (embodied life-cycle estimate)
    source: 'NREL Life Cycle Assessment Synthesis',
    gwpVersion: 'AR6',
    description: 'Certified clean power purchase agreement (PPA) with zero direct combustion.',
  },
  {
    id: 'ef-airfreight',
    category: 'transport',
    name: 'Air Freight Cargo',
    scope: 'scope3',
    unit: 'tonne-km',
    factor: 0.000602, // tCO2e per tonne-km
    source: 'GLEC Framework / UK DEFRA 2024',
    gwpVersion: 'AR6',
    description: 'Long-haul air freight with standard radiative forcing multiplier (1.9x).',
  },
  {
    id: 'ef-roadfreight',
    category: 'transport',
    name: 'Heavy Duty Articulated Truck Freight',
    scope: 'scope3',
    unit: 'tonne-km',
    factor: 0.000096, // tCO2e per tonne-km
    source: 'GLEC Framework 2024',
    gwpVersion: 'AR6',
    description: 'Class 8 articulated diesel trucks with 70% average load capacity.',
  },
  {
    id: 'ef-waste-landfill',
    category: 'waste',
    name: 'Municipal Solid Waste to Landfill',
    scope: 'scope3',
    unit: 'tonnes',
    factor: 0.586, // tCO2e per metric tonne
    source: 'EPA WARM Model v16',
    gwpVersion: 'AR6',
    description: 'Methane fugitive emissions from mixed biodegradable and plastic waste decomposition.',
  },
  {
    id: 'ef-waste-recycled',
    category: 'waste',
    name: 'Recycled Waste Stream',
    scope: 'scope3',
    unit: 'tonnes',
    factor: 0.021, // tCO2e per metric tonne
    source: 'EPA WARM Model v16',
    gwpVersion: 'AR6',
    description: 'Secondary reprocessing energy penalty avoided through circular sorting.',
  }
];

export const INITIAL_ACTIVITIES: ActivityData[] = [
  {
    id: 'act-1',
    name: 'Plant A - Steam Boiler Heating',
    scope: 'scope1',
    factorId: 'ef-natgas',
    quantity: 485000,
    unit: 'm³',
    period: '2024 (Annual)',
    facility: 'Manufacturing Facility 1 (Detroit)',
    calculatedEmissions: 979.7,
    formulaDisplay: '485,000 m³ × 0.00202 tCO2e/m³ = 979.70 tCO2e'
  },
  {
    id: 'act-2',
    name: 'Facility Backup Generators & Forklifts',
    scope: 'scope1',
    factorId: 'ef-diesel',
    quantity: 64000,
    unit: 'Liters',
    period: '2024 (Annual)',
    facility: 'Central Logistics Hub',
    calculatedEmissions: 171.52,
    formulaDisplay: '64,000 L × 0.00268 tCO2e/L = 171.52 tCO2e'
  },
  {
    id: 'act-3',
    name: 'Chiller Plant Refrigerant Maintenance',
    scope: 'scope1',
    factorId: 'ef-r410a',
    quantity: 120,
    unit: 'kg',
    period: '2024 (Annual)',
    facility: 'Cleanroom Complex B',
    calculatedEmissions: 250.56,
    formulaDisplay: '120 kg × 2.088 tCO2e/kg = 250.56 tCO2e'
  },
  {
    id: 'act-4',
    name: 'Main Assembly Line Power Consumption',
    scope: 'scope2',
    factorId: 'ef-grid-us',
    quantity: 3820,
    unit: 'MWh',
    period: '2024 (Annual)',
    facility: 'Manufacturing Facility 1 (Detroit)',
    calculatedEmissions: 1474.52,
    formulaDisplay: '3,820 MWh × 0.386 tCO2e/MWh = 1,474.52 tCO2e'
  },
  {
    id: 'act-5',
    name: 'European Assembly Facility Power',
    scope: 'scope2',
    factorId: 'ef-grid-eu',
    quantity: 1450,
    unit: 'MWh',
    period: '2024 (Annual)',
    facility: 'Stuttgart Automation Plant',
    calculatedEmissions: 311.75,
    formulaDisplay: '1,450 MWh × 0.215 tCO2e/MWh = 311.75 tCO2e'
  },
  {
    id: 'act-6',
    name: 'Component International Air Express',
    scope: 'scope3',
    factorId: 'ef-airfreight',
    quantity: 850000,
    unit: 'tonne-km',
    period: '2024 (Annual)',
    facility: 'Global Supply Chain',
    calculatedEmissions: 511.70,
    formulaDisplay: '850,000 t-km × 0.000602 tCO2e/t-km = 511.70 tCO2e'
  },
  {
    id: 'act-7',
    name: 'Ground Distribution Fleet',
    scope: 'scope3',
    factorId: 'ef-roadfreight',
    quantity: 4200000,
    unit: 'tonne-km',
    period: '2024 (Annual)',
    facility: 'North America Distribution',
    calculatedEmissions: 403.20,
    formulaDisplay: '4,200,000 t-km × 0.000096 tCO2e/t-km = 403.20 tCO2e'
  },
  {
    id: 'act-8',
    name: 'Packaging & Trim Waste to Landfill',
    scope: 'scope3',
    factorId: 'ef-waste-landfill',
    quantity: 480,
    unit: 'tonnes',
    period: '2024 (Annual)',
    facility: 'Manufacturing Facility 1 (Detroit)',
    calculatedEmissions: 281.28,
    formulaDisplay: '480 tonnes × 0.586 tCO2e/tonne = 281.28 tCO2e'
  }
];

export const SAMPLE_ROOT_CAUSE_ANALYSIS: RootCauseAnalysisResult = {
  id: 'rca-boiler-1',
  title: 'Excess Natural Gas Burn in Plant A Steam Boilers',
  problemStatement: 'Natural gas consumption surged 34% year-over-year in Boiler Room 3 despite production volume remaining flat (+2%).',
  facility: 'Manufacturing Facility 1 (Detroit)',
  category: 'Combustion & Boiler Loss',
  fishboneCategory: 'Machine',
  severity: 'Critical',
  estimatedAnnualLossTCO2e: 248.5,
  estimatedCostLossUSD: 82400,
  ultimateRootCause: 'Absence of automated blowdown heat recovery and continuous O2 trim modulation, leading to 18% excess combustion air and severe thermal blowdown discharge to drain without preheating incoming feedwater.',
  fiveWhys: [
    {
      level: 1,
      question: 'Why did natural gas consumption spike 34% while manufacturing output was constant?',
      answer: 'The dual firetube boilers ran at an average thermal efficiency of 68.2%, far below the 84% nameplate design rating.',
      evidence: 'Flue gas telemetry logged continuous stack temperatures exceeding 245°C (design: 165°C).',
      contributingFactor: 'Thermal energy escaping stack without heat exchange'
    },
    {
      level: 2,
      question: 'Why was the thermal combustion efficiency degrading so severely?',
      answer: 'Combustion air dampers remained stuck open at 42% excess oxygen, causing massive volumes of cold intake air to cool the combustion chamber.',
      evidence: 'Stack oxygen analyzer readings averaged 8.4% O2 instead of optimal 3.0-3.5% range.',
      contributingFactor: 'Excess air dilution cooling flame temperature'
    },
    {
      level: 3,
      question: 'Why were the air-fuel ratio dampers uncalibrated and allowing excessive O2?',
      answer: 'The mechanical linkage had developed mechanical hysteresis play and the zirconia O2 sensor had drifted without auto-calibration.',
      evidence: 'Maintenance log showed last calibration was 26 months ago during factory commissioning.',
      contributingFactor: 'Mechanical wear and lack of closed-loop servo trim'
    },
    {
      level: 4,
      question: 'Why was calibration delayed for over two years?',
      answer: 'Boiler maintenance was classified under reactive emergency repair rather than preventative condition-based monitoring.',
      evidence: 'CMMS work order priority was set to low priority since steam delivery was uninterrupted.',
      contributingFactor: 'Siloed maintenance metrics prioritizing uptime over energy intensity'
    },
    {
      level: 5,
      question: 'Why did the operating policy prioritize unmonitored uptime without thermodynamic performance checks?',
      answer: 'Lack of automated energy telemetry integration with the central ERP/MES and no thermal heat recovery blowdown heat exchanger installed during original plant build.',
      evidence: 'Continuous blowdown water at 102°C was discharged directly to sewer without preheating boiler make-up feedwater.',
      contributingFactor: 'Engineering design omission and lack of automated thermal telemetry'
    }
  ],
  recommendedInterventions: [
    {
      title: 'Install Microprocessor O2 Trim & Linkageless Actuators',
      description: 'Replace mechanical linkages with independent stepper motors and continuous zirconium stack analyzer for real-time air/fuel modulation.',
      estimatedReductionTCO2e: 145.0,
      difficulty: 'Low',
      paybackMonths: 7
    },
    {
      title: 'Flue Gas Condensing Economizer & Blowdown Heat Exchanger',
      description: 'Capture latent heat from 240°C stack gases and flash steam blowdown to preheat boiler make-up water from 18°C to 75°C.',
      estimatedReductionTCO2e: 103.5,
      difficulty: 'Medium',
      paybackMonths: 14
    }
  ],
  generatedAt: '2026-03-10T14:30:00Z'
};

export const SAMPLE_LCA_ASSESSMENT: LCAProductAssessment = {
  id: 'lca-industrial-chassis',
  productName: 'Heavy-Duty Precision Aluminium Industrial Enclosure (Model X-400)',
  functionalUnit: '1 unit (45 kg enclosure, 10-year operational life in harsh environment)',
  isoStandard: 'ISO 14040/14044',
  summaryInsight: 'Upstream primary virgin bauxite smelting represents 61.4% of lifetime GWP. Switching to 85% certified post-consumer scrap alloy reduces lifecycle footprint by 52.8% without mechanical compromise.',
  baselineTotalGWP: 524.8, // kg CO2e per unit
  improvedTotalGWP: 247.6, // kg CO2e per unit
  reductionPercentage: 52.8,
  baselineStages: [
    {
      stage: 'Raw Material',
      gwpKgCO2e: 322.4,
      waterM3: 4.8,
      energyDemandMJ: 4850,
      acidificationKgSO2e: 2.14,
      hotspots: ['Primary bauxite electrochemical smelting with coal-fired captive power (China grid)', 'Electrode consumption']
    },
    {
      stage: 'Manufacturing',
      gwpKgCO2e: 112.5,
      waterM3: 1.6,
      energyDemandMJ: 1620,
      acidificationKgSO2e: 0.68,
      hotspots: ['CNC high-speed machining chip generation (38% swarf loss)', 'Solvent-based anodizing bath heating']
    },
    {
      stage: 'Packaging & Logistics',
      gwpKgCO2e: 42.8,
      waterM3: 0.3,
      energyDemandMJ: 580,
      acidificationKgSO2e: 0.28,
      hotspots: ['Expanded polystyrene (EPS) foam cushioning', 'Air-freight expedited batches to assembly hub']
    },
    {
      stage: 'Use Phase',
      gwpKgCO2e: 24.6,
      waterM3: 0.1,
      energyDemandMJ: 340,
      acidificationKgSO2e: 0.12,
      hotspots: ['Internal convection thermal dissipation fan parasitic load']
    },
    {
      stage: 'End of Life',
      gwpKgCO2e: 22.5,
      waterM3: 0.2,
      energyDemandMJ: 190,
      acidificationKgSO2e: 0.09,
      hotspots: ['Unsorted disposal in municipal industrial mixed landfill without alloy recovery']
    }
  ],
  improvedStages: [
    {
      stage: 'Raw Material',
      gwpKgCO2e: 78.2,
      waterM3: 0.9,
      energyDemandMJ: 980,
      acidificationKgSO2e: 0.45,
      hotspots: ['Secondary remelt alloy (Hydro REDUXA low-carbon certified)']
    },
    {
      stage: 'Manufacturing',
      gwpKgCO2e: 74.0,
      waterM3: 0.7,
      energyDemandMJ: 990,
      acidificationKgSO2e: 0.32,
      hotspots: ['Near-net shape cold forging (cuts machining scrap from 38% to 6%)']
    },
    {
      stage: 'Packaging & Logistics',
      gwpKgCO2e: 12.1,
      waterM3: 0.1,
      energyDemandMJ: 160,
      acidificationKgSO2e: 0.08,
      hotspots: ['Molded pulp mycelium biodegradable packaging; 100% intermodal rail freight']
    },
    {
      stage: 'Use Phase',
      gwpKgCO2e: 18.2,
      waterM3: 0.05,
      energyDemandMJ: 240,
      acidificationKgSO2e: 0.07,
      hotspots: ['Passive heatsink fin redesign eliminating auxiliary cooling fan']
    },
    {
      stage: 'End of Life',
      gwpKgCO2e: -24.9, // Negative due to recycling credit (avoided virgin production)
      waterM3: -0.4,
      energyDemandMJ: -410,
      acidificationKgSO2e: -0.15,
      hotspots: ['Closed-loop takeback agreement with certified industrial remelter']
    }
  ]
};

export const INITIAL_INTERVENTIONS: InterventionScenario[] = [
  {
    id: 'int-solar-pv',
    name: '2.4 MW On-Site Rooftop Solar PV & 1 MWh BESS',
    category: 'Renewables',
    description: 'Install high-efficiency monocrystalline solar array on Plant A & Logistics Hub roofs with peak-shaving battery energy storage.',
    capexUSD: 1850000,
    annualOpexSavingsUSD: 365000,
    annualTCO2eReduction: 926.4,
    implementationMonths: 8,
    lifespanYears: 25,
    paybackPeriodYears: 5.1,
    abatementCostPerTCO2e: -21.4, // Net negative over lifecycle (profitable)
    carbonCreditEligible: true,
    activeInSimulation: true,
    scalePercentage: 100
  },
  {
    id: 'int-boiler-economizer',
    name: 'Condensing Economizer & Microprocessor O2 Trim',
    category: 'Energy Efficiency',
    description: 'Retrofit steam boilers with flue gas condensation heat recovery and automated O2 combustion modulation.',
    capexUSD: 145000,
    annualOpexSavingsUSD: 82400,
    annualTCO2eReduction: 248.5,
    implementationMonths: 3,
    lifespanYears: 15,
    paybackPeriodYears: 1.8,
    abatementCostPerTCO2e: -34.8,
    carbonCreditEligible: true,
    activeInSimulation: true,
    scalePercentage: 100
  },
  {
    id: 'int-fleet-ev',
    name: 'Heavy Industrial Fleet & Forklift Electrification',
    category: 'Electrification',
    description: 'Transition 24 diesel forklifts and 6 yard tractors to heavy-duty Lithium-ion electric drive systems with smart overnight charging.',
    capexUSD: 420000,
    annualOpexSavingsUSD: 112000,
    annualTCO2eReduction: 171.5,
    implementationMonths: 6,
    lifespanYears: 10,
    paybackPeriodYears: 3.75,
    abatementCostPerTCO2e: 12.5,
    carbonCreditEligible: true,
    activeInSimulation: true,
    scalePercentage: 100
  },
  {
    id: 'int-circular-packaging',
    name: 'Closed-Loop Circular Packaging & Zero Landfill Waste',
    category: 'Circular Materials',
    description: 'Replace single-use stretch wrap and EPS foam with returnable collared steel pallets and molded pulp cushioning.',
    capexUSD: 95000,
    annualOpexSavingsUSD: 64000,
    annualTCO2eReduction: 260.2,
    implementationMonths: 4,
    lifespanYears: 8,
    paybackPeriodYears: 1.5,
    abatementCostPerTCO2e: -28.0,
    carbonCreditEligible: false, // Scope 3 supply chain reduction typically internal
    activeInSimulation: true,
    scalePercentage: 100
  },
  {
    id: 'int-vfd-compressor',
    name: 'Compressed Air System VFD & Acoustic Leak Auditing',
    category: 'Energy Efficiency',
    description: 'Install Variable Frequency Drives on 3 main air compressors (150 HP) and fix 34% baseline parasitic air leakage.',
    capexUSD: 68000,
    annualOpexSavingsUSD: 52000,
    annualTCO2eReduction: 135.0,
    implementationMonths: 2,
    lifespanYears: 12,
    paybackPeriodYears: 1.3,
    abatementCostPerTCO2e: -42.1,
    carbonCreditEligible: true,
    activeInSimulation: true,
    scalePercentage: 100
  }
];

export const SAMPLE_CARBON_CREDIT_READINESS: CarbonCreditReadinessResult = {
  overallScore: 84,
  readinessStatus: 'High Readiness',
  annualIssuableCreditsVCU: 1310, // verified carbon units (tCO2e)
  estimatedCreditValueUSD: {
    conservative: 19650, // $15 / tCO2e
    marketAverage: 36680, // $28 / tCO2e
    premiumEcosystem: 58950 // $45 / tCO2e
  },
  checklist: {
    additionality: {
      passed: true,
      score: 88,
      rationale: 'Project passes investment barrier test (IRR below hurdle rate without carbon finance for high-efficiency retrofits) and prevailing practice analysis.'
    },
    baselineMRV: {
      passed: true,
      score: 92,
      rationale: 'Continuous smart-meter IoT telemetry with tamper-evident digital logging satisfies Verra VM0008 / AMS-II.D methodology requirements.'
    },
    permanence: {
      passed: true,
      score: 90,
      bufferReserveRecommendedPercent: 10,
      rationale: 'Energy efficiency and industrial fossil replacement deliver permanent combustion avoidance with zero reversal risk (unlike forestry/soil).'
    },
    leakageRisk: {
      passed: true,
      score: 82,
      rationale: 'Activity boundary is strictly confined to on-site industrial plant limits; no displacement of emissions to secondary facilities detected.'
    },
    registryAlignment: {
      standard: 'Verra VCS',
      methodology: 'AMS-II.D (Energy efficiency and fuel switching for industrial facilities)',
      readinessScore: 86
    }
  },
  gapRemediationActions: [
    'Execute 3rd party Designated Operational Entity (DOE) pre-validation audit',
    'Formally document 36 months of pre-intervention fuel purchase receipts as auditable historical baseline',
    'Establish calibration verification schedule for flowmeters every 6 months',
    'Draft Project Design Document (PDD) using VCS Standard Version 4.4'
  ]
};

export const TECHNICAL_GLOSSARY = [
  {
    term: 'Scope 1 Emissions',
    category: 'GHG Protocol',
    definition: 'Direct greenhouse gas emissions that occur from sources that are controlled or owned by an organization (e.g., emissions associated with fuel combustion in boilers, furnaces, vehicles).'
  },
  {
    term: 'Scope 2 Emissions',
    category: 'GHG Protocol',
    definition: 'Indirect greenhouse gas emissions associated with the purchase of electricity, steam, heat, or cooling. Calculated using either location-based or market-based emission factors.'
  },
  {
    term: 'Scope 3 Emissions',
    category: 'GHG Protocol',
    definition: 'All other indirect emissions that occur in a company’s value chain, including both upstream (purchased goods, business travel, freight) and downstream (product use, waste disposal).'
  },
  {
    term: 'LCA (Life Cycle Assessment)',
    category: 'ISO Standard',
    definition: 'A standardized methodology (ISO 14040/14044) for compiling and evaluating the inputs, outputs, and the potential environmental impacts of a product or service system throughout its life cycle.'
  },
  {
    term: 'GWP (Global Warming Potential)',
    category: 'Climate Science',
    definition: 'A metric measuring the amount of energy the emissions of 1 ton of a gas will absorb over a given period of time (typically 100 years, GWP100), relative to the emissions of 1 ton of carbon dioxide (CO2 = 1).'
  },
  {
    term: 'Additionality',
    category: 'Carbon Markets',
    definition: 'The requirement that carbon emission reductions generated by an intervention are additional to what would have occurred in a business-as-usual scenario without carbon credit revenue incentives.'
  },
  {
    term: 'MRV (Measurement, Reporting & Verification)',
    category: 'Compliance',
    definition: 'The multi-step process of quantifying emissions and emission reductions, reporting them to designated registries, and having them independently audited by accredited validation bodies.'
  },
  {
    term: 'MACC (Marginal Abatement Cost Curve)',
    category: 'Economics',
    definition: 'A visual graph showing the cost-effectiveness of various carbon reduction options. Interventions with negative abatement costs generate net economic profit over their lifecycle.'
  }
];
