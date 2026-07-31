import React from 'react';
import {
  FileText,
  Star,
  Archive,
  Trash2,
  Edit3,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  Tag,
  Building2,
  Eye
} from 'lucide-react';
import { KBDocument } from '../../../data/knowledgeData';

interface DocumentCardProps {
  document: KBDocument;
  onSelect: (doc: KBDocument) => void;
  onToggleFavorite: (doc: KBDocument, e: React.MouseEvent) => void;
  onToggleArchive: (doc: KBDocument, e: React.MouseEvent) => void;
  onEdit: (doc: KBDocument, e: React.MouseEvent) => void;
  onDelete: (doc: KBDocument, e: React.MouseEvent) => void;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onSelect,
  onToggleFavorite,
  onToggleArchive,
  onEdit,
  onDelete
}) => {
  const isProcessed = document.status === 'Processed';
  const isArchived = document.isArchived || document.status === 'Archived';
  const isFavorite = Boolean(document.isFavorite);

  // Status Color badge
  const getStatusBadge = () => {
    if (isArchived) {
      return (
        <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1">
          <Archive className="w-3 h-3 text-slate-500" />
          <span>Archived</span>
        </span>
      );
    }
    if (isProcessed) {
      return (
        <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          <span>Processed</span>
        </span>
      );
    }
    return (
      <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
        <Clock className="w-3 h-3 text-amber-600" />
        <span>{document.status || 'Ready for AI'}</span>
      </span>
    );
  };

  return (
    <div
      onClick={() => onSelect(document)}
      className={`group relative bg-white rounded-3xl p-5 border transition-all duration-200 flex flex-col justify-between cursor-pointer ${
        isArchived
          ? 'border-slate-200/60 bg-slate-50/50 opacity-80'
          : 'border-slate-200/90 shadow-sm hover:shadow-md hover:border-blue-300'
      }`}
    >
      <div className="space-y-3">
        {/* Top Header: PDF Thumbnail & Quick Action Buttons */}
        <div className="flex items-start justify-between gap-3">
          {/* PDF Thumbnail Graphic */}
          <div className="flex items-center gap-2.5">
            <div className="relative w-12 h-14 rounded-xl bg-gradient-to-br from-red-50 to-red-100 border border-red-200/80 flex flex-col items-center justify-center text-red-600 shadow-sm shrink-0">
              <FileText className="w-5 h-5 mb-0.5 text-red-600" />
              <span className="text-[8px] font-black tracking-widest uppercase bg-red-600 text-white px-1 py-0.5 rounded">
                PDF
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md inline-block">
                {document.documentType || 'Clinical Study'}
              </span>
              <div className="flex items-center gap-1 text-[11px] text-slate-500 font-semibold">
                <span>{document.specialty || 'Cardiology'}</span>
                <span>•</span>
                <span>{document.version || 'v1.0'}</span>
              </div>
            </div>
          </div>

          {/* Action Icons Bar */}
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={(e) => onToggleFavorite(document, e)}
              title={isFavorite ? 'Remove from favorites' : 'Mark as favorite'}
              className={`p-1.5 rounded-lg transition-colors ${
                isFavorite
                  ? 'text-amber-500 bg-amber-50 hover:bg-amber-100'
                  : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100'
              }`}
            >
              <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
            </button>

            <button
              onClick={(e) => onEdit(document, e)}
              title="Edit document metadata"
              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <Edit3 className="w-4 h-4" />
            </button>

            <button
              onClick={(e) => onToggleArchive(document, e)}
              title={isArchived ? 'Unarchive document' : 'Archive document'}
              className={`p-1.5 rounded-lg transition-colors ${
                isArchived
                  ? 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                  : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Archive className="w-4 h-4" />
            </button>

            <button
              onClick={(e) => onDelete(document, e)}
              title="Delete document"
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Title */}
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 leading-snug break-words group-hover:text-blue-600 transition-colors">
            {document.name}
          </h3>

          <div className="flex items-center flex-wrap gap-1.5 mt-2">
            <span className="text-[11px] font-extrabold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
              {document.product}
            </span>
            {document.company && (
              <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                <Building2 className="w-3 h-3 text-slate-400" />
                <span>{document.company}</span>
              </span>
            )}
          </div>
        </div>

        {/* Tags preview */}
        {document.tags && document.tags.length > 0 && (
          <div className="flex items-center flex-wrap gap-1 pt-1">
            {document.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="text-[10px] font-semibold text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200/80"
              >
                #{tag}
              </span>
            ))}
            {document.tags.length > 3 && (
              <span className="text-[10px] font-semibold text-slate-400">
                +{document.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer: Upload Date, Size, and Status */}
      <div className="pt-3.5 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-slate-500 font-medium">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{document.uploadDate}</span>
          </span>
          <span>•</span>
          <span className="font-bold text-slate-700">{document.pdfSize}</span>
        </div>

        <div>{getStatusBadge()}</div>
      </div>
    </div>
  );
};
