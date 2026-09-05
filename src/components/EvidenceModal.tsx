import React, { useState } from 'react';
import { useInspection } from '../context/InspectionContext';
import { ExtractedField } from '../types/inspection';
import {
  X,
  Box,
  Eye,
  FileText
} from 'lucide-react';

export const EvidenceModal: React.FC = () => {
  const { selectedEvidenceInspection, setSelectedEvidenceInspection } = useInspection();
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true);
  const [selectedFieldKey, setSelectedFieldKey] = useState<string | null>(null);

  if (!selectedEvidenceInspection) return null;

  const inspection = selectedEvidenceInspection;
  const fields = inspection.team2Data.fields;
  const visual = inspection.team2Data.visual_checks;
  const ocr = inspection.team2Data.ocr;

  // Extract all fields that have a bbox
  const fieldEntriesWithBbox = (Object.entries(fields) as [string, ExtractedField | undefined][]).filter(
    (entry): entry is [string, ExtractedField] => !!entry[1] && !!entry[1].bbox && entry[1].bbox.length === 4
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-lg max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-white">
        
        {/* Modal Header */}
        <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-100 flex items-center gap-2">
                <span>Visual Evidence Inspection</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-indigo-300">
                  {inspection.id}
                </span>
              </h3>
              <p className="text-[10px] text-slate-400 font-mono">
                {inspection.productDetected} • {inspection.packageType}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
              className={`px-2.5 py-1 rounded text-xs font-semibold border transition cursor-pointer ${
                showBoundingBoxes
                  ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              {showBoundingBoxes ? 'Bounding Boxes ON' : 'Bounding Boxes OFF'}
            </button>

            <button
              onClick={() => setSelectedEvidenceInspection(null)}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-y-auto divide-y md:divide-y-0 md:divide-x divide-slate-800">
          
          {/* Left Canvas: Scanned Packaging Image with Team 2 Bounding Box Overlays */}
          <div className="md:col-span-7 p-3.5 flex flex-col justify-center items-center bg-slate-950/70">
            <div className="relative max-w-full rounded overflow-hidden border border-slate-800 shadow-inner group">
              <img
                src={inspection.imageUrl}
                alt="Inspection Evidence"
                className="w-full max-h-[420px] object-contain block"
                referrerPolicy="no-referrer"
              />

              {/* Bounding Box Visual Highlights if enabled */}
              {showBoundingBoxes && (
                <div className="absolute inset-0 pointer-events-none">
                  {fieldEntriesWithBbox.map(([key, val]) => {
                    if (!val?.bbox) return null;
                    const isSelected = selectedFieldKey === key;
                    const [x1, y1, x2, y2] = val.bbox;
                    
                    // Normalize coords to percentages for responsive rendering
                    const left = `${(x1 / 640) * 100}%`;
                    const top = `${(y1 / 550) * 100}%`;
                    const width = `${((x2 - x1) / 640) * 100}%`;
                    const height = `${((y2 - y1) / 550) * 100}%`;

                    return (
                      <div
                        key={key}
                        style={{ left, top, width, height }}
                        className={`absolute border-2 rounded-xs transition pointer-events-auto cursor-pointer ${
                          isSelected
                            ? 'border-indigo-400 bg-indigo-500/25 z-20 shadow-[0_0_10px_#6366f1]'
                            : 'border-emerald-400/90 bg-emerald-500/10 hover:border-indigo-400'
                        }`}
                        onClick={() => setSelectedFieldKey(key)}
                        title={`${key}: ${val.value} (${Math.round(val.confidence * 100)}%)`}
                      >
                        <span className="absolute -top-4 left-0 bg-slate-900/90 text-white font-mono text-[9px] px-1 py-0.2 rounded border border-slate-700 whitespace-nowrap">
                          {key.replace('_', ' ')}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="mt-2 text-[10px] text-slate-400 text-center flex items-center justify-center space-x-2 font-mono">
              <span>PaddleOCR Bounding Boxes</span>
              <span>•</span>
              <span className="text-emerald-400">Green: Extracted declarations</span>
            </div>
          </div>

          {/* Right Panel: Detected Fields, Bounding Box Values, & Visual Metrics */}
          <div className="md:col-span-5 p-3.5 space-y-3 text-xs overflow-y-auto">
            
            {/* Visual Checks Metrics */}
            <div className="p-2.5 bg-slate-800/60 rounded border border-slate-700/80 space-y-1.5">
              <h4 className="font-bold text-indigo-400 text-[10px] uppercase tracking-wider flex items-center gap-1.5 font-mono">
                <Box className="w-3 h-3" />
                <span>Physical Packaging Metrics (CV)</span>
              </h4>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                <div>
                  <span className="text-slate-400 block">Package Type:</span>
                  <span className="font-semibold text-slate-200">{visual.package_type}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">PDP Area:</span>
                  <span className="font-semibold text-slate-200">{visual.pdp_area_sq_cm || 200} sq cm</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Mandated Font Ht:</span>
                  <span className="font-semibold text-slate-200">{visual.minimum_font_height_mm || 2.0} mm</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Detected Font Ht:</span>
                  <span className={`font-semibold ${
                    (visual.detected_font_height_mm || 2.0) < (visual.minimum_font_height_mm || 2.0)
                      ? 'text-rose-400 font-bold'
                      : 'text-emerald-400'
                  }`}>
                    {visual.detected_font_height_mm || 2.2} mm
                  </span>
                </div>
              </div>
            </div>

            {/* Extracted Fields List */}
            <div className="space-y-1.5">
              <h4 className="font-bold text-slate-300 text-[10px] uppercase tracking-wider">
                Extracted Field Declarations ({fieldEntriesWithBbox.length})
              </h4>

              <div className="space-y-1 max-h-[160px] overflow-y-auto pr-1">
                {(Object.entries(fields) as [string, ExtractedField | undefined][]).map(([key, val]) => {
                  if (!val) {
                    return (
                      <div key={key} className="p-1.5 rounded bg-rose-950/30 border border-rose-800/40 text-[10px] flex justify-between items-center">
                        <span className="text-rose-300 font-semibold capitalize">{key.replace(/_/g, ' ')}</span>
                        <span className="text-rose-400 font-mono text-[9px]">MISSING ❌</span>
                      </div>
                    );
                  }

                  const isSelected = selectedFieldKey === key;
                  return (
                    <div
                      key={key}
                      onClick={() => setSelectedFieldKey(key)}
                      className={`p-1.5 rounded border cursor-pointer transition text-[10px] ${
                        isSelected
                          ? 'bg-indigo-600/30 border-indigo-500 text-slate-100'
                          : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-slate-200 capitalize">
                          {key.replace(/_/g, ' ')}
                        </span>
                        <span className="text-[9px] font-mono text-emerald-400">
                          {Math.round(val.confidence * 100)}% conf
                        </span>
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 truncate mt-0.5">
                        {val.value}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Raw OCR Text Snippet */}
            <div className="space-y-1">
              <h4 className="font-bold text-slate-400 text-[9px] uppercase tracking-wider flex items-center space-x-1 font-mono">
                <FileText className="w-3 h-3" />
                <span>Raw OCR Output (PaddleOCR)</span>
              </h4>
              <pre className="p-2 rounded bg-slate-950 border border-slate-800 text-[9px] font-mono text-slate-400 max-h-[80px] overflow-y-auto whitespace-pre-wrap leading-tight">
                {ocr.raw_text}
              </pre>
            </div>

          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-2.5 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 bg-slate-950/60">
          <span>
            Chain of custody logged by: <strong className="text-slate-200">{inspection.officer.name}</strong>
          </span>
          <button
            onClick={() => setSelectedEvidenceInspection(null)}
            className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white font-medium cursor-pointer"
          >
            Close Viewer
          </button>
        </div>

      </div>
    </div>
  );
};
