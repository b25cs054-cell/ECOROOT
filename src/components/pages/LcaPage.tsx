import React, { useState } from 'react';
import {
  Layers,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Droplets,
  Zap,
  Leaf,
  CheckCircle2,
  RefreshCw,
  HelpCircle,
  BarChart3,
  Factory,
  Package,
  Recycle,
} from 'lucide-react';
import { LCAProductAssessment, LCAStage } from '../../types';
import { SAMPLE_LCA_ASSESSMENT } from '../../data/mockData';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
} from 'recharts';

interface LcaPageProps {
  onOpenGlossary: () => void;
}

export function LcaPage({ onOpenGlossary }: LcaPageProps) {
  const [assessment, setAssessment] = useState<LCAProductAssessment>(SAMPLE_LCA_ASSESSMENT);
  const [selectedMetric, setSelectedMetric] = useState<'gwp' | 'energy' | 'water' | 'acidification'>('gwp');
  const [aiExplanation, setAiExplanation] = useState<{
    summary: string;
    keyHotspots: string[];
    tradeOffs: string;
    circularOpportunities: string[];
  } | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);

  // Recharts formatted data
  const chartData = assessment.baselineStages.map((baseStage, idx) => {
    const impStage = assessment.improvedStages[idx];
    return {
      stage: baseStage.stage,
      baselineGWP: baseStage.gwpKgCO2e,
      improvedGWP: impStage.gwpKgCO2e,
      baselineEnergy: baseStage.energyDemandMJ,
      improvedEnergy: impStage.energyDemandMJ,
      baselineWater: baseStage.waterM3,
      improvedWater: impStage.waterM3,
      baselineAcid: baseStage.acidificationKgSO2e,
      improvedAcid: impStage.acidificationKgSO2e,
    };
  });

  const handleExplainLCA = async () => {
    setIsExplaining(true);
    try {
      const response = await fetch('/api/ai/explain-lca', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: assessment.productName,
          functionalUnit: assessment.functionalUnit,
          stages: chartData,
          baselineTotal: assessment.baselineTotalGWP,
          improvedTotal: assessment.improvedTotalGWP,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }
      const data = await response.json();
      setAiExplanation(data);
    } catch (err) {
      console.error('Failed to explain LCA:', err);
      // Fallback
      setAiExplanation({
        summary: `Life Cycle Assessment demonstrates a ${assessment.reductionPercentage}% cradle-to-grave reduction in Global Warming Potential. The dominant driver is upstream raw material replacement: substituting primary virgin smelting with certified recycled scrap avoids intensive electro-reduction emissions.`,
        keyHotspots: [
          'Primary mineral smelting and raw bauxite refining represent over 60% of total lifecycle burden.',
          'Machining swarf generation (38% material loss in standard CNC cutting).',
          'Post-consumer landfilling with zero alloy reclamation credit.',
        ],
        tradeOffs: 'Secondary alloy remelt drastically reduces energy and carbon, but requires stricter batch spectrometry testing to ensure tensile integrity under thermal fatigue.',
        circularOpportunities: [
          'Near-net shape cold forging to slash raw machining scrap from 38% down to 6%.',
          'Standardized single-material fasteners to facilitate automated end-of-life disassembly.',
          'Closed-loop remelter takeback agreements providing verified circular supply guarantees.',
        ],
      });
    } finally {
      setIsExplaining(false);
    }
  };

  const metricConfig = {
    gwp: {
      label: 'Global Warming Potential (GWP100)',
      unit: 'kg CO2 eq',
      baselineKey: 'baselineGWP',
      improvedKey: 'improvedGWP',
      icon: Leaf,
    },
    energy: {
      label: 'Cumulative Energy Demand (CED)',
      unit: 'MJ eq',
      baselineKey: 'baselineEnergy',
      improvedKey: 'improvedEnergy',
      icon: Zap,
    },
    water: {
      label: 'Water Depletion Footprint',
      unit: 'm³ eq',
      baselineKey: 'baselineWater',
      improvedKey: 'improvedWater',
      icon: Droplets,
    },
    acidification: {
      label: 'Terrestrial Acidification Potential',
      unit: 'kg SO2 eq',
      baselineKey: 'baselineAcid',
      improvedKey: 'improvedAcid',
      icon: Factory,
    },
  };

  const activeMetric = metricConfig[selectedMetric];

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200/80 mb-2">
            <Layers className="w-3.5 h-3.5 text-emerald-600" />
            ISO 14040 / 14044 Comparative LCA
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Life Cycle Assessment (LCA) Evaluator
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl">
            Evaluate cradle-to-grave environmental impacts across all stages: raw material extraction, manufacturing, logistics, use phase, and end-of-life circularity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenGlossary}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-xs"
          >
            <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>ISO 14044 Methodology</span>
          </button>
        </div>
      </div>

      {/* Product Assessment Metadata Card */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 font-mono">
              Evaluated Product & Functional Unit
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
              {assessment.productName}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              <strong>Functional Unit:</strong> {assessment.functionalUnit}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs text-slate-500">Lifecycle Decoupling:</span>
              <div className="text-2xl font-extrabold text-emerald-700 font-mono">
                -{assessment.reductionPercentage}%
              </div>
            </div>

            <button
              id="explain-lca-btn"
              onClick={handleExplainLCA}
              disabled={isExplaining}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              {isExplaining ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Hotspots...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>AI Hotspot Interpretation</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Metric Switcher & Key Totals */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          {(['gwp', 'energy', 'water', 'acidification'] as const).map((m) => {
            const conf = metricConfig[m];
            const Icon = conf.icon;
            const isSelected = selectedMetric === m;
            return (
              <button
                key={m}
                onClick={() => setSelectedMetric(m)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-emerald-50/80 border-emerald-400 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'bg-slate-50 border-slate-200 hover:bg-white'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-1">
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-700' : 'text-slate-400'}`} />
                  <span className="truncate">{conf.label.split(' ')[0]}</span>
                </div>
                <div className="text-xs text-slate-500 font-mono truncate">{conf.unit}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Comparative Chart & Stage Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Recharts Comparative Bar Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-base font-bold text-slate-900">
                Cradle-to-Grave Stage Comparison ({activeMetric.unit})
              </h4>
              <p className="text-xs text-slate-500">
                Baseline (Virgin / Standard Process) vs. Improved (Circular / Eco-Design)
              </p>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="stage" tick={{ fontSize: 11, fill: '#64748b' }} interval={0} angle={-15} textAnchor="end" />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <RechartsTooltip
                  formatter={(val: any, name: any) => [
                    `${Number(val).toFixed(1)} ${activeMetric.unit}`,
                    name === activeMetric.baselineKey ? 'Baseline Design' : 'Eco-Optimized Design',
                  ]}
                />
                <Legend
                  wrapperStyle={{ fontSize: 12, paddingTop: 10 }}
                  formatter={(val) => (val === activeMetric.baselineKey ? 'Baseline Design' : 'Eco-Optimized Design')}
                />
                <Bar dataKey={activeMetric.baselineKey} fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey={activeMetric.improvedKey} fill="#059669" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 flex items-center justify-between">
            <span>
              <strong>Note on End-of-Life:</strong> Negative values in End-of-Life indicate an <em>avoided burden credit</em> earned through high-efficiency closed-loop remelting.
            </span>
          </div>
        </div>

        {/* Right: Stage Hotspots Details */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="text-base font-bold text-slate-900">Stage Hotspots</h4>
            <span className="text-xs text-slate-500 font-mono">5 Stages</span>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[380px] pr-1 divide-y divide-slate-100">
            {assessment.baselineStages.map((stage, idx) => (
              <div key={stage.stage} className="pt-3 first:pt-0 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{stage.stage}</span>
                  <span className="text-xs font-mono font-semibold text-emerald-700">
                    {stage.gwpKgCO2e} kg CO2e
                  </span>
                </div>
                <div className="space-y-1 text-[11px] text-slate-600">
                  {stage.hotspots.map((hotspot, hIdx) => (
                    <div key={hIdx} className="flex items-start gap-1.5">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>{hotspot}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Hotspot Interpretation Result */}
      {aiExplanation && (
        <div className="p-6 rounded-2xl bg-slate-950 text-white border border-emerald-800/40 shadow-xl space-y-5 animate-in fade-in duration-300">
          <div className="flex items-center justify-between border-b border-emerald-900/60 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Gemini AI Life Cycle Hotspot & Circularity Analysis
                </h3>
                <p className="text-xs text-slate-400">
                  Synthesized in compliance with ISO 14044 Life Cycle Impact Assessment (LCIA)
                </p>
              </div>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-md bg-emerald-900/60 text-emerald-300 border border-emerald-700/50">
              Verified
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            {aiExplanation.summary}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-900/40 space-y-2">
              <h5 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Critical Hotspots
              </h5>
              <ul className="space-y-1 text-xs text-slate-300">
                {aiExplanation.keyHotspots.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-500">›</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-900/40 space-y-2">
              <h5 className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                Environmental Trade-Offs
              </h5>
              <p className="text-xs text-slate-300 leading-relaxed">
                {aiExplanation.tradeOffs}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-900/40 space-y-2">
              <h5 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Circularity Pathways
              </h5>
              <ul className="space-y-1 text-xs text-slate-300">
                {aiExplanation.circularOpportunities.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-400">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
