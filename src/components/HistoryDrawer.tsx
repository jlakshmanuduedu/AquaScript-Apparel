import React from 'react';
import { History, Trash2, Calendar, MapPin, ChevronRight, X, Clock } from 'lucide-react';
import { AdvisoryReport } from '../types';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: AdvisoryReport[];
  onSelectReport: (report: AdvisoryReport) => void;
  onClearHistory: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectReport,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-700" />
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Advisory Archive</h3>
              <p className="text-xs text-slate-500">{history.length} scouted reports saved locally</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {history.length > 0 && (
              <button
                onClick={onClearHistory}
                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                title="Clear all history"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-slate-100">
          {history.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <Clock className="w-10 h-10 text-slate-300 mb-2" />
              <p className="text-sm font-medium text-slate-600">No saved advisories yet</p>
              <p className="text-xs text-slate-400 mt-1">
                Generated reports will automatically be archived here for price tracking and field reference.
              </p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectReport(item);
                  onClose();
                }}
                className="py-3 px-2 hover:bg-emerald-50/60 rounded-xl cursor-pointer transition flex items-center justify-between group"
              >
                <div className="space-y-1">
                  <div className="font-semibold text-sm text-slate-900 group-hover:text-emerald-900">
                    {item.crop}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span className="line-clamp-1">{item.region}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(item.timestamp).toLocaleString()}</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 transition" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
