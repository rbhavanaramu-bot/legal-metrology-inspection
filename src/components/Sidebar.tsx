import React from 'react';
import { useInspection, ActiveNavTab } from '../context/InspectionContext';
import {
  LayoutDashboard,
  Camera,
  History,
  Building2,
  FileText,
  BookOpen,
  Settings,
  PlusCircle
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, inspections, startNewInspection } = useInspection();

  const pendingCount = inspections.filter(
    (i) => i.reviewState === 'flagged' || i.reviewState === 'reviewed'
  ).length;

  const navigationItems: {
    id: ActiveNavTab;
    label: string;
    icon: React.FC<{ className?: string }>;
    badge?: number;
  }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'new-inspection', label: 'New Inspection', icon: Camera },
    {
      id: 'history',
      label: 'Inspection History',
      icon: History,
      badge: pendingCount > 0 ? pendingCount : undefined
    },
    { id: 'manufacturers', label: 'Manufacturers', icon: Building2 }
  ];

  const resourceItems: {
    id: ActiveNavTab;
    label: string;
    icon: React.FC<{ className?: string }>;
  }[] = [
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'rules', label: 'Rule Engine (2011)', icon: BookOpen },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between shrink-0 h-[calc(100vh-3.5rem)] sticky top-14 select-none border-r border-slate-800">
      <nav className="p-4 space-y-1 flex-1 text-sm font-medium overflow-y-auto">
        
        {/* Quick Launch CTA */}
        <div className="mb-4">
          <button
            onClick={startNewInspection}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-3 rounded transition-colors text-xs shadow-sm cursor-pointer"
          >
            <Camera className="w-4 h-4 text-white" />
            <span>New Box Inspection</span>
          </button>
        </div>

        {/* Section: Navigation */}
        <div className="px-3 py-2 text-[10px] uppercase text-slate-500 font-bold tracking-wider">
          Navigation
        </div>
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs transition-colors cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-indigo-700 text-white' : 'bg-slate-800 text-indigo-300 border border-slate-700'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Section: Resources */}
        <div className="pt-4 px-3 py-2 text-[10px] uppercase text-slate-500 font-bold tracking-wider">
          Resources
        </div>
        {resourceItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded text-xs transition-colors cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* System Status Card (from Design HTML) */}
      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800 p-3 rounded-lg space-y-1">
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">
            System Status
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-xs text-white font-medium">AI Engine: Active</span>
          </div>
          <p className="text-[10px] text-slate-400 font-mono mt-1">
            PaddleOCR + OpenCV (V1 Box)
          </p>
        </div>
      </div>
    </aside>
  );
};
