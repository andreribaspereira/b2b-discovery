import React, { useState } from 'react';
import {
  Copy,
  Check,
  Download,
  Share2,
  Bookmark,
  BookmarkCheck,
  Building,
  AlertTriangle,
  HelpCircle,
  Mail,
  Linkedin,
  FileText,
  ShieldAlert,
  Flame,
  ArrowRight,
  TrendingDown
} from 'lucide-react';
import { BriefingReport } from '../types/briefing';
import { exportBriefingToPdf } from '../utils/pdfExport';

interface DossierViewProps {
  report: BriefingReport;
  isSaved: boolean;
  onToggleSave: () => void;
}

export const DossierView: React.FC<DossierViewProps> = ({
  report,
  isSaved,
  onToggleSave,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'output1' | 'output2' | 'output3'>('all');
  const [copiedState, setCopiedState] = useState<{ [key: string]: boolean }>({});
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedState((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setCopiedState((prev) => ({ ...prev, [key]: false }));
    }, 2000);
  };

  const handleDownloadPdf = () => {
    try {
      setIsExportingPdf(true);
      exportBriefingToPdf(report);
    } catch (err) {
      console.error('Erro ao gerar PDF:', err);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const { output1, output2, output3, inputs } = report;

  // Format email in strict output format
  const formattedEmailCopy = `**Assunto:** ${output2.assunto}

**Email:**
${output2.corpoEmail}`;

  return (
    <div className="space-y-6">
      {/* Executive Header Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-5 md:p-6 shadow-sm border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1.5 font-medium">
              <span>{inputs.company}</span>
              <span>·</span>
              <span>{inputs.role}</span>
              <span>·</span>
              <span className="font-mono tabular-nums">
                {new Date(report.createdAt).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
              {inputs.leadName}
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              <strong className="text-slate-100">Foco Comercial:</strong> {inputs.theme}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onToggleSave}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer border ${
                isSaved
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800 hover:bg-emerald-900/80'
                  : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
              }`}
            >
              {isSaved ? (
                <>
                  <BookmarkCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Salvo no Histórico</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>Salvar Briefing</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={isExportingPdf}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
              title="Baixar dossiê executivo em PDF"
            >
              <Download className="w-3.5 h-3.5 text-rose-400" />
              <span>{isExportingPdf ? 'Gerando...' : 'Baixar PDF'}</span>
            </button>

            <button
              onClick={() => handleCopy('all_markdown', report.rawMarkdown)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-white text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              {copiedState['all_markdown'] ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Tudo</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Segmented Filter Controls */}
        <div className="flex items-center gap-1 mt-6 pt-4 border-t border-slate-800/80 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'all'
                ? 'bg-white/10 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Visão Completa Sequencial
          </button>
          <button
            onClick={() => setActiveTab('output1')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'output1'
                ? 'bg-white/10 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Output #1: Relatório Discovery
          </button>
          <button
            onClick={() => setActiveTab('output2')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'output2'
                ? 'bg-white/10 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Output #2: Email SPIN
          </button>
          <button
            onClick={() => setActiveTab('output3')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'output3'
                ? 'bg-white/10 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Output #3: Mensagem LinkedIn
          </button>
        </div>
      </div>

      {/* Output #1: Relatório Estratégico de Discovery */}
      {(activeTab === 'all' || activeTab === 'output1') && (
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-indigo-600 tracking-wide uppercase">
                2.1 · Output #1
              </span>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight mt-0.5">
                Relatório Estratégico de Discovery
              </h2>
            </div>
            <button
              onClick={() => {
                const text = `Output #1: Relatório Estratégico de Discovery\n\nA. Perfil da Empresa:\nSetor: ${output1.empresaPerfil.setor}\nTamanho: ${output1.empresaPerfil.tamanhoEstimado}\nProdutos: ${output1.empresaPerfil.principaisProdutos}\nPosicionamento: ${output1.empresaPerfil.posicionamento}\n\nB. Dores Prováveis:\n${output1.doresProvaveis.join('\n')}\n\nC. Insights sobre o Lead:\nEsfera: ${output1.insightsLead.esferaInfluencia}\nJustificativa: ${output1.insightsLead.justificativa}\n\nD. The Elephant in the Room & Resposta à Objeção:\nObjeção/Ponto Cego: ${output1.elephantInTheRoom.objecaoPontoCego}\nResposta Estratégica: ${output1.elephantInTheRoom.respostaEstrategica}\n\nE. 3 Perguntas de Poder:\n${output1.perguntasDePoder.join('\n')}`;
                handleCopy('output1', text);
              }}
              className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              {copiedState['output1'] ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedState['output1'] ? 'Copiado' : 'Copiar Output #1'}</span>
            </button>
          </div>

          {/* A. Perfil da Empresa */}
          <div>
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-3">
              <Building className="w-4 h-4 text-slate-600" />
              <span>A. Perfil da Empresa</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-50/70 rounded-lg p-4 border border-slate-200/80">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase">Setor de Atuação</span>
                <p className="text-sm font-medium text-slate-900 mt-0.5">{output1.empresaPerfil.setor}</p>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase">Porte / Tamanho Estimado</span>
                <p className="text-sm font-medium text-slate-900 mt-0.5">{output1.empresaPerfil.tamanhoEstimado}</p>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase">Principais Produtos & Serviços</span>
                <p className="text-sm text-slate-800 mt-0.5 leading-relaxed">{output1.empresaPerfil.principaisProdutos}</p>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase">Posicionamento de Mercado</span>
                <p className="text-sm text-slate-800 mt-0.5 leading-relaxed">{output1.empresaPerfil.posicionamento}</p>
              </div>
            </div>
          </div>

          {/* B. Análise de Dores Prováveis */}
          <div>
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>B. Análise de Dores Prováveis (3 Maiores Desafios)</span>
            </h3>
            <div className="space-y-2.5">
              {output1.doresProvaveis.map((dor, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3.5 rounded-lg bg-amber-50/30 border border-amber-200/60"
                >
                  <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 font-mono">
                    0{index + 1}
                  </span>
                  <p className="text-sm text-slate-800 leading-relaxed font-medium">
                    {dor}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* C. Insights sobre o Lead */}
          <div>
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-3">
              <Flame className="w-4 h-4 text-indigo-600" />
              <span>C. Insights sobre o Lead & Esfera de Influência</span>
            </h3>
            <div className="p-4 rounded-lg bg-indigo-50/40 border border-indigo-200/70">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold text-indigo-900 uppercase">
                  Classificação Decisória:
                </span>
                <span className="text-xs font-bold text-indigo-800 bg-indigo-100/80 px-2.5 py-0.5 rounded-md font-mono">
                  {output1.insightsLead.esferaInfluencia}
                </span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                {output1.insightsLead.justificativa}
              </p>
            </div>
          </div>

          {/* D. "The Elephant in the Room" & Resposta à Objeção */}
          <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-5">
            <div className="flex items-center gap-2 mb-3">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              <h3 className="text-sm font-bold text-rose-950">
                D. "The Elephant in the Room" & Resposta Estratégica à Objeção
              </h3>
            </div>

            <div className="space-y-4">
              {/* Ponto Cego / Objeção Oculta */}
              <div className="bg-white/80 rounded-lg p-3.5 border border-rose-200/80">
                <div className="text-[11px] font-bold text-rose-700 uppercase tracking-wide mb-1">
                  Ponto Cego / Objeção Oculta Identificada
                </div>
                <p className="text-sm text-slate-900 font-medium leading-relaxed">
                  {output1.elephantInTheRoom.objecaoPontoCego}
                </p>
              </div>

              {/* Resposta à Objeção (Adicionada conforme solicitação) */}
              <div className="bg-white rounded-lg p-4 border-l-4 border-emerald-500 border-r border-t border-b border-slate-200 shadow-xs">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wide mb-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Como Desarmar & Reenquadrar na Reunião (Resposta à Objeção)</span>
                </div>
                <p className="text-sm text-slate-800 leading-relaxed font-normal">
                  {output1.elephantInTheRoom.respostaEstrategica}
                </p>
              </div>
            </div>
          </div>

          {/* E. 3 Perguntas de Poder */}
          <div>
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-3">
              <HelpCircle className="w-4 h-4 text-emerald-600" />
              <span>E. 3 Perguntas de Poder (Custo da Inação no Discovery)</span>
            </h3>
            <div className="space-y-2.5">
              {output1.perguntasDePoder.map((pergunta, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3.5 rounded-lg bg-slate-50 border border-slate-200"
                >
                  <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 font-mono">
                    P{index + 1}
                  </span>
                  <p className="text-sm text-slate-800 italic leading-relaxed">
                    "{pergunta}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Output #2: Texto para Envio de Email */}
      {(activeTab === 'all' || activeTab === 'output2') && (
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-blue-600 tracking-wide uppercase">
                2.2 · Output #2
              </span>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight mt-0.5">
                Texto para Envio de Email (Framework SPIN)
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono tabular-nums text-slate-500 bg-slate-100 px-2 py-1 rounded">
                {output2.wordCount} palavras (máx: 200)
              </span>
              <button
                onClick={() => handleCopy('output2_email', formattedEmailCopy)}
                className="text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                {copiedState['output2_email'] ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedState['output2_email'] ? 'Copiado!' : 'Copiar Email Completo'}</span>
              </button>
            </div>
          </div>

          {/* Strict formatting display */}
          <div className="bg-slate-50/70 rounded-lg p-5 border border-slate-200 space-y-4 font-sans">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-700">Assunto:</span>
                <button
                  onClick={() => handleCopy('subject', output2.assunto)}
                  className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                >
                  {copiedState['subject'] ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>Copiar assunto</span>
                </button>
              </div>
              <div className="p-2.5 bg-white rounded-md border border-slate-200 text-sm font-semibold text-slate-900 select-all">
                {output2.assunto}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-700">Email:</span>
                <button
                  onClick={() => handleCopy('body', output2.corpoEmail)}
                  className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                >
                  {copiedState['body'] ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>Copiar corpo</span>
                </button>
              </div>
              <div className="p-4 bg-white rounded-md border border-slate-200 text-sm text-slate-800 whitespace-pre-line leading-relaxed select-all">
                {output2.corpoEmail}
              </div>
            </div>
          </div>

          {/* SPIN Logic Disclosure */}
          {output2.spinAnalysis && (
            <div className="p-3.5 bg-blue-50/50 rounded-lg border border-blue-200/60 text-xs text-blue-900">
              <span className="font-bold uppercase tracking-wider block mb-1">
                Raciocínio Estruturado SPIN Aplicado:
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
                <div className="bg-white/80 p-2 rounded border border-blue-200/50">
                  <strong className="block text-slate-800 text-[11px]">Situação / Problema:</strong>
                  <span className="text-slate-600 text-[11px]">{output2.spinAnalysis.situacaoProblema}</span>
                </div>
                <div className="bg-white/80 p-2 rounded border border-blue-200/50">
                  <strong className="block text-slate-800 text-[11px]">Implicação (Custo):</strong>
                  <span className="text-slate-600 text-[11px]">{output2.spinAnalysis.implicacao}</span>
                </div>
                <div className="bg-white/80 p-2 rounded border border-blue-200/50">
                  <strong className="block text-slate-800 text-[11px]">Necessidade de Solução:</strong>
                  <span className="text-slate-600 text-[11px]">{output2.spinAnalysis.necessidadeSolucao}</span>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Output #3: Mensagem para LinkedIn */}
      {(activeTab === 'all' || activeTab === 'output3') && (
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-sky-600 tracking-wide uppercase">
                2.3 · Output #3
              </span>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight mt-0.5">
                Texto para Mensagem no LinkedIn
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono tabular-nums text-slate-500 bg-slate-100 px-2 py-1 rounded">
                {output3.charCount} caracteres (máx: 500)
              </span>
              <button
                onClick={() => handleCopy('output3_linkedin', output3.mensagemLinkedin)}
                className="text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                {copiedState['output3_linkedin'] ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedState['output3_linkedin'] ? 'Copiado!' : 'Copiar Mensagem'}</span>
              </button>
            </div>
          </div>

          <div className="bg-[#f3f6f8] rounded-xl p-5 border border-slate-200">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 rounded-full bg-sky-700 text-white flex items-center justify-center font-bold text-xs">
                in
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Mensagem Direta / InMail</p>
                <p className="text-[10px] text-slate-500">Direcionado a {inputs.leadName} ({inputs.role})</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-slate-200 text-sm text-slate-800 leading-relaxed select-all">
              {output3.mensagemLinkedin}
            </div>
          </div>
        </section>
      )}

      {/* Raw Markdown view if requested */}
      {activeTab === 'all' && (
        <div className="pt-2 text-center">
          <button
            onClick={() => handleCopy('all_raw', report.rawMarkdown)}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 font-medium py-2 px-3 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            {copiedState['all_raw'] ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <FileText className="w-3.5 h-3.5" />}
            <span>Copiar formato Markdown bruto para colar em CRM / Notion</span>
          </button>
        </div>
      )}
    </div>
  );
};
