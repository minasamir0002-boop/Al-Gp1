import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, FileText, CheckCircle, ShieldAlert, Award, Copy, Check, X, ArrowRight, Activity, BookOpen } from 'lucide-react';
import { Doctor } from '../../types';

interface MeetingPrepModalProps {
  doctor: Doctor;
  onClose: () => void;
}

export const MeetingPrepModal: React.FC<MeetingPrepModalProps> = ({ doctor, onClose }) => {
  const { quickNavigateToRecordVisitWithDoctor } = useApp();
  const [prepData, setPrepData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    const fetchPrep = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/ai/meeting-prep', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ doctor })
        });
        const data = await res.json();
        if (data.prep) {
          setPrepData(data.prep);
        }
      } catch (err) {
        console.error('Error fetching meeting prep:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPrep();
  }, [doctor]);

  const handleCopy = () => {
    if (!prepData) return;
    const text = `REP OS MEETING PREP: ${doctor.name}\nOpening: ${prepData.suggestedOpening}\nEvidence: ${prepData.clinicalEvidence}\nCompetitor: ${prepData.competitorComparison}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Sparkles className="w-5 h-5 fill-indigo-500/20" />
            </div>
            <div>
              <h2 className="font-bold text-slate-800 text-base">AI Meeting Preparation Dossier</h2>
              <p className="text-xs text-slate-500">{doctor.name} • {doctor.specialty}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isLoading ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs text-slate-500 font-medium">Generating AI Clinical Dossier & Objection Strategy...</p>
          </div>
        ) : prepData ? (
          <div className="space-y-4 text-xs">
            {/* Probability Gauge */}
            <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-4 rounded-xl flex items-center justify-between">
              <div>
                <div className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider">Conversion Outlook</div>
                <div className="text-lg font-extrabold text-emerald-400 mt-0.5">
                  {prepData.successProbability}% Success Probability
                </div>
              </div>
              <Activity className="w-8 h-8 text-indigo-400 opacity-80" />
            </div>

            {/* Doctor Profile Brief */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-1">
              <div className="font-bold text-slate-800 text-xs">Physician Persona & Practice Summary</div>
              <p className="text-slate-600 leading-relaxed">{prepData.doctorSummary}</p>
            </div>

            {/* Past Visits Summary */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-1">
              <div className="font-bold text-slate-800 text-xs">Previous Visit History Context</div>
              <p className="text-slate-600 leading-relaxed">{prepData.previousVisitsSummary}</p>
            </div>

            {/* Recommended Opening Statement */}
            <div className="bg-indigo-50/70 p-3.5 rounded-xl border border-indigo-200 space-y-1">
              <div className="font-bold text-indigo-900 text-xs flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Recommended Opening Line:</span>
              </div>
              <p className="text-slate-800 font-medium italic text-xs leading-relaxed">{prepData.suggestedOpening}</p>
            </div>

            {/* Clinical Evidence Citation */}
            <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200 space-y-1">
              <div className="font-bold text-emerald-900 text-xs flex items-center space-x-1">
                <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                <span>Primary Clinical Evidence Citation:</span>
              </div>
              <p className="text-emerald-950 font-medium">{prepData.clinicalEvidence}</p>
            </div>

            {/* Competitor Strategy */}
            <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200 space-y-1">
              <div className="font-bold text-amber-900 text-xs flex items-center space-x-1">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                <span>Competitor Defense Positioning:</span>
              </div>
              <p className="text-amber-950 font-medium">{prepData.competitorComparison}</p>
            </div>

            {/* Footer buttons */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <button
                onClick={handleCopy}
                className="px-3 py-2 border border-slate-200 text-slate-600 rounded-xl font-semibold flex items-center space-x-1 hover:bg-slate-50"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Brief'}</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  quickNavigateToRecordVisitWithDoctor(doctor);
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl shadow-md flex items-center space-x-1.5"
              >
                <span>Launch Active Visit</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <p className="text-xs text-rose-500 font-semibold text-center py-6">
            Failed to generate dossier. Please try again.
          </p>
        )}
      </div>
    </div>
  );
};
