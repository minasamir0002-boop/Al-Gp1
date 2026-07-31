import React, { useState } from 'react';
import { 
  Package, 
  Pill, 
  Building2, 
  CheckCircle2, 
  ShieldAlert, 
  FileText, 
  BookOpen, 
  ArrowLeft, 
  Swords, 
  Sparkles,
  ChevronRight,
  Info
} from 'lucide-react';
import { SAMPLE_PRODUCTS, KBProduct } from '../../data/knowledgeData';

export const ProductsSection: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<KBProduct | null>(null);

  if (selectedProduct) {
    return (
      <div className="space-y-6">
        {/* Back to Products navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedProduct(null)}
            className="inline-flex items-center gap-1.5 text-xs font-extrabold text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Products List</span>
          </button>

          <span className="text-xs font-extrabold bg-slate-100 text-slate-700 px-3 py-1 rounded-full border border-slate-200">
            Product Profile & Clinical Evidences
          </span>
        </div>

        {/* Product Details Header */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  {selectedProduct.name}
                </h2>
                <span className="text-[11px] font-extrabold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-md">
                  {selectedProduct.company}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-600">
                Molecule: <span className="text-slate-900">{selectedProduct.molecule}</span>
              </p>
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-3 py-1 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-bold">
                {selectedProduct.dosageForms.join(', ')}
              </span>
              <span className="px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold">
                Strengths: {selectedProduct.strengths.join(' • ')}
              </span>
            </div>
          </div>

          {/* Indication Banner */}
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100/80 space-y-1">
            <span className="text-[10px] font-extrabold text-blue-700 uppercase tracking-wider block">
              Primary Approved Indication
            </span>
            <p className="text-xs sm:text-sm font-bold text-blue-950 leading-relaxed">
              {selectedProduct.indication}
            </p>
          </div>

          {/* General Information */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-blue-600" />
              <span>General Information & Pharmacology</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              {selectedProduct.generalInfo}
            </p>
          </div>
        </div>

        {/* Two-Column Grid: Key Messages & Clinical Benefits */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Key Messages */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Key Messages</span>
              </h3>
              <span className="text-[10px] font-bold text-slate-400">Core Detailing Points</span>
            </div>

            <ul className="space-y-2.5">
              {selectedProduct.keyMessages.map((msg, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-800 font-medium">
                  <span className="w-5 h-5 rounded-lg bg-amber-50 text-amber-700 font-extrabold flex items-center justify-center shrink-0 mt-0.5 border border-amber-200">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{msg}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Clinical Benefits */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Clinical Benefits</span>
              </h3>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                Evidence Based
              </span>
            </div>

            <ul className="space-y-2.5">
              {selectedProduct.clinicalBenefits.map((ben, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-800 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{ben}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Safety Points & Competitor List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Safety Points */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span>Safety Points & Contraindications</span>
              </h3>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md">
                Safety Profile
              </span>
            </div>

            <ul className="space-y-2.5">
              {selectedProduct.safetyPoints.map((pt, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-800 font-medium">
                  <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{pt}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Competitor List */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Swords className="w-4 h-4 text-rose-600" />
                <span>Competitor List</span>
              </h3>
              <span className="text-[10px] font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded-md">
                Market Rivals
              </span>
            </div>

            <div className="space-y-2">
              {selectedProduct.competitorList.map((comp, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-rose-50/50 border border-rose-100 text-xs font-bold text-rose-950 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Swords className="w-3.5 h-3.5 text-rose-600" />
                    <span>{comp}</span>
                  </div>
                  <span className="text-[10px] text-rose-700 font-semibold">Primary Competitor</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* References & Attached Documents */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* References */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <span>References</span>
              </h3>
              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                Peer-Reviewed
              </span>
            </div>

            <ul className="space-y-2">
              {selectedProduct.references.map((ref, idx) => (
                <li key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-200/70 text-xs text-slate-800 font-medium flex items-start gap-2">
                  <span className="text-[10px] font-extrabold text-indigo-600 mt-0.5">[{idx + 1}]</span>
                  <span>{ref}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Attached Documents */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Attached Documents</span>
              </h3>
              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                PDF Library
              </span>
            </div>

            <div className="space-y-2">
              {selectedProduct.attachedDocuments.map((docName, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-blue-50/60 rounded-2xl border border-blue-100 text-xs font-semibold text-blue-950 flex items-center justify-between hover:bg-blue-100/70 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-extrabold text-[9px] shrink-0">
                      PDF
                    </div>
                    <span className="truncate">{docName}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-blue-600 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Products List View
  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900">Products Catalog</h2>
          <p className="text-xs text-slate-500">
            Select any product to inspect indications, dosage forms, strengths, and clinical references.
          </p>
        </div>
        <span className="text-xs font-extrabold bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-100 self-start sm:self-auto">
          {SAMPLE_PRODUCTS.length} Local Products
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {SAMPLE_PRODUCTS.map((prod) => (
          <div
            key={prod.id}
            onClick={() => setSelectedProduct(prod)}
            className="group bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 cursor-pointer space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 font-extrabold text-sm">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {prod.name}
                    </h3>
                    <span className="text-xs text-slate-500 font-semibold">{prod.company}</span>
                  </div>
                </div>

                <span className="text-[10px] font-extrabold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg border border-blue-100">
                  {prod.dosageForms[0]}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">
                  Molecule
                </span>
                <span className="text-xs font-bold text-slate-800 block">{prod.molecule}</span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                {prod.indication}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                <Pill className="w-3.5 h-3.5 text-emerald-600" />
                <span>{prod.strengths.length} Strengths</span>
              </div>

              <span className="text-blue-600 font-extrabold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>View Details</span>
                <ChevronRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
