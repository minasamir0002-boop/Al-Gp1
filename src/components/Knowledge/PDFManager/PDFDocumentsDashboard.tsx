import React, { useState, useEffect } from 'react';
import {
  FileText,
  Upload,
  Plus,
  Search,
  Filter,
  Star,
  Archive,
  BookOpen,
  FileCheck,
  Building2,
  Swords,
  ShieldAlert,
  Layers,
  Sparkles,
  Cpu,
  ArrowRight,
  CheckCircle2,
  X
} from 'lucide-react';
import { KBDocument, KBDocumentType, SAMPLE_DOCUMENTS, SAMPLE_PRODUCTS } from '../../../data/knowledgeData';
import { DocumentCard } from './DocumentCard';
import { DocumentDetailsModal } from './DocumentDetailsModal';
import { UploadPDFModal } from './UploadPDFModal';

interface PDFDocumentsDashboardProps {
  onOpenAiProcessor?: () => void;
}

const STORAGE_KEY = 'repmind_pdf_documents_v1';

export const PDFDocumentsDashboard: React.FC<PDFDocumentsDashboardProps> = ({ onOpenAiProcessor }) => {
  // Load documents from localStorage with fallback to SAMPLE_DOCUMENTS
  const [documents, setDocuments] = useState<KBDocument[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load PDF documents from localStorage:', e);
    }
    return SAMPLE_DOCUMENTS;
  });

  // Save to localStorage when documents change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
    } catch (e) {
      console.error('Failed to save PDF documents to localStorage:', e);
    }
  }, [documents]);

  // Modal states
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<KBDocument | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<KBDocument | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('ALL');
  const [selectedProduct, setSelectedProduct] = useState<string>('ALL');
  const [showArchivedOnly, setShowArchivedOnly] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Statistics Calculation
  const totalDocuments = documents.length;
  const distinctProductsCount = new Set(documents.map(d => d.product)).size;
  const clinicalStudiesCount = documents.filter(d => d.documentType === 'Clinical Study').length;
  const detailAidsCount = documents.filter(d => d.documentType === 'Detail Aid').length;
  const guidelinesCount = documents.filter(d => d.documentType === 'Guideline').length;
  const competitorFilesCount = documents.filter(d => d.documentType === 'Competitor File').length;

  // Filter logic
  const filteredDocuments = documents.filter(doc => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery || (
      doc.name.toLowerCase().includes(q) ||
      doc.product.toLowerCase().includes(q) ||
      (doc.tags && doc.tags.some(t => t.toLowerCase().includes(q))) ||
      (doc.company && doc.company.toLowerCase().includes(q))
    );

    const matchesType = selectedType === 'ALL' || doc.documentType === selectedType;
    const matchesSpecialty = selectedSpecialty === 'ALL' || doc.specialty === selectedSpecialty;
    const matchesProduct = selectedProduct === 'ALL' || doc.product === selectedProduct;
    const matchesArchived = showArchivedOnly ? Boolean(doc.isArchived || doc.status === 'Archived') : !doc.isArchived;
    const matchesFavorite = !showFavoritesOnly || Boolean(doc.isFavorite);

    return matchesSearch && matchesType && matchesSpecialty && matchesProduct && matchesArchived && matchesFavorite;
  });

  // Handlers
  const handleSaveDocument = (newDoc: KBDocument) => {
    const exists = documents.some(d => d.id === newDoc.id);
    if (exists) {
      setDocuments(documents.map(d => d.id === newDoc.id ? newDoc : d));
      showToast(`Updated document "${newDoc.name}" successfully.`);
    } else {
      setDocuments([newDoc, ...documents]);
      showToast(`Uploaded "${newDoc.name}" to the PDF Library.`);
    }
  };

  const handleToggleFavorite = (doc: KBDocument, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = { ...doc, isFavorite: !doc.isFavorite };
    setDocuments(documents.map(d => d.id === doc.id ? updated : d));
    showToast(updated.isFavorite ? 'Added to favorites.' : 'Removed from favorites.');
  };

  const handleToggleArchive = (doc: KBDocument, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const willArchive = !doc.isArchived;
    const updated: KBDocument = {
      ...doc,
      isArchived: willArchive,
      status: willArchive ? 'Archived' : 'Processed'
    };
    setDocuments(documents.map(d => d.id === doc.id ? updated : d));
    showToast(willArchive ? 'Document archived.' : 'Document unarchived.');
  };

  const handleDelete = (doc: KBDocument, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setDocuments(documents.filter(d => d.id !== doc.id));
    showToast(`Deleted document "${doc.name}".`);
  };

  const handleEdit = (doc: KBDocument, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingDoc(doc);
    setIsUploadOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="bg-slate-900 text-white px-4 py-3 rounded-2xl text-xs font-extrabold flex items-center justify-between shadow-xl border border-slate-700 animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)}>
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      )}

      {/* HERO HEADER */}
      <div className="bg-gradient-to-r from-blue-950 via-indigo-900 to-slate-900 rounded-3xl p-6 text-white shadow-xl border border-blue-400/20 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-blue-200 text-[10px] font-black uppercase tracking-wider">
              <FileText className="w-3.5 h-3.5 text-amber-300" />
              <span>Feature 001 • PDF Intelligence Manager</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <span>Scientific PDF Documents Dashboard</span>
              <Sparkles className="w-4 h-4 text-amber-300" />
            </h2>
            <p className="text-xs text-blue-100/90 leading-relaxed max-w-2xl">
              Medical literature library organized for rapid field recall and future RepMind AI extraction. Use local storage to upload, classify, and tag PDF assets.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {onOpenAiProcessor && (
              <button
                onClick={onOpenAiProcessor}
                className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white text-xs font-black rounded-2xl border border-white/20 flex items-center gap-2 transition-all"
              >
                <Cpu className="w-4 h-4 text-amber-300" />
                <span>AI Processor (Sprint 2.1)</span>
              </button>
            )}

            <button
              onClick={() => {
                setEditingDoc(null);
                setIsUploadOpen(true);
              }}
              className="px-5 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-black rounded-2xl shadow-lg shadow-blue-500/25 flex items-center gap-2 transition-all active:scale-[0.98]"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Document (PDF)</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION: STATISTICS ROW (Total Documents, Products, Clinical Studies, Detail Aids, Guidelines, Competitor Files) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm space-y-1">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
            Total Documents
          </span>
          <div className="flex items-center justify-between">
            <span className="text-xl font-black text-slate-900">{totalDocuments}</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm space-y-1">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
            Products Covered
          </span>
          <div className="flex items-center justify-between">
            <span className="text-xl font-black text-slate-900">{distinctProductsCount}</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm space-y-1">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
            Clinical Studies
          </span>
          <div className="flex items-center justify-between">
            <span className="text-xl font-black text-emerald-700">{clinicalStudiesCount}</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm space-y-1">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
            Detail Aids
          </span>
          <div className="flex items-center justify-between">
            <span className="text-xl font-black text-purple-700">{detailAidsCount}</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm space-y-1">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
            Guidelines
          </span>
          <div className="flex items-center justify-between">
            <span className="text-xl font-black text-amber-700">{guidelinesCount}</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm space-y-1">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
            Competitor Files
          </span>
          <div className="flex items-center justify-between">
            <span className="text-xl font-black text-red-600">{competitorFilesCount}</span>
            <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <Swords className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search PDF documents by title, product, company, or tag..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Toggle Chips: Favorites & Archived */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold flex items-center gap-1.5 border transition-all ${
                showFavoritesOnly
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${showFavoritesOnly ? 'fill-amber-400 text-amber-500' : ''}`} />
              <span>Favorites</span>
            </button>

            <button
              onClick={() => setShowArchivedOnly(!showArchivedOnly)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold flex items-center gap-1.5 border transition-all ${
                showArchivedOnly
                  ? 'bg-slate-800 text-white border-slate-800'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Archive className="w-3.5 h-3.5" />
              <span>{showArchivedOnly ? 'Showing Archived' : 'Archived'}</span>
            </button>
          </div>
        </div>

        {/* Dropdowns row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Document Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Types</option>
              <option value="Clinical Study">Clinical Study</option>
              <option value="Detail Aid">Detail Aid</option>
              <option value="Guideline">Guideline</option>
              <option value="Competitor File">Competitor File</option>
              <option value="Product Monograph">Product Monograph</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Product
            </label>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Products</option>
              {SAMPLE_PRODUCTS.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name}
                </option>
              ))}
              <option value="All Products">All Products (Cross-Portfolio)</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Specialty
            </label>
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Specialties</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Endocrinology">Endocrinology</option>
              <option value="Pulmonology">Pulmonology</option>
              <option value="Neurology">Neurology</option>
              <option value="Nephrology">Nephrology</option>
              <option value="Geriatrics">Geriatrics</option>
              <option value="General Practice">General Practice</option>
            </select>
          </div>
        </div>
      </div>

      {/* DOCUMENTS GRID */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold text-slate-500">
            Showing <span className="text-slate-900 font-black">{filteredDocuments.length}</span> PDF document{filteredDocuments.length !== 1 ? 's' : ''}
          </span>
        </div>

        {filteredDocuments.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-200/90 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">No PDF documents match your filter</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try resetting your search query or uploading a new scientific PDF to the library.
              </p>
            </div>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedType('ALL');
                setSelectedProduct('ALL');
                setSelectedSpecialty('ALL');
                setShowFavoritesOnly(false);
                setShowArchivedOnly(false);
              }}
              className="px-4 py-2 rounded-xl bg-blue-50 text-blue-600 font-extrabold text-xs hover:bg-blue-100"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDocuments.map((doc) => (
              <DocumentCard
                key={doc.id}
                document={doc}
                onSelect={setSelectedDoc}
                onToggleFavorite={handleToggleFavorite}
                onToggleArchive={handleToggleArchive}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* MODALS */}
      <UploadPDFModal
        isOpen={isUploadOpen}
        onClose={() => {
          setIsUploadOpen(false);
          setEditingDoc(null);
        }}
        onSave={handleSaveDocument}
        initialDoc={editingDoc}
      />

      <DocumentDetailsModal
        document={selectedDoc}
        onClose={() => setSelectedDoc(null)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleFavorite={handleToggleFavorite}
        onToggleArchive={handleToggleArchive}
      />
    </div>
  );
};
