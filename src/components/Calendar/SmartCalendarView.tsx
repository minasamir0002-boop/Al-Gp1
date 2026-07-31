import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar as CalendarIcon, Clock, Plus, MapPin, CheckCircle, Bell, Sparkles, Trash2, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { SmartCalendarEvent } from '../../types';

export const SmartCalendarView: React.FC = () => {
  const { calendarEvents, addCalendarEvent, updateCalendarEvent, deleteCalendarEvent, doctors, quickNavigateToRecordVisitWithDoctor } = useApp();
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');
  const [selectedDate, setSelectedDate] = useState<string>('2026-07-28');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isAiScheduling, setIsAiScheduling] = useState<boolean>(false);

  // Form state
  const [formDoctorId, setFormDoctorId] = useState<string>(doctors[0]?.id || '');
  const [formTime, setFormTime] = useState<string>('10:00 AM');
  const [formType, setFormType] = useState<'In-Person' | 'Virtual' | 'Group CADD'>('In-Person');
  const [formNotes, setFormNotes] = useState<string>('');

  const filteredEvents = calendarEvents.filter(e => {
    if (viewMode === 'day') return e.date === selectedDate;
    return true; // Simple filter for demo
  });

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const doc = doctors.find(d => d.id === formDoctorId);
    if (!doc) return;

    addCalendarEvent({
      doctorId: doc.id,
      doctorName: doc.name,
      doctorSpecialty: doc.specialty,
      hospital: doc.hospital,
      territory: doc.territory,
      date: selectedDate,
      time: formTime,
      type: formType,
      status: 'Scheduled',
      notes: formNotes,
      reminderSet: true
    });

    setIsAddModalOpen(false);
    setFormNotes('');
  };

  const handleAiAutoSchedule = () => {
    setIsAiScheduling(true);
    setTimeout(() => {
      // Find overdue doctors not in current day events
      const scheduledDocIds = calendarEvents.map(e => e.doctorId);
      const overdueDocs = doctors.filter(d => !scheduledDocIds.includes(d.id) && d.doctorClass === 'Class A');

      if (overdueDocs.length > 0) {
        const topDoc = overdueDocs[0];
        addCalendarEvent({
          doctorId: topDoc.id,
          doctorName: topDoc.name,
          doctorSpecialty: topDoc.specialty,
          hospital: topDoc.hospital,
          territory: topDoc.territory,
          date: selectedDate,
          time: '03:30 PM',
          type: 'In-Person',
          status: 'Scheduled',
          notes: 'AI Scheduled: Class A physician overdue for Call Visit.',
          reminderSet: true
        });
      }
      setIsAiScheduling(false);
    }, 800);
  };

  return (
    <div className="p-4 space-y-5 pb-24">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-5 rounded-2xl shadow-xl flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <CalendarIcon className="w-5 h-5 text-indigo-400" />
            <h1 className="text-2xl font-bold">Smart Calendar</h1>
          </div>
          <p className="text-xs text-slate-300 mt-1">AI-powered visit scheduling & reminder automation</p>
        </div>

        <button
          onClick={handleAiAutoSchedule}
          disabled={isAiScheduling}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-lg flex items-center space-x-1.5 border border-indigo-400/30 transition-all"
        >
          <Sparkles className={`w-3.5 h-3.5 ${isAiScheduling ? 'animate-spin' : ''}`} />
          <span>{isAiScheduling ? 'Optimizing...' : 'AI Schedule'}</span>
        </button>
      </div>

      {/* Mode & Date Selector */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            {(['day', 'week', 'month'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setViewMode(m)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                  viewMode === m ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3 py-1.5 rounded-xl shadow-sm flex items-center space-x-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Schedule Visit</span>
          </button>
        </div>

        {/* Date Navigator */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <button 
            onClick={() => setSelectedDate('2026-07-27')}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-xs font-bold text-slate-800">
            {selectedDate === '2026-07-28' ? 'Today, July 28, 2026' : selectedDate}
          </span>

          <button 
            onClick={() => setSelectedDate('2026-07-29')}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Events Timeline */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
          {viewMode === 'day' ? `Scheduled Visits (${filteredEvents.length})` : 'Upcoming Schedule'}
        </h2>

        {filteredEvents.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-2">
            <CalendarIcon className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs text-slate-500 font-medium">No visits scheduled for this selected date.</p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="text-xs text-indigo-600 font-bold hover:underline"
            >
              + Schedule First Visit
            </button>
          </div>
        ) : (
          filteredEvents.map((evt) => {
            const doc = doctors.find(d => d.id === evt.doctorId);
            return (
              <div
                key={evt.id}
                className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm hover:border-indigo-300 transition-all space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="bg-indigo-50 text-indigo-700 font-bold text-xs px-2.5 py-1 rounded-lg flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{evt.time}</span>
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      evt.type === 'In-Person' ? 'bg-emerald-100 text-emerald-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {evt.type}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateCalendarEvent({ ...evt, reminderSet: !evt.reminderSet })}
                      className={`p-1.5 rounded-lg text-xs transition-colors ${
                        evt.reminderSet ? 'text-amber-500 bg-amber-50' : 'text-slate-300 hover:text-slate-500'
                      }`}
                      title="Toggle Reminder"
                    >
                      <Bell className="w-3.5 h-3.5 fill-current" />
                    </button>
                    <button
                      onClick={() => deleteCalendarEvent(evt.id)}
                      className="p-1.5 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Cancel Event"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">{evt.doctorName}</h3>
                    <p className="text-xs text-slate-500">{evt.doctorSpecialty} • {evt.hospital}</p>
                  </div>
                </div>

                {evt.notes && (
                  <p className="text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-slate-600 italic">
                    "{evt.notes}"
                  </p>
                )}

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-medium">Territory: {evt.territory}</span>
                  {doc && (
                    <button
                      onClick={() => quickNavigateToRecordVisitWithDoctor(doc)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-semibold px-3 py-1 rounded-lg flex items-center space-x-1"
                    >
                      <span>Start Visit</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Schedule Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="font-bold text-slate-800 text-base">Schedule New Visit</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Physician</label>
                <select
                  value={formDoctorId}
                  onChange={e => setFormDoctorId(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-slate-50 font-medium text-slate-800"
                >
                  {doctors.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.specialty} • {d.doctorClass})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Time</label>
                  <input
                    type="text"
                    value={formTime}
                    onChange={e => setFormTime(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-slate-50 font-medium text-slate-800"
                    placeholder="10:00 AM"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Type</label>
                  <select
                    value={formType}
                    onChange={e => setFormType(e.target.value as any)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-slate-50 font-medium text-slate-800"
                  >
                    <option value="In-Person">In-Person</option>
                    <option value="Virtual">Virtual</option>
                    <option value="Group CADD">Group CADD</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Visit Objectives / Notes</label>
                <textarea
                  value={formNotes}
                  onChange={e => setFormNotes(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-slate-50 font-medium text-slate-800 h-20"
                  placeholder="Key detailing message, trial whitepaper presentation, or sample delivery..."
                />
              </div>

              <div className="pt-2 flex space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-1/2 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 shadow-md"
                >
                  Confirm Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
