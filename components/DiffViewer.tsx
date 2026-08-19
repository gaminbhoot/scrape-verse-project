'use client';

import React from 'react';
import { HealEvent } from '@/src/lib/types';
import { GitCompare, ArrowRight, Check } from 'lucide-react';

interface DiffViewerProps {
  healEvents: HealEvent[];
}

export function DiffViewer({ healEvents }: DiffViewerProps) {
  if (healEvents.length === 0) {
    return (
      <div className="glass-panel grid place-items-center rounded-[18px] p-8 text-center">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/[0.06] ring-1 ring-white/10">
          <GitCompare className="h-5 w-5 text-white/40" />
        </div>
        <h3 className="mt-3 text-sm font-semibold tracking-[-0.01em] text-white">Heuristic Audit</h3>
        <p className="mt-1 max-w-md font-mono text-xs leading-5 text-white/45">
          No healing events yet — run the Demo Playground above to generate a live selector diff.
        </p>
      </div>
    );
  }

  const latest = healEvents[0];

  return (
    <div className="glass-panel space-y-4 rounded-[18px] p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#c9a86a]/10 ring-1 ring-[#c9a86a]/20">
            <GitCompare className="h-4 w-4 text-[#c9a86a]" />
          </div>
          <div>
            <h3 className="text-[13px] font-semibold tracking-[-0.01em] text-white">
              Selector Mutation & Healing Audit
              <span className="ml-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] font-semibold tracking-wide text-emerald-200">
                {latest.confidenceScore}% confidence
              </span>
            </h3>
            <p className="font-mono text-[11px] text-white/45">DOM diff • semantic re-alignment</p>
          </div>
        </div>
        <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[11px] text-white/50">
          Trigger: {latest.triggerReason}
        </span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#050a18]">
        <table className="w-full text-left font-mono text-xs">
          <thead className="bg-white/[0.04] text-[10px] tracking-[0.08em] text-white/40">
            <tr className="border-b border-white/10">
              <th className="px-3 py-2.5">FIELD</th>
              <th className="px-3 py-2.5 text-rose-300">BROKEN</th>
              <th className="px-3 py-2.5 text-center text-white/30" />
              <th className="px-3 py-2.5 text-emerald-300">HEALED</th>
              <th className="px-3 py-2.5">STRATEGY</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06]">
            {latest.repairedSelectors.map(r => (
              <tr key={r.field} className="hover:bg-white/[0.03]">
                <td className="px-3 py-3 font-semibold text-white">{r.field}</td>
                <td className="px-3 py-3">
                  <code className="rounded-full border border-rose-500/20 bg-rose-500/10 px-2 py-1 text-[11px] text-rose-200">{r.oldSelector}</code>
                </td>
                <td className="px-3 py-3 text-center">
                  <ArrowRight className="mx-auto h-3.5 w-3.5 text-[#c9a86a]" />
                </td>
                <td className="px-3 py-3">
                  <code className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-[11px] font-semibold text-emerald-200">
                    {r.newSelector}
                  </code>
                </td>
                <td className="px-3 py-3 text-[11px] text-white/50">{r.strategy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {latest.prGenerated && (
        <div className="flex flex-col items-start justify-between gap-2 border-t border-white/10 pt-3 font-mono text-[11px] text-white/45 sm:flex-row sm:items-center">
          <span>
            PR Artifact: <strong className="font-semibold text-cyan-300">{latest.prGenerated}</strong>
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-emerald-200">
            <Check className="h-3 w-3" /> Auto-committed
          </span>
        </div>
      )}
    </div>
  );
}
