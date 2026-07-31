import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { 
  CheckCircle2, 
  FileText, 
  Star, 
  Pill, 
  Calendar, 
  ArrowLeft, 
  Building2, 
  Plus, 
  MessageSquare,
  ThumbsUp,
  AlertCircle,
  Save,
  Clock,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export const EndVisitScreen: React.FC = () => {
  const { doctors, selectedDoctorForModal, setActiveTab, addVisit } = useApp();
  const doctor = selectedDoctorForModal || doctors[0];

  const [rating, setRating] = useState<'Positive' | 'Neutral' | 'Hesitant' | 'Confirmed Commitment'>('Positive');
  const [notes, setNotes] = useState('Presented REPOS-3 renal outcomes trial. Doctor showed strong interest in Cardiovasc XL for stage 2 hypertension patients.');
  const [sampleQty, setSampleQty] = useState<number>(5);
  const [followUpDate, setFollowUpDate] = useState('2026-08-12');
  const [followUpTask, setFollowUpTask] = useState('Deliver full clinical monograph and check sample feedback');
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveVisit = (e: React.FormEvent) => {
    e.preventDefault();
    if (doctor) {
      addVisit({
        id: `visit-${Date.now()}`,
        doctorId: doctor.id,
        doctorName: doctor.name,
        doctorSpecialty: doctor.specialty,
        doctorHospital: doctor.hospital,
        date: new Date().toISOString().split('T')[0],
        time: '10:30 AM',
        type: 'In-Person',
        status: 'Completed',
        notes: notes,
        aiSummary: `Visit completed with ${doctor.name}. Reaction: ${rating}. Distributed ${sampleQty} Cardiovasc XL samples.`,
        productsDiscussed: [
          { productName: 'Cardiovasc XL', reaction: rating === 'Positive' || rating === 'Confirmed Commitment' ? 'Positive' : 'Neutral' }
        ],
        samplesGiven: [
          { productName: 'Cardiovasc XL', quantity: sampleQty, batchNo: 'BATCH-2026-88' }
        ],
        objectionsCaptured: doctor.activeObjections || [],
        nextFollowUpDate: followUpDate,
        followUpTask: followUpTask,
        prescriptionPotential: rating === 'Confirmed Commitment' ? 'Confirmed Commitment' : 'High'
      });
    }

    setIsSaved(true);
    setTimeout(() => {
      setActiveTab('visits');
    }, 1000);
  };

  if (!doctor) {
    return (
      <div className="p-6 text-center text-slate-500">
        <p>No doctor selected for logging visit.</p>
        <button onClick={() => setActiveTab('doctors')} className="text-blue-600 font-semibold underline mt-2">
          Select Doctor from Directory
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-4xl mx-auto pb-24 relative">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveTab('visits')}
          className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Visits History</span>
        </button>

        <span className="text-xs font-extrabold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full flex items-center gap-1 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Log Completed Visit</span>
        </span>
      </div>

      {/* Header Doctor Summary */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm flex items-center gap-4">
        <img
          src={doctor.avatar}
          alt={doctor.name}
          className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-100 shrink-0"
        />
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-extrabold text-slate-900">{doctor.name}</h1>
            <span className="text-[10px] font-extrabold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md">
              {doctor.doctorClass}
            </span>
          </div>
          <p className="text-xs font-bold text-blue-600">{doctor.specialty} • {doctor.hospital}</p>
          <p className="text-[11px] text-slate-400 font-medium">Logged Call: Today, 10:30 AM</p>
        </div>
      </div>

      {/* Main End Visit Form */}
      <form onSubmit={handleSaveVisit} className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-6">
        
        {/* Rating / Outcome sentiment */}
        <div>
          <label className="block text-xs font-extrabold text-slate-900 mb-2.5">
            Physician Reception & Prescribing Sentiment
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {(['Positive', 'Neutral', 'Hesitant', 'Confirmed Commitment'] as const).map(r => (
              <button
                key={r}
                type="button"
                onClick={() => setRating(r)}
                className={`py-3 px-3 rounded-2xl font-bold border transition-all text-center ${
                  rating === r
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Discussion Notes */}
        <div>
          <label className="block text-xs font-extrabold text-slate-900 mb-2">
            Visit Discussion & Feedback Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Log physician feedback, questions raised, or competitive mentions..."
            className="w-full p-3.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:bg-white text-slate-800 font-medium"
            required
          />
        </div>

        {/* Samples Distributed */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-900 flex items-center gap-2">
              <Pill className="w-4 h-4 text-blue-600" />
              <span>Samples & Starter Packs Handed Out</span>
            </span>
            <span className="text-xs font-extrabold text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-md">
              Cardiovasc XL 20mg
            </span>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-slate-600 font-semibold">Quantity Provided to Clinic:</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSampleQty(Math.max(0, sampleQty - 1))}
                className="w-8 h-8 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-100 shadow-2xs"
              >
                -
              </button>
              <span className="font-extrabold text-sm text-slate-900 w-6 text-center">{sampleQty}</span>
              <button
                type="button"
                onClick={() => setSampleQty(sampleQty + 1)}
                className="w-8 h-8 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-100 shadow-2xs"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Next Follow-up Commitment */}
        <div className="space-y-3">
          <label className="block text-xs font-extrabold text-slate-900">
            Next Action Task & Scheduled Follow-up Date
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[11px] text-slate-500 font-bold block mb-1">Follow-up Task</span>
              <input
                type="text"
                value={followUpTask}
                onChange={(e) => setFollowUpTask(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-blue-500 text-slate-800 font-medium"
                required
              />
            </div>
            <div>
              <span className="text-[11px] text-slate-500 font-bold block mb-1">Target Date</span>
              <input
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-blue-500 text-slate-800 font-medium"
                required
              />
            </div>
          </div>
        </div>

        {/* Submit Action */}
        <button
          type="submit"
          disabled={isSaved}
          className={`w-full py-4 px-4 font-extrabold rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all ${
            isSaved
              ? 'bg-emerald-600 text-white shadow-emerald-500/20'
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25 active:scale-[0.99]'
          }`}
        >
          {isSaved ? (
            <>
              <CheckCircle2 className="w-5 h-5" />
              <span>Visit Log Saved Successfully!</span>
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>Save & Record Visit Log</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

