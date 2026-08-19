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
    <div className="relative overflow-hidden rounded-[20px] border border-[#ece9e4] bg-white p-7 shadow-sm md:p-8">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c9a86a]/20 to-transparent" />

      <div className="flex flex-col gap-4 border-b border-[#f1f5f9] pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3.5">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-rose-50 ring-1 ring-rose-100">
            <Bug className="h-5 w-5 text-rose-600" />
          </div>
          <div>
            <h3 className="display flex items-center gap-2 text-[19px] font-normal tracking-[-0.02em] text-[#0f172a]">
              Demo Playground
              <span className="rounded-full border border-[#c9a86a]/20 bg-[#fdf8ef] px-2.5 py-0.5 font-mono text-[10px] font-semibold tracking-[0.12em] text-[#b8945a]">JUDGE MODE</span>
            </h3>
            <p className="font-mono text-[12px] tracking-wide text-[#94a3b8]">
              Break the site, detect the drift, watch it heal — same <span className="font-semibold text-[#0f172a]">c_*</span>
            </p>
          </div>
        </div>
        <div className="inline-flex rounded-full border border-[#e2e8f0] bg-[#f8fafc] px-3.5 py-2 font-mono text-[11px] text-[#64748b]">
          Target <span className="ml-1.5 font-semibold text-[#0e7490]">c_layoffs_v2_hackathon</span>
        </div>
      </div>

      <div className="relative mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="pointer-events-none absolute left-8 right-8 top-[26px] hidden h-px bg-[#ece9e4] md:block" />

        {[
          {
            n: 1,
            k: 'Inject',
            title: 'Break Selectors',
            desc: 'Simulate a layout redesign that renames classes and breaks selectors.',
            action: handleStep1,
            icon: ShieldAlert,
            cta: '1 — Break',
            color: '#be123c',
          },
          {
            n: 2,
            k: 'Detect',
            title: 'Run Broken',
            desc: 'Execute the collector and capture the schema mismatch.',
            action: handleStep2,
            icon: Play,
            cta: '2 — Run',
            color: '#a16207',
          },
          {
            n: 3,
            k: 'Heal',
            title: 'Autonomous Heal',
            desc: 'Run bdata scraper heal → approve and verify recovery.',
            action: handleStep3,
            icon: Sparkles,
            cta: '3 — Heal',
            color: '#0d7a5f',
          },
        ].map(s => {
          const state = stepState(s.n);
          const isActive = state === 'active';
          const isDone = state === 'done';
          const isIdle = state === 'idle';
          return (
            <div
              key={s.n}
              className={`relative rounded-2xl border p-6 transition ${
                isActive
                  ? 'border-[#0f172a] bg-[#0f172a] text-white shadow-lg'
                  : isDone
                    ? 'border-emerald-200 bg-emerald-50'
                    : 'border-[#ece9e4] bg-[#fdfcfa]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`font-mono text-[10px] font-semibold tracking-[0.14em] ${isActive ? 'text-white/60' : isDone ? 'text-emerald-700' : 'text-[#94a3b8]'}`}
                >
                  STEP 0{s.n}
                </span>
                <span
                  className={`rounded-full px-2.5 py-1 font-mono text-[10px] font-semibold tracking-wide ${isDone ? 'bg-emerald-600 text-white' : isActive ? 'bg-white text-[#0f172a]' : 'border border-[#e2e8f0] bg-white text-[#94a3b8]'}`}
                >
                  {isDone ? 'Done' : isActive ? s.k : s.k}
                </span>
              </div>
              <div className="mt-4 flex items-center gap-2.5">
                <span
                  className={`grid h-8 w-8 place-items-center rounded-full border text-sm font-semibold ${isDone ? 'border-emerald-200 bg-white text-emerald-700' : isActive ? 'border-white/20 bg-white/10 text-white' : 'border-[#e2e8f0] bg-white text-[#64748b]'}`}
                >
                  {isDone ? '✓' : s.n}
                </span>
                <div className={`text-[14px] font-semibold tracking-[-0.01em] ${isActive ? 'text-white' : isDone ? 'text-emerald-900' : 'text-[#0f172a]'}`}>{s.title}</div>
              </div>
              <p className={`mt-2 text-[13px] leading-5 ${isActive ? 'text-white/70' : isDone ? 'text-emerald-700/70' : 'text-[#64748b]'}`}>{s.desc}</p>
              <button
                onClick={s.action}
                disabled={loading || isDone || isIdle}
                className={`mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-xs font-semibold transition disabled:opacity-40 cursor-pointer ${
                  s.n === 3
                    ? isActive
                      ? 'bg-white text-[#0f172a] hover:bg-[#f8fafc]'
                      : 'bg-[#0f172a] text-white hover:bg-[#1e293b]'
                    : isActive
                      ? 'bg-white text-[#0f172a]'
                      : 'border border-[#e2e8f0] bg-white text-[#0f172a] hover:bg-[#f8fafc]'
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
        <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 font-mono text-xs text-emerald-800">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>
              <strong className="font-semibold text-emerald-900">Recovered</strong> in{' '}
              <span className="font-bold text-emerald-900">{lastHealStats.timeToHealMs}ms</span> • {lastHealStats.confidenceScore}% confidence
            </span>
          </div>
          <code className="max-w-[420px] truncate rounded-full border border-emerald-200 bg-white px-3 py-1 font-mono text-[11px] text-emerald-700">
            {lastHealStats.cliCommand}
          </code>
        </div>
      )}
    </div>
  );
}
