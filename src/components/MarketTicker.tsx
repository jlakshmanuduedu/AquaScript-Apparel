import React from 'react';
import { TrendingUp, TrendingDown, Minus, RefreshCw } from 'lucide-react';

interface TickerItem {
  commodity: string;
  market: string;
  price: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
}

const TICKER_DATA: TickerItem[] = [
  { commodity: 'Yellow Soybean', market: 'Indore Mandi', price: '₹4,890/qtl', change: '+₹65', trend: 'up' },
  { commodity: 'Dent Corn #2', market: 'Iowa Elevators', price: '$4.48/bu', change: '+$0.06', trend: 'up' },
  { commodity: 'Red Onion', market: 'Lasalgaon APMC', price: '₹2,550/qtl', change: '-₹110', trend: 'down' },
  { commodity: '1121 Basmati Paddy', market: 'Khanna Mandi', price: '₹3,940/qtl', change: '+₹45', trend: 'up' },
  { commodity: 'White Maize', market: 'Nakuru Hub', price: 'KSh 3,950/90kg', change: '+KSh 30', trend: 'up' },
  { commodity: 'Sharbati Wheat', market: 'Sehore Mandi', price: '₹3,150/qtl', change: '0', trend: 'stable' },
  { commodity: 'Medium Cotton', market: 'Rajkot APMC', price: '₹7,120/qtl', change: '-₹40', trend: 'down' },
];

export const MarketTicker: React.FC = () => {
  return (
    <div className="bg-emerald-950/95 border-b border-emerald-900/40 text-emerald-100 py-1.5 px-4 overflow-hidden text-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 shrink-0 font-semibold text-emerald-400 uppercase tracking-wider text-[10px]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>Regional Mandi Feeds:</span>
        </div>

        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar scroll-smooth whitespace-nowrap py-0.5">
          {TICKER_DATA.map((item, idx) => (
            <div key={idx} className="inline-flex items-center gap-2 bg-emerald-900/40 px-2.5 py-0.5 rounded border border-emerald-800/40 text-[11px]">
              <span className="font-semibold text-white">{item.commodity}</span>
              <span className="text-emerald-400/80">({item.market})</span>
              <span className="font-mono font-bold text-amber-300">{item.price}</span>
              <span
                className={`inline-flex items-center gap-0.5 text-[10px] font-semibold ${
                  item.trend === 'up'
                    ? 'text-emerald-400'
                    : item.trend === 'down'
                    ? 'text-rose-400'
                    : 'text-slate-400'
                }`}
              >
                {item.trend === 'up' && <TrendingUp className="w-2.5 h-2.5" />}
                {item.trend === 'down' && <TrendingDown className="w-2.5 h-2.5" />}
                {item.trend === 'stable' && <Minus className="w-2.5 h-2.5" />}
                {item.change}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
