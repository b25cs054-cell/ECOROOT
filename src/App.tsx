import React, { useState } from 'react';
import { Sidebar, PageId } from './components/layout/Sidebar';
import { TopNav } from './components/layout/TopNav';
import { GlossaryModal } from './components/layout/GlossaryModal';

// Pages
import { LandingOverview } from './components/pages/LandingOverview';
import { RootCausePage } from './components/pages/RootCausePage';
import { CarbonCalculatorPage } from './components/pages/CarbonCalculatorPage';
import { LcaPage } from './components/pages/LcaPage';
import { InterventionSimulatorPage } from './components/pages/InterventionSimulatorPage';
import { CarbonCreditPage } from './components/pages/CarbonCreditPage';
import { ExecutiveReportPage } from './components/pages/ExecutiveReportPage';
import { DatabaseSettingsPage } from './components/pages/DatabaseSettingsPage';

// Data & Types
import {
  INITIAL_ACTIVITIES,
  INITIAL_INTERVENTIONS,
  DEFAULT_EMISSION_FACTORS,
  SAMPLE_CARBON_CREDIT_READINESS,
} from './data/mockData';
import { ActivityData, EmissionFactor, InterventionScenario } from './types';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('landing');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);

  const [organization, setOrganization] = useState('Titan Precision Manufacturing Ltd.');
  const [emissionFactors, setEmissionFactors] = useState<EmissionFactor[]>(DEFAULT_EMISSION_FACTORS);
  const [activities, setActivities] = useState<ActivityData[]>(INITIAL_ACTIVITIES);
  const [interventions, setInterventions] = useState<InterventionScenario[]>(INITIAL_INTERVENTIONS);

  // Carbon metrics calculation
  const scope1 = activities
    .filter((a) => a.scope === 'scope1')
    .reduce((sum, a) => sum + a.calculatedEmissions, 0);
  const scope2 = activities
    .filter((a) => a.scope === 'scope2')
    .reduce((sum, a) => sum + a.calculatedEmissions, 0);
  const scope3 = activities
    .filter((a) => a.scope === 'scope3')
    .reduce((sum, a) => sum + a.calculatedEmissions, 0);
  const totalEmissions = scope1 + scope2 + scope3;

  // Simulation metrics
  const activeInterventions = interventions.filter((i) => i.activeInSimulation);
  const simulatedReductionTCO2e = activeInterventions.reduce(
    (sum, item) => sum + item.annualTCO2eReduction * (item.scalePercentage / 100),
    0
  );
  const simulatedSavingsUSD = activeInterventions.reduce(
    (sum, item) => sum + item.annualOpexSavingsUSD * (item.scalePercentage / 100),
    0
  );
  const simulatedReductionPercent = Number(
    ((simulatedReductionTCO2e / (totalEmissions || 1)) * 100).toFixed(1)
  );

  // Activity management
  const handleAddActivity = (newAct: ActivityData) => {
    setActivities((prev) => [newAct, ...prev]);
  };

  const handleDeleteActivity = (id: string) => {
    setActivities((prev) => prev.filter((a) => a.id !== id));
  };

  const handleUpdateQuantity = (id: string, qty: number) => {
    setActivities((prev) =>
      prev.map((act) => {
        if (act.id !== id) return act;
        const factorObj = emissionFactors.find((f) => f.id === act.factorId);
        const factor = factorObj ? factorObj.factor : 0;
        const newCalc = Number((qty * factor).toFixed(4));
        return {
          ...act,
          quantity: qty,
          calculatedEmissions: newCalc,
          formulaDisplay: `${qty.toLocaleString()} ${act.unit} × ${factor} tCO2e/${act.unit} = ${newCalc.toFixed(2)} tCO2e`,
        };
      })
    );
  };

  // Emission factor adjustments
  const handleUpdateFactor = (id: string, newFactorValue: number) => {
    setEmissionFactors((prev) =>
      prev.map((ef) => (ef.id === id ? { ...ef, factor: newFactorValue } : ef))
    );
    // Recalculate dependent activities
    setActivities((prev) =>
      prev.map((act) => {
        if (act.factorId !== id) return act;
        const newCalc = Number((act.quantity * newFactorValue).toFixed(4));
        return {
          ...act,
          calculatedEmissions: newCalc,
          formulaDisplay: `${act.quantity.toLocaleString()} ${act.unit} × ${newFactorValue} tCO2e/${act.unit} = ${newCalc.toFixed(2)} tCO2e`,
        };
      })
    );
  };

  const handleResetFactors = () => {
    setEmissionFactors(DEFAULT_EMISSION_FACTORS);
    setActivities(INITIAL_ACTIVITIES);
  };

  // Intervention simulation controls
  const handleToggleIntervention = (id: string) => {
    setInterventions((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, activeInSimulation: !item.activeInSimulation } : item
      )
    );
  };

  const handleUpdateScale = (id: string, scale: number) => {
    setInterventions((prev) =>
      prev.map((item) => (item.id === id ? { ...item, scalePercentage: scale } : item))
    );
  };

  const handleAddCustomIntervention = (scenario: InterventionScenario) => {
    setInterventions((prev) => [scenario, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans antialiased selection:bg-emerald-100 selection:text-emerald-900 print:bg-white print:min-h-0 print:block">
      {/* Top Application Header */}
      <TopNav
        currentPage={currentPage}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        onOpenGlossary={() => setIsGlossaryOpen(true)}
        selectedOrg={organization}
        onChangeOrg={setOrganization}
        totalEmissions={totalEmissions}
        simulatedReductionPercent={simulatedReductionPercent}
        creditReadinessScore={SAMPLE_CARBON_CREDIT_READINESS.overallScore}
      />

      {/* Main Layout Container */}
      <div className="flex-1 flex overflow-hidden print:block print:overflow-visible">
        {/* Navigation Sidebar */}
        <Sidebar
          currentPage={currentPage}
          onSelectPage={(page) => setCurrentPage(page)}
          isOpenMobile={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
          onOpenGlossary={() => setIsGlossaryOpen(true)}
        />

        {/* Dynamic Page Content Viewport */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 max-w-7xl mx-auto w-full print:p-0 print:m-0 print:max-w-none print:w-full print:overflow-visible">
          {currentPage === 'landing' && (
            <LandingOverview
              onNavigate={(page) => setCurrentPage(page)}
              scopeSummary={{
                scope1,
                scope2,
                scope3,
                total: totalEmissions,
              }}
              activeReductionTCO2e={simulatedReductionTCO2e}
              totalCostSavingsUSD={simulatedSavingsUSD}
              creditReadinessScore={SAMPLE_CARBON_CREDIT_READINESS.overallScore}
            />
          )}

          {currentPage === 'root-cause' && (
            <RootCausePage
              onOpenGlossary={() => setIsGlossaryOpen(true)}
              onAddIntervention={handleAddCustomIntervention}
            />
          )}

          {currentPage === 'calculator' && (
            <CarbonCalculatorPage
              activities={activities}
              emissionFactors={emissionFactors}
              onAddActivity={handleAddActivity}
              onDeleteActivity={handleDeleteActivity}
              onUpdateQuantity={handleUpdateQuantity}
              onOpenGlossary={() => setIsGlossaryOpen(true)}
            />
          )}

          {currentPage === 'lca' && (
            <LcaPage onOpenGlossary={() => setIsGlossaryOpen(true)} />
          )}

          {currentPage === 'simulation' && (
            <InterventionSimulatorPage
              interventions={interventions}
              onToggleIntervention={handleToggleIntervention}
              onUpdateScale={handleUpdateScale}
              onAddCustomIntervention={handleAddCustomIntervention}
              baselineTotalEmissions={totalEmissions}
              onOpenGlossary={() => setIsGlossaryOpen(true)}
            />
          )}

          {currentPage === 'credits' && (
            <CarbonCreditPage
              creditData={SAMPLE_CARBON_CREDIT_READINESS}
              onOpenGlossary={() => setIsGlossaryOpen(true)}
            />
          )}

          {currentPage === 'report' && (
            <ExecutiveReportPage
              organization={organization}
              scopeSummary={{
                scope1,
                scope2,
                scope3,
                total: totalEmissions,
              }}
              simulatedReduction={simulatedReductionTCO2e}
              simulatedSavingsUSD={simulatedSavingsUSD}
              creditReadinessScore={SAMPLE_CARBON_CREDIT_READINESS.overallScore}
            />
          )}

          {currentPage === 'database' && (
            <DatabaseSettingsPage
              emissionFactors={emissionFactors}
              onUpdateFactor={handleUpdateFactor}
              onResetFactors={handleResetFactors}
              onOpenGlossary={() => setIsGlossaryOpen(true)}
            />
          )}
        </main>
      </div>

      {/* ISO & GHG Protocol Glossary Modal */}
      <GlossaryModal isOpen={isGlossaryOpen} onClose={() => setIsGlossaryOpen(false)} />
    </div>
  );
}
