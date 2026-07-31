import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2,
  XCircle,
  Edit3,
  FileText,
  ShieldAlert,
  Sparkles,
  History,
  AlertCircle,
  Check,
  X,
  Cpu,
  UserCheck,
  ExternalLink,
  ChevronRight,
  Pill,
  Swords
} from 'lucide-react';
import { ExtractedKnowledgeItem, AuditLogEntry } from '../../ai-core/interfaces';
import { SAMPLE_REVIEW_QUEUE } from '../../data/knowledgeReviewData';

export const KnowledgeReviewSection: React.FC = () => {
  const [queue, setQueue] = useState<ExtractedKnowledgeItem[]>(SAMPLE_REVIEW_QUEUE);
  const [activeTab, setActiveTab] = useState<'Pending Review' | 'Approved' | 'Rejected'>('Pending Review');
  const [editingItem, setEditingItem] = useState<ExtractedKnowledgeItem | null>(null);
  const [editForm, setEditForm] = useState<{
    objection: string;
    scientificAnswer: string;
    evidence: string;
    references: string;
    competitor: string;
  }>({
    objection: '',
    scientificAnswer: '',
    evidence: '',
    references: '',
    competitor: ''
  });
  const [selectedAuditItem, setSelectedAuditItem] = useState<ExtractedKnowledgeItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenEdit = (item: ExtractedKnowledgeItem) => {
    setEditingItem(item);
    const refsStr = Array.isArray(item.references) ? item.references.join(' • ') : item.references;
    setEditForm({
      objection: item.objection,
      scientificAnswer: item.scientificAnswer,
      evidence: item.evidence,
      references: refsStr,
      competitor: item.competitor
    });
  };

  const handleSaveEdit = () => {
    if (!editingItem) return;

    const timestamp = new Date().toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const originalAnswer = editingItem.originalAiVersion?.scientificAnswer || editingItem.scientificAnswer;
    const isAnswerChanged = originalAnswer !== editForm.scientificAnswer;
    const whatChanged = isAnswerChanged
      ? 'Modified AI Scientific Answer and references for clinical precision.'
      : 'Updated objection wording and competitor comparison.';

    const newAuditEntry: AuditLogEntry = {
      id: `audit-${Date.now()}`,
      whoEdited: 'Dr. Alex Mercer (Medical Review Lead)',
      timestamp,
      whatChanged,
      originalVersion: originalAnswer,
      currentVersion: editForm.scientificAnswer
    };

    const updatedQueue = queue.map(item => {
      if (item.id === editingItem.id) {
        return {
          ...item,
          objection: editForm.objection,
          scientificAnswer: editForm.scientificAnswer,
          evidence: editForm.evidence,
          references: editForm.references.split('•').map(r => r.trim()).filter(Boolean),
          competitor: editForm.competitor,
          editedVersion: {
            objection: editForm.objection,
            scientificAnswer: editForm.scientificAnswer,
            evidence: editForm.evidence,
            references: editForm.references,
            competitor: editForm.competitor,
            confidenceScore: item.confidenceScore
          },
          auditHistory: [newAuditEntry, ...(item.auditHistory || [])]
        };
      }
      return item;
    });

    setQueue(updatedQueue);
    setEditingItem(null);
    showToast('Knowledge item edited. Both Original AI and Edited versions saved to Audit History.');
  };

  const handleApprove = (id: string) => {
    setQueue(prev =>
      prev.map(item => {
        if (item.id === id) {
          const now = new Date().toLocaleString();
          const autoAudit: AuditLogEntry = {
            id: `audit-app-${Date.now()}`,
            whoEdited: item.editedVersion ? 'Dr. Alex Mercer (Medical Review Lead)' : 'AI Auto-Validated & Approved',
            timestamp: now,
            whatChanged: item.editedVersion ? 'Approved after medical reviewer edits.' : 'Approved AI original extraction without modification.',
            originalVersion: item.originalAiVersion?.scientificAnswer || item.scientificAnswer,
            currentVersion: item.scientificAnswer
          };
          return {
            ...item,
            status: 'Approved',
            auditHistory: [autoAudit, ...(item.auditHistory || [])]
          };
        }
        return item;
      })
    );
    showToast('Knowledge item approved and synced to RepMind Knowledge Base!');
  };

  const handleReject = (id: string) => {
    setQueue(prev =>
      prev.map(item => (item.id === id ? { ...item, status: 'Rejected' } : item))
    );
    showToast('Knowledge item rejected and removed from pending queue.');
  };

  const filteredQueue = queue.filter(item => item.status === activeTab);
  const pendingCount = queue.filter(i => i.status === 'Pending Review').length;
  const approvedCount = queue.filter(i => i.status === 'Approved').length;
  const rejectedCount = queue.filter(i => i.status === 'Rejected').length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white border border-indigo-500/30 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-[10px] font-black uppercase tracking-wider">
              <Cpu className="w-3.5 h-3.5 text-blue-400" />
              <span>Sprint 5.0 • AI Core Architecture (MVP)</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <span>Knowledge Review Queue & Medical Audit</span>
              <Sparkles className="w-4 h-4 text-amber-300" />
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
              Extracted AI knowledge from PDF/DOCX monographs must pass medical review before entering the live Knowledge Base. Inspect AI confidence scores, edit scientific answers, and track full audit histories.
            </p>
          </div>

          {/* Stat count pill */}
          <div className="flex items-center gap-2 bg-white/10 px-4 py-3 rounded-2xl border border-white/15 shrink-0">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Pending Medical Review</span>
              <span className="text-xl font-black text-amber-400">{pendingCount} Items</span>
            </div>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 pt-2 border-t border-white/10 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('Pending Review')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'Pending Review'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-white/10 text-slate-300 hover:bg-white/15'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Pending Review ({pendingCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('Approved')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'Approved'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white/10 text-slate-300 hover:bg-white/15'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Approved & Synced ({approvedCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('Rejected')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'Rejected'
                ? 'bg-rose-600 text-white shadow-md'
                : 'bg-white/10 text-slate-300 hover:bg-white/15'
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Rejected ({rejectedCount})</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-emerald-600 text-white rounded-2xl shadow-xl font-bold text-xs flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{toastMessage}</span>
            </div>
            <button onClick={() => setToastMessage(null)} className="text-white/80 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Items Grid */}
      {filteredQueue.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
          <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
            <Check className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No {activeTab} Items</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {activeTab === 'Pending Review'
              ? 'All AI-extracted scientific objections have been reviewed and processed.'
              : `You have not ${activeTab.toLowerCase()} any items yet.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQueue.map(item => {
            const isEdited = !!item.editedVersion;
            const refs = Array.isArray(item.references) ? item.references : [item.references];

            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow space-y-4"
              >
                {/* Header: Source Doc & Confidence */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
                      <FileText className="w-3.5 h-3.5 text-blue-600" />
                      <span className="truncate max-w-xs">{item.sourceDocument}</span>
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-bold">
                      <Pill className="w-3 h-3 text-blue-600" />
                      <span>{item.product} ({item.specialty})</span>
                    </span>
                    {item.competitor && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 text-[11px] font-bold">
                        <Swords className="w-3 h-3 text-rose-600" />
                        <span>vs {item.competitor}</span>
                      </span>
                    )}
                  </div>

                  {/* Confidence Badge */}
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className="text-xs font-extrabold text-slate-700">AI Confidence:</span>
                    <span
                      className={`text-xs font-black px-3 py-1 rounded-full ${
                        item.confidenceScore >= 90
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : item.confidenceScore >= 80
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {item.confidenceScore}%
                    </span>
                    {isEdited && (
                      <span className="text-[10px] font-black bg-purple-100 text-purple-800 px-2.5 py-1 rounded-full border border-purple-200 flex items-center gap-1">
                        <Edit3 className="w-3 h-3" />
                        <span>Edited by Reviewer</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Extracted Objection */}
                  <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-900">
                      <ShieldAlert className="w-4 h-4 text-amber-600" />
                      <span>Extracted Objection</span>
                    </div>
                    <p className="text-slate-900 font-bold text-sm leading-snug">
                      "{item.objection}"
                    </p>
                  </div>

                  {/* AI Scientific Answer */}
                  <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-extrabold text-blue-900">
                        <Sparkles className="w-4 h-4 text-blue-600" />
                        <span>AI Scientific Counter-Answer</span>
                      </div>
                      {isEdited && (
                        <span className="text-[10px] text-purple-700 font-bold">
                          Modified Version
                        </span>
                      )}
                    </div>
                    <p className="text-slate-800 font-medium text-xs leading-relaxed">
                      {item.scientificAnswer}
                    </p>
                  </div>
                </div>

                {/* Evidence & References Bar */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Clinical Evidence</span>
                    <span className="font-semibold text-slate-800">{item.evidence}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">References</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {refs.map((r, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[11px] font-bold text-slate-700">
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons & Audit Log Viewer */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    {item.auditHistory && item.auditHistory.length > 0 && (
                      <button
                        onClick={() => setSelectedAuditItem(item)}
                        className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <History className="w-3.5 h-3.5 text-slate-600" />
                        <span>Audit History ({item.auditHistory.length})</span>
                      </button>
                    )}
                    <span className="text-xs text-slate-400">Extracted {item.extractionDate}</span>
                  </div>

                  {item.status === 'Pending Review' ? (
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit Before Approve</span>
                      </button>
                      <button
                        onClick={() => handleReject(item.id)}
                        className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                      <button
                        onClick={() => handleApprove(item.id)}
                        className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5 transition-all"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                      {item.status === 'Approved' ? (
                        <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Approved & Synced to Live Knowledge Base</span>
                        </span>
                      ) : (
                        <span className="text-rose-700 font-extrabold flex items-center gap-1">
                          <XCircle className="w-4 h-4" />
                          <span>Rejected</span>
                        </span>
                      )}
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* MODAL: Edit Item Before Approve */}
      <AnimatePresence>
        {editingItem && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-5 border border-slate-200"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-blue-600" />
                  <h3 className="text-base font-extrabold text-slate-900">
                    Edit Extracted Knowledge Item
                  </h3>
                </div>
                <button onClick={() => setEditingItem(null)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Notice banner */}
              <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 text-xs text-purple-900 flex items-center gap-2">
                <History className="w-4 h-4 text-purple-600 shrink-0" />
                <span>
                  <strong>Audit Tracking Active:</strong> Saving edits will preserve both the Original AI Version and your Edited Version in the permanent Audit History.
                </span>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Objection Title / Wording</label>
                  <textarea
                    rows={2}
                    value={editForm.objection}
                    onChange={(e) => setEditForm({ ...editForm, objection: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-blue-500 text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Scientific Counter-Answer</label>
                  <textarea
                    rows={4}
                    value={editForm.scientificAnswer}
                    onChange={(e) => setEditForm({ ...editForm, scientificAnswer: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-blue-500 text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Clinical Evidence Summary</label>
                    <input
                      type="text"
                      value={editForm.evidence}
                      onChange={(e) => setEditForm({ ...editForm, evidence: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-blue-500 text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Competitor Comparison</label>
                    <input
                      type="text"
                      value={editForm.competitor}
                      onChange={(e) => setEditForm({ ...editForm, competitor: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-blue-500 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">References (separate with •)</label>
                  <input
                    type="text"
                    value={editForm.references}
                    onChange={(e) => setEditForm({ ...editForm, references: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-blue-500 text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-lg shadow-blue-500/20"
                >
                  Save Version & Create Audit Entry
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: Audit History Drawer / Modal */}
      <AnimatePresence>
        {selectedAuditItem && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white rounded-3xl p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl space-y-5 border border-slate-200"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5 text-purple-600" />
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">
                      Medical Audit History
                    </h3>
                    <p className="text-xs text-slate-500">
                      Full regulatory chain-of-custody for item: {selectedAuditItem.id}
                    </p>
                  </div>
                </div>
                <button onClick={() => setSelectedAuditItem(null)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Version Comparison Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Original AI Version
                  </span>
                  <p className="font-bold text-slate-800 text-xs">
                    {selectedAuditItem.originalAiVersion?.objection || selectedAuditItem.objection}
                  </p>
                  <p className="text-slate-600 text-xs mt-1">
                    {selectedAuditItem.originalAiVersion?.scientificAnswer || selectedAuditItem.scientificAnswer}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-1">
                  <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block">
                    Current Live Version
                  </span>
                  <p className="font-bold text-slate-900 text-xs">
                    {selectedAuditItem.objection}
                  </p>
                  <p className="text-purple-950 text-xs mt-1 font-medium">
                    {selectedAuditItem.scientificAnswer}
                  </p>
                </div>
              </div>

              {/* Audit Log Entries */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                  Audit Chain Logs ({selectedAuditItem.auditHistory?.length || 0})
                </h4>
                {(!selectedAuditItem.auditHistory || selectedAuditItem.auditHistory.length === 0) ? (
                  <p className="text-xs text-slate-400 italic">No edits recorded prior to approval.</p>
                ) : (
                  selectedAuditItem.auditHistory.map(entry => (
                    <div key={entry.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                      <div className="flex items-center justify-between font-bold">
                        <span className="text-slate-900 flex items-center gap-1.5">
                          <UserCheck className="w-3.5 h-3.5 text-purple-600" />
                          <span>{entry.whoEdited}</span>
                        </span>
                        <span className="text-slate-500 text-[11px]">{entry.timestamp}</span>
                      </div>
                      <p className="text-purple-900 font-bold bg-purple-50/70 px-2.5 py-1 rounded-lg border border-purple-100">
                        {entry.whatChanged}
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                        <div>
                          <span className="text-slate-400 block font-bold">Before:</span>
                          <span className="text-slate-600 line-through block truncate">{entry.originalVersion}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-bold">After:</span>
                          <span className="text-emerald-700 font-semibold block truncate">{entry.currentVersion}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="flex justify-end pt-2 border-t border-slate-100">
                <button
                  onClick={() => setSelectedAuditItem(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-extrabold text-xs"
                >
                  Close Audit Log
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
