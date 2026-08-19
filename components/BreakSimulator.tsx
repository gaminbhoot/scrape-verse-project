'use client';

import React, { useState } from 'react';
import { ShieldAlert, Sparkles, CheckCircle2, Play, Bug } from 'lucide-react';

interface BreakSimulatorProps {
  onSimulateBreak: () => Promise<void>;
  onRunBroken: () => Promise<void>;
  onHeal: () => Promise<void>;
  status: 'idle' | 'broken' | 'failed-run' | 'healing' | 'recovered';
  lastHealStats?: { timeToHealMs: number; cliCommand: string; confidenceScore: number };
}

export function BreakSimulator({ onSimulateBreak, onRunBroken, onHeal, status, lastHealStats }: BreakSimulatorProps) {
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

  const stepState = (n: number) => {
    if (status === 'recovered') return 'done';
    if (status === 'healing' && n === 3) return 'active';
    if (status === 'failed-run' && n <= 2) return 'done';
    if (status === 'failed-run' && n === 3) return 'active';
    if (status === 'broken' && n === 1) return 'done';
    if (status === 'broken' && n === 2) return 'active';
    if (status === 'idle' && n === 1) return 'active';
    return 'idle';
  };

  return (
    <div className="relative overflow-hidden rounded-[18px] glass-panel p-6">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c9a86a]/20 to-transparent" />
      <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-rose-500/[0.06] blur-3xl" />

      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-white/[0.06] pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-rose-500/10 ring-1 ring-rose-500/20">
            <Bug className="h-5 w-5 text-rose-300" />
          </div>
          <div>
            <h3 className="display flex items-center gap-2 text-[18px] font-normal tracking-[-0.02em] text-white">
              Demo Playground
              <span className="rounded-full border border-[#c9a86a]/20 bg-[#c9a86a]/10 px-2 py-0.5 font-mono text-[10px] font-semibold tracking-[0.1em] text-[#e2d1b1]">
                JUDGE MODE
              </span>
            </h3>
            <p className="font-mono text-[11px] tracking-wide text-white/45">
              Break the site, detect the drift, watch it heal — same <span className="text-white/70">c_*</span>
            </p>
          </div>
        </div>
        <div className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 font-mono text-[11px] text-white/60">
          Target <span className="ml-1.5 font-semibold text-cyan-300">c_layoffs_v2_hackathon</span>
        </div>
      </div>

      {/* Stepper */}
      <div className="relative mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* connector line */}
        <div className="pointer-events-none absolute left-6 right-6 top-[22px] hidden h-px bg-gradient-to-r from-white/10 via-white/10 to-white/10 md:block" />

        {[
          {
            n: 1,
            k: 'Inject',
            title: 'Break Selectors',
            desc: 'Simulate a layout redesign that renames classes and breaks selectors.',
            action: handleStep1,
            icon: ShieldAlert,
            cta: '1 — Break',
            activeFrom: ['idle'],
            doneWhen: ['broken', 'failed-run', 'healing', 'recovered'],
            color: '#f43f5e',
          },
          {
            n: 2,
            k: 'Detect',
            title: 'Run Broken',
            desc: 'Execute the collector and capture the schema mismatch.',
            action: handleStep2,
            icon: Play,
            cta: '2 — Run',
            activeFrom: ['broken'],
            doneWhen: ['failed-run', 'healing', 'recovered'],
            color: '#e8a63c',
          },
          {
            n: 3,
            k: 'Heal',
            title: 'Autonomous Heal',
            desc: 'Run bdata scraper heal → approve and verify recovery.',
            action: handleStep3,
            icon: Sparkles,
            cta: '3 — Heal',
            activeFrom: ['failed-run', 'broken'],
            doneWhen: ['recovered'],
            color: '#10b981',
          },
        ].map(s => {
          const state = stepState(s.n);
          const isActive = state === 'active';
          const isDone = state === 'done';
          const isIdle = state === 'idle';
          return (
            <div
              key={s.n}
              className={`relative rounded-2xl border p-4 backdrop-blur transition ${
                isActive
                  ? 'border-white/15 bg-white/[0.06] shadow-premium'
                  : isDone
                    ? 'border-white/10 bg-white/[0.03]'
                    : 'border-white/[0.06] bg-white/[0.02] opacity-70'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-semibold tracking-[0.14em] text-white/30">STEP 0{s.n}</span>
                <span
                  className="rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold tracking-wide"
                  style={{
                    background: isActive ? `${s.color}18` : isDone ? '#10b98118' : 'rgba(255,255,255,0.04)',
                    color: isActive ? s.color : isDone ? '#10b981' : 'rgba(255,255,255,0.35)',
                    border: `1px solid ${isActive ? s.color + '30' : isDone ? '#10b98130' : 'rgba(255,255,255,0.08)'}`,
                  }}
                >
                  {isDone ? 'Done' : isActive ? s.k : s.k}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span
                  className="grid h-7 w-7 place-items-center rounded-full border text-xs font-semibold"
                  style={{
                    background: isDone ? '#10b98114' : isActive ? `${s.color}14` : 'rgba(255,255,255,0.04)',
                    borderColor: isDone ? '#10b98130' : isActive ? `${s.color}30` : 'rgba(255,255,255,0.08)',
                    color: isDone ? '#10b981' : isActive ? s.color : 'rgba(255,255,255,0.5)',
                  }}
                >
                  {isDone ? '✓' : s.n}
                </span>
                <div className="text-[13px] font-semibold tracking-[-0.01em] text-white">{s.title}</div>
              </div>
              <p className="mt-2 text-[12px] leading-5 text-white/50">{s.desc}</p>
              <button
                onClick={s.action}
                disabled={loading || isDone || isIdle}
                className={`mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold transition disabled:opacity-40 cursor-pointer ${
                  s.n === 3
                    ? 'bg-white text-[#070c1a] hover:bg-white/90 shadow-[0_8px_24px_-12px_rgba(255,255,255,0.5)]'
                    : s.n === 1
                      ? 'border border-rose-500/20 bg-rose-500/10 text-rose-200 hover:bg-rose-500/15'
                      : 'border border-amber-500/20 bg-amber-500/10 text-amber-200 hover:bg-amber-500/15'
                }`}
              >
                <s.icon className="h-3.5 w-3.5" />
                {s.cta}
              </button>
            </div>
          );
        })}
      </div>

      {status === 'recovered' && lastHealStats && (
        <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 font-mono text-xs text-emerald-200">
            <CheckCircle2 className="h-4 w-4 text-emerald-300" />
            <span>
              <strong className="font-semibold text-white">Recovered</strong> in{' '}
              <span className="font-bold text-white">{lastHealStats.timeToHealMs}ms</span> • confidence {lastHealStats.confidenceScore}%
            </span>
          </div>
          <code className="max-w-[420px] truncate rounded-full border border-white/10 bg-black/20 px-2.5 py-1 font-mono text-[11px] text-cyan-200">
            {lastHealStats.cliCommand}
          </code>
        </div>
      )}
    </div>
  );
}
