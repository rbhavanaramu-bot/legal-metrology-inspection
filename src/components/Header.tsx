import React, { useState } from 'react';
import { useInspection, DEFAULT_OFFICERS } from '../context/InspectionContext';
import { Search, Shield, ChevronDown, CheckCircle2 } from 'lucide-react';

export const Header: React.FC = () => {
  const { officer, setOfficer, searchQuery, setSearchQuery, setActiveTab } = useInspection();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [advisoryInfoOpen, setAdvisoryInfoOpen] = useState(false);

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 shrink-0 sticky top-0 z-30 select-none">
      {/* Brand & Logo */}
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => setActiveTab('dashboard')}
      >
        <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center shrink-0 shadow-xs">
          <div className="w-4 h-4 border-2 border-white rounded-xs"></div>
        </div>
        <div>
          <span className="font-bold text-base sm:text-lg tracking-tight text-slate-800 uppercase">
            Legal Metrology <span className="text-indigo-600">Inspect</span>
          </span>
          <span className="hidden lg:inline-block ml-2 text-[10px] font-mono font-medium text-slate-400">
            PCR 2011 • V1 Box Packaging
          </span>
        </div>
      </div>

      {/* Global Search Bar (High Density Pill Style) */}
      <div className="flex-1 max-w-md px-4 sm:px-8 hidden md:block">
        <div className="relative">
          <div className="absolute left-3 top-2.5 text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search inspections, manufacturers..."
            className="w-full bg-slate-100 border-none rounded-full py-1.5 pl-10 pr-4 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2 text-slate-400 hover:text-slate-600 text-xs font-medium"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Right Controls: Advisory Pill + Officer Profile Switcher */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Advisory Principle Badge */}
        <div className="relative">
          <button
            onClick={() => setAdvisoryInfoOpen(!advisoryInfoOpen)}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs transition font-medium"
            title="Advisory Human-in-the-Loop Principle"
          >
            <Shield className="w-3.5 h-3.5 text-indigo-600" />
            <span className="text-[11px] text-slate-700">Advisory Mode</span>
          </button>

          {advisoryInfoOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-lg shadow-xl p-3.5 z-50 text-xs text-slate-800">
              <div className="flex items-center justify-between mb-2 font-bold text-indigo-900 border-b border-slate-100 pb-2">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-indigo-600" /> Human-in-the-Loop Principle
                </span>
                <button
                  onClick={() => setAdvisoryInfoOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Under SIH 26034 specifications, this software is strictly <strong>advisory</strong>.
                The system outputs confidence-scored flags and never makes final legal determinations.
              </p>
              <div className="mt-2.5 p-2 bg-slate-50 rounded border border-slate-200 font-mono text-[10px] text-indigo-700 flex justify-between items-center text-center">
                <span>flagged</span>
                <span>→</span>
                <span>reviewed</span>
                <span>→</span>
                <span>confirmed / dismissed</span>
              </div>
              <p className="mt-2 text-[10px] text-slate-400 italic">
                Only the inspecting officer holds final authority for legal determination under Legal Metrology Act, 2009.
              </p>
            </div>
          )}
        </div>

        {/* Officer Switcher */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-3 p-1 rounded-lg hover:bg-slate-50 transition text-left cursor-pointer"
          >
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-slate-800 leading-tight">{officer.name}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">
                {officer.designation}, {officer.zone}
              </p>
            </div>
            <div className="w-9 h-9 bg-slate-200 rounded-full border-2 border-indigo-100 flex items-center justify-center font-bold text-xs text-indigo-700 shadow-2xs">
              {officer.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-lg shadow-xl py-2 z-50">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Active Officer Account
                </p>
                <p className="text-xs font-bold text-slate-900 mt-0.5">{officer.name}</p>
                <p className="text-[11px] text-slate-500">{officer.designation}</p>
                <p className="text-[11px] text-indigo-600 font-mono mt-0.5">{officer.zone}</p>
              </div>

              <div className="px-2 py-1.5">
                <p className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Switch User Role
                </p>
                {DEFAULT_OFFICERS.map((off) => (
                  <button
                    key={off.id}
                    onClick={() => {
                      setOfficer(off);
                      setProfileDropdownOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded text-xs flex items-center justify-between transition ${
                      officer.id === off.id
                        ? 'bg-indigo-50 text-indigo-700 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="font-medium">{off.name}</div>
                      <div className="text-[10px] text-slate-400">
                        {off.role === 'inspector'
                          ? 'Field Inspector'
                          : off.role === 'senior_officer'
                          ? 'Senior Officer'
                          : 'Super Admin'}
                      </div>
                    </div>
                    {officer.id === off.id && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
