import React from 'react';
import {
  LayoutDashboard,
  GitFork,
  Calculator,
  Layers,
  Sliders,
  Award,
  FileText,
  Database,
  Sprout,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export type PageId =
  | 'landing'
  | 'root-cause'
  | 'calculator'
  | 'lca'
  | 'simulation'
  | 'credits'
  | 'report'
  | 'database';

interface SidebarProps {
  currentPage: PageId;
  onSelectPage: (page: PageId) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onOpenGlossary: () => void;
}

export function Sidebar({
  currentPage,
  onSelectPage,
  isOpenMobile,
  onCloseMobile,
  onOpenGlossary,
}: SidebarProps) {
  const navigationItems = [
    {
      id: 'landing' as PageId,
      name: 'Overview & Platform',
      icon: LayoutDashboard,
      badge: 'Start',
    },
    {
      id: 'root-cause' as PageId,
      name: 'Root Cause & 5-Why',
      icon: GitFork,
      badge: 'AI Diagnostic',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    },
    {
      id: 'calculator' as PageId,
      name: 'Carbon Footprint & Math',
      icon: Calculator,
      badge: 'Transparent',
    },
    {
      id: 'lca' as PageId,
      name: 'Life Cycle Assessment (LCA)',
      icon: Layers,
      badge: 'ISO 14044',
    },
    {
      id: 'simulation' as PageId,
      name: 'Intervention Simulator',
      icon: Sliders,
      badge: 'What-If',
    },
    {
      id: 'credits' as PageId,
      name: 'Carbon Credit Readiness',
      icon: Award,
      badge: 'MRV / VCU',
    },
    {
      id: 'report' as PageId,
      name: 'Executive ESG Report',
      icon: FileText,
      badge: 'AI Export',
    },
    {
      id: 'database' as PageId,
      name: 'Supabase DB & Factors',
      icon: Database,
      badge: 'SQL / API',
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden print:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Main Sidebar */}
      <aside
        id="app-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-40 w-72 flex flex-col bg-slate-950 text-slate-200 border-r border-emerald-950/60 transition-transform duration-300 ease-in-out lg:translate-x-0 print:hidden ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="px-6 py-5 border-b border-emerald-900/40 flex items-center gap-3 bg-gradient-to-r from-emerald-950/90 to-slate-950">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-md shadow-emerald-900/40">
            <Sprout className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-extrabold tracking-tight text-white font-mono">EcoRoot</span>
              <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                AI
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium leading-tight">
              Sustainable Decision Engine
            </p>
          </div>
        </div>

        {/* Navigation List */}
        <div className="flex-1 px-4 py-5 overflow-y-auto space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Analytical Modules
          </div>

          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => {
                  onSelectPage(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
                    : 'text-slate-300 hover:text-white hover:bg-emerald-950/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-white' : 'text-emerald-400 group-hover:text-emerald-300'
                    }`}
                  />
                  <span>{item.name}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded-md font-mono border ${
                      isActive
                        ? 'bg-white/20 text-white border-white/20'
                        : item.badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Knowledge & Standards Callout */}
        <div className="p-4 border-t border-emerald-900/40 bg-emerald-950/30">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-emerald-800/40 space-y-2.5">
            <div className="flex items-center justify-between text-xs text-emerald-400 font-medium">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Audit Compliance
              </span>
              <span className="text-[10px] text-slate-400 font-mono">ISO 14064</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-snug">
              Scientifically verified formulas. AI strictly powers 5-Why root diagnostics and recommendations.
            </p>
            <button
              id="sidebar-glossary-btn"
              onClick={onOpenGlossary}
              className="w-full flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-emerald-900/50 hover:bg-emerald-800/60 text-emerald-200 transition-colors border border-emerald-700/40"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              Technical Glossary
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
