import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { Doctor, Specialty, DoctorClass } from '../types';
import { 
  Search, 
  Filter, 
  Building2, 
  Clock, 
  Plus, 
  User, 
  Award, 
  Stethoscope, 
  AlertCircle,
  X,
  UserPlus,
  Calendar,
  CheckCircle2,
  MapPin,
  Phone,
  ArrowUpDown,
  TrendingUp,
  Map
} from 'lucide-react';

export const DoctorsScreen: React.FC = () => {
  const { doctors, setActiveTab, setSelectedDoctorForModal, addDoctor } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState<string>('All');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');
  const [selectedClass, setSelectedClass] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'lastVisit' | 'name' | 'potential'>('lastVisit');
  const [showFilterBar, setShowFilterBar] = useState(false);
  const [isAddDoctorOpen, setIsAddDoctorOpen] = useState(false);

  // Add Doctor Form state
  const [newName, setNewName] = useState('');
  const [newTitle, setNewTitle] = useState('Consultant Physician');
  const [newSpecialty, setNewSpecialty] = useState<Specialty>('Cardiology');
  const [newClass, setNewClass] = useState<DoctorClass>('Class A');
  const [newArea, setNewArea] = useState('Central District');
  const [newHospital, setNewHospital] = useState('St. Jude General Hospital');
  const [newClinic, setNewClinic] = useState('Suite 402 Medical Center');
  const [newPhone, setNewPhone] = useState('+1 (555) 349-2011');

  const areas = ['All', 'Central District', 'North Sector', 'South Bay', 'Metro West'];
  const specialties = ['All', 'Cardiology', 'Endocrinology', 'Neurology', 'Pulmonology', 'Gastroenterology', 'Oncology', 'General Practice'];
  const classes = ['All', 'Class A', 'Class B', 'Class C'];

  // Search by doctor name or specialty (plus area and hospital)
  const filteredDoctors = doctors.filter(doc => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query ||
                          doc.name.toLowerCase().includes(query) ||
                          doc.specialty.toLowerCase().includes(query) ||
                          doc.hospital.toLowerCase().includes(query) ||
                          (doc.area && doc.area.toLowerCase().includes(query));
    
    const doctorArea = doc.area || doc.territory || 'Central District';
    const matchesArea = selectedArea === 'All' || doctorArea === selectedArea;
    const matchesSpecialty = selectedSpecialty === 'All' || doc.specialty === selectedSpecialty;
    const matchesClass = selectedClass === 'All' || doc.doctorClass === selectedClass;
    
    return matchesSearch && matchesArea && matchesSpecialty && matchesClass;
  });

  // Sorting logic
  const sortedDoctors = [...filteredDoctors].sort((a, b) => {
    if (sortBy === 'lastVisit') {
      const dateA = a.lastVisitDate ? new Date(a.lastVisitDate).getTime() : 0;
      const dateB = b.lastVisitDate ? new Date(b.lastVisitDate).getTime() : 0;
      return dateB - dateA; // Most recent visit first
    }
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    }
    if (sortBy === 'potential') {
      const potentialOrder = { High: 3, Medium: 2, Low: 1 };
      const potA = potentialOrder[a.potential || a.prescribingVolume || 'Medium'] || 2;
      const potB = potentialOrder[b.potential || b.prescribingVolume || 'Medium'] || 2;
      return potB - potA; // High potential first
    }
    return 0;
  });

  const handleOpenDoctorProfile = (doc: Doctor) => {
    setSelectedDoctorForModal(doc);
    setActiveTab('doctor-profile');
  };

  const handlePrepareVisitBrief = (doc: Doctor, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedDoctorForModal(doc);
    setActiveTab('visit-brief');
  };

  const handleAddDoctorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newDoc: Doctor = {
      id: `doc-${Date.now()}`,
      name: newName.startsWith('Dr.') ? newName : `Dr. ${newName}`,
      title: newTitle,
      specialty: newSpecialty,
      doctorClass: newClass,
      territory: newArea as any,
      area: newArea,
      hospital: newHospital,
      clinicAddress: newClinic,
      clinic: newClinic,
      phone: newPhone,
      email: `${newName.toLowerCase().replace(/[^a-z]/g, '')}@hospital.org`,
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=250',
      prescribingVolume: newClass === 'Class A' ? 'High' : 'Medium',
      potential: newClass === 'Class A' ? 'High' : 'Medium',
      preferredVisitTime: 'Tues / Thurs 11:00 AM',
      lastVisitDate: new Date().toISOString().split('T')[0],
      followUpStatus: 'Pending',
      nextScheduledVisit: 'Upcoming',
      totalVisitsThisMonth: 0,
      targetVisitsPerMonth: 3,
      promotedProducts: ['Cardiovasc XL'],
      productsUsed: ['Cardiovasc XL'],
      visitTimeline: [
        {
          id: `vt-new-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          summary: 'Newly added doctor profile to roster. Initial detailing call scheduled.',
          doctorReaction: 'Neutral',
          followUpNeeded: true,
          followUpDetails: 'Introductory call visit'
        }
      ],
      previousObjectionsList: [
        {
          id: `po-new-${Date.now()}`,
          objection: 'Pending initial introductory presentation.',
          shortAnswer: 'Schedule introductory detailing call.',
          status: 'Pending'
        }
      ],
      activeObjections: ['Pending initial introductory call'],
      personalNotes: 'Added manually to roster.',
      sentiment: 'Neutral',
      coordinate: { x: 45, y: 55 }
    };

    addDoctor(newDoc);
    setIsAddDoctorOpen(false);
    setNewName('');
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-5xl mx-auto pb-24 relative min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Doctors Directory</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {sortedDoctors.length} Doctors listed in territory roster
          </p>
        </div>

        <button
          onClick={() => setIsAddDoctorOpen(true)}
          className="hidden sm:flex items-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-2xl shadow-md shadow-blue-500/20 transition-all active:scale-95"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Doctor</span>
        </button>
      </div>

      {/* Professional Search Bar & Filter / Sorting Controls */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-sm space-y-3">
        {/* Search Bar & Primary Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by doctor name or specialty..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800 font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Sorting Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-1.5 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="text-slate-400 font-medium hidden md:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="lastVisit">Last Visit</option>
                <option value="name">Doctor Name</option>
                <option value="potential">Potential</option>
              </select>
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilterBar(!showFilterBar)}
              className={`p-2.5 rounded-2xl border flex items-center gap-1.5 text-xs font-bold transition-all ${
                showFilterBar || selectedArea !== 'All' || selectedSpecialty !== 'All' || selectedClass !== 'All'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>
        </div>

        {/* Expandable Filter Bar (Area, Specialty, Class) */}
        {(showFilterBar || selectedArea !== 'All' || selectedSpecialty !== 'All' || selectedClass !== 'All') && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="pt-3 border-t border-slate-100 space-y-3"
          >
            {/* Area Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-[11px] font-extrabold text-slate-500 mr-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-blue-600" /> Area:
              </span>
              {areas.map(area => (
                <button
                  key={area}
                  onClick={() => setSelectedArea(area)}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                    selectedArea === area
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>

            {/* Specialty Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-[11px] font-extrabold text-slate-500 mr-1 flex items-center gap-1">
                <Stethoscope className="w-3 h-3 text-blue-600" /> Specialty:
              </span>
              {specialties.map(spec => (
                <button
                  key={spec}
                  onClick={() => setSelectedSpecialty(spec)}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                    selectedSpecialty === spec
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {spec}
                </button>
              ))}
            </div>

            {/* Class Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-[11px] font-extrabold text-slate-500 mr-1 flex items-center gap-1">
                <Award className="w-3 h-3 text-blue-600" /> Class:
              </span>
              {classes.map(cls => (
                <button
                  key={cls}
                  onClick={() => setSelectedClass(cls)}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                    selectedClass === cls
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cls}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Doctor Cards Roster Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedDoctors.map(doc => {
          const doctorArea = doc.area || doc.territory || 'Central District';
          const doctorClinic = doc.clinic || doc.clinicAddress;
          const doctorPotential = doc.potential || doc.prescribingVolume || 'Medium';

          return (
            <motion.div
              key={doc.id}
              whileHover={{ y: -2 }}
              onClick={() => handleOpenDoctorProfile(doc)}
              className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer flex flex-col justify-between space-y-4 group relative overflow-hidden"
            >
              {/* Doctor Card Top Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={doc.avatar}
                      alt={doc.name}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-100 shadow-xs shrink-0"
                    />
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-600 rounded-full border-2 border-white flex items-center justify-center text-[9px] text-white font-black">
                      {doc.doctorClass.replace('Class ', '')}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors text-base">
                        {doc.name}
                      </h3>
                      <span className="text-[10px] font-extrabold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md border border-blue-200">
                        {doc.doctorClass}
                      </span>
                    </div>

                    <p className="text-xs text-blue-600 font-bold mt-0.5">{doc.specialty}</p>

                    <div className="text-[11px] text-slate-500 mt-1 space-y-0.5 font-medium">
                      <p className="flex items-center gap-1 truncate">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{doc.hospital}</span>
                      </p>
                      <p className="flex items-center gap-1 truncate text-slate-400">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{doctorClinic}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detail Badges: Area, Phone, Potential, Follow-up Status */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-medium block">Area / Territory</span>
                  <span className="font-bold text-slate-800 text-[11px] flex items-center gap-1 truncate">
                    <Map className="w-3 h-3 text-blue-600 shrink-0" />
                    <span className="truncate">{doctorArea}</span>
                  </span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-medium block">Phone Contact</span>
                  <span className="font-bold text-slate-800 text-[11px] flex items-center gap-1 truncate">
                    <Phone className="w-3 h-3 text-blue-600 shrink-0" />
                    <span className="truncate">{doc.phone}</span>
                  </span>
                </div>
              </div>

              {/* Last Visit & Potential Row */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs space-y-2">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="text-slate-400 font-medium flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Last Visit:
                  </span>
                  <span className="font-extrabold text-slate-900">{doc.lastVisitDate}</span>
                </div>

                <div className="flex items-center justify-between pt-1.5 border-t border-slate-200/60">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-400 font-medium">Potential:</span>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                      doctorPotential === 'High'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : doctorPotential === 'Medium'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {doctorPotential} Potential
                    </span>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    doc.followUpStatus === 'Up-to-Date'
                      ? 'bg-emerald-100 text-emerald-800'
                      : doc.followUpStatus === 'Overdue'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {doc.followUpStatus || 'Follow-up Required'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleOpenDoctorProfile(doc)}
                  className="flex-1 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all text-center"
                >
                  View Full Profile
                </button>

                <button
                  onClick={(e) => handlePrepareVisitBrief(doc, e)}
                  className="flex-1 py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <Stethoscope className="w-3.5 h-3.5" />
                  <span>Prepare Brief</span>
                </button>
              </div>
            </motion.div>
          );
        })}

        {sortedDoctors.length === 0 && (
          <div className="col-span-full bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-3">
            <User className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700">No doctors match your filter or search criteria</h3>
            <p className="text-xs text-slate-400">Try searching for a different doctor name, specialty, or clearing filters.</p>
          </div>
        )}
      </div>

      {/* Floating Add Doctor Button (FAB) */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsAddDoctorOpen(true)}
        className="fixed bottom-20 right-5 z-40 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-2xl shadow-blue-600/40 border border-blue-400 flex items-center gap-2 group"
        title="Add New Doctor"
      >
        <Plus className="w-6 h-6" />
        <span className="hidden sm:inline text-xs font-extrabold pr-1">Add Doctor</span>
      </motion.button>

      {/* Add Doctor Modal */}
      <AnimatePresence>
        {isAddDoctorOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                    <UserPlus className="w-4 h-4" />
                  </div>
                  <h2 className="text-base font-extrabold text-slate-900">Add New Doctor</h2>
                </div>
                <button
                  onClick={() => setIsAddDoctorOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddDoctorSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Doctor Full Name</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Dr. Sarah Jenkins"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-800 font-medium"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Specialty</label>
                    <select
                      value={newSpecialty}
                      onChange={(e) => setNewSpecialty(e.target.value as Specialty)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-800 font-medium"
                    >
                      {specialties.filter(s => s !== 'All').map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Class</label>
                    <select
                      value={newClass}
                      onChange={(e) => setNewClass(e.target.value as DoctorClass)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-800 font-medium"
                    >
                      <option value="Class A">Class A</option>
                      <option value="Class B">Class B</option>
                      <option value="Class C">Class C</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Area / Territory</label>
                    <select
                      value={newArea}
                      onChange={(e) => setNewArea(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-800 font-medium"
                    >
                      {areas.filter(a => a !== 'All').map(a => (
                        <option key={a} value={a}>{a}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-800 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Hospital</label>
                  <input
                    type="text"
                    value={newHospital}
                    onChange={(e) => setNewHospital(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-800 font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Clinic / Address</label>
                  <input
                    type="text"
                    value={newClinic}
                    onChange={(e) => setNewClinic(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-800 font-medium"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddDoctorOpen(false)}
                    className="py-2.5 px-4 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-2.5 px-5 bg-blue-600 text-white font-bold rounded-xl shadow-md shadow-blue-500/20 hover:bg-blue-700"
                  >
                    Save Doctor
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};


