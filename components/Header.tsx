'use client';

import React from 'react';
import { ShieldCheck, Sparkles, RefreshCw, Cpu, Layers, Radio } from 'lucide-react';
import { BudgetInfo } from '@/src/lib/types';

interface HeaderProps {
  onRefresh: () => void;
  isRefreshing: boolean;
  onOpenDemo: () => void;
  budget?: BudgetInfo;
}

export function Header({ onRefresh, isRefreshing, onOpenDemo, budget }: HeaderProps) {
  const credits = budget?.creditsRemaining ?? 4850;
  const proxies = budget?.activeProxies ?? 42;
  const isLive = budget?.isLive ?? false;

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#030815]/75 backdrop-blur-xl">
      {/* brass top hairline */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#c9a86a]/30 to-transparent" />
      <div className="mx-auto flex max-w-[1360px] flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between lg:px-6">
        {/* Brand */}
        <div className="flex items-center gap-3.5">
          <div className="relative grid h-[44px] w-[44px] place-items-center rounded-2xl bg-gradient-to-br from-[#0e1a30] to-[#0a1122] ring-1 ring-white/10">
            {/* inner brass ring */}
            <div className="absolute inset-[1px] rounded-2xl ring-1 ring-[#c9a86a]/20" />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.08] to-transparent" />
            <ShieldCheck className="relative h-5 w-5 text-[#c9a86a]" strokeWidth={1.75} />
            {/* live dot */}
            <span className="absolute -right-1 -top-1 grid h-[13px] w-[13px] place-items-center">
              <span className="absolute h-full w-full rounded-full bg-emerald-500/20 animate-pulse-ring" />
              <span className="relative h-[9px] w-[9px] rounded-full bg-emerald-500 ring-2 ring-[#030815] shadow-[0_0_10px_rgba(16,185,129,0.6)]" />
            </span>
          </div>

          <div>
            <div className="flex items-baseline gap-2.5">
              <h1 className="display text-[22px] font-normal tracking-[-0.03em] text-white">
                AegisScrape
              </h1>
              <span className="hidden sm:inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] font-medium tracking-widest text-white/60">
                OBSERVABILITY • v1.0
              </span>
            </div>
            <p className="mt-0.5 flex items-center gap-1.5 text-[11px] tracking-wide text-white/55">
              <span className="h-px w-6 bg-gradient-to-r from-[#c9a86a]/50 to-transparent" />
              <Sparkles className="h-3 w-3 text-[#c9a86a]/70" />
              <span className="font-mono text-white/45">Autonomous Self-Healing</span>
              <span className="text-white/20">•</span>
              <span className="font-mono">Bright Data Scraper Studio</span>
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div
            className={`hidden items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-medium tracking-wide sm:flex ${
              isLive
                ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-200'
                : 'border-white/10 bg-white/[0.04] text-white/60'
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${isLive ? 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse' : 'bg-white/30'}`}
            />
            <Radio className={`h-3 w-3 ${isLive ? 'text-emerald-300' : 'text-white/40'}`} />
            <span className="font-mono">{isLive ? 'LIVE API' : 'SIMULATION'}</span>
          </div>

          <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/70 backdrop-blur sm:flex">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-cyan-500/10 ring-1 ring-cyan-500/20">
              <Cpu className="h-3.5 w-3.5 text-cyan-300" />
            </span>
            <span className="font-mono text-[11px] text-white/50">Proxy Pool</span>
            <strong className="text-[12px] font-semibold tracking-tight text-white">
              {proxies} Residential
            </strong>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-[#c9a86a]/15 bg-[#c9a86a]/10 px-3 py-1.5 text-xs backdrop-blur">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-[#c9a86a]/15 ring-1 ring-[#c9a86a]/20">
              <Layers className="h-3.5 w-3.5 text-[#c9a86a]" />
            </span>
            <span className="hidden font-mono text-[11px] text-white/50 sm:inline">Credits</span>
            <strong className="font-mono text-[12px] font-semibold tracking-tight text-[#e2d1b1]">
              {credits.toLocaleString()}
            </strong>
            <span className="hidden text-[11px] font-medium text-[#c9a86a]/70 sm:inline">+ $50 bonus</span>
          </div>

          <button
            onClick={onOpenDemo}
            className="group inline-flex items-center gap-2 rounded-full bg-white px-[14px] py-[8px] text-[12px] font-semibold tracking-tight text-[#070c1a] shadow-[0_8px_24px_-12px_rgba(255,255,255,0.5)] ring-1 ring-white/10 transition hover:bg-white/90 cursor-pointer"
          >
            <span className="grid h-5 w-5 place-items-center rounded-full bg-[#070c1a] text-white">
              <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
            </span>
            Judge Demo
          </button>

          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white/70 backdrop-blur transition hover:bg-white/[0.06] hover:text-white disabled:opacity-50 cursor-pointer"
            title="Refresh Telemetry"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin text-[#c9a86a]' : ''}`} />
          </button>
        </div>
      </div>
    </header>
  );
}
