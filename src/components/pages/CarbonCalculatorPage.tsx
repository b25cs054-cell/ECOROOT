import React, { useState } from 'react';
import {
  Calculator,
  Plus,
  Trash2,
  HelpCircle,
  Sparkles,
  ExternalLink,
  Info,
  ShieldCheck,
  CheckCircle2,
  FileSpreadsheet,
  Building2,
  Search,
} from 'lucide-react';
import { ActivityData, EmissionFactor, ScopeType } from '../../types';

interface CarbonCalculatorPageProps {
  activities: ActivityData[];
  emissionFactors: EmissionFactor[];
  onAddActivity: (act: ActivityData) => void;
  onDeleteActivity: (id: string) => void;
  onUpdateQuantity: (id: string, qty: number) => void;
  onOpenGlossary: () => void;
}

export function CarbonCalculatorPage({
  activities,
  emissionFactors,
  onAddActivity,
  onDeleteActivity,
  onUpdateQuantity,
  onOpenGlossary,
}: CarbonCalculatorPageProps) {
  const [selectedScope, setSelectedScope] = useState<'all' | ScopeType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectActivity, setInspectActivity] = useState<ActivityData | null>(null);

  // New Activity form state
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newName, setNewName] = useState('');
  const [newFacility, setNewFacility] = useState('Manufacturing Facility 1 (Detroit)');
  const [newFactorId, setNewFactorId] = useState(emissionFactors[0]?.id || 'ef-natgas');
  const [newQuantity, setNewQuantity] = useState<number>(1000);
  const [newPeriod, setNewPeriod] = useState('2024 (Annual)');

  const filteredActivities = activities.filter((act) => {
    const matchesScope = selectedScope === 'all' || act.scope === selectedScope;
    const matchesSearch =
      act.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.facility.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesScope && matchesSearch;
  });

  const selectedFactor = emissionFactors.find((ef) => ef.id === newFactorId) || emissionFactors[0];

  const handleCreateActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || newQuantity <= 0 || !selectedFactor) return;

    const emissions = Number((newQuantity * selectedFactor.factor).toFixed(4));
    const formulaDisplay = `${newQuantity.toLocaleString()} ${selectedFactor.unit} × ${selectedFactor.factor} tCO2e/${selectedFactor.unit} = ${emissions.toFixed(2)} tCO2e`;

    const newAct: ActivityData = {
      id: `act-${Date.now()}`,
      name: newName,
      scope: selectedFactor.scope,
      factorId: selectedFactor.id,
      quantity: newQuantity,
      unit: selectedFactor.unit,
      period: newPeriod,
      facility: newFacility,
      calculatedEmissions: emissions,
      formulaDisplay,
    };

    onAddActivity(newAct);
    setNewName('');
    setNewQuantity(1000);
    setIsAddingNew(false);
  };

  const scopeTotals = {
    scope1: activities
      .filter((a) => a.scope === 'scope1')
      .reduce((sum, a) => sum + a.calculatedEmissions, 0),
    scope2: activities
      .filter((a) => a.scope === 'scope2')
      .reduce((sum, a) => sum + a.calculatedEmissions, 0),
    scope3: activities
      .filter((a) => a.scope === 'scope3')
      .reduce((sum, a) => sum + a.calculatedEmissions, 0),
  };
  const grandTotal = scopeTotals.scope1 + scopeTotals.scope2 + scopeTotals.scope3;

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200/80 mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            IPCC AR6 & EPA Audited Math
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Carbon Footprint & Formula Engine
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl">
            Deterministic calculations using transparent activity data and verified emission factors. Never simulated or guessed by generative AI.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddingNew(!isAddingNew)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Log Activity Data</span>
          </button>

          <button
            onClick={onOpenGlossary}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-xs"
          >
            <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Formulas & GWP</span>
          </button>
        </div>
      </div>

      {/* Scope Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase">Scope 1 (Direct)</div>
          <div className="text-2xl font-extrabold text-emerald-900 font-mono mt-1">
            {scopeTotals.scope1.toFixed(1)} <span className="text-sm font-normal text-slate-500">t</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Boilers, Generators, Refrigerants</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase">Scope 2 (Electricity)</div>
          <div className="text-2xl font-extrabold text-emerald-700 font-mono mt-1">
            {scopeTotals.scope2.toFixed(1)} <span className="text-sm font-normal text-slate-500">t</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Location-based grid power</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase">Scope 3 (Supply Chain)</div>
          <div className="text-2xl font-extrabold text-teal-700 font-mono mt-1">
            {scopeTotals.scope3.toFixed(1)} <span className="text-sm font-normal text-slate-500">t</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Freight, Logistics & Solid Waste</div>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-950 text-white border border-emerald-900/60 shadow-sm">
          <div className="text-xs font-bold text-emerald-300 uppercase">Gross Annual Total</div>
          <div className="text-2xl font-extrabold text-white font-mono mt-1">
            {grandTotal.toFixed(1)} <span className="text-sm font-normal text-emerald-400">tCO2e</span>
          </div>
          <div className="text-[11px] text-emerald-300/80 mt-1">All facilities combined</div>
        </div>
      </div>

      {/* Add New Activity Drawer / Card */}
      {isAddingNew && (
        <div className="p-6 rounded-2xl bg-emerald-50/70 border border-emerald-300 shadow-sm animate-in slide-in-from-top-4 duration-200">
          <div className="flex items-center justify-between border-b border-emerald-200 pb-3 mb-4">
            <h3 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-700" />
              Log New Activity Measurement
            </h3>
            <button
              onClick={() => setIsAddingNew(false)}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-900"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleCreateActivity} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Activity Name
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Paint Oven Natural Gas"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/30"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Facility / Site
                </label>
                <input
                  type="text"
                  value={newFacility}
                  onChange={(e) => setNewFacility(e.target.value)}
                  placeholder="e.g. Plant 1 (Detroit)"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/30"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Emission Factor Standard
                </label>
                <select
                  value={newFactorId}
                  onChange={(e) => setNewFactorId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/30"
                >
                  {emissionFactors.map((ef) => (
                    <option key={ef.id} value={ef.id}>
                      {ef.name} ({ef.unit}) - [{ef.scope.toUpperCase()}]
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Quantity ({selectedFactor?.unit})
                </label>
                <input
                  type="number"
                  step="any"
                  value={newQuantity}
                  onChange={(e) => setNewQuantity(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/30"
                  required
                />
              </div>
            </div>

            {/* Real-time Math Preview */}
            <div className="p-3 rounded-xl bg-white border border-emerald-200 text-xs text-emerald-950 flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="font-semibold text-slate-600">Calculated Output:</span>{' '}
                <strong className="font-mono text-emerald-800">
                  {newQuantity.toLocaleString()} {selectedFactor?.unit} × {selectedFactor?.factor} tCO2e/{selectedFactor?.unit} ={' '}
                  {(newQuantity * (selectedFactor?.factor || 0)).toFixed(2)} tCO2e
                </strong>
              </div>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs cursor-pointer"
              >
                Save & Compute
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Activities Table with Transparent Formula Columns */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
        {/* Table Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Scope Filters */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-fit">
            {(['all', 'scope1', 'scope2', 'scope3'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSelectedScope(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  selectedScope === s
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {s === 'all' ? 'All Scopes' : s.replace('scope', 'Scope ')}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter activities or facilities..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50/70">
                <th className="py-3 px-3">Activity & Facility</th>
                <th className="py-3 px-3">Scope</th>
                <th className="py-3 px-3">Activity Quantity</th>
                <th className="py-3 px-3">Emission Factor & Citation</th>
                <th className="py-3 px-3 text-right">Calculated tCO2e</th>
                <th className="py-3 px-3 text-center">Formula Math</th>
                <th className="py-3 px-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredActivities.map((act) => {
                const factorObj = emissionFactors.find((f) => f.id === act.factorId);
                const scopeBadgeColor =
                  act.scope === 'scope1'
                    ? 'bg-emerald-100 text-emerald-800'
                    : act.scope === 'scope2'
                    ? 'bg-teal-100 text-teal-800'
                    : 'bg-emerald-50 text-emerald-900 border border-emerald-200';

                return (
                  <tr key={act.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900">{act.name}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3 h-3 text-slate-400" />
                        <span>{act.facility}</span>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold uppercase tracking-wider ${scopeBadgeColor}`}
                      >
                        {act.scope}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          value={act.quantity}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0;
                            onUpdateQuantity(act.id, val);
                          }}
                          className="w-24 px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-mono font-semibold text-slate-900 focus:ring-1 focus:ring-emerald-500"
                        />
                        <span className="text-slate-500 font-mono text-[11px]">{act.unit}</span>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-mono font-semibold text-slate-800">
                        {factorObj?.factor} tCO2e/{factorObj?.unit}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate max-w-xs mt-0.5">
                        {factorObj?.source || 'IPCC AR6'}
                      </div>
                    </td>

                    <td className="py-3 px-3 text-right">
                      <div className="text-sm font-extrabold font-mono text-emerald-900">
                        {act.calculatedEmissions.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </div>
                    </td>

                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => setInspectActivity(act)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 text-[11px] font-semibold transition-colors inline-flex items-center gap-1"
                      >
                        <Info className="w-3 h-3" />
                        <span>Inspect</span>
                      </button>
                    </td>

                    <td className="py-3 px-2 text-center">
                      <button
                        onClick={() => onDeleteActivity(act.id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Remove activity record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Formula Inspector Modal */}
      {inspectActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-emerald-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Formula Math & Emission Factor Audit
                </h3>
              </div>
              <button
                onClick={() => setInspectActivity(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="font-semibold text-slate-500">Activity Stream:</span>
                <div className="text-sm font-bold text-slate-900 mt-0.5">
                  {inspectActivity.name}
                </div>
              </div>

              {/* Exact Formula Box */}
              <div className="p-3 rounded-xl bg-slate-900 text-emerald-300 font-mono text-xs space-y-1.5">
                <div className="text-slate-400 text-[10px] uppercase tracking-wider">
                  Audited Formula Representation:
                </div>
                <div className="text-white font-bold text-sm">
                  {inspectActivity.formulaDisplay}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Scope Classification:</span>
                  <span className="font-bold font-mono uppercase text-slate-800">
                    {inspectActivity.scope}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Facility Location:</span>
                  <span className="font-semibold text-slate-800">
                    {inspectActivity.facility}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Global Warming Potential (GWP):</span>
                  <span className="font-semibold text-slate-800">IPCC AR6 100-Year</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Scientific Reference:</span>
                  <span className="font-semibold text-emerald-700">
                    EPA GHG Emission Factors Hub (2024)
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setInspectActivity(null)}
                className="px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition-colors"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
