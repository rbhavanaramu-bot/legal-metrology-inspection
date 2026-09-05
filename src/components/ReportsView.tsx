import React, { useState } from 'react';
import { useInspection } from '../context/InspectionContext';
import {
  Printer,
  Download,
  Scale,
  CheckCircle2
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { inspections, currentInspection } = useInspection();

  // Selected inspection for reporting
  const [selectedId, setSelectedId] = useState<string>(
    currentInspection?.id || inspections[0]?.id || ''
  );

  const selectedRecord = inspections.find(i => i.id === selectedId) || inspections[0];

  if (!selectedRecord) {
    return (
      <div className="p-8 text-center text-slate-500 bg-white rounded-lg border border-slate-200 font-mono text-xs">
        No inspection records available for generating reports.
      </div>
    );
  }

  const { team2Data } = selectedRecord;

  // Handle Print / PDF trigger
  const handlePrint = () => {
    window.print();
  };

  // Export JSON (Editable format)
  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(selectedRecord, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `LM_Report_${selectedRecord.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-4 pb-12">
      {/* View Toolbar */}
      <div className="p-4 border-b border-slate-200 bg-white rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shrink-0 shadow-2xs print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">
              Statutory Inspection Reports & Violation Notices
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
              Official Memo
            </span>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Export compliant and non-compliant inspection memos in PDF and editable formats under Legal Metrology Act, 2009.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Select Inspection Dropdown */}
          <select
            value={selectedRecord.id}
            onChange={(e) => setSelectedId(e.target.value)}
            className="px-2.5 py-1.5 rounded border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
          >
            {inspections.map((i) => (
              <option key={i.id} value={i.id}>
                {i.id} - {i.productDetected} ({i.team2Data.compliance.status})
              </option>
            ))}
          </select>

          <button
            onClick={handleExportJson}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-700 text-xs font-semibold shadow-2xs transition cursor-pointer"
            title="Export full JSON structure"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-2xs transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document Formatted with Official Govt Standards */}
      <div className="bg-white rounded-lg border border-slate-300 shadow-2xs p-6 sm:p-8 max-w-3xl mx-auto text-slate-900 space-y-5 print:border-none print:shadow-none print:p-0">
        
        {/* Document Header with Scales of Justice & Directorate Styling */}
        <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1">
          <div className="w-10 h-10 mx-auto rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-900 mb-1.5">
            <Scale className="w-5 h-5" />
          </div>
          <div className="text-[9px] font-bold uppercase tracking-widest text-slate-600 font-mono">
            Government of India • Ministry of Consumer Affairs, Food & Public Distribution
          </div>
          <h2 className="text-sm font-black uppercase text-slate-950 tracking-tight">
            DIRECTORATE OF LEGAL METROLOGY
          </h2>
          <div className="text-xs font-semibold text-slate-700">
            INSPECTION MEMORANDUM & COMPLIANCE VERIFICATION RECORD
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            Under Section 18 of the Legal Metrology Act, 2009 read with Legal Metrology (Packaged Commodities) Rules, 2011
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-2.5 bg-slate-50 rounded border border-slate-200 text-xs font-mono">
          <div>
            <span className="text-[9px] text-slate-500 block">Inspection Ref No:</span>
            <span className="font-bold text-slate-900">{selectedRecord.id}</span>
          </div>
          <div>
            <span className="text-[9px] text-slate-500 block">Date & Time:</span>
            <span className="font-bold text-slate-900">
              {new Date(selectedRecord.timestamp).toLocaleDateString()} {new Date(selectedRecord.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <div>
            <span className="text-[9px] text-slate-500 block">Inspecting Officer:</span>
            <span className="font-bold text-slate-900">{selectedRecord.officer.name}</span>
          </div>
          <div>
            <span className="text-[9px] text-slate-500 block">Officer Badge:</span>
            <span className="font-bold text-slate-900">{selectedRecord.officer.badgeNumber}</span>
          </div>
        </div>

        {/* Section 1: Seized / Inspected Commodity Details */}
        <div className="space-y-1.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
            1. Inspected Packaged Commodity Identification
          </h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-slate-500 block text-[10px]">Commodity Name:</span>
              <span className="font-semibold text-slate-800">{selectedRecord.productDetected}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Package Format:</span>
              <span className="font-semibold text-slate-800">{selectedRecord.packageType}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Batch / Lot Identification:</span>
              <span className="font-semibold text-slate-800 font-mono">{selectedRecord.batchNumber || 'N/A'}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Retailer / Premise Inspected:</span>
              <span className="font-semibold text-slate-800">{selectedRecord.retailerName}</span>
            </div>
            <div className="col-span-2">
              <span className="text-slate-500 block text-[10px]">Inspection Site Location:</span>
              <span className="font-semibold text-slate-800">{selectedRecord.sampleLocation}</span>
            </div>
          </div>
        </div>

        {/* Section 2: Mandatory Declarations Verification Table */}
        <div className="space-y-1.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
            2. Mandatory Declarations Verification (Rule 6 & Rule 9)
          </h3>
          <table className="w-full text-left text-xs border border-slate-200 rounded">
            <thead className="bg-slate-50 text-slate-700 text-[9px] uppercase font-bold font-mono">
              <tr>
                <th className="p-1.5 border-b">Statutory Requirement</th>
                <th className="p-1.5 border-b">Extracted Package Text</th>
                <th className="p-1.5 border-b text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-[10px]">
              <tr>
                <td className="p-1.5 font-medium">Generic / Common Name [Rule 6(1)(b)]</td>
                <td className="p-1.5 font-mono">{team2Data.fields.generic_name?.value || 'MISSING'}</td>
                <td className="p-1.5 text-center font-bold text-emerald-700 font-mono">{team2Data.fields.generic_name ? 'PASS' : 'FAIL'}</td>
              </tr>
              <tr>
                <td className="p-1.5 font-medium">Manufacturer / Packer Identity [Rule 6(1)(a)]</td>
                <td className="p-1.5 font-mono">{team2Data.fields.manufacturer_name?.value || 'MISSING'}</td>
                <td className="p-1.5 text-center font-bold text-emerald-700 font-mono">{team2Data.fields.manufacturer_name ? 'PASS' : 'FAIL'}</td>
              </tr>
              <tr>
                <td className="p-1.5 font-medium">Manufacturer Address [Rule 6(1)(a)]</td>
                <td className="p-1.5 font-mono">{team2Data.fields.manufacturer_address?.value || 'MISSING'}</td>
                <td className="p-1.5 text-center font-bold text-emerald-700 font-mono">{team2Data.fields.manufacturer_address ? 'PASS' : 'FAIL'}</td>
              </tr>
              <tr>
                <td className="p-1.5 font-medium">Net Quantity in Metric Unit [Rule 6(1)(c) & Rule 11]</td>
                <td className="p-1.5 font-mono">{team2Data.fields.net_quantity?.value || 'MISSING'}</td>
                <td className="p-1.5 text-center font-bold text-emerald-700 font-mono">{team2Data.fields.net_quantity ? 'PASS' : 'FAIL'}</td>
              </tr>
              <tr>
                <td className="p-1.5 font-medium">Maximum Retail Price (MRP) [Rule 6(1)(e)]</td>
                <td className="p-1.5 font-mono">{team2Data.fields.mrp?.value || 'MISSING'}</td>
                <td className="p-1.5 text-center font-bold text-emerald-700 font-mono">{team2Data.fields.mrp ? 'PASS' : 'FAIL'}</td>
              </tr>
              <tr>
                <td className="p-1.5 font-medium">Date of Packing / Mfg [Rule 6(1)(d)]</td>
                <td className="p-1.5 font-mono">{team2Data.fields.date_of_packing?.value || 'MISSING'}</td>
                <td className="p-1.5 text-center font-bold text-emerald-700 font-mono">{team2Data.fields.date_of_packing ? 'PASS' : 'FAIL'}</td>
              </tr>
              <tr>
                <td className="p-1.5 font-medium">Consumer Care Grievance Redressal [Rule 6(1)(f)]</td>
                <td className="p-1.5 font-mono">{team2Data.fields.consumer_care?.value || 'MISSING'}</td>
                <td className="p-1.5 text-center font-bold font-mono">
                  {team2Data.fields.consumer_care ? (
                    <span className="text-emerald-700">PASS</span>
                  ) : (
                    <span className="text-rose-700">FAIL ❌</span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Section 3: Summary of Violations & Statutory Citations */}
        <div className="space-y-1.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
            3. Summary of Violations & Advisory Findings
          </h3>
          {team2Data.violations.length === 0 ? (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded text-emerald-900 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>No violations detected. All mandatory declarations verified compliant under PCR 2011.</span>
            </div>
          ) : (
            <div className="space-y-1.5">
              {team2Data.violations.map((v, idx) => (
                <div key={idx} className="p-2.5 bg-rose-50 border border-rose-200 rounded text-rose-950 text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-rose-800 font-mono">VIOLATION #{idx + 1}: {v.rule_id}</span>
                    <span className="text-[9px] font-mono bg-rose-100 text-rose-700 px-1.5 py-0.2 rounded">
                      Confidence: {Math.round(v.confidence * 100)}%
                    </span>
                  </div>
                  <p className="text-[11px] text-rose-900 font-medium leading-relaxed">
                    {v.reason}
                  </p>
                  <p className="text-[9px] text-slate-600 font-mono">
                    Statutory Action: Punishable under Section 36(1) of the Legal Metrology Act, 2009.
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 4: Physical Evidence Photo Attachment */}
        <div className="space-y-1.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
            4. Physical Package Evidence Attachment
          </h3>
          <div className="flex flex-col sm:flex-row items-center gap-3 p-2.5 bg-slate-50 border border-slate-200 rounded">
            <img
              src={selectedRecord.imageUrl}
              alt="Physical Sample Evidence"
              className="w-28 h-28 object-contain rounded border border-slate-300 bg-white"
              referrerPolicy="no-referrer"
            />
            <div className="text-xs text-slate-600 space-y-1">
              <span className="font-semibold text-slate-800 block">Digital Imaging Chain of Custody</span>
              <p className="text-[11px] text-slate-500">
                Photographic record seized during statutory market inspection.
                Processed via PaddleOCR with bounding box analysis on Principal Display Panel.
              </p>
              <div className="text-[10px] font-mono text-slate-400">
                Package Scope: {selectedRecord.packageType} • PDP Area: {team2Data.visual_checks.pdp_area_sq_cm || 200} sq cm
              </div>
            </div>
          </div>
        </div>

        {/* Section 5: Officer Review & Sign-Off */}
        <div className="space-y-1.5 border-t border-slate-300 pt-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
            5. Officer Determination & Final Order
          </h3>
          <div className="p-2.5 bg-slate-50 rounded border border-slate-200 text-xs">
            <span className="text-[9px] font-semibold text-slate-500 uppercase block font-mono">
              Officer Findings & Verification Rationale:
            </span>
            <p className="text-slate-800 italic mt-0.5">
              "{selectedRecord.officerNotes || 'Verified on physical packaging. Advisory flag upheld.'}"
            </p>
          </div>

          <div className="pt-4 grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-[10px] text-slate-500 block">Enforcement Action:</span>
              <span className="font-bold text-slate-900 font-mono text-xs">
                {selectedRecord.reviewState === 'confirmed' ? 'CONFIRMED STATUTORY INFRACTION' : selectedRecord.reviewState.toUpperCase()}
              </span>
            </div>
            <div className="text-right space-y-1">
              <div className="h-6 border-b border-dashed border-slate-400 w-36 ml-auto" />
              <div className="font-bold text-slate-900">{selectedRecord.officer.name}</div>
              <div className="text-[10px] text-slate-500">{selectedRecord.officer.designation}</div>
              <div className="text-[9px] font-mono text-slate-500">{selectedRecord.officer.zone}</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
