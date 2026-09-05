import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  InspectionRecord,
  OfficerProfile,
  ComplianceRule,
  ReviewState,
  Team2AnalysisResponse
} from '../types/inspection';
import { INITIAL_INSPECTIONS } from '../data/seedInspections';
import { callTeam2AnalyzeApi, SAMPLE_PACKAGES } from '../services/team2MockService';
import { LEGAL_METROLOGY_RULES } from '../data/rulesData';

export type ActiveNavTab =
  | 'dashboard'
  | 'new-inspection'
  | 'history'
  | 'manufacturers'
  | 'reports'
  | 'rules'
  | 'settings';

export interface AppSettings {
  team2EndpointUrl: string;
  ocrConfidenceThreshold: number;
  enableSoundEffects: boolean;
  districtZone: string;
  v1PackagingConstraint: boolean; // Rectangular/box only
}

export const DEFAULT_OFFICERS: OfficerProfile[] = [
  {
    id: 'OFF-782',
    name: 'R. K. Sharma',
    designation: 'Legal Metrology Inspector (Grade I)',
    badgeNumber: 'LM-DEL-4092',
    zone: 'Central Enforcement Zone, New Delhi',
    role: 'inspector',
    email: 'rk.sharma@lm.gov.in'
  },
  {
    id: 'OFF-619',
    name: 'Anita Verma',
    designation: 'Assistant Controller / Senior Enforcement Officer',
    badgeNumber: 'LM-DEL-3108',
    zone: 'South Enforcement Zone, New Delhi',
    role: 'senior_officer',
    email: 'anita.verma@lm.gov.in'
  },
  {
    id: 'OFF-404',
    name: 'Sunil Mehta',
    designation: 'Joint Director & Compliance Auditor',
    badgeNumber: 'LM-HQ-1044',
    zone: 'Headquarters & Directorate',
    role: 'admin',
    email: 's.mehta@lm.gov.in'
  }
];

interface InspectionContextType {
  inspections: InspectionRecord[];
  activeTab: ActiveNavTab;
  setActiveTab: (tab: ActiveNavTab) => void;
  officer: OfficerProfile;
  setOfficer: (officer: OfficerProfile) => void;
  currentInspection: InspectionRecord | null;
  setCurrentInspection: (record: InspectionRecord | null) => void;
  isProcessing: boolean;
  processingStep: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedRuleForModal: ComplianceRule | null;
  setSelectedRuleForModal: (rule: ComplianceRule | null) => void;
  selectedEvidenceInspection: InspectionRecord | null;
  setSelectedEvidenceInspection: (inspection: InspectionRecord | null) => void;
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  startNewInspection: () => void;
  runAnalysis: (image: string, packageType: InspectionRecord['packageType'], presetId?: string, locationDetails?: { sampleLocation?: string; retailerName?: string; batchNumber?: string }) => Promise<InspectionRecord>;
  updateInspectionReview: (id: string, reviewState: ReviewState, decision: 'CONFIRMED_VIOLATION' | 'DEEMED_COMPLIANT' | 'PENDING', notes: string) => void;
  saveCurrentInspection: () => void;
  findRuleById: (ruleId: string) => ComplianceRule | undefined;
  getInspectionById: (id: string) => InspectionRecord | undefined;
}

const InspectionContext = createContext<InspectionContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'lm_inspections_repo_v1';
const SETTINGS_KEY = 'lm_settings_v1';

export const InspectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [inspections, setInspections] = useState<InspectionRecord[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_INSPECTIONS;
  });

  const [activeTab, setActiveTab] = useState<ActiveNavTab>('dashboard');
  const [officer, setOfficer] = useState<OfficerProfile>(DEFAULT_OFFICERS[0]);
  const [currentInspection, setCurrentInspection] = useState<InspectionRecord | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRuleForModal, setSelectedRuleForModal] = useState<ComplianceRule | null>(null);
  const [selectedEvidenceInspection, setSelectedEvidenceInspection] = useState<InspectionRecord | null>(null);

  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {
      team2EndpointUrl: '',
      ocrConfidenceThreshold: 0.85,
      enableSoundEffects: true,
      districtZone: 'Central District, New Delhi',
      v1PackagingConstraint: true
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(inspections));
    } catch (e) {
      console.error(e);
    }
  }, [inspections]);

  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  }, [settings]);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const startNewInspection = () => {
    setCurrentInspection(null);
    setActiveTab('new-inspection');
  };

  const runAnalysis = async (
    image: string,
    packageType: InspectionRecord['packageType'],
    presetId?: string,
    locationDetails?: { sampleLocation?: string; retailerName?: string; batchNumber?: string }
  ): Promise<InspectionRecord> => {
    setIsProcessing(true);
    setProcessingStep('1/4: Rectangular package boundary detected...');

    const newId = `INS-2026-${String(inspections.length + 1).padStart(3, '0')}`;

    // Simulate OCR processing steps
    await new Promise(r => setTimeout(r, 450));
    setProcessingStep('2/4: Initializing PaddleOCR & extracting text declarations...');

    await new Promise(r => setTimeout(r, 550));
    setProcessingStep('3/4: Legal Metrology Rules 2011 compliance evaluation...');

    const team2Data: Team2AnalysisResponse = await callTeam2AnalyzeApi(
      image,
      newId,
      presetId,
      settings.team2EndpointUrl
    );

    setProcessingStep('4/4: Formatting advisory inspection flags...');
    await new Promise(r => setTimeout(r, 300));

    // Determine product category detected
    const productDetected = team2Data.fields.generic_name?.value || 'Packaged Commodity (Box)';

    const newRecord: InspectionRecord = {
      id: newId,
      timestamp: new Date().toISOString(),
      officer: {
        id: officer.id,
        name: officer.name,
        badgeNumber: officer.badgeNumber,
        zone: officer.zone
      },
      productDetected,
      packageType,
      imageUrl: image || SAMPLE_PACKAGES[0].thumbnail,
      sampleLocation: locationDetails?.sampleLocation || `${officer.zone} Market Inspection`,
      retailerName: locationDetails?.retailerName || 'Local Retail Establishment',
      batchNumber: locationDetails?.batchNumber || `LOT-${Math.floor(1000 + Math.random() * 9000)}`,
      team2Data,
      reviewState: 'flagged', // Human-in-the-loop: starts in 'flagged' state
      officerDecision: 'PENDING',
      officerNotes: team2Data.compliance.status === 'NON_COMPLIANT'
        ? `Advisory flag: Potential non-compliance identified by automated rule-check. Pending officer verification.`
        : `Initial scan compliant. Verification pending final officer sign-off.`
    };

    setCurrentInspection(newRecord);
    setIsProcessing(false);
    return newRecord;
  };

  const updateInspectionReview = (
    id: string,
    reviewState: ReviewState,
    decision: 'CONFIRMED_VIOLATION' | 'DEEMED_COMPLIANT' | 'PENDING',
    notes: string
  ) => {
    setInspections(prev =>
      prev.map(item => {
        if (item.id === id) {
          return {
            ...item,
            reviewState,
            officerDecision: decision,
            officerNotes: notes,
            reviewedAt: new Date().toISOString()
          };
        }
        return item;
      })
    );

    if (currentInspection && currentInspection.id === id) {
      setCurrentInspection(prev =>
        prev
          ? {
              ...prev,
              reviewState,
              officerDecision: decision,
              officerNotes: notes,
              reviewedAt: new Date().toISOString()
            }
          : null
      );
    }
  };

  const saveCurrentInspection = () => {
    if (!currentInspection) return;

    // Check if already in repository
    setInspections(prev => {
      const exists = prev.some(item => item.id === currentInspection.id);
      if (exists) {
        return prev.map(item => (item.id === currentInspection.id ? currentInspection : item));
      }
      return [currentInspection, ...prev];
    });

    // Move to history or stay on result
    setActiveTab('history');
  };

  const findRuleById = (ruleId: string) => {
    return LEGAL_METROLOGY_RULES.find(r => r.id === ruleId || r.ruleNumber.includes(ruleId));
  };

  const getInspectionById = (id: string) => {
    return inspections.find(i => i.id === id);
  };

  return (
    <InspectionContext.Provider
      value={{
        inspections,
        activeTab,
        setActiveTab,
        officer,
        setOfficer,
        currentInspection,
        setCurrentInspection,
        isProcessing,
        processingStep,
        searchQuery,
        setSearchQuery,
        selectedRuleForModal,
        setSelectedRuleForModal,
        selectedEvidenceInspection,
        setSelectedEvidenceInspection,
        settings,
        updateSettings,
        startNewInspection,
        runAnalysis,
        updateInspectionReview,
        saveCurrentInspection,
        findRuleById,
        getInspectionById
      }}
    >
      {children}
    </InspectionContext.Provider>
  );
};

export const useInspection = () => {
  const context = useContext(InspectionContext);
  if (!context) {
    throw new Error('useInspection must be used within an InspectionProvider');
  }
  return context;
};
