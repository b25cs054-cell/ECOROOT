import React, { useState } from 'react';
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  TrendingUp,
  DollarSign,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Info,
} from 'lucide-react';
import { CarbonCreditReadinessResult } from '../../types';
import { SAMPLE_CARBON_CREDIT_READINESS } from '../../data/mockData';

interface CarbonCreditPageProps {
  creditData?: CarbonCreditReadinessResult;
  onOpenGlossary: () => void;
}

export function CarbonCreditPage({
  creditData = SAMPLE_CARBON_CREDIT_READINESS,
  onOpenGlossary,
}: CarbonCreditPageProps) {
  const [selectedStandard, setSelectedStandard] = useState<'Verra VCS' | 'Gold Standard' | 'Puro.earth'>('Verra VCS');
  const [marketPriceTCO2e, setMarketPriceTCO2e] = useState<number>(28);

  const estimatedAnnualVCU = creditData.annualIssuableCreditsVCU;
  const projectedRevenue = Math.round(estimatedAnnualVCU * marketPriceTCO2e);

  const registryStandards = [
    {
      name: 'Verra VCS',
      scope: 'Energy efficiency & renewable fuel switching (AMS-II.D / VM0008)',
      status: 'Methodology Fit: High',
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      name: 'Gold Standard',
      scope: 'Industrial energy efficiency with Sustainable Development Goal (SDG) co-benefits',
      status: 'Methodology Fit: High',
      badgeColor: 'bg-teal-100 text-teal-800',
    },
    {
      name: 'Puro.earth',
      scope: 'Engineered carbon dioxide removal (biochar & industrial mineralization)',
      status: 'Applicable to Biochar/Slag',
      badgeColor: 'bg-slate-100 text-slate-700',
    },
  ];

  const auditCategories = [
    {
      name: 'Additionality Analysis',
      passed: creditData.checklist.additionality.passed,
      score: creditData.checklist.additionality.score,
      desc: creditData.checklist.additionality.rationale,
      standardRef: 'VCS Tool for Demonstration of Additionality',
    },
    {
      name: 'Baseline & Digital MRV (Measurement, Reporting, Verification)',
      passed: creditData.checklist.baselineMRV.passed,
      score: creditData.checklist.baselineMRV.score,
      desc: creditData.checklist.baselineMRV.rationale,
      standardRef: 'ISO 14064-2 & Smart IoT Telemetry Protocol',
    },
    {
      name: 'Permanence & Reversal Risk',
      passed: creditData.checklist.permanence.passed,
      score: creditData.checklist.permanence.score,
      desc: creditData.checklist.permanence.rationale,
      standardRef: 'Buffer Reserve Requirement: 10%',
    },
    {
      name: 'Leakage Prevention & Activity Boundary',
      passed: creditData.checklist.leakageRisk.passed,
      score: creditData.checklist.leakageRisk.score,
      desc: creditData.checklist.leakageRisk.rationale,
      standardRef: 'Boundary Confined to On-site Plants 1 & 2',
    },
  ];

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200/80 mb-2">
            <Award className="w-3.5 h-3.5 text-emerald-600" />
            Verified Carbon Units (VCU) Verification
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Carbon Credit Readiness & MRV Audit
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl">
            Evaluate qualification for voluntary carbon markets (Verra VCS / Gold Standard), audit additionality barriers, and project monetization potential.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenGlossary}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-xs"
          >
            <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Additionality & MRV Standards</span>
          </button>
        </div>
      </div>

      {/* Hero Scorecard & Revenue Ribbon */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Readiness Score Box */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-950 text-white border border-emerald-800/40 shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                Registry Audit Status
              </span>
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                {creditData.readinessStatus}
              </span>
            </div>

            <div className="flex items-baseline gap-2 pt-2">
              <div className="text-5xl font-extrabold font-mono text-white">
                {creditData.overallScore}
              </div>
              <span className="text-lg font-bold text-emerald-300">/ 100</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Based on Verra VCS AMS-II.D criteria. High probability of successful DOE (Designated Operational Entity) validation.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-black/40 border border-emerald-800/40 text-xs space-y-1">
            <div className="text-slate-400 text-[11px]">Issuable Carbon Offset Volume:</div>
            <div className="text-base font-bold font-mono text-emerald-200">
              ~{estimatedAnnualVCU.toLocaleString()} VCUs / year
            </div>
            <div className="text-[10px] text-slate-400">1 Verified Carbon Unit = 1 metric ton CO2e</div>
          </div>
        </div>

        {/* Financial Monetization Projection */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Voluntary Carbon Market Revenue Modeling
              </h3>
              <p className="text-xs text-slate-500">
                Projected cash inflow from certified industrial avoidance credits
              </p>
            </div>

            {/* Slider to adjust carbon price */}
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
              <span className="text-xs font-semibold text-slate-600">Market Price:</span>
              <input
                type="range"
                min="10"
                max="60"
                step="1"
                value={marketPriceTCO2e}
                onChange={(e) => setMarketPriceTCO2e(parseInt(e.target.value))}
                className="w-24 accent-emerald-600 cursor-pointer"
              />
              <span className="text-xs font-mono font-bold text-emerald-800">
                ${marketPriceTCO2e}/t
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[11px] font-bold uppercase text-slate-500">
                Conservative ($15/t)
              </div>
              <div className="text-xl font-extrabold text-slate-900 font-mono mt-1">
                ${creditData.estimatedCreditValueUSD.conservative.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">Wholesale broker off-take</div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
              <div className="text-[11px] font-bold uppercase text-emerald-800">
                Simulated (${marketPriceTCO2e}/t)
              </div>
              <div className="text-2xl font-extrabold text-emerald-700 font-mono mt-1">
                ${projectedRevenue.toLocaleString()}
              </div>
              <div className="text-[10px] text-emerald-800 font-semibold mt-1">
                Interactive active model
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[11px] font-bold uppercase text-slate-500">
                Premium ESG ($45/t)
              </div>
              <div className="text-xl font-extrabold text-slate-900 font-mono mt-1">
                ${creditData.estimatedCreditValueUSD.premiumEcosystem.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">Direct corporate buyer PPA</div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-3 rounded-xl">
            <Info className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Carbon credit revenue can directly co-finance boiler economizers and solar PV systems, shortening payback periods from 3.4 years down to 2.1 years.
            </span>
          </div>
        </div>
      </div>

      {/* 4 Core Principles Audit Breakdown */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Core Carbon Integrity Principles (ICVCM Core Carbon Principles Aligned)
          </h3>
          <p className="text-xs text-slate-500">
            Detailed validation scorecard across the four pillars of voluntary carbon market integrity
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {auditCategories.map((item) => (
            <div
              key={item.name}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    {item.name}
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                    {item.score}/100
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>

              <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500 font-mono">
                {item.standardRef}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Registry Standards & Gap Remediation Action Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Registry Alignment Selector */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3">
          <h4 className="text-base font-bold text-slate-900">Registry Standards</h4>
          <p className="text-xs text-slate-500">
            Carbon credit standard alignment evaluation
          </p>

          <div className="space-y-2.5 pt-1">
            {registryStandards.map((reg) => (
              <div
                key={reg.name}
                onClick={() => setSelectedStandard(reg.name as any)}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  selectedStandard === reg.name
                    ? 'bg-emerald-50/80 border-emerald-400 ring-2 ring-emerald-500/20'
                    : 'bg-slate-50 border-slate-200 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{reg.name}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${reg.badgeColor}`}>
                    {reg.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">{reg.scope}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Gap Remediation Action Plan */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h4 className="text-base font-bold text-slate-900">
                Pre-Listing Gap Remediation Action Plan
              </h4>
              <p className="text-xs text-slate-500">
                Action items required prior to formal registration on {selectedStandard}
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-700 font-bold">4 Steps Remaining</span>
          </div>

          <div className="space-y-2.5 pt-1">
            {creditData.gapRemediationActions.map((action, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <div className="text-xs font-semibold text-slate-800">{action}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Target timeline: 30-60 days before Designated Operational Entity audit
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
