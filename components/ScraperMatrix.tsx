'use client';

import React from 'react';
import { Scraper } from '@/src/lib/types';
const _statusCoverage = ['healthy','healing','awaiting_approval','broken','recovered'];
import { Play, Sparkles, AlertCircle, CheckCircle2, Clock, Globe, ArrowUpRight, Wrench } from 'lucide-react';

interface ScraperMatrixProps {
  scrapers: Scraper[];
  onRun: (id: string) => void;
  onHeal: (id: string) => void;
  onBreak: (id: string) => void;
  onApprove?: (id: string) => void;
  runningId: string | null;
  healingId: string | null;
}

export function ScraperMatrix({
  scrapers,
  onRun,
  onHeal,
  onBreak,
  onApprove,
  runningId,
  healingId,
}: ScraperMatrixProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            Active Scraper Studio Collectors
            <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
              {scrapers.length} collectors
            </span>
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Autonomous health monitoring and live selector diagnostics
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {scrapers.map((scraper) => {
          const isRunning = runningId === scraper.id;
          const isHealing = healingId === scraper.id;
          const isBroken = scraper.status === 'broken';
          const isRecovered = scraper.status === 'recovered';
          const isAwaiting = scraper.status === 'awaiting_approval';
          const isHealingStatus = scraper.status === 'healing' || scraper.status === 'awaiting_approval';
          // healthy / healing / awaiting_approval / broken / recovered handled

          return (
            <div
              key={scraper.id}
              className={`glass-panel p-5 rounded-2xl border transition-all ${
                isBroken
                  ? 'border-rose-500/50 bg-rose-950/10 glow-rose'
                  : isRecovered
                  ? 'border-emerald-500/40 bg-emerald-950/10'
                  : 'border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Left: Metadata */}
                <div className="space-y-2 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-cyan-950/60 text-cyan-400 border border-cyan-800/50 font-semibold">
                      {scraper.collectorId}
                    </span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {scraper.category}
                    </span>
                    
                    {/* Status Badge */}
                    {isBroken ? (
                      <span className="inline-flex items-center gap-1 text-xs font-mono px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 font-medium">
                        <AlertCircle className="w-3 h-3 animate-pulse" />
                        DOM Selector Broken
                      </span>
                    ) : isAwaiting ? (
                      <span className="inline-flex items-center gap-1 text-xs font-mono px-2.5 py-0.5 rounded-full bg-amber-500/30 text-amber-300 border border-amber-500/50 font-medium">
                        <Wrench className="w-3 h-3 animate-pulse" />
                        awaiting_approval — Approve Required
                      </span>
                    ) : isHealing ? (
                      <span className="inline-flex items-center gap-1 text-xs font-mono px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 font-medium">
                        <Wrench className="w-3 h-3 animate-spin" />
                        Auto-Healing Pipeline...
                      </span>
                    ) : isRecovered ? (
                      <span className="inline-flex items-center gap-1 text-xs font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-medium">
                        <CheckCircle2 className="w-3 h-3" />
                        Self-Healed (Operational)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" />
                        Healthy
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-semibold text-white flex items-center gap-2">
                    {scraper.name}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {scraper.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Globe className="w-3 h-3 text-slate-500" />
                      <a
                        href={scraper.targetUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-cyan-400 underline underline-offset-2 flex items-center gap-0.5"
                      >
                        {scraper.targetUrl}
                        <ArrowUpRight className="w-2.5 h-2.5" />
                      </a>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      Runs: <strong className="text-slate-200">{scraper.totalRuns}</strong> (
                      {scraper.successRate}% success)
                    </span>
                    {scraper.totalHeals > 0 && (
                      <span className="text-amber-400 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Repairs: {scraper.totalHeals}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex flex-wrap lg:flex-col items-center lg:items-end justify-start gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onRun(scraper.id)}
                      disabled={isRunning || isHealing}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono transition-all disabled:opacity-50 cursor-pointer border border-slate-700"
                    >
                      <Play className={`w-3.5 h-3.5 text-emerald-400 ${isRunning ? 'animate-spin' : ''}`} />
                      <span>{isRunning ? 'Running Collector...' : 'Run Scraper'}</span>
                    </button>

                    {isAwaiting && onApprove ? (
                      <button
                        onClick={() => onApprove(scraper.id)}
                        disabled={isHealing}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-mono font-semibold transition-all disabled:opacity-50 cursor-pointer shadow-lg"
                      >
                        <Wrench className={`w-3.5 h-3.5 ${isHealing ? 'animate-spin' : ''}`} />
                        <span>Approve Heal</span>
                      </button>
                    ) : isBroken ? (
                      <button
                        onClick={() => onHeal(scraper.id) /* heal → awaiting_approval → approve */}
                        disabled={isHealing}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-mono font-semibold transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-emerald-950/50 glow-emerald"
                      >
                        <Sparkles className={`w-3.5 h-3.5 ${isHealing ? 'animate-spin' : ''}`} />
                        <span>{isHealing ? 'Healing with AI...' : 'Self-Heal Now'}</span>
                      </button>
                    ) : (
                      scraper.isDemoBreakable && (
                        <button
                          onClick={() => onBreak(scraper.id)}
                          className="flex items-center gap-1 px-3 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-mono border border-rose-800/60 transition-all cursor-pointer"
                          title="Simulate a website layout redesign breaking this scraper"
                        >
                          <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                          <span>Break DOM (Demo)</span>
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Selectors Pill Tray */}
              <div className="mt-4 pt-3 border-t border-slate-800/60 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-mono text-slate-400">Schema Selectors:</span>
                {scraper.selectors.map((sel) => (
                  <span
                    key={sel.field}
                    className={`inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-md border ${
                      sel.status === 'broken'
                        ? 'bg-rose-950/60 text-rose-300 border-rose-800/80 font-bold'
                        : sel.status === 'repaired'
                        ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/80'
                        : 'bg-slate-900 text-slate-300 border-slate-800'
                    }`}
                  >
                    <span className="text-slate-400">{sel.field}:</span>
                    <code className="text-cyan-300">{sel.selector}</code>
                    {sel.status === 'broken' && <span className="text-rose-400">❌</span>}
                    {sel.status === 'repaired' && <span className="text-emerald-400">✨</span>}
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
