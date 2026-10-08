import React, { useState } from 'react';
import { Sparkles, User, Building2, Briefcase, Target, AlertCircle, RotateCcw } from 'lucide-react';
import { LeadInputs } from '../types/briefing';
import { PRESET_SCENARIOS, PresetScenario } from '../data/presets';

interface IntakeFormProps {
  inputs: LeadInputs;
  onChange: (inputs: LeadInputs) => void;
  onSubmit: () => void;
  isLoading: boolean;
  onReset: () => void;
}

export const IntakeForm: React.FC<IntakeFormProps> = ({
  inputs,
  onChange,
  onSubmit,
  isLoading,
  onReset,
}) => {
  const [touched, setTouched] = useState(false);

  const missingFields: string[] = [];
  if (!inputs.leadName.trim()) missingFields.push('1.1 Nome do Lead');
  if (!inputs.company.trim()) missingFields.push('1.2 Nome da Empresa/Site');
  if (!inputs.role.trim()) missingFields.push('1.3 Cargo do Lead');
  if (!inputs.theme.trim()) missingFields.push('1.4 Tema produto/serviço');

  const isValid = missingFields.length === 0;

  const handleFieldChange = (field: keyof LeadInputs, value: string) => {
    onChange({
      ...inputs,
      [field]: value,
    });
  };

  const handleApplyPreset = (preset: PresetScenario) => {
    onChange(preset.inputs);
    setTouched(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (isValid && !isLoading) {
      onSubmit();
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 md:p-6">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Passo 1: Coleta & Validação de Dados
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Preencha os 4 parâmetros obrigatórios para a dissecação do perfil
          </p>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors cursor-pointer"
          title="Limpar formulário"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Limpar</span>
        </button>
      </div>

      {/* Preset Scenarios selector */}
      <div className="mb-5">
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
          Exemplos Rápidos de Prospecção B2B
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {PRESET_SCENARIOS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className="text-left p-2.5 rounded-lg border border-slate-200 hover:border-slate-400 bg-slate-50/60 hover:bg-slate-50 transition-all cursor-pointer group"
            >
              <div className="text-[11px] font-semibold text-slate-800 group-hover:text-slate-950 truncate">
                {preset.title}
              </div>
              <div className="text-[10px] text-slate-500 truncate mt-0.5">
                {preset.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Field 1.1: Nome do Lead */}
        <div>
          <label className="flex items-center justify-between text-xs font-semibold text-slate-800 mb-1.5">
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-500" />
              1.1 Nome do Lead
            </span>
            <span className="text-[10px] font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
              Obrigatório
            </span>
          </label>
          <input
            type="text"
            value={inputs.leadName}
            onChange={(e) => handleFieldChange('leadName', e.target.value)}
            placeholder="Ex: Camila Rocha"
            className={`w-full px-3.5 py-2 text-sm bg-slate-50/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all ${
              touched && !inputs.leadName.trim()
                ? 'border-red-400 bg-red-50/20'
                : 'border-slate-200'
            }`}
          />
        </div>

        {/* Field 1.2: Nome da Empresa/Site */}
        <div>
          <label className="flex items-center justify-between text-xs font-semibold text-slate-800 mb-1.5">
            <span className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-500" />
              1.2 Nome da Empresa ou Razão Social / Site
            </span>
            <span className="text-[10px] font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
              Obrigatório
            </span>
          </label>
          <input
            type="text"
            value={inputs.company}
            onChange={(e) => handleFieldChange('company', e.target.value)}
            placeholder="Ex: ContaSimples ou contasimples.com"
            className={`w-full px-3.5 py-2 text-sm bg-slate-50/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all ${
              touched && !inputs.company.trim()
                ? 'border-red-400 bg-red-50/20'
                : 'border-slate-200'
            }`}
          />
        </div>

        {/* Field 1.3: Cargo do Lead */}
        <div>
          <label className="flex items-center justify-between text-xs font-semibold text-slate-800 mb-1.5">
            <span className="flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-slate-500" />
              1.3 Cargo do Lead
            </span>
            <span className="text-[10px] font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
              Obrigatório
            </span>
          </label>
          <input
            type="text"
            value={inputs.role}
            onChange={(e) => handleFieldChange('role', e.target.value)}
            placeholder="Ex: CTO (Chief Technology Officer) ou VP de Operações"
            className={`w-full px-3.5 py-2 text-sm bg-slate-50/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all ${
              touched && !inputs.role.trim()
                ? 'border-red-400 bg-red-50/20'
                : 'border-slate-200'
            }`}
          />
        </div>

        {/* Field 1.4: Tema produto/serviço */}
        <div>
          <label className="flex items-center justify-between text-xs font-semibold text-slate-800 mb-1.5">
            <span className="flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-slate-500" />
              1.4 Temática a ser explorada (Produto / Serviço a vender)
            </span>
            <span className="text-[10px] font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
              Obrigatório
            </span>
          </label>
          <textarea
            rows={3}
            value={inputs.theme}
            onChange={(e) => handleFieldChange('theme', e.target.value)}
            placeholder="Ex: Governança de nuvem, otimização de custos AWS e FinOps automatizado"
            className={`w-full px-3.5 py-2 text-sm bg-slate-50/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all resize-none ${
              touched && !inputs.theme.trim()
                ? 'border-red-400 bg-red-50/20'
                : 'border-slate-200'
            }`}
          />
        </div>

        {/* Validation warning if incomplete */}
        {touched && !isValid && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2.5 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
            <div>
              <p className="font-semibold">Atenção: Dados pendentes para geração</p>
              <p className="text-[11px] text-red-600 mt-0.5">
                Preencha todos os campos obrigatórios: {missingFields.join(', ')}.
              </p>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 px-4 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ${
            isLoading
              ? 'bg-slate-400 text-white cursor-not-allowed'
              : 'bg-slate-900 hover:bg-slate-800 text-white hover:shadow-md'
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Dissecando Perfil & Gerando Briefing...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Gerar Briefing B2B de Alta Performance</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
