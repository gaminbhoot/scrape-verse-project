'use client';

import React, { useState } from 'react';
import { LogEntry } from '@/src/lib/types';
import { Terminal, Copy, Check } from 'lucide-react';

interface LiveTerminalProps {
  logs: LogEntry[];
}

export function LiveTerminal({ logs }: LiveTerminalProps) {
  const [filter, setFilter] = useState<string>('ALL');
  const [copied, setCopied] = useState(false);

  const filteredLogs = logs.filter(log => {
    if (filter === 'ALL') return true;
    return log.source === filter || log.level === filter.toLowerCase();
  });

  const handleCopyLogs = () => {
    const text = filteredLogs.map(l => `[${l.timestamp}] [${l.source}] [${l.level.toUpperCase()}] ${l.message}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="terminal-chrome flex h-[420px] flex-col overflow-hidden rounded-[18px]">
      {/* chrome */}
      <div className="flex items-center justify-between border-b border-white/[0.07] bg-white/[0.04] px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57] ring-1 ring-black/20" />
            <span className="h-3 w-3 rounded-full bg-[#ffbd2e] ring-1 ring-black/20" />
            <span className="h-3 w-3 rounded-full bg-[#28c840] ring-1 ring-black/20" />
          </div>
          <span className="ml-2 inline-flex items-center gap-1.5 font-mono text-[11px] font-medium tracking-wide text-white/70">
            <Terminal className="h-3.5 w-3.5 text-[#c9a86a]" />
            aegis — brightdata • zsh
          </span>
          <span className="hidden rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 font-mono text-[10px] text-white/40 sm:inline-flex">
            {filteredLogs.length} lines
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-1 rounded-full border border-white/10 bg-black/20 p-1 font-mono text-[11px] sm:flex">
            {['ALL', 'CLI', 'ENGINE', 'HEALER', 'CI/CD'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full px-2 py-1 leading-none transition ${
                  filter === f ? 'bg-white text-black font-semibold' : 'text-white/50 hover:text-white'
                } cursor-pointer`}
              >
                {f}
              </button>
            ))}
          </div>
          <button
            onClick={handleCopyLogs}
            className="grid h-7 w-7 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white/60 hover:bg-white/[0.08] hover:text-white cursor-pointer"
            title="Copy"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* logs */}
      <div className="flex-1 overflow-y-auto bg-[#050a18] p-4 font-mono text-xs leading-relaxed">
        {filteredLogs.length === 0 ? (
          <div className="italic text-white/30">No stream yet — run a collector to start logging.</div>
        ) : (
          <div className="space-y-1.5">
            {filteredLogs.map(log => {
              const isError = log.level === 'error';
              const isHeal = log.level === 'heal';
              const isSuccess = log.level === 'success';
              return (
                <div key={log.id} className="flex gap-2">
                  <span className="shrink-0 select-none text-[11px] text-white/25">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                  <span
                    className={`shrink-0 rounded-full border px-1.5 py-0.5 text-[10px] font-bold tracking-wide ${
                      log.source === 'CLI'
                        ? 'border-cyan-500/20 bg-cyan-500/10 text-cyan-300'
                        : log.source === 'HEALER'
                          ? 'border-amber-500/20 bg-amber-500/10 text-amber-200'
                          : log.source === 'CI/CD'
                            ? 'border-indigo-500/20 bg-indigo-500/10 text-indigo-300'
                            : 'border-white/10 bg-white/[0.04] text-white/50'
                    }`}
                  >
                    {log.source}
                  </span>
                  <span
                    className={`break-all ${isError ? 'font-semibold text-rose-300' : isHeal ? 'text-amber-200' : isSuccess ? 'text-emerald-300' : 'text-white/70'}`}
                  >
                    {log.message}
                  </span>
                </div>
              );
            })}
            <div className="flex items-center gap-1 pt-2 text-white/30">
              <span>›</span>
              <span className="h-4 w-1.5 bg-[#c9a86a] animate-cursor" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
