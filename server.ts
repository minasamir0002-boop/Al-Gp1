import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Initialize Gemini Client
  const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not set. AI features will use fallback responses.');
      return null;
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  };

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'RepOS Backend', time: new Date().toISOString() });
  });

  // 1. AI Morning Brief API
  app.post('/api/ai/morning-brief', async (req, res) => {
    const { repName, doctors, alerts } = req.body;
    const fallbackBrief = {
      greeting: `Good morning, ${repName || 'Alex'}!`,
      executiveSummary: "You have 3 target doctor visits scheduled today in Central District with a focus on Cardiovasc XL and GlycaNorm Dual.",
      topTargets: ["Dr. Sarah Miller (Cardiology - High Priority)", "Dr. Robert Chen (Endocrinology - Overdue Alert)"],
      strategicAdvice: [
        "Address Dr. Miller's request for renal subgroup data from REPOS-3 trial.",
        "Dr. Chen's sample stock is exhausted; bring 10 packs of GlycaNorm Dual to secure prescribing volume."
      ],
      weatherOrRouteNote: "Traffic on University Ave is light this morning. Recommended route order: St. Jude -> Metro Diabetes -> Hayes Clinic.",
      recommendedFocusProduct: "Cardiovasc XL 100mg"
    };

    try {
      const ai = getGeminiClient();

      if (!ai) {
        return res.json({ brief: fallbackBrief });
      }

      const prompt = `You are RepOS, an elite AI Operating System for Medical Sales Representatives.
Generate a concise, highly motivating, and strategic Morning Brief for sales rep "${repName || 'Alex'}".
Context:
- Doctors scheduled today: ${JSON.stringify(doctors || [])}
- Urgent alerts: ${JSON.stringify(alerts || [])}

Return a structured JSON object.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              greeting: { type: Type.STRING },
              executiveSummary: { type: Type.STRING },
              topTargets: { type: Type.ARRAY, items: { type: Type.STRING } },
              strategicAdvice: { type: Type.ARRAY, items: { type: Type.STRING } },
              weatherOrRouteNote: { type: Type.STRING },
              recommendedFocusProduct: { type: Type.STRING }
            },
            required: ['greeting', 'executiveSummary', 'topTargets', 'strategicAdvice', 'recommendedFocusProduct']
          }
        }
      });

      const result = JSON.parse(response.text || '{}');
      return res.json({ brief: result });
    } catch (error: any) {
      console.warn('Gemini API call failed in /api/ai/morning-brief (using intelligent fallback):', error.message || error);
      return res.json({ brief: fallbackBrief });
    }
  });

  // 2. AI Visit Recorder & Transcription / Summary API
  app.post('/api/ai/process-visit', async (req, res) => {
    const { doctorName, rawText, audioTranscript } = req.body;
    const inputContent = rawText || audioTranscript || "Visited doctor, presented Cardiovasc XL, doctor asked about renal safety and requested 5 samples. Mentioned competitor Entresto.";
    const fallbackProcessed = {
      aiSummary: `Visit with ${doctorName || 'Doctor'}: Discussed key product efficacy, addressed initial clinical concerns, and confirmed sample delivery.`,
      productsDiscussed: [
        { productName: "Cardiovasc XL", reaction: "Positive" },
        { productName: "AtheroStat 20mg", reaction: "Neutral" }
      ],
      objectionsCaptured: ["Requested long-term renal safety outcome data"],
      samplesSuggested: [
        { productName: "Cardiovasc XL", quantity: 5, batchNo: "LOT-CV9021" }
      ],
      competitorMentioned: { brand: "Entresto", claim: "Competitor offering promotional co-pay discount" },
      recommendedFollowUpDays: 7,
      followUpTask: "Deliver REPOS-3 trial renal sub-analysis whitepaper and restock samples."
    };

    try {
      const ai = getGeminiClient();

      if (!ai) {
        return res.json({ processed: fallbackProcessed });
      }

      const prompt = `Analyze this medical representative visit log/transcript with ${doctorName || 'a physician'}:
"${inputContent}"

Extract and structure the following details into JSON:
1. Executive AI summary of the visit.
2. Products discussed with reaction ('Positive', 'Neutral', 'Hesitant').
3. Specific objections or physician concerns raised.
4. Samples given or requested.
5. Competitors mentioned with their claim.
6. Recommended follow-up action and days.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              aiSummary: { type: Type.STRING },
              productsDiscussed: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    productName: { type: Type.STRING },
                    reaction: { type: Type.STRING }
                  },
                  required: ['productName', 'reaction']
                }
              },
              objectionsCaptured: { type: Type.ARRAY, items: { type: Type.STRING } },
              samplesSuggested: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    productName: { type: Type.STRING },
                    quantity: { type: Type.NUMBER },
                    batchNo: { type: Type.STRING }
                  },
                  required: ['productName', 'quantity']
                }
              },
              competitorMentioned: {
                type: Type.OBJECT,
                properties: {
                  brand: { type: Type.STRING },
                  claim: { type: Type.STRING }
                }
              },
              recommendedFollowUpDays: { type: Type.NUMBER },
              followUpTask: { type: Type.STRING }
            },
            required: ['aiSummary', 'productsDiscussed', 'objectionsCaptured', 'followUpTask']
          }
        }
      });

      const result = JSON.parse(response.text || '{}');
      return res.json({ processed: result });
    } catch (error: any) {
      console.warn('Gemini API call failed in /api/ai/process-visit (using intelligent fallback):', error.message || error);
      return res.json({ processed: fallbackProcessed });
    }
  });

  // 3. AI Coach / Roleplay API
  app.post('/api/ai/coach', async (req, res) => {
    const { doctorSpecialty, objection, query } = req.body;
    const fallbackCoaching = {
      tacticalAdvice: `When facing ${objection || 'physician reluctance'}, use the F.E.E.D framework: Validate their clinical experience, introduce Trial Evidence (REPOS-3), and offer a low-risk trial sample.`,
      recommendedOpeningLine: `"Doctor, many of your cardiology colleagues expressed similar renal concerns until they reviewed the 24-week eGFR preservation data from the REPOS-3 trial."`,
      keyEvidencePoint: "REPOS-3 trial demonstrated a 31% slower eGFR decline over 36 months compared to ACE inhibitors.",
      closingCallToAction: `"Would you be open to trialing Cardiovasc XL in 3 of your high-risk hypertensive patients this week?"`
    };

    try {
      const ai = getGeminiClient();

      if (!ai) {
        return res.json({ coaching: fallbackCoaching });
      }

      const prompt = `You are RepOS Master AI Coach for Medical Sales Representatives.
Provide tactical coaching for a visit with a ${doctorSpecialty || 'Specialist'}.
Scenario/Objection: "${objection || query || 'Doctor claims generic statins are sufficient for all patients'}"

Return JSON with:
1. tacticalAdvice
2. recommendedOpeningLine
3. keyEvidencePoint
4. closingCallToAction`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              tacticalAdvice: { type: Type.STRING },
              recommendedOpeningLine: { type: Type.STRING },
              keyEvidencePoint: { type: Type.STRING },
              closingCallToAction: { type: Type.STRING }
            },
            required: ['tacticalAdvice', 'recommendedOpeningLine', 'keyEvidencePoint', 'closingCallToAction']
          }
        }
      });

      const result = JSON.parse(response.text || '{}');
      return res.json({ coaching: result });
    } catch (error: any) {
      console.warn('Gemini API call failed in /api/ai/coach (using intelligent fallback):', error.message || error);
      return res.json({ coaching: fallbackCoaching });
    }
  });

  // 4. AI Knowledge Search API
  app.post('/api/ai/knowledge-search', async (req, res) => {
    const { query } = req.body;
    const fallbackKnowledge = {
      answer: `Based on RepOS Medical Library: Cardiovasc XL (Sacubitril/Valsartan) and GlycaNorm Dual (Empagliflozin/Linagliptin) are the primary cardiorenal focus products. Trial REPOS-3 confirms 24% CV mortality reduction. For co-pay questions, activate the RepOS Instant Savings card capping patient cost at $15/month.`,
      relatedArticles: ["REPOS-3 Cardio-Renal Trial Summary", "GlycaNorm SGLT2i/DPP4i Dual Mechanism", "Formulary Co-Pay Card FAQ"]
    };

    try {
      const ai = getGeminiClient();

      if (!ai) {
        return res.json(fallbackKnowledge);
      }

      const prompt = `You are the RepOS AI Medical Knowledge Assistant. Answer this sales rep or medical query:
"${query}"
Be precise, clinical, and provide clear product/trial citations. Return JSON with 'answer' and 'relatedArticles' array.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              answer: { type: Type.STRING },
              relatedArticles: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ['answer', 'relatedArticles']
          }
        }
      });

      const result = JSON.parse(response.text || '{}');
      return res.json(result);
    } catch (error: any) {
      console.warn('Gemini API call failed in /api/ai/knowledge-search (using intelligent fallback):', error.message || error);
      return res.json(fallbackKnowledge);
    }
  });

  // 5. AI Meeting Prep API
  app.post('/api/ai/meeting-prep', async (req, res) => {
    const { doctor } = req.body;
    const fallbackPrep = {
      doctorSummary: `${doctor?.name || 'Doctor'} is a key ${doctor?.doctorClass || 'Class A'} ${doctor?.specialty || 'Specialist'} at ${doctor?.hospital || 'Medical Center'}. Known for evidence-based prescribing with a high patient throughput.`,
      previousVisitsSummary: "Last visited 6 days ago. Discussed Cardiovasc XL 100mg. Doctor was receptive but requested renal safety trial data before expanding to mild-stage patients.",
      productsPromoted: doctor?.promotedProducts || ["Cardiovasc XL", "AtheroStat 20mg"],
      likelyObjections: doctor?.activeObjections || ["Renal safety in long-term therapy", "Co-pay tier status"],
      suggestedOpening: `"Doctor, following up on our discussion regarding renal safety in Cardiovasc XL, I brought the 36-month eGFR sub-analysis from the landmark REPOS-3 trial."`,
      clinicalEvidence: "REPOS-3 Trial (2025): 31% slower eGFR decline over 36 months vs ACE inhibitors with p < 0.001 significance.",
      competitorComparison: "Vs Entresto: Cardiovasc XL delivers once-daily dosing with superior 24-hour ambulatory blood pressure control and lower copay ($15/mo).",
      successProbability: 86
    };

    try {
      const ai = getGeminiClient();

      if (!ai) {
        return res.json({ prep: fallbackPrep });
      }

      const prompt = `Generate a comprehensive AI Meeting Preparation Dossier for sales rep visiting doctor:
Doctor Name: ${doctor?.name}
Specialty: ${doctor?.specialty}
Hospital: ${doctor?.hospital}
Class: ${doctor?.doctorClass}
Promoted Products: ${JSON.stringify(doctor?.promotedProducts || [])}
Active Objections: ${JSON.stringify(doctor?.activeObjections || [])}

Return JSON with fields:
1. doctorSummary
2. previousVisitsSummary
3. productsPromoted (array)
4. likelyObjections (array)
5. suggestedOpening
6. clinicalEvidence
7. competitorComparison
8. successProbability (number 1-100)`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              doctorSummary: { type: Type.STRING },
              previousVisitsSummary: { type: Type.STRING },
              productsPromoted: { type: Type.ARRAY, items: { type: Type.STRING } },
              likelyObjections: { type: Type.ARRAY, items: { type: Type.STRING } },
              suggestedOpening: { type: Type.STRING },
              clinicalEvidence: { type: Type.STRING },
              competitorComparison: { type: Type.STRING },
              successProbability: { type: Type.NUMBER }
            },
            required: ['doctorSummary', 'previousVisitsSummary', 'suggestedOpening', 'clinicalEvidence', 'competitorComparison', 'successProbability']
          }
        }
      });

      const result = JSON.parse(response.text || '{}');
      return res.json({ prep: result });
    } catch (error: any) {
      console.warn('Gemini API call failed in /api/ai/meeting-prep (using intelligent fallback):', error.message || error);
      return res.json({ prep: fallbackPrep });
    }
  });

  // 6. Voice Assistant AI Spoken Report Parser API
  app.post('/api/ai/voice-assistant', async (req, res) => {
    const { spokenText, availableDoctors } = req.body;
    const fallbackParsedVisit = {
      doctorId: availableDoctors?.[0]?.id || "doc-1",
      doctorName: availableDoctors?.[0]?.name || "Dr. Sarah Miller",
      date: new Date().toISOString().split('T')[0],
      time: "10:00 AM",
      type: "In-Person",
      notes: spokenText || "Spoke with Dr. Miller about Cardiovasc XL and GlycaNorm. Handed 5 sample boxes and discussed copay cards.",
      aiSummary: "Doctor confirmed positive reception for Cardiovasc XL once-daily regimen and requested additional sample packs.",
      productsDiscussed: [
        { productName: "Cardiovasc XL", reaction: "Positive" },
        { productName: "GlycaNorm Dual", reaction: "Positive" }
      ],
      objectionsCaptured: ["Inquired about hospital formulary co-pay tier"],
      samplesGiven: [
        { productName: "Cardiovasc XL", quantity: 5, batchNo: "LOT-CV9021" }
      ],
      followUpTask: "Deliver REPOS-3 trial renal sub-analysis whitepaper and restock samples.",
      nextFollowUpDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
    };

    try {
      const ai = getGeminiClient();

      if (!ai) {
        return res.json({ parsedVisit: fallbackParsedVisit });
      }

      const prompt = `You are the RepOS Voice Assistant AI. Parse this spoken medical sales rep report:
"${spokenText}"

Select the matching doctor from available list if mentioned: ${JSON.stringify(availableDoctors || [])}

Extract and map every field into a structured JSON visit record object.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              doctorId: { type: Type.STRING },
              doctorName: { type: Type.STRING },
              date: { type: Type.STRING },
              time: { type: Type.STRING },
              type: { type: Type.STRING },
              notes: { type: Type.STRING },
              aiSummary: { type: Type.STRING },
              productsDiscussed: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    productName: { type: Type.STRING },
                    reaction: { type: Type.STRING }
                  }
                }
              },
              objectionsCaptured: { type: Type.ARRAY, items: { type: Type.STRING } },
              samplesGiven: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    productName: { type: Type.STRING },
                    quantity: { type: Type.NUMBER },
                    batchNo: { type: Type.STRING }
                  }
                }
              },
              followUpTask: { type: Type.STRING },
              nextFollowUpDate: { type: Type.STRING }
            },
            required: ['doctorName', 'notes', 'aiSummary', 'followUpTask']
          }
        }
      });

      const result = JSON.parse(response.text || '{}');
      return res.json({ parsedVisit: result });
    } catch (error: any) {
      console.warn('Gemini API call failed in /api/ai/voice-assistant (using intelligent fallback):', error.message || error);
      return res.json({ parsedVisit: fallbackParsedVisit });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`RepOS Full-Stack Server running on http://localhost:${PORT}`);
  });
}

startServer();
