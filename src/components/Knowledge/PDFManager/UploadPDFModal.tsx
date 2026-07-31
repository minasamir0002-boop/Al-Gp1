import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Upload,
  FileText,
  Tag,
  Calendar,
  Building2,
  CheckCircle2,
  AlertCircle,
  FolderOpen,
  Sparkles,
  Layers
} from 'lucide-react';
import { KBDocument, KBDocumentType, SAMPLE_PRODUCTS } from '../../../data/knowledgeData';

interface UploadPDFModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newDoc: KBDocument) => void;
  initialDoc?: KBDocument | null;
}

const DOCUMENT_TYPES: KBDocumentType[] = [
  'Clinical Study',
  'Detail Aid',
  'Guideline',
  'Competitor File',
  'Product Monograph',
  'Other'
];

const SPECIALTIES = [
  'Cardiology',
  'Endocrinology',
  'Pulmonology',
  'Neurology',
  'Nephrology',
  'Geriatrics',
  'General Practice',
  'All'
];

export const UploadPDFModal: React.FC<UploadPDFModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialDoc = null
}) => {
  const isEditing = Boolean(initialDoc);

  const [documentName, setDocumentName] = useState(initialDoc?.name || '');
  const [product, setProduct] = useState(initialDoc?.product || SAMPLE_PRODUCTS[0]?.name || 'Cardiovasc XL');
  const [documentType, setDocumentType] = useState<KBDocumentType>(initialDoc?.documentType || 'Clinical Study');
  const [specialty, setSpecialty] = useState(initialDoc?.specialty || 'Cardiology');
  const [version, setVersion] = useState(initialDoc?.version || 'v1.0');
  const [publishDate, setPublishDate] = useState(initialDoc?.publishDate || new Date().toISOString().split('T')[0]);
  const [company, setCompany] = useState(initialDoc?.company || 'RepOS BioPharma');
  const [tagsInput, setTagsInput] = useState((initialDoc?.tags || ['Renal Safety', 'Clinical Trial']).join(', '));
  const [notes, setNotes] = useState(initialDoc?.notes || '');
  const [pdfFileName, setPdfFileName] = useState(initialDoc?.pdfFileName || '');
  const [pdfSize, setPdfSize] = useState(initialDoc?.pdfSize || '2.4 MB');
  const [isDragging, setIsDragging] = useState(false);

  if (!isOpen) return null;

  const handleFileSelect = (file: File) => {
    setPdfFileName(file.name);
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
    setPdfSize(`${sizeInMB} MB`);
    if (!documentName) {
      setDocumentName(file.name);
    }
  };

  const handleSimulatedFilePick = () => {
    const fakeNames = [
      'REPOS_4_Multicenter_Renal_Outcome_Study_2026.pdf',
      'Cardiovasc_XL_Geriatric_Safety_Whitepaper.pdf',
      'GlycaNorm_HbA1c_36Month_Longitudinal_Analysis.pdf',
      'PulmoShield_Aerosol_Deposition_Report.pdf'
    ];
    const picked = fakeNames[Math.floor(Math.random() * fakeNames.length)];
    setPdfFileName(picked);
    setPdfSize('3.2 MB');
    if (!documentName) {
      setDocumentName(picked);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!documentName.trim()) return;

    const tagsArray = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const resultDoc: KBDocument = {
      id: initialDoc ? initialDoc.id : `doc-${Date.now()}`,
      name: documentName.endsWith('.pdf') ? documentName : `${documentName}.pdf`,
      product,
      uploadDate: initialDoc ? initialDoc.uploadDate : new Date().toISOString().split('T')[0],
      extractedObjectionsCount: initialDoc ? initialDoc.extractedObjectionsCount : 0,
      status: initialDoc ? initialDoc.status : 'Ready for AI',
      pdfSize: pdfSize || '2.1 MB',
      documentType,
      specialty,
      version,
      publishDate,
      company,
      tags: tagsArray,
      isFavorite: initialDoc ? initialDoc.isFavorite : false,
      isArchived: initialDoc ? initialDoc.isArchived : false,
      notes: notes || 'Scientific PDF uploaded via RepMind PDF Manager.',
      relatedCompetitors: initialDoc ? initialDoc.relatedCompetitors : ['Entresto 200mg (Novartis)', 'Norvasc 10mg (Pfizer)'],
      relatedObjections: initialDoc ? initialDoc.relatedObjections : ['Renal Safety in Elderly (eGFR < 45)'],
      pdfFileName: pdfFileName || 'scientific_document.pdf'
    };

    onSave(resultDoc);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-200/90 max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 px-6 py-5 text-white flex items-center justify-between shrink-0">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 border border-white/20 text-blue-200 text-[10px] font-black uppercase tracking-wider">
                <FileText className="w-3.5 h-3.5 text-blue-300" />
                <span>Feature 001 • PDF Intelligence</span>
              </div>
              <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
                {isEditing ? 'Edit PDF Document Metadata' : 'Upload Scientific PDF Document'}
              </h3>
              <p className="text-xs text-blue-100/90">
                Organize medical literature for future RepMind AI extraction and recall.
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
            {/* Choose PDF Box (Supports Click & Drag/Drop) */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-800 flex items-center justify-between">
                <span>Choose PDF File *</span>
                <span className="text-[11px] text-blue-600 font-bold">PDF Format Only</span>
              </label>

              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file) handleFileSelect(file);
                }}
                onClick={handleSimulatedFilePick}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-blue-600 bg-blue-50/80 scale-[1.01]'
                    : 'border-slate-300 hover:border-blue-500 bg-slate-50/60 hover:bg-slate-50'
                }`}
              >
                {pdfFileName ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-black border border-red-200">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-extrabold text-slate-900 break-all">{pdfFileName}</p>
                      <p className="text-xs text-slate-500 font-semibold">{pdfSize} • Ready for document indexing</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-slate-900">
                        Click to select PDF or drag and drop file here
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Supports Clinical Trials, Monographs, Detail Aids & Guidelines (Max 50MB)
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Grid 1: Name & Product */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-800">
                  Document Name *
                </label>
                <input
                  type="text"
                  required
                  value={documentName}
                  onChange={(e) => setDocumentName(e.target.value)}
                  placeholder="e.g. REPOS-3 Renal Trial 2026.pdf"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-800">
                  Related Product *
                </label>
                <select
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {SAMPLE_PRODUCTS.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name} ({p.molecule})
                    </option>
                  ))}
                  <option value="All Products">All Products (Cross-Portfolio)</option>
                </select>
              </div>
            </div>

            {/* Grid 2: Document Type & Specialty */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-800">
                  Document Type *
                </label>
                <select
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value as KBDocumentType)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {DOCUMENT_TYPES.map((dt) => (
                    <option key={dt} value={dt}>
                      {dt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-800">
                  Specialty *
                </label>
                <select
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {SPECIALTIES.map((sp) => (
                    <option key={sp} value={sp}>
                      {sp}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Grid 3: Version, Publish Date & Company */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-800">
                  Version
                </label>
                <input
                  type="text"
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  placeholder="v1.0"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-800">
                  Publish Date
                </label>
                <input
                  type="date"
                  value={publishDate}
                  onChange={(e) => setPublishDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-800">
                  Company
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="RepOS BioPharma"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Tags Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-blue-600" />
                <span>Tags (comma-separated)</span>
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Renal Safety, Geriatric, REPOS-3, Trial Data"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Notes Textarea */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-800">
                Notes & Summary
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Summary of key findings, target patient cohort, or detailing recommendations..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-extrabold hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all active:scale-[0.98]"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isEditing ? 'Update PDF Document' : 'Save Document to Library'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
