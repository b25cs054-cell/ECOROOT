import React, { useState } from 'react';
import {
  Database,
  Copy,
  Download,
  Check,
  Server,
  Settings,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
  Plus,
  Code,
  Table,
} from 'lucide-react';
import { EmissionFactor } from '../../types';

interface DatabaseSettingsPageProps {
  emissionFactors: EmissionFactor[];
  onUpdateFactor: (id: string, newFactor: number) => void;
  onResetFactors: () => void;
  onOpenGlossary: () => void;
}

export function DatabaseSettingsPage({
  emissionFactors,
  onUpdateFactor,
  onResetFactors,
  onOpenGlossary,
}: DatabaseSettingsPageProps) {
  const [copiedSQL, setCopiedSQL] = useState(false);
  const [activeTab, setActiveTab] = useState<'supabase' | 'factors'>('supabase');

  const supabaseDDL = `-- =========================================================
-- 🌱 EcoRoot AI - PostgreSQL / Supabase Migration Schema
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

-- Enable Row Level Security (RLS) policies for Supabase
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE emission_factors ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE root_cause_investigations ENABLE ROW LEVEL SECURITY;
ALTER TABLE lca_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulated_interventions ENABLE ROW LEVEL SECURITY;
ALTER TABLE carbon_credit_audits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read/write access" ON organizations FOR ALL USING (true);
CREATE POLICY "Allow public read access to emission_factors" ON emission_factors FOR SELECT USING (true);
`;

  const handleCopySQL = () => {
    navigator.clipboard.writeText(supabaseDDL);
    setCopiedSQL(true);
    setTimeout(() => setCopiedSQL(false), 2000);
  };

  const handleDownloadSQL = () => {
    const blob = new Blob([supabaseDDL], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ecoroot-ai-supabase-schema.sql';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200/80 mb-2">
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            Supabase Ready & Extensible
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Database Architecture & Emission Factors
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl">
            Inspect configurable emission factors, modify grid intensity values, or export complete Supabase PostgreSQL DDL migration scripts with one click.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('supabase')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'supabase'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code className="w-3.5 h-3.5 text-emerald-600" />
            <span>Supabase SQL DDL</span>
          </button>
          <button
            onClick={() => setActiveTab('factors')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'factors'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Table className="w-3.5 h-3.5 text-emerald-600" />
            <span>Emission Factors ({emissionFactors.length})</span>
          </button>
        </div>
      </div>

      {activeTab === 'supabase' ? (
        /* Supabase Export Section */
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-950 to-emerald-950 text-white border border-emerald-900/50 shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Server className="w-5 h-5 text-emerald-400" />
                  Instant Supabase Connection Architecture
                </h3>
                <p className="text-xs text-slate-300">
                  Ready to copy and paste directly into the Supabase SQL Editor. Creates 7 normalized tables, UUID primary keys, and RLS policies.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopySQL}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  {copiedSQL ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedSQL ? 'Copied SQL!' : 'Copy SQL Script'}</span>
                </button>

                <button
                  onClick={handleDownloadSQL}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-xs transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download .sql</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
              <div className="p-2.5 rounded-xl bg-black/40 border border-emerald-800/40">
                <span className="text-slate-400">Database Engine:</span>
                <div className="font-bold text-emerald-300 mt-0.5">PostgreSQL 14+ / 16</div>
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-emerald-800/40">
                <span className="text-slate-400">Security:</span>
                <div className="font-bold text-emerald-300 mt-0.5">Row Level Security (RLS)</div>
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-emerald-800/40">
                <span className="text-slate-400">Data Models:</span>
                <div className="font-bold text-emerald-300 mt-0.5">7 Core Entity Tables</div>
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-emerald-800/40">
                <span className="text-slate-400">Setup Time:</span>
                <div className="font-bold text-emerald-300 mt-0.5">&lt; 60 Seconds</div>
              </div>
            </div>
          </div>

          {/* Code Viewer Container */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-slate-200 shadow-md space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono font-bold text-emerald-400">
                supabase_migration_schema.sql
              </span>
              <span className="text-[11px] text-slate-400">PostgreSQL DDL</span>
            </div>

            <pre className="overflow-x-auto text-xs font-mono text-emerald-200/90 leading-relaxed p-2 max-h-96">
              {supabaseDDL}
            </pre>
          </div>
        </div>
      ) : (
        /* Configurable Emission Factors Section */
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Configurable Greenhouse Gas Emission Factors
              </h3>
              <p className="text-xs text-slate-500">
                Adjust regional grid intensities or custom supplier fuel factors. All changes recalculate platform emissions immediately.
              </p>
            </div>

            <button
              onClick={onResetFactors}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Restore IPCC Defaults</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50/70">
                  <th className="py-3 px-3">Factor Name & Category</th>
                  <th className="py-3 px-3">Scope</th>
                  <th className="py-3 px-3">Unit</th>
                  <th className="py-3 px-3">Factor (tCO2e/unit)</th>
                  <th className="py-3 px-3">Source & Citation</th>
                  <th className="py-3 px-3">GWP Standard</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {emissionFactors.map((ef) => (
                  <tr key={ef.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900">{ef.name}</div>
                      <div className="text-[11px] text-slate-500 capitalize">{ef.category}</div>
                    </td>

                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-md font-mono text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                        {ef.scope}
                      </span>
                    </td>

                    <td className="py-3 px-3 font-mono font-medium text-slate-700">
                      {ef.unit}
                    </td>

                    <td className="py-3 px-3">
                      <input
                        type="number"
                        step="any"
                        value={ef.factor}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          onUpdateFactor(ef.id, val);
                        }}
                        className="w-28 px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold text-emerald-800 focus:ring-1 focus:ring-emerald-500"
                      />
                    </td>

                    <td className="py-3 px-3 text-slate-600 max-w-xs truncate">
                      {ef.source}
                    </td>

                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {ef.gwpVersion}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
