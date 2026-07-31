import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Megaphone, Target, Award, Plus, CheckCircle2, ChevronRight, Sparkles, TrendingUp, Users } from 'lucide-react';
import { Campaign, Specialty, DoctorClass } from '../../types';

export const CampaignCenterView: React.FC = () => {
  const { campaigns, addCampaign, doctors, quickNavigateToRecordVisitWithDoctor } = useApp();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Form state
  const [formName, setFormName] = useState<string>('');
  const [formBrand, setFormBrand] = useState<string>('Cardiovasc XL');
  const [formSpecialty, setFormSpecialty] = useState<Specialty | 'All Specialties'>('Cardiology');
  const [formClass, setFormClass] = useState<DoctorClass | 'All Classes'>('Class A');
  const [formTargetCount, setFormTargetCount] = useState<number>(15);

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName) return;

    addCampaign({
      name: formName,
      brand: formBrand,
      targetSpecialty: formSpecialty,
      targetDoctorClass: formClass,
      targetCount: formTargetCount,
      completedVisits: 0,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      productsIncluded: [formBrand],
      doctorsIncludedIds: doctors.slice(0, formTargetCount).map(d => d.id),
      status: 'Active',
      aiRecommendation: `Target ${formClass} ${formSpecialty} physicians focusing on clinical trial superiority.`,
      effectivenessScore: 85,
      prescriptionImpact: '+15% commitment growth projected'
    });

    setIsModalOpen(false);
    setFormName('');
  };

  return (
    <div className="p-4 space-y-5 pb-24">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 rounded-2xl shadow-xl flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <Megaphone className="w-5 h-5 text-indigo-400" />
            <h1 className="text-2xl font-bold">Product Campaigns</h1>
          </div>
          <p className="text-xs text-slate-300 mt-1">Strategic product positioning, detailing goals & AI impact metrics</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-lg flex items-center space-x-1 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Campaign</span>
        </button>
      </div>

      {/* Campaigns Grid */}
      <div className="space-y-4">
        {campaigns.map((camp) => {
          const progressPercent = Math.min(100, Math.round((camp.completedVisits / camp.targetCount) * 100));
          return (
            <div
              key={camp.id}
              className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-3.5 hover:border-indigo-300 transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="bg-indigo-100 text-indigo-800 text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                      {camp.brand}
                    </span>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                      {camp.status}
                    </span>
                  </div>
                  <h2 className="font-bold text-slate-800 text-base mt-1">{camp.name}</h2>
                </div>

                <div className="text-right">
                  <div className="text-lg font-black text-indigo-600">{camp.effectivenessScore}</div>
                  <div className="text-[10px] text-slate-400 font-medium">AI Impact Score</div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>Progress Target ({camp.completedVisits}/{camp.targetCount} Calls)</span>
                  <span>{progressPercent}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
              </div>

              {/* AI Directive & Prescription Impact */}
              <div className="bg-indigo-50/60 p-3 rounded-xl border border-indigo-100 space-y-1.5">
                <div className="text-xs font-bold text-indigo-900 flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>AI Execution Strategy:</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">{camp.aiRecommendation}</p>
                <div className="text-xs font-bold text-emerald-700 pt-1 flex items-center space-x-1">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Expected Impact: {camp.prescriptionImpact}</span>
                </div>
              </div>

              {/* Target doctors preview */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center space-x-1">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>Target: {camp.targetSpecialty} ({camp.targetDoctorClass})</span>
                </div>

                <button
                  onClick={() => {
                    const matchedDoc = doctors.find(d => d.specialty === camp.targetSpecialty || camp.targetSpecialty === 'All Specialties');
                    if (matchedDoc) quickNavigateToRecordVisitWithDoctor(matchedDoc);
                  }}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
                >
                  <span>Execute Target Detailing</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal to create campaign */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="font-bold text-slate-800 text-base">Launch Product Campaign</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreateCampaign} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Campaign Title</label>
                <input
                  type="text"
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-slate-50 font-medium text-slate-800"
                  placeholder="e.g. Cardiovasc XL Q3 First-Line Push"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Brand Focus</label>
                <input
                  type="text"
                  value={formBrand}
                  onChange={e => setFormBrand(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-slate-50 font-medium text-slate-800"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Specialty</label>
                  <select
                    value={formSpecialty}
                    onChange={e => setFormSpecialty(e.target.value as any)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-slate-50 font-medium text-slate-800"
                  >
                    <option value="All Specialties">All Specialties</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Endocrinology">Endocrinology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Pulmonology">Pulmonology</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Tier</label>
                  <select
                    value={formClass}
                    onChange={e => setFormClass(e.target.value as any)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-slate-50 font-medium text-slate-800"
                  >
                    <option value="All Classes">All Classes</option>
                    <option value="Class A">Class A</option>
                    <option value="Class B">Class B</option>
                    <option value="Class C">Class C</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Call Volume</label>
                <input
                  type="number"
                  value={formTargetCount}
                  onChange={e => setFormTargetCount(Number(e.target.value))}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-slate-50 font-medium text-slate-800"
                  min={1}
                />
              </div>

              <div className="pt-2 flex space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/2 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 shadow-md"
                >
                  Launch Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
