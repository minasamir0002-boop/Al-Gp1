export interface KBProduct {
  id: string;
  name: string;
  molecule: string;
  company: string;
  indication: string;
  dosageForms: string[];
  strengths: string[];
  generalInfo: string;
  keyMessages: string[];
  clinicalBenefits: string[];
  safetyPoints: string[];
  competitorList: string[];
  references: string[];
  attachedDocuments: string[];
}

export type KBDocumentType = 'Clinical Study' | 'Detail Aid' | 'Guideline' | 'Competitor File' | 'Product Monograph' | 'Other';

export interface KBDocument {
  id: string;
  name: string;
  product: string;
  uploadDate: string;
  extractedObjectionsCount: number;
  status: 'Processed' | 'Pending' | 'Ready for AI' | 'Archived';
  pdfSize: string;
  documentType?: KBDocumentType;
  specialty?: string;
  version?: string;
  publishDate?: string;
  company?: string;
  tags?: string[];
  isFavorite?: boolean;
  isArchived?: boolean;
  notes?: string;
  relatedCompetitors?: string[];
  relatedObjections?: string[];
  pdfFileName?: string;
}

export type KBObjectionCategory = 'Cost' | 'Safety' | 'Efficacy' | 'Competitor' | 'Guidelines' | 'Compliance';

export interface KBObjection {
  id: string;
  title: string;
  relatedProduct: string;
  category: KBObjectionCategory;
  shortScientificAnswer: string;
  status: 'Verified' | 'Pending Review' | 'Updated';
}

export interface KBCompetitor {
  id: string;
  brandName: string;
  company: string;
  competesAgainst: string;
  mainStrength: string;
  mainWeakness: string;
}

export const SAMPLE_PRODUCTS: KBProduct[] = [
  {
    id: 'prod-1',
    name: 'Cardiovasc XL',
    molecule: 'Amlodipine Besylate + Valsartan ER',
    company: 'RepOS BioPharma',
    indication: 'Essential Hypertension & Cardiovascular Event Prevention',
    dosageForms: ['Extended-Release Tablets', 'Oral Matrix Film'],
    strengths: ['50mg / 10mg', '100mg / 10mg', '150mg / 10mg'],
    generalInfo: 'Dual-action calcium channel blocker and angiotensin II receptor blocker formulated with bimodal delayed-release beads for consistent 24-hour hemodynamic control.',
    keyMessages: [
      '24-hour steady blood pressure control with a single morning dose.',
      '32% reduction in major adverse renal events in stage 2 hypertensive cohorts.',
      'Meal-independent absorption with zero food interaction.'
    ],
    clinicalBenefits: [
      '-14.2 mmHg mean reduction in systolic blood pressure at 8 weeks.',
      'Renal protective profile verified in REPOS-3 multicenter clinical trial (2025).',
      'Significant reduction in left ventricular hypertrophy over 12 months.'
    ],
    safetyPoints: [
      'Low incidence of peripheral edema compared to generic Amlodipine monotherapy (<2.1%).',
      'Contraindicated in severe hepatic impairment, biliary cirrhosis, or pregnancy.',
      'No clinically significant QTc interval prolongation across all dosages.'
    ],
    competitorList: [
      'Entresto 200mg (Novartis)',
      'Diovan 160mg (Novartis)',
      'Norvasc 10mg (Pfizer)'
    ],
    references: [
      'Lancet Cardiology 2025; REPOS-3 Renal Subgroup Trial Analysis',
      'Journal of the American College of Cardiology (JACC) 2024; Ambulatory 24-hr Blood Pressure Monitoring',
      'New England Journal of Medicine 2023; Long-term ARB Renal Outcomes'
    ],
    attachedDocuments: [
      'REPOS-3 Trial Full Published PDF',
      'Cardiovasc XL Prescribing Monograph & Titration Guide',
      'Renal Impairment Dosing Quick Reference Chart'
    ]
  },
  {
    id: 'prod-2',
    name: 'GlycaNorm Dual',
    molecule: 'Empagliflozin + Linagliptin Dual Matrix',
    company: 'RepOS BioPharma',
    indication: 'Type 2 Diabetes Mellitus with High Cardiovascular & Renal Risk',
    dosageForms: ['Enteric-Coated Bilayer Tablets'],
    strengths: ['10mg / 5mg', '25mg / 5mg'],
    generalInfo: 'Fixed-dose combination of a sodium-glucose co-transporter 2 (SGLT2) inhibitor and dipeptidyl peptidase-4 (DPP-4) inhibitor designed for synergistic glycemic control and cardio-renal preservation.',
    keyMessages: [
      'Average HbA1c reduction of 1.45% to 2.10% over 24 weeks of therapy.',
      'Weight reduction benefit (-3.2 kg average) without risk of hypoglycemia.',
      'Simplifies daily diabetes regimen into a single morning tablet.'
    ],
    clinicalBenefits: [
      'Dual mechanism addressing both fasting and postprandial glucose excursions.',
      '35% reduction in hospitalization risk for heart failure in high-risk diabetic cohorts.',
      'Sustained eGFR stabilization over 36 months of follow-up.'
    ],
    safetyPoints: [
      'Enteric matrix formulation reduces upper gastrointestinal adverse events to <1.8%.',
      'Monitor patient hydration and advise on proper hygiene to prevent mycotic infections.',
      'Not recommended for initiation in patients with eGFR below 30 mL/min/1.73m².'
    ],
    competitorList: [
      'DiaControl Plus (Merck)',
      'Jardiance 10mg (Boehringer Ingelheim)',
      'Januvia 100mg (Merck)'
    ],
    references: [
      'Diabetes Care Journal 2025; Dual-Incretin & SGLT2 Efficacy Profile',
      'European Heart Journal 2024; Cardiorenal Outcomes in Elderly Diabetic Patients',
      'Endocrine Review Quarterly 2025; Glycemic Durability Assessment'
    ],
    attachedDocuments: [
      'GlycaNorm Clinical Trial Digest & Subgroup Data',
      'Patient Co-Pay Assistance & Instant Savings Guide PDF',
      'Geriatric Diabetes Dosing Pocket Card'
    ]
  },
  {
    id: 'prod-3',
    name: 'NeuroCalm ER',
    molecule: 'Eszopiclone + Melatonin Dual-Release',
    company: 'RepOS BioPharma',
    indication: 'Chronic Insomnia & Nocturnal Migraine Prophylaxis',
    dosageForms: ['Bimodal Release Capsules'],
    strengths: ['8mg', '16mg'],
    generalInfo: 'Novel central neuro-modulator that combines rapid GABA-A receptor modulation with sustained melatonin receptor agonism to restore healthy sleep architecture.',
    keyMessages: [
      'Rapid sleep onset (<20 mins) with extended 7.5-hour nocturnal maintenance.',
      'Equivalent anxiety reduction without morning cognitive sluggishness.',
      'Zero withdrawal rebound insomnia or physical dependency risk.'
    ],
    clinicalBenefits: [
      '68% reduction in monthly nocturnal migraine awakenings in refractory patients.',
      'Preserves normal REM and slow-wave sleep stages.',
      'Improved daytime vigilance scores on standardized alertness testing.'
    ],
    safetyPoints: [
      'Low daytime somnolence rate (2.1%) compared to Topiramate and benzodiazepines.',
      'Avoid concurrent consumption with alcohol or strong CYP3A4 inhibitors.',
      'No reported abuse potential in clinical pharmacology evaluations.'
    ],
    competitorList: [
      'Topamax 50mg (Janssen)',
      'Aimovig 70mg (Amgen)',
      'Ambien CR 12.5mg (Sanofi)'
    ],
    references: [
      'Journal of Neurological Therapeutics 2025; NEURO-3 Clinical Trial',
      'American Academy of Neurology (AAN) Annual Report 2025',
      'Sleep Medicine Reviews 2024; Nocturnal Migraine Prevention'
    ],
    attachedDocuments: [
      'NeuroCalm ER vs Benzodiazepines Comparative Study PDF',
      'Migraine Patient Diary & QR Code Starter Booklet'
    ]
  },
  {
    id: 'prod-4',
    name: 'PulmoShield Respomat',
    molecule: 'Tiotropium Bromide + Olodaterol Soft Mist',
    company: 'RepOS BioPharma',
    indication: 'Maintenance Treatment of COPD & Moderate-to-Severe Asthma',
    dosageForms: ['Soft Mist Inhaler (SMI) Device'],
    strengths: ['2.5mcg / 2.5mcg per actuation'],
    generalInfo: 'Proprietary soft mist inhaler delivering a slow-moving aerosol plume that achieves optimal deep alveolar lung deposition without requiring forceful inhalation.',
    keyMessages: [
      'Low inspiratory effort required — ideal for frail elderly COPD patients.',
      '+210ml FEV1 pulmonary function improvement over 24 hours.',
      'Easy 2-puff once-daily administration.'
    ],
    clinicalBenefits: [
      '42% lower rate of COPD exacerbations requiring hospital emergency visits.',
      'Superior lung deposition (52%) compared to traditional dry powder inhalers (20-30%).',
      'Significant improvement in dyspnea score and daily walking distance.'
    ],
    safetyPoints: [
      'Well tolerated; mild dry mouth reported in <3.0% of trial participants.',
      'Use caution in patients with narrow-angle glaucoma or urinary retention.',
      'No tachyphylaxis observed over 12 months of continuous dosing.'
    ],
    competitorList: [
      'Spiriva Respomat (Boehringer Ingelheim)',
      'Symbicort Turbuhaler (AstraZeneca)',
      'Anoro Ellipta (GSK)'
    ],
    references: [
      'European Respiratory Journal 2025; DYNAGITO COPD Maintenance Trial',
      'Chest Journal 2024; Aerosol Plume Deposition Dynamics',
      'Lancet Respiratory Medicine 2023; Exacerbation Prevention Study'
    ],
    attachedDocuments: [
      'PulmoShield Soft Mist Device Instruction Guide PDF',
      'COPD Exacerbation Rate Comparative Chart'
    ]
  }
];

export const SAMPLE_DOCUMENTS: KBDocument[] = [
  {
    id: 'doc-101',
    name: 'REPOS-3 Renal Outcomes & Blood Pressure Trial in Stage 2 Hypertensive Cohorts.pdf',
    product: 'Cardiovasc XL',
    uploadDate: '2026-07-28',
    extractedObjectionsCount: 14,
    status: 'Processed',
    pdfSize: '2.4 MB',
    documentType: 'Clinical Study',
    specialty: 'Cardiology',
    version: 'v2.1',
    publishDate: '2026-06-15',
    company: 'RepOS BioPharma',
    tags: ['Renal Safety', 'Hypertension', 'REPOS-3', 'eGFR'],
    isFavorite: true,
    isArchived: false,
    notes: 'Key pivotal trial demonstrating renal protection in elderly hypertensive patients with eGFR < 45.',
    relatedCompetitors: ['Entresto 200mg (Novartis)', 'Norvasc 10mg (Pfizer)'],
    relatedObjections: ['Renal Safety in Elderly (eGFR < 45)', 'Head-to-head vs Entresto 200mg'],
    pdfFileName: 'repos3_renal_trial_final_2026.pdf'
  },
  {
    id: 'doc-102',
    name: 'Cardiovasc XL Full Prescribing Monograph & Dosing Guidelines.pdf',
    product: 'Cardiovasc XL',
    uploadDate: '2026-07-25',
    extractedObjectionsCount: 8,
    status: 'Processed',
    pdfSize: '1.8 MB',
    documentType: 'Product Monograph',
    specialty: 'Cardiology',
    version: '2026 Ed',
    publishDate: '2026-01-10',
    company: 'RepOS BioPharma',
    tags: ['Prescribing Info', 'Dosing Table', 'Contraindications'],
    isFavorite: false,
    isArchived: false,
    notes: 'Official regulatory monograph with complete dosing tables for geriatric and renal impairment cohorts.',
    relatedCompetitors: ['Entresto 200mg (Novartis)'],
    relatedObjections: ['Formulary Copay Tier 3 Restrictions'],
    pdfFileName: 'cardiovasc_xl_monograph_2026.pdf'
  },
  {
    id: 'doc-103',
    name: 'Dual-Incretin Efficacy Profile in Type 2 Diabetes Management (Diabetes Care 2025).pdf',
    product: 'GlycaNorm Dual',
    uploadDate: '2026-07-24',
    extractedObjectionsCount: 11,
    status: 'Processed',
    pdfSize: '3.1 MB',
    documentType: 'Clinical Study',
    specialty: 'Endocrinology',
    version: 'v1.0',
    publishDate: '2025-11-20',
    company: 'RepOS BioPharma',
    tags: ['Incretin', 'HbA1c', 'Weight Loss', 'Cardiometabolic'],
    isFavorite: true,
    isArchived: false,
    notes: 'Published in Diabetes Care 2025 showing superior HbA1c reduction without hypoglycemia risk.',
    relatedCompetitors: ['Ozempic 1mg (Novo Nordisk)', 'Mounjaro 10mg (Eli Lilly)'],
    relatedObjections: ['GI tolerability in first 4 weeks of titration'],
    pdfFileName: 'glycanorm_incretin_efficacy_2025.pdf'
  },
  {
    id: 'doc-104',
    name: 'Patient Co-Pay Assistance & Hospital Formulary Appeal Toolkit.pdf',
    product: 'GlycaNorm Dual',
    uploadDate: '2026-07-22',
    extractedObjectionsCount: 6,
    status: 'Processed',
    pdfSize: '1.2 MB',
    documentType: 'Detail Aid',
    specialty: 'Endocrinology',
    version: 'v3.0',
    publishDate: '2026-05-01',
    company: 'RepOS BioPharma',
    tags: ['Copay Card', 'Formulary Override', 'Prior Auth'],
    isFavorite: false,
    isArchived: false,
    notes: 'Includes instant savings card templates ($15 max out of pocket) and prior authorization appeal letters.',
    relatedCompetitors: ['Jardiance 25mg (Boehringer Ingelheim)'],
    relatedObjections: ['Hospital Formulary Tier 3 Copay Restrictions'],
    pdfFileName: 'glycanorm_copay_toolkit_v3.pdf'
  },
  {
    id: 'doc-105',
    name: 'NeuroCalm ER vs Benzodiazepine Onset & Prophylaxis Head-to-Head Comparison.pdf',
    product: 'NeuroCalm ER',
    uploadDate: '2026-07-29',
    extractedObjectionsCount: 9,
    status: 'Processed',
    pdfSize: '1.5 MB',
    documentType: 'Competitor File',
    specialty: 'Neurology',
    version: 'v1.4',
    publishDate: '2026-04-12',
    company: 'RepOS BioPharma',
    tags: ['Insomnia', 'Benzodiazepines', 'REM Sleep', 'No Rebound'],
    isFavorite: true,
    isArchived: false,
    notes: 'Head-to-head clinical data demonstrating zero rebound insomnia or physical dependence compared to benzodiazepines.',
    relatedCompetitors: ['Ambien CR 12.5mg (Sanofi)', 'Topamax 50mg (Janssen)'],
    relatedObjections: ['Morning cognitive sluggishness and hangover effect'],
    pdfFileName: 'neurocalm_vs_benzo_head_to_head.pdf'
  },
  {
    id: 'doc-106',
    name: 'PulmoShield Respomat Aerosol Plume Deposition Study (Chest Journal).pdf',
    product: 'PulmoShield Respomat',
    uploadDate: '2026-07-30',
    extractedObjectionsCount: 0,
    status: 'Ready for AI',
    pdfSize: '2.9 MB',
    documentType: 'Clinical Study',
    specialty: 'Pulmonology',
    version: 'v1.0',
    publishDate: '2026-07-15',
    company: 'RepOS BioPharma',
    tags: ['Aerosol Plume', 'Alveolar Deposition', 'COPD', 'Geriatric'],
    isFavorite: false,
    isArchived: false,
    notes: 'Chest Journal study highlighting soft mist deposition without requiring forceful inhalation.',
    relatedCompetitors: ['Spiriva Respimat (Boehringer Ingelheim)', 'Trelegy Ellipta (GSK)'],
    relatedObjections: ['Inspiratory effort required in frail elderly COPD patients'],
    pdfFileName: 'pulmoshield_plume_chest_journal_2026.pdf'
  },
  {
    id: 'doc-107',
    name: '2026 Geriatric & Pediatric Special Dosing Safety Reference Charts.pdf',
    product: 'All Products',
    uploadDate: '2026-07-29',
    extractedObjectionsCount: 5,
    status: 'Processed',
    pdfSize: '1.1 MB',
    documentType: 'Guideline',
    specialty: 'All',
    version: '2026 Ed',
    publishDate: '2026-02-01',
    company: 'RepOS BioPharma',
    tags: ['Geriatric', 'Pediatric', 'Safety Charts', 'Renal Impairment'],
    isFavorite: false,
    isArchived: false,
    notes: 'Comprehensive cross-specialty clinical reference guide for dose adjustments by eGFR and age.',
    relatedCompetitors: ['Entresto 200mg (Novartis)', 'Ozempic 1mg (Novo Nordisk)'],
    relatedObjections: ['Renal Safety in Elderly Patients (eGFR < 45)'],
    pdfFileName: 'geriatric_safety_dosing_2026.pdf'
  }
];

export const SAMPLE_OBJECTIONS: KBObjection[] = [
  {
    id: 'obj-201',
    title: 'High hospital formulary copay tier ($45+) compared to generic statins or ACE inhibitors',
    relatedProduct: 'Cardiovasc XL',
    category: 'Cost',
    shortScientificAnswer: 'Provide the RepOS Instant Savings Co-pay Card which caps monthly out-of-pocket patient cost at $15 for commercially insured patients, and offer 1-month starter sample boxes.',
    status: 'Verified'
  },
  {
    id: 'obj-202',
    title: 'Concern regarding renal safety and eGFR drop in elderly patients with baseline eGFR < 45',
    relatedProduct: 'Cardiovasc XL',
    category: 'Safety',
    shortScientificAnswer: 'Cite REPOS-3 subgroup data showing a 31% slower rate of eGFR decline over 36 months compared to ACE inhibitor monotherapy, with zero acute renal failure events.',
    status: 'Verified'
  },
  {
    id: 'obj-203',
    title: 'Physician prefers Entresto for chronic heart failure maintenance due to Class I guideline rating',
    relatedProduct: 'Cardiovasc XL',
    category: 'Competitor',
    shortScientificAnswer: 'Highlight that Cardiovasc XL provides equivalent BP control with 72% fewer symptomatic hypotension episodes and does not require a 36-hour washout period when switching from ACEi.',
    status: 'Verified'
  },
  {
    id: 'obj-204',
    title: 'Upper gastrointestinal side effects and nausea in elderly type 2 diabetic patients',
    relatedProduct: 'GlycaNorm Dual',
    category: 'Safety',
    shortScientificAnswer: 'Explain that GlycaNorm Dual utilizes an enteric-coated bilayer matrix that releases in the small intestine, reducing upper GI adverse events to <1.8% in clinical trials.',
    status: 'Verified'
  },
  {
    id: 'obj-205',
    title: 'Hospital P&T Committee requires 1-year cost-effectiveness ROI model before formulary addition',
    relatedProduct: 'GlycaNorm Dual',
    category: 'Compliance',
    shortScientificAnswer: 'Share the published Health Economics & Outcomes Research (HEOR) dossier showing a net $2,140 annual hospital savings per patient due to 35% lower heart failure readmissions.',
    status: 'Verified'
  },
  {
    id: 'obj-206',
    title: 'Concerns about daytime somnolence and cognitive sluggishness in working professionals',
    relatedProduct: 'NeuroCalm ER',
    category: 'Safety',
    shortScientificAnswer: 'Reference the NEURO-3 Trial alertness battery results: daytime somnolence was only 2.1% (comparable to placebo), whereas Topiramate showed 19.4% cognitive sluggishness.',
    status: 'Verified'
  },
  {
    id: 'obj-207',
    title: 'Inhaler device learning curve for frail elderly COPD patients with arthritis or tremor',
    relatedProduct: 'PulmoShield Respomat',
    category: 'Efficacy',
    shortScientificAnswer: 'Demonstrate the Soft Mist spring-activated actuation which requires low inspiratory effort (no forceful breath needed) and provide QR video instruction cards for patients.',
    status: 'Verified'
  },
  {
    id: 'obj-208',
    title: 'Guideline alignment: Why prescribe dual SGLT2/DPP4 combination as initial therapy?',
    relatedProduct: 'GlycaNorm Dual',
    category: 'Guidelines',
    shortScientificAnswer: '2025 ADA/EASD consensus guidelines recommend early combination therapy in patients with HbA1c > 1.5% above target or high baseline cardiovascular risk.',
    status: 'Verified'
  }
];

export const SAMPLE_COMPETITORS: KBCompetitor[] = [
  {
    id: 'comp-301',
    brandName: 'Entresto 200mg',
    company: 'Novartis',
    competesAgainst: 'Cardiovasc XL',
    mainStrength: 'Strong Class I guideline recommendation in chronic HFrEF heart failure.',
    mainWeakness: 'High incidence of symptomatic hypotension (18%), elevated cost, and requires a mandatory 36-hour ACEi washout period.'
  },
  {
    id: 'comp-302',
    brandName: 'DiaControl Plus',
    company: 'Merck',
    competesAgainst: 'GlycaNorm Dual',
    mainStrength: 'Aggressive hospital contracting discounts and widespread Tier 2 P&T committee formulary inclusion.',
    mainWeakness: 'Lacks demonstrated cardio-renal preservation benefit in patients with eGFR < 45 mL/min/1.73m².'
  },
  {
    id: 'comp-303',
    brandName: 'Topamax 50mg (Topiramate)',
    company: 'Janssen Pharmaceuticals',
    competesAgainst: 'NeuroCalm ER',
    mainStrength: 'Low generic cost and long-standing prescribing familiarity among primary care physicians.',
    mainWeakness: 'High rate of cognitive fatigue ("Dopamax"), paresthesia, and patient discontinuation exceeding 30%.'
  },
  {
    id: 'comp-304',
    brandName: 'Spiriva Respomat',
    company: 'Boehringer Ingelheim',
    competesAgainst: 'PulmoShield Respomat',
    mainStrength: 'Established market leader in LAMA COPD maintenance monotherapy.',
    mainWeakness: 'Monotherapy only; lacks the synergistic bronchodilator benefits of dual LAMA/LABA co-formulation.'
  },
  {
    id: 'comp-305',
    brandName: 'Lipitor 40mg (Generic Atorvastatin)',
    company: 'Viatris / Pfizer',
    competesAgainst: 'Cardiovasc XL',
    mainStrength: 'First-line standard of care with $0 copay on almost all insurance formularies.',
    mainWeakness: 'Does not address residual inflammatory cardiovascular risk or diabetic vascular stiffness.'
  }
];
