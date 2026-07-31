import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Search, 
  CheckCircle2, 
  Filter, 
  BookOpen, 
  Tag,
  Sparkles
} from 'lucide-react';
import { SAMPLE_OBJECTIONS, KBObjectionCategory } from '../../data/knowledgeData';

export const ObjectionsSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories: ('All' | KBObjectionCategory)[] = [
    'All',
    'Cost',
    'Safety',
    'Efficacy',
    'Competitor',
    'Guidelines',
    'Compliance'
  ];

  const filteredObjections = SAMPLE_OBJECTIONS.filter((obj) => {
    const matchesSearch =
      obj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      obj.shortScientificAnswer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      obj.relatedProduct.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || obj.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: KBObjectionCategory) => {
    switch (category) {
      case 'Cost':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Safety':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'Efficacy':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Competitor':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Guidelines':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Compliance':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Local Search */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Objection Library & Scientific Answers</h2>
            <p className="text-xs text-slate-500">
              Searchable clinical answers for doctor objections across Cost, Safety, Efficacy, and Competitors.
            </p>
          </div>
          <span className="text-xs font-extrabold bg-amber-50 text-amber-800 px-3 py-1 rounded-full border border-amber-200 self-start sm:self-auto">
            {filteredObjections.length} Searchable Objections
          </span>
        </div>

        {/* Local Objection Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search objection, keyword, or product name..."
            className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:bg-white text-slate-800"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-1.5 items-center">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Category:</span>
          </span>

          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Objections Grid */}
      <div className="space-y-3">
        {filteredObjections.length > 0 ? (
          filteredObjections.map((obj) => (
            <div
              key={obj.id}
              className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 shrink-0 mt-0.5">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 leading-snug">
                      {obj.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[11px] font-extrabold bg-blue-50 text-blue-800 px-2.5 py-0.5 rounded-md border border-blue-100">
                        {obj.relatedProduct}
                      </span>
                      <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-md border ${getCategoryColor(obj.category)}`}>
                        {obj.category}
                      </span>
                    </div>
                  </div>
                </div>

                <span className="text-[11px] font-extrabold bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1 self-start shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{obj.status}</span>
                </span>
              </div>

              {/* Short Scientific Answer */}
              <div className="pl-4 border-l-2 border-blue-300 bg-slate-50/70 p-3.5 rounded-2xl">
                <span className="text-[10px] font-extrabold text-blue-700 uppercase tracking-wider block mb-1">
                  Short Scientific Answer & Strategy
                </span>
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                  {obj.shortScientificAnswer}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-3xl p-8 border border-slate-200/90 text-center space-y-2">
            <p className="text-sm font-bold text-slate-700">No objections found matching your search</p>
            <p className="text-xs text-slate-400">Try selecting "All" categories or adjusting your search keywords.</p>
          </div>
        )}
      </div>
    </div>
  );
};
