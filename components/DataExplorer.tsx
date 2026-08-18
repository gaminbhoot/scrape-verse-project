'use client';

import React, { useState } from 'react';
import { ScraperRun } from '@/src/lib/types';
import { Database, Download, CheckCircle2, AlertCircle } from 'lucide-react';

interface DataExplorerProps {
  runs: ScraperRun[];
}

export function DataExplorer({ runs }: DataExplorerProps) {
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);

  const successfulRuns = runs.filter((r) => r.sampleData && r.sampleData.length > 0);
  const activeRun = selectedRunId
    ? runs.find((r) => r.id === selectedRunId)
    : successfulRuns[0] || runs[0];

  const exportJSON = () => {
    if (!activeRun?.sampleData) return;
    const blob = new Blob([JSON.stringify(activeRun.sampleData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `extracted_data_${activeRun.scraperId}_${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Verified Public Data Records
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Live extracted and schema-validated records ready for downstream consumption
            </p>
          </div>
        </div>

        <button
          onClick={exportJSON}
          disabled={!activeRun?.sampleData || activeRun.sampleData.length === 0}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono transition-all disabled:opacity-50 cursor-pointer border border-slate-700"
        >
          <Download className="w-3.5 h-3.5 text-cyan-400" />
          <span>Export JSON</span>
        </button>
      </div>

      {/* Table Display */}
      {!activeRun || !activeRun.sampleData || activeRun.sampleData.length === 0 ? (
        <div className="p-8 text-center border border-dashed border-slate-800 rounded-xl">
          <p className="text-xs font-mono text-slate-500">
            No extracted data payload yet. Run a collector from the matrix above.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-800/80 bg-slate-950/60">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50 text-slate-400">
                {Object.keys(activeRun.sampleData[0]).map((key) => (
                  <th key={key} className="py-2.5 px-3 uppercase tracking-wider font-bold text-slate-300">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {activeRun.sampleData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-900/30 transition-colors">
                  {Object.values(row).map((val: any, valIdx) => (
                    <td key={valIdx} className="py-2.5 px-3 text-slate-200">
                      {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
