'use client';

import React, { useState } from 'react';
import { ShieldAlert, Sparkles, CheckCircle2, Play, ArrowRight, RotateCcw, Bug, Terminal } from 'lucide-react';

interface BreakSimulatorProps {
  onSimulateBreak: () => Promise<void>;
  onRunBroken: () => Promise<void>;
  onHeal: () => Promise<void>;
  status: 'idle' | 'broken' | 'failed-run' | 'healing' | 'recovered';
  lastHealStats?: { timeToHealMs: number; cliCommand: string; confidenceScore: number };
}

export function BreakSimulator({
  onSimulateBreak,
  onRunBroken,
  onHeal,
  status,
  lastHealStats,
}: BreakSimulatorProps) {
  const [loading, setLoading] = useState(false);

  const handleStep1 = async () => {
    setLoading(true);
    await onSimulateBreak();
    setLoading(false);
  };

  const handleStep2 = async () => {
    setLoading(true);
    await onRunBroken();
    setLoading(false);
  };

  const handleStep3 = async () => {
    setLoading(true);
    await onHeal();
    setLoading(false);
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-rose-500/30 bg-gradient-to-b from-rose-950/20 via-slate-900/50 to-slate-900/90 relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <Bug className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              Interactive Self-Healing Demo Playground
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Hackathon Judge Mode
              </span>
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Simulate live target site DOM mutation and watch autonomous self-repair in real-time
            </p>
          </div>
        </div>

        <div className="text-xs font-mono px-3 py-1.5 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-300">
          Target: <strong className="text-cyan-400">c_layoffs_v2_hackathon</strong>
        </div>
      </div>

      {/* Step Stepper */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
        {/* Step 1 */}
        <div
          className={`p-4 rounded-xl border transition-all ${
            status === 'idle'
              ? 'bg-slate-900/80 border-slate-700'
              : status === 'broken' || status === 'failed-run'
              ? 'bg-rose-950/30 border-rose-500/50 glow-rose'
              : 'bg-slate-900/40 border-slate-800 opacity-60'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-slate-400">STEP 01</span>
            <span className="text-rose-400 font-bold">Inject Mutation</span>
          </div>
          <p className="text-xs text-slate-300 mb-4 font-sans">
            Simulate a website layout redesign that renames CSS classes and breaks selectors.
          </p>
          <button
            onClick={handleStep1}
            disabled={loading || status === 'broken' || status === 'failed-run'}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-mono font-semibold transition-all disabled:opacity-40 cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>1. Break Selectors</span>
          </button>
        </div>

        {/* Step 2 */}
        <div
          className={`p-4 rounded-xl border transition-all ${
            status === 'broken'
              ? 'bg-amber-950/30 border-amber-500/50 glow-amber'
              : status === 'failed-run'
              ? 'bg-slate-900/80 border-slate-700'
              : 'bg-slate-900/40 border-slate-800 opacity-60'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-slate-400">STEP 02</span>
            <span className="text-amber-400 font-bold">Detect Drift</span>
          </div>
          <p className="text-xs text-slate-300 mb-4 font-sans">
            Run collector to observe the failure, log the schema mismatch, and flag the break.
          </p>
          <button
            onClick={handleStep2}
            disabled={loading || status !== 'broken'}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-mono font-semibold transition-all disabled:opacity-40 cursor-pointer"
          >
            <Play className="w-4 h-4" />
            <span>2. Run Broken Collector</span>
          </button>
        </div>

        {/* Step 3 */}
        <div
          className={`p-4 rounded-xl border transition-all ${
            status === 'failed-run' || status === 'healing'
              ? 'bg-emerald-950/30 border-emerald-500/50 glow-emerald'
              : status === 'recovered'
              ? 'bg-emerald-950/20 border-emerald-500/30'
              : 'bg-slate-900/40 border-slate-800 opacity-60'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-slate-400">STEP 03</span>
            <span className="text-emerald-400 font-bold">Self-Heal (AI)</span>
          </div>
          <p className="text-xs text-slate-300 mb-4 font-sans">
            Trigger <code className="text-cyan-300">bdata scraper heal</code> to remap selectors and verify recovery.
          </p>
          <button
            onClick={handleStep3}
            disabled={loading || (status !== 'failed-run' && status !== 'broken')}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white text-xs font-mono font-semibold transition-all disabled:opacity-40 cursor-pointer glow-emerald"
          >
            <Sparkles className="w-4 h-4" />
            <span>3. Autonomous Self-Heal</span>
          </button>
        </div>
      </div>

      {/* Real-time Result Banner */}
      {status === 'recovered' && lastHealStats && (
        <div className="mt-4 p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center gap-2 text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>
              <strong>Zero Downtime Recovery!</strong> Repaired in{' '}
              <span className="text-white font-bold">{lastHealStats.timeToHealMs}ms</span> (Confidence:{' '}
              {lastHealStats.confidenceScore}%)
            </span>
          </div>
          <div className="text-slate-400 text-[11px] truncate">
            Command: <code className="text-cyan-300">{lastHealStats.cliCommand}</code>
          </div>
        </div>
      )}
    </div>
  );
}
