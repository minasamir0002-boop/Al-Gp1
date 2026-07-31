import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Award, Target, Zap, ShieldCheck, HeartPulse, User, Settings, Check, ChevronRight, BarChart2, Edit, RefreshCw, AlertTriangle, X, Database, Cpu } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, AreaChart, Area } from 'recharts';
import { AIConfigurationSection } from '../AI/AIConfigurationSection';

export const ProfileView: React.FC = () => {
  const { repProfile, updateRepProfile, resetDbToDefaults } = useApp();

  const [activeTab, setActiveTab] = useState<'stats' | 'settings' | 'ai_settings'>('stats');
  const [aiCoachAggressiveness, setAiCoachAggressiveness] = useState<'Standard' | 'Proactive' | 'Challenger'>('Proactive');
  const [offlineSync, setOfflineSync] = useState<boolean>(true);

  // Edit Profile State
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [editedName, setEditedName] = useState<string>(repProfile.name);
  const [editedTitle, setEditedTitle] = useState<string>(repProfile.title);
  const [editedTerritory, setEditedTerritory] = useState<string>(repProfile.territory);
  const [editedEmployeeId, setEditedEmployeeId] = useState<string>(repProfile.employeeId);
  const [editedTargetVisits, setEditedTargetVisits] = useState<number>(repProfile.monthlyTargetVisits);

  // Reset Confirmation State
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  const monthlyPerformanceData = [
    { month: 'Mar', actual: 68, target: 70 },
    { month: 'Apr', actual: 72, target: 70 },
    { month: 'May', actual: 74, target: 75 },
    { month: 'Jun', actual: 70, target: 75 },
    { month: 'Jul', actual: 64, target: 75 }
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateRepProfile({
      name: editedName.trim(),
      title: editedTitle.trim(),
      territory: editedTerritory.trim(),
      employeeId: editedEmployeeId.trim(),
      monthlyTargetVisits: editedTargetVisits || 75
    });
    setIsEditingProfile(false);
  };

  return (
    <div className="space-y-4 pb-20 pt-2 px-3 sm:px-4 max-w-5xl mx-auto text-left">
      {/* Top Banner & Profile Header */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white rounded-3xl p-5 shadow-xl border border-blue-900/40">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <img
              src={repProfile.avatar}
              alt={repProfile.name}
              className="w-20 h-20 rounded-3xl object-cover border-4 border-blue-500/40 shadow-lg"
            />
            <div className="space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-xl font-black text-white">{repProfile.name}</h1>
                <span className="text-[10px] font-extrabold bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2.5 py-0.5 rounded-full">
                  {repProfile.rank}
                </span>
              </div>
              <p className="text-xs font-semibold text-blue-300">{repProfile.title} • {repProfile.territory}</p>
              <p className="text-[11px] text-slate-400">ID: {repProfile.employeeId} • RepOS AI Enabled</p>
            </div>
          </div>

          <button
            onClick={() => setIsEditingProfile(true)}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 flex items-center gap-1.5 transition-colors self-center sm:self-start"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-1.5 rounded-xl transition-colors ${
              activeTab === 'stats' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Performance & KPIs
          </button>
          <button
            onClick={() => setActiveTab('ai_settings')}
            className={`px-4 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 ${
              activeTab === 'ai_settings' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-amber-400" />
            <span>Gemini AI & MVP Settings</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-1.5 rounded-xl transition-colors ${
              activeTab === 'settings' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            App Settings
          </button>
        </div>
      </div>

      {activeTab === 'stats' ? (
        <>
          {/* KPI Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-sm text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Coverage</span>
              <span className="text-2xl font-black text-slate-900">{repProfile.coverageKpi}%</span>
              <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">Top 5% Region</span>
            </div>

            <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-sm text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Frequency</span>
              <span className="text-2xl font-black text-slate-900">{repProfile.frequencyKpi}x</span>
              <span className="text-[10px] text-slate-500 font-medium block mt-0.5">Visits / Physician</span>
            </div>

            <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-sm text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">This Month</span>
              <span className="text-2xl font-black text-slate-900">{repProfile.completedVisitsThisMonth}</span>
              <span className="text-[10px] text-slate-500 font-medium block mt-0.5">Target: {repProfile.monthlyTargetVisits}</span>
            </div>

            <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-sm text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Physicians</span>
              <span className="text-2xl font-black text-slate-900">{repProfile.doctorsInTerritory}</span>
              <span className="text-[10px] text-purple-700 font-bold block mt-0.5">Central District</span>
            </div>
          </div>

          {/* Performance Chart */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-2">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <BarChart2 className="w-4 h-4 text-blue-600" /> Monthly Visit Execution Trends
            </h3>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyPerformanceData}>
                  <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip />
                  <Area type="monotone" dataKey="actual" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.15} strokeWidth={2} />
                  <Area type="monotone" dataKey="target" stroke="#94a3b8" fill="none" strokeDasharray="3 3" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Achievements & Badges */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" /> Earned Performance Badges
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {repProfile.badges.map((b, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm shrink-0">
                    🏆
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">{b.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : activeTab === 'ai_settings' ? (
        <AIConfigurationSection />
      ) : (
        /* Settings View */
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm space-y-4 text-xs">
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
            <Settings className="w-4 h-4 text-blue-600" /> RepOS System Configuration
          </h3>

          {/* Quick link to Gemini AI Configuration */}
          <div className="p-3.5 bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-amber-300">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <span className="font-extrabold text-white block text-xs">Google Gemini AI & MVP System Settings</span>
                <span className="text-[11px] text-blue-200">Configure your local API Key and model parameters</span>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('ai_settings')}
              className="px-3.5 py-1.5 rounded-xl bg-white text-blue-900 hover:bg-blue-50 font-black text-xs transition-colors shrink-0"
            >
              Open AI Config
            </button>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <label className="font-bold text-slate-700 block mb-1">AI Coach Aggressiveness</label>
              <div className="grid grid-cols-3 gap-2">
                {(['Standard', 'Proactive', 'Challenger'] as const).map(mode => (
                  <button
                    key={mode}
                    onClick={() => setAiCoachAggressiveness(mode)}
                    className={`py-2 rounded-xl font-bold transition-all border ${
                      aiCoachAggressiveness === mode
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <span className="font-bold text-slate-900 block">Offline Visit Sync</span>
                <span className="text-[11px] text-slate-500">Cache visit recordings locally when connection drops</span>
              </div>
              <input
                type="checkbox"
                checked={offlineSync}
                onChange={(e) => setOfflineSync(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
            </div>

            {/* Local Database Management */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <span className="font-extrabold text-slate-900 block text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Database className="w-4 h-4 text-slate-600" /> Database Management
              </span>
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/80 flex items-center justify-between">
                <div>
                  <span className="font-bold text-amber-950 block">Local Storage Database Active</span>
                  <span className="text-[11px] text-amber-800">All physicians, visits, products and notes persist locally.</span>
                </div>
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs flex items-center gap-1 transition-colors shrink-0"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset Database</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Representative Profile Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 space-y-4 shadow-2xl border border-slate-200 text-left my-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">Edit Representative Profile</h3>
                <p className="text-xs text-slate-500">Update your officer identity and territory targets</p>
              </div>
              <button
                onClick={() => setIsEditingProfile(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Representative Full Name</label>
                <input
                  type="text"
                  required
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Title / Designation</label>
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Employee ID</label>
                  <input
                    type="text"
                    value={editedEmployeeId}
                    onChange={(e) => setEditedEmployeeId(e.target.value)}
                    className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Territory</label>
                  <input
                    type="text"
                    value={editedTerritory}
                    onChange={(e) => setEditedTerritory(e.target.value)}
                    className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Monthly Target Visits</label>
                  <input
                    type="number"
                    value={editedTargetVisits}
                    onChange={(e) => setEditedTargetVisits(parseInt(e.target.value) || 75)}
                    className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white font-extrabold rounded-xl shadow-md"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Database Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 text-left shadow-2xl border border-slate-200">
            <div className="flex items-center gap-3 text-amber-600">
              <div className="p-3 bg-amber-100 rounded-2xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Reset Local Database?</h3>
                <p className="text-xs text-slate-500">Restore default sample physicians, visits, and products.</p>
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              This will reset all local database tables back to default seed records. Any newly created doctors or visit logs will be replaced.
            </p>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 text-xs">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetDbToDefaults();
                  setShowResetConfirm(false);
                }}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold shadow-md"
              >
                Reset Database
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
