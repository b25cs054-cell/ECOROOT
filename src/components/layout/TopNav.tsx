import React from 'react';
import {
  Menu,
  Sparkles,
  Building2,
  HelpCircle,
  TrendingDown,
  Award,
  Globe,
  CheckCircle2,
} from 'lucide-react';
import { PageId } from './Sidebar';

interface TopNavProps {
  currentPage: PageId;
  onOpenMobileMenu: () => void;
  onOpenGlossary: () => void;
  selectedOrg: string;
  onChangeOrg: (org: string) => void;
  totalEmissions: number;
  simulatedReductionPercent: number;
  creditReadinessScore: number;
}

export function TopNav({
  currentPage,
  onOpenMobileMenu,
  onOpenGlossary,
  selectedOrg,
  onChangeOrg,
  totalEmissions,
  simulatedReductionPercent,
  creditReadinessScore,
}: TopNavProps) {
  const pageTitles: Record<PageId, { title: string; subtitle: string }> = {
    landing: {
      title: 'Platform Executive Overview',
      subtitle: 'Holistic sustainability diagnostics, LCA evaluation & carbon credit intelligence',
    },
    'root-cause': {
      title: 'AI Root Cause & 5-Why Analysis',
      subtitle: 'Identify thermodynamic inefficiencies, boiler losses & supply chain leaks',
    },
    calculator: {
      title: 'Carbon Footprint & Mathematical Engine',
      subtitle: 'Transparent formula calculations strictly grounded in IPCC AR6 & EPA factors',
    },
    lca: {
      title: 'Life Cycle Assessment (LCA)',
      subtitle: 'ISO 14040/14044 cradle-to-grave analysis & material hotspot decoupling',
    },
    simulation: {
      title: 'Decarbonization Intervention Simulator',
      subtitle: 'What-If scenarios, CapEx/OpEx budgeting & Marginal Abatement Cost curves',
    },
    credits: {
      title: 'Carbon Credit & MRV Readiness Audit',
      subtitle: 'Additionality verification, Verra VCS compliance & VCU yield valuation',
    },
    report: {
      title: 'Executive ESG & Sustainability Report',
      subtitle: 'Comprehensive briefing generated with Gemini AI for C-Suite and auditors',
    },
    database: {
      title: 'Emission Factors & Supabase Architecture',
      subtitle: 'Configurable factor registry and instant one-click Supabase PostgreSQL export',
    },
  };

  const currentInfo = pageTitles[currentPage];

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-3 transition-all print:hidden">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Page Title */}
        <div className="flex items-center gap-3">
          <button
            id="mobile-menu-btn"
            onClick={onOpenMobileMenu}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                {currentInfo.title}
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                Gemini 3.8 Flash
              </span>
            </div>
            <p className="hidden md:block text-xs text-slate-500 font-normal">
              {currentInfo.subtitle}
            </p>
          </div>
        </div>

        {/* Right: Metrics & Organization Switcher */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Global Metric Badges */}
          <div className="hidden xl:flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-medium">Baseline:</span>
              <span className="font-bold text-slate-800 font-mono">
                {totalEmissions.toLocaleString(undefined, { maximumFractionDigits: 1 })} tCO2e
              </span>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs text-emerald-800">
              <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
              <span className="font-semibold">Target Abatement:</span>
              <span className="font-extrabold font-mono text-emerald-700">
                -{simulatedReductionPercent.toFixed(1)}%
              </span>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-teal-50 border border-teal-200 flex items-center gap-2 text-xs text-teal-800">
              <Award className="w-3.5 h-3.5 text-teal-600" />
              <span className="font-semibold">Credit Score:</span>
              <span className="font-extrabold font-mono text-teal-700">
                {creditReadinessScore}/100
              </span>
            </div>
          </div>

          {/* Org Selector */}
          <div className="flex items-center gap-1.5 bg-slate-100/80 px-2.5 py-1.5 rounded-xl border border-slate-200">
            <Building2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <select
              id="org-selector"
              value={selectedOrg}
              onChange={(e) => onChangeOrg(e.target.value)}
              className="text-xs font-semibold text-slate-800 bg-transparent border-none focus:outline-hidden cursor-pointer"
            >
              <option value="Apex Industrial Manufacturing">Apex Industrial Mfg (Plants 1 & 2)</option>
              <option value="Terra Packaging & Logistics">Terra Packaging & Logistics</option>
              <option value="Nova CleanTech Systems">Nova CleanTech Systems</option>
            </select>
          </div>

          {/* Glossary Icon Button */}
          <button
            id="top-glossary-btn"
            onClick={onOpenGlossary}
            title="Standards & Glossary"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:text-emerald-700 transition-colors shadow-xs"
          >
            <HelpCircle className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">Glossary</span>
          </button>
        </div>
      </div>
    </header>
  );
}
