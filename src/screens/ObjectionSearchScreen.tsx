import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { 
  HelpCircle, 
  Search, 
  Filter, 
  ShieldAlert, 
  BookOpen, 
  MessageSquare, 
  CheckCircle2, 
  Sparkles, 
  Tag, 
  ArrowLeft,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

interface ObjectionItem {
  id: string;
  category: 'Side Effects' | 'Cost & Insurance' | 'Efficacy' | 'Dosing & Habit' | 'Formulary Status';
  objection: string;
  recommendedResponse: string;
  supportingTrial: string;
  products: string[];
}

const OBJECTION_DATABASE: ObjectionItem[] = [
  {
    id: 'obj-1',
    category: 'Side Effects',
    objection: 'Gastrointestinal tolerance and side effect risk in elderly patients',
    recommendedResponse: 'In the REPOS-3 subgroup analysis of patients aged 65+, GI discontinuation rates were less than 1.8% when administered with morning meals. Dosing can remain at 20mg daily without dosage step-down.',
    supportingTrial: 'REPOS-3 Elderly Subgroup Cohort (n=680, 2025)',
    products: ['Cardiovasc XL', 'GlycaNorm Dual']
  },
  {
    id: 'obj-2',
    category: 'Cost & Insurance',
    objection: 'Is Cardiovasc XL cost-justified over generic ACE/ARB monotherapies?',
    recommendedResponse: 'Highlight health-economic evaluation demonstrating a 28% reduction in 12-month cardiovascular hospitalization rates, resulting in net $4,200 annual savings per high-risk patient.',
    supportingTrial: 'Health Economics & Outcomes Research (HEOR) 2025',
    products: ['Cardiovasc XL']
  },
  {
    id: 'obj-3',
    category: 'Efficacy',
    objection: 'Does GlycaNorm Dual offer meaningful HbA1c reduction for refractory patients?',
    recommendedResponse: 'Clinical trials demonstrate an additional 1.4% HbA1c reduction in patients who previously failed dual Oral Antidiabetic Drugs (OADs), with sustained beta-cell function preservation.',
    supportingTrial: 'GlycaNorm Phase III Trial (Journal of Endocrinology 2025)',
    products: ['GlycaNorm Dual']
  },
  {
    id: 'obj-4',
    category: 'Formulary Status',
    objection: 'Current Tier 3 hospital formulary status requires prior authorization',
    recommendedResponse: 'Provide pre-populated Prior Authorization (PA) starter kits and patient co-pay assistance cards covering up to $150/month out-of-pocket costs.',
    supportingTrial: 'Hospital Access & Coverage Guide 2026',
    products: ['NeuroCalm ER', 'Cardiovasc XL']
  },
  {
    id: 'obj-5',
    category: 'Dosing & Habit',
    objection: 'Physicians hesitant to change established prescribing routines',
    recommendedResponse: 'Emphasize once-daily bio-equivalent dosing requiring zero complex titration steps compared to multi-pill regimens.',
    supportingTrial: 'Adherence & Bioavailability Study 2024',
    products: ['NeuroCalm ER']
  }
];

export const ObjectionSearchScreen: React.FC = () => {
  const { setActiveTab } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Side Effects', 'Cost & Insurance', 'Efficacy', 'Formulary Status'];

  const filteredObjections = OBJECTION_DATABASE.filter(item => {
    const matchesSearch = item.objection.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.recommendedResponse.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.products.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-amber-600" />
            <span>Physician Objection Search</span>
          </h1>
          <p className="text-xs text-slate-500">
            Evidence-based clinical responses & trial battlecards for common doctor concerns
          </p>
        </div>

        <button 
          onClick={() => setActiveTab('home')} 
          className="text-xs font-semibold text-blue-600 hover:underline self-start sm:self-auto"
        >
          ← Back to Home
        </button>
      </div>

      {/* Search Input & Category Filters */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search objections (e.g. GI side effects, cost, generic ARB)..."
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white text-slate-800"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 items-center text-xs">
          <span className="font-semibold text-slate-500 text-[11px] flex items-center gap-1">
            <Filter className="w-3 h-3" /> Category:
          </span>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Objection Battlecards Roster */}
      <div className="space-y-4">
        {filteredObjections.map(item => (
          <motion.div
            key={item.id}
            whileHover={{ y: -1 }}
            className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-amber-300 transition-all space-y-3"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-md border border-amber-200">
                {item.category}
              </span>

              <div className="flex items-center gap-1.5">
                {item.products.map((prod, idx) => (
                  <span key={idx} className="text-[10px] bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded-md border border-blue-100">
                    {prod}
                  </span>
                ))}
              </div>
            </div>

            {/* Doctor Objection Statement */}
            <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200/80 text-xs font-bold text-amber-950 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-amber-700 font-semibold block text-[10px] uppercase">Physician Objection</span>
                <p className="text-xs text-amber-950 font-bold mt-0.5">"{item.objection}"</p>
              </div>
            </div>

            {/* Evidence Response */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 text-xs space-y-1">
              <span className="font-bold text-blue-700 flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5" /> Recommended Clinical Response
              </span>
              <p className="text-slate-700 leading-relaxed pt-0.5">
                {item.recommendedResponse}
              </p>
            </div>

            {/* Supporting Clinical Reference */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                <strong className="font-semibold text-slate-700">Trial Evidence:</strong> {item.supportingTrial}
              </span>

              <button 
                onClick={() => setActiveTab('knowledge')}
                className="text-blue-600 font-semibold hover:underline flex items-center gap-1"
              >
                <span>Read Trial</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        ))}

        {filteredObjections.length === 0 && (
          <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-2">
            <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700">No matching objections found</h3>
            <p className="text-xs text-slate-400">Try searching for other terms like 'cost', 'side effects', or 'dosing'.</p>
          </div>
        )}
      </div>
    </div>
  );
};
