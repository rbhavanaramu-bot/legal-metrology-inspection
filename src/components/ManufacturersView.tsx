import React, { useState } from 'react';
import { useInspection } from '../context/InspectionContext';
import { Building2, AlertTriangle, Search, ExternalLink, ShieldCheck } from 'lucide-react';

export const ManufacturersView: React.FC = () => {
  const { inspections, setCurrentInspection, setActiveTab } = useInspection();
  const [searchTerm, setSearchTerm] = useState('');

  // Aggregate manufacturers from inspections repository
  const manufacturerMap = new Map<string, {
    name: string;
    address: string;
    totalInspections: number;
    compliantCount: number;
    violationsCount: number;
    products: string[];
    inspections: typeof inspections;
    topViolation?: string;
  }>();

  inspections.forEach(item => {
    const name = item.team2Data.fields.manufacturer_name?.value || 'Unknown Manufacturer';
    const address = item.team2Data.fields.manufacturer_address?.value || 'Address not declared';
    const isCompliant = item.team2Data.compliance.status === 'COMPLIANT' || item.officerDecision === 'DEEMED_COMPLIANT';

    if (!manufacturerMap.has(name)) {
      manufacturerMap.set(name, {
        name,
        address,
        totalInspections: 0,
        compliantCount: 0,
        violationsCount: 0,
        products: [],
        inspections: [],
        topViolation: item.team2Data.violations[0]?.rule_id
      });
    }

    const m = manufacturerMap.get(name)!;
    m.totalInspections += 1;
    if (isCompliant) {
      m.compliantCount += 1;
    } else {
      m.violationsCount += 1;
    }
    if (!m.products.includes(item.productDetected)) {
      m.products.push(item.productDetected);
    }
    m.inspections.push(item);
  });

  const manufacturers = Array.from(manufacturerMap.values()).filter(m =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4 pb-8">
      {/* View Header */}
      <div className="p-4 border-b border-slate-200 bg-white rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shrink-0 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">
              Manufacturer & Brand Compliance Trends
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
              {manufacturers.length} Registered Entities
            </span>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Enforcement tracking of manufacturers, repeat PCR 2011 infractions, and compliance scorecards.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search manufacturer or brand..."
            className="w-full pl-8 pr-3 py-1.5 rounded border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Manufacturers Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {manufacturers.map((m) => {
          const complianceRate = Math.round((m.compliantCount / m.totalInspections) * 100);
          return (
            <div
              key={m.name}
              className="bg-white rounded-lg border border-slate-200 p-4 shadow-2xs space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 leading-tight">
                      {m.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 font-mono">
                      {m.address}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                    complianceRate >= 90
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : complianceRate >= 60
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                    {complianceRate}% Compliant
                  </span>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2 rounded border border-slate-100 text-center text-xs">
                <div>
                  <span className="text-[9px] text-slate-400 block uppercase font-bold">Total Scanned</span>
                  <span className="font-bold text-slate-800 font-mono text-xs">{m.totalInspections}</span>
                </div>
                <div>
                  <span className="text-[9px] text-emerald-600 block uppercase font-bold">Compliant</span>
                  <span className="font-bold text-emerald-700 font-mono text-xs">{m.compliantCount}</span>
                </div>
                <div>
                  <span className="text-[9px] text-rose-600 block uppercase font-bold">Violations</span>
                  <span className="font-bold text-rose-700 font-mono text-xs">{m.violationsCount}</span>
                </div>
              </div>

              {/* Commodities list */}
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Inspected Commodities
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {m.products.map((p, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium border border-slate-200 font-mono"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 text-[11px]">
                  {m.violationsCount > 0 ? (
                    <span className="text-rose-600 font-semibold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> Infractions flagged
                    </span>
                  ) : (
                    <span className="text-emerald-600 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Full compliance record
                    </span>
                  )}
                </span>
                <button
                  onClick={() => {
                    const sample = m.inspections[0];
                    if (sample) {
                      setCurrentInspection(sample);
                      setActiveTab('new-inspection');
                    }
                  }}
                  className="text-indigo-600 hover:text-indigo-800 font-semibold text-[11px] flex items-center gap-1 cursor-pointer"
                >
                  <span>View Latest Inspection</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
