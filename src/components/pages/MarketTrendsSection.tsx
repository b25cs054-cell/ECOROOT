import React, { useState, useEffect } from 'react';
import {
  Search,
  Globe,
  TrendingUp,
  ExternalLink,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Award,
  Factory,
  Zap,
  ArrowRight,
  Sliders,
  GitFork,
  FileCheck,
  Clock,
  CheckCircle2,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { MarketTrendsResponse, MarketTrendItem, GroundingSource } from '../../types';
import { PageId } from '../layout/Sidebar';

interface MarketTrendsSectionProps {
  onNavigate: (page: PageId) => void;
}

type TopicId = 'all' | 'carbon-credits' | 'sustainable-manufacturing' | 'cbam-policy' | 'industrial-tech';

export function MarketTrendsSection({ onNavigate }: MarketTrendsSectionProps) {
  const [selectedTopic, setSelectedTopic] = useState<TopicId>('all');
  const [trendsData, setTrendsData] = useState<MarketTrendsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [showSources, setShowSources] = useState<boolean>(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const topics: { id: TopicId; label: string; icon: React.ElementType }[] = [
    { id: 'all', label: 'All Market Intel', icon: Globe },
    { id: 'carbon-credits', label: 'Carbon Credits & Pricing', icon: Award },
    { id: 'sustainable-manufacturing', label: 'Sustainable Manufacturing', icon: Factory },
    { id: 'cbam-policy', label: 'EU CBAM & Regulations', icon: ShieldCheck },
    { id: 'industrial-tech', label: 'Industrial Tech & Decarb', icon: Zap },
  ];

  const fetchTrends = async (topic: TopicId, forceRefresh = false) => {
    try {
      if (forceRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setErrorNotice(null);

      const res = await fetch(`/api/market-trends?topic=${topic}${forceRefresh ? '&refresh=true' : ''}`);
      if (!res.ok) {
        throw new Error(`Failed to load market trends (${res.status})`);
      }
      const data: MarketTrendsResponse = await res.json();
      setTrendsData(data);
    } catch (err: any) {
      console.error('Error fetching market trends:', err);
      setErrorNotice(err.message || 'Could not connect to market trends service.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTrends(selectedTopic, false);
  }, [selectedTopic]);

  const handleRefresh = () => {
    fetchTrends(selectedTopic, true);
  };

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'Carbon Credits':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'Sustainable Manufacturing':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Policy & CBAM':
        return 'bg-sky-50 text-sky-800 border-sky-200';
      case 'Industrial Technology':
        return 'bg-indigo-50 text-indigo-800 border-indigo-200';
      case 'Renewable Energy':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getActionTarget = (item: MarketTrendItem): { label: string; page: PageId; icon: React.ElementType } | null => {
    const text = (item.title + ' ' + item.summary + ' ' + item.impactOnManufacturing).toLowerCase();
    if (text.includes('boiler') || text.includes('heat pump') || text.includes('compressed air') || text.includes('vfd')) {
      return { label: 'Model in Simulator', page: 'simulation', icon: Sliders };
    }
    if (text.includes('credit') || text.includes('vcs') || text.includes('verra') || text.includes('offset')) {
      return { label: 'Audit Credit MRV', page: 'credits', icon: Award };
    }
    if (text.includes('root cause') || text.includes('steam') || text.includes('leakage')) {
      return { label: 'Run 5-Why Analysis', page: 'root-cause', icon: GitFork };
    }
    if (text.includes('lca') || text.includes('product carbon') || text.includes('pcf') || text.includes('embodied')) {
      return { label: 'Calculate Product LCA', page: 'lca', icon: FileCheck };
    }
    return { label: 'Intervention Sandbox', page: 'simulation', icon: Sliders };
  };

  return (
    <section id="landing-market-trends-section" className="space-y-6 pt-2">
      {/* Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
              <TrendingUp className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 font-mono">
              Live Market Intelligence
            </span>
            {trendsData && (
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                  trendsData.isLiveGrounded
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : 'bg-slate-100 text-slate-700 border-slate-300'
                }`}
              >
                <Sparkles className="w-3 h-3 text-emerald-600" />
                <span>{trendsData.isLiveGrounded ? 'Google Search Grounded' : 'Verified Industry Intel'}</span>
              </span>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Market Trends & Regulatory Pulse
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-3xl">
            Real-time industry briefings on industrial decarbonization, voluntary carbon credit premiums, EU CBAM mandates, and verified energy efficiency breakthroughs.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            id="refresh-market-trends-btn"
            onClick={handleRefresh}
            disabled={refreshing || loading}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-emerald-400 text-slate-700 hover:text-emerald-800 text-xs font-semibold shadow-2xs hover:shadow-xs transition-all disabled:opacity-50 cursor-pointer"
            title="Query Google Search for latest news"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-emerald-600' : 'text-slate-500'}`} />
            <span>{refreshing ? 'Searching Google...' : 'Refresh Live Intel'}</span>
          </button>

          {trendsData?.groundingSources && trendsData.groundingSources.length > 0 && (
            <button
              id="toggle-grounding-sources-btn"
              onClick={() => setShowSources(!showSources)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-emerald-600" />
              <span>{showSources ? 'Hide Grounding Sources' : `Sources (${trendsData.groundingSources.length})`}</span>
              {showSources ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>

      {/* Topic Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
        {topics.map((t) => {
          const Icon = t.icon;
          const isSelected = selectedTopic === t.id;
          return (
            <button
              key={t.id}
              id={`topic-tab-${t.id}`}
              onClick={() => setSelectedTopic(t.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Grounding Sources Tray (when toggled) */}
      {showSources && trendsData?.groundingSources && (
        <div className="p-4 rounded-2xl bg-emerald-950/95 text-white border border-emerald-800 shadow-md space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Google Search Grounding Citations & Queries
              </h4>
            </div>
            <span className="text-[11px] text-emerald-300">
              Updated: {trendsData.lastUpdated}
            </span>
          </div>

          {trendsData.searchQueries && trendsData.searchQueries.length > 0 && (
            <div className="flex flex-wrap gap-1.5 items-center text-[11px]">
              <span className="text-slate-300 font-medium">Grounding Queries:</span>
              {trendsData.searchQueries.map((q, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 rounded-md bg-emerald-900/80 text-emerald-200 border border-emerald-700/50 font-mono text-[10px]"
                >
                  "{q}"
                </span>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
            {trendsData.groundingSources.map((source: GroundingSource, idx: number) => (
              <a
                key={idx}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-black/40 hover:bg-emerald-900/60 border border-emerald-800/60 hover:border-emerald-500 text-xs transition-all flex items-start justify-between gap-2 group"
              >
                <div className="space-y-0.5 min-w-0">
                  <p className="font-semibold text-emerald-100 text-[11px] line-clamp-1 group-hover:text-white">
                    {source.title}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate font-mono">
                    {source.url.replace(/^https?:\/\//, '')}
                  </p>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-emerald-400 shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Macro Indicators & Executive Market Pulse */}
      {trendsData?.marketMetrics && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">EU ETS Carbon Benchmark</span>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono">
              {trendsData.marketMetrics.euEtsPrice}
            </div>
            <div className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>{trendsData.marketMetrics.euEtsChange}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">VCM Tech Removals</span>
            <div className="text-xl sm:text-2xl font-extrabold text-teal-800 font-mono">
              {trendsData.marketMetrics.vcmTechRemovalPrice}
            </div>
            <div className="text-[11px] text-slate-500">
              ICVCM Core Carbon Principles Approved
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">EU CBAM Status</span>
            <div className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
              {trendsData.marketMetrics.cbamStatus}
            </div>
            <div className="text-[11px] text-amber-700 font-semibold">
              Primary Factor Audit Mandated
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Clean Tech Investment</span>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono">
              {trendsData.marketMetrics.cleanTechInvestment}
            </div>
            <div className="text-[11px] text-slate-500">
              Global Manufacturing Electrification
            </div>
          </div>
        </div>
      )}

      {/* Regulatory Spotlight Alert Banner */}
      {trendsData?.regulatorySpotlight && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-50 via-amber-100/50 to-emerald-50 border border-amber-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-800 shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-200 text-amber-900 font-mono">
                  Regulatory Mandate Alert
                </span>
                <span className="text-xs font-semibold text-slate-600">
                  {trendsData.regulatorySpotlight.timeline}
                </span>
              </div>
              <h4 className="text-sm sm:text-base font-bold text-slate-900">
                {trendsData.regulatorySpotlight.title}
              </h4>
              <p className="text-xs text-slate-700 max-w-3xl leading-relaxed">
                <strong className="text-slate-900 font-semibold">Required Action: </strong>
                {trendsData.regulatorySpotlight.complianceAction}
              </p>
            </div>
          </div>

          <button
            id="regulatory-action-btn"
            onClick={() => onNavigate('calculator')}
            className="shrink-0 flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
          >
            <span>Verify Emissions Factors</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 animate-pulse">
              <div className="flex justify-between">
                <div className="w-24 h-5 bg-slate-200 rounded-md" />
                <div className="w-16 h-5 bg-slate-100 rounded-md" />
              </div>
              <div className="w-3/4 h-6 bg-slate-200 rounded-md" />
              <div className="w-full h-12 bg-slate-100 rounded-md" />
              <div className="w-full h-16 bg-slate-100 rounded-xl" />
            </div>
          ))}
        </div>
      )}

      {/* Error state if any */}
      {!loading && errorNotice && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-rose-600" />
            <span>{errorNotice}</span>
          </div>
          <button
            onClick={() => fetchTrends(selectedTopic, true)}
            className="font-bold underline text-rose-900 hover:text-rose-950"
          >
            Retry
          </button>
        </div>
      )}

      {/* News & Intelligence Cards Grid */}
      {!loading && trendsData?.items && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {trendsData.items.map((item) => {
            const action = getActionTarget(item);
            const ActionIcon = action ? action.icon : Sliders;

            return (
              <div
                key={item.id}
                id={`market-trend-card-${item.id}`}
                className="group p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between space-y-4"
              >
                {/* Header: Category, Date, Metric */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border font-mono ${getCategoryBadgeClass(
                        item.category
                      )}`}
                    >
                      {item.category}
                    </span>

                    <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {item.date}
                    </span>
                  </div>

                  {/* Headline & Link */}
                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-800 transition-colors leading-snug">
                      {item.title}
                    </h3>

                    {/* Source badge */}
                    <div className="pt-1.5 flex items-center gap-1 text-[11px] text-slate-500">
                      <span className="font-semibold text-slate-700">{item.sourceName}</span>
                      {item.sourceUrl && (
                        <a
                          href={item.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-0.5 text-emerald-700 hover:text-emerald-900 hover:underline ml-1"
                          title="Open verified source link"
                        >
                          <span>Article</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Summary */}
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.summary}
                  </p>

                  {/* Operational Takeaway for Manufacturing */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-700 uppercase tracking-wider font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Impact on Manufacturers</span>
                    </div>
                    <p className="text-[11px] text-slate-700 leading-relaxed">
                      {item.impactOnManufacturing}
                    </p>
                  </div>
                </div>

                {/* Footer: Key Metric, Tags & Action */}
                <div className="pt-2 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-emerald-800 font-mono bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/80">
                      {item.keyMetric}
                    </span>

                    {action && (
                      <button
                        onClick={() => onNavigate(action.page)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-900 group-hover:translate-x-0.5 transition-all cursor-pointer"
                      >
                        <ActionIcon className="w-3.5 h-3.5" />
                        <span>{action.label}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Tags */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {item.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
