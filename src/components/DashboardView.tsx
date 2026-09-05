import React from 'react';
import { useInspection } from '../context/InspectionContext';
import {
  ClipboardCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  ExternalLink,
  Shield,
  FileCheck2,
  Scale,
  Camera
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    inspections,
    setActiveTab,
    setCurrentInspection,
    setSelectedEvidenceInspection,
    startNewInspection,
    searchQuery
  } = useInspection();

  // Compute specified KPI metrics
  const totalInspections = inspections.length;
  const compliantCount = inspections.filter(
    (i) => i.team2Data.compliance.status === 'COMPLIANT' || i.officerDecision === 'DEEMED_COMPLIANT'
  ).length;
  const violationsCount = inspections.filter(
    (i) => i.team2Data.compliance.status === 'NON_COMPLIANT' || i.officerDecision === 'CONFIRMED_VIOLATION'
  ).length;
  const pendingReviewCount = inspections.filter(
    (i) => i.reviewState === 'flagged' || i.reviewState === 'reviewed'
  ).length;

  // Filter inspections based on search query if active
  const filteredInspections = inspections.filter((item) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.id.toLowerCase().includes(q) ||
      item.productDetected.toLowerCase().includes(q) ||
      (item.team2Data.fields.manufacturer_name?.value || '').toLowerCase().includes(q) ||
      item.packageType.toLowerCase().includes(q) ||
      item.reviewState.toLowerCase().includes(q)
    );
  });

  const recentInspections = filteredInspections.slice(0, 8);

  const handleOpenInspection = (record: typeof inspections[0]) => {
    setCurrentInspection(record);
    setActiveTab('new-inspection');
  };

  return (
    <div className="space-y-4 pb-8">
      {/* High Density Header Bar */}
      <div className="p-4 border-b border-slate-200 bg-white rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shrink-0 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Enforcement Dashboard</h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
              Live Repository
            </span>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Legal Metrology (Packaged Commodities) Rules, 2011 • V1 Box Packaging Scope
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={startNewInspection}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-3.5 py-1.5 rounded shadow-xs transition cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>New Box Inspection</span>
          </button>
        </div>
      </div>

      {/* Main Dashboard Metric Cards (High Density Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Total Inspections */}
        <div className="bg-white rounded-lg border border-slate-200 p-3.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Total Inspections
            </span>
            <div className="w-7 h-7 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ClipboardCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 font-mono">{totalInspections}</span>
            <span className="text-[10px] text-slate-400 font-medium">Logged in repository</span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>Box / Carton Scope</span>
            <span className="font-semibold text-indigo-600">100% V1</span>
          </div>
        </div>

        {/* Compliant */}
        <div className="bg-white rounded-lg border border-slate-200 p-3.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
              Compliant
            </span>
            <div className="w-7 h-7 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-emerald-700 font-mono">{compliantCount}</span>
            <span className="text-[10px] text-emerald-600 font-medium">
              {totalInspections > 0 ? Math.round((compliantCount / totalInspections) * 100) : 0}% rate
            </span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>Verified Rules</span>
            <span className="font-semibold text-emerald-700">Pass</span>
          </div>
        </div>

        {/* Violations */}
        <div className="bg-white rounded-lg border border-slate-200 p-3.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider">
              Violations
            </span>
            <div className="w-7 h-7 rounded bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-rose-700 font-mono">{violationsCount}</span>
            <span className="text-[10px] text-rose-600 font-medium">Non-compliant</span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>Actionable Flags</span>
            <span className="font-semibold text-rose-700">Sec 36 LM Act</span>
          </div>
        </div>

        {/* Pending Review */}
        <div className="bg-white rounded-lg border border-slate-200 p-3.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">
              Pending Review
            </span>
            <div className="w-7 h-7 rounded bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-amber-700 font-mono">{pendingReviewCount}</span>
            <span className="text-[10px] text-amber-700 font-medium">Advisory flags</span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>Human-in-the-Loop</span>
            <span className="font-semibold text-amber-700">Needs Officer Action</span>
          </div>
        </div>
      </div>

      {/* Advisory System Notice Banner (High Density styling) */}
      <div className="bg-slate-100 border border-slate-200 rounded-lg p-3 flex items-start gap-3 text-xs text-slate-700">
        <Shield className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">
            Statutory Notice: Advisory-Only Digital Assistant
          </span>
          <p className="text-slate-600 text-[11px] leading-relaxed">
            All automated OCR extractions, bounding box detections, and rule verifications are decision-support aids.
            Final legal determination rests solely with the inspecting Legal Metrology Officer.
            No inspection enters permanent enforcement history without explicit review and approval.
          </p>
        </div>
      </div>

      {/* Recent Inspections Table (High Density format) */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-3 border-b border-slate-100 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Recent Inspections
            </h2>
            <p className="text-[10px] text-slate-500 font-mono">
              Scanned rectangular packages, compliance status, and officer review state.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('history')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 cursor-pointer"
          >
            <span>View All ({inspections.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold text-[10px] uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-3.5">Inspection ID</th>
                <th className="py-2.5 px-3.5">Product Detected</th>
                <th className="py-2.5 px-3.5">Package Type</th>
                <th className="py-2.5 px-3.5">Manufacturer</th>
                <th className="py-2.5 px-3.5">Result</th>
                <th className="py-2.5 px-3.5">Review State</th>
                <th className="py-2.5 px-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentInspections.map((item) => {
                const isNonCompliant = item.team2Data.compliance.status === 'NON_COMPLIANT';
                return (
                  <tr key={item.id} className="hover:bg-slate-50 transition">
                    <td className="py-2.5 px-3.5 font-mono font-bold text-slate-800">
                      {item.id}
                      <div className="text-[10px] text-slate-400 font-normal font-sans">
                        {new Date(item.timestamp).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-2.5 px-3.5 font-medium text-slate-800">
                      <div className="flex items-center space-x-2">
                        <img
                          src={item.imageUrl}
                          alt="sample"
                          className="w-7 h-7 object-cover rounded border border-slate-200 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <span className="truncate max-w-[160px]">{item.productDetected}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3.5 text-slate-600">
                      <span className="inline-block px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-mono border border-slate-200">
                        {item.packageType}
                      </span>
                    </td>
                    <td className="py-2.5 px-3.5 text-slate-700 max-w-[150px] truncate text-[11px]">
                      {item.team2Data.fields.manufacturer_name?.value || 'Unknown'}
                    </td>
                    <td className="py-2.5 px-3.5">
                      {isNonCompliant ? (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700">
                          NON-COMPLIANT
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">
                          COMPLIANT
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
                          confirmed by officer
                        </span>
                      )}
                      {item.reviewState === 'dismissed' && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                          dismissed
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3.5 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          onClick={() => handleOpenInspection(item)}
                          className="px-2 py-0.5 text-xs font-semibold rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                        >
                          Review
                        </button>
                        <button
                          onClick={() => setSelectedEvidenceInspection(item)}
                          className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 transition cursor-pointer"
                          title="View visual evidence"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
