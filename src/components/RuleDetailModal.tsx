import React from 'react';
import { useInspection } from '../context/InspectionContext';
import { X, Scale, ShieldAlert, CheckCircle } from 'lucide-react';

export const RuleDetailModal: React.FC = () => {
  const { selectedRuleForModal, setSelectedRuleForModal } = useInspection();

  if (!selectedRuleForModal) return null;

  const rule = selectedRuleForModal;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden text-slate-900">
        
        {/* Header */}
        <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-indigo-300 font-semibold uppercase">
                Legal Metrology (Packaged Commodities) Rules, 2011
              </span>
              <h3 className="text-xs font-bold text-white leading-tight">
                {rule.ruleNumber} • {rule.title}
              </h3>
            </div>
          </div>
          <button
            onClick={() => setSelectedRuleForModal(null)}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3.5 text-xs">
          
          {/* Statutory Category */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-slate-500 font-bold text-[10px] uppercase">Category</span>
            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px]">
              {rule.category}
            </span>
          </div>

          {/* Statutory Section */}
          <div className="space-y-1">
            <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
              Statutory Provision
            </span>
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200 font-mono text-[11px] text-slate-800">
              {rule.section}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
              Rule Mandate
            </span>
            <p className="text-slate-600 leading-relaxed text-xs">
              {rule.description}
            </p>
          </div>

          {/* Prescribed Requirement */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded space-y-1 text-amber-900">
            <span className="font-bold uppercase tracking-wider text-[10px] text-amber-800 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-amber-700" />
              <span>Prescribed Compliance Standard</span>
            </span>
            <p className="text-[11px] leading-relaxed">
              {rule.prescribedRequirement}
            </p>
          </div>

          {/* Penal Provision */}
          <div className="p-3 bg-rose-50 border border-rose-200 rounded space-y-1 text-rose-950">
            <span className="font-bold uppercase tracking-wider text-[10px] text-rose-800 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-700" />
              <span>Statutory Penalty & Compounding (Section 36)</span>
            </span>
            <p className="text-[11px] leading-relaxed">
              {rule.penaltySection}
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-2.5 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={() => setSelectedRuleForModal(null)}
            className="px-3.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer"
          >
            Dismiss
          </button>
        </div>

      </div>
    </div>
  );
};
