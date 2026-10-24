import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  CloudRain,
  Shield,
  Lightbulb,
  Volume2,
  VolumeX,
  Share2,
  Printer,
  Copy,
  Check,
  ExternalLink,
  Info,
  Sparkles,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Play,
  Square,
} from 'lucide-react';
import { AdvisoryReport } from '../types';
import { parseAdvisoryReport } from '../utils/parser';

interface AdvisoryReportViewProps {
  report: AdvisoryReport;
  onTranslate: (targetLanguage: string) => void;
  isTranslating: boolean;
  onAudioPlay?: () => void;
}

export const AdvisoryReportView: React.FC<AdvisoryReportViewProps> = ({
  report,
  onTranslate,
  isTranslating,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [showSourcesModal, setShowSourcesModal] = useState<boolean>(false);
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [audioLoading, setAudioLoading] = useState<boolean>(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  // Parse the report text into the 4 structured sections
  const parsed = parseAdvisoryReport(report.advisoryReport);

  // Toggle checkbox for actionable task
  const toggleTask = (taskText: string) => {
    setCompletedTasks((prev) => ({
      ...prev,
      [taskText]: !prev[taskText],
    }));
  };

  // Clean copy text for WhatsApp or SMS
  const handleCopy = () => {
    const shareText = `🌾 AgriPulse Scout Advisory: ${report.crop} (${report.region})
Date: ${new Date(report.timestamp).toLocaleDateString()}

${report.advisoryReport}

---
Verified strictly against live web data feed.`;
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  // Handle TTS audio generation & playback
  const handlePlayAudio = async () => {
    if (isPlayingAudio && audioElement) {
      audioElement.pause();
      setIsPlayingAudio(false);
      return;
    }

    try {
      setAudioLoading(true);
      const res = await fetch('/api/scout/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: report.advisoryReport,
          voiceName: 'Kore',
        }),
      });

      const data = await res.json();
      if (data.success && data.audioBase64) {
        const audio = new Audio(`data:${data.mimeType};base64,${data.audioBase64}`);
        setAudioElement(audio);
        audio.onended = () => setIsPlayingAudio(false);
        audio.onerror = () => {
          setIsPlayingAudio(false);
          fallbackWebSpeech();
        };
        await audio.play();
        setIsPlayingAudio(true);
      } else {
        fallbackWebSpeech();
      }
    } catch (err) {
      console.warn('Backend TTS failed, using browser speech synthesis:', err);
      fallbackWebSpeech();
    } finally {
      setAudioLoading(false);
    }
  };

  const fallbackWebSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(
        report.advisoryReport.replace(/[#*_~`]/g, '').replace(/📊|☁️|🛡️|💡/g, '')
      );
      utterance.rate = 0.95;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioElement) {
        audioElement.pause();
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [audioElement]);

  return (
    <div className="space-y-6">
      {/* Report Summary Card & Action Bar */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-slate-900 rounded-2xl p-5 sm:p-6 text-white shadow-xl shadow-emerald-950/20 border border-emerald-700/50">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-400 text-emerald-950 mb-2">
              <Sparkles className="w-3 h-3 text-emerald-950" />
              Verified Agricultural Advisory
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              {report.crop}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200/90 mt-1 flex items-center gap-2">
              <span>📍 {report.region}</span>
              <span>•</span>
              <span>📅 {new Date(report.timestamp).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </p>
            {report.specificIssue && (
              <p className="text-xs text-amber-200 bg-amber-950/40 border border-amber-600/30 px-3 py-1.5 rounded-lg mt-2.5 inline-block">
                Reported Condition: <span className="font-semibold">{report.specificIssue}</span>
              </p>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Audio Readout */}
            <button
              onClick={handlePlayAudio}
              disabled={audioLoading}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition shadow-sm ${
                isPlayingAudio
                  ? 'bg-amber-400 text-emerald-950 hover:bg-amber-300'
                  : 'bg-emerald-800 hover:bg-emerald-700 text-white border border-emerald-600/50'
              }`}
              title="Spoken audio briefing for farmers"
            >
              {audioLoading ? (
                <RotateCcw className="w-3.5 h-3.5 animate-spin" />
              ) : isPlayingAudio ? (
                <Square className="w-3.5 h-3.5 fill-current" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-amber-300" />
              )}
              <span>{isPlayingAudio ? 'Stop Spoken Briefing' : 'Listen Spoken Advisory'}</span>
            </button>

            {/* Copy / WhatsApp */}
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 bg-emerald-800/80 hover:bg-emerald-700/80 text-white border border-emerald-600/40 px-3 py-2 rounded-xl text-xs font-semibold transition"
              title="Copy formatted advisory for WhatsApp or SMS"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Share / Copy</span>
                </>
              )}
            </button>

            {/* Print */}
            <button
              onClick={handlePrint}
              className="hidden sm:flex items-center gap-1.5 bg-emerald-800/80 hover:bg-emerald-700/80 text-white border border-emerald-600/40 px-3 py-2 rounded-xl text-xs font-semibold transition"
              title="Print farmer field sheet"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-300" />
              <span>Print</span>
            </button>

            {/* Sources Inspector */}
            <button
              onClick={() => setShowSourcesModal(true)}
              className="flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-700/80 text-white border border-slate-600/40 px-3 py-2 rounded-xl text-xs font-semibold transition"
            >
              <Info className="w-3.5 h-3.5 text-amber-300" />
              <span>Verify Sources {report.sources?.length ? `(${report.sources.length})` : ''}</span>
            </button>
          </div>
        </div>

        {/* Translation Bar */}
        <div className="mt-4 pt-3.5 border-t border-emerald-700/40 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="text-emerald-200/80 flex items-center gap-1.5">
            <span>Translate into Regional Dialect:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {['हिन्दी (Hindi)', 'ਪੰਜਾਬੀ (Punjabi)', 'मराठी (Marathi)', 'తెలుగు (Telugu)', 'Español', 'Kiswahili'].map(
              (lang) => (
                <button
                  key={lang}
                  disabled={isTranslating}
                  onClick={() => onTranslate(lang)}
                  className="px-2.5 py-1 rounded-lg bg-emerald-950/60 hover:bg-emerald-950 text-emerald-200 border border-emerald-700/40 text-[11px] font-medium transition disabled:opacity-50"
                >
                  {lang.split(' ')[0]}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* THE FOUR CLEAR SECTIONS */}
      <div className="grid grid-cols-1 gap-6">
        {/* SECTION 1: 📊 Live Market Rates */}
        <div className="bg-white rounded-2xl shadow-md shadow-slate-200/50 border border-slate-200/90 overflow-hidden transition hover:shadow-lg">
          <div className="bg-gradient-to-r from-emerald-800 to-teal-900 px-5 py-3.5 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-emerald-200" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <span>📊 Live Market Rates</span>
                </h3>
                <p className="text-[11px] text-emerald-200/80">
                  Current commodity prices from regional markets & mandis
                </p>
              </div>
            </div>
            <span className="text-[11px] font-mono font-semibold bg-emerald-950/60 text-emerald-200 px-2.5 py-1 rounded-md border border-emerald-700/40">
              Zero Hallucination
            </span>
          </div>

          <div className="p-5 sm:p-6 bg-emerald-50/20">
            <div className="prose prose-emerald max-w-none text-slate-800 text-sm leading-relaxed whitespace-pre-wrap font-sans">
              {parsed.marketRatesRaw}
            </div>
          </div>
        </div>

        {/* SECTION 2: ☁️ Weather & Climate Risk Alert */}
        <div className="bg-white rounded-2xl shadow-md shadow-slate-200/50 border border-slate-200/90 overflow-hidden transition hover:shadow-lg">
          <div className="bg-gradient-to-r from-sky-800 to-blue-900 px-5 py-3.5 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-sky-700 flex items-center justify-center">
                <CloudRain className="w-4 h-4 text-sky-200" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <span>☁️ Weather & Climate Risk Alert</span>
                </h3>
                <p className="text-[11px] text-sky-200/80">
                  Immediate crop safety warnings, precipitation, and field microclimate
                </p>
              </div>
            </div>
            <span className="text-[11px] font-semibold bg-sky-950/60 text-sky-200 px-2.5 py-1 rounded-md border border-sky-700/40 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-amber-400" />
              <span>Immediate Warnings</span>
            </span>
          </div>

          <div className="p-5 sm:p-6 bg-sky-50/20">
            <div className="prose prose-sky max-w-none text-slate-800 text-sm leading-relaxed whitespace-pre-wrap font-sans">
              {parsed.weatherRiskRaw}
            </div>
          </div>
        </div>

        {/* SECTION 3: 🛡️ Plant Health & Remedy Advisory */}
        <div className="bg-white rounded-2xl shadow-md shadow-slate-200/50 border border-slate-200/90 overflow-hidden transition hover:shadow-lg">
          <div className="bg-gradient-to-r from-amber-800 to-amber-950 px-5 py-3.5 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-700 flex items-center justify-center">
                <Shield className="w-4 h-4 text-amber-200" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <span>🛡️ Plant Health & Remedy Advisory</span>
                </h3>
                <p className="text-[11px] text-amber-200/80">
                  Organic or standard treatments for reported symptoms & active regional pests
                </p>
              </div>
            </div>
            <span className="text-[11px] font-semibold bg-amber-950/70 text-amber-200 px-2.5 py-1 rounded-md border border-amber-700/50">
              Organic + Standard IPM
            </span>
          </div>

          <div className="p-5 sm:p-6 bg-amber-50/20">
            <div className="prose prose-amber max-w-none text-slate-800 text-sm leading-relaxed whitespace-pre-wrap font-sans">
              {parsed.plantHealthRaw}
            </div>
          </div>
        </div>

        {/* SECTION 4: 💡 Actionable Next Steps */}
        <div className="bg-white rounded-2xl shadow-md shadow-slate-200/50 border border-slate-200/90 overflow-hidden transition hover:shadow-lg">
          <div className="bg-gradient-to-r from-emerald-900 to-green-950 px-5 py-3.5 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center">
                <Lightbulb className="w-4 h-4 text-amber-300" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <span>💡 Actionable Next Steps</span>
                </h3>
                <p className="text-[11px] text-emerald-200/80">
                  What the farmer should do today (Field operations, timing windows & market actions)
                </p>
              </div>
            </div>
            <span className="text-[11px] font-semibold bg-emerald-800/80 text-emerald-200 px-2.5 py-1 rounded-md border border-emerald-600/40">
              Interactive Checklist
            </span>
          </div>

          <div className="p-5 sm:p-6 bg-emerald-50/20 space-y-4">
            {/* Interactive Checklist for Today */}
            <div className="space-y-2.5">
              <div className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Farmer's Field Action Items:</span>
              </div>
              <div className="space-y-2">
                {parsed.actionStepsList.map((step, idx) => (
                  <div
                    key={idx}
                    onClick={() => toggleTask(step)}
                    className={`flex items-start gap-3 p-3 rounded-xl border transition cursor-pointer ${
                      completedTasks[step]
                        ? 'bg-emerald-100/60 border-emerald-300 text-slate-500 line-through'
                        : 'bg-white hover:bg-emerald-50/40 border-slate-200 text-slate-800 shadow-xs'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={!!completedTasks[step]}
                      onChange={() => toggleTask(step)}
                      className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                    <span className="text-sm font-medium leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Raw Text for Complete Context */}
            <div className="pt-3 border-t border-slate-200/80">
              <div className="prose prose-emerald max-w-none text-slate-800 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                {parsed.actionableStepsRaw}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sources & Grounding Modal */}
      {showSourcesModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200">
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50 rounded-t-2xl">
              <div>
                <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  Live Web Grounding Verification
                </h4>
                <p className="text-xs text-slate-500">
                  Strictly verified data sources retrieved for {report.crop} in {report.region}
                </p>
              </div>
              <button
                onClick={() => setShowSourcesModal(false)}
                className="w-8 h-8 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center font-bold text-sm transition"
              >
                ✕
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              {/* Grounding Web Links */}
              {report.sources && report.sources.length > 0 ? (
                <div className="space-y-2">
                  <div className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                    Retrieved Live Web Sources ({report.sources.length}):
                  </div>
                  <div className="space-y-2">
                    {report.sources.map((src, i) => (
                      <a
                        key={i}
                        href={src.uri}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 text-emerald-800 transition"
                      >
                        <span className="font-medium truncate pr-2 text-slate-800">{src.title}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs">
                  This report was analyzed directly from the input Live Web Scraped Data Feed provided in the Scout Terminal.
                </div>
              )}

              {/* Scraped Feed Raw View */}
              <div className="space-y-1.5 pt-2">
                <div className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                  Raw Live Scraped Data Feed:
                </div>
                <div className="p-3 bg-slate-900 text-emerald-300 font-mono text-[11px] rounded-xl overflow-x-auto max-h-60 whitespace-pre-wrap leading-relaxed">
                  {report.webScrapedData}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 rounded-b-2xl flex justify-end">
              <button
                onClick={() => setShowSourcesModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold transition"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
