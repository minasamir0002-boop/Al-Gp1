import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Award, 
  HelpCircle, 
  FileText, 
  Calendar, 
  Stethoscope, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle,
  Pill,
  ShieldAlert,
  Sparkles,
  Swords,
  ChevronRight,
  TrendingUp,
  User,
  Map,
  CheckCircle,
  Hourglass,
  BrainCircuit,
  BookOpen
} from 'lucide-react';
import { SmartMemoryTab } from '../components/Doctor/SmartMemoryTab';
import { KnowledgeUsageTab } from '../components/Doctor/KnowledgeUsageTab';

export const DoctorProfileScreen: React.FC = () => {
  const { doctors, selectedDoctorForModal, setActiveTab } = useApp();
  const [profileTab, setProfileTab] = useState<'overview' | 'smart-memory' | 'knowledge-usage'>('overview');

  // Fallback to first doctor if none explicitly selected
  const doctor = selectedDoctorForModal || doctors[0];

  if (!doctor) {
    return (
      <div className="p-6 text-center text-slate-500 space-y-4">
        <p>No doctor selected.</p>
        <button onClick={() => setActiveTab('doctors')} className="text-blue-600 font-semibold underline">
          Return to Doctors Directory
        </button>
      </div>
    );
  }

  const doctorArea = doctor.area || doctor.territory || 'Central District';
  const doctorClinic = doctor.clinic || doctor.clinicAddress || 'Medical Suite';
  const doctorPotential = doctor.potential || doctor.prescribingVolume || 'Medium';

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-4xl mx-auto pb-28 relative">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveTab('doctors')}
          className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Directory</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-extrabold bg-blue-100 text-blue-800 px-3 py-1 rounded-full border border-blue-200">
            {doctor.doctorClass}
          </span>
          <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${
            doctorPotential === 'High'
              ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
              : doctorPotential === 'Medium'
              ? 'bg-amber-100 text-amber-800 border-amber-200'
              : 'bg-slate-100 text-slate-700 border-slate-200'
          }`}>
            {doctorPotential} Potential
          </span>
        </div>
      </div>

      {/* Main Profile Hero Card */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-5"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <img
            src={doctor.avatar}
            alt={doctor.name}
            className="w-20 h-20 rounded-2xl object-cover border-4 border-slate-100 shadow-sm shrink-0"
          />
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{doctor.name}</h1>
              <span className="text-xs font-bold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg border border-blue-200">
                {doctor.specialty}
              </span>
            </div>
            <p className="text-xs font-bold text-blue-600">{doctor.title}</p>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 font-medium">
              <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{doctor.hospital}</span>
            </p>
          </div>
        </div>

        {/* Quick Summary Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-slate-100 text-xs">
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 font-medium block">Area / Territory</span>
            <span className="font-bold text-slate-800 text-xs truncate block">{doctorArea}</span>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 font-medium block">Class & Potential</span>
            <span className="font-bold text-emerald-700 text-xs block">{doctor.doctorClass} ({doctorPotential})</span>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 font-medium block">Preferred Visit Time</span>
            <span className="font-bold text-slate-800 text-xs block truncate">{doctor.preferredVisitTime}</span>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 font-medium block">Follow-up Status</span>
            <span className="font-bold text-blue-700 text-xs block">{doctor.followUpStatus || 'Up-to-Date'}</span>
          </div>
        </div>
      </motion.div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setProfileTab('overview')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 shrink-0 transition-all ${
            profileTab === 'overview'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile Overview</span>
        </button>

        <button
          onClick={() => setProfileTab('smart-memory')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 shrink-0 transition-all ${
            profileTab === 'smart-memory'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-indigo-500/20'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BrainCircuit className="w-4 h-4 text-amber-500" />
          <span>Smart Memory</span>
          <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-md font-black">
            Sprint 3.0
          </span>
        </button>

        <button
          onClick={() => setProfileTab('knowledge-usage')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 shrink-0 transition-all ${
            profileTab === 'knowledge-usage'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4 text-purple-500" />
          <span>Knowledge Usage</span>
          <span className="text-[10px] bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded-md font-black">
            Sprint 5.0
          </span>
        </button>
      </div>

      {/* Tab 1: OVERVIEW */}
      {profileTab === 'overview' && (
        <div className="space-y-6">
          {/* Section 1: Personal Information */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-4">
        <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
          <User className="w-4 h-4 text-blue-600" />
          <span>Personal Information & Contact</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <span className="text-[11px] text-slate-400 font-medium block">Full Name & Title</span>
            <span className="font-bold text-slate-900 block text-xs">{doctor.name} • {doctor.title}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <span className="text-[11px] text-slate-400 font-medium block">Specialty & Tier Class</span>
            <span className="font-bold text-slate-900 block text-xs">{doctor.specialty} ({doctor.doctorClass})</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <span className="text-[11px] text-slate-400 font-medium block">Hospital Center</span>
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              {doctor.hospital}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <span className="text-[11px] text-slate-400 font-medium block">Clinic / Suite</span>
            <span className="font-bold text-slate-800 flex items-center gap-1.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="truncate">{doctorClinic}</span>
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <span className="text-[11px] text-slate-400 font-medium block">Area / Territory</span>
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <Map className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              {doctorArea}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <span className="text-[11px] text-slate-400 font-medium block">Phone Number</span>
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              {doctor.phone}
            </span>
          </div>
        </div>
      </div>

      {/* Section 2 & Section 3: Products Used & Competitors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Section 2: Products Used */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-3">
          <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
            <Pill className="w-4 h-4 text-blue-600" />
            <span>Products Used</span>
          </h2>

          <div className="space-y-2">
            {(doctor.productsUsed || doctor.promotedProducts || ['Cardiovasc XL 100mg', 'AtheroStat 20mg']).map((prod, idx) => (
              <div key={idx} className="p-3 bg-blue-50/70 rounded-2xl border border-blue-100 text-xs font-semibold text-blue-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Pill className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>{prod}</span>
                </div>
                <span className="text-[10px] bg-blue-600 text-white font-extrabold px-2 py-0.5 rounded-md shrink-0">
                  Active
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Competitors */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-3">
          <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
            <Swords className="w-4 h-4 text-rose-600" />
            <span>Competitor Prescribing</span>
          </h2>

          <div className="space-y-2 text-xs">
            {(doctor.competitorsList || [
              { brand: "Entresto 200mg", company: "Novartis", share: "35% Share", notes: "Primary competitor in post-MI cardiac patients." },
              { brand: "Diovan 160mg", company: "Novartis", share: "20% Share", notes: "Used for mild hypertension monotherapy." }
            ]).map((comp, idx) => (
              <div key={idx} className="p-3 bg-rose-50/60 rounded-2xl border border-rose-100 space-y-1">
                <div className="flex items-center justify-between font-bold text-rose-950">
                  <span>{comp.brand} <span className="text-[10px] text-rose-600 font-normal">({comp.company})</span></span>
                  <span className="text-[10px] bg-rose-200 text-rose-900 px-2 py-0.5 rounded-md font-extrabold">{comp.share}</span>
                </div>
                <p className="text-[11px] text-rose-700 font-medium">{comp.notes}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 4: Visit History Timeline (5 Previous Visits) */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span>Visit Timeline (Previous 5 Visits)</span>
          </h2>
          <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
            {(doctor.visitTimeline && doctor.visitTimeline.length) || 5} Recorded Sessions
          </span>
        </div>

        <div className="space-y-3 relative pl-4 border-l-2 border-blue-200">
          {(doctor.visitTimeline && doctor.visitTimeline.length > 0 ? doctor.visitTimeline : [
            { id: "v1", date: "2026-07-22", summary: "Presented Cardiovasc XL 100mg renal outcomes trial.", doctorReaction: "Positive", followUpNeeded: true, followUpDetails: "Deliver REPOS-3 renal subgroup paper" },
            { id: "v2", date: "2026-07-08", summary: "Reviewed PARADIGM-CV trial data regarding 30-day heart failure hospital readmissions.", doctorReaction: "Enthusiastic", followUpNeeded: false },
            { id: "v3", date: "2026-06-24", summary: "Provided 10 starter packs of Cardiovasc XL. Addressed copay tier concern.", doctorReaction: "Neutral", followUpNeeded: true, followUpDetails: "Follow-up on patient coupon redemptions" },
            { id: "v4", date: "2026-06-10", summary: "Discussed comparative safety profile against Entresto for chronic heart failure.", doctorReaction: "Hesitant", followUpNeeded: true, followUpDetails: "Provide renal safety comparative slides" },
            { id: "v5", date: "2026-05-27", summary: "Initial introductory detailing call. Introduced product mechanism of action.", doctorReaction: "Neutral", followUpNeeded: false }
          ]).map((vt) => {
            const reactionColor = 
              vt.doctorReaction === 'Enthusiastic' || vt.doctorReaction === 'Positive'
                ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                : vt.doctorReaction === 'Hesitant' || vt.doctorReaction === 'Skeptical'
                ? 'bg-amber-100 text-amber-800 border-amber-200'
                : 'bg-slate-100 text-slate-700 border-slate-200';

            return (
              <div key={vt.id} className="relative space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs">
                {/* Timeline node dot */}
                <span className="absolute -left-[23px] top-4 w-3.5 h-3.5 bg-blue-600 rounded-full ring-4 ring-white" />

                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-blue-600" />
                      {vt.date}
                    </span>
                  </div>

                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-md border ${reactionColor}`}>
                    Reaction: {vt.doctorReaction}
                  </span>
                </div>

                <p className="text-slate-700 leading-relaxed font-medium">{vt.summary}</p>

                {vt.followUpNeeded && vt.followUpDetails && (
                  <div className="pt-2 mt-1 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-blue-800 font-bold bg-blue-50/70 p-2 rounded-xl">
                    <span className="flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>Follow-up: {vt.followUpDetails}</span>
                    </span>
                    <span className="text-[9px] bg-blue-600 text-white px-2 py-0.5 rounded-md">Action Required</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 5: Previous Objections */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <span>Previous Objections</span>
          </h2>
          <button 
            onClick={() => setActiveTab('objections')}
            className="text-xs text-blue-600 font-bold hover:underline"
          >
            Objections Database
          </button>
        </div>

        <div className="space-y-2.5">
          {(doctor.previousObjectionsList && doctor.previousObjectionsList.length > 0 ? doctor.previousObjectionsList : [
            { id: "po1", objection: "Concerned about renal safety in elderly patients with eGFR < 45.", shortAnswer: "REPOS-3 subgroup trial proved 31% slower eGFR decline over 36 months.", status: "Solved" },
            { id: "po2", objection: "High copay tier on local hospital formulary.", shortAnswer: "Provided RepOS Instant Savings Co-pay Card capping monthly cost at $15.", status: "Solved" },
            { id: "po3", objection: "Requests long-term renal safety outcome whitepaper before expanded adoption.", shortAnswer: "Whitepaper scheduled for drop-off on next visit.", status: "Pending" }
          ]).map((objCard) => {
            const isSolved = objCard.status === 'Solved';

            return (
              <div 
                key={objCard.id} 
                className={`p-4 rounded-2xl border text-xs space-y-2 transition-all ${
                  isSolved 
                    ? 'bg-emerald-50/50 border-emerald-200/80 text-emerald-950' 
                    : 'bg-amber-50/70 border-amber-200 text-amber-950'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    <ShieldAlert className={`w-4 h-4 shrink-0 mt-0.5 ${isSolved ? 'text-emerald-600' : 'text-amber-600'}`} />
                    <span className="font-extrabold text-slate-900 text-xs">{objCard.objection}</span>
                  </div>

                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-md shrink-0 flex items-center gap-1 ${
                    isSolved 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-amber-500 text-white'
                  }`}>
                    {isSolved ? <CheckCircle className="w-3 h-3" /> : <Hourglass className="w-3 h-3" />}
                    <span>{objCard.status}</span>
                  </span>
                </div>

                <div className="pl-6 border-l-2 border-slate-200/80 space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Recommended Strategy / Answer:</span>
                  <p className="text-slate-800 font-medium leading-relaxed">{objCard.shortAnswer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 6: AI Visit Brief Synthesis */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-3xl p-5 text-white shadow-lg space-y-3 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <h2 className="text-sm font-extrabold text-white">RepMind Intelligence Summary</h2>
          </div>
          <span className="text-[10px] bg-white/20 text-blue-100 px-2.5 py-0.5 rounded-full font-bold">
            Doctor Profile Brief
          </span>
        </div>

        <p className="text-xs text-blue-100/90 leading-relaxed">
          {doctor.name} is a <strong>{doctor.doctorClass} Key Opinion Leader</strong> in {doctor.specialty} located at {doctor.hospital}. Key objective for upcoming call is reinforcing patient outcomes and addressing pending objections.
        </p>

        <div className="pt-2 flex items-center justify-between text-xs border-t border-white/10">
          <span className="text-blue-200 font-medium">Area: {doctorArea}</span>
          <span className="text-amber-300 font-bold">Target Class: {doctor.doctorClass}</span>
        </div>
      </div>
        </div>
      )}

      {/* Tab 2: SMART MEMORY (Sprint 3.0) */}
      {profileTab === 'smart-memory' && (
        <SmartMemoryTab doctor={doctor} onPrepareBrief={() => setActiveTab('visit-brief')} />
      )}

      {/* Tab 3: KNOWLEDGE USAGE (Sprint 5.0) */}
      {profileTab === 'knowledge-usage' && (
        <KnowledgeUsageTab doctor={doctor} />
      )}

      {/* Fixed Bottom Action Bar: Start Visit Brief Button */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 p-3 sm:p-4 shadow-2xl">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div className="hidden sm:block">
            <span className="text-xs font-extrabold text-slate-900 block">{doctor.name}</span>
            <span className="text-[11px] text-slate-500">{doctor.specialty} • {doctor.hospital}</span>
          </div>

          <button
            onClick={() => setActiveTab('visit-brief')}
            className="w-full sm:w-auto flex-1 py-3.5 px-6 bg-blue-600 hover:bg-blue-700 text-white text-sm font-extrabold rounded-2xl shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
          >
            <Stethoscope className="w-5 h-5" />
            <span>Prepare Visit Brief</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};


