import React, { useState } from 'react';
import {
  X,
  Search,
  Trash2,
  Download,
  Calendar,
  Building,
  User,
  ArrowRight,
  Copy,
  Check,
  BookmarkX,
  FileText
} from 'lucide-react';
import { BriefingReport } from '../types/briefing';

interface SavedBriefingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedBriefings: BriefingReport[];
  onSelectBriefing: (report: BriefingReport) => void;
  onDeleteBriefing: (id: string) => void;
  onClearAll: () => void;
  onExportJson: () => void;
}

export const SavedBriefingsDrawer: React.FC<SavedBriefingsDrawerProps> = ({
  isOpen,
  onClose,
  savedBriefings,
  onSelectBriefing,
  onDeleteBriefing,
  onClearAll,
  onExportJson,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmClear, setConfirmClear] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredBriefings = savedBriefings.filter((b) => {
    const q = searchTerm.toLowerCase();
    return (
      b.inputs.leadName.toLowerCase().includes(q) ||
      b.inputs.company.toLowerCase().includes(q) ||
      b.inputs.role.toLowerCase().includes(q) ||
      b.inputs.theme.toLowerCase().includes(q)
    );
  });

  const handleCopyEmail = (e: React.MouseEvent, report: BriefingReport) => {
    e.stopPropagation();
    const text = `**Assunto:** ${report.output2.assunto}\n\n**Email:**\n${report.output2.corpoEmail}`;
    navigator.clipboard.writeText(text);
    setCopiedId(report.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Histórico de Briefings Salvos
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {savedBriefings.length} {savedBriefings.length === 1 ? 'briefing armazenado' : 'briefings armazenados'} no navegador
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search bar */}
          <div className="p-4 border-b border-slate-100 bg-white">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por lead, empresa, cargo ou tema..."
                className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
              />
            </div>
          </div>

          {/* List of saved items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredBriefings.length === 0 ? (
              <div className="text-center py-12 px-4">
                <BookmarkX className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700">
                  {savedBriefings.length === 0
                    ? 'Nenhum briefing salvo ainda'
                    : 'Nenhum briefing encontrado para esta busca'}
                </p>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  {savedBriefings.length === 0
                    ? 'Gere um novo briefing e clique em "Salvar Briefing" para revisá-lo posteriormente.'
                    : 'Tente alterar os termos de busca.'}
                </p>
              </div>
            ) : (
              filteredBriefings.map((b) => (
                <div
                  key={b.id}
                  onClick={() => {
                    onSelectBriefing(b);
                    onClose();
                  }}
                  className="group p-3.5 rounded-xl border border-slate-200 hover:border-slate-400 bg-white hover:bg-slate-50/50 transition-all cursor-pointer shadow-xs space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {b.inputs.leadName}
                      </h3>
                      <p className="text-xs font-medium text-slate-600 mt-0.5">
                        {b.inputs.role} · {b.inputs.company}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono tabular-nums text-slate-600 shrink-0">
                      {new Date(b.createdAt).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                      })}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                    <strong className="text-slate-700 font-medium">Tema:</strong> {b.inputs.theme}
                  </p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-semibold text-indigo-700 group-hover:underline flex items-center gap-1">
                      <span>Revisar Dossiê</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => handleCopyEmail(e, b)}
                        className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-md transition-colors cursor-pointer"
                        title="Copiar email deste briefing"
                      >
                        {copiedId === b.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteBriefing(b.id);
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                        title="Excluir este briefing"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with actions */}
          {savedBriefings.length > 0 && (
            <div className="p-4 border-t border-slate-200 bg-slate-50/70 space-y-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={onExportJson}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Exportar Backup (JSON)</span>
                </button>

                {confirmClear ? (
                  <button
                    onClick={() => {
                      onClearAll();
                      setConfirmClear(false);
                    }}
                    className="py-2 px-3 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors cursor-pointer"
                  >
                    Confirmar Limpeza
                  </button>
                ) : (
                  <button
                    onClick={() => setConfirmClear(true)}
                    className="py-2 px-3 text-xs font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Apagar todos os relatórios"
                  >
                    Limpar Tudo
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
