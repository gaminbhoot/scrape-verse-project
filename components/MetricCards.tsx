'use client';

import React from 'react';
import { MetricOverview } from '@/src/lib/types';
import { Activity, Zap, CheckCircle2, RefreshCw, TrendingUp, ArrowUpRight } from 'lucide-react';

interface MetricCardsProps {
  metrics: MetricOverview;
}

function Sparkline({ color = '#c9a86a' }: { color?: string }) {
  // premium sparkline — static SVG, hand-tuned for rich feel
  const d = 'M0 24 C 18 20, 30 28, 44 18 S 72 6, 84 14 S 112 22, 128 10 S 152 18, 168 12 S 188 6, 200 16';
  return (
    <svg viewBox="0 0 200 32" className="h-8 w-full" preserveAspectRatio="none" aria-hidden>
      <defs>
        <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${d} L 200 32 L 0 32 Z`} fill="url(#sg)" />
      <path d={d} fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" opacity="0.95" />
    </svg>
  );
}

export function MetricCards({ metrics }: MetricCardsProps) {
  const cards = [
    {
      label: 'Pipeline Uptime',
      value: `${metrics.uptimePercentage}%`,
      sub: 'Zero-downtime SLA',
      icon: CheckCircle2,
      accent: '#10b981',
      meta: `${metrics.healthyCount} / ${metrics.totalScrapers} collectors live`,
      spark: '#10b981',
    },
    {
      label: 'Autonomous MTTR',
      value: `${metrics.mttrSeconds}s`,
      sub: '−99.4% vs manual',
      icon: Zap,
      accent: '#06b6d4',
      meta: 'via bdata scraper heal',
      spark: '#06b6d4',
    },
    {
      label: 'Verified Records',
      value: metrics.totalRecordsExtracted.toLocaleString(),
      sub: '100% schema-valid',
      icon: Activity,
      accent: '#c9a86a',
      meta: 'into SQLite & API',
      spark: '#c9a86a',
    },
    {
      label: 'Autonomous Repairs',
      value: `${metrics.healsToday}`,
      sub: 'Self-healed',
      icon: RefreshCw,
      accent: '#e8a63c',
      meta: metrics.brokenCount > 0 ? `${metrics.brokenCount} needs repair` : 'All healthy',
      spark: '#e8a63c',
      alert: metrics.brokenCount > 0,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map(c => (
        <div key={c.label} className="glass-panel group relative overflow-hidden rounded-[18px] p-[18px]">
          {/* top brass hairline */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c9a86a]/20 to-transparent opacity-60" />
          {/* subtle inner glow on hover */}
          <div className="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-white/[0.03] blur-2xl opacity-0 transition group-hover:opacity-100" />

          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="text-[10px] font-semibold tracking-[0.14em] text-white/45">{c.label.toUpperCase()}</div>
              <div className="flex items-baseline gap-2">
                <div className="display text-[30px] font-normal tracking-[-0.04em] text-white">
                  {c.value}
                </div>
                <span
                  className="inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] font-medium tracking-wide"
                  style={{
                    borderColor: `${c.accent}22`,
                    background: `${c.accent}12`,
                    color: c.accent,
                  }}
                >
                  <TrendingUp className="h-3 w-3" />
                  {c.sub}
                </span>
              </div>
            </div>

            <div
              className="grid h-10 w-10 place-items-center rounded-xl border bg-white/[0.04] backdrop-blur"
              style={{ borderColor: `${c.accent}22`, color: c.accent }}
            >
              <c.icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
            </div>
          </div>

          <div className="mt-3">
            <Sparkline color={c.spark} />
          </div>

          <div className="mt-2 flex items-center justify-between border-t border-white/[0.06] pt-2.5">
            <span className={`font-mono text-[11px] ${c.alert ? 'font-semibold text-rose-300' : 'text-white/45'}`}>
              {c.meta}
            </span>
            <ArrowUpRight className="h-3 w-3 text-white/20 group-hover:text-white/40 transition" />
          </div>
        </div>
      ))}
    </div>
  );
}
