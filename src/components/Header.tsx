import React from 'react';
import { Sprout, Globe, History, Activity, ShieldCheck, Sparkles, BookOpen } from 'lucide-react';

interface HeaderProps {
  onOpenHistory: () => void;
  historyCount: number;
  onSelectPreset: (presetId: string) => void;
  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;
}

const LANGUAGES = [
  { code: 'English', label: 'English' },
  { code: 'Hindi', label: 'हिन्दी (Hindi)' },
  { code: 'Punjabi', label: 'ਪੰਜਾਬੀ (Punjabi)' },
  { code: 'Marathi', label: 'मराठी (Marathi)' },
  { code: 'Telugu', label: 'తెలుగు (Telugu)' },
  { code: 'Spanish', label: 'Español' },
  { code: 'Swahili', label: 'Kiswahili' },
];

export const Header: React.FC<HeaderProps> = ({
  onOpenHistory,
  historyCount,
  selectedLanguage,
  onLanguageChange,
}) => {
  return (
    <header className="border-b border-emerald-900/20 bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 text-white sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-amber-400 p-0.5 shadow-lg shadow-emerald-950/50 flex items-center justify-center">
            <div className="w-full h-full bg-emerald-950 rounded-[10px] flex items-center justify-center">
              <Sprout className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                AgriPulse <span className="text-amber-400 font-extrabold">Scout</span>
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase bg-emerald-800/60 text-emerald-200 border border-emerald-700/50 rounded-md">
                <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
                Live Web Aware
              </span>
            </div>
            <p className="text-xs text-emerald-200/80 hidden sm:block">
              Agricultural Intelligence & Regional Mandi / Agro-Met Advisory System
            </p>
          </div>
        </div>

        {/* Status indicator and actions */}
        <div className="flex items-center gap-3">
          {/* Grounding guarantee */}
          <div className="hidden md:flex items-center gap-1.5 text-xs text-emerald-300 bg-emerald-900/50 border border-emerald-700/40 px-2.5 py-1 rounded-lg">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Strict Zero-Hallucination Grounding</span>
          </div>

          {/* Language selector */}
          <div className="flex items-center gap-1.5 bg-emerald-950/70 border border-emerald-700/40 rounded-lg px-2.5 py-1 text-xs">
            <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <select
              aria-label="Select report display language"
              value={selectedLanguage}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="bg-transparent text-emerald-100 text-xs font-medium focus:outline-none cursor-pointer pr-1"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-slate-900 text-white">
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          {/* History drawer trigger */}
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 bg-emerald-800/40 hover:bg-emerald-800/70 border border-emerald-600/30 hover:border-emerald-500/50 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition shadow-sm"
            title="View saved advisories"
          >
            <History className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">Archive</span>
            {historyCount > 0 && (
              <span className="bg-amber-400 text-emerald-950 font-bold px-1.5 py-0.2 rounded-full text-[10px]">
                {historyCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
