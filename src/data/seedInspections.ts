import { InspectionRecord } from '../types/inspection';
import { SAMPLE_PACKAGES } from '../services/team2MockService';

export const INITIAL_INSPECTIONS: InspectionRecord[] = [
  {
    id: 'INS-2026-001',
    timestamp: '2026-09-04T10:30:00Z',
    officer: {
      id: 'OFF-782',
      name: 'R. K. Sharma',
      badgeNumber: 'LM-DEL-4092',
      zone: 'Central District, New Delhi'
    },
    productDetected: 'Packaged Food (Crunchy Corn Flakes)',
    packageType: 'Cereal Box',
    imageUrl: SAMPLE_PACKAGES[0].thumbnail,
    sampleLocation: 'FairPrice Supermarket, Connaught Place, New Delhi',
    retailerName: 'Connaught Retailers Pvt Ltd',
    batchNumber: 'AB-904',
    team2Data: SAMPLE_PACKAGES[0].response,
    reviewState: 'flagged',
    officerDecision: 'PENDING',
    officerNotes: 'Advisory flag raised by system: Consumer grievance cell details missing on box. Needs physical verification of back panel.'
  },
  {
    id: 'INS-2026-002',
    timestamp: '2026-09-03T14:15:00Z',
    officer: {
      id: 'OFF-782',
      name: 'R. K. Sharma',
      badgeNumber: 'LM-DEL-4092',
      zone: 'Central District, New Delhi'
    },
    productDetected: 'Ayurvedic Toilet Soap',
    packageType: 'Soap Box',
    imageUrl: SAMPLE_PACKAGES[1].thumbnail,
    sampleLocation: 'Metro Cash & Carry, Saket, New Delhi',
    retailerName: 'Saket FMCG Mart',
    batchNumber: 'NC-0126',
    team2Data: SAMPLE_PACKAGES[1].response,
    reviewState: 'confirmed',
    officerDecision: 'DEEMED_COMPLIANT',
    officerNotes: 'All mandatory declarations verified in accordance with Rule 6 and Rule 9. No violation found.',
    reviewedAt: '2026-09-03T15:00:00Z'
  },
  {
    id: 'INS-2026-003',
    timestamp: '2026-09-02T11:45:00Z',
    officer: {
      id: 'OFF-619',
      name: 'Anita Verma',
      badgeNumber: 'LM-DEL-3108',
      zone: 'South District, New Delhi'
    },
    productDetected: 'Butter Cookies Carton',
    packageType: 'Rectangular Carton',
    imageUrl: SAMPLE_PACKAGES[2].thumbnail,
    sampleLocation: 'Modern Bazaar, Vasant Kunj, New Delhi',
    retailerName: 'Vasant Provisions Store',
    batchNumber: 'AP-552',
    team2Data: SAMPLE_PACKAGES[2].response,
    reviewState: 'confirmed',
    officerDecision: 'CONFIRMED_VIOLATION',
    officerNotes: 'Physical measurement confirmed numeral height is 1.2 mm against mandated 2.0 mm under Schedule II. Notice issued under Section 36(1).',
    reviewedAt: '2026-09-02T13:20:00Z',
    legalNoticeGenerated: true
  },
  {
    id: 'INS-2026-004',
    timestamp: '2026-09-01T16:00:00Z',
    officer: {
      id: 'OFF-619',
      name: 'Anita Verma',
      badgeNumber: 'LM-DEL-3108',
      zone: 'South District, New Delhi'
    },
    productDetected: 'Organic Wheat Grain Box',
    packageType: 'Food Carton',
    imageUrl: SAMPLE_PACKAGES[3].thumbnail,
    sampleLocation: 'Kirana Wholesale Hub, Chandni Chowk, Delhi',
    retailerName: 'Aggarwal Traders',
    batchNumber: 'HG-881',
    team2Data: SAMPLE_PACKAGES[3].response,
    reviewState: 'reviewed',
    officerDecision: 'PENDING',
    officerNotes: 'Non-standard "gms" unit detected and incomplete registered office address. Summoned distributor for physical verification.'
  },
  {
    id: 'INS-2026-005',
    timestamp: '2026-08-30T09:20:00Z',
    officer: {
      id: 'OFF-404',
      name: 'Sunil Mehta (Senior Officer)',
      badgeNumber: 'LM-HQ-1044',
      zone: 'Enforcement Directorate, HQ'
    },
    productDetected: 'Premium Detergent Bar Box',
    packageType: 'Soap Box',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80',
    sampleLocation: 'SuperMart, Rajouri Garden, New Delhi',
    retailerName: 'West Delhi Retail Hub',
    batchNumber: 'DB-204',
    team2Data: {
      inspection_id: 'INS-2026-005',
      ocr: {
        raw_text: 'SUPER DETERGENT BAR\nMRP ₹25\nNET WT 250 g\nMFG: HINDUSTAN FMCG\nPKD 06/2026',
        average_confidence: 0.96
      },
      fields: {
        generic_name: { value: 'Detergent Bar', confidence: 0.98, bbox: [40, 50, 400, 90], isMandatory: true },
        manufacturer_name: { value: 'Hindustan FMCG Ltd', confidence: 0.97, bbox: [40, 100, 420, 140], isMandatory: true },
        net_quantity: { value: '250 g', confidence: 0.98, bbox: [40, 200, 200, 240], isMandatory: true },
        mrp: { value: '₹25', confidence: 0.98, bbox: [220, 200, 380, 240], isMandatory: true },
        date_of_packing: { value: '06/2026', confidence: 0.95, bbox: [40, 260, 220, 300], isMandatory: true }
      },
      visual_checks: {
        package_type: 'Soap Box',
        pdp_area_sq_cm: 140,
        minimum_font_height_mm: 2.0,
        detected_font_height_mm: 2.3,
        readability_score: 0.96
      },
      compliance: {
        status: 'COMPLIANT',
        score: 96
      },
      violations: [],
      processing: {
        ocr_engine: 'PaddleOCR v2.8',
        processing_time_ms: 1310
      }
    },
    reviewState: 'dismissed',
    officerDecision: 'DEEMED_COMPLIANT',
    officerNotes: 'False-positive flag on consumer care dismissed; phone and address verified on side gusset of the carton.',
    reviewedAt: '2026-08-30T10:15:00Z'
  }
];
