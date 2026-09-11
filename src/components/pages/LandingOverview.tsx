import React from 'react';
import {
  Sprout,
  ArrowRight,
  GitFork,
  Calculator,
  Layers,
  Sliders,
  Award,
  FileText,
  ShieldCheck,
  TrendingDown,
  DollarSign,
  CheckCircle2,
  Database,
  BarChart3,
  Factory,
  Sparkles,
} from 'lucide-react';
import { PageId } from '../layout/Sidebar';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

interface LandingOverviewProps {
  onNavigate: (page: PageId) => void;
  scopeSummary: {
    scope1: number;
    scope2: number;
    scope3: number;
    total: number;
  };
  activeReductionTCO2e: number;
  totalCostSavingsUSD: number;
  creditReadinessScore: number;
}

export function LandingOverview({
  onNavigate,
  scopeSummary,
  activeReductionTCO2e,
  totalCostSavingsUSD,
  creditReadinessScore,
}: LandingOverviewProps) {
  const pieData = [
    { name: 'Scope 1 (Direct Fuels & Refrigerants)', value: scopeSummary.scope1, color: '#047857' },
    { name: 'Scope 2 (Purchased Electricity)', value: scopeSummary.scope2, color: '#10b981' },
    { name: 'Scope 3 (Supply Chain & Waste)', value: scopeSummary.scope3, color: '#6ee7b7' },
  ];

  const reductionPercent = ((activeReductionTCO2e / (scopeSummary.total || 1)) * 100).toFixed(1);

  const keyFeatures = [
    {
      page: 'root-cause' as PageId,
      title: 'AI Root Cause & 5-Why',
      desc: 'Deconstruct energy dissipation, boiler thermal losses, and process waste down to physical and managerial root causes using Gemini AI.',
      icon: GitFork,
      color: 'emerald',
      badge: '5-Why Tree',
    },
    {
      page: 'calculator' as PageId,
      title: 'Formula-Based Carbon Math',
      desc: 'Transparent emissions calculation conforming to IPCC AR6 & EPA factors. Every number traces to an audited activity formula.',
      icon: Calculator,
      color: 'teal',
      badge: 'Transparent',
    },
    {
      page: 'lca' as PageId,
      title: 'Life Cycle Assessment (LCA)',
      desc: 'Cradle-to-grave ISO 14040/14044 evaluation across raw materials, manufacturing, logistics, use, and end-of-life recycling.',
      icon: Layers,
      color: 'cyan',
      badge: 'ISO 14044',
    },
    {
      page: 'simulation' as PageId,
      title: 'Intervention Simulator',
      desc: 'Sandbox what-if scenarios: on-site solar PV, boiler economizers, compressor VFDs, and circular packaging with real-time ROI.',
      icon: Sliders,
      color: 'emerald',
      badge: 'ROI & CapEx',
    },
    {
      page: 'credits' as PageId,
      title: 'Carbon Credit & MRV Readiness',
      desc: 'Audit project additionality, permanence, and leakage risks against Verra VCS & Gold Standard registries for verified carbon units.',
      icon: Award,
      color: 'teal',
      badge: 'Verra / VCS',
    },
    {
      page: 'report' as PageId,
      title: 'Executive ESG Briefing',
      desc: 'Generate complete, audit-ready sustainability reports in Markdown/print format synthesized by Gemini AI for board presentations.',
      icon: FileText,
      color: 'slate',
      badge: 'AI Powered',
    },
  ];

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-950 text-white p-6 sm:p-10 shadow-xl border border-emerald-800/40">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold tracking-wide">
            <Sprout className="w-3.5 h-3.5 text-emerald-400" />
            <span>Next-Generation Industrial Decarbonization</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            EcoRoot AI <span className="text-emerald-400 font-serif">🌱</span>
          </h1>

          <h2 className="text-xl sm:text-2xl font-bold text-emerald-100">
            "Turn Sustainability Data Into Action."
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            Analyze complex environmental problems, discover empirical root causes through automated 5-Why decomposition, simulate high-yield interventions, evaluate Life Cycle Assessments (LCA), and qualify for high-integrity carbon credits with mathematical transparency.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              id="hero-start-root-cause"
              onClick={() => onNavigate('root-cause')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-900/50 transition-all cursor-pointer"
            >
              <span>Run AI Root Cause Diagnostic</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="hero-open-simulator"
              onClick={() => onNavigate('simulation')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-xs sm:text-sm transition-all cursor-pointer"
            >
              <span>Open Intervention Simulator</span>
            </button>

            <button
              id="hero-view-db"
              onClick={() => onNavigate('database')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-emerald-300 border border-emerald-800/40 text-xs font-semibold transition-all cursor-pointer"
            >
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>Supabase Architecture</span>
            </button>
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gross Baseline</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
              <Factory className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
            {scopeSummary.total.toLocaleString(undefined, { maximumFractionDigits: 1 })}
          </div>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <span className="font-semibold text-emerald-800">tCO2e / year</span> across Scopes 1, 2, 3
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-emerald-200/90 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Simulated Abatement</span>
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 font-mono">
            -{activeReductionTCO2e.toLocaleString(undefined, { maximumFractionDigits: 1 })}
          </div>
          <p className="text-xs text-emerald-800 mt-1 font-semibold">
            {reductionPercent}% gross emission reduction
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Annual OpEx Savings</span>
            <div className="p-2 rounded-lg bg-teal-50 text-teal-700">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
            ${totalCostSavingsUSD.toLocaleString()}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Payback & energy efficiency dividend
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Credit Readiness</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 font-mono">
              {creditReadinessScore}
            </div>
            <span className="text-xs font-bold text-slate-500">/ 100</span>
          </div>
          <p className="text-xs text-emerald-800 mt-1 font-semibold">
            Verra VCS / Gold Standard Alignable
          </p>
        </div>
      </div>

      {/* Visual Analytics Row: Scope Breakdown + Scientific Precision Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Emissions Distribution Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Emissions Distribution by Scope</h3>
              <p className="text-xs text-slate-500">
                Audited GHG Protocol Corporate Standard breakdown (tCO2e)
              </p>
            </div>
            <button
              onClick={() => onNavigate('calculator')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              View Formula Math <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div className="h-56 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    formatter={(val: any) => [`${Number(val).toFixed(1)} tCO2e`, 'Emissions']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3">
              {pieData.map((item) => {
                const percent = ((item.value / (scopeSummary.total || 1)) * 100).toFixed(1);
                return (
                  <div
                    key={item.name}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="font-semibold text-slate-700">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold font-mono text-slate-900">
                        {item.value.toLocaleString(undefined, { maximumFractionDigits: 1 })} t
                      </span>
                      <span className="text-[11px] text-slate-500 ml-1.5">({percent}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Scientific Integrity Callout */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-emerald-950 text-white border border-emerald-900/50 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 w-fit">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Formula-Based Integrity
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              We strictly forbid AI from fabricating carbon calculation metrics. Every calculation uses deterministic, auditable engineering formulas:
            </p>
            <div className="p-3 rounded-xl bg-black/40 border border-emerald-800/40 font-mono text-[11px] text-emerald-300 space-y-1">
              <div>Emissions (tCO2e) =</div>
              <div className="pl-3 text-emerald-200">Activity Data × Emission Factor × GWP</div>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              Gemini AI is employed where it excels: deep causal 5-Why diagnostics, LCA hotspot interpretation, and narrative ESG report synthesis.
            </p>
          </div>

          <button
            onClick={() => onNavigate('calculator')}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors shadow-sm"
          >
            <span>Inspect All Formula Factors</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Feature Modules Launchpad */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">Analytical Modules & Workflows</h3>
          <p className="text-xs text-slate-500">
            End-to-end toolset from diagnostic 5-Why root cause analysis to verified carbon credits
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {keyFeatures.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.page}
                id={`launchpad-card-${feat.page}`}
                onClick={() => onNavigate(feat.page)}
                className="group p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono">
                      {feat.badge}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {feat.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>

                <div className="pt-2 flex items-center gap-1 text-xs font-bold text-emerald-700 group-hover:translate-x-1 transition-transform">
                  <span>Launch Module</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
