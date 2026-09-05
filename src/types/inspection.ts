// Types strictly aligned with the Team 2 Integration Contract and SIH 26034 Project Specification

export type UserRole = 'inspector' | 'senior_officer' | 'admin';

export interface OfficerProfile {
  id: string;
  name: string;
  designation: string;
  badgeNumber: string;
  zone: string;
  role: UserRole;
  email: string;
}

export type ComplianceStatus = 'COMPLIANT' | 'NON_COMPLIANT';

export type ReviewState = 'flagged' | 'reviewed' | 'confirmed' | 'dismissed';

export interface BoundingBox {
  // [ymin, xmin, ymax, xmax] or [x, y, width, height]
  // In Team 2 spec: [x1, y1, x2, y2]
  0: number;
  1: number;
  2: number;
  3: number;
}

export interface ExtractedField {
  value: string;
  confidence: number;
  bbox?: [number, number, number, number];
  isMandatory?: boolean;
}

export interface ViolationItem {
  rule_id: string;
  field: string;
  status: 'VIOLATION' | 'WARNING' | 'FAIL';
  reason: string;
  confidence: number;
}

export interface VisualChecks {
  package_type: string;
  pdp_area_sq_cm?: number;
  minimum_font_height_mm?: number;
  detected_font_height_mm?: number;
  readability_score?: number;
}

export interface ProcessingMeta {
  ocr_engine: string;
  processing_time_ms: number;
}

export interface OcrData {
  raw_text: string;
  average_confidence: number;
}

// Exact Team 2 Integration Contract Output
export interface Team2AnalysisResponse {
  inspection_id: string;
  ocr: OcrData;
  fields: {
    manufacturer_name?: ExtractedField;
    manufacturer_address?: ExtractedField;
    net_quantity?: ExtractedField;
    mrp?: ExtractedField;
    date_of_packing?: ExtractedField;
    consumer_care?: ExtractedField;
    generic_name?: ExtractedField;
    country_of_origin?: ExtractedField;
    best_before?: ExtractedField;
    unit_sale_price?: ExtractedField;
    [key: string]: ExtractedField | undefined;
  };
  visual_checks: VisualChecks;
  compliance: {
    status: ComplianceStatus;
    score: number;
  };
  violations: ViolationItem[];
  processing: ProcessingMeta;
}

// Full Inspection Record in Platform Repository
export interface InspectionRecord {
  id: string;
  timestamp: string;
  officer: {
    id: string;
    name: string;
    badgeNumber: string;
    zone: string;
  };
  productDetected: string;
  packageType: 'Rectangular Carton' | 'Cereal Box' | 'Soap Box' | 'Corrugated Box' | 'Food Carton';
  imageUrl: string;
  sampleLocation: string;
  retailerName?: string;
  batchNumber?: string;
  team2Data: Team2AnalysisResponse;
  reviewState: ReviewState;
  officerDecision?: 'CONFIRMED_VIOLATION' | 'DEEMED_COMPLIANT' | 'PENDING';
  officerNotes?: string;
  reviewedAt?: string;
  legalNoticeGenerated?: boolean;
}

export interface ComplianceRule {
  id: string;
  ruleNumber: string;
  title: string;
  category: 'Mandatory Declaration' | 'Font Size & Readability' | 'MRP & Pricing' | 'Net Quantity' | 'Consumer Grievance';
  description: string;
  section: string;
  prescribedRequirement: string;
  penaltySection: string;
}
