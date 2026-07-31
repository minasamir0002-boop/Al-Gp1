import React from 'react';
import { 
  Search, 
  Package, 
  FileText, 
  ShieldAlert, 
  Swords, 
  ChevronRight,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { 
  SAMPLE_PRODUCTS, 
  SAMPLE_DOCUMENTS, 
  SAMPLE_OBJECTIONS, 
  SAMPLE_COMPETITORS 
} from '../../data/knowledgeData';

interface GlobalSearchResultsProps {
  query: string;
  onSelectSection: (section: 'products' | 'documents' | 'objections' | 'competitors') => void;
}

export const GlobalSearchResults: React.FC<GlobalSearchResultsProps> = ({ query, onSelectSection }) => {
  const q = query.trim().toLowerCase();

  const matchingProducts = SAMPLE_PRODUCTS.filter((prod) =>
    prod.name.toLowerCase().includes(q) ||
    prod.molecule.toLowerCase().includes(q) ||
    prod.company.toLowerCase().includes(q) ||
    prod.indication.toLowerCase().includes(q) ||
    prod.generalInfo.toLowerCase().includes(q)
  );

  const matchingDocuments = SAMPLE_DOCUMENTS.filter((doc) =>
    doc.name.toLowerCase().includes(q) ||
    doc.product.toLowerCase().includes(q)
  );

  const matchingObjections = SAMPLE_OBJECTIONS.filter((obj) =>
    obj.title.toLowerCase().includes(q) ||
    obj.relatedProduct.toLowerCase().includes(q) ||
    obj.category.toLowerCase().includes(q) ||
    obj.shortScientificAnswer.toLowerCase().includes(q)
  );

  const matchingCompetitors = SAMPLE_COMPETITORS.filter((comp) =>
    comp.brandName.toLowerCase().includes(q) ||
    comp.company.toLowerCase().includes(q) ||
    comp.competesAgainst.toLowerCase().includes(q) ||
    comp.mainStrength.toLowerCase().includes(q) ||
    comp.mainWeakness.toLowerCase().includes(q)
  );

  const totalResults =
    matchingProducts.length +
    matchingDocuments.length +
    matchingObjections.length +
    matchingCompetitors.length;

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Search className="w-5 h-5 text-blue-600" />
            <span>Global Search Results for "{query}"</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Searching across Products, Scientific Documents, Objections Library, and Competitors.
          </p>
        </div>

        <span className="text-xs font-extrabold bg-blue-100 text-blue-800 px-3 py-1 rounded-full border border-blue-200 shrink-0">
          {totalResults} matches
        </span>
      </div>

      {totalResults === 0 && (
        <div className="bg-white rounded-3xl p-10 border border-slate-200/90 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-extrabold text-slate-800">No matching items found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            We searched across Products, Documents, Objections, and Competitors for "{query}". Try checking for spelling errors or searching by molecule or category.
          </p>
        </div>
      )}

      {/* 1. Products matches */}
      {matchingProducts.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Package className="w-4 h-4 text-blue-600" />
              <span>Products ({matchingProducts.length})</span>
            </h3>
            <button
              onClick={() => onSelectSection('products')}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              View all products →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {matchingProducts.map((prod) => (
              <div
                key={prod.id}
                onClick={() => onSelectSection('products')}
                className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:border-blue-400 transition-all cursor-pointer space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-extrabold text-slate-900">{prod.name}</span>
                  <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md">
                    {prod.company}
                  </span>
                </div>
                <p className="text-xs text-slate-600 line-clamp-2">{prod.generalInfo}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Documents matches */}
      {matchingDocuments.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>Scientific Documents ({matchingDocuments.length})</span>
            </h3>
            <button
              onClick={() => onSelectSection('documents')}
              className="text-xs font-bold text-indigo-600 hover:underline"
            >
              View all documents →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {matchingDocuments.map((doc) => (
              <div
                key={doc.id}
                onClick={() => onSelectSection('documents')}
                className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:border-indigo-400 transition-all cursor-pointer space-y-1.5"
              >
                <div className="flex items-start gap-2">
                  <div className="w-7 h-7 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-extrabold text-[9px] shrink-0">
                    PDF
                  </div>
                  <span className="text-xs font-extrabold text-slate-900 line-clamp-1">{doc.name}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Product: {doc.product}</span>
                  <span className="font-bold text-emerald-700">{doc.extractedObjectionsCount} objections</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Objections matches */}
      {matchingObjections.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Objection Library ({matchingObjections.length})</span>
            </h3>
            <button
              onClick={() => onSelectSection('objections')}
              className="text-xs font-bold text-amber-700 hover:underline"
            >
              View all objections →
            </button>
          </div>

          <div className="space-y-2">
            {matchingObjections.map((obj) => (
              <div
                key={obj.id}
                onClick={() => onSelectSection('objections')}
                className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:border-amber-400 transition-all cursor-pointer space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-900">{obj.title}</span>
                  <span className="text-[10px] font-bold bg-amber-50 text-amber-800 px-2 py-0.5 rounded-md">
                    {obj.category}
                  </span>
                </div>
                <p className="text-xs text-slate-700 font-medium">{obj.shortScientificAnswer}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Competitors matches */}
      {matchingCompetitors.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Swords className="w-4 h-4 text-rose-600" />
              <span>Competitors ({matchingCompetitors.length})</span>
            </h3>
            <button
              onClick={() => onSelectSection('competitors')}
              className="text-xs font-bold text-rose-700 hover:underline"
            >
              View all competitors →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {matchingCompetitors.map((comp) => (
              <div
                key={comp.id}
                onClick={() => onSelectSection('competitors')}
                className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:border-rose-400 transition-all cursor-pointer space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-900">{comp.brandName}</span>
                  <span className="text-[10px] font-bold bg-rose-50 text-rose-800 px-2 py-0.5 rounded-md">
                    vs {comp.competesAgainst}
                  </span>
                </div>
                <p className="text-xs text-slate-600 line-clamp-2">
                  <strong className="text-slate-800">Strength:</strong> {comp.mainStrength}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
