import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import { CLINICAL_STUDIES, COMPETITOR_COMPARISONS, OBJECTION_BATTLECARDS } from '../../data/mockData';
import { BookOpen, Search, Sparkles, ShieldCheck, FileText, ExternalLink, HelpCircle, ArrowRight, Volume2, MessageSquare, Plus, Edit, Trash2, X } from 'lucide-react';

export const KnowledgeView: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useApp();

  const [activeTab, setActiveTab] = useState<'products' | 'studies' | 'competitors' | 'objections' | 'faqs' | 'coach'>('products');
  const [aiSearchQuery, setAiSearchQuery] = useState<string>('');
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [isSearchingAi, setIsSearchingAi] = useState<boolean>(false);

  // Product CRUD Modals
  const [isAddingProduct, setIsAddingProduct] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const [newProduct, setNewProduct] = useState({
    name: '',
    genericName: '',
    brand: 'RepOS Pharma',
    category: 'Cardiovascular',
    indication: '',
    dosage: '',
    description: '',
    keyDetailPoints: 'Proven efficacy, Convenient once-daily dosing',
    clinicalStudyRef: 'REPOS-3 Trial (2025)'
  });

  // AI Coach state
  const [coachDoctorSpecialty, setCoachDoctorSpecialty] = useState<string>('Cardiology');
  const [coachObjection, setCoachObjection] = useState<string>('Requests long-term renal safety data before switching patients from ACE inhibitors');
  const [coachingResult, setCoachingResult] = useState<any | null>(null);
  const [isLoadingCoach, setIsLoadingCoach] = useState<boolean>(false);

  const handleAiSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!aiSearchQuery.trim()) return;

    setIsSearchingAi(true);
    try {
      const res = await fetch('/api/ai/knowledge-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: aiSearchQuery })
      });
      const data = await res.json();
      if (data.answer) {
        setAiAnswer(data.answer);
      }
    } catch (err) {
      console.error('Failed AI knowledge search:', err);
    } finally {
      setIsSearchingAi(false);
    }
  };

  const handleGetAiCoach = async () => {
    setIsLoadingCoach(true);
    try {
      const res = await fetch('/api/ai/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doctorSpecialty: coachDoctorSpecialty, objection: coachObjection })
      });
      const data = await res.json();
      if (data.coaching) {
        setCoachingResult(data.coaching);
      }
    } catch (err) {
      console.error('Failed AI Coach request:', err);
    } finally {
      setIsLoadingCoach(false);
    }
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name.trim()) return;

    addProduct({
      name: newProduct.name.trim(),
      genericName: newProduct.genericName.trim() || newProduct.name.trim(),
      brand: newProduct.brand || 'RepOS Pharma',
      category: newProduct.category,
      indication: newProduct.indication || 'Indicated for therapeutic management',
      dosage: newProduct.dosage || '1 tablet daily',
      description: newProduct.description || 'Modern therapeutic agent with demonstrated efficacy.',
      keyDetailPoints: newProduct.keyDetailPoints.split(',').map(s => s.trim()).filter(Boolean),
      clinicalStudyRef: newProduct.clinicalStudyRef || 'Clinical Data On File'
    });

    setIsAddingProduct(false);
    setNewProduct({
      name: '',
      genericName: '',
      brand: 'RepOS Pharma',
      category: 'Cardiovascular',
      indication: '',
      dosage: '',
      description: '',
      keyDetailPoints: 'Proven efficacy, Convenient once-daily dosing',
      clinicalStudyRef: 'REPOS-3 Trial (2025)'
    });
  };

  const handleSaveEditedProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    updateProduct(editingProduct);
    setEditingProduct(null);
  };

  const handleDeleteProductConfirmed = () => {
    if (!productToDelete) return;
    deleteProduct(productToDelete.id);
    setProductToDelete(null);
  };

  return (
    <div className="space-y-4 pb-20 pt-2 px-3 sm:px-4 max-w-5xl mx-auto text-left">
      {/* Top Banner & AI Search Bar */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 text-white rounded-3xl p-5 shadow-xl border border-indigo-800/40 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-400" /> Medical & Product Library
            </h1>
            <p className="text-xs text-indigo-200 mt-0.5">
              Clinical evidence, competitor battlecards, and AI knowledge search.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-300 animate-spin-slow" /> RepOS AI Verified
          </span>
        </div>

        {/* Ask AI Library Widget */}
        <form onSubmit={handleAiSearch} className="relative">
          <input
            type="text"
            placeholder="Ask RepOS AI anything (e.g., 'What is the eGFR preservation rate in REPOS-3 trial?')..."
            value={aiSearchQuery}
            onChange={(e) => setAiSearchQuery(e.target.value)}
            className="w-full bg-slate-900/90 text-white placeholder-indigo-300 text-xs rounded-2xl pl-4 pr-24 py-3 border border-indigo-500/40 focus:outline-none focus:border-indigo-400"
          />
          <button
            type="submit"
            disabled={isSearchingAi}
            className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center gap-1 transition-colors"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isSearchingAi ? 'animate-spin' : ''}`} />
            <span>Search</span>
          </button>
        </form>

        {/* AI Answer Box */}
        {aiAnswer && (
          <div className="p-4 rounded-2xl bg-indigo-900/80 border border-indigo-500/50 text-xs text-indigo-100 space-y-2 animate-fade-in">
            <div className="flex items-center justify-between font-bold text-amber-300">
              <span className="flex items-center gap-1.5"><Sparkles className="w-4 h-4" /> AI Knowledge Synthesis</span>
              <button onClick={() => setAiAnswer(null)} className="text-[10px] text-indigo-300 hover:text-white">Dismiss</button>
            </div>
            <p className="leading-relaxed">{aiAnswer}</p>
          </div>
        )}
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="bg-white rounded-2xl p-2 border border-slate-200/80 shadow-sm flex items-center gap-2 overflow-x-auto text-xs font-bold">
        {[
          { id: 'products', label: 'Products' },
          { id: 'studies', label: 'Clinical Studies' },
          { id: 'competitors', label: 'Competitors' },
          { id: 'faqs', label: 'Medical FAQs' },
          { id: 'objections', label: 'Objection Playbook' },
          { id: 'coach', label: 'AI Coach Practice' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === t.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content Panels */}
      {activeTab === 'products' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between bg-white rounded-2xl p-3 border border-slate-200/80 shadow-sm">
            <div>
              <h2 className="text-sm font-black text-slate-900">Portfolio Products ({products.length})</h2>
              <p className="text-[11px] text-slate-500">Manage detail messages, dosage, and product positioning</p>
            </div>
            <button
              onClick={() => setIsAddingProduct(true)}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs flex items-center gap-1 shadow-sm transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Product</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map(p => (
              <div key={p.id} className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-3 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-black text-slate-900">{p.name}</h3>
                      <p className="text-xs text-blue-700 font-semibold">{p.genericName}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                        {p.category}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{p.description}</p>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                    <span className="font-bold text-slate-800 block text-[10px] uppercase">Dosage & Administration</span>
                    <p className="text-slate-700">{p.dosage}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-800 block">Key Detail Takeaways</span>
                    <ul className="space-y-1 text-xs text-slate-600">
                      {p.keyDetailPoints.map((pt, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-blue-600 font-bold">•</span>
                          {pt}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-400 font-semibold">{p.clinicalStudyRef || 'Clinical Trial On File'}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingProduct(p)}
                      className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                      title="Edit Product"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setProductToDelete(p)}
                      className="p-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'studies' && (
        <div className="space-y-3">
          {CLINICAL_STUDIES.map(s => (
            <div key={s.id} className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-blue-600 uppercase bg-blue-50 px-2 py-0.5 rounded">
                    {s.journal} ({s.year})
                  </span>
                  <h3 className="text-sm font-black text-slate-900 mt-1">{s.title}</h3>
                </div>
                <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
                  {s.productName}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{s.summary}</p>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-900 font-medium">
                <strong>Key Finding:</strong> {s.keyFinding} ({s.pVal}, N={s.sampleSize})
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'competitors' && (
        <div className="space-y-3">
          {COMPETITOR_COMPARISONS.map(c => (
            <div key={c.id} className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-black text-blue-700">{c.ourProduct} (Our Product)</span>
                <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                  vs {c.competitorName} ({c.competitorCompany})
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200">
                  <span className="font-bold text-emerald-900 block mb-1 uppercase text-[10px]">Our Differentiating Advantage</span>
                  <p className="text-emerald-950">{c.ourAdvantage}</p>
                </div>

                <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200">
                  <span className="font-bold text-amber-900 block mb-1 uppercase text-[10px]">Recommended Pivot Response</span>
                  <p className="text-amber-950">{c.objectionResponse}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'faqs' && (
        <div className="space-y-3">
          {[
            {
              q: "Can Cardiovasc XL be co-administered with SGLT2 inhibitors?",
              a: "Yes, sub-group analysis from the REPOS-3 trial demonstrated complementary renal and glycemic safety profiles when co-prescribed with SGLT2 inhibitors."
            },
            {
              q: "What is the recommended titration protocol for Neuropatch 24hr?",
              a: "Initiate at 5mg/24hr patch daily for 2 weeks, then titrate to 10mg/24hr based on patient tolerance and symptom severity."
            },
            {
              q: "How should sample storage temperature compliance be logged?",
              a: "RepOS automatically tracks sample storage requirements. Ensure ambient sample storage remains between 15°C and 25°C in rep vehicle carriers."
            },
            {
              q: "What clinical trial data supports GlucoFlow Duo in insulin-resistant patients?",
              a: "The MET-DUO trial published in Lancet Diabetes 2025 demonstrated a 1.8% mean HbA1c reduction with 42% lower gastrointestinal discontinuation vs standard metformin."
            }
          ].map((faq, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-2">
              <h3 className="text-xs font-black text-blue-900 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-blue-600 shrink-0" /> {faq.q}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed pl-5.5 border-l-2 border-blue-200">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'objections' && (
        <div className="space-y-3">
          {OBJECTION_BATTLECARDS.map(b => (
            <div key={b.id} className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                  {b.category}
                </span>
                <span className="text-[10px] font-bold text-slate-400">Ref: {b.supportingTrial}</span>
              </div>

              <h3 className="text-xs font-bold text-slate-900">"{b.objection}"</h3>

              <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-200 text-xs text-blue-950">
                <strong>Suggested Script Response:</strong>
                <p className="mt-1 italic">{b.recommendedResponse}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'coach' && (
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-600" /> AI Coach Roleplay Generator
            </h3>
            <p className="text-xs text-slate-500">
              Simulate visit scenarios and get instant tactical objection responses.
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Physician Specialty</label>
              <select
                value={coachDoctorSpecialty}
                onChange={(e) => setCoachDoctorSpecialty(e.target.value)}
                className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:outline-none"
              >
                {['Cardiology', 'Endocrinology', 'Neurology', 'Pulmonology', 'General Practice'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Objection / Scenario Prompt</label>
              <textarea
                rows={3}
                value={coachObjection}
                onChange={(e) => setCoachObjection(e.target.value)}
                className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:outline-none"
              />
            </div>

            <button
              onClick={handleGetAiCoach}
              disabled={isLoadingCoach}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles className={`w-4 h-4 ${isLoadingCoach ? 'animate-spin' : ''}`} />
              <span>{isLoadingCoach ? 'Generating Tactical Coaching...' : 'Generate AI Coach Response'}</span>
            </button>

            {coachingResult && (
              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-purple-950 space-y-3 animate-fade-in mt-4">
                <div>
                  <span className="font-extrabold text-purple-900 block text-[10px] uppercase">Tactical Strategy</span>
                  <p className="mt-0.5">{coachingResult.tacticalAdvice}</p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-purple-200">
                  <span className="font-bold text-purple-900 block text-[10px] uppercase">Recommended Opening Line</span>
                  <p className="italic text-slate-800 mt-1">{coachingResult.recommendedOpeningLine}</p>
                </div>

                <div>
                  <span className="font-extrabold text-purple-900 block text-[10px] uppercase">Call To Action</span>
                  <p className="mt-0.5">{coachingResult.closingCallToAction}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Add Product Modal */}
      {isAddingProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 space-y-4 shadow-2xl border border-slate-200 text-left my-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">Add New Pharmaceutical Product</h3>
                <p className="text-xs text-slate-500">Register a new product in your medical library</p>
              </div>
              <button
                onClick={() => setIsAddingProduct(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Brand Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cardiovasc XL"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Generic Name / Molecule</label>
                  <input
                    type="text"
                    placeholder="e.g. Telmisartan Extended Release"
                    value={newProduct.genericName}
                    onChange={(e) => setNewProduct({ ...newProduct, genericName: e.target.value })}
                    className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Therapeutic Area</label>
                  <input
                    type="text"
                    placeholder="e.g. Cardiology"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Dosage & Regimen</label>
                  <input
                    type="text"
                    placeholder="e.g. 80mg once daily with food"
                    value={newProduct.dosage}
                    onChange={(e) => setNewProduct({ ...newProduct, dosage: e.target.value })}
                    className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description / Clinical Overview</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Long-acting ARB for hypertension and cardiovascular risk reduction"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Key Detail Talking Points (comma separated)</label>
                <input
                  type="text"
                  placeholder="24-hour BP control, 34% reduction in stroke, Excellent renal safety"
                  value={newProduct.keyDetailPoints}
                  onChange={(e) => setNewProduct({ ...newProduct, keyDetailPoints: e.target.value })}
                  className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddingProduct(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white font-extrabold rounded-xl shadow-md"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 space-y-4 shadow-2xl border border-slate-200 text-left my-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">Edit Product - {editingProduct.name}</h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedProduct} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Brand Name</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Generic / Active Molecule</label>
                <input
                  type="text"
                  value={editingProduct.genericName}
                  onChange={(e) => setEditingProduct({ ...editingProduct, genericName: e.target.value })}
                  className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Dosage & Administration</label>
                <input
                  type="text"
                  value={editingProduct.dosage}
                  onChange={(e) => setEditingProduct({ ...editingProduct, dosage: e.target.value })}
                  className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Overview & Description</label>
                <textarea
                  rows={2}
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white font-extrabold rounded-xl shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Product Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 text-left shadow-2xl border border-slate-200">
            <div className="flex items-center gap-3 text-red-600">
              <div className="p-3 bg-red-100 rounded-2xl">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Delete Product Record?</h3>
                <p className="text-xs text-slate-500">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              Are you sure you want to delete <strong className="text-slate-900">{productToDelete.name}</strong> from your medical library?
            </p>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 text-xs">
              <button
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProductConfirmed}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold shadow-md"
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
