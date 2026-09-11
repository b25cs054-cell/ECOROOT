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
  ShieldCheck,
  X,
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

interface NavGroup {
  label: string;
  items: {
    id: PageId;
    name: string;
    icon: React.ElementType;
    badge?: string;
    badgeColor?: string;
  }[];
}

export function Sidebar({
  currentPage,
  onSelectPage,
  isOpenMobile,
  onCloseMobile,
  onOpenGlossary,
}: SidebarProps) {
  const navigationGroups: NavGroup[] = [
    {
      label: 'Core Diagnostics',
      items: [
        {
          id: 'landing',
          name: 'Platform Overview',
          icon: LayoutDashboard,
          badge: 'Executive',
        },
        {
          id: 'root-cause',
          name: 'AI 5-Why Diagnostics',
          icon: GitFork,
          badge: 'Root Cause',
          badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        },
      ],
    },
    {
      label: 'Footprint & Life Cycle',
      items: [
        {
          id: 'calculator',
          name: 'GHG Scope Calculator',
          icon: Calculator,
          badge: 'Scopes 1-3',
        },
        {
          id: 'lca',
          name: 'Life Cycle Assessment',
          icon: Layers,
          badge: 'ISO 14044',
        },
      ],
    },
    {
      label: 'Abatement & Offsets',
      items: [
        {
          id: 'simulation',
          name: 'Intervention Simulator',
          icon: Sliders,
          badge: 'MACC',
        },
        {
          id: 'credits',
          name: 'Carbon Credit & MRV',
          icon: Award,
          badge: 'Verra / VCS',
        },
      ],
    },
    {
      label: 'Audit & Infrastructure',
      items: [
        {
          id: 'report',
          name: 'Executive ESG Report',
          icon: FileText,
          badge: 'C-Suite',
        },
        {
          id: 'database',
          name: 'Supabase DB & Factors',
          icon: Database,
          badge: 'SQL / API',
        },
      ],
    },
  ];

  return (
    <>
      {/* Mobile backdrop overlay */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden print:hidden transition-opacity"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar */}
      <aside
        id="app-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-40 w-72 flex flex-col bg-slate-950 text-slate-200 border-r border-emerald-950/70 shadow-2xl transition-transform duration-300 ease-in-out lg:translate-x-0 print:hidden ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="px-5 py-4.5 border-b border-emerald-900/40 flex items-center justify-between bg-gradient-to-r from-emerald-950/90 to-slate-950 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-md shadow-emerald-900/40 shrink-0">
              <Sprout className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold tracking-tight text-white font-mono">EcoRoot</span>
                <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  AI
                </span>
              </div>
              <p className="text-[10.5px] text-slate-400 font-medium leading-tight">
                Sustainable Decision Engine
              </p>
            </div>
          </div>

          {/* Close button on mobile */}
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 lg:hidden cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation List with clean styling */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-5 scrollbar-thin">
          {navigationGroups.map((group) => (
            <div key={group.label} className="space-y-1">
              <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-emerald-500/80 font-mono">
                {group.label}
              </div>

              {group.items.map((item) => {
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
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group cursor-pointer ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
                        : 'text-slate-300 hover:text-white hover:bg-emerald-950/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive ? 'text-white' : 'text-emerald-400 group-hover:text-emerald-300'
                        }`}
                      />
                      <span className="truncate text-left">{item.name}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded-md font-mono border shrink-0 ml-1.5 ${
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
          ))}
        </nav>

        {/* Knowledge & Standards Footer Callout */}
        <div className="p-3.5 border-t border-emerald-900/40 bg-emerald-950/40 shrink-0">
          <div className="p-3 rounded-xl bg-slate-900/90 border border-emerald-800/40 space-y-2">
            <div className="flex items-center justify-between text-xs text-emerald-400 font-medium">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                Audit Compliance
              </span>
              <span className="text-[10px] text-slate-400 font-mono">ISO 14064-1</span>
            </div>
            <p className="text-[10.5px] text-slate-400 leading-snug">
              Empirical GHG & LCA calculations. AI strictly powers 5-Why root cause diagnostics.
            </p>
            <button
              id="sidebar-glossary-btn"
              onClick={onOpenGlossary}
              className="w-full flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-900/60 hover:bg-emerald-800/70 text-emerald-200 transition-colors border border-emerald-700/50 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Technical Glossary</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
