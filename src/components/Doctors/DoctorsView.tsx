import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Doctor, Specialty, DoctorClass, Territory } from '../../types';
import { Search, Filter, Phone, Mail, MapPin, Calendar, Clock, Plus, ChevronRight, X, AlertCircle, FileText, Package, MessageSquare, CheckCircle, Sparkles, Edit, Save, Award, BarChart2, Zap, Trash2, FileCheck } from 'lucide-react';
import { calculateNextBestDoctor } from '../../lib/aiSmartEngine';
import { PreVisitCoachModal } from '../AI/PreVisitCoachModal';
import { MeetingPrepModal } from '../AI/MeetingPrepModal';
import { DoctorProfile2Modal } from './DoctorProfile2Modal';

export const DoctorsView: React.FC = () => {
  const { doctors, visits, searchQuery, setSearchQuery, quickNavigateToRecordVisitWithDoctor, addDoctor, updateDoctor, deleteDoctor, repProfile } = useApp();

  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');
  const [selectedClass, setSelectedClass] = useState<string>('All');
  const [selectedTerritory, setSelectedTerritory] = useState<string>('All');
  const [activeDoctorModal, setActiveDoctorModal] = useState<Doctor | null>(null);

  // AI Pre-Visit Coach modal state
  const [coachDoctor, setCoachDoctor] = useState<Doctor | null>(null);
  const [prepDoctorModal, setPrepDoctorModal] = useState<Doctor | null>(null);

  // Edit Doctor Modal State
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);

  // Add Doctor Modal State
  const [isAddingDoctor, setIsAddingDoctor] = useState<boolean>(false);
  const [newDoctorData, setNewDoctorData] = useState<{
    name: string;
    title: string;
    specialty: Specialty;
    doctorClass: DoctorClass;
    territory: Territory;
    hospital: string;
    clinicAddress: string;
    phone: string;
    email: string;
    prescribingVolume: 'High' | 'Medium' | 'Low';
    preferredVisitTime: string;
    targetVisitsPerMonth: number;
    coverageStatus: 'Covered' | 'Targeted' | 'Unassigned' | 'Overdue';
    promotedProducts: string;
    activeObjections: string;
    personalNotes: string;
  }>({
    name: '',
    title: 'Consultant Specialist',
    specialty: 'Cardiology',
    doctorClass: 'Class A',
    territory: repProfile.territory || 'Central District',
    hospital: '',
    clinicAddress: '',
    phone: '',
    email: '',
    prescribingVolume: 'High',
    preferredVisitTime: '10:00 AM - 12:00 PM',
    targetVisitsPerMonth: 3,
    coverageStatus: 'Targeted',
    promotedProducts: 'Cardiovasc XL, GlycaNorm Dual',
    activeObjections: '',
    personalNotes: ''
  });

  // Delete confirmation
  const [doctorToDelete, setDoctorToDelete] = useState<Doctor | null>(null);

  // New Note State inside Modal
  const [newNote, setNewNote] = useState<string>('');
  const [activeModalTab, setActiveModalTab] = useState<'overview' | 'history' | 'objections' | 'products'>('overview');

  const specialtiesList = ['All', 'Cardiology', 'Endocrinology', 'Neurology', 'Pulmonology', 'Gastroenterology', 'General Practice'];
  const classList = ['All', 'Class A', 'Class B', 'Class C'];
  const territoryList = ['All', 'Central District', 'North Sector', 'South Bay', 'Metro West'];

  const filteredDoctors = useMemo(() => {
    return doctors.filter(doc => {
      const matchesSearch =
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.hospital.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.specialty.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSpecialty = selectedSpecialty === 'All' || doc.specialty === selectedSpecialty;
      const matchesClass = selectedClass === 'All' || doc.doctorClass === selectedClass;
      const matchesTerritory = selectedTerritory === 'All' || doc.territory === selectedTerritory;

      return matchesSearch && matchesSpecialty && matchesClass && matchesTerritory;
    });
  }, [doctors, searchQuery, selectedSpecialty, selectedClass, selectedTerritory]);

  const handleAddNoteToDoctor = () => {
    if (!activeDoctorModal || !newNote.trim()) return;
    const updatedNotes = activeDoctorModal.personalNotes
      ? `${activeDoctorModal.personalNotes}\n[${new Date().toLocaleDateString()}] ${newNote.trim()}`
      : `[${new Date().toLocaleDateString()}] ${newNote.trim()}`;

    const updated = { ...activeDoctorModal, personalNotes: updatedNotes };
    updateDoctor(updated);
    setActiveDoctorModal(updated);
    setNewNote('');
  };

  const handleSaveEditedDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDoctor) return;
    updateDoctor(editingDoctor);
    if (activeDoctorModal?.id === editingDoctor.id) {
      setActiveDoctorModal(editingDoctor);
    }
    setEditingDoctor(null);
  };

  const handleCreateNewDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoctorData.name.trim()) return;

    const created = addDoctor({
      name: newDoctorData.name.trim(),
      title: newDoctorData.title.trim(),
      specialty: newDoctorData.specialty,
      doctorClass: newDoctorData.doctorClass,
      territory: newDoctorData.territory,
      hospital: newDoctorData.hospital.trim() || 'General Medical Center',
      clinicAddress: newDoctorData.clinicAddress.trim() || '100 Medical Parkway',
      phone: newDoctorData.phone.trim() || '+1 (555) 000-1122',
      email: newDoctorData.email.trim() || `${newDoctorData.name.toLowerCase().replace(/[^a-z]/g, '')}@clinic.com`,
      avatar: `https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=250`,
      prescribingVolume: newDoctorData.prescribingVolume,
      preferredVisitTime: newDoctorData.preferredVisitTime,
      lastVisitDate: 'Never',
      totalVisitsThisMonth: 0,
      targetVisitsPerMonth: newDoctorData.targetVisitsPerMonth || 3,
      coverageStatus: newDoctorData.coverageStatus,
      promotedProducts: newDoctorData.promotedProducts.split(',').map(s => s.trim()).filter(Boolean),
      activeObjections: newDoctorData.activeObjections ? newDoctorData.activeObjections.split(',').map(s => s.trim()).filter(Boolean) : [],
      personalNotes: newDoctorData.personalNotes,
      sentiment: 'Neutral',
      coordinate: { x: Math.floor(Math.random() * 70) + 15, y: Math.floor(Math.random() * 70) + 15 }
    });

    setIsAddingDoctor(false);
    setActiveDoctorModal(created);
    setNewDoctorData({
      name: '',
      title: 'Consultant Specialist',
      specialty: 'Cardiology',
      doctorClass: 'Class A',
      territory: repProfile.territory || 'Central District',
      hospital: '',
      clinicAddress: '',
      phone: '',
      email: '',
      prescribingVolume: 'High',
      preferredVisitTime: '10:00 AM - 12:00 PM',
      targetVisitsPerMonth: 3,
      coverageStatus: 'Targeted',
      promotedProducts: 'Cardiovasc XL, GlycaNorm Dual',
      activeObjections: '',
      personalNotes: ''
    });
  };

  const handleDeleteDoctorConfirmed = () => {
    if (!doctorToDelete) return;
    deleteDoctor(doctorToDelete.id);
    if (activeDoctorModal?.id === doctorToDelete.id) {
      setActiveDoctorModal(null);
    }
    setDoctorToDelete(null);
  };

  return (
    <div className="space-y-4 pb-20 pt-2 px-3 sm:px-4 max-w-5xl mx-auto text-left">
      {/* Top Header & Search */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Physician Directory</h1>
            <p className="text-xs text-slate-500">
              {filteredDoctors.length} of {doctors.length} doctors matching current criteria
            </p>
          </div>

          <button
            onClick={() => setIsAddingDoctor(true)}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors shrink-0 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Physician</span>
          </button>
        </div>

        {/* Search Bar Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by doctor name, hospital, or specialty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 text-xs rounded-xl pl-9 pr-4 py-2.5 border border-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 border-t border-slate-100">
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Specialty</label>
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="w-full bg-slate-50 text-slate-800 text-xs rounded-lg p-2 border border-slate-200 focus:outline-none"
            >
              {specialtiesList.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Doctor Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full bg-slate-50 text-slate-800 text-xs rounded-lg p-2 border border-slate-200 focus:outline-none"
            >
              {classList.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Territory</label>
            <select
              value={selectedTerritory}
              onChange={(e) => setSelectedTerritory(e.target.value)}
              className="w-full bg-slate-50 text-slate-800 text-xs rounded-lg p-2 border border-slate-200 focus:outline-none"
            >
              {territoryList.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Doctor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredDoctors.map((doc) => {
          const docVisits = visits.filter(v => v.doctorId === doc.id);
          const completionRate = Math.round((doc.totalVisitsThisMonth / doc.targetVisitsPerMonth) * 100);
          const kpiScore = doc.prescribingVolume === 'High' ? 95 : doc.prescribingVolume === 'Medium' ? 78 : 62;

          return (
            <div
              key={doc.id}
              onClick={() => setActiveDoctorModal(doc)}
              className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm hover:border-blue-400 hover:shadow-md transition-all cursor-pointer space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={doc.avatar}
                      alt={doc.name}
                      className="w-12 h-12 rounded-2xl object-cover border-2 border-blue-100 shadow-sm"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-black text-slate-900">{doc.name}</h3>
                        <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${
                          doc.doctorClass === 'Class A' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {doc.doctorClass}
                        </span>
                      </div>
                      <p className="text-xs text-blue-700 font-semibold">{doc.title}</p>
                      <p className="text-[11px] text-slate-500">{doc.hospital}</p>
                    </div>
                  </div>

                  {/* Doctor KPI Badge */}
                  <div className="text-right">
                    <span className="text-[9px] font-bold text-slate-400 uppercase block">KPI Score</span>
                    <span className="text-xs font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100 inline-block">
                      {kpiScore}/100
                    </span>
                  </div>
                </div>

                {/* Tags & Key Details */}
                <div className="mt-3 grid grid-cols-3 gap-2 text-[11px]">
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block text-[9px] uppercase font-bold">Specialty</span>
                    <span className="font-bold text-slate-800 truncate block">{doc.specialty}</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block text-[9px] uppercase font-bold">Target Exec.</span>
                    <span className="font-bold text-emerald-700">{completionRate}% ({doc.totalVisitsThisMonth}/{doc.targetVisitsPerMonth})</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block text-[9px] uppercase font-bold">Last Visited</span>
                    <span className="font-bold text-slate-800">{doc.lastVisitDate}</span>
                  </div>
                </div>

                {/* Active Objections Warning badge if any */}
                {doc.activeObjections.length > 0 && (
                  <div className="mt-2.5 bg-amber-50 border border-amber-200/80 p-2 rounded-xl text-[11px] text-amber-900 flex items-start gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Active Objection:</span> {doc.activeObjections[0]}
                    </div>
                  </div>
                )}
              </div>

              {/* Card Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  <button
                    onClick={() => setActiveDoctorModal(doc)}
                    className="px-2 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
                  >
                    View
                  </button>
                  <button
                    onClick={() => setPrepDoctorModal(doc)}
                    className="px-2 py-1.5 rounded-xl bg-indigo-100 hover:bg-indigo-200 text-indigo-900 text-xs font-extrabold flex items-center gap-1 border border-indigo-200 shrink-0"
                    title="Generate AI Meeting Preparation Dossier"
                  >
                    <Sparkles className="w-3 h-3 text-indigo-700 fill-indigo-700" />
                    <span>Prep</span>
                  </button>
                  <button
                    onClick={() => setCoachDoctor(doc)}
                    className="px-2 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-extrabold flex items-center gap-1 border border-amber-200 shrink-0"
                    title="Launch AI Pre-Visit Briefing & Objection Strategies"
                  >
                    <Zap className="w-3 h-3 text-amber-700 fill-amber-700" />
                    <span>Coach</span>
                  </button>
                  <button
                    onClick={() => setEditingDoctor(doc)}
                    className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
                    title="Edit Doctor Details"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDoctorToDelete(doc)}
                    className="p-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 transition-colors"
                    title="Delete Doctor"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => quickNavigateToRecordVisitWithDoctor(doc)}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Record Visit
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comprehensive Doctor Profile 2.0 Intelligence Center Modal */}
      <DoctorProfile2Modal
        doctor={activeDoctorModal}
        isOpen={!!activeDoctorModal}
        onClose={() => setActiveDoctorModal(null)}
        onEdit={(doc) => setEditingDoctor(doc)}
      />

      {/* Edit Doctor Modal Form */}
      {editingDoctor && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 space-y-4 shadow-2xl border border-slate-200 text-left my-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-1.5">
                <Edit className="w-4 h-4 text-blue-600" /> Edit Physician Details
              </h3>
              <button onClick={() => setEditingDoctor(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedDoctor} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Name & Title</label>
                <input
                  type="text"
                  value={editingDoctor.name}
                  onChange={(e) => setEditingDoctor({ ...editingDoctor, name: e.target.value })}
                  className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-xl border border-slate-200 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Title</label>
                  <input
                    type="text"
                    value={editingDoctor.title}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, title: e.target.value })}
                    className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-xl border border-slate-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Class</label>
                  <select
                    value={editingDoctor.doctorClass}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, doctorClass: e.target.value as any })}
                    className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-xl border border-slate-200 focus:outline-none"
                  >
                    <option value="Class A">Class A</option>
                    <option value="Class B">Class B</option>
                    <option value="Class C">Class C</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Hospital / Medical Center</label>
                <input
                  type="text"
                  value={editingDoctor.hospital}
                  onChange={(e) => setEditingDoctor({ ...editingDoctor, hospital: e.target.value })}
                  className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-xl border border-slate-200 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Phone</label>
                  <input
                    type="text"
                    value={editingDoctor.phone}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, phone: e.target.value })}
                    className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-xl border border-slate-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Target Visits / Month</label>
                  <input
                    type="number"
                    value={editingDoctor.targetVisitsPerMonth}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, targetVisitsPerMonth: parseInt(e.target.value) || 1 })}
                    className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-xl border border-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Personal Notes & Preferences</label>
                <textarea
                  rows={3}
                  value={editingDoctor.personalNotes}
                  onChange={(e) => setEditingDoctor({ ...editingDoctor, personalNotes: e.target.value })}
                  className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-xl border border-slate-200 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingDoctor(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl shadow"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Pre-Visit Coach Modal */}
      <PreVisitCoachModal
        doctor={coachDoctor}
        isOpen={!!coachDoctor}
        onClose={() => setCoachDoctor(null)}
        onStartVisit={(doc) => {
          setCoachDoctor(null);
          quickNavigateToRecordVisitWithDoctor(doc);
        }}
      />

      {/* Add New Doctor Modal */}
      {isAddingDoctor && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 text-left p-5 space-y-4 my-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-black text-slate-900">Add New Physician</h3>
                <p className="text-xs text-slate-500">Create a new physician profile in your territory database</p>
              </div>
              <button
                onClick={() => setIsAddingDoctor(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewDoctor} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Name & Credentials *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Catherine Vance"
                  value={newDoctorData.name}
                  onChange={(e) => setNewDoctorData({ ...newDoctorData, name: e.target.value })}
                  className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Specialty</label>
                  <select
                    value={newDoctorData.specialty}
                    onChange={(e) => setNewDoctorData({ ...newDoctorData, specialty: e.target.value as Specialty })}
                    className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-xl border border-slate-200 focus:outline-none"
                  >
                    <option value="Cardiology">Cardiology</option>
                    <option value="Endocrinology">Endocrinology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Pulmonology">Pulmonology</option>
                    <option value="Gastroenterology">Gastroenterology</option>
                    <option value="General Practice">General Practice</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Doctor Class</label>
                  <select
                    value={newDoctorData.doctorClass}
                    onChange={(e) => setNewDoctorData({ ...newDoctorData, doctorClass: e.target.value as DoctorClass })}
                    className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-xl border border-slate-200 focus:outline-none"
                  >
                    <option value="Class A">Class A (Top Priority)</option>
                    <option value="Class B">Class B (Medium Priority)</option>
                    <option value="Class C">Class C (Standard)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Hospital / Medical Center</label>
                  <input
                    type="text"
                    placeholder="e.g. Memorial Health Institute"
                    value={newDoctorData.hospital}
                    onChange={(e) => setNewDoctorData({ ...newDoctorData, hospital: e.target.value })}
                    className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-xl border border-slate-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Territory</label>
                  <select
                    value={newDoctorData.territory}
                    onChange={(e) => setNewDoctorData({ ...newDoctorData, territory: e.target.value as Territory })}
                    className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-xl border border-slate-200 focus:outline-none"
                  >
                    <option value="Central District">Central District</option>
                    <option value="North Sector">North Sector</option>
                    <option value="South Bay">South Bay</option>
                    <option value="Metro West">Metro West</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Phone</label>
                  <input
                    type="text"
                    placeholder="+1 (555) 000-0000"
                    value={newDoctorData.phone}
                    onChange={(e) => setNewDoctorData({ ...newDoctorData, phone: e.target.value })}
                    className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-xl border border-slate-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Target Calls / Month</label>
                  <input
                    type="number"
                    value={newDoctorData.targetVisitsPerMonth}
                    onChange={(e) => setNewDoctorData({ ...newDoctorData, targetVisitsPerMonth: parseInt(e.target.value) || 1 })}
                    className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-xl border border-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Promoted Products (comma separated)</label>
                <input
                  type="text"
                  value={newDoctorData.promotedProducts}
                  onChange={(e) => setNewDoctorData({ ...newDoctorData, promotedProducts: e.target.value })}
                  className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-xl border border-slate-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Notes & Preferences</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Prefers morning calls on Tuesday"
                  value={newDoctorData.personalNotes}
                  onChange={(e) => setNewDoctorData({ ...newDoctorData, personalNotes: e.target.value })}
                  className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-xl border border-slate-200 focus:outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddingDoctor(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl shadow-md"
                >
                  Create Physician Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Doctor Confirmation Modal */}
      {doctorToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 text-left shadow-2xl border border-slate-200">
            <div className="flex items-center gap-3 text-red-600">
              <div className="p-3 bg-red-100 rounded-2xl">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Delete Physician Record?</h3>
                <p className="text-xs text-slate-500">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              Are you sure you want to delete <strong className="text-slate-900">{doctorToDelete.name}</strong> from your territory database?
            </p>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 text-xs">
              <button
                onClick={() => setDoctorToDelete(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteDoctorConfirmed}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold shadow-md"
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Meeting Preparation Modal */}
      {prepDoctorModal && (
        <MeetingPrepModal
          doctor={prepDoctorModal}
          onClose={() => setPrepDoctorModal(null)}
        />
      )}
    </div>
  );
};

