import React, { useState } from 'react';
import { useInspection } from '../context/InspectionContext';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Camera,
  BookOpen,
  Image as ImageIcon,
  FileText,
  Save,
  Shield,
  Clock,
  Eye,
  Check,
  ChevronRight,
  Info,
  Scale,
  Download,
  CheckCheck,
  Lock,
  AlertCircle
} from 'lucide-react';
import { LEGAL_METROLOGY_RULES } from '../data/rulesData';

export const InspectionResultView: React.FC = () => {
  const {
    currentInspection,
    startNewInspection,
    setSelectedRuleForModal,
    setSelectedEvidenceInspection,
    updateInspectionReview,
    saveCurrentInspection,
    findRuleById,
    setActiveTab,
    officer
  } = useInspection();

  if (!currentInspection) {
    return (
      <div className="p-8 text-center text-slate-500 bg-white rounded-lg border border-slate-200">
        No active inspection found. Please scan a package first.
      </div>
    );
  }

  const { team2Data, reviewState, officerDecision, officerNotes } = currentInspection;
  const isNonCompliant = team2Data.compliance.status === 'NON_COMPLIANT';

  // Officer review interaction state
  const [officerReviewNotes, setOfficerReviewNotes] = useState<string>(
    officerNotes ||
      (isNonCompliant
        ? 'Advisory flag: Required declaration missing. Verified on physical carton.'
        : 'All mandatory declarations verified compliant.')
  );
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);
  const [actionErrorMessage, setActionErrorMessage] = useState<string | null>(null);

  const canConfirmOrDismiss = officer.role === 'senior_officer' || officer.role === 'admin';

  const fields = team2Data.fields;

  // Mandatory Requirements mapping according to Rule 6 PCR 2011
  const requirementsList = [
    {
      name: 'Maximum Retail Price',
      key: 'mrp',
      ruleId: 'LM-PC-005',
      fieldData: fields.mrp,
      prescribed: 'Rule 6(1)(e) & Rule 18 - MRP incl. of all taxes'
    },
    {
      name: 'Net Quantity',
      key: 'net_quantity',
      ruleId: 'LM-PC-003',
      fieldData: fields.net_quantity,
      prescribed: 'Rule 6(1)(c) & Rule 11 - Standard SI metric unit'
    },
    {
      name: 'Manufacturer Name',
      key: 'manufacturer_name',
      ruleId: 'LM-PC-001',
      fieldData: fields.manufacturer_name,
      prescribed: 'Rule 6(1)(a) - Name of Manufacturer/Packer'
    },
    {
      name: 'Date of Packing',
      key: 'date_of_packing',
      ruleId: 'LM-PC-004',
      fieldData: fields.date_of_packing,
      prescribed: 'Rule 6(1)(d) - Month & Year of packing'
    },
    {
      name: 'Consumer Care Cell',
      key: 'consumer_care',
      ruleId: 'LM-PC-006',
      fieldData: fields.consumer_care,
      prescribed: 'Rule 6(1)(f) - Name, Address, Phone, Email'
    },
    {
      name: 'Generic / Common Name',
      key: 'generic_name',
      ruleId: 'LM-PC-002',
      fieldData: fields.generic_name,
      prescribed: 'Rule 6(1)(b) - Commodity Identity'
    },
    {
      name: 'Country of Origin',
      key: 'country_of_origin',
      ruleId: 'LM-PC-007',
      fieldData: fields.country_of_origin,
      prescribed: 'Rule 6(1)(g) - Country of origin declaration'
    }
  ];

  const hasConsumerCare = !!fields.consumer_care?.value;
  const primaryViolation = team2Data.violations[0];
  const violationReason =
    primaryViolation?.reason ||
    (isNonCompliant
      ? 'Required declaration is missing.'
      : 'All mandatory declarations verified compliant.');

  const handleOpenRule = (ruleId?: string) => {
    const idToLookup = ruleId || primaryViolation?.rule_id || 'LM-PC-006';
    const rule = findRuleById(idToLookup) || LEGAL_METROLOGY_RULES[0];
    setSelectedRuleForModal(rule);
  };

  const handleOpenEvidence = () => {
    setSelectedEvidenceInspection(currentInspection);
  };

  const handleOfficerAction = (
    nextState: 'reviewed' | 'confirmed' | 'dismissed',
    decision: 'CONFIRMED_VIOLATION' | 'DEEMED_COMPLIANT' | 'PENDING'
  ) => {
    if ((nextState === 'confirmed' || nextState === 'dismissed') && !canConfirmOrDismiss) {
      setActionErrorMessage(
        'Statutory Restriction: Only Senior Officers or Admins possess statutory authority to issue legal confirmation or dismiss flags under Section 36 of the Legal Metrology Act, 2009. Field Inspectors can submit initial field reviews.'
      );
      setTimeout(() => setActionErrorMessage(null), 6000);
      return;
    }

    updateInspectionReview(currentInspection.id, nextState, decision, officerReviewNotes);
    setActionErrorMessage(null);
    setActionSuccessMessage(
      nextState === 'confirmed'
        ? `Statutory violation confirmed by ${officer.name} (${officer.designation}). Entered into official enforcement registry.`
        : nextState === 'dismissed'
        ? `Flag dismissed by ${officer.name} with recorded statutory rationale. Logged as deemed compliant.`
        : `Field review observations logged by ${officer.name}. Moved to reviewed status.`
    );
    setTimeout(() => setActionSuccessMessage(null), 4000);
  };

  return (
    <div className="flex flex-col min-w-0 space-y-4 pb-12">
      
      {/* High Density Sub-Header (from Design HTML) */}
      <div className="p-4 border-b border-slate-200 bg-white rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shrink-0 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-800">
              Inspection: {currentInspection.id}
            </h1>
            <span
              className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded uppercase ${
                isNonCompliant
                  ? 'bg-rose-100 text-rose-700'
                  : 'bg-emerald-100 text-emerald-700'
              }`}
            >
              {team2Data.compliance.status}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Product Category: {currentInspection.productDetected} ({currentInspection.packageType})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('reports')}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5 text-slate-600" />
            <span>Export PDF</span>
          </button>

          <button
            onClick={() => {
              if (reviewState === 'flagged') {
                handleOfficerAction('reviewed', 'PENDING');
              } else if (reviewState === 'reviewed') {
                handleOfficerAction(isNonCompliant ? 'confirmed' : 'dismissed', isNonCompliant ? 'CONFIRMED_VIOLATION' : 'DEEMED_COMPLIANT');
              }
              saveCurrentInspection();
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded text-xs font-semibold transition shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Review & Approve</span>
          </button>

          <button
            onClick={startNewInspection}
            className="bg-slate-800 hover:bg-slate-900 text-white px-3 py-1.5 rounded text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
            title="Scan new product"
          >
            <Camera className="w-3.5 h-3.5 text-indigo-300" />
            <span className="hidden sm:inline">New Scan</span>
          </button>
        </div>
      </div>

      {actionSuccessMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-900 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionSuccessMessage}</span>
        </div>
      )}

      {actionErrorMessage && (
        <div className="p-3 bg-rose-50 border border-rose-300 rounded-lg text-rose-950 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <div className="flex-1 font-medium">{actionErrorMessage}</div>
        </div>
      )}

      {/* Main High Density Two-Column Split (2/5 and 3/5 layout) */}
      <div className="flex flex-col lg:flex-row gap-4">
        
        {/* Left 2/5 Column: Camera Feed Canvas & System Findings */}
        <div className="w-full lg:w-2/5 flex flex-col gap-4">
          
          {/* Live Packaging Feed Visualizer */}
          <div className="bg-slate-200 rounded-lg relative overflow-hidden flex flex-col items-center justify-center border-2 border-slate-300 min-h-[340px] p-4 group">
            {/* High Density Radial Dot Grid Pattern */}
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(#6366f1 0.75px, transparent 0.75px)',
                backgroundSize: '10px 10px'
              }}
            />

            {/* Simulated/Scanned Packaging Box Presentation */}
            <div className="w-64 max-w-full bg-white shadow-xl relative flex flex-col p-3 border border-slate-400 rounded-sm">
              <div className="relative overflow-hidden rounded bg-slate-100 flex items-center justify-center max-h-56">
                <img
                  src={currentInspection.imageUrl}
                  alt="Scanned Package"
                  className="w-full h-full object-contain max-h-52"
                  referrerPolicy="no-referrer"
                />

                {/* Bounding Box Box Overlay Effect */}
                <div className="absolute inset-0 border-2 border-emerald-500/80 opacity-70 pointer-events-none shadow-[inset_0_0_15px_rgba(16,185,129,0.2)]"></div>
              </div>

              {/* Package Details Bar */}
              <div className="mt-2 pt-2 border-t border-dashed border-slate-300 flex items-center justify-between text-[10px] font-mono text-slate-600">
                <span className="truncate">{currentInspection.productDetected}</span>
                <span className="text-indigo-600 font-bold">
                  {Math.round(team2Data.ocr.average_confidence * 100)}% conf
                </span>
              </div>
            </div>

            {/* Live Camera Feed Badge */}
            <div className="absolute top-3 left-3 bg-black/75 text-white px-2 py-0.5 rounded text-[10px] font-mono tracking-wider flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></div>
              <span>CAM_01_FEED (SEIZED_SAMPLE)</span>
            </div>

            {/* Interactive Bounding Box Trigger */}
            <button
              onClick={handleOpenEvidence}
              className="absolute bottom-3 right-3 bg-slate-900/90 hover:bg-slate-950 text-white text-[10px] font-semibold font-mono px-2.5 py-1 rounded border border-slate-700 shadow-sm transition flex items-center gap-1"
            >
              <Eye className="w-3 h-3 text-indigo-400" />
              <span>Inspect Bounding Boxes</span>
            </button>
          </div>

          {/* Dark System Findings Card (Confidence Metrics) */}
          <div className="bg-slate-900 rounded-lg p-3.5 text-slate-300 space-y-2 border border-slate-800 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                System Findings (Confidence: {Math.round(team2Data.ocr.average_confidence * 100)}%)
              </p>
              <span className="text-[10px] font-mono text-emerald-400">PaddleOCR 2.6</span>
            </div>

            <div className="space-y-1.5 font-mono text-[11px]">
              <div className="flex justify-between">
                <span className="text-indigo-400">ocr_engine</span>
                <span className="text-slate-200">{team2Data.processing.ocr_engine}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-indigo-400">processing_time</span>
                <span className="text-slate-200">{team2Data.processing.processing_time_ms}ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-indigo-400">average_conf</span>
                <span className="text-slate-200">{team2Data.ocr.average_confidence.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-indigo-400">package_type</span>
                <span className="text-slate-200">{team2Data.visual_checks.package_type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-indigo-400">pdp_area</span>
                <span className="text-slate-200">{team2Data.visual_checks.pdp_area_sq_cm || 200} sq cm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-indigo-400">detected_font_ht</span>
                <span className="text-slate-200 font-bold">
                  {team2Data.visual_checks.detected_font_height_mm || 2.2} mm
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-indigo-400">minimum_mandated</span>
                <span className="text-slate-400">{team2Data.visual_checks.minimum_font_height_mm || 2.0} mm</span>
              </div>
            </div>
          </div>

          {/* Quick Declarations Summary Grid */}
          <div className="bg-white rounded-lg border border-slate-200 p-3 shadow-2xs space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
              Quick Declaration Verification
            </span>
            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex justify-between p-1.5 bg-slate-50 rounded">
                <span className="text-slate-600">MRP:</span>
                <span className="font-bold text-slate-900">{fields.mrp?.value || 'Not Found'} {fields.mrp ? '✅' : '❌'}</span>
              </div>
              <div className="flex justify-between p-1.5 bg-slate-50 rounded">
                <span className="text-slate-600">Net Quantity:</span>
                <span className="font-bold text-slate-900">{fields.net_quantity?.value || 'Not Found'} {fields.net_quantity ? '✅' : '❌'}</span>
              </div>
              <div className="flex justify-between p-1.5 bg-slate-50 rounded">
                <span className="text-slate-600">Manufacturer:</span>
                <span className="font-bold text-slate-900 truncate max-w-[140px]">{fields.manufacturer_name?.value || 'Not Found'} {fields.manufacturer_name ? '✅' : '❌'}</span>
              </div>
              <div className="flex justify-between p-1.5 bg-slate-50 rounded">
                <span className="text-slate-600">Date of Packing:</span>
                <span className="font-bold text-slate-900">{fields.date_of_packing?.value || 'Not Found'} {fields.date_of_packing ? '✅' : '❌'}</span>
              </div>
              <div className="flex justify-between p-1.5 bg-slate-50 rounded">
                <span className="text-slate-600">Required declaration:</span>
                <span className={hasConsumerCare ? 'font-bold text-slate-900' : 'font-bold text-rose-600'}>
                  {hasConsumerCare ? 'Found ✅' : 'Missing ❌'}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Right 3/5 Column: Compliance Check Table + Violation Card + Officer Review */}
        <div className="w-full lg:w-3/5 flex flex-col gap-4">
          
          {/* Compliance Check Table (High Density format) */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-2xs flex flex-col overflow-hidden">
            <div className="p-3 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <div>
                <span className="text-xs font-bold uppercase text-slate-700 tracking-wider">
                  Compliance Check Table
                </span>
                <span className="text-[10px] text-slate-400 block font-mono">
                  Legal Metrology (Packaged Commodities) Rules, 2011 Schedule Verification
                </span>
              </div>
              <span
                className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                  isNonCompliant
                    ? 'bg-rose-100 text-rose-700'
                    : 'bg-emerald-100 text-emerald-700'
                }`}
              >
                {team2Data.compliance.status}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-[10px] uppercase text-slate-400 font-bold border-b border-slate-100">
                    <th className="px-3.5 py-2">Requirement</th>
                    <th className="px-3.5 py-2">Extracted Value</th>
                    <th className="px-3.5 py-2 text-center">Found?</th>
                    <th className="px-3.5 py-2">Result</th>
                    <th className="px-3.5 py-2 text-right">Rule</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {requirementsList.map((req) => {
                    const found = !!req.fieldData && !!req.fieldData.value;
                    const isFail = !found;
                    return (
                      <tr key={req.key} className="hover:bg-slate-50 transition">
                        <td className="px-3.5 py-2.5 font-medium text-slate-800">
                          {req.name}
                        </td>
                        <td className="px-3.5 py-2.5 text-slate-600 font-mono text-[11px] max-w-[180px] truncate">
                          {req.fieldData?.value || (
                            <span className="text-slate-400 italic">Not detected in frame</span>
                          )}
                        </td>
                        <td className="px-3.5 py-2.5 text-center font-bold">
                          {found ? (
                            <span className="text-emerald-600">✅</span>
                          ) : (
                            <span className="text-rose-600">❌</span>
                          )}
                        </td>
                        <td className="px-3.5 py-2.5">
                          {isFail ? (
                            <span className="text-[10px] px-1.5 py-0.5 bg-rose-100 text-rose-700 rounded font-bold">
                              FAIL
                            </span>
                          ) : (
                            <span className="text-[10px] px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded font-bold">
                              PASS
                            </span>
                          )}
                        </td>
                        <td className="px-3.5 py-2.5 text-right">
                          <button
                            onClick={() => handleOpenRule(req.ruleId)}
                            className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
                          >
                            {req.ruleId}
                          </button>
                        </td>
                      </tr>
                    );
                  })}

                  {/* Schedule II Font Height verification row */}
                  <tr className="hover:bg-slate-50 transition bg-slate-50/40">
                    <td className="px-3.5 py-2.5 font-medium text-slate-800">
                      Minimum Font Height (Rule 9)
                    </td>
                    <td className="px-3.5 py-2.5 text-slate-600 font-mono text-[11px]">
                      {team2Data.visual_checks.detected_font_height_mm || 2.2} mm (Min: {team2Data.visual_checks.minimum_font_height_mm || 2.0} mm)
                    </td>
                    <td className="px-3.5 py-2.5 text-center font-bold">
                      {team2Data.violations.some((v) => v.rule_id === 'LM-PC-008') ? (
                        <span className="text-rose-600">❌</span>
                      ) : (
                        <span className="text-emerald-600">✅</span>
                      )}
                    </td>
                    <td className="px-3.5 py-2.5">
                      {team2Data.violations.some((v) => v.rule_id === 'LM-PC-008') ? (
                        <span className="text-[10px] px-1.5 py-0.5 bg-rose-100 text-rose-700 rounded font-bold">
                          FAIL
                        </span>
                      ) : (
                        <span className="text-[10px] px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded font-bold">
                          PASS
                        </span>
                      )}
                    </td>
                    <td className="px-3.5 py-2.5 text-right">
                      <button
                        onClick={() => handleOpenRule('LM-PC-008')}
                        className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
                      >
                        LM-PC-008
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Violation Detected Alert Box (from Design HTML) */}
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg shrink-0">
            <div className="flex gap-3 items-start">
              <div className="bg-amber-100 p-2 rounded-full self-start shrink-0 text-amber-600">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-amber-900">
                  {isNonCompliant
                    ? `Violation Detected: ${primaryViolation?.rule_id || 'LM-PC-006'}`
                    : 'System Advisory: Declarations Validated'}
                </h4>
                <p className="text-xs text-amber-800 leading-relaxed mt-0.5">
                  {violationReason} This advisory determination was computed in accordance with the Legal Metrology (Packaged Commodities) Rules, 2011.
                </p>
                <div className="mt-2.5 flex gap-2">
                  <button
                    onClick={handleOpenEvidence}
                    className="text-[10px] font-bold text-amber-800 uppercase border border-amber-300 rounded px-2.5 py-1 bg-white hover:bg-amber-50 cursor-pointer transition shadow-2xs"
                  >
                    View Evidence
                  </button>
                  <button
                    onClick={() => handleOpenRule(primaryViolation?.rule_id)}
                    className="text-[10px] font-bold text-amber-800 uppercase border border-amber-300 rounded px-2.5 py-1 bg-white hover:bg-amber-50 cursor-pointer transition shadow-2xs"
                  >
                    View Rule {primaryViolation?.rule_id || '6(1)'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Human-in-the-Loop Officer Review Card */}
          <div className="bg-slate-900 text-white rounded-lg p-3.5 border border-slate-800 space-y-3 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Officer Review & Enforcement Decision
                </span>
              </div>
              <div className="flex items-center gap-2">
                {canConfirmOrDismiss ? (
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 font-semibold border border-emerald-800">
                    Senior Authority (Sec. 36)
                  </span>
                ) : (
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 font-semibold border border-amber-800 flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" />
                    <span>Field Inspector (Advisory)</span>
                  </span>
                )}
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-indigo-300 font-semibold uppercase">
                  {reviewState}
                </span>
              </div>
            </div>

            {/* Workflow state buttons */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div
                className={`p-1.5 rounded border transition text-[11px] ${
                  reviewState === 'flagged'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                    : 'bg-slate-800/60 border-slate-700 text-slate-400'
                }`}
              >
                1. Flagged
              </div>
              <div
                className={`p-1.5 rounded border transition text-[11px] ${
                  reviewState === 'reviewed'
                    ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300 font-bold'
                    : 'bg-slate-800/60 border-slate-700 text-slate-400'
                }`}
              >
                2. Reviewed
              </div>
              <div
                className={`p-1.5 rounded border transition text-[11px] ${
                  reviewState === 'confirmed' || reviewState === 'dismissed'
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                    : 'bg-slate-800/60 border-slate-700 text-slate-400'
                }`}
              >
                3. {reviewState === 'dismissed' ? 'Dismissed' : 'Confirmed'}
              </div>
            </div>

            {/* Officer Notes Textarea */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Officer Statutory Rationale (Sec. 18 / 36 LM Act, 2009):
              </label>
              <textarea
                rows={2}
                value={officerReviewNotes}
                onChange={(e) => setOfficerReviewNotes(e.target.value)}
                placeholder="Enter physical observations, measurement confirmation, or compounding notice remarks..."
                className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Officer Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <div className="flex flex-wrap items-center gap-2">
                {reviewState === 'flagged' && (
                  <button
                    onClick={() => handleOfficerAction('reviewed', 'PENDING')}
                    className="px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold cursor-pointer"
                  >
                    Mark Reviewed
                  </button>
                )}

                <button
                  onClick={() => handleOfficerAction('confirmed', 'CONFIRMED_VIOLATION')}
                  className={`px-3 py-1 rounded text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    canConfirmOrDismiss
                      ? 'bg-rose-600 hover:bg-rose-700 text-white'
                      : 'bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-800/80'
                  }`}
                  title={
                    canConfirmOrDismiss
                      ? 'Issue statutory confirmation order'
                      : 'Requires Senior Officer or Admin role under Section 36 of Legal Metrology Act'
                  }
                >
                  {!canConfirmOrDismiss && <Lock className="w-3 h-3 text-rose-400" />}
                  <span>{canConfirmOrDismiss ? 'Confirm Violation' : 'Confirm Violation (Senior Only)'}</span>
                </button>

                <button
                  onClick={() => handleOfficerAction('dismissed', 'DEEMED_COMPLIANT')}
                  className={`px-3 py-1 rounded text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                    canConfirmOrDismiss
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                      : 'bg-slate-800/60 hover:bg-slate-800 text-slate-400 border border-slate-700/60'
                  }`}
                  title={
                    canConfirmOrDismiss
                      ? 'Dismiss advisory flag and deem compliant'
                      : 'Requires Senior Officer or Admin role under Legal Metrology Rules'
                  }
                >
                  {!canConfirmOrDismiss && <Lock className="w-3 h-3 text-slate-500" />}
                  <span>{canConfirmOrDismiss ? 'Dismiss Flag' : 'Dismiss Flag (Senior Only)'}</span>
                </button>
              </div>

              <div className="text-[10px] text-slate-400 font-mono">
                {officer.name} • <span className="capitalize">{officer.role.replace('_', ' ')}</span>
              </div>
            </div>
          </div>

          {/* Advisory System Disclaimer (from Design HTML) */}
          <div className="bg-slate-100 rounded-lg p-3 border border-slate-200 shrink-0 text-center">
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-[0.2em]">
              Advisory System Only
            </p>
            <p className="text-[11px] text-slate-600 mt-1 italic">
              This software provides suggestions based on visual analysis. The inspecting officer holds the final authority for legal determination.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
