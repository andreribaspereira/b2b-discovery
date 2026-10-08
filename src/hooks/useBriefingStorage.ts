import { useState, useEffect, useCallback } from 'react';
import { BriefingReport } from '../types/briefing';

const STORAGE_KEY = 'prospecai_saved_briefings_v1';

export function useBriefingStorage() {
  const [savedBriefings, setSavedBriefings] = useState<BriefingReport[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setSavedBriefings(parsed);
        }
      }
    } catch (e) {
      console.error('Falha ao carregar relatórios do localStorage:', e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save array to localStorage helper
  const persist = useCallback((list: BriefingReport[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      setSavedBriefings(list);
    } catch (e) {
      console.error('Falha ao salvar no localStorage:', e);
    }
  }, []);

  // Save or update a briefing
  const saveReport = useCallback((report: BriefingReport) => {
    setSavedBriefings((prev) => {
      const filtered = prev.filter((item) => item.id !== report.id);
      const updated = [report, ...filtered];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Erro ao persistir relatório:', e);
      }
      return updated;
    });
  }, []);

  // Delete a briefing by id
  const deleteReport = useCallback((id: string) => {
    setSavedBriefings((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Erro ao deletar relatório:', e);
      }
      return updated;
    });
  }, []);

  // Clear all saved reports
  const clearAllReports = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setSavedBriefings([]);
    } catch (e) {
      console.error('Erro ao limpar histórico:', e);
    }
  }, []);

  // Check if a report is saved
  const isReportSaved = useCallback((id: string) => {
    return savedBriefings.some((item) => item.id === id);
  }, [savedBriefings]);

  // Export all saved reports to downloadable JSON
  const exportReportsAsJson = useCallback(() => {
    try {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(savedBriefings, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `briefings_backup_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (e) {
      console.error('Erro ao exportar JSON:', e);
    }
  }, [savedBriefings]);

  return {
    savedBriefings,
    isInitialized,
    saveReport,
    deleteReport,
    clearAllReports,
    isReportSaved,
    exportReportsAsJson,
  };
}
