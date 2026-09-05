import React, { useState } from 'react';
import { LEGAL_METROLOGY_RULES } from '../data/rulesData';
import { useInspection } from '../context/InspectionContext';
import {
  Search,
  ExternalLink,
  Table
} from 'lucide-react';

export const RulesReferenceView: React.FC = () => {
  const { setSelectedRuleForModal } = useInspection();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const categories = [
    'ALL',
    'Mandatory Declaration',
    'Font Size & Readability',
    'MRP & Pricing',
    'Net Quantity',
    'Consumer Grievance'
  ];

  const filteredRules = LEGAL_METROLOGY_RULES.filter((rule) => {
    if (selectedCategory !== 'ALL' && rule.category !== selectedCategory) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      rule.ruleNumber.toLowerCase().includes(q) ||
      rule.title.toLowerCase().includes(q) ||
      rule.description.toLowerCase().includes(q) ||
      rule.id.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4 pb-8">
      {/* View Header */}
      <div className="p-4 border-b border-slate-200 bg-white rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shrink-0 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">
              Legal Metrology (Packaged Commodities) Rules, 2011
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
              Statutory Reference Guide
            </span>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Official statutory handbook for mandatory packaging declarations, Schedule II font size standards, and Section 36 penalties.
          </p>
        </div>
      </div>

      {/* Search and Category Filters */}
      <div className="bg-white rounded-lg border border-slate-200 p-3 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 text-xs">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search rules, sections, or keywords (e.g. font size, MRP, address)..."
            className="w-full pl-8 pr-3 py-1.5 rounded border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white font-bold shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Schedule II Font Height Reference Table */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-2xs space-y-2.5">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-xs">
          <Table className="w-3.5 h-3.5 text-indigo-600" />
          <span>SCHEDULE II (Rule 9): Minimum Height of Numerals & Letters</span>
        </div>
        <p className="text-[11px] text-slate-500 font-mono">
          Applicable to rectangular packaging Principal Display Panel (PDP) and net weight declarations:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200 rounded">
            <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-bold border-b border-slate-200 font-mono">
              <tr>
                <th className="p-2">Net Quantity / Area of PDP</th>
                <th className="p-2">Minimum Height (Normal Case)</th>
                <th className="p-2">Minimum Height (Blown/Formed)</th>
                <th className="p-2">Statutory Standard</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[11px]">
              <tr className="hover:bg-slate-50">
                <td className="p-2 font-medium">Up to 50 g / ml (or PDP ≤ 50 sq cm)</td>
                <td className="p-2 font-mono font-bold text-slate-800">1.0 mm</td>
                <td className="p-2 font-mono text-slate-600">1.5 mm</td>
                <td className="p-2 text-slate-500 font-mono text-[10px]">Schedule II Table 1</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-2 font-medium">50 g to 200 g / ml (PDP 50 - 100 sq cm)</td>
                <td className="p-2 font-mono font-bold text-slate-800">1.5 mm</td>
                <td className="p-2 font-mono text-slate-600">2.0 mm</td>
                <td className="p-2 text-slate-500 font-mono text-[10px]">Schedule II Table 1</td>
              </tr>
              <tr className="hover:bg-indigo-50/50 bg-indigo-50/30">
                <td className="p-2 font-medium font-bold text-indigo-900">200 g to 1 kg / l (PDP 100 - 500 sq cm)</td>
                <td className="p-2 font-mono font-bold text-indigo-700">2.0 mm (V1 Standard)</td>
                <td className="p-2 font-mono text-indigo-700">4.0 mm</td>
                <td className="p-2 text-indigo-700 font-semibold font-mono text-[10px]">Cereal & Soap Box Standard</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-2 font-medium">1 kg to 5 kg / l (PDP 500 - 1000 sq cm)</td>
                <td className="p-2 font-mono font-bold text-slate-800">4.0 mm</td>
                <td className="p-2 font-mono text-slate-600">6.0 mm</td>
                <td className="p-2 text-slate-500 font-mono text-[10px]">Schedule II Table 1</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredRules.map((rule) => (
          <div
            key={rule.id}
            className="bg-white rounded-lg border border-slate-200 p-4 shadow-2xs hover:shadow-xs transition flex flex-col justify-between space-y-3"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                  {rule.id}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 font-medium">
                  {rule.category}
                </span>
              </div>

              <h3 className="text-xs font-bold text-slate-900 leading-snug">
                {rule.ruleNumber}: {rule.title}
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                {rule.description}
              </p>
            </div>

            <div className="pt-2.5 border-t border-slate-100 space-y-2">
              <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded border border-slate-100 font-mono">
                <span className="font-bold text-slate-700 block text-[9px] uppercase font-sans">
                  Mandatory Standard:
                </span>
                {rule.prescribedRequirement}
              </div>

              <div className="flex items-center justify-between text-xs pt-0.5">
                <span className="text-[10px] text-rose-700 font-mono truncate max-w-[200px]">
                  {rule.penaltySection.slice(0, 35)}...
                </span>
                <button
                  onClick={() => setSelectedRuleForModal(rule)}
                  className="text-indigo-600 hover:text-indigo-800 font-semibold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <span>Full Provision</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
