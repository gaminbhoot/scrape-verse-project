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
    <header className="sticky top-0 z-50 border-b border-[#ece9e4] bg-white/80 backdrop-blur-xl">
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#c9a86a]/30 to-transparent" />
      <div className="mx-auto flex max-w-[1360px] flex-col gap-5 px-6 py-5 md:flex-row md:items-center md:justify-between lg:px-8">
        {/* Brand — more air */}
        <div className="flex items-center gap-4">
          <div className="relative grid h-[48px] w-[48px] place-items-center rounded-2xl bg-[#0f172a] shadow-sm">
            <ShieldCheck className="relative h-[22px] w-[22px] text-[#e2d1b1]" strokeWidth={1.6} />
            <span className="absolute -right-1 -top-1 grid h-[14px] w-[14px] place-items-center">
              <span className="absolute h-full w-full rounded-full bg-emerald-500/20 animate-pulse-ring" />
              <span className="relative h-[9px] w-[9px] rounded-full bg-emerald-500 ring-2 ring-white" />
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-3">
              <h1 className="display text-[24px] font-normal tracking-[-0.03em] text-[#0f172a]">AegisScrape</h1>
              <span className="hidden rounded-full border border-[#ece9e4] bg-[#fdfcfa] px-2.5 py-0.5 text-[10px] font-medium tracking-[0.12em] text-[#94a3b8] sm:inline-flex">
                OBSERVABILITY
              </span>
            </div>
            <p className="mt-1 flex items-center gap-2 text-[12px] leading-none tracking-wide text-[#64748b]">
              <span className="h-px w-7 bg-gradient-to-r from-[#c9a86a]/40 to-transparent" />
              Autonomous Self-Healing <span className="text-[#cbd5e1]">•</span> Bright Data Scraper Studio
            </p>
          </div>
        </div>

        {/* Actions — airier pills */}
        <div className="flex flex-wrap items-center gap-3">
          <div
            className={`hidden items-center gap-2 rounded-full border px-3.5 py-2 text-[11px] font-medium tracking-wide sm:flex ${
              isLive ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-[#ece9e4] bg-[#fdfcfa] text-[#94a3b8]'
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${isLive ? 'bg-emerald-500 animate-pulse' : 'bg-[#cbd5e1]'}`} />
            <Radio className={`h-3 w-3 ${isLive ? 'text-emerald-600' : 'text-[#94a3b8]'}`} />
            <span className="font-mono">{isLive ? 'LIVE API' : 'SIMULATION'}</span>
          </div>

          <div className="hidden items-center gap-2.5 rounded-full border border-[#ece9e4] bg-white px-3.5 py-2 text-xs text-[#475569] shadow-sm sm:flex">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-[#f1f5f9]">
              <Cpu className="h-3.5 w-3.5 text-[#64748b]" />
            </span>
            <span className="font-mono text-[11px] text-[#94a3b8]">Proxy</span>
            <strong className="text-[13px] font-semibold tracking-tight text-[#0f172a]">{proxies} Residential</strong>
          </div>

          <div className="flex items-center gap-2.5 rounded-full border border-[#c9a86a]/20 bg-[#fdf8ef] px-3.5 py-2 text-xs shadow-sm">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-[#c9a86a]/15">
              <Layers className="h-3.5 w-3.5 text-[#b8945a]" />
            </span>
            <strong className="font-mono text-[13px] font-semibold tracking-tight text-[#2a2215]">{credits.toLocaleString()}</strong>
            <span className="hidden text-[11px] font-medium text-[#b8945a] sm:inline">credits • $50 bonus</span>
          </div>

          <button
            onClick={onOpenDemo}
            className="inline-flex items-center gap-2 rounded-full bg-[#0f172a] px-5 py-2.5 text-[12px] font-semibold tracking-tight text-white shadow-sm transition hover:bg-[#1e293b] cursor-pointer"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
            Judge Demo
          </button>

          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="grid h-10 w-10 place-items-center rounded-full border border-[#ece9e4] bg-white text-[#64748b] shadow-sm transition hover:bg-[#fdfcfa] disabled:opacity-50 cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin text-[#b8945a]' : ''}`} />
          </button>
        </div>
      </div>
    </header>
  );
}
