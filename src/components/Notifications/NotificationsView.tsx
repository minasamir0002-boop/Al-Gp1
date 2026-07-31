import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, AlertCircle, CheckCircle, ShieldAlert, Sparkles, Filter, Check, ArrowRight, UserCheck } from 'lucide-react';
import { SmartNotification } from '../../types';

export const NotificationsView: React.FC = () => {
  const { notifications, markNotificationAsRead, setActiveTab, setSelectedDoctorForVisit, doctors } = useApp();
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const categories = ['All', 'High Urgency', 'Doctor Overdue', 'Competitor Alert', 'Clinical Update'];

  const filtered = notifications.filter(n => {
    if (filterCategory === 'High Urgency') return n.urgency === 'High';
    if (filterCategory !== 'All') return n.category === filterCategory;
    return true;
  });

  const handleNotificationAction = (notif: SmartNotification) => {
    markNotificationAsRead(notif.id);

    if (notif.doctorId) {
      const doc = doctors.find(d => d.id === notif.doctorId);
      if (doc) {
        setSelectedDoctorForVisit(doc);
        setActiveTab('record-visit');
        return;
      }
    }

    if (notif.actionType === 'ViewCampaign') {
      setActiveTab('campaigns');
    } else if (notif.actionType === 'Schedule') {
      setActiveTab('calendar');
    } else {
      setActiveTab('doctors');
    }
  };

  return (
    <div className="p-4 space-y-5 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-5 rounded-2xl shadow-xl flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-indigo-400 fill-indigo-400" />
            <h1 className="text-2xl font-bold">Smart Alerts</h1>
          </div>
          <p className="text-xs text-slate-300 mt-1">Autonomous risk alerts, overdue warnings & clinical updates</p>
        </div>

        <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold px-3 py-1 rounded-full">
          {notifications.filter(n => !n.isRead).length} Unread
        </span>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              filterCategory === cat
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-2">
            <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto" />
            <p className="text-xs text-slate-500 font-medium">No active alerts matching your filter.</p>
          </div>
        ) : (
          filtered.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 rounded-2xl border transition-all ${
                !notif.isRead 
                  ? 'bg-white border-indigo-200 shadow-md ring-1 ring-indigo-100' 
                  : 'bg-slate-50/80 border-slate-200 opacity-80'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    notif.urgency === 'High' ? 'bg-rose-500 animate-pulse' : notif.urgency === 'Medium' ? 'bg-amber-500' : 'bg-blue-500'
                  }`}></span>
                  <span className="text-xs font-bold text-slate-800">{notif.category}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">{notif.date}</span>
              </div>

              <h3 className="font-bold text-slate-800 text-sm mb-1">{notif.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">{notif.message}</p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                {!notif.isRead ? (
                  <button
                    onClick={() => markNotificationAsRead(notif.id)}
                    className="text-[11px] text-slate-500 hover:text-slate-800 font-medium flex items-center space-x-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Mark as Read</span>
                  </button>
                ) : (
                  <span className="text-[10px] text-slate-400">Read</span>
                )}

                <button
                  onClick={() => handleNotificationAction(notif)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm flex items-center space-x-1 transition-colors"
                >
                  <span>Resolve / Execute Action</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
