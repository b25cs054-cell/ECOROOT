import React, { useState } from 'react';
import {
  Sliders,
  TrendingDown,
  DollarSign,
  Clock,
  Award,
  Zap,
  CheckCircle2,
  Plus,
  HelpCircle,
  BarChart3,
  Sparkles,
  Info,
  ShieldCheck,
} from 'lucide-react';
import { InterventionScenario } from '../../types';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Cell,
} from 'recharts';

interface InterventionSimulatorPageProps {
  interventions: InterventionScenario[];
  onToggleIntervention: (id: string) => void;
  onUpdateScale: (id: string, scale: number) => void;
  onAddCustomIntervention: (scenario: InterventionScenario) => void;
  baselineTotalEmissions: number;
  onOpenGlossary: () => void;
}

export function InterventionSimulatorPage({
  interventions,
  onToggleIntervention,
  onUpdateScale,
  onAddCustomIntervention,
  baselineTotalEmissions,
  onOpenGlossary,
}: InterventionSimulatorPageProps) {
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customCategory, setCustomCategory] = useState<any>('Energy Efficiency');
  const [customCapex, setCustomCapex] = useState<number>(50000);
  const [customSavings, setCustomSavings] = useState<number>(25000);
  const [customReduction, setCustomReduction] = useState<number>(80);
  const [customCarbonCredit, setCustomCarbonCredit] = useState(true);

  // Active simulated sums
  const activeInterventions = interventions.filter((i) => i.activeInSimulation);

  const totalReductionTCO2e = activeInterventions.reduce((sum, item) => {
    return sum + item.annualTCO2eReduction * (item.scalePercentage / 100);
  }, 0);

  const totalCapexUSD = activeInterventions.reduce((sum, item) => {
    return sum + item.capexUSD * (item.scalePercentage / 100);
  }, 0);

  const totalAnnualSavingsUSD = activeInterventions.reduce((sum, item) => {
    return sum + item.annualOpexSavingsUSD * (item.scalePercentage / 100);
  }, 0);

  const blendedPaybackYears =
    totalAnnualSavingsUSD > 0 ? (totalCapexUSD / totalAnnualSavingsUSD).toFixed(1) : '0';

  const reductionPercentage = (
    (totalReductionTCO2e / (baselineTotalEmissions || 1)) *
    100
  ).toFixed(1);

  // MACC (Marginal Abatement Cost Curve) chart data
  const maccData = interventions.map((item) => ({
    name: item.name.length > 20 ? item.name.slice(0, 18) + '...' : item.name,
    fullName: item.name,
    abatementCost: item.abatementCostPerTCO2e,
    reduction: item.annualTCO2eReduction * (item.scalePercentage / 100),
    isActive: item.activeInSimulation,
  }));

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const payback = customSavings > 0 ? Number((customCapex / customSavings).toFixed(2)) : 5;
    const abatement = Number(((customCapex - customSavings * 10) / (customReduction * 10 || 1)).toFixed(1));

    const newScenario: InterventionScenario = {
      id: `int-custom-${Date.now()}`,
      name: customName,
      category: customCategory,
      description: 'Custom facility decarbonization project.',
      capexUSD: customCapex,
      annualOpexSavingsUSD: customSavings,
      annualTCO2eReduction: customReduction,
      implementationMonths: 4,
      lifespanYears: 10,
      paybackPeriodYears: payback,
      abatementCostPerTCO2e: abatement,
      carbonCreditEligible: customCarbonCredit,
      activeInSimulation: true,
      scalePercentage: 100,
    };

    onAddCustomIntervention(newScenario);
    setCustomName('');
    setIsAddingCustom(false);
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200/80 mb-2">
            <Sliders className="w-3.5 h-3.5 text-emerald-600" />
            What-If Multi-Variable Sandbox
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Decarbonization Intervention Simulator
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl">
            Simulate engineering interventions, adjust deployment scale percentages, and analyze real-time carbon reduction, CapEx requirements, and financial payback.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddingCustom(!isAddingCustom)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom Scenario</span>
          </button>

          <button
            onClick={onOpenGlossary}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-xs"
          >
            <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>MACC & ROI Metrics</span>
          </button>
        </div>
      </div>

      {/* Real-Time KPI Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-emerald-950 text-white border border-emerald-900/50 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
              Simulated Reduction
            </span>
            <TrendingDown className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono mt-2">
            {totalReductionTCO2e.toLocaleString(undefined, { maximumFractionDigits: 1 })}{' '}
            <span className="text-sm font-normal text-emerald-400">tCO2e/yr</span>
          </div>
          <div className="text-xs text-emerald-300 mt-1 font-semibold">
            -{reductionPercentage}% of gross organizational baseline
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Required CapEx
            </span>
            <DollarSign className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono mt-2">
            ${totalCapexUSD.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Total upfront equipment & commissioning investment
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Annual OpEx Savings
            </span>
            <Zap className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-700 font-mono mt-2">
            ${totalAnnualSavingsUSD.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Avoided natural gas & grid electricity expense
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Blended Payback
            </span>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono mt-2">
            {blendedPaybackYears} <span className="text-sm font-normal text-slate-500">Years</span>
          </div>
          <div className="text-xs text-emerald-800 font-semibold mt-1">
            Highly favorable corporate hurdle rate
          </div>
        </div>
      </div>

      {/* Add Custom Scenario Modal / Form */}
      {isAddingCustom && (
        <div className="p-6 rounded-2xl bg-emerald-50/70 border border-emerald-300 shadow-sm animate-in slide-in-from-top-4 duration-200">
          <div className="flex items-center justify-between border-b border-emerald-200 pb-3 mb-4">
            <h3 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-700" />
              Configure Custom Decarbonization Intervention
            </h3>
            <button
              onClick={() => setIsAddingCustom(false)}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-900"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleCreateCustom} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <div className="lg:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Scenario Name
                </label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. Industrial Heat Pump Conversion"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/30"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Category
                </label>
                <select
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/30"
                >
                  <option value="Renewables">Renewables</option>
                  <option value="Energy Efficiency">Energy Efficiency</option>
                  <option value="Circular Materials">Circular Materials</option>
                  <option value="Electrification">Electrification</option>
                  <option value="Waste Reduction">Waste Reduction</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  CapEx (USD)
                </label>
                <input
                  type="number"
                  value={customCapex}
                  onChange={(e) => setCustomCapex(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/30"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Annual Savings ($)
                </label>
                <input
                  type="number"
                  value={customSavings}
                  onChange={(e) => setCustomSavings(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/30"
                  required
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Annual tCO2e Reduced
                  </label>
                  <input
                    type="number"
                    value={customReduction}
                    onChange={(e) => setCustomReduction(parseFloat(e.target.value) || 0)}
                    className="w-36 px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/30"
                    required
                  />
                </div>

                <div className="flex items-center gap-2 pt-4">
                  <input
                    type="checkbox"
                    id="credit-eligible"
                    checked={customCarbonCredit}
                    onChange={(e) => setCustomCarbonCredit(e.target.checked)}
                    className="rounded-md text-emerald-600 focus:ring-emerald-500"
                  />
                  <label htmlFor="credit-eligible" className="text-xs font-semibold text-slate-700">
                    Carbon Credit Eligible (Scope 1/2 Avoidance)
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs cursor-pointer"
              >
                Integrate Into Sandbox
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Intervention Cards & Sliders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interventions List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              Active Intervention Scenarios ({interventions.length})
            </h3>
            <span className="text-xs text-slate-500">Toggle or adjust implementation scale</span>
          </div>

          <div className="space-y-4">
            {interventions.map((item) => (
              <div
                key={item.id}
                className={`p-5 rounded-2xl border transition-all ${
                  item.activeInSimulation
                    ? 'bg-white border-slate-200/90 shadow-sm'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={item.activeInSimulation}
                      onChange={() => onToggleIntervention(item.id)}
                      className="mt-1 w-4 h-4 rounded-md text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">{item.name}</h4>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                          {item.category}
                        </span>
                        {item.carbonCreditEligible && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                            Credit Eligible
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{item.description}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs text-slate-500">Annual Reduction:</span>
                    <div className="text-base font-extrabold text-emerald-700 font-mono">
                      {(item.annualTCO2eReduction * (item.scalePercentage / 100)).toFixed(1)} tCO2e
                    </div>
                  </div>
                </div>

                {/* Slider and Metrics Row */}
                <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  {/* Scale Slider */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-600">Adoption Scale:</span>
                      <span className="font-bold text-emerald-700 font-mono">
                        {item.scalePercentage}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      disabled={!item.activeInSimulation}
                      value={item.scalePercentage}
                      onChange={(e) => onUpdateScale(item.id, parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* Financials Grid */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="text-[10px] text-slate-500">CapEx</div>
                      <div className="font-bold text-slate-800 font-mono truncate">
                        ${((item.capexUSD * item.scalePercentage) / 100).toLocaleString()}
                      </div>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="text-[10px] text-slate-500">OpEx Savings</div>
                      <div className="font-bold text-emerald-700 font-mono truncate">
                        ${((item.annualOpexSavingsUSD * item.scalePercentage) / 100).toLocaleString()}/yr
                      </div>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="text-[10px] text-slate-500">Payback</div>
                      <div className="font-bold text-slate-800 font-mono">
                        {item.paybackPeriodYears} yrs
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Marginal Abatement Cost Curve (MACC) Visualization */}
        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Marginal Abatement Cost ($/tCO2e)
              </h3>
              <p className="text-xs text-slate-500">
                Negative values represent net-positive economic returns over project lifespan
              </p>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={maccData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" tick={{ fontSize: 10, fill: '#64748b' }} unit=" $" />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: '#64748b' }} width={80} />
                  <RechartsTooltip
                    formatter={(val: any, name: any, props: any) => [
                      `${val} USD / tCO2e (${props.payload.reduction.toFixed(1)} tCO2e)`,
                      'Cost of Abatement',
                    ]}
                  />
                  <Bar dataKey="abatementCost" radius={[4, 4, 4, 4]}>
                    {maccData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.abatementCost < 0 ? '#059669' : '#0284c7'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Economic Efficiency Insight
              </div>
              <p className="text-[11px] leading-relaxed">
                Interventions like Boiler O2 Trim and Compressed Air VFDs have <strong>negative abatement costs</strong>, saving significantly more in energy than their initial capital cost.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
