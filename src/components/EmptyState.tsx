import React from 'react';
import { Target, Zap, Shield, Mail, HelpCircle, ArrowUpRight } from 'lucide-react';
import { PRESET_SCENARIOS, PresetScenario } from '../data/presets';
import { LeadInputs } from '../types/briefing';

interface EmptyStateProps {
  onSelectPreset: (preset: PresetScenario) => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onSelectPreset }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 md:p-8 space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-3">
          <Zap className="w-3.5 h-3.5" />
          <span>Inteligência Comercial & Discovery B2B</span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
          Prepare-se para reuniões de Discovery com autoridade máxima
        </h2>
        <p className="text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
          O agente analisa as dores prováveis, a esfera decisória do lead, diagnostica o
          ponto cego oculto com sua respectiva <strong>resposta estratégica à objeção</strong> e gera abordagens
          personalizadas em Email (framework SPIN) e LinkedIn.
        </p>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-slate-50/70 border border-slate-200/80">
          <div className="w-8 h-8 rounded-md bg-slate-900 text-white flex items-center justify-center mb-3">
            <Target className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
            1. Relatório de Discovery
          </h3>
          <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
            Perfil da empresa, 3 maiores dores prováveis, esfera de influência e as 3 Perguntas de Poder sobre o custo da inação.
          </p>
        </div>

        <div className="p-4 rounded-lg bg-rose-50/50 border border-rose-200/70">
          <div className="w-8 h-8 rounded-md bg-rose-600 text-white flex items-center justify-center mb-3">
            <Shield className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-rose-950 uppercase tracking-wide">
            2. Quebra do "Elephant"
          </h3>
          <p className="text-xs text-rose-900/80 mt-1.5 leading-relaxed">
            Identificação da objeção silenciosa e o script de reenquadramento consultivo pronto para ser usado ao vivo.
          </p>
        </div>

        <div className="p-4 rounded-lg bg-blue-50/50 border border-blue-200/70">
          <div className="w-8 h-8 rounded-md bg-blue-600 text-white flex items-center justify-center mb-3">
            <Mail className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-blue-950 uppercase tracking-wide">
            3. Copywriting SPIN & LinkedIn
          </h3>
          <p className="text-xs text-blue-900/80 mt-1.5 leading-relaxed">
            Email consultivo de até 200 palavras e mensagem LinkedIn em menos de 500 caracteres, ambos com CTA de baixa fricção.
          </p>
        </div>
      </div>

      {/* Instant Demo Presets */}
      <div className="pt-2 border-t border-slate-100">
        <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
          Selecione um perfil de demonstração para testar agora:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {PRESET_SCENARIOS.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => onSelectPreset(scenario)}
              className="text-left p-3.5 rounded-lg border border-slate-200 hover:border-slate-900 bg-white hover:bg-slate-50 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between text-xs font-bold text-slate-900 group-hover:text-indigo-600">
                <span>{scenario.title}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                {scenario.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
