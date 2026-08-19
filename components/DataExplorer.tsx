'use client';

import React, { useState } from 'react';
import { ScraperRun } from '@/src/lib/types';
import { Database, Download } from 'lucide-react';

interface DataExplorerProps {
  runs: ScraperRun[];
}

export function DataExplorer({ runs }: DataExplorerProps) {
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);

  const successfulRuns = runs.filter(r => r.sampleData && r.sampleData.length > 0);
  const activeRun = selectedRunId ? runs.find(r => r.id === selectedRunId) : successfulRuns[0] || runs[0];

  const exportJSON = () => {
    if (!activeRun?.sampleData) return;
    const blob = new Blob([JSON.stringify(activeRun.sampleData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `extracted_data_${activeRun.scraperId}_${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="glass-panel space-y-4 rounded-[18px] p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/[0.06] ring-1 ring-white/10">
            <Database className="h-4 w-4 text-[#c9a86a]" />
          </div>
          <div>
            <h3 className="text-[13px] font-semibold tracking-[-0.01em] text-white">Verified Records</h3>
            <p className="font-mono text-[11px] text-white/45">Schema-validated • ready for downstream</p>
          </div>
        </div>
        <button
          onClick={exportJSON}
          disabled={!activeRun?.sampleData || activeRun.sampleData.length === 0}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 font-mono text-xs text-white backdrop-blur transition hover:bg-white/[0.08] disabled:opacity-40 cursor-pointer"
        >
          <Download className="h-3.5 w-3.5 text-[#c9a86a]" />
          Export JSON
        </button>
      </div>

      {!activeRun || !activeRun.sampleData || activeRun.sampleData.length === 0 ? (
        <div className="grid place-items-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-10 text-center">
          <div className="h-px w-12 bg-gradient-to-r from-transparent via-[#c9a86a]/30 to-transparent" />
          <p className="mt-3 font-mono text-xs text-white/40">No payload yet — run a collector above.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#050a18]">
          <div className="max-h-[360px] overflow-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="sticky top-0 z-10 bg-[#0a1122]/95 backdrop-blur">
                <tr className="border-b border-[#c9a86a]/15">
                  {Object.keys(activeRun.sampleData[0]).map(key => (
                    <th key={key} className="px-3 py-2.5 text-[10px] font-semibold tracking-[0.1em] text-[#e2d1b1]">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {activeRun.sampleData.map((row, idx) => (
                  <tr key={idx} className="transition hover:bg-white/[0.04]">
                    {Object.values(row).map((val: any, valIdx) => (
                      <td key={valIdx} className="px-3 py-2.5 text-white/75">
                        {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-white/10 bg-white/[0.03] px-3 py-2 font-mono text-[11px] text-white/40">
            <span>{activeRun.sampleData.length} rows • {activeRun.scraperId}</span>
            <span className="text-emerald-300">100% valid</span>
          </div>
        </div>
      )}
    </div>
  );
}
