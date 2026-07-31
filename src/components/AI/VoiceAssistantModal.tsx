import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Mic, MicOff, Sparkles, CheckCircle2, Volume2, X, ArrowRight, FileText } from 'lucide-react';

export const VoiceAssistantModal: React.FC = () => {
  const { isVoiceAssistantOpen, setIsVoiceAssistantOpen, doctors, addVisit, setActiveTab } = useApp();
  const [isListening, setIsListening] = useState<boolean>(false);
  const [spokenText, setSpokenText] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [parsedResult, setParsedResult] = useState<any>(null);

  if (!isVoiceAssistantOpen) return null;

  const handleStartListening = () => {
    setIsListening(true);
    setSpokenText('');
    setParsedResult(null);

    // Simulate real-time speech-to-text transcript
    setTimeout(() => {
      setSpokenText("Visited Dr. Sarah Miller at St. Jude Heart Institute. Detailed Cardiovasc XL 100mg and GlycaNorm Dual. Dr. Miller confirmed positive feedback on once-daily dosing. Handed 5 sample boxes of Cardiovasc XL. Promised to bring REPOS-3 trial renal sub-analysis whitepaper next week.");
      setIsListening(false);
    }, 2500);
  };

  const handleAnalyzeAndSave = async () => {
    if (!spokenText.trim()) return;
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/ai/voice-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          spokenText,
          availableDoctors: doctors.map(d => ({ id: d.id, name: d.name, specialty: d.specialty }))
        })
      });
      const data = await res.json();
      if (data.parsedVisit) {
        setParsedResult(data.parsedVisit);
      }
    } catch (err) {
      console.error('Error parsing voice assistant text:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCommitVisitToDb = () => {
    if (!parsedResult) return;

    const matchedDoc = doctors.find(d => d.id === parsedResult.doctorId || d.name === parsedResult.doctorName) || doctors[0];

    addVisit({
      id: `visit-${Date.now()}`,
      doctorId: matchedDoc.id,
      doctorName: matchedDoc.name,
      doctorSpecialty: matchedDoc.specialty,
      date: parsedResult.date || new Date().toISOString().split('T')[0],
      time: parsedResult.time || '10:00 AM',
      durationMinutes: 15,
      notes: parsedResult.notes,
      aiSummary: parsedResult.aiSummary,
      productsDiscussed: parsedResult.productsDiscussed || [{ productName: 'Cardiovasc XL', reaction: 'Positive' }],
      objectionsCaptured: parsedResult.objectionsCaptured || [],
      samplesGiven: parsedResult.samplesGiven || [],
      followUpTask: parsedResult.followUpTask,
      nextFollowUpDate: parsedResult.nextFollowUpDate
    });

    setIsVoiceAssistantOpen(false);
    setActiveTab('visits');
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-800 text-base">AI Voice Visit Assistant</h2>
              <p className="text-xs text-slate-500">Dictate your visit report and auto-populate structured records</p>
            </div>
          </div>
          <button onClick={() => setIsVoiceAssistantOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Listening / Microphone Button Area */}
        <div className="text-center py-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
          <button
            onClick={handleStartListening}
            disabled={isListening}
            className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center shadow-lg transition-all ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse ring-8 ring-rose-200'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:scale-105'
            }`}
          >
            {isListening ? <Volume2 className="w-8 h-8 animate-bounce" /> : <Mic className="w-8 h-8" />}
          </button>
          
          <div className="text-xs font-semibold text-slate-600">
            {isListening ? '🎙️ Listening... Speak your call report now' : 'Tap Microphone to Speak Call Report'}
          </div>
        </div>

        {/* Spoken Text Transcript Box */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Spoken Voice Transcript</label>
          <textarea
            value={spokenText}
            onChange={e => setSpokenText(e.target.value)}
            className="w-full text-xs p-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 font-medium h-24"
            placeholder="e.g. Visited Dr. Chen. Discussed GlycaNorm Dual. Doctor requested copay vouchers and handed 3 sample packs..."
          />
        </div>

        {!parsedResult && (
          <button
            onClick={handleAnalyzeAndSave}
            disabled={isAnalyzing || !spokenText.trim()}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center space-x-1.5 disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? 'AI Parsing Call Report...' : 'Process Voice Report with Gemini'}</span>
          </button>
        )}

        {/* Parsed Result Preview */}
        {parsedResult && (
          <div className="bg-emerald-50/80 border border-emerald-200 p-4 rounded-xl space-y-2 text-xs">
            <div className="flex items-center space-x-1.5 text-emerald-800 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Parsed Structured Visit Entry</span>
            </div>

            <div className="bg-white p-2.5 rounded-lg border border-emerald-100 space-y-1">
              <div><span className="font-bold text-slate-700">Doctor:</span> {parsedResult.doctorName}</div>
              <div><span className="font-bold text-slate-700">AI Summary:</span> {parsedResult.aiSummary}</div>
              <div><span className="font-bold text-slate-700">Follow-up Task:</span> {parsedResult.followUpTask}</div>
            </div>

            <button
              onClick={handleCommitVisitToDb}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md flex items-center justify-center space-x-1 transition-colors"
            >
              <span>Save & Commit to Database</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
