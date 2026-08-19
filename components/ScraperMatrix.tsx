'use client';

import React from 'react';
import { Scraper } from '@/src/lib/types';
import {
  Play,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Clock,
  Globe,
  ArrowUpRight,
  Wrench,
  ShieldAlert,
} from 'lucide-react';

interface ScraperMatrixProps {
  scrapers: Scraper[];
  onRun: (id: string) => void;
  onHeal: (id: string) => void;
  onBreak: (id: string) => void;
  onApprove?: (id: string) => void;
  runningId: string | null;
  healingId: string | null;
}

function statusMeta(status: string) {
  switch (status) {
    case 'broken':
      return { label: 'Broken', dot: 'bg-rose-500', ring: 'ring-rose-500/30', rail: 'from-rose-500' };
    case 'awaiting_approval':
      return { label: 'Awaiting approval', dot: 'bg-amber-400', ring: 'ring-amber-400/30', rail: 'from-amber-400' };
    case 'healing':
      return { label: 'Healing', dot: 'bg-amber-400', ring: 'ring-amber-400/30', rail: 'from-amber-400' };
    case 'recovered':
      return { label: 'Recovered', dot: 'bg-emerald-500', ring: 'ring-emerald-500/30', rail: 'from-emerald-500' };
    default:
      return { label: 'Healthy', dot: 'bg-emerald-500', ring: 'ring-emerald-500/30', rail: 'from-emerald-500' };
  }
}

export function ScraperMatrix({ scrapers, onRun, onHeal, onBreak, onApprove, runningId, healingId }: ScraperMatrixProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="display text-[20px] font-normal tracking-[-0.02em] text-white">Collector Fleet</h2>
          <p className="mt-1 font-mono text-[11px] tracking-wide text-white/45">
            Live selector diagnostics • same <span className="text-white/70">c_*</span> before and after heal
          </p>
        </div>
        <span className="hidden rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[11px] text-white/60 sm:inline-flex">
          {scrapers.length} collectors • {scrapers.filter(s => s.status === 'healthy' || s.status === 'recovered').length} healthy
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {scrapers.map(scraper => {
          const isRunning = runningId === scraper.id;
          const isHealing = healingId === scraper.id;
          const meta = statusMeta(scraper.status);
          const isBroken = scraper.status === 'broken';
          const isAwaiting = scraper.status === 'awaiting_approval';
          const isRecovered = scraper.status === 'recovered';

          return (
            <div key={scraper.id} className="group relative overflow-hidden rounded-[18px] glass-panel p-0">
              {/* left rail */}
              <div className={`absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b ${meta.rail} to-transparent opacity-80`} />
              {/* brass highlight */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              <div className="p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  {/* Left */}
                  <div className="min-w-0 flex-1 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#c9a86a]/20 bg-[#c9a86a]/10 px-2.5 py-1 font-mono text-[11px] font-semibold tracking-wide text-[#e2d1b1]">
                        <span className={`h-1.5 w-1.5 rounded-full ${meta.dot} shadow-[0_0_8px_currentColor]`} />
                        {scraper.collectorId}
                      </span>
                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-[11px] text-white/60">
                        {scraper.category}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] font-medium ${
                          isBroken
                            ? 'border-rose-500/25 bg-rose-500/10 text-rose-200'
                            : isAwaiting
                              ? 'border-amber-500/25 bg-amber-500/10 text-amber-200'
                              : isRecovered
                                ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-200'
                                : 'border-emerald-500/15 bg-emerald-500/10 text-emerald-200'
                        }`}
                      >
                        {isBroken ? (
                          <AlertCircle className="h-3 w-3" />
                        ) : isAwaiting ? (
                          <Wrench className="h-3 w-3 animate-pulse" />
                        ) : isHealing ? (
                          <Wrench className="h-3 w-3 animate-spin" />
                        ) : (
                          <CheckCircle2 className="h-3 w-3" />
                        )}
                        {meta.label}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-[15px] font-semibold tracking-[-0.015em] text-white">{scraper.name}</h3>
                      <p className="mt-1 max-w-3xl text-[13px] leading-5 text-white/55">{scraper.description}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 border-t border-white/[0.06] pt-3 font-mono text-[11px] text-white/45">
                      <a
                        href={scraper.targetUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-cyan-300/90 hover:text-cyan-200"
                      >
                        <Globe className="h-3 w-3" />
                        {scraper.targetUrl.replace('https://', '')}
                        <ArrowUpRight className="h-3 w-3 opacity-60" />
                      </a>
                      <span className="hidden h-3 w-px bg-white/10 sm:block" />
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="h-3 w-3 text-white/30" />
                        Runs <strong className="font-semibold text-white">{scraper.totalRuns}</strong>
                        <span className="text-white/30">•</span>
                        <span className="text-emerald-300">{scraper.successRate}% success</span>
                      </span>
                      {scraper.totalHeals > 0 && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-[#c9a86a]/20 bg-[#c9a86a]/10 px-2 py-0.5 text-[#e2d1b1]">
                          <Sparkles className="h-3 w-3 text-[#c9a86a]" />
                          {scraper.totalHeals} repairs
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right — actions */}
                  <div className="flex shrink-0 flex-wrap items-center gap-2 lg:flex-col lg:items-stretch">
                    <button
                      onClick={() => onRun(scraper.id)}
                      disabled={isRunning || !!isHealing}
                      className="inline-flex items-center justify-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-3.5 py-2 text-xs font-medium text-white backdrop-blur transition hover:bg-white/[0.08] disabled:opacity-50 cursor-pointer"
                    >
                      <Play className={`h-3.5 w-3.5 ${isRunning ? 'animate-pulse text-emerald-300' : 'text-white/70'}`} />
                      {isRunning ? 'Running…' : 'Run'}
                    </button>

                    {isAwaiting && onApprove ? (
                      <button
                        onClick={() => onApprove(scraper.id)}
                        disabled={!!isHealing}
                        className="inline-flex items-center justify-center gap-1.5 rounded-full bg-amber-400 px-4 py-2 text-xs font-semibold text-black shadow-[0_8px_24px_-12px_rgba(251,191,36,0.6)] transition hover:bg-amber-300 disabled:opacity-50 cursor-pointer"
                      >
                        <ShieldAlert className="h-3.5 w-3.5" />
                        Approve
                      </button>
                    ) : isBroken ? (
                      <button
                        onClick={() => onHeal(scraper.id)}
                        disabled={!!isHealing}
                        className="inline-flex items-center justify-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#070c1a] shadow-[0_8px_24px_-12px_rgba(255,255,255,0.5)] transition hover:bg-white/90 disabled:opacity-50 cursor-pointer"
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        {isHealing ? 'Healing…' : 'Self-Heal'}
                      </button>
                    ) : (
                      scraper.isDemoBreakable && (
                        <button
                          onClick={() => onBreak(scraper.id)}
                          className="inline-flex items-center justify-center gap-1.5 rounded-full border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-xs font-medium text-rose-200 transition hover:bg-rose-500/15 cursor-pointer"
                        >
                          <ShieldAlert className="h-3.5 w-3.5" />
                          Break
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Selector chips — code-like */}
                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/[0.06] pt-3">
                  <span className="font-mono text-[10px] font-semibold tracking-[0.12em] text-white/30">SELECTORS</span>
                  {scraper.selectors.map(sel => (
                    <span
                      key={sel.field}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] ${
                        sel.status === 'broken'
                          ? 'border-rose-500/25 bg-rose-500/10 text-rose-200'
                          : sel.status === 'repaired'
                            ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-200'
                            : 'border-white/10 bg-white/[0.04] text-white/70'
                      }`}
                    >
                      <span className="text-white/40">{sel.field}</span>
                      <span className="text-white/15">·</span>
                      <code className="text-[11px] tracking-tight">{sel.selector}</code>
                      {sel.status === 'broken' && <span className="ml-1 text-[10px]">✕</span>}
                      {sel.status === 'repaired' && <span className="ml-1 text-[10px]">✦</span>}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
