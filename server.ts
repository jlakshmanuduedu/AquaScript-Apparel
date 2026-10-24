import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Google GenAI client with required User-Agent header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const SYSTEM_INSTRUCTIONS = `You are AgriPulse Scout, an advanced agricultural intelligence and web-aware assistant designed to empower farmers and rural workers with precise, real-time data. Never hallucinate market prices or agricultural guidelines. Rely strictly on retrieved live data. 
Always organize your response into four clear sections:
- 📊 Live Market Rates (Current commodity prices from regional markets)
- ☁️ Weather & Climate Risk Alert (Immediate crop safety warnings)
- 🛡️ Plant Health & Remedy Advisory (Organic or standard treatments for reported symptoms)
- 💡 Actionable Next Steps (What the farmer should do today)
Tone: Respectful, practical, objective, and easy to understand.`;

// API endpoint to scout live web data using Google Search Grounding
app.post('/api/scout/live-search', async (req: Request, res: Response) => {
  try {
    const { crop, region, specificIssue } = req.body;
    if (!crop || !region) {
      res.status(400).json({ error: 'Crop/commodity and region/market are required.' });
      return;
    }

    if (!process.env.GEMINI_API_KEY) {
      res.status(500).json({
        error: 'GEMINI_API_KEY is not configured. Please ensure it is set in Settings > Secrets.',
      });
      return;
    }

    const searchQuery = `Latest live market prices mandi APMC spot rates commodity report and regional weather forecast and crop health pest advisories for ${crop} in ${region} ${specificIssue ? `issue: ${specificIssue}` : ''}`;

    // Step 1: Query live web information using Google Search grounding
    const searchResponse = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Perform an in-depth web search for live agricultural market data, APMC/Mandi spot rates, regional weather alerts, and pest/disease status for ${crop} in ${region}.
Retrieve raw factual data including:
- Specific market/mandi names, dates, modal prices, min/max prices, and price trend.
- Current weather, precipitation forecast, humidity, wind, and frost/heat warnings for the agricultural belt in ${region}.
- Current plant protection, disease or pest alerts (e.g. rust, stem borer, blight, armyworm, whitefly) affecting ${crop} in this area ${specificIssue ? `(specifically focusing on reported symptom: "${specificIssue}")` : ''}.
Provide a factual, unembellished, comprehensive data feed transcription.`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const webScrapedData = searchResponse.text || 'No live text feed retrieved.';
    const groundingChunks = searchResponse.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const webSearchQueries = searchResponse.candidates?.[0]?.groundingMetadata?.webSearchQueries || [];

    // Extract citations
    const sources = groundingChunks
      .map((chunk: any) => {
        if (chunk.web) {
          return {
            title: chunk.web.title || chunk.web.uri,
            uri: chunk.web.uri,
          };
        }
        return null;
      })
      .filter((source: any) => source !== null && source.uri);

    // Step 2: Run through the exact AgriPulse Scout prompt template
    const userPrompt = `Analyze the following live web data retrieved for ${crop} in ${region} and generate a complete advisory report for a farmer.

Live Web Data Feed:
${webScrapedData}
${specificIssue ? `\nFarmer Reported Condition/Symptoms:\n${specificIssue}` : ''}

Provide the output strictly following the structured format defined in your system instructions. Ensure all financial figures and market names match the provided feed.`;

    const advisoryResponse = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTIONS,
        temperature: 0.2, // Low temperature for high factual precision
      },
    });

    const advisoryText = advisoryResponse.text || '';

    res.json({
      success: true,
      crop,
      region,
      webScrapedData,
      advisoryReport: advisoryText,
      sources,
      searchQueries: webSearchQueries,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error during live scout search:', error);
    res.status(500).json({
      error: error.message || 'Failed to retrieve live agricultural scout data.',
    });
  }
});

// API endpoint to analyze custom or user-provided web scraped data
app.post('/api/scout/generate', async (req: Request, res: Response) => {
  try {
    const { crop, region, webScrapedData, specificIssue } = req.body;

    if (!crop || !region || !webScrapedData) {
      res.status(400).json({
        error: 'Crop, region, and live web scraped data feed are all required.',
      });
      return;
    }

    if (!process.env.GEMINI_API_KEY) {
      res.status(500).json({
        error: 'GEMINI_API_KEY is not configured. Please ensure it is set in Settings > Secrets.',
      });
      return;
    }

    const userPrompt = `Analyze the following live web data retrieved for ${crop} in ${region} and generate a complete advisory report for a farmer.

Live Web Data Feed:
${webScrapedData}
${specificIssue ? `\nFarmer Reported Condition/Symptoms:\n${specificIssue}` : ''}

Provide the output strictly following the structured format defined in your system instructions. Ensure all financial figures and market names match the provided feed.`;

    const advisoryResponse = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTIONS,
        temperature: 0.2,
      },
    });

    res.json({
      success: true,
      crop,
      region,
      webScrapedData,
      advisoryReport: advisoryResponse.text || '',
      sources: [],
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error generating advisory:', error);
    res.status(500).json({
      error: error.message || 'Failed to generate agricultural advisory report.',
    });
  }
});

// API endpoint for Text-to-Speech audio readout for rural accessibility
app.post('/api/scout/tts', async (req: Request, res: Response) => {
  try {
    const { text, voiceName = 'Kore' } = req.body;
    if (!text) {
      res.status(400).json({ error: 'Text is required for speech synthesis.' });
      return;
    }

    // Clean markdown symbols to make spoken speech natural
    const cleanText = text
      .replace(/[#*_~`]/g, '')
      .replace(/📊|☁️|🛡️|💡/g, '')
      .slice(0, 1800); // Practical length for spoken briefing

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `Read this agricultural advisory clearly and respectfully for a farmer:\n${cleanText}`,
              speechMetadata: {
                style: 'Clear, respectful, practical agricultural radio announcer',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName },
          },
        },
      },
    });

    const base64Audio =
      response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
      res.status(500).json({ error: 'No audio stream returned from Gemini TTS.' });
      return;
    }

    res.json({
      success: true,
      audioBase64: base64Audio,
      mimeType: 'audio/wav',
    });
  } catch (error: any) {
    console.error('TTS error:', error);
    res.status(500).json({
      error: error.message || 'Failed to generate speech.',
    });
  }
});

// API endpoint for multilingual translation of advisory while keeping structure
app.post('/api/scout/translate', async (req: Request, res: Response) => {
  try {
    const { reportText, targetLanguage } = req.body;
    if (!reportText || !targetLanguage) {
      res.status(400).json({ error: 'Report text and target language are required.' });
      return;
    }

    const translatePrompt = `You are a professional agricultural translator.
Translate the following AgriPulse Scout advisory report into ${targetLanguage}.
Keep all numerical prices, currencies, market names, percentages, metric/imperial units, and chemicals EXACTLY accurate.
Preserve the exact four section headers with their emojis:
- 📊 Live Market Rates (or translated equivalent with 📊)
- ☁️ Weather & Climate Risk Alert (or translated equivalent with ☁️)
- 🛡️ Plant Health & Remedy Advisory (or translated equivalent with 🛡️)
- 💡 Actionable Next Steps (or translated equivalent with 💡)

Tone: Respectful, practical, objective, and easy for rural farmers to understand.

Report to translate:
${reportText}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: translatePrompt,
      config: {
        temperature: 0.1,
      },
    });

    res.json({
      success: true,
      translatedReport: response.text || '',
      targetLanguage,
    });
  } catch (error: any) {
    console.error('Translation error:', error);
    res.status(500).json({
      error: error.message || 'Translation failed.',
    });
  }
});

// Setup Vite in middleware mode or serve static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AgriPulse Scout server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
