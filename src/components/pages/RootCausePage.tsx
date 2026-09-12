import React, { useState, useEffect } from 'react';
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
  Save,
  Plus,
  Trash2,
  Database,
  Check,
  Zap,
  FolderOpen,
  Send,
  Sliders,
  FileCheck,
} from 'lucide-react';
import { RootCauseAnalysisResult, FiveWhyStep, InterventionScenario } from '../../types';
import { SAMPLE_ROOT_CAUSE_ANALYSIS } from '../../data/mockData';

interface RootCausePageProps {
  onAddIntervention?: (intervention: InterventionScenario) => void;
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

  // Backend Integration State
  const [savedAnalyses, setSavedAnalyses] = useState<RootCauseAnalysisResult[]>([]);
  const [isLoadingSaved, setIsLoadingSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [addedInterventionTitles, setAddedInterventionTitles] = useState<string[]>([]);

  // Add Why State
  const [isAddingWhyAI, setIsAddingWhyAI] = useState(false);
  const [showManualWhyForm, setShowManualWhyForm] = useState(false);
  const [manualQuestion, setManualQuestion] = useState('');
  const [manualAnswer, setManualAnswer] = useState('');
  const [manualEvidence, setManualEvidence] = useState('');
  const [manualContributor, setManualContributor] = useState('');

  // Fetch saved analyses from backend on component mount
  const fetchBackendAnalyses = async () => {
    setIsLoadingSaved(true);
    try {
      const res = await fetch('/api/root-cause');
      if (res.ok) {
        const data = await res.json();
        if (data.analyses && Array.isArray(data.analyses)) {
          setSavedAnalyses(data.analyses);
        }
      }
    } catch (err) {
      console.warn('Backend root-cause fetch skipped:', err);
    } finally {
      setIsLoadingSaved(false);
    }
  };

  useEffect(() => {
    fetchBackendAnalyses();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

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
      const newAnalysis: RootCauseAnalysisResult = {
        id: data.id || `rca-${Date.now()}`,
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
      };

      setCurrentAnalysis(newAnalysis);
      showToast('New 5-Why Analysis synthesized & saved to backend store.');
      fetchBackendAnalyses();
    } catch (err: any) {
      console.error('Failed to run root cause analysis:', err);
      setErrorMessage(err.message || 'Error communicating with AI engine. Please check the network.');
    } finally {
      setIsLoading(false);
    }
  };

  // Save current investigation to backend explicitly
  const handleSaveToBackend = async () => {
    if (!currentAnalysis) return;
    setIsSaving(true);
    try {
      const res = await fetch('/api/root-cause', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentAnalysis),
      });

      if (res.ok) {
        showToast('✓ Investigation successfully synchronized with backend database');
        fetchBackendAnalyses();
      } else {
        showToast('Failed to save investigation to backend.');
      }
    } catch (err) {
      console.error('Save to backend error:', err);
      showToast('Network error while saving to backend.');
    } finally {
      setIsSaving(false);
    }
  };

  // Load a saved case from backend
  const handleSelectSaved = (analysis: RootCauseAnalysisResult) => {
    setCurrentAnalysis(analysis);
    setProblemStatement(analysis.problemStatement || analysis.title);
    setFacility(analysis.facility || 'Plant 1');
    setCategory(analysis.category || 'Combustion & Boiler Loss');
    showToast(`Loaded case: "${analysis.title.slice(0, 35)}..."`);
  };

  // Delete a saved case from backend
  const handleDeleteSaved = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/root-cause/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSavedAnalyses((prev) => prev.filter((a) => a.id !== id));
        showToast('Investigation removed from backend.');
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  // Reset form for a brand new investigation
  const handleNewInvestigation = () => {
    setProblemStatement('');
    setEquipment('');
    setObservations('');
    showToast('Ready for new investigation input.');
  };

  // AI Next Why step generator (probes deeper: Why 6, Why 7, etc.)
  const handleAddNextWhyAI = async () => {
    if (!currentAnalysis) return;
    setIsAddingWhyAI(true);
    try {
      const res = await fetch('/api/ai/root-cause/next-why', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemStatement: currentAnalysis.problemStatement,
          currentWhys: currentAnalysis.fiveWhys,
          facility: currentAnalysis.facility,
          category: currentAnalysis.category,
          equipment: (currentAnalysis as any).equipment || equipment,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.newWhy) {
          const updatedWhys = [...currentAnalysis.fiveWhys, data.newWhy];
          const updatedAnalysis: RootCauseAnalysisResult = {
            ...currentAnalysis,
            fiveWhys: updatedWhys,
          };
          setCurrentAnalysis(updatedAnalysis);
          // Persist to backend
          fetch('/api/root-cause', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedAnalysis),
          }).catch(() => {});
          showToast(`Level ${data.newWhy.level} added via Gemini backend!`);
        }
      } else {
        showToast('Could not generate next Why step. Please try manual entry.');
      }
    } catch (err) {
      console.error('AI next why error:', err);
      showToast('Network error contacting AI generator.');
    } finally {
      setIsAddingWhyAI(false);
    }
  };

  // Add custom manual Why step
  const handleAddManualWhy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualQuestion.trim() || !manualAnswer.trim()) return;

    const nextLevel = currentAnalysis.fiveWhys.length + 1;
    const newStep: FiveWhyStep = {
      level: nextLevel,
      question: manualQuestion,
      answer: manualAnswer,
      evidence: manualEvidence || 'Engineering field survey and operational telemetry observation.',
      contributingFactor: manualContributor || 'Systemic operational procedure',
    };

    const updatedAnalysis: RootCauseAnalysisResult = {
      ...currentAnalysis,
      fiveWhys: [...currentAnalysis.fiveWhys, newStep],
    };

    setCurrentAnalysis(updatedAnalysis);
    setManualQuestion('');
    setManualAnswer('');
    setManualEvidence('');
    setManualContributor('');
    setShowManualWhyForm(false);

    // Persist to backend
    fetch('/api/root-cause', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedAnalysis),
    }).catch(() => {});

    showToast(`Level ${nextLevel} step added manually!`);
  };

  // Delete a specific why step
  const handleDeleteWhyStep = (levelToDelete: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = currentAnalysis.fiveWhys
      .filter((step) => step.level !== levelToDelete)
      .map((step, idx) => ({ ...step, level: idx + 1 }));

    const updatedAnalysis = { ...currentAnalysis, fiveWhys: filtered };
    setCurrentAnalysis(updatedAnalysis);
    showToast('Why step removed.');
  };

  // Add recommended solution to the Intervention Simulator
  const handleAddToSimulator = (item: {
    title: string;
    description: string;
    estimatedReductionTCO2e: number;
    difficulty: 'Low' | 'Medium' | 'High';
    paybackMonths: number;
  }) => {
    if (!onAddIntervention) return;

    // Derive financial parameters based on engineering heuristics
    const annualSavingsUSD = Math.round(item.estimatedReductionTCO2e * 85); // ~$85/tCO2e energy cost savings
    const capexUSD = Math.round((annualSavingsUSD * (item.paybackMonths || 12)) / 12);
    const categoryMapping: Record<string, any> = {
      'Combustion & Boiler Loss': 'Energy Efficiency',
      'Energy Inefficiency': 'Energy Efficiency',
      'Process Waste': 'Waste Reduction',
      'Refrigerant Leakage': 'Energy Efficiency',
      'Supply Chain Logistics': 'Circular Materials',
      'Water & Effluent': 'Energy Efficiency',
    };

    const newIntervention: InterventionScenario = {
      id: `intervention-rca-${Date.now()}`,
      name: item.title,
      category: categoryMapping[currentAnalysis.category] || 'Energy Efficiency',
      description: `${item.description} (Derived from 5-Why Case: ${currentAnalysis.title})`,
      capexUSD: capexUSD > 0 ? capexUSD : 25000,
      annualOpexSavingsUSD: annualSavingsUSD > 0 ? annualSavingsUSD : 8500,
      annualTCO2eReduction: item.estimatedReductionTCO2e,
      implementationMonths: item.difficulty === 'Low' ? 3 : item.difficulty === 'Medium' ? 7 : 14,
      lifespanYears: 10,
      paybackPeriodYears: Number(((item.paybackMonths || 12) / 12).toFixed(1)),
      abatementCostPerTCO2e: Number((capexUSD / (item.estimatedReductionTCO2e * 10) - 85).toFixed(1)),
      carbonCreditEligible: true,
      activeInSimulation: true,
      scalePercentage: 100,
    };

    onAddIntervention(newIntervention);
    setAddedInterventionTitles((prev) => [...prev, item.title]);
    showToast(`✓ "${item.title}" added to Decarbonization Intervention Simulator!`);
  };

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 border border-emerald-500/40 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200/80 mb-2">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            Backend-Integrated 5-Why Causal Tree
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Root Cause & 5-Why Investigation
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl">
            Deconstruct industrial emissions and energy waste down to the physical, sensor, and management failure points using full backend persistence and dynamic AI step expansion.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleNewInvestigation}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-600" />
            <span>New Investigation</span>
          </button>
          <button
            onClick={onOpenGlossary}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Root Cause Methodology</span>
          </button>
        </div>
      </div>

      {/* Backend Cases Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 text-slate-200 border border-slate-800 space-y-2 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Backend Saved Investigations ({savedAnalyses.length})
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-950 text-emerald-300 border border-emerald-800/60">
              Live REST API
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveToBackend}
              disabled={isSaving || !currentAnalysis}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-xs cursor-pointer disabled:opacity-50"
            >
              {isSaving ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
              <span>Save Current to Backend</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 text-xs">
          {savedAnalyses.map((item) => {
            const isCurrent = currentAnalysis?.id === item.id;
            return (
              <div
                key={item.id}
                onClick={() => handleSelectSaved(item)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all shrink-0 cursor-pointer ${
                  isCurrent
                    ? 'bg-emerald-950/80 border-emerald-500 text-white font-semibold'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <FolderOpen className="w-3 h-3 text-emerald-400 shrink-0" />
                <span className="truncate max-w-[200px]">{item.title}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-900/60 text-slate-400 font-mono">
                  {item.fiveWhys?.length || 5}W
                </span>
                <button
                  onClick={(e) => handleDeleteSaved(item.id, e)}
                  title="Delete from backend"
                  className="text-slate-400 hover:text-red-400 transition-colors ml-1"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            );
          })}
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
              className="text-left p-2.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/40 text-xs transition-all shadow-xs group cursor-pointer"
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
                  <span>Synthesizing Backend Analysis (Gemini)...</span>
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
                <button
                  onClick={handleSaveToBackend}
                  disabled={isSaving}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white cursor-pointer transition-colors shadow-xs"
                >
                  <Save className="w-3 h-3 text-emerald-400" />
                  <span>{isSaving ? 'Saving...' : 'Save Case'}</span>
                </button>
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
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">5-Why Sequential Decomposition</h3>
                <p className="text-xs text-slate-500">
                  Click on any level to reveal underlying telemetry, or add deeper levels (Why 6, Why 7)
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  {currentAnalysis.fiveWhys.length} Depth Levels
                </span>

                {/* AI Next Why Generator Button */}
                <button
                  onClick={handleAddNextWhyAI}
                  disabled={isAddingWhyAI}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer disabled:opacity-50 transition-all"
                  title="Generate next deeper Why using backend Gemini AI"
                >
                  {isAddingWhyAI ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5" />
                  )}
                  <span>+ Add Next Why (AI)</span>
                </button>

                {/* Manual Add Why Button */}
                <button
                  onClick={() => setShowManualWhyForm(!showManualWhyForm)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold border border-slate-200 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-slate-600" />
                  <span>+ Add Custom Why</span>
                </button>
              </div>
            </div>

            {/* Manual Why Form */}
            {showManualWhyForm && (
              <form
                onSubmit={handleAddManualWhy}
                className="p-4 rounded-xl bg-slate-50 border border-emerald-200 space-y-3 animate-in fade-in"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    Add Step #{currentAnalysis.fiveWhys.length + 1} Manually
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowManualWhyForm(false)}
                    className="text-xs text-slate-400 hover:text-slate-600"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Question (Why...?)
                    </label>
                    <input
                      type="text"
                      value={manualQuestion}
                      onChange={(e) => setManualQuestion(e.target.value)}
                      placeholder="Why did the operator lack continuous feedback?"
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Answer / Operational Principle
                    </label>
                    <input
                      type="text"
                      value={manualAnswer}
                      onChange={(e) => setManualAnswer(e.target.value)}
                      placeholder="Legacy SCADA communication protocol prevented bidirectional polling..."
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Physical Evidence
                    </label>
                    <input
                      type="text"
                      value={manualEvidence}
                      onChange={(e) => setManualEvidence(e.target.value)}
                      placeholder="Historical SCADA audit logs show 0 polling packets"
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Contributing Factor
                    </label>
                    <input
                      type="text"
                      value={manualContributor}
                      onChange={(e) => setManualContributor(e.target.value)}
                      placeholder="Network telemetry isolation"
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Append Step to Tree</span>
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-3 relative">
              {/* Connecting line */}
              <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-emerald-200 hidden sm:block pointer-events-none" />

              {currentAnalysis.fiveWhys.map((step, idx) => {
                const isSelected = activeStep === step.level;
                return (
                  <div
                    key={step.level}
                    onClick={() => setActiveStep(isSelected ? null : step.level)}
                    className={`relative p-4 rounded-xl border transition-all cursor-pointer group ${
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
                        <div className="flex items-center justify-between">
                          <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                            Why {step.level}
                          </div>
                          {currentAnalysis.fiveWhys.length > 1 && (
                            <button
                              onClick={(e) => handleDeleteWhyStep(step.level, e)}
                              title="Delete this Why step"
                              className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-opacity p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
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
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Targeted Engineering Mitigation Options
                </h3>
                <p className="text-xs text-slate-500">
                  High-yield solutions derived to eliminate the root cause permanently. Click "Add to Simulator" to run MACC calculations.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentAnalysis.recommendedInterventions.map((item, idx) => {
                const isAdded = addedInterventionTitles.includes(item.title);
                return (
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

                    <div className="pt-2 border-t border-slate-200/80 space-y-2">
                      <div className="flex items-center justify-between text-xs">
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

                      {/* Add to Simulator Action */}
                      <button
                        onClick={() => handleAddToSimulator(item)}
                        disabled={isAdded}
                        className={`w-full py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          isAdded
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Added to Intervention Simulator</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add to Intervention Simulator</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
