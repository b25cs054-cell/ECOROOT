import { useState } from 'react';
import { X, Search, BookOpen, ExternalLink, HelpCircle } from 'lucide-react';
import { TECHNICAL_GLOSSARY } from '../../data/mockData';

interface GlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSearch?: string;
}

export function GlossaryModal({ isOpen, onClose, defaultSearch = '' }: GlossaryModalProps) {
  const [searchTerm, setSearchTerm] = useState(defaultSearch);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  if (!isOpen) return null;

  const categories = ['All', 'GHG Protocol', 'ISO Standard', 'Climate Science', 'Carbon Markets', 'Compliance', 'Economics'];

  const filteredItems = TECHNICAL_GLOSSARY.filter((item) => {
    const matchesSearch =
      item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.definition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 print:hidden">
      <div 
        id="glossary-modal-container"
        className="relative w-full max-w-2xl max-h-[85vh] flex flex-col bg-white rounded-2xl shadow-2xl border border-emerald-100 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-emerald-100 bg-emerald-50/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-600 text-white shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">Technical Glossary & Standards</h3>
              <p className="text-xs text-slate-600">GHG Protocol, ISO 14040/14044, and Carbon Credit verification definitions</p>
            </div>
          </div>
          <button
            id="close-glossary-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-emerald-100/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Categories */}
        <div className="p-5 border-b border-slate-100 bg-white space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="glossary-search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search terms, standards, or acronyms (e.g. Scope 1, LCA, Additionality)..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* List of definitions */}
        <div className="overflow-y-auto p-6 space-y-4 divide-y divide-slate-100">
          {filteredItems.length === 0 ? (
            <div className="text-center py-10 text-slate-500">
              <HelpCircle className="w-8 h-8 mx-auto text-slate-400 mb-2" />
              <p className="text-sm">No matching definitions found for "{searchTerm}".</p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div key={item.term} className="pt-4 first:pt-0">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <h4 className="text-base font-semibold text-emerald-900">{item.term}</h4>
                  <span className="px-2 py-0.5 text-[11px] font-medium tracking-wide uppercase rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200/60">
                    {item.category}
                  </span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{item.definition}</p>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Standards referenced: GHG Protocol Corporate Standard, ISO 14044, Verra VCS 4.4</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 transition-colors"
          >
            Close Glossary
          </button>
        </div>
      </div>
    </div>
  );
}
