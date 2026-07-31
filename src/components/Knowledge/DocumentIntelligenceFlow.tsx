import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, 
  FileText, 
  FileCode, 
  FileSpreadsheet, 
  Image as ImageIcon, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  Swords, 
  BookOpen, 
  Package, 
  ChevronDown, 
  ChevronRight, 
  ArrowLeft, 
  Save, 
  Edit3, 
  X, 
  Database, 
  Award, 
  FileCheck, 
  Layers, 
  Activity, 
  Cpu, 
  AlertCircle, 
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { KBDocument } from '../../data/knowledgeData';

export interface DocumentIntelligenceFlowProps {
  onCancel: () => void;
  onSaveToKnowledgeBase: (addedDocument: KBDocument) => void;
}

type FlowStep = 'upload' | 'processing' | 'result' | 'saved_details';

interface ProcessingStep {
  id: string;
  label: string;
  description: string;
  durationMs: number;
}

const PROCESSING_STEPS: ProcessingStep[] = [
  {
    id: 'reading',
    label: 'Reading document...',
    description: 'Parsing PDF structure, layout tables, and OCR clinical text diagrams.',
    durationMs: 800,
  },
  {
    id: 'product',
    label: 'Extracting product information...',
    description: 'Identifying molecule name, dosage strengths, indications, and pharmacokinetics.',
    durationMs: 900,
  },
  {
    id: 'objections',
    label: 'Finding objections...',
    description: 'Detecting clinical, safety, pricing, and guidelines resistance points.',
    durationMs: 950,
  },
  {
    id: 'answers',
    label: 'Extracting scientific answers...',
    description: 'Correlating clinical trial data to generate field-ready objection responses.',
    durationMs: 900,
  },
  {
    id: 'competitors',
    label: 'Detecting competitors...',
    description: 'Building head-to-head battlecards against Entresto, Diovan, and generic ARBs.',
    durationMs: 850,
  },
  {
    id: 'knowledge',
    label: 'Generating knowledge...',
    description: 'Synthesizing evidence cards, p-values, and clinical endpoints for RepMind AI.',
    durationMs: 900,
  },
  {
    id: 'saving',
    label: 'Saving to RepMind AI...',
    description: 'Indexing vectors and preparing local Knowledge Database cache.',
    durationMs: 700,
  },
];

interface SampleFileOption {
  name: string;
  size: string;
  type: 'PDF' | 'DOCX' | 'PPTX' | 'Image';
  productName: string;
  molecule: string;
}

const SAMPLE_FILE_OPTIONS: SampleFileOption[] = [
  {
    name: 'REPOS-5 Phase III Cardio-Renal Outcomes Subgroup Trial (2026).pdf',
    size: '4.8 MB',
    type: 'PDF',
    productName: 'Cardiovasc XL',
    molecule: 'Amlodipine Besylate + Valsartan ER (100mg / 10mg)',
  },
  {
    name: 'Cardiovasc XL Prescribing Monograph & Advisory Board Deck.pptx',
    size: '11.2 MB',
    type: 'PPTX',
    productName: 'Cardiovasc XL',
    molecule: 'Amlodipine Besylate + Valsartan ER',
  },
  {
    name: 'GlycaNorm Dual Clinical Monograph & Pricing Analysis.docx',
    size: '2.4 MB',
    type: 'DOCX',
    productName: 'GlycaNorm Dual',
    molecule: 'Empagliflozin + Linagliptin Dual Matrix',
  },
  {
    name: 'Inhalex Dry Powder Inhaler Particle Deposition Chart.png',
    size: '1.8 MB',
    type: 'Image',
    productName: 'Inhalex DTI',
    molecule: 'Fluticasone Furoate + Vilanterol',
  },
];

export const DocumentIntelligenceFlow: React.FC<DocumentIntelligenceFlowProps> = ({
  onCancel,
  onSaveToKnowledgeBase,
}) => {
  const [currentStep, setCurrentStep] = useState<FlowStep>('upload');
  const [selectedFile, setSelectedFile] = useState<SampleFileOption>(SAMPLE_FILE_OPTIONS[0]);
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);

  // AI Processing State
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [progressPercent, setProgressPercent] = useState<number>(0);

  // Expandable sections in Result Preview
  const [expandedSection, setExpandedSection] = useState<
    'objections' | 'answers' | 'evidence' | 'competitors' | 'references' | null
  >('objections');

  // Edit before saving modal state
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedProductName, setEditedProductName] = useState<string>('Cardiovasc XL');
  const [editedIndication, setEditedIndication] = useState<string>(
    'Essential Hypertension & Cardiovascular Event Prevention in High-Risk Patients'
  );
  const [editedObjectionsCount, setEditedObjectionsCount] = useState<number>(6);

  // Processing sequential animation trigger
  useEffect(() => {
    if (currentStep !== 'processing') return;

    let currentIdx = 0;
    setCompletedSteps([]);
    setActiveStepIndex(0);
    setProgressPercent(0);

    const stepInterval = setInterval(() => {
      if (currentIdx < PROCESSING_STEPS.length) {
        const step = PROCESSING_STEPS[currentIdx];
        setCompletedSteps((prev) => [...prev, step.id]);
        currentIdx += 1;
        setActiveStepIndex(currentIdx);
        const percent = Math.round((currentIdx / PROCESSING_STEPS.length) * 100);
        setProgressPercent(percent);

        if (currentIdx === PROCESSING_STEPS.length) {
          clearInterval(stepInterval);
          setTimeout(() => {
            setCurrentStep('result');
          }, 600);
        }
      }
    }, 850);

    return () => clearInterval(stepInterval);
  }, [currentStep]);

  const handleStartProcessing = () => {
    setCurrentStep('processing');
  };

  const handleSaveConfirmed = () => {
    const newDoc: KBDocument = {
      id: `doc-${Date.now()}`,
      name: selectedFile.name,
      product: editedProductName,
      uploadDate: new Date().toISOString().split('T')[0],
      extractedObjectionsCount: editedObjectionsCount,
      status: 'Processed',
      pdfSize: selectedFile.size,
    };
    onSaveToKnowledgeBase(newDoc);
    setCurrentStep('saved_details');
  };

  const getFileIcon = (type: 'PDF' | 'DOCX' | 'PPTX' | 'Image') => {
    switch (type) {
      case 'PDF':
        return <FileText className="w-6 h-6 text-red-600" />;
      case 'DOCX':
        return <FileCode className="w-6 h-6 text-blue-600" />;
      case 'PPTX':
        return <FileSpreadsheet className="w-6 h-6 text-amber-600" />;
      case 'Image':
        return <ImageIcon className="w-6 h-6 text-emerald-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Flow Breadcrumb */}
      <div className="bg-slate-900 rounded-3xl p-5 sm:p-6 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-[10px] font-extrabold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Sprint 2.1 • AI Document Intelligence Engine</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black tracking-tight text-white">
              {currentStep === 'upload' && 'Upload Document to Knowledge Base'}
              {currentStep === 'processing' && 'AI Document Processing & Extraction'}
              {currentStep === 'result' && 'Document Intelligence Extraction Result'}
              {currentStep === 'saved_details' && 'Knowledge Details & Database View'}
            </h2>
          </div>

          {/* Flow Stepper Bar */}
          <div className="flex items-center gap-1.5 text-xs font-bold bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 self-start sm:self-auto">
            <span
              className={`px-2 py-0.5 rounded-md ${
                currentStep === 'upload' ? 'bg-blue-600 text-white' : 'text-slate-300'
              }`}
            >
              1. Upload
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span
              className={`px-2 py-0.5 rounded-md ${
                currentStep === 'processing' ? 'bg-blue-600 text-white' : 'text-slate-300'
              }`}
            >
              2. AI Processing
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span
              className={`px-2 py-0.5 rounded-md ${
                currentStep === 'result' ? 'bg-blue-600 text-white' : 'text-slate-300'
              }`}
            >
              3. Result
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span
              className={`px-2 py-0.5 rounded-md ${
                currentStep === 'saved_details' ? 'bg-emerald-600 text-white' : 'text-slate-300'
              }`}
            >
              4. Saved
            </span>
          </div>
        </div>
      </div>

      {/* STEP 1: UPLOAD SCREEN */}
      {currentStep === 'upload' && (
        <motion.div
          key="upload-screen"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-6"
        >
          {/* Main Upload Box */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Select or Drag & Drop Document
                </h3>
                <p className="text-xs text-slate-500">
                  RepMind AI reads clinical monographs, Phase III trials, PowerPoint advisory decks, and high-res medical figures.
                </p>
              </div>

              {/* Supported Document Types Pill */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-50 px-3.5 py-2 rounded-2xl border border-slate-200">
                <span className="text-slate-400 uppercase text-[10px] tracking-wider mr-1">
                  Supported:
                </span>
                <span className="px-2 py-0.5 rounded-lg bg-red-100 text-red-700">PDF</span>
                <span className="px-2 py-0.5 rounded-lg bg-blue-100 text-blue-700">DOCX</span>
                <span className="px-2 py-0.5 rounded-lg bg-amber-100 text-amber-700">PPTX</span>
                <span className="px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-700">Images</span>
              </div>
            </div>

            {/* Drag & Drop Area (UI Only) */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingOver(true);
              }}
              onDragLeave={() => setIsDraggingOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDraggingOver(false);
              }}
              onClick={() => {
                // Clicking rotates through sample file options for testing
                const currentIndex = SAMPLE_FILE_OPTIONS.findIndex(
                  (o) => o.name === selectedFile.name
                );
                const nextIndex = (currentIndex + 1) % SAMPLE_FILE_OPTIONS.length;
                setSelectedFile(SAMPLE_FILE_OPTIONS[nextIndex]);
              }}
              className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all duration-300 cursor-pointer relative group ${
                isDraggingOver
                  ? 'border-blue-500 bg-blue-50/70 scale-[1.01]'
                  : 'border-slate-300/90 hover:border-blue-400 bg-slate-50/40 hover:bg-slate-50'
              }`}
            >
              <div className="max-w-md mx-auto space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-white shadow-md border border-slate-200 text-blue-600 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-extrabold text-slate-900">
                    Drag & Drop your clinical document here
                  </p>
                  <p className="text-xs text-slate-500">
                    or click to cycle through sample field documents (PDF, DOCX, PPTX, Images)
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-white border border-slate-200/90 text-xs font-bold text-slate-700 shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Current selected: {selectedFile.type} ({selectedFile.size})</span>
                </div>
              </div>
            </div>

            {/* Preset Document Selector Cards */}
            <div className="space-y-3">
              <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">
                Or choose from sample field documents ready for AI Extraction:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SAMPLE_FILE_OPTIONS.map((file, idx) => {
                  const isSelected = selectedFile.name === file.name;
                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedFile(file)}
                      className={`p-4 rounded-2xl border text-left cursor-pointer transition-all flex items-start justify-between gap-3 ${
                        isSelected
                          ? 'bg-blue-50/80 border-blue-500 shadow-sm ring-2 ring-blue-500/20'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white shadow-xs border border-slate-200 flex items-center justify-center shrink-0">
                          {getFileIcon(file.type)}
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-extrabold text-slate-900 line-clamp-2">
                            {file.name}
                          </p>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                            <span className="font-bold text-blue-700">{file.productName}</span>
                            <span>•</span>
                            <span>{file.size}</span>
                          </div>
                        </div>
                      </div>

                      {isSelected && (
                        <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-1" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Bar: Cancel + Large Upload Button */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={onCancel}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold transition-all"
              >
                ← Cancel & Return to Documents List
              </button>

              <button
                onClick={handleStartProcessing}
                className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-black rounded-2xl shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2.5 transition-all active:scale-[0.99]"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Upload & Start AI Document Processing</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* STEP 2: AI PROCESSING (ANIMATED PROGRESS PAGE) */}
      {currentStep === 'processing' && (
        <motion.div
          key="processing-screen"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-lg max-w-3xl mx-auto space-y-8 text-center"
        >
          {/* Animated Brain / Core Visual */}
          <div className="space-y-4">
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping" />
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-2xl border-4 border-white">
                <Cpu className="w-12 h-12 animate-pulse" />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                RepMind AI Intelligence Extraction
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Analyzing <span className="font-bold text-slate-800">{selectedFile.name}</span> for clinical endpoints, pricing resistance, and competitor battlecards.
              </p>
            </div>
          </div>

          {/* Progress Bar & Counter */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-extrabold">
              <span className="text-blue-600 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 animate-spin" />
                <span>Processing Document Structure & Evidence...</span>
              </span>
              <span className="text-slate-900 font-black">{progressPercent}%</span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200/70">
              <div
                className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Sequential Steps List */}
          <div className="text-left bg-slate-50/80 rounded-3xl p-5 sm:p-6 border border-slate-200/80 space-y-3">
            {PROCESSING_STEPS.map((step, idx) => {
              const isCompleted = completedSteps.includes(step.id);
              const isCurrent = idx === activeStepIndex && !isCompleted;
              const isPending = idx > activeStepIndex;

              return (
                <div
                  key={step.id}
                  className={`flex items-center justify-between p-3 rounded-2xl transition-all ${
                    isCompleted
                      ? 'bg-emerald-50/70 border border-emerald-200 text-slate-900'
                      : isCurrent
                      ? 'bg-white border-2 border-blue-500 shadow-sm text-slate-900'
                      : 'opacity-40 text-slate-400 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-extrabold text-xs">
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : isCurrent ? (
                        <Clock className="w-5 h-5 text-blue-600 animate-spin" />
                      ) : (
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-extrabold leading-tight">
                        {step.label}
                      </p>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {isCompleted && (
                    <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                      Done
                    </span>
                  )}
                  {isCurrent && (
                    <span className="text-[10px] font-extrabold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md animate-pulse">
                      Active
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <p className="text-[11px] text-slate-400 italic">
            * All document parsing performed entirely client-side with simulated AI extraction data.
          </p>
        </motion.div>
      )}

      {/* STEP 3: RESULT PAGE & KNOWLEDGE PREVIEW */}
      {currentStep === 'result' && (
        <motion.div
          key="result-screen"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="space-y-6"
        >
          {/* Top Processing Completed Banner */}
          <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-blue-950 rounded-3xl p-6 text-white border border-emerald-500/40 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg sm:text-xl font-black text-white">
                    Processing Completed Successfully
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-extrabold uppercase">
                    Ready to Save
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Document <span className="text-white font-bold">{selectedFile.name}</span> has been indexed and structured into 6 scientific cards.
                </p>
              </div>
            </div>

            {/* Save Controls on Result Page */}
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-extrabold border border-white/20 flex items-center gap-1.5 transition-all"
              >
                <Edit3 className="w-4 h-4 text-amber-300" />
                <span>Edit before saving</span>
              </button>

              <button
                onClick={handleSaveConfirmed}
                className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Save to Knowledge Base</span>
              </button>
            </div>
          </div>

          {/* 6 Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {/* Card 1: Product detected */}
            <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-sm space-y-1">
              <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-wider block">
                Product detected
              </span>
              <p className="text-xs sm:text-sm font-black text-slate-900 leading-tight">
                {editedProductName}
              </p>
              <p className="text-[11px] text-slate-500 font-medium">
                {selectedFile.molecule.split('(')[0]}
              </p>
            </div>

            {/* Card 2: Documents analyzed */}
            <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-sm space-y-1">
              <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-wider block">
                Documents analyzed
              </span>
              <p className="text-xs sm:text-sm font-black text-slate-900 leading-tight">
                1 Document
              </p>
              <p className="text-[11px] text-slate-500 font-medium">
                42 Clinical Pages Index
              </p>
            </div>

            {/* Card 3: Objections extracted */}
            <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-sm space-y-1">
              <span className="text-[10px] font-extrabold text-amber-600 uppercase tracking-wider block">
                Objections extracted
              </span>
              <p className="text-xs sm:text-sm font-black text-slate-900 leading-tight">
                {editedObjectionsCount} Objections
              </p>
              <p className="text-[11px] text-slate-500 font-medium">
                Safety, Cost & Efficacy
              </p>
            </div>

            {/* Card 4: Scientific references */}
            <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-sm space-y-1">
              <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider block">
                Scientific references
              </span>
              <p className="text-xs sm:text-sm font-black text-slate-900 leading-tight">
                8 Citations
              </p>
              <p className="text-[11px] text-slate-500 font-medium">
                Lancet, NEJM, JACC 2026
              </p>
            </div>

            {/* Card 5: Competitors found */}
            <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-sm space-y-1">
              <span className="text-[10px] font-extrabold text-rose-600 uppercase tracking-wider block">
                Competitors found
              </span>
              <p className="text-xs sm:text-sm font-black text-slate-900 leading-tight">
                4 Rivals
              </p>
              <p className="text-[11px] text-slate-500 font-medium">
                Entresto, Diovan, Norvasc
              </p>
            </div>

            {/* Card 6: Knowledge score */}
            <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-sm space-y-1">
              <span className="text-[10px] font-extrabold text-purple-600 uppercase tracking-wider block">
                Knowledge score
              </span>
              <p className="text-xs sm:text-sm font-black text-slate-900 leading-tight">
                98.4 / 100
              </p>
              <p className="text-[11px] text-emerald-700 font-extrabold">
                High Field Readiness
              </p>
            </div>
          </div>

          {/* KNOWLEDGE PREVIEW — EXPANDABLE SECTIONS */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-blue-600" />
                  <span>Knowledge Preview (Expandable Sections)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Inspect the AI-extracted clinical objections, answers, evidence, competitors, and references before saving.
                </p>
              </div>

              <span className="text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full border">
                5 Extraction Sections
              </span>
            </div>

            {/* Section 1: Objections */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <button
                onClick={() =>
                  setExpandedSection(expandedSection === 'objections' ? null : 'objections')
                }
                className="w-full p-4 bg-slate-50 hover:bg-slate-100/80 transition-colors flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-2.5">
                  <ShieldAlert className="w-5 h-5 text-amber-600" />
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900">
                      Section: Objections ({editedObjectionsCount} Realistic Examples)
                    </h4>
                    <p className="text-xs text-slate-500">
                      Doctor pushbacks extracted from trial discussion and clinical board feedback
                    </p>
                  </div>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 transition-transform ${
                    expandedSection === 'objections' ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {expandedSection === 'objections' && (
                <div className="p-4 space-y-3 bg-white border-t border-slate-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-900">
                          1. Renal Impairment Dosing Pushback
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-extrabold">
                          Safety
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        "I am concerned about hyperkalemia or worsening eGFR when prescribing a dual ARB/CCB combination in patients with baseline stage 3 chronic kidney disease."
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-900">
                          2. Cost Premium vs. Generic Amlodipine
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                          Cost
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        "Why should I switch my stable hypertensive patients from $4/month generic amlodipine to a branded fixed-dose combination?"
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-blue-50/50 border border-blue-200/80 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-900">
                          3. Peripheral Edema Incidence
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-extrabold">
                          Safety
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        "Calcium channel blockers often cause troublesome ankle swelling that reduces patient compliance after 6 weeks."
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-purple-50/50 border border-purple-200/80 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-900">
                          4. Entresto Head-to-Head Preference
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 text-[10px] font-extrabold">
                          Competitor
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        "For patients with elevated NT-proBNP, hospital cardiologists generally prefer Entresto over standard ARB/CCB combinations."
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Section 2: Scientific Answers */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <button
                onClick={() =>
                  setExpandedSection(expandedSection === 'answers' ? null : 'answers')
                }
                className="w-full p-4 bg-slate-50 hover:bg-slate-100/80 transition-colors flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900">
                      Section: Scientific Answers (Clinical Response Strategy)
                    </h4>
                    <p className="text-xs text-slate-500">
                      Evidentiary rebuttals with trial citations and recommended rep dialogue
                    </p>
                  </div>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 transition-transform ${
                    expandedSection === 'answers' ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {expandedSection === 'answers' && (
                <div className="p-4 space-y-3 bg-white border-t border-slate-200">
                  <div className="space-y-3">
                    <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-1.5">
                      <span className="text-[10px] font-extrabold text-blue-800 uppercase tracking-wider block">
                        Scientific Answer • Renal Impairment & eGFR Protection
                      </span>
                      <p className="text-xs sm:text-sm font-bold text-slate-900">
                        "In the REPOS-5 subgroup analysis (n=1,840), Cardiovasc XL demonstrated a 32% reduction in major adverse renal events without significant hyperkalemia vs. monotherapy."
                      </p>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        <strong>Rep Talking Point:</strong> Highlight that the dual matrix formulation provides balanced afferent and efferent arteriolar dilatation, stabilizing glomerular filtration pressure even in stage 3 CKD patients.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1.5">
                      <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider block">
                        Scientific Answer • Cost Effectiveness & Outcome Offset
                      </span>
                      <p className="text-xs sm:text-sm font-bold text-slate-900">
                        "Health economic modeling confirms a net $1,420 annual cost saving per patient by preventing secondary heart failure admissions."
                      </p>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        <strong>Rep Talking Point:</strong> Provide the managed care co-pay card ($0 first fill) and show that 24-hour ambulatory control reduces stroke hospitalization risk by 28%.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Section 3: Clinical Evidence */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <button
                onClick={() =>
                  setExpandedSection(expandedSection === 'evidence' ? null : 'evidence')
                }
                className="w-full p-4 bg-slate-50 hover:bg-slate-100/80 transition-colors flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-2.5">
                  <Activity className="w-5 h-5 text-blue-600" />
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900">
                      Section: Clinical Evidence (Primary Trial Endpoints)
                    </h4>
                    <p className="text-xs text-slate-500">
                      Statistical significance, p-values, and primary systolic BP reductions
                    </p>
                  </div>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 transition-transform ${
                    expandedSection === 'evidence' ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {expandedSection === 'evidence' && (
                <div className="p-4 space-y-3 bg-white border-t border-slate-200">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
                      <span className="text-2xl font-black text-blue-600">-14.2 mmHg</span>
                      <p className="text-xs font-extrabold text-slate-800">
                        Mean SBP Reduction
                      </p>
                      <p className="text-[10px] text-slate-500">
                        At 8 weeks vs -8.4 mmHg generic (p &lt; 0.001)
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
                      <span className="text-2xl font-black text-emerald-600">32% RRR</span>
                      <p className="text-xs font-extrabold text-slate-800">
                        Renal Event Risk Reduction
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Kaplan-Meier 3-year survival curve advantage
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
                      <span className="text-2xl font-black text-purple-600">94.8%</span>
                      <p className="text-xs font-extrabold text-slate-800">
                        24-Hour Trough-to-Peak Ratio
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Sustained hemodynamic coverage
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Section 4: Competitor Comparison */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <button
                onClick={() =>
                  setExpandedSection(
                    expandedSection === 'competitors' ? null : 'competitors'
                  )
                }
                className="w-full p-4 bg-slate-50 hover:bg-slate-100/80 transition-colors flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-2.5">
                  <Swords className="w-5 h-5 text-rose-600" />
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900">
                      Section: Competitor Comparison (4 Rival Battlecards)
                    </h4>
                    <p className="text-xs text-slate-500">
                      Head-to-head clinical differentiation vs Entresto, Diovan, and Norvasc
                    </p>
                  </div>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 transition-transform ${
                    expandedSection === 'competitors' ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {expandedSection === 'competitors' && (
                <div className="p-4 space-y-3 bg-white border-t border-slate-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-900">
                          vs. Entresto 200mg (Novartis)
                        </span>
                        <span className="text-[10px] font-bold text-rose-700">
                          Heart Failure Rival
                        </span>
                      </div>
                      <p className="text-xs text-slate-700">
                        <strong>Advantage:</strong> Once-daily dosing with zero risk of neprilysin-induced angioedema and superior outpatient adherence.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-900">
                          vs. Norvasc 10mg (Pfizer)
                        </span>
                        <span className="text-[10px] font-bold text-slate-600">
                          CCB Monotherapy
                        </span>
                      </div>
                      <p className="text-xs text-slate-700">
                        <strong>Advantage:</strong> 64% reduction in peripheral ankle edema due to balanced ARB capillary dilation.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Section 5: References */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <button
                onClick={() =>
                  setExpandedSection(expandedSection === 'references' ? null : 'references')
                }
                className="w-full p-4 bg-slate-50 hover:bg-slate-100/80 transition-colors flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-5 h-5 text-indigo-600" />
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900">
                      Section: References (8 Peer-Reviewed Citations)
                    </h4>
                    <p className="text-xs text-slate-500">
                      Verified journal publications, DOIs, and clinical trial registry IDs
                    </p>
                  </div>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 transition-transform ${
                    expandedSection === 'references' ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {expandedSection === 'references' && (
                <div className="p-4 space-y-2 bg-white border-t border-slate-200">
                  <ul className="space-y-2 text-xs text-slate-700 font-medium">
                    <li className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2">
                      <span className="font-extrabold text-indigo-600 mt-0.5">[1]</span>
                      <span>
                        <strong>Lancet Cardiology (2026):</strong> REPOS-5 Multicenter Phase III Randomized Trial of Bimodal Amlodipine/Valsartan in Stage 2/3 Hypertension (NCT0482910).
                      </span>
                    </li>
                    <li className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2">
                      <span className="font-extrabold text-indigo-600 mt-0.5">[2]</span>
                      <span>
                        <strong>New England Journal of Medicine (NEJM 2025):</strong> Long-term Renal Preservation in Hypertensive Diabetics Using Dual Receptor Blockade.
                      </span>
                    </li>
                    <li className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2">
                      <span className="font-extrabold text-indigo-600 mt-0.5">[3]</span>
                      <span>
                        <strong>JACC (2024):</strong> 24-Hour Ambulatory Hemodynamic Monitoring and Nocturnal Dipping Rates in Primary Cardiology Practices.
                      </span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* SAVE SCREEN / ACTION BAR */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-sm font-extrabold text-slate-900">
                Save Extracted Intelligence to Knowledge Base
              </h4>
              <p className="text-xs text-slate-500">
                This will make the 6 objections, answers, and competitor battlecards available instantly to sales reps.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end">
              <button
                onClick={onCancel}
                className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold transition-all"
              >
                Cancel
              </button>

              <button
                onClick={() => setIsEditing(true)}
                className="px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold flex items-center gap-1.5 transition-all"
              >
                <Edit3 className="w-4 h-4 text-amber-300" />
                <span>Edit before saving</span>
              </button>

              <button
                onClick={handleSaveConfirmed}
                className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-lg shadow-blue-500/20 flex items-center gap-1.5 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Save to Knowledge Base</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* EDIT BEFORE SAVING MODAL */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-black text-slate-900">
                    Edit Extracted Knowledge Before Saving
                  </h3>
                </div>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-1 rounded-xl hover:bg-slate-100 text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block mb-1">
                    Detected Product Name
                  </label>
                  <input
                    type="text"
                    value={editedProductName}
                    onChange={(e) => setEditedProductName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block mb-1">
                    Primary Approved Indication
                  </label>
                  <textarea
                    rows={2}
                    value={editedIndication}
                    onChange={(e) => setEditedIndication(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block mb-1">
                    Objections Count to Index
                  </label>
                  <input
                    type="number"
                    value={editedObjectionsCount}
                    onChange={(e) => setEditedObjectionsCount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-100 text-xs text-blue-900 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>
                    Your edits will override AI auto-detected tags when saving to the local RepMind Knowledge Database.
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-md"
                >
                  Apply Edits
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STEP 4: KNOWLEDGE DETAILS (AFTER SAVING) */}
      {currentStep === 'saved_details' && (
        <motion.div
          key="saved-details-screen"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Saved Success Toast Header */}
          <div className="bg-emerald-600 text-white rounded-3xl p-5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center font-extrabold">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black">
                  Knowledge Successfully Stored in RepMind AI Database
                </h3>
                <p className="text-xs text-emerald-100">
                  All 6 objections, answers, clinical studies, and references are now indexed locally.
                </p>
              </div>
            </div>

            <button
              onClick={onCancel}
              className="px-4 py-2 bg-white text-emerald-900 rounded-xl text-xs font-black hover:bg-emerald-50 transition-all shadow-xs"
            >
              Return to Documents Library →
            </button>
          </div>

          {/* Professional Knowledge Details Page */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-8">
            {/* 1. Product Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-extrabold uppercase">
                    Indexed Product
                  </span>
                  <span className="text-xs font-extrabold text-slate-400">
                    RepOS BioPharma
                  </span>
                </div>
                <h2 className="text-2xl font-black text-slate-900">
                  {editedProductName}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 font-medium">
                  Molecule: <span className="font-bold text-slate-800">{selectedFile.molecule}</span>
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 rounded-xl bg-slate-50 border text-xs font-extrabold text-slate-700">
                  Extended-Release Matrix
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-extrabold text-emerald-800">
                  {editedObjectionsCount} Verified Objections
                </span>
              </div>
            </div>

            {/* 2. All Extracted Objections */}
            <div className="space-y-4">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-600" />
                <span>All Extracted Objections & Answers</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900">
                      1. eGFR Safety in Elderly & Stage 3 CKD
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-extrabold">
                      Safety
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    <strong>Doctor Pushback:</strong> Fear of hyperkalemia or acute kidney injury in comorbid hypertension.
                  </p>
                  <p className="text-xs text-blue-900 bg-blue-50 p-2.5 rounded-xl border border-blue-100">
                    <strong>Answer:</strong> Cites REPOS-5 trial showing 32% renal event risk reduction and stable creatinine over 24 months.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900">
                      2. Cost & Formulary Tier Objection
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                      Cost
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    <strong>Doctor Pushback:</strong> Reluctance to prescribe non-generic combinations due to co-pay barriers.
                  </p>
                  <p className="text-xs text-blue-900 bg-blue-50 p-2.5 rounded-xl border border-blue-100">
                    <strong>Answer:</strong> Provide $0 co-pay card and highlight 28% lower ER cardiovascular admission rate.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900">
                      3. CCB Ankle Edema Incidence
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-extrabold">
                      Safety
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    <strong>Doctor Pushback:</strong> Amlodipine monotherapy causes unacceptable peripheral swelling.
                  </p>
                  <p className="text-xs text-blue-900 bg-blue-50 p-2.5 rounded-xl border border-blue-100">
                    <strong>Answer:</strong> Show 64% reduction in ankle edema vs amlodipine alone due to dual arteriolar dilation.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900">
                      4. Entresto Cardiologist Habit
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 text-[10px] font-extrabold">
                      Competitor
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    <strong>Doctor Pushback:</strong> "I always use Entresto for my high-risk hypertensive cardiology patients."
                  </p>
                  <p className="text-xs text-blue-900 bg-blue-50 p-2.5 rounded-xl border border-blue-100">
                    <strong>Answer:</strong> No 36-hour washout required when switching from ACEi and once-daily morning convenience.
                  </p>
                </div>
              </div>
            </div>

            {/* 3. Studies & Evidence Endpoints */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-600" />
                <span>Clinical Studies & Statistical Evidence</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-center space-y-1">
                  <span className="text-xl font-black text-indigo-900">REPOS-5 Trial</span>
                  <p className="text-xs font-bold text-indigo-700">
                    1,840 Patients • Phase III
                  </p>
                  <p className="text-[11px] text-slate-600">
                    Primary endpoint: -14.2 mmHg SBP reduction (p &lt; 0.001)
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-center space-y-1">
                  <span className="text-xl font-black text-indigo-900">Renal Protection</span>
                  <p className="text-xs font-bold text-indigo-700">
                    32% Risk Reduction
                  </p>
                  <p className="text-[11px] text-slate-600">
                    Composite end-stage renal disease & eGFR doubling
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-center space-y-1">
                  <span className="text-xl font-black text-indigo-900">Adherence Gain</span>
                  <p className="text-xs font-bold text-indigo-700">
                    94.2% Continuation
                  </p>
                  <p className="text-[11px] text-slate-600">
                    12-month ambulatory persistence rate vs 68% generic
                  </p>
                </div>
              </div>
            </div>

            {/* 4. References & Competitors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
              {/* References */}
              <div className="space-y-3">
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  <span>References & Publications</span>
                </h3>
                <ul className="space-y-2 text-xs text-slate-700 font-medium">
                  <li className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    1. Lancet Cardiology 2026; REPOS-5 Phase III Subgroup Analysis
                  </li>
                  <li className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    2. NEJM 2025; Dual Receptor Blockade Renal Outcomes
                  </li>
                  <li className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    3. JACC 2024; Ambulatory 24-hr Blood Pressure Monitoring
                  </li>
                </ul>
              </div>

              {/* Competitors */}
              <div className="space-y-3">
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <Swords className="w-4 h-4 text-rose-600" />
                  <span>Competitor Profiles Indexed</span>
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-rose-50/50 border border-rose-200 flex items-center justify-between font-bold text-slate-900">
                    <span>Entresto 200mg (Novartis)</span>
                    <span className="text-[10px] text-rose-700">Primary Rival</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-rose-50/50 border border-rose-200 flex items-center justify-between font-bold text-slate-900">
                    <span>Norvasc 10mg (Pfizer)</span>
                    <span className="text-[10px] text-slate-600">CCB Monotherapy</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-rose-50/50 border border-rose-200 flex items-center justify-between font-bold text-slate-900">
                    <span>Diovan 160mg (Novartis)</span>
                    <span className="text-[10px] text-slate-600">ARB Monotherapy</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Documents Metadata */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-600 font-medium">
                <FileText className="w-4 h-4 text-red-600" />
                <span>Source File: <strong className="text-slate-900">{selectedFile.name}</strong> ({selectedFile.size})</span>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-blue-700 font-extrabold bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100">
                <Database className="w-3.5 h-3.5" />
                <span>Prepared for Future Server AI Synthesis</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
