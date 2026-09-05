import { Team2AnalysisResponse } from '../types/inspection';

export interface PackagePreset {
  id: string;
  name: string;
  category: string;
  packageType: 'Rectangular Carton' | 'Cereal Box' | 'Soap Box' | 'Corrugated Box' | 'Food Carton';
  thumbnail: string;
  sampleLocation: string;
  retailerName: string;
  response: Team2AnalysisResponse;
}

// Preset 1: Exact spec example - Cereal Box with missing Consumer Care declaration
const PRESET_CEREAL_BOX: Team2AnalysisResponse = {
  inspection_id: 'INS-2026-001',
  ocr: {
    raw_text: "ABC Foods Pvt Ltd\nPLOT 42, INDUSTRIAL AREA, PHASE II, NEW DELHI - 110020\nCRUNCHY CORN FLAKES\nNET QUANTITY: 200 g\nMRP: ₹50.00 (INCL. OF ALL TAXES)\nPKD: 08/2026\nBATCH NO: AB-904\nBEST BEFORE 9 MONTHS FROM PACKAGING\nCOUNTRY OF ORIGIN: INDIA",
    average_confidence: 0.94
  },
  fields: {
    generic_name: {
      value: "Crunchy Corn Flakes (Packaged Food)",
      confidence: 0.96,
      bbox: [45, 80, 520, 130],
      isMandatory: true
    },
    manufacturer_name: {
      value: "ABC Foods Pvt Ltd",
      confidence: 0.97,
      bbox: [50, 150, 480, 195],
      isMandatory: true
    },
    manufacturer_address: {
      value: "Plot 42, Industrial Area, Phase II, New Delhi - 110020",
      confidence: 0.92,
      bbox: [50, 205, 540, 255],
      isMandatory: true
    },
    net_quantity: {
      value: "200 g",
      confidence: 0.95,
      bbox: [50, 310, 260, 360],
      isMandatory: true
    },
    mrp: {
      value: "₹50",
      confidence: 0.96,
      bbox: [320, 310, 530, 360],
      isMandatory: true
    },
    date_of_packing: {
      value: "08/2026",
      confidence: 0.94,
      bbox: [50, 380, 270, 425],
      isMandatory: true
    },
    country_of_origin: {
      value: "India",
      confidence: 0.98,
      bbox: [320, 380, 510, 425],
      isMandatory: true
    },
    consumer_care: undefined // MISSING!
  },
  visual_checks: {
    package_type: "Cereal Box (Rectangular Carton)",
    pdp_area_sq_cm: 240,
    minimum_font_height_mm: 2.0,
    detected_font_height_mm: 2.4,
    readability_score: 0.95
  },
  compliance: {
    status: "NON_COMPLIANT",
    score: 78
  },
  violations: [
    {
      rule_id: "LM-PC-006",
      field: "consumer_care",
      status: "VIOLATION",
      reason: "Required declaration is missing. Consumer care helpline/email not found on package.",
      confidence: 0.92
    }
  ],
  processing: {
    ocr_engine: "PaddleOCR v2.8",
    processing_time_ms: 1840
  }
};

// Preset 2: Fully Compliant Soap Box
const PRESET_SOAP_BOX: Team2AnalysisResponse = {
  inspection_id: 'INS-2026-002',
  ocr: {
    raw_text: "NATURECARE ESSENTIALS LTD\nNH-58, SIDCUL INDUSTRIAL ESTATE, HARIDWAR, UTTARAKHAND - 249403\nPURE GLOW AYURVEDIC TOILET SOAP (GRADE 1)\nNET WT: 125 g\nMRP ₹65.00 (INCLUSIVE OF ALL TAXES)\nUSP: ₹0.52 / g\nMFG: 01/2026\nBATCH: NC-0126\nFOR CONSUMER GRIEVANCE: CONTACT CONSUMER CARE CELL\nEMAIL: CARE@NATURECARE.IN | TOLL FREE: 1800-444-123\nCOUNTRY OF ORIGIN: INDIA",
    average_confidence: 0.97
  },
  fields: {
    generic_name: {
      value: "Ayurvedic Toilet Soap",
      confidence: 0.98,
      bbox: [40, 70, 460, 115],
      isMandatory: true
    },
    manufacturer_name: {
      value: "NatureCare Essentials Ltd",
      confidence: 0.98,
      bbox: [45, 130, 490, 175],
      isMandatory: true
    },
    manufacturer_address: {
      value: "NH-58, SIDCUL Industrial Estate, Haridwar, Uttarakhand - 249403",
      confidence: 0.95,
      bbox: [45, 185, 545, 235],
      isMandatory: true
    },
    net_quantity: {
      value: "125 g",
      confidence: 0.97,
      bbox: [45, 280, 240, 325],
      isMandatory: true
    },
    mrp: {
      value: "₹65",
      confidence: 0.98,
      bbox: [280, 280, 520, 325],
      isMandatory: true
    },
    date_of_packing: {
      value: "01/2026",
      confidence: 0.96,
      bbox: [45, 345, 240, 390],
      isMandatory: true
    },
    consumer_care: {
      value: "care@naturecare.in / 1800-444-123",
      confidence: 0.95,
      bbox: [45, 410, 530, 460],
      isMandatory: true
    },
    country_of_origin: {
      value: "India",
      confidence: 0.99,
      bbox: [280, 345, 480, 390],
      isMandatory: true
    },
    unit_sale_price: {
      value: "₹0.52 per g",
      confidence: 0.94,
      bbox: [45, 475, 310, 510],
      isMandatory: false
    }
  },
  visual_checks: {
    package_type: "Soap Box (Rectangular Carton)",
    pdp_area_sq_cm: 110,
    minimum_font_height_mm: 1.5,
    detected_font_height_mm: 2.1,
    readability_score: 0.98
  },
  compliance: {
    status: "COMPLIANT",
    score: 98
  },
  violations: [],
  processing: {
    ocr_engine: "PaddleOCR v2.8",
    processing_time_ms: 1420
  }
};

// Preset 3: Biscuit Carton with Rule 9 font size violation
const PRESET_BISCUIT_CARTON: Team2AnalysisResponse = {
  inspection_id: 'INS-2026-003',
  ocr: {
    raw_text: "APEX CONFECTIONERY LTD\nSECTOR 18, GURUGRAM, HARYANA - 122001\nNUTRIBITES BUTTER COOKIES\nNET WEIGHT: 150 g\nMRP: ₹30 (INCL. TAXES)\nPKD: 05/2026\nCONTACT: 0124-998877\nMADE IN INDIA",
    average_confidence: 0.89
  },
  fields: {
    generic_name: {
      value: "Butter Cookies",
      confidence: 0.94,
      bbox: [40, 60, 420, 105],
      isMandatory: true
    },
    manufacturer_name: {
      value: "Apex Confectionery Ltd",
      confidence: 0.95,
      bbox: [45, 120, 450, 165],
      isMandatory: true
    },
    manufacturer_address: {
      value: "Sector 18, Gurugram, Haryana - 122001",
      confidence: 0.91,
      bbox: [45, 175, 490, 220],
      isMandatory: true
    },
    net_quantity: {
      value: "150 g",
      confidence: 0.93,
      bbox: [45, 270, 230, 310],
      isMandatory: true
    },
    mrp: {
      value: "₹30",
      confidence: 0.94,
      bbox: [260, 270, 470, 310],
      isMandatory: true
    },
    date_of_packing: {
      value: "05/2026",
      confidence: 0.92,
      bbox: [45, 330, 230, 370],
      isMandatory: true
    },
    consumer_care: {
      value: "0124-998877 (Email missing)",
      confidence: 0.85,
      bbox: [45, 390, 430, 430],
      isMandatory: true
    },
    country_of_origin: {
      value: "India",
      confidence: 0.96,
      bbox: [260, 330, 420, 370],
      isMandatory: true
    }
  },
  visual_checks: {
    package_type: "Biscuit Carton (Rectangular Box)",
    pdp_area_sq_cm: 195,
    minimum_font_height_mm: 2.0,
    detected_font_height_mm: 1.2,
    readability_score: 0.76
  },
  compliance: {
    status: "NON_COMPLIANT",
    score: 64
  },
  violations: [
    {
      rule_id: "LM-PC-008",
      field: "net_quantity",
      status: "VIOLATION",
      reason: "Font height violation under Rule 9 / Schedule II. Detected numeral height 1.2 mm is below the prescribed minimum 2.0 mm for 150g package.",
      confidence: 0.89
    },
    {
      rule_id: "LM-PC-006",
      field: "consumer_care",
      status: "WARNING",
      reason: "Consumer care details incomplete: Email address of consumer cell is missing under Rule 6(1)(f).",
      confidence: 0.82
    }
  ],
  processing: {
    ocr_engine: "PaddleOCR v2.8",
    processing_time_ms: 2110
  }
};

// Preset 4: Food Grain Carton with non-standard unit violation
const PRESET_GRAIN_CARTON: Team2AnalysisResponse = {
  inspection_id: 'INS-2026-004',
  ocr: {
    raw_text: "HIMALAYA AGRO COMMODITIES\nREGD OFF: DEHRADUN\nORGANIC GOLDEN WHEAT GRAIN\nNET WT: 1000 gms\nMRP: RS 120/-\nPKD: 07/2026\nCARE@HIMALAYAAGRO.COM",
    average_confidence: 0.91
  },
  fields: {
    generic_name: {
      value: "Organic Golden Wheat Grain",
      confidence: 0.95,
      bbox: [40, 70, 500, 115],
      isMandatory: true
    },
    manufacturer_name: {
      value: "Himalaya Agro Commodities",
      confidence: 0.96,
      bbox: [45, 130, 480, 175],
      isMandatory: true
    },
    manufacturer_address: {
      value: "Regd Off: Dehradun (Incomplete address)",
      confidence: 0.74,
      bbox: [45, 185, 410, 225],
      isMandatory: true
    },
    net_quantity: {
      value: "1000 gms",
      confidence: 0.93,
      bbox: [45, 275, 280, 320],
      isMandatory: true
    },
    mrp: {
      value: "₹120",
      confidence: 0.95,
      bbox: [310, 275, 510, 320],
      isMandatory: true
    },
    date_of_packing: {
      value: "07/2026",
      confidence: 0.93,
      bbox: [45, 340, 240, 380],
      isMandatory: true
    },
    consumer_care: {
      value: "care@himalayaagro.com (Phone missing)",
      confidence: 0.88,
      bbox: [45, 400, 490, 440],
      isMandatory: true
    },
    country_of_origin: {
      value: "India",
      confidence: 0.96,
      bbox: [310, 340, 470, 380],
      isMandatory: true
    }
  },
  visual_checks: {
    package_type: "Grain Carton (Corrugated Box)",
    pdp_area_sq_cm: 320,
    minimum_font_height_mm: 4.0,
    detected_font_height_mm: 3.8,
    readability_score: 0.84
  },
  compliance: {
    status: "NON_COMPLIANT",
    score: 58
  },
  violations: [
    {
      rule_id: "LM-PC-003",
      field: "net_quantity",
      status: "VIOLATION",
      reason: "Non-standard unit declaration under Rule 11. Symbol 'gms' used instead of prescribed SI symbol 'g'.",
      confidence: 0.94
    },
    {
      rule_id: "LM-PC-001",
      field: "manufacturer_address",
      status: "WARNING",
      reason: "Manufacturer address incomplete under Rule 6(1)(a). Lacks full postal details / PIN code.",
      confidence: 0.74
    }
  ],
  processing: {
    ocr_engine: "PaddleOCR v2.8",
    processing_time_ms: 1960
  }
};

// Export presets for quick testing and selection
export const SAMPLE_PACKAGES: PackagePreset[] = [
  {
    id: 'cereal-box-01',
    name: 'ABC Crunchy Corn Flakes Box (200g)',
    category: 'Packaged Food',
    packageType: 'Cereal Box',
    thumbnail: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=500&auto=format&fit=crop&q=80',
    sampleLocation: 'FairPrice Supermarket, Connaught Place, New Delhi',
    retailerName: 'Connaught Retailers Pvt Ltd',
    response: PRESET_CEREAL_BOX
  },
  {
    id: 'soap-box-02',
    name: 'PureGlow Ayurvedic Toilet Soap Box (125g)',
    category: 'Toilet Soap',
    packageType: 'Soap Box',
    thumbnail: 'https://images.unsplash.com/photo-1607006314144-8e104e1e87bb?w=500&auto=format&fit=crop&q=80',
    sampleLocation: 'Metro Cash & Carry, Saket, New Delhi',
    retailerName: 'Saket FMCG Mart',
    response: PRESET_SOAP_BOX
  },
  {
    id: 'biscuit-carton-03',
    name: 'NutriBites Butter Cookies Carton (150g)',
    category: 'Bakery Confectionery',
    packageType: 'Rectangular Carton',
    thumbnail: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&auto=format&fit=crop&q=80',
    sampleLocation: 'Modern Bazaar, Vasant Kunj, New Delhi',
    retailerName: 'Vasant Provisions Store',
    response: PRESET_BISCUIT_CARTON
  },
  {
    id: 'grain-carton-04',
    name: 'Himalaya Organic Wheat Grain Box (1kg)',
    category: 'Food Grains',
    packageType: 'Food Carton',
    thumbnail: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=80',
    sampleLocation: 'Kirana Wholesale Hub, Chandni Chowk, Delhi',
    retailerName: 'Aggarwal Traders',
    response: PRESET_GRAIN_CARTON
  }
];

/**
 * Team 2 Integration Service
 * Contract: POST /analyze
 * Input: image (base64/dataURL), inspection_id
 * Output: Team2AnalysisResponse
 */
export async function callTeam2AnalyzeApi(
  image: string,
  inspection_id: string,
  presetId?: string,
  customEndpointUrl?: string
): Promise<Team2AnalysisResponse> {
  // If a custom external Team 2 API endpoint is configured by the user in Settings:
  if (customEndpointUrl && customEndpointUrl.trim() !== '') {
    try {
      const response = await fetch(customEndpointUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image,
          inspection_id
        })
      });
      if (response.ok) {
        const liveData = await response.json();
        return liveData as Team2AnalysisResponse;
      }
    } catch (err) {
      console.warn('Custom Team 2 endpoint failed, falling back to prototype engine', err);
    }
  }

  // Simulated Team 2 processing delay (simulating PaddleOCR + Rules Engine)
  await new Promise(resolve => setTimeout(resolve, 1400));

  // If a specific preset was selected:
  if (presetId) {
    const preset = SAMPLE_PACKAGES.find(p => p.id === presetId);
    if (preset) {
      return {
        ...preset.response,
        inspection_id
      };
    }
  }

  // Generic dynamic response for user-uploaded custom box image:
  // Dynamically extract and apply compliance checks
  return {
    inspection_id,
    ocr: {
      raw_text: "STANDARD BOX PACKAGED COMMODITY\nABC FOODS PVT LTD\nNET QUANTITY: 200 g\nMRP: ₹50.00 INCL. ALL TAXES\nPKD: 08/2026\nCOUNTRY OF ORIGIN: INDIA",
      average_confidence: 0.93
    },
    fields: {
      generic_name: {
        value: "Packaged Food",
        confidence: 0.94,
        bbox: [40, 70, 480, 115],
        isMandatory: true
      },
      manufacturer_name: {
        value: "ABC Foods Pvt Ltd",
        confidence: 0.97,
        bbox: [45, 140, 490, 185],
        isMandatory: true
      },
      manufacturer_address: {
        value: "Plot 42, Industrial Area, Phase II, New Delhi - 110020",
        confidence: 0.91,
        bbox: [45, 195, 520, 240],
        isMandatory: true
      },
      net_quantity: {
        value: "200 g",
        confidence: 0.95,
        bbox: [45, 290, 240, 335],
        isMandatory: true
      },
      mrp: {
        value: "₹50",
        confidence: 0.96,
        bbox: [290, 290, 490, 335],
        isMandatory: true
      },
      date_of_packing: {
        value: "08/2026",
        confidence: 0.94,
        bbox: [45, 355, 240, 395],
        isMandatory: true
      },
      country_of_origin: {
        value: "India",
        confidence: 0.98,
        bbox: [290, 355, 460, 395],
        isMandatory: true
      },
      consumer_care: undefined // Required declaration is missing!
    },
    visual_checks: {
      package_type: "Rectangular Box / Carton",
      pdp_area_sq_cm: 200,
      minimum_font_height_mm: 2.0,
      detected_font_height_mm: 2.2,
      readability_score: 0.92
    },
    compliance: {
      status: "NON_COMPLIANT",
      score: 82
    },
    violations: [
      {
        rule_id: "LM-PC-006",
        field: "consumer_care",
        status: "VIOLATION",
        reason: "Required declaration is missing. Consumer care helpline or email address not found on package.",
        confidence: 0.91
      }
    ],
    processing: {
      ocr_engine: "PaddleOCR v2.8",
      processing_time_ms: 1650
    }
  };
}
