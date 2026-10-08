import { LeadInputs } from '../types/briefing';

export interface PresetScenario {
  id: string;
  badge: string;
  title: string;
  description: string;
  inputs: LeadInputs;
}

export const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: 'fintech-finops',
    badge: 'Fintech · FinOps',
    title: 'Camila Rocha (CTO)',
    description: 'ContaSimples · Otimização e Governança de Custos Cloud',
    inputs: {
      leadName: 'Camila Rocha',
      company: 'ContaSimples (contasimples.com)',
      role: 'CTO (Chief Technology Officer)',
      theme: 'Governança Cloud, Redução de Desperdício AWS/GCP e FinOps Automatizado',
    },
  },
  {
    id: 'enterprise-logistics',
    badge: 'Enterprise · IA Preditiva',
    title: 'Rodrigo Mendes (Diretor de Supply Chain)',
    description: 'Natura · IA para Prevenção de Ruptura de Estoque e Last-Mile',
    inputs: {
      leadName: 'Rodrigo Mendes',
      company: 'Natura (natura.com.br)',
      role: 'Diretor de Supply Chain e Operações',
      theme: 'IA Preditiva para Prevenção de Ruptura de Estoque e Roteirização Last-Mile',
    },
  },
  {
    id: 'saas-revops',
    badge: 'SaaS · RevOps',
    title: 'Larissa Duarte (VP de Vendas)',
    description: 'RD Station · IA Conversacional para Aceleração de Ramping de Vendedores',
    inputs: {
      leadName: 'Larissa Duarte',
      company: 'RD Station (rdstation.com)',
      role: 'VP de Vendas e Operações de Receita (RevOps)',
      theme: 'Inteligência Conversacional para Aumento de Conversão de Discovery e Ramping de AEs',
    },
  },
];
