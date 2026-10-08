import React from 'react';
import { Bookmark, Sparkles, PlusCircle } from 'lucide-react';

interface TopBarProps {
  savedCount: number;
  onOpenHistory: () => void;
  onNewBriefing: () => void;
  activeView: 'generator' | 'history';
  setActiveView: (view: 'generator' | 'history') => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  savedCount,
  onOpenHistory,
  onNewBriefing,
  activeView,
  setActiveView,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Brand wordmark */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-lg tracking-tight shadow-sm">
            PA
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            ProspecAI
          </span>
          <span className="hidden sm:inline-block text-xs text-slate-500 font-medium border-l border-slate-200 pl-3">
            Sales Intelligence & Discovery
          </span>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => setActiveView('generator')}
            className={`transition-colors whitespace-nowrap cursor-pointer ${
              activeView === 'generator'
                ? 'text-slate-950 font-semibold'
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            Gerador de Briefing
          </button>
          <button
            onClick={() => setActiveView('history')}
            className={`transition-colors whitespace-nowrap cursor-pointer ${
              activeView === 'history'
                ? 'text-slate-950 font-semibold'
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            Histórico Salvo
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            title="Abrir histórico de briefings salvos"
          >
            <Bookmark className="w-3.5 h-3.5 text-slate-500" />
            <span>Salvos</span>
            <span className="font-mono text-xs bg-white text-slate-800 px-1.5 py-0.2 rounded-md font-semibold border border-slate-200 tabular-nums">
              {savedCount}
            </span>
          </button>

          <button
            onClick={onNewBriefing}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shadow-sm cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Novo Lead</span>
          </button>
        </div>
      </div>
    </header>
  );
};
