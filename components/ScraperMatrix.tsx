'use client';

import React from 'react';
import { Scraper } from '@/src/lib/types';
import { Play, Sparkles, AlertCircle, CheckCircle2, Clock, Globe, ArrowUpRight, Wrench, ShieldAlert } from 'lucide-react';

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
      return { label: 'Broken', dot: 'bg-rose-500' };
    case 'awaiting_approval':
      return { label: 'Awaiting approval', dot: 'bg-amber-500' };
    case 'healing':
      return { label: 'Healing', dot: 'bg-amber-500' };
    case 'recovered':
      return { label: 'Recovered', dot: 'bg-emerald-500' };
    default:
      return { label: 'Healthy', dot: 'bg-emerald-500' };
  }
}

export function ScraperMatrix({ scrapers, onRun, onHeal, onBreak, onApprove, runningId, healingId }: ScraperMatrixProps) {
  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="display text-[22px] font-normal tracking-[-0.02em] text-[#0f172a]">Collector Fleet</h2>
          <p className="mt-1 font-mono text-[12px] tracking-wide text-[#94a3b8]">
            Live selector diagnostics • same <span className="font-semibold text-[#0f172a]">c_*</span> before and after heal
          </p>
        </div>
        <span className="hidden rounded-full border border-[#ece9e4] bg-white px-3 py-1.5 font-mono text-[11px] text-[#64748b] shadow-sm sm:inline-flex">
          {scrapers.length} collectors • {scrapers.filter(s => s.status === 'healthy' || s.status === 'recovered').length} healthy
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {scrapers.map(scraper => {
          const isRunning = runningId === scraper.id;
          const isHealing = healingId === scraper.id;
          const meta = statusMeta(scraper.status);
          const isBroken = scraper.status === 'broken';
          const isAwaiting = scraper.status === 'awaiting_approval';

          return (
            <div key={scraper.id} className="group overflow-hidden rounded-[20px] border border-[#ece9e4] bg-white p-7 shadow-sm transition hover:shadow-[0_12px_32px_-16px_rgba(0,0,0,0.08)]">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1 space-y-4">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="inline-flex items-center gap-2 rounded-full border border-[#e7e5e4] bg-[#fdfcfa] px-3 py-1.5 font-mono text-[11px] font-semibold tracking-wide text-[#1e293b]">
                      <span className={`h-2 w-2 rounded-full ${meta.dot}`} />
                      {scraper.collectorId}
                    </span>
                    <span className="rounded-full bg-[#f1f5f9] px-2.5 py-1 font-mono text-[11px] text-[#64748b]">{scraper.category}</span>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[11px] font-medium ${
                        isBroken
                          ? 'border-rose-200 bg-rose-50 text-rose-700'
                          : isAwaiting
                            ? 'border-amber-200 bg-amber-50 text-amber-700'
                            : scraper.status === 'recovered'
                              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                              : 'border-emerald-200 bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {isBroken ? <AlertCircle className="h-3 w-3" /> : isAwaiting ? <Wrench className="h-3 w-3 animate-pulse" /> : <CheckCircle2 className="h-3 w-3" />}
                      {meta.label}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-[16px] font-semibold tracking-[-0.015em] text-[#0f172a]">{scraper.name}</h3>
                    <p className="mt-1.5 max-w-3xl text-[13px] leading-6 text-[#64748b]">{scraper.description}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 border-t border-[#f1f5f9] pt-4 font-mono text-[11px] text-[#94a3b8]">
                    <a href={scraper.targetUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[#0e7490] hover:text-[#0c6580]">
                      <Globe className="h-3 w-3" />
                      {scraper.targetUrl.replace('https://', '')}
                      <ArrowUpRight className="h-3 w-3 opacity-60" />
                    </a>
                    <span className="hidden h-3 w-px bg-[#e2e8f0] sm:block" />
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-3 w-3 text-[#cbd5e1]" />
                      Runs <strong className="font-semibold text-[#0f172a]">{scraper.totalRuns}</strong> •{' '}
                      <span className="text-emerald-700">{scraper.successRate}%</span>
                    </span>
                    {scraper.totalHeals > 0 && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#fdf8ef] px-2.5 py-1 text-[#b8945a] ring-1 ring-[#c9a86a]/20">
                        <Sparkles className="h-3 w-3" />
                        {scraper.totalHeals} repairs
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-2.5 lg:flex-col lg:items-stretch">
                  <button
                    onClick={() => onRun(scraper.id)}
                    disabled={isRunning || !!isHealing}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-[#e2e8f0] bg-white px-4 py-2.5 text-xs font-medium text-[#0f172a] shadow-sm transition hover:bg-[#f8fafc] disabled:opacity-50 cursor-pointer"
                  >
                    <Play className={`h-3.5 w-3.5 ${isRunning ? 'animate-pulse text-emerald-600' : 'text-[#64748b]'}`} />
                    {isRunning ? 'Running…' : 'Run'}
                  </button>

                  {isAwaiting && onApprove ? (
                    <button
                      onClick={() => onApprove(scraper.id)}
                      disabled={!!isHealing}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-500 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-amber-600 disabled:opacity-50 cursor-pointer"
                    >
                      <ShieldAlert className="h-3.5 w-3.5" />
                      Approve
                    </button>
                  ) : isBroken ? (
                    <button
                      onClick={() => onHeal(scraper.id)}
                      disabled={!!isHealing}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0f172a] px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#1e293b] disabled:opacity-50 cursor-pointer"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-[#e2d1b1]" />
                      {isHealing ? 'Healing…' : 'Self-Heal'}
                    </button>
                  ) : (
                    scraper.isDemoBreakable && (
                      <button
                        onClick={() => onBreak(scraper.id)}
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-medium text-rose-700 transition hover:bg-rose-100 cursor-pointer"
                      >
                        <ShieldAlert className="h-3.5 w-3.5" />
                        Break
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-[#f1f5f9] pt-4">
                <span className="font-mono text-[10px] font-semibold tracking-[0.12em] text-[#94a3b8]">SELECTORS</span>
                {scraper.selectors.map(sel => (
                  <span
                    key={sel.field}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-[11px] ${
                      sel.status === 'broken'
                        ? 'border-rose-200 bg-rose-50 text-rose-700'
                        : sel.status === 'repaired'
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                          : 'border-[#e2e8f0] bg-[#f8fafc] text-[#475569]'
                    }`}
                  >
                    <span className="text-[#94a3b8]">{sel.field}</span>
                    <span className="text-[#cbd5e1]">·</span>
                    <code className="tracking-tight">{sel.selector}</code>
                    {sel.status === 'broken' && <span>✕</span>}
                    {sel.status === 'repaired' && <span>✦</span>}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
