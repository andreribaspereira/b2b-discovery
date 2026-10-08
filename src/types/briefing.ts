export interface LeadInputs {
  leadName: string;
  company: string;
  role: string;
  theme: string;
}

export interface Output1Data {
  empresaPerfil: {
    setor: string;
    tamanhoEstimado: string;
    principaisProdutos: string;
    posicionamento: string;
  };
  doresProvaveis: string[];
  insightsLead: {
    esferaInfluencia: 'Influenciador' | 'Decisor' | 'Técnico' | 'Campeão' | string;
    justificativa: string;
  };
  elephantInTheRoom: {
    objecaoPontoCego: string;
    respostaEstrategica: string;
  };
  perguntasDePoder: string[];
}

export interface Output2Data {
  assunto: string;
  corpoEmail: string;
  spinAnalysis?: {
    situacaoProblema?: string;
    implicacao?: string;
    necessidadeSolucao?: string;
  };
  wordCount: number;
}

export interface Output3Data {
  mensagemLinkedin: string;
  charCount: number;
}

export interface BriefingReport {
  id: string;
  createdAt: string;
  inputs: LeadInputs;
  output1: Output1Data;
  output2: Output2Data;
  output3: Output3Data;
  rawMarkdown: string;
}
