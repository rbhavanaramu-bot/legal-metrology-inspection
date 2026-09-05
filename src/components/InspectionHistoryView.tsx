import React, { useState } from 'react';
import { useInspection } from '../context/InspectionContext';
import { InspectionRecord } from '../types/inspection';
import {
  Search,
  Eye,
  Download
} from 'lucide-react';

export const InspectionHistoryView: React.FC = () => {
  const {
    inspections,
    setCurrentInspection,
    setActiveTab,
    setSelectedEvidenceInspection,
    searchQuery,
    setSearchQuery
  } = useInspection();

  const [statusFilter, setStatusFilter] = useState<'ALL' | 'FLAGGED' | 'CONFIRMED' | 'COMPLIANT'>('ALL');
  const [packageTypeFilter, setPackageTypeFilter] = useState<string>('ALL');

  // Filter inspections
  const filtered = inspections.filter((item) => {
    // Status filter
    if (statusFilter === 'FLAGGED' && item.reviewState !== 'flagged' && item.reviewState !== 'reviewed') {
      return false;
    }
    if (statusFilter === 'CONFIRMED' && item.reviewState !== 'confirmed') {
      return false;
    }
    if (statusFilter === 'COMPLIANT' && item.team2Data.compliance.status !== 'COMPLIANT' && item.reviewState !== 'dismissed') {
      return false;
    }

    // Package type filter
    if (packageTypeFilter !== 'ALL' && item.packageType !== packageTypeFilter) {
      return false;
    }

    // Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matches =
        item.id.toLowerCase().includes(q) ||
        item.productDetected.toLowerCase().includes(q) ||
        (item.team2Data.fields.manufacturer_name?.value || '').toLowerCase().includes(q) ||
        item.sampleLocation.toLowerCase().includes(q) ||
        item.reviewState.toLowerCase().includes(q);
      if (!matches) return false;
    }

    return true;
  });

  const handleReview = (item: InspectionRecord) => {
    setCurrentInspection(item);
    setActiveTab('new-inspection');
  };

  const handleExportCsv = () => {
    const headers = ['Inspection_ID', 'Timestamp', 'Product', 'Package_Type', 'Manufacturer', 'MRP', 'Net_Quantity', 'Compliance_Status', 'Score', 'Review_State', 'Officer_Decision'];
    const rows = filtered.map(i => [
      i.id,
      i.timestamp,
      `"${i.productDetected}"`,
      `"${i.packageType}"`,
      `"${i.team2Data.fields.manufacturer_name?.value || ''}"`,
      `"${i.team2Data.fields.mrp?.value || ''}"`,
      `"${i.team2Data.fields.net_quantity?.value || ''}"`,
      i.team2Data.compliance.status,
      i.team2Data.compliance.score,
      i.reviewState,
      i.officerDecision || 'PENDING'
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `LM_Inspection_History_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4 pb-8">
      {/* View Header */}
      <div className="p-4 border-b border-slate-200 bg-white rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shrink-0 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Inspection History & Repository</h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
              {filtered.length} of {inspections.length} Records
            </span>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Official statutory repository of scanned packaged commodities, physical evidence, and officer determinations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold shadow-2xs transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-white rounded-lg border border-slate-200 p-3 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 text-xs">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, product, manufacturer, or location..."
            className="w-full pl-8 pr-3 py-1.5 rounded border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-2.5 py-1.5 rounded border border-slate-300 bg-slate-50 text-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium cursor-pointer"
          >
            <option value="ALL">All States</option>
            <option value="FLAGGED">Pending Review (Flagged)</option>
            <option value="CONFIRMED">Confirmed Violations</option>
            <option value="COMPLIANT">Compliant / Dismissed</option>
          </select>

          <select
            value={packageTypeFilter}
            onChange={(e) => setPackageTypeFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded border border-slate-300 bg-slate-50 text-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium cursor-pointer"
          >
            <option value="ALL">All Box Types</option>
            <option value="Cereal Box">Cereal Box</option>
            <option value="Soap Box">Soap Box</option>
            <option value="Rectangular Carton">Rectangular Carton</option>
            <option value="Food Carton">Food Carton</option>
          </select>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold text-[10px] uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-3.5">Inspection ID</th>
                <th className="py-2.5 px-3.5">Scanned Product</th>
                <th className="py-2.5 px-3.5">Package</th>
                <th className="py-2.5 px-3.5">Manufacturer</th>
                <th className="py-2.5 px-3.5">Location</th>
                <th className="py-2.5 px-3.5">Result</th>
                <th className="py-2.5 px-3.5">Officer State</th>
                <th className="py-2.5 px-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-slate-400 text-xs font-mono">
                    No inspections matching the filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const isNonCompliant = item.team2Data.compliance.status === 'NON_COMPLIANT';
                  return (
                    <tr key={item.id} className="hover:bg-slate-50 transition">
                      <td className="py-2.5 px-3.5 font-mono font-bold text-slate-800">
                        {item.id}
                        <span className="block text-[10px] text-slate-400 font-sans font-normal">
                          {new Date(item.timestamp).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="py-2.5 px-3.5">
                        <div className="flex items-center gap-2">
                          <img
                            src={item.imageUrl}
                            alt="thumb"
                            className="w-8 h-8 rounded object-cover border border-slate-200 shrink-0 cursor-pointer"
                            onClick={() => setSelectedEvidenceInspection(item)}
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <span className="font-semibold text-slate-800 block truncate max-w-[170px]">
                              {item.productDetected}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              Batch: {item.batchNumber || 'N/A'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5 px-3.5 text-slate-600 font-medium">
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-mono border border-slate-200">
                          {item.packageType}
                        </span>
                      </td>
                      <td className="py-2.5 px-3.5 text-slate-700 max-w-[150px] truncate text-[11px]">
                        {item.team2Data.fields.manufacturer_name?.value || 'Unknown'}
                      </td>
                      <td className="py-2.5 px-3.5 text-slate-600 max-w-[150px] truncate text-[10px]">
                        {item.sampleLocation}
                      </td>
                      <td className="py-2.5 px-3.5">
                        {isNonCompliant ? (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700">
                            NON-COMPLIANT ({item.team2Data.compliance.score}%)
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">
                            COMPLIANT ({item.team2Data.compliance.score}%)
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3.5">
                        {item.reviewState === 'flagged' && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                            flagged (advisory)
                          </span>
                        )}
                        {item.reviewState === 'reviewed' && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
                            reviewed
                          </span>
                        )}
                        {item.reviewState === 'confirmed' && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-rose-50 text-rose-700 border border-rose-200">
                            confirmed violation
                          </span>
                        )}
                        {item.reviewState === 'dismissed' && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                            dismissed
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleReview(item)}
                            className="px-2 py-0.5 text-xs font-semibold rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                          >
                            Review
                          </button>
                          <button
                            onClick={() => setSelectedEvidenceInspection(item)}
                            className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 transition cursor-pointer"
                            title="View visual evidence"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
