import React, { useState } from 'react';
import { useInspection } from '../context/InspectionContext';
import {
  Server,
  Save,
  CheckCircle2,
  Box,
  Layers,
  Lock,
  Shield
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, officer } = useInspection();
  const [customEndpoint, setCustomEndpoint] = useState(settings.team2EndpointUrl);
  const [threshold, setThreshold] = useState(settings.ocrConfidenceThreshold);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [roleError, setRoleError] = useState<string | null>(null);

  const canEditSettings = officer.role === 'admin' || officer.role === 'senior_officer';

  const handleSave = () => {
    if (!canEditSettings) {
      setRoleError('Permission Denied: Only Senior Officers or System Administrators can modify OCR calibration thresholds and API endpoints. Switch profile in the header bar.');
      setTimeout(() => setRoleError(null), 5000);
      return;
    }
    updateSettings({
      team2EndpointUrl: customEndpoint,
      ocrConfidenceThreshold: threshold
    });
    setRoleError(null);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4 pb-8">
      {/* View Header */}
      <div className="p-4 border-b border-slate-200 bg-white rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shrink-0 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">
              System & Integration Settings
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
              Configuration
            </span>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Technical architecture, Team 2 API endpoint contracts, and Legal Metrology rule calibration.
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded text-emerald-900 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Configuration saved successfully.</span>
        </div>
      )}

      {roleError && (
        <div className="p-2.5 bg-rose-50 border border-rose-300 rounded text-rose-950 text-xs flex items-center gap-2">
          <Lock className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{roleError}</span>
        </div>
      )}

      {/* Team 2 Integration Contract Config */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-2xs space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Team 2 AI/CV Service Integration
              </h3>
              <p className="text-[11px] text-slate-500 font-mono">
                Integration Contract: <code>POST /analyze</code> (PaddleOCR + OpenCV + Rules Engine)
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold">
            {customEndpoint.trim() ? 'Live Endpoint Configured' : 'Mock Engine Active'}
          </span>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Team 2 Analysis Endpoint URL (Optional Live Server):
            </label>
            <input
              type="text"
              value={customEndpoint}
              onChange={(e) => setCustomEndpoint(e.target.value)}
              placeholder="e.g. https://team2-ai-engine.internal/analyze (leave blank to use prototype engine)"
              className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-xs font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              When empty, the platform operates in full parallel development mode using simulated PaddleOCR responses adhering strictly to the contract.
            </span>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[11px] font-semibold text-slate-700">
                Minimum OCR Confidence Acceptance Threshold:
              </label>
              <span className="font-mono text-slate-800 font-bold">
                {Math.round(threshold * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="0.99"
              step="0.01"
              value={threshold}
              onChange={(e) => setThreshold(parseFloat(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>50% (Permissive)</span>
              <span>85% (Recommended)</span>
              <span>99% (Strict)</span>
            </div>
          </div>
        </div>
      </div>

      {/* V1 Scope Boundaries Card */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-2xs space-y-2.5">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-xs">
          <Box className="w-4 h-4 text-indigo-600" />
          <span>V1 Packaging Boundaries & Scope Enforcement</span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          In accordance with the SIH 26034 project specification, V1 scope is strictly restricted to rectangular packaging (cereal boxes, soap boxes, and cartons).
        </p>
        <div className="p-2.5 bg-slate-50 rounded border border-slate-200 text-xs space-y-1.5">
          <div className="flex items-center gap-2 text-slate-700 font-medium text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Rectangular Principal Display Panel (PDP) calculation enabled</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700 font-medium text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Camera frame-guide overlay ("Place the product inside the box.")</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700 font-medium text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Schedule II Table 1 rectangular box font height validation</span>
          </div>
        </div>
      </div>

      {/* eMaap Architecture Positioning Notice */}
      <div className="bg-slate-900 text-white rounded-lg p-4 border border-slate-800 shadow-2xs space-y-2">
        <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider font-mono">
          <Layers className="w-4 h-4" />
          <span>Statutory Architecture & eMaap Positioning</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          This system is engineered as a standalone, mobile-responsive web platform with a documented REST API, positioned as a pluggable enforcement module for eMaap (National Legal Metrology Portal).
        </p>
        <div className="pt-2 text-[10px] font-mono text-slate-400 border-t border-slate-800">
          Architecture: React (Vite) + Mobile-Responsive Scanner + Team 2 Integration Contract
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-between pt-1">
        <div className="text-[11px] text-slate-500 font-mono">
          Logged in as: <span className="font-semibold text-slate-700">{officer.name}</span> ({officer.role.replace('_', ' ')})
        </div>
        <button
          onClick={handleSave}
          className={`px-4 py-2 rounded text-white font-bold text-xs shadow-2xs transition flex items-center gap-1.5 cursor-pointer uppercase tracking-wider ${
            canEditSettings ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-slate-700 hover:bg-slate-800'
          }`}
        >
          {canEditSettings ? (
            <Save className="w-4 h-4" />
          ) : (
            <Lock className="w-3.5 h-3.5 text-amber-300" />
          )}
          <span>{canEditSettings ? 'Save Configuration' : 'Save (Senior/Admin Only)'}</span>
        </button>
      </div>
    </div>
  );
};
