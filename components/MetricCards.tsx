'use client';

import React from 'react';
import { MetricOverview } from '@/src/lib/types';
import { Activity, Zap, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';

interface MetricCardsProps {
  metrics: MetricOverview;
}

export function MetricCards({ metrics }: MetricCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Global Health / Uptime */}
      <div className="glass-panel p-5 rounded-2xl relative overflow-hidden glass-card-hover">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Pipeline Uptime</span>
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-white tracking-tight">{metrics.uptimePercentage}%</span>
          <span className="text-xs font-mono text-emerald-400 font-medium">Zero-Downtime SLA</span>
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-slate-400 font-mono">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{metrics.healthyCount} Active / {metrics.totalScrapers} Total Collectors</span>
        </div>
      </div>

      {/* 2. Mean Time To Recovery (MTTR) */}
      <div className="glass-panel p-5 rounded-2xl relative overflow-hidden glass-card-hover">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Autonomous MTTR</span>
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Zap className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-white tracking-tight">{metrics.mttrSeconds}s</span>
          <span className="text-xs font-mono text-cyan-400 font-medium">-99.4% vs manual</span>
        </div>
        <div className="mt-3 text-xs text-slate-400 font-mono">
          AI Auto-Healing via <code className="text-cyan-300">bdata scraper heal</code>
        </div>
      </div>

      {/* 3. Total Extracted Records */}
      <div className="glass-panel p-5 rounded-2xl relative overflow-hidden glass-card-hover">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Verified Records</span>
          <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Activity className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-white tracking-tight">
            {metrics.totalRecordsExtracted.toLocaleString()}
          </span>
          <span className="text-xs font-mono text-indigo-400 font-medium">100% Schema Valid</span>
        </div>
        <div className="mt-3 text-xs text-slate-400 font-mono">
          Ingested into local SQLite & API endpoints
        </div>
      </div>

      {/* 4. Autonomous Heals */}
      <div className="glass-panel p-5 rounded-2xl relative overflow-hidden glass-card-hover">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Autonomous Repairs</span>
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <RefreshCw className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-white tracking-tight">{metrics.healsToday}</span>
          <span className="text-xs font-mono text-amber-400 font-medium">Self-Healed Events</span>
        </div>
        <div className="mt-3 text-xs text-slate-400 font-mono">
          {metrics.brokenCount > 0 ? (
            <span className="text-rose-400 font-bold">⚠️ {metrics.brokenCount} Collector Needs Repair</span>
          ) : (
            <span className="text-emerald-400">All Pipelines Healthy</span>
          )}
        </div>
      </div>
    </div>
  );
}
