'use client';

import React from 'react';
import { HealEvent } from '@/src/lib/types';
import { GitCompare, Sparkles, Check, ArrowRight } from 'lucide-react';

interface DiffViewerProps {
  healEvents: HealEvent[];
}

export function DiffViewer({ healEvents }: DiffViewerProps) {
  if (healEvents.length === 0) {
    return (
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 text-center">
        <GitCompare className="w-8 h-8 text-slate-600 mx-auto mb-2" />
        <h3 className="text-sm font-semibold text-slate-300">Selector Diff & Heuristic Audit</h3>
        <p className="text-xs text-slate-400 mt-1 font-mono">
          No self-healing events recorded yet. Run the Demo Playground to inspect live selector re-mapping.
        </p>
      </div>
    );
  }

  const latest = healEvents[0];

  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <GitCompare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              Selector Mutation & AI Healing Audit
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Confidence: {latest.confidenceScore}%
              </span>
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Automated DOM diffing & heuristic re-alignment records
            </p>
          </div>
        </div>

        <span className="text-[11px] font-mono text-slate-400">
          Trigger: {latest.triggerReason}
        </span>
      </div>

      {/* Diff Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400">
              <th className="py-2 px-3">Field</th>
              <th className="py-2 px-3 text-rose-400">Broken / Deprecated Selector</th>
              <th className="py-2 px-3 text-center">Transform</th>
              <th className="py-2 px-3 text-emerald-400">AI Self-Healed Selector</th>
              <th className="py-2 px-3 text-slate-400">Strategy</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {latest.repairedSelectors.map((r) => (
              <tr key={r.field} className="hover:bg-slate-900/40">
                <td className="py-2.5 px-3 font-semibold text-white">{r.field}</td>
                <td className="py-2.5 px-3 text-rose-300 bg-rose-950/10 rounded">
                  <code className="text-[11px]">{r.oldSelector}</code>
                </td>
                <td className="py-2.5 px-3 text-center text-slate-500">
                  <ArrowRight className="w-3.5 h-3.5 inline text-cyan-400" />
                </td>
                <td className="py-2.5 px-3 text-emerald-300 bg-emerald-950/10 rounded">
                  <code className="text-[11px] font-semibold">{r.newSelector}</code>
                </td>
                <td className="py-2.5 px-3 text-slate-400 text-[11px]">
                  {r.strategy}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CI/CD PR Footer */}
      {latest.prGenerated && (
        <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs font-mono text-slate-400">
          <span>
            GitHub Action Artifact: <strong className="text-cyan-300">{latest.prGenerated}</strong>
          </span>
          <span className="text-emerald-400 flex items-center gap-1">
            <Check className="w-3.5 h-3.5" /> Auto-Committed to Repo
          </span>
        </div>
      )}
    </div>
  );
}
