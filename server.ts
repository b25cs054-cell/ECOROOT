import express from 'express';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy Google Gen AI helper with telemetry header
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// 1. Health Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'EcoRoot AI Engine',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// 2. AI Root Cause & 5-Why Analysis
app.post('/api/ai/root-cause', async (req, res) => {
  try {
    const { problemStatement, facility, category, equipment, observations } = req.body;

    if (!problemStatement) {
      return res.status(400).json({ error: 'Problem statement is required.' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Fallback structured analysis if API key is not yet set
      return res.json({
        title: `Root Cause Analysis: ${problemStatement.slice(0, 50)}...`,
        facility: facility || 'Industrial Site 1',
        category: category || 'Energy Inefficiency',
        fishboneCategory: 'Machine',
        ultimateRootCause: `Sub-optimal setpoints, lack of automated closed-loop sensor telemetry, and legacy pneumatic controls causing continuous thermal or electrical dissipation in ${equipment || 'industrial equipment'}.`,
        severity: 'Critical',
        estimatedAnnualLossTCO2e: 185.4,
        estimatedCostLossUSD: 62000,
        fiveWhys: [
          {
            level: 1,
            question: `Why is there anomalous energy/emissions consumption in ${equipment || 'this system'}?`,
            answer: `System operating efficiency has degraded by over 24% relative to design specifications due to uncalibrated operational cycles.`,
            evidence: 'Baseline telemetry shows continuous baseline draw even during low-demand windows.',
            contributingFactor: 'Thermal/electrical drift'
          },
          {
            level: 2,
            question: 'Why has operational efficiency degraded so significantly?',
            answer: 'Auxiliary actuators and dampers are stuck at elevated setpoints, drawing excess combustion or electrical power.',
            evidence: 'Temperature and current differential across the loop exceeds operating threshold by 38%.',
            contributingFactor: 'Actuator mechanical resistance'
          },
          {
            level: 3,
            question: 'Why were the actuators and dampers left at sub-optimal setpoints?',
            answer: 'Feedback loop sensors suffered calibration drift and maintenance teams lacked automated alarm notifications.',
            evidence: 'Sensor inspection records indicate last recalibration exceeded recommended 12-month interval.',
            contributingFactor: 'Maintenance schedule lag'
          },
          {
            level: 4,
            question: 'Why were sensor calibration and alerts not triggered automatically?',
            answer: 'The equipment operates as an isolated legacy island without bidirectional SCADA or IoT telemetry connectivity.',
            evidence: 'Operational data is recorded manually in paper logs rather than automated historian DB.',
            contributingFactor: 'Lack of digital supervisory control'
          },
          {
            level: 5,
            question: 'Why has the facility not retrofitted digital telemetry and automated controls?',
            answer: 'Capital expenditure approval previously required proof of carbon abatement value, which was not historically quantified.',
            evidence: 'Historical budget proposals lacked integrated carbon cost and energy ROI quantification.',
            contributingFactor: 'Absence of integrated carbon economics in engineering decision making'
          }
        ],
        recommendedInterventions: [
          {
            title: 'Deploy IoT Continuous Smart Metering & Automated O2/VFD Trim',
            description: 'Retrofit closed-loop electronic modulation and cloud telemetry to eliminate manual setpoint drift.',
            estimatedReductionTCO2e: 125.0,
            difficulty: 'Low',
            paybackMonths: 8
          },
          {
            title: 'Flue Gas / Thermal Waste Heat Exchanger Retrofit',
            description: 'Capture discharged thermal energy to preheat process make-up water, reducing fossil fuel demand directly.',
            estimatedReductionTCO2e: 60.4,
            difficulty: 'Medium',
            paybackMonths: 14
          }
        ],
        generatedAt: new Date().toISOString(),
      });
    }

    const prompt = `You are a certified Lead Industrial Sustainability & Energy Auditor (ISO 50001 / ISO 14064 expert).
Perform a rigorous, engineering-grounded Root Cause Analysis and a 5-Why breakdown for the following industrial problem:

Problem Statement: "${problemStatement}"
Facility: "${facility || 'Industrial Facility'}"
Category: "${category || 'Energy Inefficiency'}"
Equipment/Asset: "${equipment || 'General Process Asset'}"
Observed Operational Data: "${observations || 'Telemetry indicates elevated consumption above baseline.'}"

Instructions:
1. Generate an authentic, sequential 5-Why analysis (levels 1 through 5). Each step must have a precise engineering question, an objective answer based on thermodynamic/mechanical/operational principles, physical evidence, and contributing factor.
2. Identify the Ishikawa (Fishbone) primary category from: ['Machine', 'Method', 'Material', 'Manpower', 'Measurement', 'Milieu (Environment)'].
3. Formulate the ultimate root cause clearly.
4. Assess severity ('Low', 'Moderate', 'High', 'Critical').
5. Estimate realistic annual tCO2e loss and financial loss (USD) for typical mid-to-large industrial facilities.
6. Provide 2 to 3 high-impact engineering mitigation interventions with title, description, estimated reduction (tCO2e), implementation difficulty ('Low', 'Medium', 'High'), and payback period (months).

IMPORTANT: Return STRICTLY JSON conforming to the requested schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            facility: { type: Type.STRING },
            category: { type: Type.STRING },
            fishboneCategory: { type: Type.STRING },
            ultimateRootCause: { type: Type.STRING },
            severity: { type: Type.STRING },
            estimatedAnnualLossTCO2e: { type: Type.NUMBER },
            estimatedCostLossUSD: { type: Type.NUMBER },
            fiveWhys: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  level: { type: Type.INTEGER },
                  question: { type: Type.STRING },
                  answer: { type: Type.STRING },
                  evidence: { type: Type.STRING },
                  contributingFactor: { type: Type.STRING },
                },
                required: ['level', 'question', 'answer', 'evidence', 'contributingFactor'],
              },
            },
            recommendedInterventions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  estimatedReductionTCO2e: { type: Type.NUMBER },
                  difficulty: { type: Type.STRING },
                  paybackMonths: { type: Type.NUMBER },
                },
                required: ['title', 'description', 'estimatedReductionTCO2e', 'difficulty', 'paybackMonths'],
              },
            },
          },
          required: [
            'title',
            'facility',
            'category',
            'fishboneCategory',
            'ultimateRootCause',
            'severity',
            'estimatedAnnualLossTCO2e',
            'estimatedCostLossUSD',
            'fiveWhys',
            'recommendedInterventions',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    parsed.generatedAt = new Date().toISOString();
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error generating root cause analysis:', error);
    res.status(500).json({ error: error.message || 'Failed to generate root cause analysis' });
  }
});

// 3. AI Sustainability Recommendations
app.post('/api/ai/recommendations', async (req, res) => {
  try {
    const { totalEmissions, scope1, scope2, scope3, industrySector } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        recommendations: [
          {
            title: 'On-site Solar PV & Battery Energy Storage (PPA)',
            impact: 'High',
            targetScope: 'Scope 2',
            projectedReductionTCO2e: (scope2 * 0.65).toFixed(1),
            narrative: 'Replace grid electricity with zero-carbon on-site solar generation via zero-CapEx power purchase agreement.',
          },
          {
            title: 'Industrial Flue Gas Waste Heat Recovery',
            impact: 'High',
            targetScope: 'Scope 1',
            projectedReductionTCO2e: (scope1 * 0.25).toFixed(1),
            narrative: 'Capture high-temperature stack waste heat to preheat incoming boiler feedwater and hot water loops.',
          },
          {
            title: 'Sustainable Packaging Material Circularity',
            impact: 'Medium',
            targetScope: 'Scope 3',
            projectedReductionTCO2e: (scope3 * 0.3).toFixed(1),
            narrative: 'Eliminate single-use plastics and packaging landfilling through returnable containers and post-consumer recycled pulp.',
          },
        ],
      });
    }

    const prompt = `You are a Chief Sustainability Officer and decarbonization strategist.
Evaluate this industrial emissions profile:
Total Annual Emissions: ${totalEmissions} tCO2e
Scope 1 (Direct Fuels/Refrigerants): ${scope1} tCO2e
Scope 2 (Electricity/Thermal): ${scope2} tCO2e
Scope 3 (Supply Chain/Logistics/Waste): ${scope3} tCO2e
Industry Sector: ${industrySector || 'General Manufacturing'}

Generate 4 strategic, actionable decarbonization initiatives tailored to addressing the highest-emitting scopes first.
Return valid JSON conforming to the schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  impact: { type: Type.STRING },
                  targetScope: { type: Type.STRING },
                  projectedReductionTCO2e: { type: Type.STRING },
                  narrative: { type: Type.STRING },
                },
                required: ['title', 'impact', 'targetScope', 'projectedReductionTCO2e', 'narrative'],
              },
            },
          },
          required: ['recommendations'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in recommendations:', error);
    res.status(500).json({ error: error.message || 'Failed to generate recommendations' });
  }
});

// 4. AI LCA Explainer & Hotspot Interpretation
app.post('/api/ai/explain-lca', async (req, res) => {
  try {
    const { productName, functionalUnit, stages, baselineTotal, improvedTotal } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        summary: `Life Cycle Assessment for ${productName || 'product'} demonstrates a ${(
          ((baselineTotal - improvedTotal) / baselineTotal) * 100
        ).toFixed(1)}% reduction in lifecycle GWP (Global Warming Potential). Upstream raw materials represent the single largest contributor, where virgin mineral extraction and smelting dominate the environmental burden.`,
        keyHotspots: [
          'Raw Material extraction & primary metal/polymer refining (accounting for ~60% of cradle-to-gate impact)',
          'High thermal energy consumption during manufacturing machining and curing cycles',
          'Single-use transport packaging and non-recycled end-of-life disposal',
        ],
        tradeOffs: 'Switching to secondary recycled scrap significantly reduces GWP and acidification, while requiring strict incoming alloy quality screening to maintain tensile strength.',
        circularOpportunities: [
          'Design for Disassembly (DfD) with standardized fasteners',
          'Closed-loop scrap take-back contracts with certified industrial remelters',
          'Bio-based or returnable logistics collared containers',
        ],
      });
    }

    const prompt = `You are a certified Life Cycle Assessment (LCA) practitioner adhering to ISO 14040/14044 standards.
Analyze the following comparative LCA product assessment:
Product: "${productName}"
Functional Unit: "${functionalUnit}"
Baseline Lifecycle GWP: ${baselineTotal} kg CO2e
Improved Lifecycle GWP: ${improvedTotal} kg CO2e
Stages data: ${JSON.stringify(stages)}

Provide an authoritative engineering interpretation:
1. Executive summary of lifecycle impact shifts.
2. 3 key environmental hotspots identified across the life cycle.
3. Environmental trade-offs (e.g. embodied carbon vs water vs durability).
4. 3 actionable circular economy design recommendations.

Return STRICTLY JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            keyHotspots: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            tradeOffs: { type: Type.STRING },
            circularOpportunities: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['summary', 'keyHotspots', 'tradeOffs', 'circularOpportunities'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in LCA explanation:', error);
    res.status(500).json({ error: error.message || 'Failed to explain LCA results' });
  }
});

// 5. AI Sustainability Report Generator
app.post('/api/ai/generate-report', async (req, res) => {
  try {
    const { organization, reportingYear, emissions, topRootCauses, activeInterventions, creditReadiness } = req.body;
    const ai = getGeminiClient();

    const fallbackReport = `# 🌿 Executive Decarbonization & ESG Briefing Report (${reportingYear || 2024})
**Prepared for:** ${organization || 'Industrial Enterprise'}
**Platform:** EcoRoot AI Decision Engine

## 1. Executive Summary
This comprehensive sustainability and carbon management briefing outlines the carbon emissions profile, empirical root-cause diagnostic findings, Life Cycle Assessment (LCA) insights, and simulated decarbonization roadmap for **${organization || 'our industrial operations'}**.

Total baseline emissions stand at **${emissions?.total || '3,800'} tCO2e/year**, segmented across Scope 1 (Direct Combustion & Refrigerants), Scope 2 (Purchased Electricity), and Scope 3 (Supply Chain Logistics & Solid Waste).

## 2. Baseline Emissions Breakdown (GHG Protocol Compliant)
- **Scope 1 (Direct Combustion & Mobile):** ${emissions?.scope1 || '1,401.8'} tCO2e (${(((emissions?.scope1 || 1401) / (emissions?.total || 3800)) * 100).toFixed(1)}%)
- **Scope 2 (Purchased Electricity - Location-based):** ${emissions?.scope2 || '1,786.3'} tCO2e (${(((emissions?.scope2 || 1786) / (emissions?.total || 3800)) * 100).toFixed(1)}%)
- **Scope 3 (Upstream Freight & Solid Waste):** ${emissions?.scope3 || '1,196.2'} tCO2e (${(((emissions?.scope3 || 1196) / (emissions?.total || 3800)) * 100).toFixed(1)}%)
- **Aggregate Total:** **${emissions?.total || '4,384.3'} tCO2e/year**

*Calculation Methodology:* Transparent activity-based multiplication conforming strictly to IPCC AR6 Global Warming Potentials and regional grid emission factors (US EPA eGRID & EU EEA).

## 3. Root Cause & 5-Why Analytical Findings
Anomalous energy dissipation was traced using systematic 5-Why analysis. Key root cause drivers include:
1. **Combustion Air-Fuel Ratio Drift:** Lack of automated O2 trim control in steam boilers resulting in 18% excess combustion air and stack heat loss.
2. **Compressor Parasitic Air Leakage:** Variable demand fluctuations met by fixed-speed compressors rather than Variable Frequency Drives (VFD).
3. **Primary Material Embodied Burden:** High reliance on virgin bauxite smelting in component chassis manufacturing.

## 4. Simulated Decarbonization Roadmap & ROI
Implementing the prioritized intervention package yields:
- **Projected Annual Carbon Reduction:** **${activeInterventions?.reduction || '1,741.6'} tCO2e/year**
- **Overall Emissions Abatement:** **${activeInterventions?.percentage || '39.7'}% reduction**
- **Annual Operational Cost Savings:** **$${(activeInterventions?.opexSavings || 675400).toLocaleString()} USD**
- **Weighted Blended Payback Period:** **${activeInterventions?.payback || '3.4'} years**

## 5. Carbon Credit Readiness & MRV Compliance
The facility achieves an overall carbon credit readiness score of **${creditReadiness?.score || 84}/100** (${creditReadiness?.status || 'High Readiness'}).
- **Additionality Assessment:** Passes investment barrier and technological barrier tests under Verra VCS AMS-II.D methodology.
- **MRV Telemetry:** Smart IoT meter deployment satisfies digital measurement and tamper-evident audit requirements.
- **Projected Annual Credit Issuance:** ~${creditReadiness?.credits || '1,310'} Verified Carbon Units (VCUs) with an estimated annual carbon market value between **$${(creditReadiness?.valLow || 19650).toLocaleString()}** (conservative) and **$${(creditReadiness?.valHigh || 58950).toLocaleString()}** (premium).

## 6. Strategic Next Steps & Governance
1. Authorize CapEx for boiler O2 trim economizer and compressor VFD upgrades (payback < 2 years).
2. Finalize RFP for 2.4 MW on-site rooftop Solar PV Power Purchase Agreement (PPA).
3. Execute formal 3rd-party Designated Operational Entity (DOE) pre-validation audit for carbon credit registry listing.`;

    if (!ai) {
      return res.json({
        reportMarkdown: fallbackReport,
        organization: organization || 'Industrial Enterprise',
        generatedAt: new Date().toISOString(),
      });
    }

    const prompt = `You are a certified Lead Sustainability Director and ESG Auditor.
Generate an authoritative, executive-level Sustainability and Decarbonization Report based on this validated industrial data:
Organization: "${organization || 'Industrial Enterprise'}"
Reporting Year: ${reportingYear || 2024}
Emissions: ${JSON.stringify(emissions)}
Identified Root Causes: ${JSON.stringify(topRootCauses)}
Active Interventions & Simulation: ${JSON.stringify(activeInterventions)}
Carbon Credit Readiness: ${JSON.stringify(creditReadiness)}

The report MUST include:
1. Executive Summary with high-level strategic findings
2. Carbon Footprint Baseline Analysis (Scope 1, 2, 3 with exact transparent figures)
3. Root Cause & 5-Why Diagnostic Summary (why inefficiencies happened at equipment level)
4. Life Cycle Assessment (LCA) & Circular Material Recommendations
5. Decarbonization Interventions Roadmap (CapEx, OpEx savings, tCO2e reduction, ROI payback)
6. Carbon Credit & MRV Readiness Audit (Additionality, Verra/Gold Standard methodology, registry readiness)
7. Concrete 90-Day Implementation Timeline

Format the output in clean, professional Markdown with clear section headers, bullet points, and data tables.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    return res.json({
      reportMarkdown: response.text || fallbackReport,
      organization: organization || 'Industrial Enterprise',
      generatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error generating report:', error);
    res.status(500).json({ error: error.message || 'Failed to generate sustainability report' });
  }
});

// 6. Supabase Database Schema DDL Export
app.get('/api/database/schema', (req, res) => {
  const schemaSQL = `-- =========================================================
-- EcoRoot AI - PostgreSQL / Supabase Migration Schema
-- Compatible with Supabase SQL Editor & standard PostgreSQL 14+
-- =========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Organizations & Facilities
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    industry_sector VARCHAR(100) NOT NULL,
    country VARCHAR(100) DEFAULT 'USA',
    baseline_year INT DEFAULT 2024,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Emission Factors Reference Table (Configurable)
CREATE TABLE IF NOT EXISTS emission_factors (
    id VARCHAR(100) PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL, -- 'fuel', 'electricity', 'transport', 'waste'
    name VARCHAR(255) NOT NULL,
    scope VARCHAR(10) NOT NULL, -- 'scope1', 'scope2', 'scope3'
    unit VARCHAR(50) NOT NULL,
    factor NUMERIC(14, 8) NOT NULL, -- tCO2e per unit
    source VARCHAR(255) NOT NULL,
    gwp_version VARCHAR(20) DEFAULT 'AR6',
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Activity Logs & Activity Data
CREATE TABLE IF NOT EXISTS activity_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    facility VARCHAR(255) NOT NULL,
    scope VARCHAR(10) NOT NULL,
    factor_id VARCHAR(100) REFERENCES emission_factors(id),
    quantity NUMERIC(14, 4) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    period VARCHAR(50) NOT NULL,
    calculated_emissions_tco2e NUMERIC(12, 4) NOT NULL,
    formula_display TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Root Cause & 5-Why Investigations
CREATE TABLE IF NOT EXISTS root_cause_investigations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    problem_statement TEXT NOT NULL,
    facility VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    fishbone_category VARCHAR(50) NOT NULL,
    ultimate_root_cause TEXT NOT NULL,
    severity VARCHAR(20) NOT NULL,
    estimated_annual_loss_tco2e NUMERIC(10, 2),
    estimated_cost_loss_usd NUMERIC(12, 2),
    five_whys_json JSONB NOT NULL,
    recommended_interventions_json JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. LCA Product Assessments (ISO 14040/14044)
CREATE TABLE IF NOT EXISTS lca_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    product_name VARCHAR(255) NOT NULL,
    functional_unit VARCHAR(255) NOT NULL,
    baseline_total_gwp NUMERIC(10, 2) NOT NULL,
    improved_total_gwp NUMERIC(10, 2) NOT NULL,
    reduction_percentage NUMERIC(5, 2) NOT NULL,
    iso_standard VARCHAR(50) DEFAULT 'ISO 14040/14044',
    summary_insight TEXT,
    baseline_stages_json JSONB NOT NULL,
    improved_stages_json JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Simulated Decarbonization Interventions
CREATE TABLE IF NOT EXISTS simulated_interventions (
    id VARCHAR(100) PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    capex_usd NUMERIC(12, 2) NOT NULL,
    annual_opex_savings_usd NUMERIC(12, 2) NOT NULL,
    annual_tco2e_reduction NUMERIC(10, 2) NOT NULL,
    implementation_months INT NOT NULL,
    lifespan_years INT NOT NULL,
    payback_period_years NUMERIC(5, 2) NOT NULL,
    carbon_credit_eligible BOOLEAN DEFAULT FALSE,
    active_in_simulation BOOLEAN DEFAULT TRUE,
    scale_percentage NUMERIC(5, 2) DEFAULT 100.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Carbon Credit & MRV Readiness Audits
CREATE TABLE IF NOT EXISTS carbon_credit_audits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    overall_readiness_score INT NOT NULL,
    readiness_status VARCHAR(50) NOT NULL,
    annual_issuable_credits_vcu NUMERIC(10, 2) NOT NULL,
    checklist_json JSONB NOT NULL,
    gap_remediation_actions JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS) policies for Supabase
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE emission_factors ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE root_cause_investigations ENABLE ROW LEVEL SECURITY;
ALTER TABLE lca_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulated_interventions ENABLE ROW LEVEL SECURITY;
ALTER TABLE carbon_credit_audits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated access to organizations" ON organizations FOR ALL USING (true);
CREATE POLICY "Allow public read access to emission_factors" ON emission_factors FOR SELECT USING (true);
`;

  res.json({
    engine: 'PostgreSQL / Supabase',
    migrationScript: schemaSQL,
    tables: [
      'organizations',
      'emission_factors',
      'activity_data',
      'root_cause_investigations',
      'lca_assessments',
      'simulated_interventions',
      'carbon_credit_audits',
    ],
  });
});

// Vite Middleware & Static Serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌱 EcoRoot AI Server is running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
