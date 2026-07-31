/**
 * Visit Scoring Engine
 * Evaluates representative visit logs to calculate multi-dimensional visit quality ratings:
 * - Preparation Score (0–100): Pre-call research & sample availability.
 * - Execution Score (0–100): Product detailing coverage, objection handling, & doctor reaction.
 * - Follow-up Score (0–100): Specific task commitment, date set, & sample distribution.
 * - Overall Visit Quality Score (0–100): Weighted composite rating.
 * Automatically generates tailored coaching feedback tips.
 */

import { Visit } from '../models';

export interface VisitScoreResult {
  overallQualityScore: number;
  preparationScore: number;
  executionScore: number;
  followUpScore: number;
  coachingTips: string[];
  performanceGrade: 'A+' | 'A' | 'B' | 'C' | 'Needs Improvement';
}

export class VisitScoringEngine {
  public static scoreVisit(visit: Partial<Visit>): VisitScoreResult {
    // 1. Preparation Score calculation
    let prepScore = 70;
    if (visit.aiSummary && visit.aiSummary.length > 20) prepScore += 15;
    if (visit.productsDiscussed && visit.productsDiscussed.length > 0) prepScore += 15;
    prepScore = Math.min(100, prepScore);

    // 2. Execution Score calculation
    let execScore = 65;
    if (visit.productsDiscussed && visit.productsDiscussed.length > 0) {
      execScore += visit.productsDiscussed.length * 10;
      const positiveReactions = visit.productsDiscussed.filter(p => p.reaction === 'Positive').length;
      execScore += positiveReactions * 10;
    }
    if (visit.objectionsCaptured && visit.objectionsCaptured.length > 0) {
      execScore += 10; // Bonus for capturing and documenting objections
    }
    execScore = Math.min(100, execScore);

    // 3. Follow-up Score calculation
    let followScore = 60;
    if (visit.followUpTask && visit.followUpTask.trim().length > 0) followScore += 20;
    if (visit.nextFollowUpDate) followScore += 20;
    if (visit.samplesGiven && visit.samplesGiven.length > 0) followScore += 10;
    followScore = Math.min(100, followScore);

    // Overall Quality Score (Weighted: 25% Prep, 50% Execution, 25% Follow-up)
    const overallQualityScore = Math.round(prepScore * 0.25 + execScore * 0.50 + followScore * 0.25);

    // Grade Assignment
    let performanceGrade: VisitScoreResult['performanceGrade'] = 'B';
    if (overallQualityScore >= 92) performanceGrade = 'A+';
    else if (overallQualityScore >= 84) performanceGrade = 'A';
    else if (overallQualityScore >= 74) performanceGrade = 'B';
    else if (overallQualityScore >= 60) performanceGrade = 'C';
    else performanceGrade = 'Needs Improvement';

    // Automated Coaching Tips Generation
    const coachingTips: string[] = [];

    if (prepScore < 80) {
      coachingTips.push('Review pre-visit AI prep card to review doctor prescribing habits before entering the clinic.');
    }
    if (execScore < 80) {
      coachingTips.push('Focus on securing positive agreement on key clinical trial outcomes for flagship therapies.');
    }
    if (visit.objectionsCaptured && visit.objectionsCaptured.length > 0) {
      coachingTips.push(`Address captured objection ("${visit.objectionsCaptured[0]}") using the official clinical whitepaper during your next follow-up.`);
    }
    if (followScore < 80) {
      coachingTips.push('Ensure a concrete next follow-up date and deliverable action are agreed upon before concluding the visit.');
    } else {
      coachingTips.push('Great execution! Follow through on promised sample delivery to lock in physician adoption.');
    }

    return {
      overallQualityScore,
      preparationScore: prepScore,
      executionScore: execScore,
      followUpScore: followScore,
      coachingTips,
      performanceGrade
    };
  }
}
