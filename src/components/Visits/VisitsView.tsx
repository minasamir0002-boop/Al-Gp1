import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Visit } from '../../types';
import { Calendar, Search, Filter, Edit2, BarChart2, CheckCircle2, Clock, MapPin, Sparkles, ChevronRight, Trash2, Plus } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';

export const VisitsView: React.FC = () => {
  const { visits, doctors, updateVisit, deleteVisit, setActiveTab } = useApp();

  const [viewMode, setViewMode] = useState<'timeline' | 'analytics'>('timeline');
  const [filterDoctor, setFilterDoctor] = useState<string>('All');
  const [filterSpecialty, setFilterSpecialty] = useState<string>('All');
  const [filterProduct, setFilterProduct] = useState<string>('All');
  const [filterTerritory, setFilterTerritory] = useState<string>('All');
  const [filterDate, setFilterDate] = useState<string>('All');
  
  const [editingVisit, setEditingVisit] = useState<Visit | null>(null);
  const [editedNotes, setEditedNotes] = useState<string>('');
  const [editedFollowUp, setEditedFollowUp] = useState<string>('');
  const [visitToDelete, setVisitToDelete] = useState<Visit | null>(null);

  const filteredVisits = visits.filter(v => {
    const matchDoc = filterDoctor === 'All' || v.doctorId === filterDoctor;
    const matchSpec = filterSpecialty === 'All' || v.doctorSpecialty === filterSpecialty;
    const matchProd = filterProduct === 'All' || v.productsDiscussed.some(p => p.productName === filterProduct);

    // Find doctor for territory
    const docObj = doctors.find(d => d.id === v.doctorId);
    const matchTerritory = filterTerritory === 'All' || (docObj && docObj.territory === filterTerritory);

    let matchDate = true;
    if (filterDate === '2026-07-28') matchDate = v.date === '2026-07-28';

    return matchDoc && matchSpec && matchProd && matchTerritory && matchDate;
  });

  // Analytics Chart Data
  const visitsBySpecialty = [
    { name: 'Cardiology', visits: visits.filter(v => v.doctorSpecialty === 'Cardiology').length },
    { name: 'Endocrinology', visits: visits.filter(v => v.doctorSpecialty === 'Endocrinology').length },
    { name: 'Neurology', visits: visits.filter(v => v.doctorSpecialty === 'Neurology').length },
    { name: 'Pulmonology', visits: visits.filter(v => v.doctorSpecialty === 'Pulmonology').length },
    { name: 'General Practice', visits: visits.filter(v => v.doctorSpecialty === 'General Practice').length }
  ];

  const objectionCategories = [
    { name: 'Renal Safety', count: 4, color: '#2563eb' },
    { name: 'Co-Pay / Price', count: 3, color: '#a855f7' },
    { name: 'Side Effects', count: 2, color: '#f59e0b' },
    { name: 'Formulary Tier', count: 2, color: '#ef4444' }
  ];

  const handleOpenEdit = (v: Visit) => {
    setEditingVisit(v);
    setEditedNotes(v.notes);
    setEditedFollowUp(v.followUpTask || '');
  };

  const handleSaveEdit = () => {
    if (!editingVisit) return;
    updateVisit({
      ...editingVisit,
      notes: editedNotes,
      followUpTask: editedFollowUp
    });
    setEditingVisit(null);
  };

  const handleDeleteVisitConfirmed = () => {
    if (!visitToDelete) return;
    deleteVisit(visitToDelete.id);
    setVisitToDelete(null);
  };

  return (
    <div className="space-y-4 pb-20 pt-2 px-3 sm:px-4 max-w-5xl mx-auto text-left">
      {/* Top Banner & Mode Toggle */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Visit Activity Logs</h1>
          <p className="text-xs text-slate-500">
            {filteredVisits.length} recorded interactions in Central District territory
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('record-visit')}
            className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold flex items-center gap-1 shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record Visit</span>
          </button>

          <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'timeline' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Timeline View
            </button>
            <button
              onClick={() => setViewMode('analytics')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                viewMode === 'analytics' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" /> Analytics
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'timeline' ? (
        <>
          {/* Filters Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Physician</label>
              <select
                value={filterDoctor}
                onChange={(e) => setFilterDoctor(e.target.value)}
                className="w-full bg-white text-slate-800 text-xs rounded-xl p-2.5 border border-slate-200 focus:outline-none"
              >
                <option value="All">All Physicians</option>
                {doctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Product</label>
              <select
                value={filterProduct}
                onChange={(e) => setFilterProduct(e.target.value)}
                className="w-full bg-white text-slate-800 text-xs rounded-xl p-2.5 border border-slate-200 focus:outline-none"
              >
                <option value="All">All Products</option>
                <option value="Cardiovasc XL">Cardiovasc XL</option>
                <option value="Neuropatch 24hr">Neuropatch 24hr</option>
                <option value="GlucoFlow Duo">GlucoFlow Duo</option>
                <option value="PulmoAir Inhaler">PulmoAir Inhaler</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Territory</label>
              <select
                value={filterTerritory}
                onChange={(e) => setFilterTerritory(e.target.value)}
                className="w-full bg-white text-slate-800 text-xs rounded-xl p-2.5 border border-slate-200 focus:outline-none"
              >
                <option value="All">All Territories</option>
                <option value="Central District">Central District</option>
                <option value="North Sector">North Sector</option>
                <option value="South Bay">South Bay</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Date</label>
              <select
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-full bg-white text-slate-800 text-xs rounded-xl p-2.5 border border-slate-200 focus:outline-none"
              >
                <option value="All">All Dates</option>
                <option value="2026-07-28">Today (July 28)</option>
              </select>
            </div>
          </div>

          {/* Visits Timeline List */}
          <div className="space-y-3">
            {filteredVisits.map((v) => (
              <div
                key={v.id}
                className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm hover:border-blue-300 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 font-black text-xs flex items-center justify-center">
                      Rx
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900">{v.doctorName}</h3>
                      <p className="text-[11px] text-slate-500">{v.doctorSpecialty} • {v.doctorHospital}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-500 font-medium flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {v.date} ({v.time})
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      {v.status}
                    </span>
                    <button
                      onClick={() => handleOpenEdit(v)}
                      className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                      title="Edit visit notes"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setVisitToDelete(v)}
                      className="p-1 rounded text-red-400 hover:text-red-700 hover:bg-red-50"
                      title="Delete visit record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* AI Summary Banner */}
                {v.aiSummary && (
                  <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 text-indigo-950 text-xs">
                    <span className="font-bold text-indigo-900 block mb-0.5 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> AI Executive Summary
                    </span>
                    <p>{v.aiSummary}</p>
                  </div>
                )}

                <div className="text-xs text-slate-700 leading-relaxed">
                  <strong>Notes:</strong> {v.notes}
                </div>

                {/* Details Breakdown Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] pt-1">
                  {/* Products */}
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="font-bold text-slate-500 block mb-1">Products Discussed</span>
                    <div className="flex flex-wrap gap-1">
                      {v.productsDiscussed.map((pd, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-purple-50 text-purple-800 font-semibold">
                          {pd.productName} ({pd.reaction})
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Samples */}
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="font-bold text-slate-500 block mb-1">Samples Provided</span>
                    {v.samplesGiven.length > 0 ? (
                      v.samplesGiven.map((sg, i) => (
                        <span key={i} className="block text-slate-800 font-medium">
                          • {sg.quantity}x {sg.productName}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400">None</span>
                    )}
                  </div>

                  {/* Follow-up */}
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="font-bold text-slate-500 block mb-1">Follow-up Task ({v.nextFollowUpDate})</span>
                    <span className="text-slate-800 font-medium">{v.followUpTask}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* Visit Analytics View */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Visits by Specialty Chart */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-2">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Visit Distribution by Specialty
              </h3>
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={visitsBySpecialty}>
                    <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                    <YAxis stroke="#64748b" fontSize={10} />
                    <Tooltip />
                    <Bar dataKey="visits" fill="#2563eb" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Objections Breakdown */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-2">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Top Physician Objection Topics
              </h3>
              <div className="h-60 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={objectionCategories} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                      {objectionCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Visit Notes & Follow-Up Modal */}
      {editingVisit && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 space-y-4 shadow-2xl text-left">
            <h3 className="text-base font-black text-slate-900">Edit Visit Details - {editingVisit.doctorName}</h3>
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Discussion & Interaction Notes</label>
              <textarea
                rows={4}
                value={editedNotes}
                onChange={(e) => setEditedNotes(e.target.value)}
                className="w-full bg-slate-50 text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Follow-Up Action Item</label>
              <input
                type="text"
                value={editedFollowUp}
                onChange={(e) => setEditedFollowUp(e.target.value)}
                className="w-full bg-slate-50 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setEditingVisit(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-blue-600 text-white text-xs font-extrabold rounded-xl shadow-md hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Visit Confirmation Modal */}
      {visitToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 text-left shadow-2xl border border-slate-200">
            <div className="flex items-center gap-3 text-red-600">
              <div className="p-3 bg-red-100 rounded-2xl">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Delete Visit Log?</h3>
                <p className="text-xs text-slate-500">This record will be permanently deleted.</p>
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              Are you sure you want to delete the visit record with <strong className="text-slate-900">{visitToDelete.doctorName}</strong> on {visitToDelete.date}?
            </p>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 text-xs">
              <button
                onClick={() => setVisitToDelete(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteVisitConfirmed}
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
