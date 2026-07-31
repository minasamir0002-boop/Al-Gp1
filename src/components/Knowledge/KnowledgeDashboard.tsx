import React from 'react';
import { 
  Package, 
  FileText, 
  ShieldAlert, 
  Swords, 
  ChevronRight, 
  Sparkles, 
  Database,
  ArrowUpRight,
  Upload,
  Cpu,
  CheckSquare
} from 'lucide-react';
import { SAMPLE_PRODUCTS, SAMPLE_DOCUMENTS, SAMPLE_OBJECTIONS, SAMPLE_COMPETITORS } from '../../data/knowledgeData';

interface KnowledgeDashboardProps {
  onSelectSection: (section: 'products' | 'documents' | 'objections' | 'competitors' | 'review-queue') => void;
}

export const KnowledgeDashboard: React.FC<KnowledgeDashboardProps> = ({ onSelectSection }) => {
  return (
    <div className="space-y-6">
      {/* Banner / AI Readiness Note */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 rounded-3xl p-5 sm:p-6 text-white shadow-xl border border-blue-900/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-[10px] font-extrabold uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>RepMind Intelligence Core • Knowledge Base</span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-white">
              Central Scientific & Commercial Knowledge Base
            </h2>
            <p className="text-xs sm:text-sm text-blue-200 leading-relaxed">
              Explore molecules, peer-reviewed clinical documents, objection battlecards, and competitor profiles. Designed for instant field detailing and ready for future AI synthesis.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-blue-200 bg-white/10 px-3.5 py-2 rounded-xl border border-white/10 shrink-0">
            <Database className="w-4 h-4 text-blue-400" />
            <span>Local Index Active</span>
          </div>
        </div>
      </div>

      {/* SPRINT 2.1 AI DOCUMENT INTELLIGENCE HERO CARD */}
      <div 
        onClick={() => onSelectSection('documents')}
        className="group relative bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-3xl p-5 sm:p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer border border-blue-400/30 overflow-hidden"
      >
        <div className="absolute right-0 top-0 -mr-12 -mt-12 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-white text-[10px] font-black uppercase tracking-wider">
              <Cpu className="w-3.5 h-3.5 text-amber-300" />
              <span>Sprint 2.1 • New AI Feature</span>
            </div>
            <h3 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
              <span>AI Document Intelligence Engine</span>
              <Sparkles className="w-4 h-4 text-amber-300" />
            </h3>
            <p className="text-xs text-blue-100 leading-relaxed">
              Upload PDF, DOCX, PPTX, or Image clinical trials to automatically extract product data, doctor objections, scientific answers, and head-to-head competitor battlecards.
            </p>
          </div>

          <button className="px-5 py-3 rounded-2xl bg-white text-blue-900 font-black text-xs shadow-lg flex items-center gap-2 shrink-0 group-hover:scale-105 transition-transform">
            <Upload className="w-4 h-4 text-blue-600" />
            <span>Try AI Document Upload →</span>
          </button>
        </div>
      </div>

      {/* SPRINT 5.0 AI CORE REVIEW QUEUE & MEDICAL AUDIT HERO CARD */}
      <div 
        onClick={() => onSelectSection('review-queue')}
        className="group relative bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 rounded-3xl p-5 sm:p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer border border-purple-500/30 overflow-hidden"
      >
        <div className="absolute right-0 top-0 -mr-12 -mt-12 w-48 h-48 rounded-full bg-purple-500/10 blur-2xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-purple-300 text-[10px] font-black uppercase tracking-wider">
              <CheckSquare className="w-3.5 h-3.5 text-purple-300" />
              <span>Sprint 5.0 • AI Core Architecture (MVP)</span>
            </div>
            <h3 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
              <span>Knowledge Review Queue & Medical Audit</span>
              <Sparkles className="w-4 h-4 text-amber-300" />
            </h3>
            <p className="text-xs text-purple-100 leading-relaxed">
              Whenever a document is processed, extracted objections enter the Review Queue. Review AI confidence %, edit scientific answers, and track full regulatory audit logs before publishing.
            </p>
          </div>

          <button className="px-5 py-3 rounded-2xl bg-white text-purple-950 font-black text-xs shadow-lg flex items-center gap-2 shrink-0 group-hover:scale-105 transition-transform">
            <CheckSquare className="w-4 h-4 text-purple-600" />
            <span>Open Review Queue (3 Pending) →</span>
          </button>
        </div>
      </div>

      {/* 4 Premium Section Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Card 1: Products */}
        <div
          onClick={() => onSelectSection('products')}
          className="group relative bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 cursor-pointer flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 group-hover:scale-105 transition-transform">
                <Package className="w-6 h-6" />
              </div>
              <span className="text-xs font-extrabold bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                {SAMPLE_PRODUCTS.length} Products
              </span>
            </div>

            <div>
              <h3 className="text-base font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors flex items-center gap-1.5">
                <span>Products</span>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Full pharmacological profiles, indications, dosage forms, strengths, key clinical benefits, and safety points.
              </p>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
            <span>Open Product Catalog</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 2: Scientific Documents */}
        <div
          onClick={() => onSelectSection('documents')}
          className="group relative bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all duration-300 cursor-pointer flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 group-hover:scale-105 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <span className="text-xs font-extrabold bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">
                {SAMPLE_DOCUMENTS.length} Documents
              </span>
            </div>

            <div>
              <h3 className="text-base font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center gap-1.5">
                <span>Scientific Documents</span>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Uploaded clinical trials, prescribing monographs, and reference guides with automated objection extraction tracking.
              </p>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600">
            <span>Browse Documents & Uploads</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 3: Objections Library */}
        <div
          onClick={() => onSelectSection('objections')}
          className="group relative bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-amber-300 transition-all duration-300 cursor-pointer flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 group-hover:scale-105 transition-transform">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <span className="text-xs font-extrabold bg-amber-100 text-amber-900 px-3 py-1 rounded-full">
                {SAMPLE_OBJECTIONS.length} Objections
              </span>
            </div>

            <div>
              <h3 className="text-base font-extrabold text-slate-900 group-hover:text-amber-600 transition-colors flex items-center gap-1.5">
                <span>Objections Library</span>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition-colors" />
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Searchable database of clinical, cost, safety, efficacy, guideline, and compliance objections with scientific answers.
              </p>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-700">
            <span>Search Objection Answers</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 4: Competitors */}
        <div
          onClick={() => onSelectSection('competitors')}
          className="group relative bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-rose-300 transition-all duration-300 cursor-pointer flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 group-hover:scale-105 transition-transform">
                <Swords className="w-6 h-6" />
              </div>
              <span className="text-xs font-extrabold bg-rose-100 text-rose-900 px-3 py-1 rounded-full">
                {SAMPLE_COMPETITORS.length} Competitors
              </span>
            </div>

            <div>
              <h3 className="text-base font-extrabold text-slate-900 group-hover:text-rose-600 transition-colors flex items-center gap-1.5">
                <span>Competitors</span>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-rose-600 transition-colors" />
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Head-to-head battlecards highlighting brand names, competing products, main clinical strengths, and core weaknesses.
              </p>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-rose-700">
            <span>Compare Market Competitors</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};
