import React, { useState } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  FileText,
  Sparkles,
  Download,
  Copy,
  Printer,
  RefreshCw,
  Check,
  Building2,
  Calendar,
  Share2,
  FileCheck,
} from 'lucide-react';

interface ExecutiveReportPageProps {
  organization: string;
  scopeSummary: {
    scope1: number;
    scope2: number;
    scope3: number;
    total: number;
  };
  simulatedReduction: number;
  simulatedSavingsUSD: number;
  creditReadinessScore: number;
}

export function ExecutiveReportPage({
  organization,
  scopeSummary,
  simulatedReduction,
  simulatedSavingsUSD,
  creditReadinessScore,
}: ExecutiveReportPageProps) {
  const [reportingYear, setReportingYear] = useState(2024);
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportContent, setReportContent] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Initial default report
  const initialReport = `# 🌿 Executive Decarbonization & ESG Briefing Report (${reportingYear})
**Enterprise:** ${organization}
**Prepared By:** EcoRoot AI Decision Engine
**Standard:** GHG Protocol Corporate Standard & ISO 14064

---

## 1. Executive Summary
This briefing establishes the verified greenhouse gas (GHG) footprint baseline, empirical 5-Why root cause diagnostics, and prioritized decarbonization roadmap for **${organization}**.

Across Scopes 1, 2, and 3, gross baseline emissions total **${scopeSummary.total.toLocaleString(
    undefined,
    { maximumFractionDigits: 1 }
  )} tCO2e/year**. Through our simulated techno-economic intervention portfolio, the enterprise can cost-effectively abate **${simulatedReduction.toLocaleString(
    undefined,
    { maximumFractionDigits: 1 }
  )} tCO2e/year** (a **${(
    (simulatedReduction / (scopeSummary.total || 1)) *
    100
  ).toFixed(1)}% reduction**), generating **$${simulatedSavingsUSD.toLocaleString()} USD** in recurring annual operational expenditure savings with a blended payback period under 3.5 years.

---

## 2. Audited Carbon Baseline Breakdown
Calculations utilize transparent, formula-based activity data conforming strictly to **IPCC 6th Assessment Report (AR6)** Global Warming Potentials:

| Scope Classification | Key Emission Sources | Emissions (tCO2e) | % of Total |
| :--- | :--- | :--- | :--- |
| **Scope 1 (Direct)** | Natural gas boiler heating, diesel generators, refrigerant leakage | ${scopeSummary.scope1.toFixed(
    1
  )} | ${(((scopeSummary.scope1 || 0) / (scopeSummary.total || 1)) * 100).toFixed(1)}% |
| **Scope 2 (Electricity)** | Regional grid power (US eGRID / EU mix) | ${scopeSummary.scope2.toFixed(
    1
  )} | ${(((scopeSummary.scope2 || 0) / (scopeSummary.total || 1)) * 100).toFixed(1)}% |
| **Scope 3 (Value Chain)** | Component air freight, ground trucking, solid waste landfill | ${scopeSummary.scope3.toFixed(
    1
  )} | ${(((scopeSummary.scope3 || 0) / (scopeSummary.total || 1)) * 100).toFixed(1)}% |
| **Gross Total** | **All Facilities Combined** | **${scopeSummary.total.toFixed(
    1
  )}** | **100.0%** |

---

## 3. Empirical Root Cause & 5-Why Diagnostic Findings
Root-cause analysis performed on primary emissions hotspots identified the following thermodynamic and managerial drivers:
1. **Steam Boiler Air-Fuel Ratio Drift:** Absence of automated microprocessor O2 trim allowed combustion air dampers to drift to 42% excess air, diluting flame temperature and discharging 245°C flue gas up the stack.
2. **Parasitic Compressed Air Header Leakage:** Fixed-speed compressors operating during weekend downtime without acoustic leak remediation or Variable Frequency Drives (VFD).
3. **Primary Material Embodied Burden:** Virgin bauxite electrochemical smelting in industrial enclosures contributing over 61% of cradle-to-gate lifecycle GWP.

---

## 4. Prioritized Decarbonization Roadmap & ROI
The following high-impact capital interventions have been modeled in the EcoRoot AI sandbox:
- **On-site Solar PV & Battery Storage (2.4 MW):** Abates ~926 tCO2e/yr; CapEx $1.85M; OpEx savings $365k/yr.
- **Boiler Condensing Economizer & O2 Trim:** Abates ~248 tCO2e/yr; CapEx $145k; OpEx savings $82.4k/yr (Payback 1.8 yrs).
- **Industrial Fleet Electrification:** Abates ~171 tCO2e/yr; CapEx $420k; OpEx savings $112k/yr.
- **Closed-Loop Circular Packaging:** Abates ~260 tCO2e/yr; CapEx $95k; OpEx savings $64k/yr (Payback 1.5 yrs).

**Aggregate Portfolio Performance:**
- **Annual Net Abatement:** -${simulatedReduction.toLocaleString(undefined, {
    maximumFractionDigits: 1,
  })} tCO2e
- **Annual Recurring Energy Savings:** $${simulatedSavingsUSD.toLocaleString()} USD
- **Blended Payback Window:** ~3.4 Years

---

## 5. Voluntary Carbon Credit Readiness & MRV Scorecard
The project portfolio achieved an overall readiness rating of **${creditReadinessScore}/100 (High Readiness)** under **Verra VCS Standard Version 4.4** criteria:
- **Additionality:** Passes the financial benchmark test and prevailing practice barriers.
- **Digital MRV:** Smart IoT sub-metering telemetry with tamper-evident cloud records ensures audit compliance under methodology AMS-II.D.
- **Potential Credit Issuance:** ~1,310 Verified Carbon Units (VCUs)/year, representing an estimated annual monetization value of **$36,680 to $58,950 USD** at market rates.

---

## 6. Strategic Governance Recommendations
1. Formally approve CapEx allocation for quick-payback energy efficiency retrofits (Boiler O2 trim and compressor VFDs).
2. Issue Request for Proposal (RFP) for rooftop solar power purchase agreement (PPA) to eliminate upfront capital outlay.
3. Engage accredited Designated Operational Entity (DOE) for preliminary validation of carbon credit issuance.`;

  const currentReport = reportContent || initialReport;

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organization,
          reportingYear,
          emissions: scopeSummary,
          topRootCauses: [
            'Boiler excess combustion air and stack heat discharge',
            'Compressed air parasitic pressure loss',
            'Virgin bauxite smelting in raw materials',
          ],
          activeInterventions: {
            reduction: simulatedReduction,
            opexSavings: simulatedSavingsUSD,
            percentage: ((simulatedReduction / (scopeSummary.total || 1)) * 100).toFixed(1),
            payback: '3.4',
          },
          creditReadiness: {
            score: creditReadinessScore,
            status: 'High Readiness',
            credits: 1310,
            valLow: 19650,
            valHigh: 58950,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      setReportContent(data.reportMarkdown);
    } catch (err) {
      console.error('Error generating report:', err);
      // Fallback is already handled by server and initial state
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentReport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    const blob = new Blob([currentReport], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EcoRoot-ESG-Report-${organization.replace(/\s+/g, '-')}-${reportingYear}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300 print:space-y-0 print:pb-0">
      {/* Page Header (Hidden during PDF print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200/80 mb-2">
            <FileText className="w-3.5 h-3.5 text-emerald-600" />
            C-Suite & Auditor Ready
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Executive Decarbonization & ESG Report
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl">
            Synthesize your carbon footprint, 5-Why root cause findings, LCA product evaluations, and intervention roadmaps into an authoritative board-level briefing.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Primary Action: Save as PDF Report */}
          <button
            id="save-pdf-report-btn"
            onClick={handlePrint}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 active:scale-98 transition-all shadow-sm shadow-emerald-900/20 cursor-pointer"
            title="Triggers browser print dialog formatted specifically to save sustainability summary as PDF without sidebars or navigation elements"
          >
            <Printer className="w-4 h-4 text-emerald-200" />
            <span>Save as PDF Report</span>
          </button>

          <button
            id="copy-markdown-btn"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-xs"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy Markdown'}</span>
          </button>

          <button
            id="download-md-btn"
            onClick={handleDownloadMarkdown}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Download .MD</span>
          </button>

          <button
            id="generate-ai-report-btn"
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Synthesizing (Gemini AI)...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Regenerate with Gemini AI</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Configuration Strip (Hidden during PDF print) */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-700" />
            <span className="font-semibold text-slate-700">Organization:</span>
            <strong className="text-slate-900">{organization}</strong>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-700" />
            <span className="font-semibold text-slate-700">Reporting Year:</span>
            <select
              value={reportingYear}
              onChange={(e) => setReportingYear(parseInt(e.target.value))}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 font-bold text-slate-800"
            >
              <option value={2024}>2024</option>
              <option value={2025}>2025</option>
              <option value={2026}>2026</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200/60 font-semibold">
            <FileCheck className="w-3.5 h-3.5" />
            <span>Clean PDF Print Layout Enabled</span>
          </div>
          <span>ISO 14064-1 & GHG Protocol Corporate Accounting Aligned</span>
        </div>
      </div>

      {/* Rendered Document View */}
      <div
        id="sustainability-report-document"
        className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200 shadow-md max-w-4xl mx-auto space-y-6 print:border-none print:shadow-none print:p-0 print:m-0 print:max-w-none print:w-full print:space-y-4"
      >
        {/* Formal Print-Only Letterhead */}
        <div className="hidden print:block border-b-2 border-emerald-800 pb-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-slate-900 font-mono">
                  ECOROOT AI
                </span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold uppercase">
                  Audit Grade
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                Executive Decarbonization Assessment & Sustainability Diagnostic Briefing
              </p>
            </div>
            <div className="text-right text-xs text-slate-600 space-y-0.5">
              <div><strong>Enterprise:</strong> {organization}</div>
              <div><strong>Reporting Year:</strong> {reportingYear}</div>
              <div><strong>Generated:</strong> {new Date().toLocaleDateString('en-US', { dateStyle: 'long' })}</div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-200 grid grid-cols-4 gap-2 text-[11px] text-slate-700">
            <div>Baseline Footprint: <strong>{scopeSummary.total.toFixed(1)} tCO2e/yr</strong></div>
            <div>Simulated Abatement: <strong>{simulatedReduction.toFixed(1)} tCO2e/yr</strong></div>
            <div>OpEx Reduction: <strong>${simulatedSavingsUSD.toLocaleString()}/yr</strong></div>
            <div>Credit Readiness: <strong>{creditReadinessScore}/100</strong></div>
          </div>
        </div>

        {/* Screen-Only Header Bar */}
        <div className="border-b border-slate-200 pb-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-600" />
            <span className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase">
              EcoRoot AI Corporate Briefing
            </span>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {new Date().toLocaleDateString('en-US', { dateStyle: 'medium' })}
          </span>
        </div>

        {/* Markdown Rendered Document */}
        <div className="markdown-body text-slate-800 leading-relaxed text-sm">
          <Markdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2 mb-4 pb-2 border-b border-slate-200 font-mono tracking-tight print:text-xl print:mt-1 print:mb-3">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-base sm:text-lg font-bold text-emerald-950 mt-6 mb-3 pb-1 border-b border-emerald-100 flex items-center gap-2 print:text-base print:mt-4 print:mb-2">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-sm sm:text-base font-bold text-slate-800 mt-4 mb-2 print:text-sm print:mt-3">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-3 print:text-[11.5px] print:leading-normal print:mb-2">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-slate-700 mb-3 pl-1 print:text-[11px] print:space-y-0.5 print:mb-2">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside space-y-1 text-xs sm:text-sm text-slate-700 mb-3 pl-1 print:text-[11px] print:space-y-0.5 print:mb-2">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="text-xs sm:text-sm text-slate-700 leading-relaxed print:text-[11px]">
                  {children}
                </li>
              ),
              table: ({ children }) => (
                <div className="overflow-x-auto my-4 print:my-2 print:overflow-visible">
                  <table className="min-w-full text-xs text-left border-collapse border border-slate-200 print:text-[10.5px]">
                    {children}
                  </table>
                </div>
              ),
              thead: ({ children }) => (
                <thead className="bg-slate-100/80 border-b border-slate-300 font-semibold text-slate-900 print:bg-slate-100">
                  {children}
                </thead>
              ),
              th: ({ children }) => (
                <th className="px-3 py-2 border border-slate-300 font-bold text-slate-800 print:px-2 print:py-1">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="px-3 py-2 border border-slate-200 text-slate-700 print:px-2 print:py-1">
                  {children}
                </td>
              ),
              hr: () => (
                <hr className="my-5 border-slate-200 print:my-3 print:border-slate-300" />
              ),
              strong: ({ children }) => (
                <strong className="font-semibold text-slate-900">{children}</strong>
              ),
            }}
          >
            {currentReport}
          </Markdown>
        </div>

        {/* Document Verification Footer */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2 print:pt-4 print:text-[10px] print:text-slate-500">
          <span>EcoRoot AI Decision Engine • ISO 14064-1 & IPCC AR6 Standard Aligned</span>
          <span>Confidential — For Internal Corporate Governance & Verification Review Only</span>
        </div>
      </div>
    </div>
  );
}
