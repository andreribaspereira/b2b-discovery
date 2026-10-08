import React, { useState } from 'react';
import { TopBar } from './components/TopBar';
import { IntakeForm } from './components/IntakeForm';
import { DossierView } from './components/DossierView';
import { SavedBriefingsDrawer } from './components/SavedBriefingsDrawer';
import { EmptyState } from './components/EmptyState';
import { useBriefingStorage } from './hooks/useBriefingStorage';
import { LeadInputs, BriefingReport } from './types/briefing';
import { PresetScenario } from './data/presets';
import { AlertCircle, CheckCircle2, BookmarkCheck } from 'lucide-react';

const INITIAL_INPUTS: LeadInputs = {
  leadName: '',
  company: '',
  role: '',
  theme: '',
};

export default function App() {
  const [inputs, setInputs] = useState<LeadInputs>(INITIAL_INPUTS);
  const [currentReport, setCurrentReport] = useState<BriefingReport | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<'generator' | 'history'>('generator');

  const {
    savedBriefings,
    saveReport,
    deleteReport,
    clearAllReports,
    isReportSaved,
    exportReportsAsJson,
  } = useBriefingStorage();

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleGenerate = async () => {
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/generate-briefing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputs),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || result.error || 'Erro ao processar dados.');
      }

      if (!result.data) {
        throw new Error('Formato de resposta inesperado do servidor.');
      }

      const newReport: BriefingReport = {
        id: `briefing_${Date.now()}`,
        createdAt: new Date().toISOString(),
        inputs: { ...inputs },
        output1: result.data.output1,
        output2: result.data.output2,
        output3: result.data.output3,
        rawMarkdown: result.data.rawMarkdown,
      };

      setCurrentReport(newReport);

      // Automatically save to local storage as per user requirement
      saveReport(newReport);
      showToast('Briefing gerado com sucesso e salvo no histórico local!');
    } catch (err: any) {
      console.error('Erro na geração:', err);
      setErrorMessage(
        err.message || 'Falha na comunicação com o servidor de inteligência comercial.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleSaveCurrent = () => {
    if (!currentReport) return;
    if (isReportSaved(currentReport.id)) {
      deleteReport(currentReport.id);
      showToast('Briefing removido dos salvos.');
    } else {
      saveReport(currentReport);
      showToast('Briefing salvo no armazenamento local!');
    }
  };

  const handleSelectPreset = (preset: PresetScenario) => {
    setInputs(preset.inputs);
    setErrorMessage(null);
  };

  const handleNewBriefing = () => {
    setInputs(INITIAL_INPUTS);
    setCurrentReport(null);
    setErrorMessage(null);
  };

  const handleSelectFromHistory = (report: BriefingReport) => {
    setCurrentReport(report);
    setInputs(report.inputs);
    setActiveView('generator');
    showToast(`Briefing de ${report.inputs.leadName} carregado com sucesso.`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Bar */}
      <TopBar
        savedCount={savedBriefings.length}
        onOpenHistory={() => setIsDrawerOpen(true)}
        onNewBriefing={handleNewBriefing}
        activeView={activeView}
        setActiveView={setActiveView}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error notification banner */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-800 text-sm">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-bold text-red-900">Atenção na Análise</h4>
              <p className="mt-0.5 text-xs text-red-700 leading-relaxed">
                {errorMessage}
              </p>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-xs font-semibold text-red-700 hover:text-red-950 cursor-pointer"
            >
              Fechar
            </button>
          </div>
        )}

        {/* View switching */}
        {activeView === 'history' ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Biblioteca de Briefings Salvos
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Revise e exporte os dossiês e mensagens de abordagem salvos localmente
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={exportReportsAsJson}
                  disabled={savedBriefings.length === 0}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 disabled:opacity-50 transition-colors cursor-pointer"
                >
                  Exportar Backup (.json)
                </button>
                <button
                  onClick={() => setActiveView('generator')}
                  className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Voltar ao Gerador
                </button>
              </div>
            </div>

            {savedBriefings.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
                <BookmarkCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800">Nenhum briefing salvo ainda</h3>
                <p className="text-xs text-slate-500 mt-1 mb-6">
                  Todos os relatórios gerados são salvos automaticamente no armazenamento local para consulta posterior.
                </p>
                <button
                  onClick={() => setActiveView('generator')}
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Gerar Primeiro Briefing
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedBriefings.map((b) => (
                  <div
                    key={b.id}
                    onClick={() => handleSelectFromHistory(b)}
                    className="p-5 rounded-xl border border-slate-200 bg-white hover:border-slate-400 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mb-2">
                        <span>{new Date(b.createdAt).toLocaleDateString('pt-BR')}</span>
                        <span className="text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded">
                          {b.output1?.insightsLead?.esferaInfluencia || 'Lead'}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900">{b.inputs.leadName}</h3>
                      <p className="text-xs text-slate-600 font-medium mt-0.5">
                        {b.inputs.role} · {b.inputs.company}
                      </p>
                      <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                        <strong className="text-slate-700">Tema:</strong> {b.inputs.theme}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-semibold text-indigo-700">
                        Abrir Dossiê Completo →
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteReport(b.id);
                        }}
                        className="text-xs text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                        title="Excluir"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Intake & Validation Form (5 cols) */}
            <div className="lg:col-span-5 sticky lg:top-24">
              <IntakeForm
                inputs={inputs}
                onChange={setInputs}
                onSubmit={handleGenerate}
                isLoading={isLoading}
                onReset={handleNewBriefing}
              />
            </div>

            {/* Right Column: Dossier or Empty State (7 cols) */}
            <div className="lg:col-span-7">
              {currentReport ? (
                <DossierView
                  report={currentReport}
                  isSaved={isReportSaved(currentReport.id)}
                  onToggleSave={handleToggleSaveCurrent}
                />
              ) : (
                <EmptyState onSelectPreset={handleSelectPreset} />
              )}
            </div>
          </div>
        )}
      </main>

      {/* Saved Briefings Drawer */}
      <SavedBriefingsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        savedBriefings={savedBriefings}
        onSelectBriefing={handleSelectFromHistory}
        onDeleteBriefing={deleteReport}
        onClearAll={clearAllReports}
        onExportJson={exportReportsAsJson}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs font-medium px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
