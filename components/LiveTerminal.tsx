'use client';

import React, { useState } from 'react';
import { LogEntry } from '@/src/lib/types';
import { Terminal, Copy, Check, Filter } from 'lucide-react';

interface LiveTerminalProps {
  logs: LogEntry[];
}

export function LiveTerminal({ logs }: LiveTerminalProps) {
  const [filter, setFilter] = useState<string>('ALL');
  const [copied, setCopied] = useState(false);

  const filteredLogs = logs.filter((log) => {
    if (filter === 'ALL') return true;
    return log.source === filter || log.level === filter.toLowerCase();
  });

  const handleCopyLogs = () => {
    const text = filteredLogs
      .map((l) => `[${l.timestamp}] [${l.source}] [${l.level.toUpperCase()}] ${l.message}`)
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 flex flex-col h-96 overflow-hidden">
      {/* Terminal Titlebar */}
      <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
          </div>
          <span className="text-xs font-mono font-semibold text-slate-300 ml-2 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            Bright Data & Aegis CLI Stream
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter Pills */}
          <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono bg-slate-900 px-1.5 py-0.5 rounded-lg border border-slate-800">
            {['ALL', 'CLI', 'ENGINE', 'HEALER', 'CI/CD'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                  filter === f ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <button
            onClick={handleCopyLogs}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Copy Logs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Terminal Log Area */}
      <div className="p-4 flex-1 overflow-y-auto font-mono text-xs space-y-1.5 bg-[#070b12]">
        {filteredLogs.length === 0 ? (
          <div className="text-slate-500 italic">No log stream output yet. Execute a collector to start logging.</div>
        ) : (
          filteredLogs.map((log) => {
            const isError = log.level === 'error';
            const isHeal = log.level === 'heal';
            const isSuccess = log.level === 'success';

            return (
              <div key={log.id} className="leading-relaxed flex items-start gap-2">
                <span className="text-slate-500 select-none text-[11px] flex-shrink-0">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
                <span
                  className={`px-1.5 py-0.2 rounded text-[10px] font-bold uppercase flex-shrink-0 ${
                    log.source === 'CLI'
                      ? 'bg-cyan-950 text-cyan-400 border border-cyan-800/40'
                      : log.source === 'HEALER'
                      ? 'bg-amber-950 text-amber-400 border border-amber-800/40'
                      : log.source === 'CI/CD'
                      ? 'bg-indigo-950 text-indigo-400 border border-indigo-800/40'
                      : 'bg-slate-900 text-slate-400 border border-slate-800'
                  }`}
                >
                  {log.source}
                </span>

                <span
                  className={`break-all ${
                    isError
                      ? 'text-rose-400 font-semibold'
                      : isHeal
                      ? 'text-amber-300 font-medium'
                      : isSuccess
                      ? 'text-emerald-400'
                      : 'text-slate-300'
                  }`}
                >
                  {log.message}
                </span>
              </div>
            );
          })
        )}
        <div className="flex items-center gap-1 text-slate-500 pt-2">
          <span>&gt;</span>
          <span className="w-2 h-4 bg-emerald-400 inline-block animate-cursor"></span>
        </div>
      </div>
    </div>
  );
}
