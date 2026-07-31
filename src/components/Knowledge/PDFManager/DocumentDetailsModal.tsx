import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  FileText,
  Star,
  Archive,
  Trash2,
  Edit3,
  Calendar,
  Building2,
  Tag,
  ShieldAlert,
  Pill,
  Swords,
  CheckCircle2,
  Clock,
  Sparkles,
  Info,
  Download
} from 'lucide-react';
import { KBDocument } from '../../../data/knowledgeData';

interface DocumentDetailsModalProps {
  document: KBDocument | null;
  onClose: () => void;
  onEdit: (doc: KBDocument) => void;
  onDelete: (doc: KBDocument) => void;
  onToggleFavorite: (doc: KBDocument) => void;
  onToggleArchive: (doc: KBDocument) => void;
}

export const DocumentDetailsModal: React.FC<DocumentDetailsModalProps> = ({
  document,
  onClose,
  onEdit,
  onDelete,
  onToggleFavorite,
  onToggleArchive
}) => {
  if (!document) return null;

  const isFavorite = Boolean(document.isFavorite);
  const isArchived = Boolean(document.isArchived) || document.status === 'Archived';
  const isProcessed = document.status === 'Processed';

  const relatedCompetitors = document.relatedCompetitors || [
    'Entresto 200mg (Novartis)',
    'Norvasc 10mg (Pfizer)'
  ];

  const relatedObjections = document.relatedObjections || [
    'Renal Safety in Elderly Patients (eGFR < 45)',
    'Hospital Formulary Tier 3 Copay Restrictions'
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-200/90 max-h-[90vh] flex flex-col"
        >
          {/* Top Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 p-6 text-white flex items-start justify-between shrink-0">
            <div className="flex items-start gap-4">
              {/* PDF Cover Graphic */}
              <div className="w-16 h-20 rounded-2xl bg-red-50 text-red-600 flex flex-col items-center justify-center border-2 border-red-200 shadow-lg shrink-0">
                <FileText className="w-8 h-8 mb-1" />
                <span className="text-[10px] font-black tracking-widest uppercase bg-red-600 text-white px-2 py-0.5 rounded">
                  PDF
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center flex-wrap gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30">
                    {document.documentType || 'Clinical Study'}
                  </span>
                  <span className="text-[10px] font-bold text-slate-300 bg-white/10 px-2 py-0.5 rounded">
                    {document.specialty || 'Cardiology'}
                  </span>
                  <span className="text-[10px] font-bold text-slate-300 bg-white/10 px-2 py-0.5 rounded">
                    {document.version || 'v1.0'}
                  </span>
                </div>

                <h2 className="text-base sm:text-lg font-black tracking-tight text-white break-words">
                  {document.name}
                </h2>

                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-blue-300" />
                    <span>Uploaded {document.uploadDate}</span>
                  </span>
                  <span>•</span>
                  <span className="font-bold text-white">{document.pdfSize}</span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 space-y-6 overflow-y-auto flex-1">
            {/* Action Bar: Favorite, Edit, Archive, Delete */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-black px-3 py-1.5 rounded-xl border flex items-center gap-1.5 ${
                    isArchived
                      ? 'bg-slate-200 text-slate-700 border-slate-300'
                      : isProcessed
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}
                >
                  {isProcessed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Clock className="w-4 h-4 text-amber-600" />
                  )}
                  <span>Status: {document.status || 'Ready for AI'}</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onToggleFavorite(document)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-colors ${
                    isFavorite
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <Star className={`w-3.5 h-3.5 ${isFavorite ? 'fill-amber-400 text-amber-500' : ''}`} />
                  <span>{isFavorite ? 'Favorited' : 'Favorite'}</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onEdit(document);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 text-xs font-extrabold flex items-center gap-1.5 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => onToggleArchive(document)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-colors ${
                    isArchived
                      ? 'bg-blue-100 text-blue-800 border border-blue-300'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <Archive className="w-3.5 h-3.5 text-slate-600" />
                  <span>{isArchived ? 'Unarchive' : 'Archive'}</span>
                </button>

                <button
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to delete "${document.name}"?`)) {
                      onClose();
                      onDelete(document);
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white text-red-600 hover:bg-red-50 border border-red-200 text-xs font-extrabold flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>

            {/* PREVIEW INFORMATION */}
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Info className="w-4 h-4 text-blue-600" />
                <span>Preview Information</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] text-slate-400 font-bold block">Company / Publisher</span>
                  <span className="text-xs font-extrabold text-slate-900 block truncate">
                    {document.company || 'RepOS BioPharma'}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] text-slate-400 font-bold block">Publish Date</span>
                  <span className="text-xs font-extrabold text-slate-900 block">
                    {document.publishDate || '2026-06-15'}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] text-slate-400 font-bold block">File Format</span>
                  <span className="text-xs font-extrabold text-red-600 block">
                    PDF Document
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] text-slate-400 font-bold block">Extracted Objections</span>
                  <span className="text-xs font-extrabold text-amber-800 block">
                    {document.extractedObjectionsCount} Objections
                  </span>
                </div>
              </div>

              {/* Tags */}
              {document.tags && document.tags.length > 0 && (
                <div className="flex items-center flex-wrap gap-1.5 pt-1">
                  <span className="text-xs font-bold text-slate-500 mr-1">Tags:</span>
                  {document.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-extrabold text-blue-800 bg-blue-50 px-3 py-1 rounded-full border border-blue-200"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* RELATED PRODUCT */}
            <div className="space-y-2">
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Pill className="w-4 h-4 text-blue-600" />
                <span>Related Product</span>
              </h3>
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xs">
                    Rx
                  </div>
                  <div>
                    <span className="text-xs font-black text-blue-950 block">{document.product}</span>
                    <span className="text-[11px] text-blue-700 font-medium">Primary Indication Asset</span>
                  </div>
                </div>
                <span className="text-[11px] font-extrabold text-blue-800 bg-white px-3 py-1 rounded-full border border-blue-200">
                  Active Product
                </span>
              </div>
            </div>

            {/* RELATED COMPETITORS */}
            <div className="space-y-2">
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Swords className="w-4 h-4 text-purple-600" />
                <span>Related Competitors</span>
              </h3>
              <div className="flex items-center flex-wrap gap-2">
                {relatedCompetitors.map((comp, idx) => (
                  <div
                    key={idx}
                    className="px-3.5 py-2 rounded-xl bg-purple-50 border border-purple-200/80 text-xs font-bold text-purple-900 flex items-center gap-1.5"
                  >
                    <Swords className="w-3.5 h-3.5 text-purple-600" />
                    <span>{comp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* RELATED OBJECTIONS */}
            <div className="space-y-2">
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span>Related Scientific Objections ({relatedObjections.length})</span>
              </h3>
              <div className="space-y-2">
                {relatedObjections.map((obj, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/80 text-xs font-bold text-amber-900 flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>{obj}</span>
                    </span>
                    <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded font-black shrink-0">
                      Linked
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* NOTES */}
            <div className="space-y-2">
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                Notes & Medical Summary
              </h3>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 font-medium leading-relaxed">
                {document.notes || 'No custom notes added yet. Use Edit to attach detailing notes.'}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
            <span className="text-xs text-slate-500 font-medium">
              Stored locally • Ready for RepMind AI processing
            </span>
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black shadow-md transition-colors"
            >
              Close Details
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
