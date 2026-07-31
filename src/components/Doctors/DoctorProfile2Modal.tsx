import React, { useState } from 'react';
import { Doctor, Visit } from '../../types';
import { useApp } from '../../context/AppContext';
import { DoctorIntelligenceEngine } from '../../ai/doctorIntelligenceEngine';
import {
  X,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  Plus,
  Sparkles,
  Award,
  TrendingUp,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Package,
  Layers,
  Zap,
  Navigation,
  Send,
  MessageSquare,
  ChevronRight,
  ExternalLink,
  BookOpen,
  Target,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  doctor: Doctor | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (doc: Doctor) => void;
}

export const DoctorProfile2Modal: React.FC<Props> = ({ doctor, isOpen, onClose, onEdit }) => {
  const {
    visits,
    campaigns,
    products,
    doctorAlerts,
    quickNavigateToRecordVisitWithDoctor,
    addSmartCalendarEvent,
    addNotification,
    updateDoctor
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'kpis' | 'timeline' | 'insights' | 'objections' | 'products' | 'prep' | 'followup'
  >('kpis');

  // Quick Action States
  const [newNote, setNewNote] = useState<string>('');
  const [noteSuccess, setNoteSuccess] = useState<boolean>(false);
  const [reminderMsg, setReminderMsg] = useState<string>('');

  if (!isOpen || !doctor) return null;

  // Generate Doctor Profile 2.0 Dossier
  const dossier = DoctorIntelligenceEngine.generateProfile2Dossier(
    doctor,
    visits,
    campaigns,
    products,
    doctorAlerts
  );

  const { basicInfo, businessKpis, timeline, aiInsights, objectionCenter, productMatrix, visitPreparation, followUpCenter } = dossier;

  // Handlers for Quick Actions
  const handleCallDoctor = () => {
    window.open(`tel:${basicInfo.phone}`, '_self');
  };

  const handleOpenMaps = () => {
    window.open(basicInfo.gpsLocation.mapsUrl, '_blank');
  };

  const handleScheduleVisit = () => {
    addSmartCalendarEvent({
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorSpecialty: doctor.specialty,
      hospital: doctor.hospital,
      territory: doctor.territory,
      date: '2026-08-01',
      time: '10:00 AM',
      type: 'In-Person',
      status: 'Scheduled',
      notes: `Scheduled via RepOS Doctor Intelligence Center for ${doctor.name}`,
      reminderSet: true
    });
    addNotification({
      title: 'Visit Scheduled',
      message: `Calendar entry added for ${doctor.name} on Aug 1 at 10:00 AM`,
      category: 'Clinical Update',
      urgency: 'Medium',
      doctorId: doctor.id,
      doctorName: doctor.name,
      actionType: 'Schedule'
    });
    setReminderMsg('Visit scheduled on Calendar!');
    setTimeout(() => setReminderMsg(''), 3000);
  };

  const handleSendReminder = () => {
    addNotification({
      title: `Reminder Set: ${doctor.name}`,
      message: `Follow-up callback set for ${doctor.name} on ${businessKpis.nextPlannedVisit}`,
      category: 'Follow-up Due',
      urgency: 'High',
      doctorId: doctor.id,
      doctorName: doctor.name
    });
    setReminderMsg('Follow-up reminder set successfully!');
    setTimeout(() => setReminderMsg(''), 3000);
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    const updatedNotes = doctor.personalNotes
      ? `${doctor.personalNotes}\n[${new Date().toLocaleDateString()}] ${newNote.trim()}`
      : `[${new Date().toLocaleDateString()}] ${newNote.trim()}`;

    updateDoctor({ ...doctor, personalNotes: updatedNotes });
    setNewNote('');
    setNoteSuccess(true);
    setTimeout(() => setNoteSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-slate-200 text-left flex flex-col relative my-auto">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-indigo-900/50 shrink-0">
          <div className="flex items-center gap-3.5">
            <img
              src={basicInfo.avatar}
              alt={basicInfo.name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-400 shadow-md shrink-0"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg font-black text-white">{basicInfo.name}</h1>
                <span className="text-[10px] font-extrabold bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {basicInfo.doctorClass}
                </span>
                <span className="text-[10px] font-bold bg-indigo-800/80 text-indigo-200 px-2 py-0.5 rounded-md border border-indigo-700/60">
                  Priority Score: {businessKpis.priorityScore}/100
                </span>
              </div>
              <p className="text-xs text-indigo-200 font-medium mt-0.5">
                {basicInfo.title} • <span className="font-bold text-amber-300">{basicInfo.specialty}</span> • {basicInfo.territory}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            {onEdit && (
              <button
                onClick={() => onEdit(doctor)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors"
              >
                Edit
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* SECTION 9: Quick Actions Toolbar */}
        <div className="bg-slate-900/95 text-white px-4 py-2.5 border-b border-slate-800 flex items-center justify-between gap-2 overflow-x-auto text-xs shrink-0">
          <span className="text-[10px] font-extrabold uppercase text-amber-400 tracking-wider shrink-0 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" /> Quick Actions
          </span>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                onClose();
                quickNavigateToRecordVisitWithDoctor(doctor);
              }}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record Visit</span>
            </button>
            <button
              onClick={handleScheduleVisit}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Schedule</span>
            </button>
            <button
              onClick={handleOpenMaps}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all flex items-center gap-1.5"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Maps</span>
            </button>
            <button
              onClick={handleCallDoctor}
              className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call</span>
            </button>
            <button
              onClick={handleSendReminder}
              className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold transition-all flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Reminder</span>
            </button>
          </div>
        </div>

        {reminderMsg && (
          <div className="bg-emerald-500 text-white text-xs px-4 py-1.5 font-bold text-center animate-fadeIn shrink-0">
            ✓ {reminderMsg}
          </div>
        )}

        {/* Navigation Tabs (7 Core Modules) */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 pt-2.5 flex items-center gap-2 overflow-x-auto text-xs font-extrabold text-slate-600 shrink-0">
          <button
            onClick={() => setActiveTab('kpis')}
            className={`px-3 py-2 rounded-t-xl transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'kpis'
                ? 'border-blue-600 bg-white text-blue-700 shadow-sm'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Award className="w-4 h-4 text-blue-600" />
            <span>1. Basic & KPIs</span>
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-3 py-2 rounded-t-xl transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'timeline'
                ? 'border-blue-600 bg-white text-blue-700 shadow-sm'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Clock className="w-4 h-4 text-purple-600" />
            <span>2. Timeline ({timeline.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('insights')}
            className={`px-3 py-2 rounded-t-xl transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'insights'
                ? 'border-blue-600 bg-white text-blue-700 shadow-sm'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>3. AI Insights</span>
          </button>
          <button
            onClick={() => setActiveTab('objections')}
            className={`px-3 py-2 rounded-t-xl transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'objections'
                ? 'border-blue-600 bg-white text-blue-700 shadow-sm'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span>4. Objections ({objectionCenter.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-3 py-2 rounded-t-xl transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'products'
                ? 'border-blue-600 bg-white text-blue-700 shadow-sm'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Package className="w-4 h-4 text-indigo-600" />
            <span>5. Product Matrix</span>
          </button>
          <button
            onClick={() => setActiveTab('prep')}
            className={`px-3 py-2 rounded-t-xl transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'prep'
                ? 'border-blue-600 bg-white text-blue-700 shadow-sm'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>6. Visit Prep</span>
          </button>
          <button
            onClick={() => setActiveTab('followup')}
            className={`px-3 py-2 rounded-t-xl transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'followup'
                ? 'border-blue-600 bg-white text-blue-700 shadow-sm'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-amber-600" />
            <span>7. Follow-ups ({followUpCenter.length})</span>
          </button>
        </div>

        {/* Scrollable Intelligence Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {/* TAB 1: BASIC INFO & BUSINESS KPIS */}
          {activeTab === 'kpis' && (
            <div className="space-y-6">
              {/* Section 1: Basic Information Grid */}
              <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/80 space-y-3">
                <h3 className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-blue-600" /> 1. Physician Basic Information
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold block">Hospital</span>
                    <span className="font-extrabold text-slate-900">{basicInfo.hospital}</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold block">Clinic Address</span>
                    <span className="font-bold text-slate-800 truncate block">{basicInfo.clinicAddress}</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold block">Phone</span>
                    <a href={`tel:${basicInfo.phone}`} className="font-bold text-blue-600 hover:underline">
                      {basicInfo.phone}
                    </a>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold block">Email</span>
                    <a href={`mailto:${basicInfo.email}`} className="font-bold text-blue-600 hover:underline truncate block">
                      {basicInfo.email}
                    </a>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold block">Territory</span>
                    <span className="font-extrabold text-slate-800">{basicInfo.territory}</span>
                  </div>
                  <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-emerald-700 font-bold block">GPS Pin</span>
                      <span className="text-[11px] font-mono font-bold text-emerald-950">
                        {basicInfo.gpsLocation.lat.toFixed(4)}, {basicInfo.gpsLocation.lng.toFixed(4)}
                      </span>
                    </div>
                    <button
                      onClick={handleOpenMaps}
                      className="p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                      title="Open Google Maps"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Section 2: Business KPIs */}
              <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950 text-white p-5 rounded-3xl shadow-xl border border-indigo-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase text-amber-300 tracking-wider flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-amber-400" /> 2. Business KPIs & Performance
                  </h3>
                  <span className="text-xs font-bold bg-emerald-500 text-white px-2.5 py-0.5 rounded-full">
                    {businessKpis.aiConfidencePercent}% AI Confidence
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
                    <span className="text-slate-400 text-[10px] block font-bold uppercase">Coverage Status</span>
                    <span className="text-sm font-extrabold text-emerald-400">{businessKpis.coverageStatus}</span>
                  </div>
                  <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
                    <span className="text-slate-400 text-[10px] block font-bold uppercase">Frequency Status</span>
                    <span className="text-sm font-extrabold text-white">{businessKpis.frequencyStatus}</span>
                  </div>
                  <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
                    <span className="text-slate-400 text-[10px] block font-bold uppercase">Last Visit</span>
                    <span className="text-sm font-extrabold text-indigo-300">{businessKpis.lastVisitDate}</span>
                  </div>
                  <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
                    <span className="text-slate-400 text-[10px] block font-bold uppercase">Next Planned Visit</span>
                    <span className="text-sm font-extrabold text-amber-300">{businessKpis.nextPlannedVisit}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                  <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700 flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 text-[10px] block font-bold uppercase">Visit Compliance %</span>
                      <span className="text-2xl font-black text-emerald-400">{businessKpis.visitCompliancePercent}%</span>
                    </div>
                    <div className="w-10 h-10 rounded-full border-4 border-emerald-500 flex items-center justify-center font-black text-[10px] text-emerald-300">
                      {businessKpis.visitCompliancePercent}%
                    </div>
                  </div>

                  <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700">
                    <span className="text-slate-400 text-[10px] block font-bold uppercase">Prescription Potential</span>
                    <span className="text-sm font-extrabold text-amber-300 block">{businessKpis.prescriptionPotential}</span>
                    <span className="text-[10px] text-slate-400 font-medium">Class A Prescriber Potential</span>
                  </div>

                  <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700 flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 text-[10px] block font-bold uppercase">Priority Score</span>
                      <span className="text-2xl font-black text-amber-400">{businessKpis.priorityScore} / 100</span>
                    </div>
                    <span className="text-[10px] font-bold bg-amber-400/20 text-amber-300 px-2 py-1 rounded-lg border border-amber-400/40">
                      Top Target
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: RELATIONSHIP TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-purple-600" /> 3. Relationship Timeline (Chronological History)
                </h3>
                <span className="text-xs text-slate-400 font-medium">{timeline.length} Total Interaction Events</span>
              </div>

              <div className="relative border-l-2 border-indigo-100 pl-4 sm:pl-6 space-y-4 ml-2">
                {timeline.map((item) => (
                  <div key={item.id} className="relative group">
                    <div className="absolute -left-[23px] sm:-left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-indigo-600 ring-4 ring-white" />
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 hover:border-indigo-300 transition-colors space-y-1">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${item.badgeColor}`}>
                          {item.type}
                        </span>
                        <span className="text-[11px] font-bold text-slate-400">{item.date}</span>
                      </div>
                      <h4 className="font-extrabold text-slate-900 text-xs">{item.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{item.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: AI DOCTOR INSIGHTS */}
          {activeTab === 'insights' && (
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" /> 4. AI Doctor Insights & Behavioral Analysis
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 space-y-1.5">
                  <span className="font-extrabold text-indigo-950 uppercase text-[10px] tracking-wider block">
                    Likely Prescribing Behavior
                  </span>
                  <p className="text-indigo-900 leading-relaxed font-medium">{aiInsights.prescribingBehavior}</p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1.5">
                  <span className="font-extrabold text-amber-950 uppercase text-[10px] tracking-wider block">
                    Communication Style & Preference
                  </span>
                  <p className="text-amber-900 leading-relaxed font-medium">{aiInsights.communicationStyle}</p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-1.5">
                  <span className="font-extrabold text-emerald-950 uppercase text-[10px] tracking-wider block">
                    Preferred Visit Timing
                  </span>
                  <p className="text-emerald-900 font-bold">{aiInsights.preferredVisitTiming}</p>
                </div>

                <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200/80 space-y-1.5">
                  <span className="font-extrabold text-purple-950 uppercase text-[10px] tracking-wider block">
                    Relationship Strength & Risk
                  </span>
                  <div className="flex items-center justify-between pt-0.5">
                    <span className="font-black text-purple-900">{aiInsights.relationshipStrength}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      {aiInsights.riskLevel}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white space-y-2 border border-slate-800">
                <span className="font-extrabold text-amber-300 uppercase text-[10px] tracking-wider block">
                  🚀 Growth Opportunity & Strategy Directive
                </span>
                <p className="text-xs text-slate-200 leading-relaxed">{aiInsights.growthOpportunityText}</p>
              </div>
            </div>
          )}

          {/* TAB 4: OBJECTION CENTER */}
          {activeTab === 'objections' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-600" /> 5. Physician Objection Intelligence Center
                </h3>
                <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                  {objectionCenter.length} Logged Objections
                </span>
              </div>

              <div className="space-y-3">
                {objectionCenter.map((obj) => (
                  <div key={obj.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">
                          {obj.product}
                        </span>
                        <span className="font-bold text-slate-600">{obj.category}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-400">Occurrences: {obj.frequencyCount}</span>
                        <span
                          className={`px-2 py-0.5 rounded font-black text-[10px] ${
                            obj.status === 'Resolved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {obj.status}
                        </span>
                      </div>
                    </div>

                    <div className="p-2.5 bg-rose-50 border border-rose-200/80 rounded-xl text-rose-950 font-medium">
                      <strong className="block text-[10px] uppercase text-rose-800">Objection:</strong>
                      "{obj.objectionText}"
                    </div>

                    <div className="p-3 bg-indigo-50 border border-indigo-200/80 rounded-xl text-indigo-950 font-medium space-y-1">
                      <strong className="block text-[10px] uppercase text-indigo-900 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-indigo-600" /> AI Recommended Response Strategy:
                      </strong>
                      <p>{obj.aiRecommendedResponse}</p>
                    </div>

                    <div className="p-2.5 bg-blue-50 border border-blue-200/80 rounded-xl text-blue-950 text-[11px] flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-blue-600 shrink-0" />
                      <div>
                        <strong>Supporting Trial Evidence:</strong> {obj.supportingClinicalEvidence}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: PRODUCT MATRIX */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                <Package className="w-4 h-4 text-indigo-600" /> 6. Physician Product Portfolio Matrix
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {productMatrix.map((pm, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between border-b pb-2 border-slate-200">
                      <span className="font-black text-slate-900 text-sm">{pm.productName}</span>
                      <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-purple-100 text-purple-800">
                        {pm.acceptanceLevel}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2 bg-white rounded-xl border border-slate-200">
                        <span className="text-slate-400 text-[10px] block">Promotion Count</span>
                        <span className="font-extrabold text-slate-800">{pm.promotionCount} Detailing Visits</span>
                      </div>
                      <div className="p-2 bg-white rounded-xl border border-slate-200">
                        <span className="text-slate-400 text-[10px] block">Interest Score</span>
                        <span className="font-extrabold text-emerald-600">{pm.interestScore} / 100</span>
                      </div>
                    </div>

                    <div className="p-2.5 bg-indigo-50/80 rounded-xl border border-indigo-100 text-indigo-950 text-[11px]">
                      <strong className="block text-[10px] uppercase text-indigo-800">Competitor Status:</strong>
                      {pm.competitorStatus}
                    </div>

                    <div className="p-2.5 bg-emerald-50/80 rounded-xl border border-emerald-100 text-emerald-950 text-[11px]">
                      <strong className="block text-[10px] uppercase text-emerald-800">Growth Opportunity:</strong>
                      {pm.growthOpportunity}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: VISIT PREPARATION DOSSIER */}
          {activeTab === 'prep' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-emerald-600" /> 7. AI Automated Visit Preparation Dossier
                </h3>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                  Auto-Generated
                </span>
              </div>

              <div className="space-y-3 text-xs">
                {/* Objectives */}
                <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-200 space-y-2">
                  <span className="font-extrabold text-indigo-950 uppercase text-[10px] tracking-wider block">
                    🎯 Visit Strategic Objectives
                  </span>
                  <ul className="space-y-1 list-disc list-inside text-indigo-900 font-medium">
                    {visitPreparation.objectives.map((obj, i) => (
                      <li key={i}>{obj}</li>
                    ))}
                  </ul>
                </div>

                {/* Key Messages */}
                <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-2">
                  <span className="font-extrabold text-amber-950 uppercase text-[10px] tracking-wider block">
                    💬 High-Impact Detailing Messages
                  </span>
                  <ul className="space-y-1 list-disc list-inside text-amber-900 font-medium">
                    {visitPreparation.keyMessages.map((msg, i) => (
                      <li key={i}>{msg}</li>
                    ))}
                  </ul>
                </div>

                {/* Questions & Outcome */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                    <span className="font-extrabold text-slate-800 uppercase text-[10px] block">
                      ❓ Questions to Ask Physician
                    </span>
                    <ul className="space-y-1 list-disc list-inside text-slate-700">
                      {visitPreparation.questionsToAsk.map((q, i) => (
                        <li key={i}>{q}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1.5">
                    <span className="font-extrabold text-emerald-950 uppercase text-[10px] block">
                      🏁 Target Expected Outcome
                    </span>
                    <p className="text-emerald-900 font-bold">{visitPreparation.expectedOutcome}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: FOLLOW-UP CENTER & NOTES */}
          {activeTab === 'followup' && (
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-600" /> 8. Follow-up Center & Action Items
              </h3>

              <div className="space-y-2.5">
                {followUpCenter.map((fu) => (
                  <div key={fu.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-slate-900">{fu.task}</span>
                        <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 text-[10px] font-bold">
                          {fu.category}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 block">
                        Reminder Date: <strong className="text-slate-700">{fu.reminderDate}</strong>
                      </span>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold shrink-0 ${
                        fu.priority === 'High'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {fu.priority} Priority
                    </span>
                  </div>
                ))}
              </div>

              {/* Personal Notes Section */}
              <div className="pt-4 border-t border-slate-200 space-y-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1">
                  <FileText className="w-4 h-4 text-slate-500" /> Physician Field Notes
                </h4>
                <p className="text-xs text-slate-700 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 whitespace-pre-line">
                  {doctor.personalNotes || 'No notes recorded yet.'}
                </p>

                {/* Add note input */}
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Add quick field note for this physician..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="flex-1 bg-slate-50 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none"
                  />
                  <button
                    onClick={handleAddNote}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    Save Note
                  </button>
                </div>
                {noteSuccess && (
                  <span className="text-[11px] font-bold text-emerald-600 block">✓ Note appended to doctor profile!</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
