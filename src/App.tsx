import React, { useState } from 'react';
import { InspectionProvider, useInspection, ActiveNavTab } from './context/InspectionContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { CameraCapture } from './components/CameraCapture';
import { ProcessingView } from './components/ProcessingView';
import { InspectionResultView } from './components/InspectionResultView';
import { InspectionHistoryView } from './components/InspectionHistoryView';
import { ManufacturersView } from './components/ManufacturersView';
import { ReportsView } from './components/ReportsView';
import { RulesReferenceView } from './components/RulesReferenceView';
import { SettingsView } from './components/SettingsView';
import { EvidenceModal } from './components/EvidenceModal';
import { RuleDetailModal } from './components/RuleDetailModal';
import {
  LayoutDashboard,
  Camera,
  History,
  Building2,
  FileText,
  BookOpen,
  Settings,
  Menu,
  X
} from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { activeTab, setActiveTab, currentInspection, isProcessing, inspections } = useInspection();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pendingCount = inspections.filter(i => i.reviewState === 'flagged' || i.reviewState === 'reviewed').length;

  const mobileNavItems: { id: ActiveNavTab; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'new-inspection', label: 'Inspect', icon: Camera },
    { id: 'history', label: 'History', icon: History, badge: pendingCount > 0 ? pendingCount : undefined },
    { id: 'manufacturers', label: 'Mfrs', icon: Building2 },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'rules', label: 'Rules', icon: BookOpen },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 antialiased selection:bg-indigo-600 selection:text-white">
      {/* Header */}
      <Header />

      {/* Main Layout Container */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 md:hidden bg-slate-950/70 backdrop-blur-sm flex">
            <div className="w-64 bg-slate-900 h-full p-4 flex flex-col justify-between text-white">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Navigation Menu
                  </span>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 rounded text-slate-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-1">
                  {mobileNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition ${
                          isActive
                            ? 'bg-indigo-600 text-white font-bold'
                            : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                          <span>{item.label}</span>
                        </div>
                        {item.badge !== undefined && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-700 text-white">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
          </div>
        )}

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-5 lg:p-6">
          
          {/* Mobile Drawer Toggle & View Indicator */}
          <div className="md:hidden flex items-center justify-between mb-4 pb-2 border-b border-slate-200">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-semibold flex items-center space-x-1.5 shadow-sm"
            >
              <Menu className="w-4 h-4" />
              <span>Menu</span>
            </button>
            <span className="text-xs font-bold text-slate-700 capitalize font-mono">
              {activeTab.replace('-', ' ')}
            </span>
          </div>

          {/* Core View Switcher */}
          {isProcessing ? (
            <ProcessingView />
          ) : (
            <>
              {activeTab === 'dashboard' && <DashboardView />}
              
              {activeTab === 'new-inspection' && (
                currentInspection ? <InspectionResultView /> : <CameraCapture />
              )}

              {activeTab === 'history' && <InspectionHistoryView />}
              {activeTab === 'manufacturers' && <ManufacturersView />}
              {activeTab === 'reports' && <ReportsView />}
              {activeTab === 'rules' && <RulesReferenceView />}
              {activeTab === 'settings' && <SettingsView />}
            </>
          )}

        </main>
      </div>

      {/* Mobile Bottom Navigation Bar for Field Inspectors */}
      <div className="md:hidden sticky bottom-0 z-30 bg-slate-900 border-t border-slate-800 flex items-center justify-around py-2 px-1 text-white">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center text-[10px] py-1 px-2 rounded ${
            activeTab === 'dashboard' ? 'text-indigo-400 font-bold' : 'text-slate-400'
          }`}
        >
          <LayoutDashboard className="w-4 h-4 mb-0.5" />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab('new-inspection')}
          className={`flex flex-col items-center text-[10px] py-1 px-3 rounded ${
            activeTab === 'new-inspection'
              ? 'text-indigo-300 font-bold'
              : 'text-indigo-400/80 hover:text-indigo-300'
          }`}
        >
          <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold mb-0.5 shadow-sm">
            <Camera className="w-4 h-4" />
          </div>
          <span className="text-indigo-300 font-bold">Inspect</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex flex-col items-center text-[10px] py-1 px-2 rounded relative ${
            activeTab === 'history' ? 'text-indigo-400 font-bold' : 'text-slate-400'
          }`}
        >
          <History className="w-4 h-4 mb-0.5" />
          <span>History</span>
          {pendingCount > 0 && (
            <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-indigo-500" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`flex flex-col items-center text-[10px] py-1 px-2 rounded ${
            activeTab === 'reports' ? 'text-indigo-400 font-bold' : 'text-slate-400'
          }`}
        >
          <FileText className="w-4 h-4 mb-0.5" />
          <span>Reports</span>
        </button>

        <button
          onClick={() => setActiveTab('rules')}
          className={`flex flex-col items-center text-[10px] py-1 px-2 rounded ${
            activeTab === 'rules' ? 'text-indigo-400 font-bold' : 'text-slate-400'
          }`}
        >
          <BookOpen className="w-4 h-4 mb-0.5" />
          <span>Rules</span>
        </button>
      </div>

      {/* Global Modals */}
      <EvidenceModal />
      <RuleDetailModal />
    </div>
  );
};

export default function App() {
  return (
    <InspectionProvider>
      <MainAppContent />
    </InspectionProvider>
  );
}
