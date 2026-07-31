import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Visit } from '../../types';
import {
  Mic,
  MicOff,
  Sparkles,
  Save,
  Calendar,
  Clock,
  Check,
  AlertCircle,
  Plus,
  Minus,
  FileText,
  CheckCircle2,
  Zap,
  Play,
  Pause,
  Square,
  Trash2,
  RotateCcw,
  Volume2,
  User,
  Package,
  Award,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  MessageSquare,
  Sparkle
} from 'lucide-react';
import { AfterVisitAnalysisModal } from '../AI/AfterVisitAnalysisModal';
import { PreVisitCoachModal } from '../AI/PreVisitCoachModal';

export const RecordVisitView: React.FC = () => {
  const {
    doctors,
    selectedDoctorForVisit,
    setSelectedDoctorForVisit,
    products,
    addVisit,
    setActiveTab
  } = useApp();

  // Mode Selection: 'voice' | 'manual' | 'quick'
  const [recordingMode, setRecordingMode] = useState<'voice' | 'manual' | 'quick'>('manual');

  // Common Required Form State
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(
    selectedDoctorForVisit ? selectedDoctorForVisit.id : (doctors[0]?.id || '')
  );
  const [visitDate, setVisitDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [visitTime, setVisitTime] = useState<string>(
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  );
  const [visitDurationMinutes, setVisitDurationMinutes] = useState<number>(15);

  // Products & Reactions (Required)
  const [selectedProducts, setSelectedProducts] = useState<
    { productName: string; reaction: 'Positive' | 'Neutral' | 'Hesitant' }[]
  >([{ productName: products[0]?.name || 'Cardiovasc XL', reaction: 'Positive' }]);

  // Manual Entry Detailed Fields
  const [callObjective, setCallObjective] = useState<string>(
    'Detail REPOS-3 trial renal sub-analysis & secure Cardiovasc XL trial cohort.'
  );
  const [discussionNotes, setDiscussionNotes] = useState<string>('');
  const [objections, setObjections] = useState<string[]>([]);
  const [newObjectionInput, setNewObjectionInput] = useState<string>('');
  const [competitorBrand, setCompetitorBrand] = useState<string>('');
  const [competitorClaim, setCompetitorClaim] = useState<string>('');
  const [samplesGiven, setSamplesGiven] = useState<
    { productName: string; quantity: number; batchNo: string }[]
  >([]);
  const [commitment, setCommitment] = useState<
    'Confirmed Commitment' | 'High Potential' | 'Medium Potential' | 'Low Potential'
  >('High Potential');
  const [followUpDate, setFollowUpDate] = useState<string>(
    new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
  );
  const [visitType, setVisitType] = useState<'In-Person' | 'Virtual' | 'Group CADD'>('In-Person');

  // Quick Visit Form Fields
  const [quickProduct, setQuickProduct] = useState<string>(products[0]?.name || 'Cardiovasc XL');
  const [quickVisitResult, setQuickVisitResult] = useState<string>('Positive Detail & Sample Handout');
  const [quickNextVisitDate, setQuickNextVisitDate] = useState<string>(
    new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]
  );

  // Voice Recording Audio Engine State
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [hasRecordedAudio, setHasRecordedAudio] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [audioPlaybackTime, setAudioPlaybackTime] = useState<number>(0);
  const [isProcessingVoiceAi, setIsProcessingVoiceAi] = useState<boolean>(false);
  const [mockTranscript, setMockTranscript] = useState<string>('');

  // Validation State
  const [validationError, setValidationError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [savedVisitForAnalysis, setSavedVisitForAnalysis] = useState<Visit | null>(null);
  const [isCoachOpen, setIsCoachOpen] = useState<boolean>(false);

  // Timer Ref for recording
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const playbackIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (selectedDoctorForVisit) {
      setSelectedDoctorId(selectedDoctorForVisit.id);
    }
  }, [selectedDoctorForVisit]);

  // Voice Recording Timer Effect
  useEffect(() => {
    if (isRecording && !isPaused) {
      recordingIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
    }

    return () => {
      if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
    };
  }, [isRecording, isPaused]);

  // Audio Playback Simulation Effect
  useEffect(() => {
    if (isPlayingAudio) {
      playbackIntervalRef.current = setInterval(() => {
        setAudioPlaybackTime((prev) => {
          if (prev >= recordingSeconds) {
            setIsPlayingAudio(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (playbackIntervalRef.current) clearInterval(playbackIntervalRef.current);
    }

    return () => {
      if (playbackIntervalRef.current) clearInterval(playbackIntervalRef.current);
    };
  }, [isPlayingAudio, recordingSeconds]);

  const activeDoctor = doctors.find((d) => d.id === selectedDoctorId);

  // Voice Recording Control Handlers
  const handleStartRecording = () => {
    setIsRecording(true);
    setIsPaused(false);
    setHasRecordedAudio(false);
    setAudioPlaybackTime(0);
    if (recordingSeconds === 0) {
      setRecordingSeconds(1);
    }
  };

  const handlePauseRecording = () => {
    setIsPaused((prev) => !prev);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setIsPaused(false);
    setHasRecordedAudio(true);

    // Auto-trigger Mock AI Transcription & Processing
    processMockVoiceTranscription();
  };

  const handleDeleteRecording = () => {
    setIsRecording(false);
    setIsPaused(false);
    setRecordingSeconds(0);
    setHasRecordedAudio(false);
    setIsPlayingAudio(false);
    setAudioPlaybackTime(0);
    setMockTranscript('');
  };

  const handleTogglePlayback = () => {
    if (!hasRecordedAudio) return;
    setIsPlayingAudio((prev) => !prev);
  };

  const processMockVoiceTranscription = async () => {
    setIsProcessingVoiceAi(true);

    // Simulate AI voice recognition delay
    setTimeout(() => {
      const simulatedText = `Visited Dr. ${activeDoctor?.name || 'Miller'} at ${
        activeDoctor?.hospital || 'Central Clinic'
      }. Discussed Cardiovasc XL 100mg and REPOS-3 trial renal outcome data. Doctor expressed concern regarding co-pay tiering and requested 5 sample boxes. Competitor Entresto rep visited earlier. Doctor agreed to trial Cardiovasc XL on 5 new hypertensive patients.`;

      setMockTranscript(simulatedText);
      setDiscussionNotes(simulatedText);
      setObjections(['Co-pay tiering and patient out-of-pocket expense']);
      setCompetitorBrand('Entresto');
      setCompetitorClaim('Co-pay card promotion offered by competitor rep');
      setCommitment('Confirmed Commitment');
      setSamplesGiven([
        {
          productName: products[0]?.name || 'Cardiovasc XL',
          quantity: 5,
          batchNo: 'LOT-CV9021'
        }
      ]);
      setIsProcessingVoiceAi(false);
    }, 1200);
  };

  // Product Selection Handlers for Manual Form
  const toggleProductSelection = (productName: string) => {
    setSelectedProducts((prev) => {
      const exists = prev.find((p) => p.productName === productName);
      if (exists) {
        // Don't allow empty if it's the last selected item in manual mode
        if (prev.length === 1) return prev;
        return prev.filter((p) => p.productName !== productName);
      } else {
        return [...prev, { productName, reaction: 'Positive' }];
      }
    });
  };

  const updateProductReaction = (
    productName: string,
    reaction: 'Positive' | 'Neutral' | 'Hesitant'
  ) => {
    setSelectedProducts((prev) =>
      prev.map((p) => (p.productName === productName ? { ...p, reaction } : p))
    );
  };

  const updateSampleQuantity = (productName: string, delta: number) => {
    setSamplesGiven((prev) => {
      const existing = prev.find((s) => s.productName === productName);
      if (existing) {
        const newQty = Math.max(0, existing.quantity + delta);
        if (newQty === 0) return prev.filter((s) => s.productName !== productName);
        return prev.map((s) => (s.productName === productName ? { ...s, quantity: newQty } : s));
      } else if (delta > 0) {
        return [
          ...prev,
          {
            productName,
            quantity: delta,
            batchNo: `LOT-${productName.substring(0, 2).toUpperCase()}2026`
          }
        ];
      }
      return prev;
    });
  };

  const handleAddObjection = () => {
    if (newObjectionInput.trim()) {
      setObjections((prev) => Array.from(new Set([...prev, newObjectionInput.trim()])));
      setNewObjectionInput('');
    }
  };

  // Format seconds into MM:SS
  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Save Visit Validation & Execution
  const handleSaveVisit = () => {
    setValidationError(null);

    // Validation Check: Required fields are Doctor, Date, Product
    if (!selectedDoctorId) {
      setValidationError('Please select a Doctor for this visit.');
      return;
    }

    if (!visitDate) {
      setValidationError('Please enter a valid Visit Date.');
      return;
    }

    if (recordingMode === 'quick') {
      if (!quickProduct) {
        setValidationError('Please select a Product for the visit.');
        return;
      }
    } else {
      if (selectedProducts.length === 0) {
        setValidationError('Please select at least one Product discussed during the visit.');
        return;
      }
    }

    if (!activeDoctor) {
      setValidationError('Selected doctor could not be found.');
      return;
    }

    // Construct Visit Object
    let newVisit: Visit;

    if (recordingMode === 'quick') {
      newVisit = {
        id: `vis-${Date.now()}`,
        doctorId: activeDoctor.id,
        doctorName: activeDoctor.name,
        doctorSpecialty: activeDoctor.specialty,
        doctorHospital: activeDoctor.hospital,
        date: visitDate,
        time: visitTime || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        durationMinutes: 5,
        type: 'In-Person',
        status: 'Completed',
        notes: `[Quick Visit Entry] Result: ${quickVisitResult}. Product: ${quickProduct}.`,
        aiSummary: `Quick detail completed with ${activeDoctor.name}. Presented ${quickProduct} with result: ${quickVisitResult}.`,
        productsDiscussed: [{ productName: quickProduct, reaction: 'Positive' }],
        samplesGiven: [],
        objectionsCaptured: [],
        nextFollowUpDate: quickNextVisitDate,
        followUpTask: `Follow up visit with ${activeDoctor.name} on ${quickProduct}.`
      };
    } else {
      // Manual / Voice Recording Visit
      newVisit = {
        id: `vis-${Date.now()}`,
        doctorId: activeDoctor.id,
        doctorName: activeDoctor.name,
        doctorSpecialty: activeDoctor.specialty,
        doctorHospital: activeDoctor.hospital,
        date: visitDate,
        time: visitTime || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        durationMinutes: visitDurationMinutes,
        type: visitType,
        status: 'Completed',
        objectives: callObjective,
        notes: callObjective
          ? `[Call Objective: ${callObjective}]\n${discussionNotes || 'Visit logged in RepOS.'}`
          : discussionNotes || 'Visit logged in RepOS.',
        aiTranscript: mockTranscript || undefined,
        aiSummary:
          mockTranscript ||
          `Completed visit with ${activeDoctor.name}. Discussed ${selectedProducts
            .map((p) => p.productName)
            .join(', ')}. Commitment level: ${commitment}.`,
        audioDurationSeconds: recordingSeconds > 0 ? recordingSeconds : undefined,
        productsDiscussed: selectedProducts,
        samplesGiven,
        objectionsCaptured: objections,
        competitorMentioned: competitorBrand
          ? { brand: competitorBrand, claim: competitorClaim }
          : undefined,
        nextFollowUpDate: followUpDate,
        followUpTask: `Follow up with ${activeDoctor.name} regarding commitments and trial outcomes.`,
        prescriptionPotential: commitment
      };
    }

    // Save visit: automatically updates Visit History, Doctor Timeline, and Dashboard Counters
    addVisit(newVisit);
    setSaveSuccess(true);
    setSavedVisitForAnalysis(newVisit);
  };

  return (
    <div className="space-y-4 pb-20 pt-2 px-3 sm:px-4 max-w-3xl mx-auto text-left">
      {/* Top Smart Visit Recording Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-5 shadow-xl border border-blue-800/40 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-500/30 text-blue-200 border border-blue-400/30">
                RepOS Intelligence
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
                Full-Screen Workflow
              </span>
            </div>
            <h1 className="text-xl font-black tracking-tight mt-1">Smart Visit Recording</h1>
            <p className="text-xs text-blue-200 mt-0.5">
              Record doctor details via Voice, Manual Entry, or Quick Visit.
            </p>
          </div>

          {activeDoctor && (
            <button
              onClick={() => setIsCoachOpen(true)}
              className="px-3.5 py-2 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold text-xs flex items-center gap-1.5 shadow-md self-start sm:self-auto shrink-0 transition-transform active:scale-95"
            >
              <Zap className="w-4 h-4 fill-slate-900 text-slate-900" />
              <span>AI Pre-Visit Coach</span>
            </button>
          )}
        </div>

        {/* 3 Recording Options Tab Bar */}
        <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setRecordingMode('voice')}
            className={`py-2.5 px-3 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition-all ${
              recordingMode === 'voice'
                ? 'bg-white text-blue-900 shadow-lg scale-[1.02]'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Mic className="w-4 h-4 text-rose-500" />
            <span>Voice Recording</span>
          </button>

          <button
            type="button"
            onClick={() => setRecordingMode('manual')}
            className={`py-2.5 px-3 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition-all ${
              recordingMode === 'manual'
                ? 'bg-white text-blue-900 shadow-lg scale-[1.02]'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <FileText className="w-4 h-4 text-blue-600" />
            <span>Manual Entry</span>
          </button>

          <button
            type="button"
            onClick={() => setRecordingMode('quick')}
            className={`py-2.5 px-3 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition-all ${
              recordingMode === 'quick'
                ? 'bg-white text-blue-900 shadow-lg scale-[1.02]'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Quick Visit</span>
          </button>
        </div>
      </div>

      {/* Validation Error Banner */}
      {validationError && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2.5 shadow-sm animate-shake">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Save Success Banner */}
      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500 text-white font-bold text-xs flex items-center justify-between shadow-lg animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-white" />
            <span>Visit saved successfully! History, Timeline, & Dashboard updated.</span>
          </div>
          <button
            onClick={() => setActiveTab('visits')}
            className="px-3 py-1 bg-white text-emerald-900 rounded-xl font-extrabold text-[11px] hover:bg-emerald-50"
          >
            View History
          </button>
        </div>
      )}

      {/* Voice Recording Workflow Screen */}
      {recordingMode === 'voice' && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-md space-y-5">
          {/* Doctor Selection */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Select Physician <span className="text-rose-500">*</span>
            </label>
            <select
              value={selectedDoctorId}
              onChange={(e) => {
                setSelectedDoctorId(e.target.value);
                setSelectedDoctorForVisit(doctors.find((d) => d.id === e.target.value) || null);
              }}
              className="w-full bg-slate-50 text-slate-900 text-xs font-bold rounded-xl p-3 border border-slate-200 focus:outline-none focus:border-blue-500"
            >
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.specialty} • {d.hospital})
                </option>
              ))}
            </select>
          </div>

          {/* Voice Console Sizing & Animation Canvas */}
          <div className="p-6 rounded-3xl bg-slate-950 text-white flex flex-col items-center justify-center text-center relative overflow-hidden space-y-4">
            <div className="text-slate-400 text-xs font-semibold uppercase tracking-widest flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isRecording ? 'bg-rose-500 animate-ping' : 'bg-blue-400'}`} />
              {isRecording ? (isPaused ? 'Recording Paused' : 'Live Voice Recording') : (hasRecordedAudio ? 'Voice Recorded' : 'Tap Record to Speak Visit Notes')}
            </div>

            {/* Timer Counter */}
            <div className="text-4xl font-mono font-black text-amber-300">
              {formatTime(recordingSeconds)}
            </div>

            {/* Live Waveform Indicator */}
            <div className="flex items-center justify-center gap-1.5 h-10 my-2">
              {[40, 70, 30, 90, 60, 100, 50, 80, 40, 95, 60, 30, 85, 50].map((h, idx) => (
                <div
                  key={idx}
                  style={{ height: isRecording && !isPaused ? `${h}%` : '20%' }}
                  className={`w-1.5 rounded-full transition-all duration-200 ${
                    isRecording && !isPaused ? 'bg-rose-500' : 'bg-slate-700'
                  }`}
                />
              ))}
            </div>

            {/* Voice Control Buttons Toolbar */}
            <div className="flex items-center justify-center gap-3 pt-2">
              {!isRecording ? (
                <button
                  type="button"
                  onClick={handleStartRecording}
                  className="px-6 py-3 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-rose-600/40 transition-all hover:scale-105"
                >
                  <Mic className="w-5 h-5" />
                  <span>{hasRecordedAudio ? 'Record Again' : 'Record Voice'}</span>
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handlePauseRecording}
                    className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs flex items-center justify-center border border-slate-700"
                    title={isPaused ? 'Resume' : 'Pause'}
                  >
                    {isPaused ? <Play className="w-5 h-5 fill-amber-400" /> : <Pause className="w-5 h-5" />}
                  </button>

                  <button
                    type="button"
                    onClick={handleStopRecording}
                    className="px-5 py-3 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs flex items-center gap-2 border border-slate-700 shadow"
                  >
                    <Square className="w-4 h-4 text-rose-400 fill-rose-400" />
                    <span>Stop & Process</span>
                  </button>
                </>
              )}

              {hasRecordedAudio && (
                <>
                  <button
                    type="button"
                    onClick={handleTogglePlayback}
                    className="p-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center shadow"
                    title={isPlayingAudio ? 'Pause Playback' : 'Play Audio'}
                  >
                    {isPlayingAudio ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
                  </button>

                  <button
                    type="button"
                    onClick={handleDeleteRecording}
                    className="p-3 rounded-full bg-slate-800 hover:bg-rose-950 text-rose-400 border border-slate-700 font-bold text-xs"
                    title="Delete Recording"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Playback Audio Scrubber */}
            {hasRecordedAudio && (
              <div className="w-full max-w-md pt-2 space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Volume2 className="w-3.5 h-3.5 text-blue-400" /> Voice Playback
                  </span>
                  <span>
                    {formatTime(audioPlaybackTime)} / {formatTime(recordingSeconds)}
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-500 h-full transition-all duration-300"
                    style={{
                      width: recordingSeconds > 0 ? `${(audioPlaybackTime / recordingSeconds) * 100}%` : '0%'
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* AI Processing Indicator */}
          {isProcessingVoiceAi && (
            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-bold flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-indigo-600 animate-spin" />
              <div>
                <p className="font-extrabold text-indigo-950">AI Processing Voice Audio...</p>
                <p className="text-[11px] text-indigo-700 font-normal">
                  Transcribing speech and extracting doctor sentiment, objections, products, and commitments.
                </p>
              </div>
            </div>
          )}

          {/* AI Mock Transcript & Auto-Extracted Details */}
          {mockTranscript && !isProcessingVoiceAi && (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <span className="font-black text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-600" /> AI Auto-Generated Visit Transcript
                </span>
                <p className="text-slate-700 leading-relaxed bg-white p-3 rounded-xl border border-slate-200 font-medium">
                  "{mockTranscript}"
                </p>
              </div>

              {/* Products Auto-Selected */}
              <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/80 text-xs space-y-2">
                <span className="font-bold text-blue-900 block">Products & Quantities Extracted:</span>
                <div className="flex flex-wrap gap-2">
                  {selectedProducts.map((p) => (
                    <span
                      key={p.productName}
                      className="px-2.5 py-1 bg-white text-blue-900 border border-blue-200 font-bold rounded-lg"
                    >
                      {p.productName} ({p.reaction})
                    </span>
                  ))}
                  {samplesGiven.map((s) => (
                    <span
                      key={s.productName}
                      className="px-2.5 py-1 bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold rounded-lg"
                    >
                      Samples: {s.quantity}x {s.productName}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Save Button for Voice Entry */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleSaveVisit}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Voice Visit Record</span>
            </button>
          </div>
        </div>
      )}

      {/* Manual Entry Detailed Form Screen */}
      {recordingMode === 'manual' && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-md space-y-4">
          {/* 1. Doctor, Date, Time & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Select Physician <span className="text-rose-500">*</span>
              </label>
              <select
                value={selectedDoctorId}
                onChange={(e) => {
                  setSelectedDoctorId(e.target.value);
                  setSelectedDoctorForVisit(doctors.find((d) => d.id === e.target.value) || null);
                }}
                className="w-full bg-slate-50 text-slate-900 text-xs font-bold rounded-xl p-3 border border-slate-200 focus:outline-none focus:border-blue-500"
              >
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.specialty} • {d.hospital})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Visit Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 text-xs font-bold rounded-xl p-3 border border-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Visit Time <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={visitTime}
                  onChange={(e) => setVisitTime(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 text-xs font-bold rounded-xl p-3 border border-slate-200 focus:outline-none focus:border-blue-500"
                  placeholder="e.g. 10:30 AM"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Duration (Mins)</label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={visitDurationMinutes}
                  onChange={(e) => setVisitDurationMinutes(Number(e.target.value))}
                  className="w-full bg-slate-50 text-slate-900 text-xs font-bold rounded-xl p-3 border border-slate-200 focus:outline-none focus:border-blue-500"
                  placeholder="Mins"
                />
              </div>
            </div>
          </div>

          {/* Call Objective */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Call Objective</label>
            <input
              type="text"
              placeholder="e.g. Present REPOS-3 trial renal sub-analysis & secure trial cohort..."
              value={callObjective}
              onChange={(e) => setCallObjective(e.target.value)}
              className="w-full bg-slate-50 text-slate-900 text-xs font-semibold rounded-xl p-3 border border-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Interaction Type Toggle */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Interaction Type</label>
            <div className="grid grid-cols-3 gap-2">
              {(['In-Person', 'Virtual', 'Group CADD'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setVisitType(type)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                    visitType === type
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Products Discussed (Required) */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-700 block">
              Products Discussed <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {products.map((prod) => {
                const selectedObj = selectedProducts.find((p) => p.productName === prod.name);
                const isSelected = !!selectedObj;

                return (
                  <div
                    key={prod.id}
                    className={`p-3 rounded-xl border transition-all ${
                      isSelected ? 'bg-blue-50/60 border-blue-300' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => toggleProductSelection(prod.name)}
                        className="flex items-center gap-2 text-xs font-bold text-slate-800"
                      >
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center ${
                            isSelected ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-300'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3" />}
                        </div>
                        <span>{prod.name}</span>
                      </button>
                    </div>

                    {isSelected && (
                      <div className="mt-2 flex items-center gap-1">
                        <span className="text-[10px] text-slate-500 font-semibold">Doctor Reaction:</span>
                        {(['Positive', 'Neutral', 'Hesitant'] as const).map((rx) => (
                          <button
                            key={rx}
                            type="button"
                            onClick={() => updateProductReaction(prod.name, rx)}
                            className={`text-[9px] px-2 py-0.5 rounded font-bold transition-colors ${
                              selectedObj.reaction === rx
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-slate-600 border border-slate-200'
                            }`}
                          >
                            {rx}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Discussion Notes */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Discussion Notes</label>
            <textarea
              rows={3}
              placeholder="Record clinical discussion points, doctor comments, and questions..."
              value={discussionNotes}
              onChange={(e) => setDiscussionNotes(e.target.value)}
              className="w-full bg-slate-50 text-slate-900 text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Objections Captured */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-700 block">Objections Raised</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Requests long-term renal safety outcome trial data..."
                value={newObjectionInput}
                onChange={(e) => setNewObjectionInput(e.target.value)}
                className="flex-1 bg-slate-50 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddObjection}
                className="px-3.5 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold hover:bg-amber-500"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {objections.map((obj, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 text-[11px] font-medium flex items-center gap-1"
                >
                  <AlertCircle className="w-3 h-3 text-amber-600" />
                  {obj}
                </span>
              ))}
            </div>
          </div>

          {/* Competitor Mentioned */}
          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
            <label className="font-bold text-slate-700 block">Competitor Mentioned</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Competitor Brand (e.g. Entresto, Jardiance)"
                value={competitorBrand}
                onChange={(e) => setCompetitorBrand(e.target.value)}
                className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Claim or pitch mentioned by doctor..."
                value={competitorClaim}
                onChange={(e) => setCompetitorClaim(e.target.value)}
                className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:outline-none"
              />
            </div>
          </div>

          {/* Samples Given */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-700 block">Samples Distributed</label>
            <div className="space-y-2">
              {products.map((prod) => {
                const sampleObj = samplesGiven.find((s) => s.productName === prod.name);
                const qty = sampleObj ? sampleObj.quantity : 0;

                return (
                  <div
                    key={prod.id}
                    className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-800">{prod.name}</span>
                      <span className="text-[10px] text-slate-400 block">
                        Stock available: {prod.sampleStock}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateSampleQuantity(prod.name, -1)}
                        className="p-1 rounded bg-white text-slate-700 border border-slate-300 hover:bg-slate-100"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center font-bold text-slate-900">{qty}</span>
                      <button
                        type="button"
                        onClick={() => updateSampleQuantity(prod.name, 1)}
                        className="p-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Doctor Commitment & Follow-up Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Physician Commitment Level</label>
              <select
                value={commitment}
                onChange={(e) =>
                  setCommitment(e.target.value as 'Confirmed Commitment' | 'High Potential' | 'Medium Potential' | 'Low Potential')
                }
                className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 font-bold focus:outline-none"
              >
                <option value="Confirmed Commitment">✓ Confirmed Prescribing Commitment</option>
                <option value="High Potential">High Potential (+15 scripts/mo)</option>
                <option value="Medium Potential">Medium Potential (+5 scripts/mo)</option>
                <option value="Low Potential">Low Potential / Evaluation</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Follow-up Date</label>
              <input
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 font-bold focus:outline-none"
              />
            </div>
          </div>

          {/* Save Button for Manual Entry */}
          <div className="pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={handleSaveVisit}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-black text-xs shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
            >
              <Save className="w-4 h-4" />
              <span>Save Complete Visit Record</span>
            </button>
          </div>
        </div>
      )}

      {/* Quick Visit Screen */}
      {recordingMode === 'quick' && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-md space-y-4">
          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-xs font-medium flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Quick Visit Mode: Log rapid details in seconds with minimal entry fields.</span>
          </div>

          {/* Doctor Selection */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Doctor <span className="text-rose-500">*</span>
            </label>
            <select
              value={selectedDoctorId}
              onChange={(e) => {
                setSelectedDoctorId(e.target.value);
                setSelectedDoctorForVisit(doctors.find((d) => d.id === e.target.value) || null);
              }}
              className="w-full bg-slate-50 text-slate-900 text-xs font-bold rounded-xl p-3 border border-slate-200 focus:outline-none focus:border-blue-500"
            >
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.specialty} • {d.hospital})
                </option>
              ))}
            </select>
          </div>

          {/* Product Selection */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Product <span className="text-rose-500">*</span>
            </label>
            <select
              value={quickProduct}
              onChange={(e) => setQuickProduct(e.target.value)}
              className="w-full bg-slate-50 text-slate-900 text-xs font-bold rounded-xl p-3 border border-slate-200 focus:outline-none focus:border-blue-500"
            >
              {products.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name} ({p.genericName})
                </option>
              ))}
            </select>
          </div>

          {/* Visit Result */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Visit Result <span className="text-rose-500">*</span>
            </label>
            <select
              value={quickVisitResult}
              onChange={(e) => setQuickVisitResult(e.target.value)}
              className="w-full bg-slate-50 text-slate-900 text-xs font-bold rounded-xl p-3 border border-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="Positive Detail & Sample Handout">Positive Detail & Sample Handout</option>
              <option value="Confirmed Prescribing Commitment">Confirmed Prescribing Commitment</option>
              <option value="Neutral / Needs Trial Evidence">Neutral / Needs Trial Evidence</option>
              <option value="Hesitant / Co-pay Issue">Hesitant / Co-pay Issue</option>
              <option value="Brief Literature Drop-off">Brief Literature Drop-off</option>
            </select>
          </div>

          {/* Next Visit Date */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Next Visit Date</label>
            <input
              type="date"
              value={quickNextVisitDate}
              onChange={(e) => setQuickNextVisitDate(e.target.value)}
              className="w-full bg-slate-50 text-slate-900 text-xs font-bold rounded-xl p-3 border border-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Save Button for Quick Visit */}
          <div className="pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={handleSaveVisit}
              className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
            >
              <Save className="w-4 h-4 fill-slate-950" />
              <span>Save Quick Visit</span>
            </button>
          </div>
        </div>
      )}

      {/* AI Analysis Modal post-save */}
      <AfterVisitAnalysisModal
        visit={savedVisitForAnalysis}
        isOpen={!!savedVisitForAnalysis}
        onClose={() => setSavedVisitForAnalysis(null)}
        onViewHistory={() => {
          setSavedVisitForAnalysis(null);
          setActiveTab('visits');
        }}
      />

      {/* Pre-Visit Coach Modal */}
      <PreVisitCoachModal
        doctor={activeDoctor || null}
        isOpen={isCoachOpen}
        onClose={() => setIsCoachOpen(false)}
        onStartVisit={() => setIsCoachOpen(false)}
      />
    </div>
  );
};
