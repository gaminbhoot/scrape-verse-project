'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/Header';
import { MetricCards } from '@/components/MetricCards';
import { ScraperMatrix } from '@/components/ScraperMatrix';
import { BreakSimulator } from '@/components/BreakSimulator';
import { DiffViewer } from '@/components/DiffViewer';
import { LiveTerminal } from '@/components/LiveTerminal';
import { DataExplorer } from '@/components/DataExplorer';
import { Scraper, MetricOverview, LogEntry, HealEvent, ScraperRun } from '@/src/lib/types';
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
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [healEvents, setHealEvents] = useState<HealEvent[]>([]);
  const [runs, setRuns] = useState<ScraperRun[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [runningId, setRunningId] = useState<string | null>(null);
  const [healingId, setHealingId] = useState<string | null>(null);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [demoStatus, setDemoStatus] = useState<'idle' | 'broken' | 'failed-run' | 'healing' | 'recovered'>('idle');
  const [lastHealStats, setLastHealStats] = useState<{
    timeToHealMs: number;
    cliCommand: string;
    confidenceScore: number;
  } | undefined>(undefined);

  const fetchData = useCallback(async () => {
    try {
      setIsRefreshing(true);
      const [scrapersRes, metricsRes, logsRes] = await Promise.all([
        fetch('/api/scrapers'),
        fetch('/api/metrics'),
        fetch('/api/logs'),
      ]);

      const scrapersData = await scrapersRes.json();
      const metricsData = await metricsRes.json();
      const logsData = await logsRes.json();

      if (scrapersData.scrapers) setScrapers(scrapersData.scrapers);
      if (metricsData.metrics) setMetrics(metricsData.metrics);
      if (logsData.logs) setLogs(logsData.logs);
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
  }, []);

  const handleRun = async (id: string) => {
    try {
      setRunningId(id);
      const res = await fetch(`/api/scrapers/${id}/run`, { method: 'POST' });
      const data = await res.json();
      if (data.run) {
        setRuns((prev) => [data.run, ...prev]);
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
        setHealEvents((prev) => [data.healEvent, ...prev]);
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
      if (data.healEvent) setHealEvents((prev) => [data.healEvent, ...prev]);
      if (data.verifiedRun) setRuns((prev) => [data.verifiedRun, ...prev]);
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
    setDemoStatus('recovered');
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col selection:bg-emerald-500/30 selection:text-emerald-200">
      <Header
        onRefresh={fetchData}
        isRefreshing={isRefreshing}
        onOpenDemo={() => {
          const el = document.getElementById('demo-playground');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
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

          <div className="space-y-6">
            <LiveTerminal logs={logs} />
            <DataExplorer runs={runs} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/60 py-6 px-6 text-center text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            AegisScrape // Built for <strong>Into the Scrape-Verse Hackathon</strong> (WeMakeDevs & Bright Data)
          </span>
          <span className="text-slate-400">
            Powered by <strong>Scraper Studio</strong> & <code className="text-cyan-400">@brightdata/cli</code>
          </span>
        </div>
      </footer>
    </div>
  );
}
