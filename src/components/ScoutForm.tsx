import React, { useState } from 'react';
import {
  Search,
  FileText,
  Sparkles,
  MapPin,
  Leaf,
  AlertCircle,
  RotateCcw,
  Zap,
  Globe2,
  ChevronDown,
} from 'lucide-react';
import { SAMPLE_PRESETS } from '../utils/presets';
import { SamplePreset } from '../types';

interface ScoutFormProps {
  onRunLiveSearch: (crop: string, region: string, issue: string) => void;
  onRunScrapedFeed: (crop: string, region: string, feed: string, issue: string) => void;
  isLoading: boolean;
  activeMode: 'live' | 'feed';
  setActiveMode: (mode: 'live' | 'feed') => void;
}

const COMMON_CROPS = [
  'Yellow Soybean',
  'Yellow Dent Corn',
  'Red Onion',
  '1121 Basmati Paddy',
  'Wheat (Sharbati/Lokwan)',
  'White Maize',
  'Medium Staple Cotton',
  'Tomato',
  'Arabica/Robusta Coffee',
  'Mustard / Rapeseed',
];

const COMMON_REGIONS = [
  'Indore Mandi, Madhya Pradesh',
  'Des Moines, Iowa',
  'Lasalgaon APMC, Nashik',
  'Khanna Mandi, Punjab',
  'Nakuru Hub, Kenya',
  'Guntur Mirchi Yard, AP',
  'Rajkot APMC, Gujarat',
  'São Paulo, Brazil',
];

export const ScoutForm: React.FC<ScoutFormProps> = ({
  onRunLiveSearch,
  onRunScrapedFeed,
  isLoading,
  activeMode,
  setActiveMode,
}) => {
  const [crop, setCrop] = useState<string>('Yellow Soybean');
  const [region, setRegion] = useState<string>('Indore Mandi, Madhya Pradesh');
  const [issue, setIssue] = useState<string>('Yellowing lower leaves and stem girdle beetle infestation signs');
  const [feedData, setFeedData] = useState<string>(SAMPLE_PRESETS[0].feedData);
  const [showPresetsDropdown, setShowPresetsDropdown] = useState<boolean>(false);

  const handleSelectPreset = (preset: SamplePreset) => {
    setCrop(preset.crop);
    setRegion(preset.region);
    setIssue(preset.issue);
    setFeedData(preset.feedData);
    setActiveMode('feed');
    setShowPresetsDropdown(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeMode === 'live') {
      onRunLiveSearch(crop.trim(), region.trim(), issue.trim());
    } else {
      onRunScrapedFeed(crop.trim(), region.trim(), feedData.trim(), issue.trim());
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/80 overflow-hidden">
      {/* Mode Selector Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-50/70 p-1.5 gap-1.5">
        <button
          type="button"
          onClick={() => setActiveMode('live')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeMode === 'live'
              ? 'bg-emerald-700 text-white shadow-md shadow-emerald-800/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Globe2 className="w-4 h-4 text-emerald-200" />
          <span>Live Web Scout</span>
          <span className="hidden sm:inline-block text-[10px] font-normal px-2 py-0.5 rounded-full bg-emerald-800/60 text-emerald-100 border border-emerald-600/40">
            Google Search Grounding
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMode('feed')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeMode === 'feed'
              ? 'bg-emerald-700 text-white shadow-md shadow-emerald-800/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4 text-emerald-200" />
          <span>Live Scraped Data Feed</span>
          <span className="hidden sm:inline-block text-[10px] font-normal px-2 py-0.5 rounded-full bg-emerald-800/60 text-emerald-100 border border-emerald-600/40">
            APMC / USDA Bulletins
          </span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
        {/* Top instruction banner */}
        <div className="bg-emerald-50/80 border border-emerald-200/70 rounded-xl p-3.5 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
            <Zap className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-xs text-emerald-950 flex-1">
            <p className="font-semibold text-emerald-900 mb-0.5">
              {activeMode === 'live'
                ? 'AgriPulse Autonomous Web Scout Active'
                : 'Scraped Data Feed Mode: Factual Grounding Only'}
            </p>
            <p className="text-emerald-800/90 leading-relaxed">
              {activeMode === 'live'
                ? 'Retrieves fresh market mandi rates, regional weather forecasts, and agronomy alerts from live web sources with complete source citations.'
                : 'Paste actual scraped web bulletin, APMC auction logs, or load verified agricultural feeds below. Figures will be audited strictly without hallucination.'}
            </p>
          </div>

          {/* Quick presets button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowPresetsDropdown(!showPresetsDropdown)}
              className="text-xs bg-white hover:bg-emerald-50 text-emerald-900 font-medium px-3 py-1.5 rounded-lg border border-emerald-300 shadow-sm flex items-center gap-1.5 transition shrink-0"
            >
              <span>Load Preset Feed</span>
              <ChevronDown className="w-3.5 h-3.5 text-emerald-700" />
            </button>

            {showPresetsDropdown && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 py-2 divide-y divide-slate-100">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Verified Agricultural Feeds
                </div>
                {SAMPLE_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className="w-full text-left px-3.5 py-2.5 hover:bg-emerald-50 transition text-xs flex flex-col gap-0.5"
                  >
                    <span className="font-semibold text-slate-900">{preset.title}</span>
                    <span className="text-[11px] text-emerald-700 font-medium">
                      {preset.crop} • {preset.currency}
                    </span>
                    <span className="text-[10px] text-slate-500 line-clamp-1">{preset.region}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Crop & Region Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Crop Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Leaf className="w-3.5 h-3.5 text-emerald-600" />
              Crop / Commodity
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                placeholder="e.g. Yellow Soybean, Basmati Paddy, Corn..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition shadow-xs"
              />
            </div>
            {/* Quick chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {COMMON_CROPS.slice(0, 5).map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setCrop(c)}
                  className={`text-[11px] px-2 py-0.5 rounded-md border transition ${
                    crop === c
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300 font-semibold'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Region Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              Region / Mandi / Market
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder="e.g. Indore Mandi MP, Des Moines IA, Lasalgaon..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition shadow-xs"
              />
            </div>
            {/* Quick chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {COMMON_REGIONS.slice(0, 4).map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setRegion(r)}
                  className={`text-[11px] px-2 py-0.5 rounded-md border transition ${
                    region === r
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300 font-semibold'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200'
                  }`}
                >
                  {r.split(',')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Symptoms / Field Note Input */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              Observed Crop Symptoms / Farmer Query
            </span>
            <span className="text-[11px] font-normal text-slate-500">Optional</span>
          </label>
          <input
            type="text"
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
            placeholder="e.g. Yellow leaves with black dots, armyworm leaf damage, stem borer, dew blight..."
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
          />
        </div>

        {/* Scraped Feed Area (Visible when in 'feed' mode) */}
        {activeMode === 'feed' && (
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-emerald-600" />
                Live Web Scraped Data Feed (&#123;&#123;web_scraped_data&#125;&#125;)
              </label>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-500">{feedData.length} characters</span>
                <button
                  type="button"
                  onClick={() => setFeedData('')}
                  className="text-[11px] text-rose-600 hover:text-rose-700 hover:underline"
                >
                  Clear Feed
                </button>
              </div>
            </div>
            <textarea
              required
              rows={6}
              value={feedData}
              onChange={(e) => setFeedData(e.target.value)}
              placeholder="Paste raw scraped commodity ticker, APMC auction logs, agro-met bulletin, or mandi SMS..."
              className="w-full p-3 font-mono text-xs text-slate-800 bg-slate-900/5 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition leading-relaxed"
            />
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2 flex items-center justify-end gap-3">
          <button
            type="submit"
            disabled={isLoading || !crop || !region || (activeMode === 'feed' && !feedData)}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 text-white font-semibold text-sm rounded-xl shadow-lg shadow-emerald-700/25 flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin text-emerald-200" />
                <span>
                  {activeMode === 'live'
                    ? 'Retrieving Live Web Data & Generating Report...'
                    : 'Auditing Scraped Data Feed...'}
                </span>
              </>
            ) : (
              <>
                {activeMode === 'live' ? (
                  <Search className="w-4 h-4 text-emerald-200" />
                ) : (
                  <Sparkles className="w-4 h-4 text-amber-300" />
                )}
                <span>
                  {activeMode === 'live'
                    ? 'Scout Live Market & Agro Data'
                    : 'Generate AgriPulse Advisory Report'}
                </span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
