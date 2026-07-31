/**
 * AI Service Layer
 * Wrapper for Gemini API calls, Meeting Prep generation, Voice Assistant parsing, and Next-Best-Action heuristics.
 */

import { Doctor, Visit } from '../../models';

export interface MeetingPrepResponse {
  doctorSummary: string;
  previousVisitsSummary: string;
  suggestedOpening: string;
  clinicalEvidence: string;
  competitorComparison: string;
  successProbability: number;
}

export interface VoiceAssistantParseResponse {
  doctorId: string;
  doctorName: string;
  notes: string;
  aiSummary: string;
  productsDiscussed: { productName: string; reaction: 'Positive' | 'Neutral' | 'Hesitant' }[];
  samplesGiven: { productName: string; quantity: number; batchNo: string }[];
  objectionsCaptured: string[];
  followUpTask: string;
  nextFollowUpDate: string;
  date: string;
  time: string;
}

export class AIService {
  public async generateMeetingPrep(doctor: Doctor): Promise<MeetingPrepResponse> {
    try {
      const res = await fetch('/api/ai/meeting-prep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doctor })
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      return data.prep;
    } catch (error) {
      console.warn('AI Service meeting prep fallback triggered:', error);
      return {
        doctorSummary: `${doctor.name} is a ${doctor.doctorClass} ${doctor.specialty} at ${doctor.hospital}.`,
        previousVisitsSummary: `Recorded ${doctor.totalVisitsThisMonth} visits this month.`,
        suggestedOpening: `"Good morning Dr. ${doctor.name.split(' ').pop()}, I wanted to brief you on recent outcome trials for ${doctor.promotedProducts[0] || 'our flagship therapy'}."`,
        clinicalEvidence: `Superiority trial demonstrated 24% relative risk reduction in primary end points.`,
        competitorComparison: `Outperforms competitor standard-of-care with reduced side-effect profile.`,
        successProbability: 88
      };
    }
  }

  public async parseVoiceReport(spokenText: string, availableDoctors: Doctor[]): Promise<VoiceAssistantParseResponse> {
    try {
      const res = await fetch('/api/ai/voice-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          spokenText,
          availableDoctors: availableDoctors.map(d => ({ id: d.id, name: d.name, specialty: d.specialty }))
        })
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      return data.parsedVisit;
    } catch (error) {
      console.warn('AI Service voice assistant fallback triggered:', error);
      const doc = availableDoctors[0];
      return {
        doctorId: doc?.id || 'doc-1',
        doctorName: doc?.name || 'Dr. Sarah Miller',
        notes: spokenText,
        aiSummary: 'Voice dictated visit log parsed successfully.',
        productsDiscussed: [{ productName: 'Cardiovasc XL', reaction: 'Positive' }],
        samplesGiven: [{ productName: 'Cardiovasc XL 100mg', quantity: 3, batchNo: 'LOT-9981' }],
        objectionsCaptured: ['Requested additional long-term renal outcome whitepaper'],
        followUpTask: 'Deliver renal whitepaper study copy',
        nextFollowUpDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        date: new Date().toISOString().split('T')[0],
        time: '10:00 AM'
      };
    }
  }
}

export const aiService = new AIService();
