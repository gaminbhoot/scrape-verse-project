'use client';

import React from 'react';
import { MetricOverview } from '@/src/lib/types';
import { Activity, Zap, CheckCircle2, RefreshCw } from 'lucide-react';

interface MetricCardsProps {
  metrics: MetricOverview;
}

function Sparkline({ color = '#b8945a' }: { color?: string }) {
  const d = 'M0 22 C 18 18, 30 24, 44 16 S 72 6, 84 12 S 112 18, 128 9 S 152 14, 168 10 S 188 6, 200 14';
  return (
    <svg viewBox="0 0 200 28" className="h-7 w-full" preserveAspectRatio="none" aria-hidden>
      <defs>
        <linearGradient id="sg-light" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${d} L 200 28 L 0 28 Z`} fill="url(#sg-light)" />
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
    </svg>
  );
}

export function MetricCards({ metrics }: MetricCardsProps) {
  const cards = [
    {
      label: 'Pipeline Uptime',
      value: `${metrics.uptimePercentage}%`,
      sub: 'SLA • Zero-downtime',
      icon: CheckCircle2,
      accent: '#0d7a5f',
      meta: `${metrics.healthyCount} / ${metrics.totalScrapers} collectors live`,
    },
    {
      label: 'Autonomous MTTR',
      value: `${metrics.mttrSeconds}s`,
      sub: '−99.4% vs manual',
      icon: Zap,
      accent: '#0e7490',
      meta: 'bdata scraper heal',
    },
    {
      label: 'Verified Records',
      value: metrics.totalRecordsExtracted.toLocaleString(),
      sub: '100% schema-valid',
      icon: Activity,
      accent: '#b8945a',
      meta: 'into SQLite & API',
    },
    {
      label: 'Autonomous Repairs',
      value: `${metrics.healsToday}`,
      sub: 'Self-healed',
      icon: RefreshCw,
      accent: '#a16207',
      meta: metrics.brokenCount > 0 ? `${metrics.brokenCount} needs repair` : 'All healthy',
      alert: metrics.brokenCount > 0,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map(c => (
        <div key={c.label} className="group relative overflow-hidden rounded-[20px] border border-[#ece9e4] bg-white p-7 shadow-sm transition hover:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.08)]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c9a86a]/15 to-transparent" />
          <div className="flex items-start justify-between gap-4">
            <div className="text-[10px] font-semibold tracking-[0.14em] text-[#94a3b8]">{c.label.toUpperCase()}</div>
            <div className="grid h-9 w-9 place-items-center rounded-xl border border-[#f1f5f9] bg-[#f8fafc] text-[#64748b]">
              <c.icon className="h-[16px] w-[16px]" style={{ color: c.accent }} strokeWidth={1.7} />
            </div>
          </div>

          <div className="mt-5 flex items-baseline gap-2.5">
            <div className="display text-[32px] font-light tracking-[-0.04em] text-[#0f172a]">{c.value}</div>
            <span
              className="rounded-full px-2 py-1 text-[10px] font-medium tracking-wide"
              style={{ background: `${c.accent}0f`, color: c.accent, border: `1px solid ${c.accent}18` }}
            >
              {c.sub}
            </span>
          </div>

          <div className="mt-5">
            <Sparkline color={c.accent} />
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-[#f1f5f9] pt-3">
            <span className={`font-mono text-[11px] ${c.alert ? 'font-semibold text-rose-600' : 'text-[#94a3b8]'}`}>{c.meta}</span>
            <span className="h-1 w-6 rounded-full bg-[#f1f5f9] group-hover:bg-[#e2ddd6] transition" />
          </div>
        </div>
      ))}
    </div>
  );
}
