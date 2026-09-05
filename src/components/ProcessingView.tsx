import React from 'react';
import { useInspection } from '../context/InspectionContext';
import { Loader2, Box } from 'lucide-react';

export const ProcessingView: React.FC = () => {
  const { processingStep } = useInspection();

  return (
    <div className="min-h-[480px] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-lg border border-slate-200 p-6 shadow-sm text-center space-y-5">
        
        {/* Animated Scanner Box */}
        <div className="relative w-24 h-24 mx-auto bg-slate-950 rounded-lg border-2 border-indigo-600 flex items-center justify-center overflow-hidden shadow-inner">
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/20 via-transparent to-indigo-500/10 animate-pulse" />
          
          {/* Laser scanning line */}
          <div className="absolute left-0 right-0 h-0.5 bg-indigo-400 shadow-[0_0_10px_#6366f1] animate-bounce top-1/3" />
          
          <Box className="w-10 h-10 text-indigo-400 relative z-10" />
        </div>

        {/* Title */}
        <div className="space-y-1">
          <h2 className="text-sm font-bold text-slate-800 tracking-tight uppercase">
            Analyzing Packaged Commodity
          </h2>
          <p className="text-[11px] text-slate-500 font-mono">
            PaddleOCR & Legal Metrology PCR 2011 Validation
          </p>
        </div>

        {/* Processing step indicator */}
        <div className="p-2.5 bg-slate-50 rounded border border-slate-200 text-xs font-mono text-slate-700 flex items-center justify-center space-x-2">
          <Loader2 className="w-4 h-4 text-indigo-600 animate-spin shrink-0" />
          <span className="truncate">{processingStep || 'Processing package declarations...'}</span>
        </div>

        {/* Step checklist */}
        <div className="text-left space-y-2 text-[11px] text-slate-600 border-t border-slate-100 pt-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Rectangular package geometry verification (V1 Scope)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span>PaddleOCR text bounding box recognition</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-slate-300" />
            <span>Schedule II font size & readability checking</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-slate-300" />
            <span>Rule 6 mandatory declaration completeness verification</span>
          </div>
        </div>

        <p className="text-[10px] text-slate-400 italic font-mono">
          Contract: POST /analyze • Average processing latency ~1.8s
        </p>
      </div>
    </div>
  );
};
