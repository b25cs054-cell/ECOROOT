import React, { useState } from 'react';
import {
  GitFork,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  RefreshCw,
  Clock,
  DollarSign,
  Flame,
  Wrench,
  Layers,
  HelpCircle,
  TrendingDown,
} from 'lucide-react';
import { RootCauseAnalysisResult, FiveWhyStep } from '../../types';
import { SAMPLE_ROOT_CAUSE_ANALYSIS } from '../../data/mockData';

interface RootCausePageProps {
  onAddIntervention?: (intervention: any) => void;
  onOpenGlossary: () => void;
}

export function RootCausePage({ onAddIntervention, onOpenGlossary }: RootCausePageProps) {
  const [currentAnalysis, setCurrentAnalysis] = useState<RootCauseAnalysisResult>(SAMPLE_ROOT_CAUSE_ANALYSIS);
  const [problemStatement, setProblemStatement] = useState('');
  const [facility, setFacility] = useState('Manufacturing Facility 1 (Detroit)');
  const [category, setCategory] = useState<any>('Combustion & Boiler Loss');
  const [equipment, setEquipment] = useState('Dual Firetube Boilers #1 & #2');
  const [observations, setObservations] = useState('Stack temperature >240°C, stack O2 at 8.4%, 34% natural gas surge.');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const presetScenarios = [
    {
      title: 'Boiler Thermal Stack Loss',
      category: 'Combustion & Boiler Loss',
      facility: 'Manufacturing Facility 1 (Detroit)',
      equipment: 'Dual Firetube Steam Boilers (300 BHP)',
      statement: 'Natural gas consumption surged 34% year-over-year in Boiler Room 3 despite constant steam output.',
      obs: 'Stack temperature exceeds 245°C (design 165°C), stack O2 analyzer reads 8.4%, continuous unmetered blowdown to sewer.',
    },
    {
      title: 'Compressed Air Parasitic Leakage',
      category: 'Energy Inefficiency',
      facility: 'Assembly Complex B',
      equipment: 'Rotary Screw Air Compressors (3x 150 HP)',
      statement: 'Compressor power draw remains at 65% of full load during weekend non-production downtime.',
      obs: 'Acoustic inspection reveals widespread quick-connect leaks and unregulated header pressure at 125 psig (demand is 90 psig).',
    },
    {
      title: 'Chiller Refrigerant Leakage',
      category: 'Refrigerant Leakage',
      facility: 'Cleanroom Complex B',
      equipment: 'Centrifugal Chiller Units (R-410A)',
      statement: 'Chiller plant required 120 kg of top-up refrigerant over 8 months, indicating severe fugitive loss.',
      obs: 'Vibration-induced microcracks at compressor discharge manifold; GWP100 is 2,088 kg CO2e per kg.',
    },
    {
      title: 'Paint Shop Thermal Oxidizer Inefficiency',
      category: 'Process Waste',
      facility: 'Coating Line 4',
      equipment: 'Regenerative Thermal Oxidizer (RTO)',
      statement: 'Natural gas auxiliary burner running continuously at 100% duty cycle to maintain 850°C destruction temp.',
      obs: 'Ceramic heat exchange media bed fouled with particulate matter; thermal recovery efficiency dropped from 95% to 71%.',
    },
  ];

  const handleApplyPreset = (preset: (typeof presetScenarios)[0]) => {
    setProblemStatement(preset.statement);
    setFacility(preset.facility);
    setCategory(preset.category);
    setEquipment(preset.equipment);
    setObservations(preset.obs);
  };

  const handleRunAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!problemStatement.trim()) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/ai/root-cause', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemStatement,
          facility,
          category,
          equipment,
          observations,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setCurrentAnalysis({
        id: `rca-${Date.now()}`,
        title: data.title || problemStatement.slice(0, 45),
        problemStatement,
        facility: data.facility || facility,
        category: data.category || category,
        fishboneCategory: data.fishboneCategory || 'Machine',
        severity: data.severity || 'High',
        estimatedAnnualLossTCO2e: data.estimatedAnnualLossTCO2e || 140,
        estimatedCostLossUSD: data.estimatedCostLossUSD || 45000,
        ultimateRootCause: data.ultimateRootCause || 'Systemic setpoint drift and maintenance omission.',
        fiveWhys: data.fiveWhys || [],
        recommendedInterventions: data.recommendedInterventions || [],
        generatedAt: data.generatedAt || new Date().toISOString(),
      });
    } catch (err: any) {
      console.error('Failed to run root cause analysis:', err);
      setErrorMessage(err.message || 'Error communicating with AI engine. Please check the network.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200/80 mb-2">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            Empirical 5-Why Causal Tree
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Root Cause & 5-Why Investigation
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl">
            Deconstruct industrial emissions and energy waste down to the physical, sensor, and management failure points using structured thermodynamic logic.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenGlossary}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-xs"
          >
            <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Root Cause Methodology</span>
          </button>
        </div>
      </div>

      {/* Preset Quick-Selector */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Load Pre-Configured Industrial Investigation:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {presetScenarios.map((preset) => (
            <button
              key={preset.title}
              onClick={() => handleApplyPreset(preset)}
              className="text-left p-2.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/40 text-xs transition-all shadow-xs group"
            >
              <div className="font-semibold text-slate-800 group-hover:text-emerald-700">
                {preset.title}
              </div>
              <div className="text-[11px] text-slate-500 truncate mt-0.5">
                {preset.equipment}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Diagnostic Input Form */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <GitFork className="w-4 h-4 text-emerald-600" />
            Problem Statement & Telemetry Configuration
          </h3>
          <span className="text-xs text-slate-500">ISO 50001 Energy Management Standard</span>
        </div>

        <form onSubmit={handleRunAnalysis} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Facility / Site
              </label>
              <input
                type="text"
                value={facility}
                onChange={(e) => setFacility(e.target.value)}
                placeholder="e.g. Plant 1 (Detroit)"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Loss Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="Combustion & Boiler Loss">Combustion & Boiler Loss</option>
                <option value="Energy Inefficiency">Energy Inefficiency (Motor/VFD)</option>
                <option value="Process Waste">Process Waste & Flaring</option>
                <option value="Supply Chain Logistics">Supply Chain Logistics</option>
                <option value="Refrigerant Leakage">Refrigerant Leakage</option>
                <option value="Water & Effluent">Water & Effluent Heating</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Specific Equipment / Asset
              </label>
              <input
                type="text"
                value={equipment}
                onChange={(e) => setEquipment(e.target.value)}
                placeholder="e.g. Firetube Boiler 3"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Industrial Problem Statement (Observed Deviation)
            </label>
            <textarea
              value={problemStatement}
              onChange={(e) => setProblemStatement(e.target.value)}
              rows={2}
              placeholder="Describe the anomalous energy consumption, thermal leak, or excessive carbon emission event..."
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Telemetry & Observed Sensor Data
            </label>
            <input
              type="text"
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder="e.g. Stack temperature 240°C, O2 analyzer 8.4%, pressure drop 18 psi"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-500">
              Grounded in physics and thermodynamic efficiency models
            </span>
            <button
              id="submit-rca-btn"
              type="submit"
              disabled={isLoading || !problemStatement.trim()}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Analyzing Causal Links (Gemini)...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Execute 5-Why Decomposition</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Results Section */}
      {currentAnalysis && (
        <div className="space-y-6">
          {/* Executive Diagnostic Card */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-700 font-bold">
                  Diagnostic Case #{currentAnalysis.id}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                  {currentAnalysis.title}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  {currentAnalysis.severity} Severity
                </span>
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                  Ishikawa: {currentAnalysis.fishboneCategory}
                </span>
              </div>
            </div>

            {/* Metrics Ribbon */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-100">
                <div className="text-xs font-medium text-emerald-800">Estimated Annual Carbon Loss</div>
                <div className="text-2xl font-extrabold text-emerald-900 font-mono mt-1">
                  {currentAnalysis.estimatedAnnualLossTCO2e} tCO2e
                </div>
                <div className="text-[11px] text-emerald-700 mt-0.5">Scope 1 combustion penalty</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-xs font-medium text-slate-600">Estimated Financial Loss</div>
                <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1">
                  ${currentAnalysis.estimatedCostLossUSD?.toLocaleString()} USD
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">Fuel & electrical dissipation</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-xs font-medium text-slate-600">Facility / Location</div>
                <div className="text-base font-bold text-slate-900 mt-1 truncate">
                  {currentAnalysis.facility}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">{currentAnalysis.category}</div>
              </div>
            </div>

            {/* Ultimate Root Cause Callout */}
            <div className="p-4 rounded-xl bg-slate-900 text-white border border-emerald-900/40 space-y-1.5">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Empirical Root Cause Identified
              </div>
              <p className="text-sm font-medium text-slate-100 leading-relaxed">
                {currentAnalysis.ultimateRootCause}
              </p>
            </div>
          </div>

          {/* 5-Why Visual Sequence */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">5-Why Sequential Decomposition</h3>
                <p className="text-xs text-slate-500">
                  Click on any level to reveal underlying telemetry and contributing factors
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-700">
                5 Levels Complete
              </span>
            </div>

            <div className="space-y-3 relative">
              {/* Connecting line */}
              <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-emerald-200 hidden sm:block pointer-events-none" />

              {currentAnalysis.fiveWhys.map((step, idx) => {
                const isSelected = activeStep === step.level;
                return (
                  <div
                    key={step.level}
                    onClick={() => setActiveStep(isSelected ? null : step.level)}
                    className={`relative p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50/80 border-emerald-400 ring-2 ring-emerald-500/20 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-emerald-300 hover:bg-slate-50/80'
                    }`}
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      {/* Level Badge */}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-xs z-10 ${
                          isSelected
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 text-slate-700 border border-slate-300'
                        }`}
                      >
                        W{step.level}
                      </div>

                      {/* Content */}
                      <div className="flex-1 space-y-1">
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                          Why {step.level}
                        </div>
                        <h4 className="text-sm font-semibold text-slate-900">
                          {step.question}
                        </h4>
                        <p className="text-xs text-slate-700 leading-relaxed font-normal">
                          {step.answer}
                        </p>

                        {/* Expandable Evidence Details */}
                        <div className="pt-2 flex flex-wrap items-center gap-2 text-[11px]">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium border border-slate-200">
                            <strong>Physical Evidence:</strong> {step.evidence}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-medium border border-emerald-200">
                            <strong>Contributor:</strong> {step.contributingFactor}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recommended Interventions */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Targeted Engineering Mitigation Options
                </h3>
                <p className="text-xs text-slate-500">
                  High-yield solutions derived to eliminate the root cause permanently
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentAnalysis.recommendedInterventions.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                        Solution #{idx + 1}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md font-semibold bg-emerald-100 text-emerald-800">
                        {item.difficulty} Effort
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-500">Reduction:</span>{' '}
                      <strong className="text-emerald-700 font-mono">
                        {item.estimatedReductionTCO2e} tCO2e/yr
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-500">Payback:</span>{' '}
                      <strong className="text-slate-900 font-mono">
                        ~{item.paybackMonths} months
                      </strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
