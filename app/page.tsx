'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/Header';
import { MetricCards } from '@/components/MetricCards';
import { ScraperMatrix } from '@/components/ScraperMatrix';
import { BreakSimulator } from '@/components/BreakSimulator';
import { DiffViewer } from '@/components/DiffViewer';
import { LiveTerminal } from '@/components/LiveTerminal';
import { DataExplorer } from '@/components/DataExplorer';
import {
  Scraper,
  MetricOverview,
  LogEntry,
  HealEvent,
  ScraperRun,
  BudgetInfo,
} from '@/src/lib/types';
import { Sparkles, Terminal, Activity, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Home() {
  const [scrapers, setScrapers] = useState<Scraper[]>([]);
  const [metrics, setMetrics] = useState<MetricOverview>({
    totalScrapers: 3,
    uptimePercentage: 100,
    mttrSeconds: 24.5,
    totalRecordsExtracted: 1840,
    healsToday: 6,
    healthyCount: 3,
    brokenCount: 0,
    healingCount: 0,
  });
  const [budget, setBudget] = useState<BudgetInfo>({
    creditsRemaining: 4850,
    monthlyTier: 'WeMakeDevs Hackathon ($50 + 5k tier)',
    activeProxies: 42,
    isLive: false,
  });
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [healEvents, setHealEvents] = useState<HealEvent[]>([]);
  const [runs, setRuns] = useState<ScraperRun[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [runningId, setRunningId] = useState<string | null>(null);
  const [healingId, setHealingId] = useState<string | null>(null);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [demoStatus, setDemoStatus] = useState<
    'idle' | 'broken' | 'failed-run' | 'healing' | 'recovered'
  >('idle');
  const [lastHealStats, setLastHealStats] = useState<
    | {
        timeToHealMs: number;
        cliCommand: string;
        confidenceScore: number;
      }
    | undefined
  >(undefined);

  const fetchData = useCallback(async () => {
    try {
      setIsRefreshing(true);
      const [scrapersRes, metricsRes, logsRes, budgetRes] = await Promise.all([
        fetch('/api/scrapers'),
        fetch('/api/metrics'),
        fetch('/api/logs'),
        fetch('/api/budget'),
      ]);

      const scrapersData = await scrapersRes.json();
      const metricsData = await metricsRes.json();
      const logsData = await logsRes.json();
      const budgetData = await budgetRes.json();

      if (scrapersData.scrapers) setScrapers(scrapersData.scrapers);
      if (metricsData.metrics) setMetrics(metricsData.metrics);
      if (logsData.logs) setLogs(logsData.logs);
      if (budgetData.budget) setBudget(budgetData.budget);
    } catch (err) {
      console.error('Error fetching dashboard telemetry:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    // Initial run for default data population
    handleRun('scraper-1');

    // 5-second interval polling for live background and CI/CD status sync
    const interval = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchData]);

  const handleRun = async (id: string) => {
    try {
      setRunningId(id);
      const res = await fetch(`/api/scrapers/${id}/run`, { method: 'POST' });
      const data = await res.json();
      if (data.run) {
        setRuns(prev => [data.run, ...prev]);
      }
      await fetchData();
    } catch (err) {
      console.error('Run failed:', err);
    } finally {
      setRunningId(null);
    }
  };

  const handleHeal = async (id: string) => {
    try {
      setHealingId(id);
      const res = await fetch(`/api/scrapers/${id}/heal`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Heal failed');
      if (data.healEvent) {
        setHealEvents(prev => [data.healEvent, ...prev]);
        setLastHealStats({
          timeToHealMs: data.healEvent.timeToHealMs,
          cliCommand: data.healEvent.cliCommandUsed,
          confidenceScore: data.healEvent.confidenceScore,
        });
      }
      setDemoStatus('healing');
      await fetchData();
    } catch (err) {
      console.error('Healing failed:', err);
    } finally {
      setHealingId(null);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      setHealingId(id);
      const res = await fetch(`/api/scrapers/${id}/approve`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Approve failed');
      if (data.healEvent) setHealEvents(prev => [data.healEvent, ...prev]);
      if (data.verifiedRun) setRuns(prev => [data.verifiedRun, ...prev]);
      setDemoStatus('recovered');
      await fetchData();
    } catch (err) {
      console.error('Approve failed:', err);
    } finally {
      setHealingId(null);
    }
  };

  const handleBreak = async (id: string) => {
    try {
      await fetch(`/api/scrapers/${id}/break`, { method: 'POST' });
      setDemoStatus('broken');
      await fetchData();
    } catch (err) {
      console.error('Break simulation failed:', err);
    }
  };

  const handleDemoStep1 = async () => {
    await handleBreak('scraper-1');
    setDemoStatus('broken');
  };

  const handleDemoStep2 = async () => {
    await handleRun('scraper-1');
    setDemoStatus('failed-run');
  };

  const handleDemoStep3 = async () => {
    await handleHeal('scraper-1');
    // Complete autonomous recovery loop: heal -> approve -> verify
    await handleApprove('scraper-1');
    setDemoStatus('recovered');
  };

  return (
    <div className="min-h-screen bg-[#02050a] text-slate-100 flex flex-col selection:bg-[#c9a86a]/20 selection:text-[#e2d1b1]">
      <Header
        onRefresh={fetchData}
        isRefreshing={isRefreshing}
        budget={budget}
        onOpenDemo={() => {
          const el = document.getElementById('demo-playground');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      <main className="flex-1 mx-auto flex w-full max-w-[1360px] flex-col gap-10 px-6 py-10 lg:px-8">
        {/* Hero — premium editorial */}
        <div className="relative overflow-hidden rounded-[20px] border border-[#ece9e4] bg-white p-8 shadow-sm">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c9a86a]/20 to-transparent" />
          <div className="flex flex-col gap-3">
            <div className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.12em] text-white/40">
              <span className="h-px w-8 bg-gradient-to-r from-[#c9a86a]/50 to-transparent" />
              OBSERVABILITY CONTROL CENTER
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] text-white/50">LIVE TELEMETRY</span>
            </div>
            <div className="flex flex-wrap items-baseline gap-3">
              <h2 className="display text-[28px] font-normal leading-none tracking-[-0.03em] text-white sm:text-[32px]">
                Reliability, <span className="italic font-light text-[#b8945a]">made visible.</span>
              </h2>
              <span className="font-mono text-xs text-white/40">Same c_* before and after heal • zero downstream changes</span>
            </div>
          </div>
        </div>

        {/* Metric Cards */}
        <MetricCards metrics={metrics} />

        {/* Dedicated Judge Demo Testbed */}
        <div id="demo-playground">
          <BreakSimulator
            onSimulateBreak={handleDemoStep1}
            onRunBroken={handleDemoStep2}
            onHeal={handleDemoStep3}
            status={demoStatus}
            lastHealStats={lastHealStats}
          />
        </div>

        {/* Main Grid: Scraper Matrix + Live CLI Terminal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <ScraperMatrix
              scrapers={scrapers}
              onRun={handleRun}
              onHeal={handleHeal}
              onBreak={handleBreak}
              onApprove={handleApprove}
              runningId={runningId}
              healingId={healingId}
            />

            <DiffViewer healEvents={healEvents} />
          </div>

          <div className="space-y-8">
            <LiveTerminal logs={logs} />
            <DataExplorer runs={runs} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/20 py-6 backdrop-blur">
        <div className="mx-auto flex max-w-[1360px] flex-col items-center justify-between gap-2 px-5 text-center font-mono text-xs text-white/40 lg:px-6 sm:flex-row sm:text-left">
          <span>
            <span className="text-white/60">AegisScrape</span> <span className="text-white/20">—</span> Into the Scrape-Verse <span className="text-white/20">by</span> WeMakeDevs × Bright Data
          </span>
          <span className="text-white/30">
            <span className="text-white/50">Scraper Studio</span> •{' '}
            <code className="rounded-full border border-white/10 bg-white/[0.06] px-2 py-0.5 text-[#c9a86a]">@brightdata/cli</code>
          </span>
        </div>
      </footer>
    </div>
  );
}
