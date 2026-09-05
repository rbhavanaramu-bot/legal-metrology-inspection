import { ComplianceRule } from '../types/inspection';

export const LEGAL_METROLOGY_RULES: ComplianceRule[] = [
  {
    id: 'LM-PC-001',
    ruleNumber: 'Rule 6(1)(a)',
    title: 'Manufacturer / Packer / Importer Identity & Address',
    category: 'Mandatory Declaration',
    description: 'Every package shall bear the name and complete address of the manufacturer, or where manufacturer is not the packer, the name and address of the manufacturer and packer, or for imported goods, the importer.',
    section: 'Legal Metrology (Packaged Commodities) Rules, 2011 - Rule 6(1)(a)',
    prescribedRequirement: 'Complete postal address including premises number, street, city, state, pin code or official customer address.',
    penaltySection: 'Section 36(1) of Legal Metrology Act, 2009 (Fine up to ₹25,000 for first offence, ₹50,000 second offence, ₹1,00,000 or imprisonment thereafter).'
  },
  {
    id: 'LM-PC-002',
    ruleNumber: 'Rule 6(1)(b)',
    title: 'Common or Generic Name of Commodity',
    category: 'Mandatory Declaration',
    description: 'The common or generic name of the commodity contained in the package must be prominently displayed on the Principal Display Panel (PDP).',
    section: 'Legal Metrology (Packaged Commodities) Rules, 2011 - Rule 6(1)(b)',
    prescribedRequirement: 'Generic classification (e.g., "Packaged Breakfast Cereal", "Toilet Soap", "Refined Edible Oil") in clear lettering.',
    penaltySection: 'Section 36(1) of Legal Metrology Act, 2009.'
  },
  {
    id: 'LM-PC-003',
    ruleNumber: 'Rule 6(1)(c) & Rule 11',
    title: 'Net Quantity in Standard SI Units',
    category: 'Net Quantity',
    description: 'The net quantity in terms of standard unit of weight or measure (g, kg, ml, l) or number must be clearly stated on the Principal Display Panel.',
    section: 'Legal Metrology (Packaged Commodities) Rules, 2011 - Rule 6(1)(c), Rule 11 & Rule 12',
    prescribedRequirement: 'Correct metric symbol without capital letters or plurals (e.g., "g" NOT "gms", "kg" NOT "kgs"). Must not qualify net quantity with misleading terms like "approximately".',
    penaltySection: 'Section 36(1) and Section 39 of Legal Metrology Act, 2009.'
  },
  {
    id: 'LM-PC-004',
    ruleNumber: 'Rule 6(1)(d)',
    title: 'Date of Packing / Manufacturing / Import',
    category: 'Mandatory Declaration',
    description: 'The month and year in which the commodity is manufactured or pre-packed or imported shall be declared on the package.',
    section: 'Legal Metrology (Packaged Commodities) Rules, 2011 - Rule 6(1)(d)',
    prescribedRequirement: 'Format: MM/YYYY or Month Year (e.g., "08/2026" or "August 2026").',
    penaltySection: 'Section 36(1) of Legal Metrology Act, 2009.'
  },
  {
    id: 'LM-PC-005',
    ruleNumber: 'Rule 6(1)(e) & Rule 18',
    title: 'Maximum Retail Price (MRP) Declaration',
    category: 'MRP & Pricing',
    description: 'Retail sale price of the package in the format "Maximum or Max. Retail Price ₹... (inclusive of all taxes)" or "MRP ₹... incl. of all taxes".',
    section: 'Legal Metrology (Packaged Commodities) Rules, 2011 - Rule 6(1)(e) & Rule 18',
    prescribedRequirement: 'Clear currency notation (₹ or Rs.), explicit statement "inclusive of all taxes", and strictly no stickers or alteration covering printed MRP.',
    penaltySection: 'Section 36(1) of Legal Metrology Act, 2009.'
  },
  {
    id: 'LM-PC-006',
    ruleNumber: 'Rule 6(1)(f)',
    title: 'Consumer Care / Grievance Redressal Mechanism',
    category: 'Consumer Grievance',
    description: 'Name, address, telephone number, and email address of the person who can be contacted by the consumer in case of complaints or consumer care cell.',
    section: 'Legal Metrology (Packaged Commodities) Rules, 2011 - Rule 6(1)(f)',
    prescribedRequirement: 'Must contain all 4 elements: Contact Person/Designation, Postal Address, Phone/Toll-free number, and Valid Email address.',
    penaltySection: 'Section 36(1) of Legal Metrology Act, 2009.'
  },
  {
    id: 'LM-PC-007',
    ruleNumber: 'Rule 6(1)(g)',
    title: 'Country of Origin Declaration',
    category: 'Mandatory Declaration',
    description: 'For imported products or pre-packed commodities, the name of the country of origin or manufacturing must be explicitly declared.',
    section: 'Legal Metrology (Packaged Commodities) Rules, 2011 - Rule 6(1)(g)',
    prescribedRequirement: 'Name of the sovereign country (e.g., "Country of Origin: India").',
    penaltySection: 'Section 36(1) of Legal Metrology Act, 2009.'
  },
  {
    id: 'LM-PC-008',
    ruleNumber: 'Rule 9 & Schedule II',
    title: 'Minimum Font Height & Numerical Size Requirements',
    category: 'Font Size & Readability',
    description: 'The height of any numeral and letter in the declaration on Principal Display Panel shall not be less than the minimum height specified in Schedule II based on package area / net quantity.',
    section: 'Legal Metrology (Packaged Commodities) Rules, 2011 - Rule 9 and Schedule II',
    prescribedRequirement: 'For net weight 200g-1kg or PDP area 100-500 sq cm, minimum numeral height is 2.0 mm (embossed/printed). Declarations must be legible, prominent, and distinct from background color.',
    penaltySection: 'Section 36(1) of Legal Metrology Act, 2009.'
  },
  {
    id: 'LM-PC-009',
    ruleNumber: 'Rule 6(1)(da)',
    title: 'Unit Sale Price (USP) Declaration',
    category: 'MRP & Pricing',
    description: 'Unit sale price in rupees rounded off to nearest two decimal places per gram/ml or per piece for packages with net quantity more than 1 kg or 1 liter.',
    section: 'Legal Metrology (Packaged Commodities) Rules, 2011 - Rule 6(1)(da)',
    prescribedRequirement: 'Declared as ₹ X.XX per g or ₹ X.XX per ml alongside the overall MRP.',
    penaltySection: 'Section 36(1) of Legal Metrology Act, 2009.'
  }
];
