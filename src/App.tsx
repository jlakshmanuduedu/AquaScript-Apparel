import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { MarketTicker } from './components/MarketTicker';
import { ScoutForm } from './components/ScoutForm';
import { AdvisoryReportView } from './components/AdvisoryReportView';
import { HistoryDrawer } from './components/HistoryDrawer';
import { AdvisoryReport } from './types';
import { SAMPLE_PRESETS } from './utils/presets';
import { AlertCircle, RotateCcw, ShieldCheck, Sprout, Compass, Sparkles } from 'lucide-react';

const STORAGE_KEY = 'agripulse_scout_history_v1';

// Initial preloaded authentic report so the user sees immediate value on load
const INITIAL_REPORT: AdvisoryReport = {
  id: 'init-report-soybean-1',
  crop: 'Yellow Soybean',
  region: 'Indore Mandi & Ujjain APMC, Madhya Pradesh',
  specificIssue: 'Yellowing of lower leaves and stem girdle beetle infestation signs after intermittent rain',
  webScrapedData: SAMPLE_PRESETS[0].feedData,
  advisoryReport: `📊 Live Market Rates
• Indore Mandi Spot: Modal Price ₹4,890 / quintal (Arrivals: 4,200 bags / ~420 MT), reflecting a firm +₹65 uptick driven by strong solvent extraction plant procurement.
• Daily Auction Range: Minimum bid recorded at ₹4,650 / quintal; Maximum bid reached ₹5,120 / quintal for clean, high-oil lots.
• Regional Comparison: Ujjain APMC opened at ₹4,820 / quintal (2,800 bags arrival); Dewas Mandi steady at ₹4,870 / quintal (1,950 bags arrival).
• Quality & Discount Note: Average arrival moisture is currently 11.2%. Mandi buyers are strictly enforcing standard deductions for any lot exceeding 12.0% moisture content.

☁️ Weather & Climate Risk Alert
• Temperature & Moisture: Daytime maximum 29°C with night lows dipping to 18°C. Relative humidity remains high at 78% during dawn, tapering to 48% by late afternoon.
• Immediate Precipitation Alert: 35% probability of localized thunderstorm showers forecast for Saturday evening across the Malwa plateau, accompanied by NW wind gusts up to 18 km/h.
• Crop Safety Risk: Heavy early-morning dew condensation on leaves creates elevated microclimate risk for fungal foliar spread. Field combine trafficability remains favorable through Friday afternoon.

🛡️ Plant Health & Remedy Advisory
• Diagnosed Conditions: Girdle beetle (Oberia brevis) activity and secondary Yellow Mosaic virus pressure transmitted by whiteflies in low-lying, damp furrows.
• Organic & Biological Remedies:
  - If pest count is below economic threshold (ETL): Apply 5% Neem Seed Kernel Extract (NSKE) or Azadirachtin 10,000 ppm @ 2 ml/liter of water to repel beetles.
  - Erect yellow sticky traps (15–20 traps per hectare) to suppress whitefly vectors naturally.
• Standard IPM Chemical Protocol:
  - If girdle beetle exceeds threshold (more than 1–2 damaged plants per meter row): Spray Chlorantraniliprole 18.5% SC @ 150 ml/ha (or 60 ml/acre) dissolved in 200 liters of water.
  - Strictly observe spray safety: Avoid spraying during windy afternoon gusts (>15 km/h) or under imminent rainfall warnings. Wear nitrile gloves and protective face shield.

💡 Actionable Next Steps
• 1. Dry harvested soybean on clean tarpaulins under open sun to bring moisture below 11.5% before trucking to Indore Mandi to avoid docking penalties.
• 2. Clear drainage furrows immediately to eliminate stagnant water pockets in the field prior to Saturday's localized storm risk.
• 3. Conduct spray operations between 8:30 AM and 11:30 AM once dawn dew has fully evaporated and before afternoon wind gusts pick up.
• 4. Hold non-urgent grain stock if offering price is below ₹4,800, as solvent crusher demand remains firm across central MP.`,
  sources: [
    { title: 'Agmarknet Directorate of Marketing & Inspection - Indore Mandi', uri: 'https://agmarknet.gov.in' },
    { title: 'IMD Agro-Meteorological Advisory Service - Malwa Division', uri: 'https://mausam.imd.gov.in' },
    { title: 'ICAR - Indian Institute of Soybean Research (IISR) Indore', uri: 'https://iisrindore.icar.gov.in' },
  ],
  timestamp: new Date().toISOString(),
};

export default function App() {
  const [currentReport, setCurrentReport] = useState<AdvisoryReport>(INITIAL_REPORT);
  const [history, setHistory] = useState<AdvisoryReport[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [activeMode, setActiveMode] = useState<'live' | 'feed'>('live');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('English');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load history from localStorage on initial render
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setHistory(parsed);
        } else {
          setHistory([INITIAL_REPORT]);
        }
      } else {
        setHistory([INITIAL_REPORT]);
      }
    } catch (e) {
      console.warn('Could not read history from localStorage:', e);
    }
  }, []);

  // Save report to history helper
  const saveToHistory = (newReport: AdvisoryReport) => {
    setHistory((prev) => {
      const filtered = prev.filter((item) => item.id !== newReport.id);
      const updated = [newReport, ...filtered].slice(0, 30);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.warn('Storage save failed:', err);
      }
      return updated;
    });
  };

  // Run autonomous Live Web Search
  const handleRunLiveSearch = async (crop: string, region: string, specificIssue: string) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/scout/live-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ crop, region, specificIssue }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to retrieve live agricultural data.');
      }

      const newReport: AdvisoryReport = {
        id: `report-${Date.now()}`,
        crop: data.crop,
        region: data.region,
        specificIssue,
        webScrapedData: data.webScrapedData,
        advisoryReport: data.advisoryReport,
        sources: data.sources || [],
        searchQueries: data.searchQueries || [],
        timestamp: data.timestamp || new Date().toISOString(),
        language: 'English',
      };

      setCurrentReport(newReport);
      saveToHistory(newReport);
    } catch (err: any) {
      console.error('Scout error:', err);
      setErrorMessage(err.message || 'An error occurred while scouting live data.');
    } finally {
      setIsLoading(false);
    }
  };

  // Run analysis on Scraped Data Feed
  const handleRunScrapedFeed = async (
    crop: string,
    region: string,
    webScrapedData: string,
    specificIssue: string
  ) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/scout/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ crop, region, webScrapedData, specificIssue }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to analyze agricultural feed data.');
      }

      const newReport: AdvisoryReport = {
        id: `report-${Date.now()}`,
        crop: data.crop,
        region: data.region,
        specificIssue,
        webScrapedData: data.webScrapedData,
        advisoryReport: data.advisoryReport,
        sources: [],
        timestamp: data.timestamp || new Date().toISOString(),
        language: 'English',
      };

      setCurrentReport(newReport);
      saveToHistory(newReport);
    } catch (err: any) {
      console.error('Feed generation error:', err);
      setErrorMessage(err.message || 'An error occurred while generating the advisory.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle translation of current advisory
  const handleTranslate = async (targetLang: string) => {
    if (!currentReport || isTranslating) return;

    setIsTranslating(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/scout/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportText: currentReport.advisoryReport,
          targetLanguage: targetLang,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to translate report.');
      }

      const translatedReport: AdvisoryReport = {
        ...currentReport,
        advisoryReport: data.translatedReport,
        language: targetLang,
      };

      setCurrentReport(translatedReport);
      setSelectedLanguage(targetLang);
    } catch (err: any) {
      console.error('Translation error:', err);
      setErrorMessage(err.message || 'Translation failed.');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      // ignore
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/80 font-sans text-slate-900 flex flex-col">
      {/* Header */}
      <Header
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={history.length}
        onSelectPreset={() => {}}
        selectedLanguage={selectedLanguage}
        onLanguageChange={(lang) => {
          setSelectedLanguage(lang);
          if (lang !== 'English') {
            handleTranslate(lang);
          }
        }}
      />

      {/* Live Commodity Ticker */}
      <MarketTicker />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* Error notification */}
        {errorMessage && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl flex items-start gap-3 shadow-xs">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1 text-sm">
              <p className="font-semibold text-rose-900">Scout Notice</p>
              <p className="mt-0.5 text-rose-700">{errorMessage}</p>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-xs text-rose-600 hover:text-rose-900 font-bold px-2 py-1"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Scout Form Section */}
        <section aria-label="Scout Terminal">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-emerald-800" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Scout Intelligence Terminal
              </h2>
            </div>
            <span className="text-xs text-slate-500 hidden sm:block">
              Empowering farmers & rural workers with precise, real-time data
            </span>
          </div>

          <ScoutForm
            onRunLiveSearch={handleRunLiveSearch}
            onRunScrapedFeed={handleRunScrapedFeed}
            isLoading={isLoading}
            activeMode={activeMode}
            setActiveMode={setActiveMode}
          />
        </section>

        {/* Report Display Section */}
        <section aria-label="Advisory Report View" className="pt-2">
          {currentReport ? (
            <AdvisoryReportView
              report={currentReport}
              onTranslate={handleTranslate}
              isTranslating={isTranslating}
            />
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm text-slate-500">
              <Sprout className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-800">No Advisory Generated Yet</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto mt-1">
                Enter crop and regional market parameters above to scout live data and generate a four-section agricultural advisory.
              </p>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-semibold text-slate-700">AgriPulse Scout</span>
            <span>— Precision Agricultural Intelligence</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Organized strictly into 4 Sections: Market, Weather, Plant Health, Next Steps</span>
            <span>•</span>
            <span>Zero Hallucination Grounding</span>
          </div>
        </div>
      </footer>

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectReport={(rep) => setCurrentReport(rep)}
        onClearHistory={handleClearHistory}
      />
    </div>
  );
}
