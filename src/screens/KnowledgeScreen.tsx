import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { 
  BookOpen, 
  Search, 
  Package, 
  FileText, 
  ShieldAlert, 
  Swords, 
  LayoutGrid, 
  X,
  Sparkles,
  CheckSquare
} from 'lucide-react';
import { KnowledgeDashboard } from '../components/Knowledge/KnowledgeDashboard';
import { ProductsSection } from '../components/Knowledge/ProductsSection';
import { DocumentsSection } from '../components/Knowledge/DocumentsSection';
import { ObjectionsSection } from '../components/Knowledge/ObjectionsSection';
import { CompetitorsSection } from '../components/Knowledge/CompetitorsSection';
import { GlobalSearchResults } from '../components/Knowledge/GlobalSearchResults';
import { KnowledgeReviewSection } from '../components/Knowledge/KnowledgeReviewSection';

type KnowledgeTab = 'overview' | 'products' | 'documents' | 'objections' | 'competitors' | 'review-queue';

export const KnowledgeScreen: React.FC = () => {
  const { setActiveTab } = useApp();
  const [currentSection, setCurrentSection] = useState<KnowledgeTab>('overview');
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');

  const handleSelectSection = (section: 'products' | 'documents' | 'objections' | 'competitors' | 'review-queue') => {
    setGlobalSearchQuery('');
    setCurrentSection(section);
  };

  const isSearching = globalSearchQuery.trim().length > 0;

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-5xl mx-auto pb-24">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <span>RepMind Knowledge Base</span>
          </h1>
          <p className="text-xs text-slate-500">
            The core intelligence engine for products, clinical evidence, objections, and competitors
          </p>
        </div>

        <button 
          onClick={() => setActiveTab('home')} 
          className="text-xs font-extrabold text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 px-3.5 py-1.5 rounded-xl border border-blue-200 self-start sm:self-auto"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Global Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={globalSearchQuery}
            onChange={(e) => setGlobalSearchQuery(e.target.value)}
            placeholder="Global Search across Products, Scientific Documents, Objections, or Competitors..."
            className="w-full pl-10 pr-10 py-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white text-slate-900 font-medium placeholder:text-slate-400 transition-all"
          />
          {globalSearchQuery && (
            <button
              onClick={() => setGlobalSearchQuery('')}
              className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 p-0.5 rounded-lg"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Search helper text */}
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Local Index: Search searches in real-time across all 4 knowledge modules.</span>
          </span>
          {isSearching && (
            <span className="text-blue-600 font-bold">
              Filtering active
            </span>
          )}
        </div>
      </div>

      {/* Section Navigation Tabs (Hidden when searching globally) */}
      {!isSearching && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setCurrentSection('overview')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 shrink-0 transition-all ${
              currentSection === 'overview'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Overview Dashboard</span>
          </button>

          <button
            onClick={() => setCurrentSection('products')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 shrink-0 transition-all ${
              currentSection === 'products'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Products</span>
          </button>

          <button
            onClick={() => setCurrentSection('documents')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 shrink-0 transition-all ${
              currentSection === 'documents'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Scientific Documents</span>
          </button>

          <button
            onClick={() => setCurrentSection('objections')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 shrink-0 transition-all ${
              currentSection === 'objections'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Objections Library</span>
          </button>

          <button
            onClick={() => setCurrentSection('competitors')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 shrink-0 transition-all ${
              currentSection === 'competitors'
                ? 'bg-rose-600 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            <Swords className="w-4 h-4" />
            <span>Competitors</span>
          </button>

          <button
            onClick={() => setCurrentSection('review-queue')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 shrink-0 transition-all ${
              currentSection === 'review-queue'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>Review Queue & Audit</span>
            <span className="text-[10px] bg-purple-100 text-purple-900 px-1.5 py-0.5 rounded-md font-black">
              3 Pending
            </span>
          </button>
        </div>
      )}

      {/* Main Content Area */}
      {isSearching ? (
        <motion.div
          key="search-results"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <GlobalSearchResults
            query={globalSearchQuery}
            onSelectSection={handleSelectSection}
          />
        </motion.div>
      ) : (
        <motion.div
          key={currentSection}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {currentSection === 'overview' && (
            <KnowledgeDashboard onSelectSection={handleSelectSection} />
          )}

          {currentSection === 'products' && <ProductsSection />}

          {currentSection === 'documents' && <DocumentsSection />}

          {currentSection === 'objections' && <ObjectionsSection />}

          {currentSection === 'competitors' && <CompetitorsSection />}

          {currentSection === 'review-queue' && <KnowledgeReviewSection />}
        </motion.div>
      )}
    </div>
  );
};
