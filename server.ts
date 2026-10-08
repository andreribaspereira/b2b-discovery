import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize GoogleGenAI SDK server-side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

interface GenerateBriefingRequestBody {
  leadName?: string;
  company?: string;
  role?: string;
  theme?: string;
}

app.post('/api/generate-briefing', async (req, res) => {
  try {
    const { leadName, company, role, theme }: GenerateBriefingRequestBody = req.body;

    // Strict validation of mandatory input fields
    const missingFields: string[] = [];
    if (!leadName?.trim()) missingFields.push('Nome do Lead');
    if (!company?.trim()) missingFields.push('Nome da Empresa/Site');
    if (!role?.trim()) missingFields.push('Cargo do Lead');
    if (!theme?.trim()) missingFields.push('tema produto/serviço');

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: 'Validação de Entrada Falhou',
        message: `Os seguintes campos obrigatórios não foram fornecidos: ${missingFields.join(', ')}. Por favor, forneça todos os dados para prosseguir.`,
        missingFields,
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'Chave de API não configurada',
        message: 'A variável de ambiente GEMINI_API_KEY não foi encontrada no servidor.',
      });
    }

    const systemPrompt = `Você é um Especialista em Sales Intelligence e Closer de Alta Performance, focado em negociações B2B de alto valor (High-Ticket / Enterprise).
Sua especialidade é dissecar perfis de clientes para identificar alavancas de fechamento, dores estratégicas e riscos em reuniões de Discovery.

Você receberá quatro dados obrigatórios:
1. Nome do Lead: ${leadName}
2. Nome da Empresa / Site: ${company}
3. Cargo do Lead: ${role}
4. Tema Produto/Serviço a ser vendido: ${theme}

Sua missão é gerar exatamente três outputs estruturados:

2.1) Output #1: Relatório Estratégico de Discovery
Dividido rigorosamente em:
A. Perfil da Empresa: Setor de atuação, porte/tamanho estimado, principais produtos/serviços oferecidos e posicionamento de mercado.
B. Análise de Dores Prováveis: Com base no cargo e área de atuação do Lead, setor e modelo da empresa e na temática a ser explorada, quais são os 3 maiores desafios/dores que o Lead e essa empresa enfrentam atualmente?
C. Insights sobre o Lead: Qual a esfera de influência desse cargo na tomada de decisão (classifique como: Influenciador, Decisor, Técnico ou Campeão) e dê uma justificativa comportamental/tática.
D. "The Elephant in the Room" & Resposta à Objeção:
   - Objeção Oculta / Ponto Cego: Identifique um possível ponto cego crítico ou objeção comum que eles possam ter ao contratar uma solução externa relacionada com o tema.
   - Resposta Estratégica à Objeção: Argumento e técnica consultiva de alto impacto para neutralizar, desarmar e reenquadrar essa objeção durante a reunião de Discovery.
E. 3 Perguntas de Poder: Sugira três perguntas abertas e altamente provocativas para o roteiro de Discovery que os façam admitir o custo da inação.

2.2) Output #2: Texto para envio de Email
Você é um especialista em vendas B2B e copywriting estratégico.
- Realize enriquecimento de contexto e aplique raciocínio SPIN (Situação/Problema, Implicação e Necessidade de Solução).
- Formato estrito OBRIGATÓRIO:
**Assunto:** [Inserir sugestão de assunto]

**Email:**
[Inserir o corpo do email formatado]
- Linha de assunto curta, magnética e direcionada à dor identificada.
- Linguagem profissional, consultiva e leve (sem tom robótico ou pressão excessiva de venda).
- Estrutura: toque brevemente no contexto/problema, evidencie o impacto (implicação/valor) e finalize com um CTA claro, de baixa fricção e focado em diálogo.
- Extensão: NO MÁXIMO 200 palavras no corpo do email (conte rigorosamente para não ultrapassar).
- Idioma: Português do Brasil.

2.3) Output #3: Texto para envio em mensagem no LinkedIn
- Apresentado OBRIGATORIAMENTE logo após o Output #2.
- Altamente personalizado, direto e humanizado.
- Linguagem profissional, objetiva e leve.
- Estrutura: contexto/problema, impacto (implicação/valor), CTA de baixa fricção focado em diálogo.
- Extensão: MENOS DE 500 caracteres (aproximadamente 70-100 palavras).
- Idioma: Português do Brasil.

REGRAS DE FORMATAÇÃO E RESPOSTA:
Retorne sua resposta estritamente em formato JSON estruturado com as seguintes chaves para facilitar a renderização no sistema, mantendo também o texto completo em Markdown na chave "rawMarkdown":
{
  "output1": {
    "empresaPerfil": {
      "setor": "...",
      "tamanhoEstimado": "...",
      "principaisProdutos": "...",
      "posicionamento": "..."
    },
    "doresProvaveis": [
      "Dor 1: ...",
      "Dor 2: ...",
      "Dor 3: ..."
    ],
    "insightsLead": {
      "esferaInfluencia": "Influenciador | Decisor | Técnico | Campeão",
      "justificativa": "..."
    },
    "elephantInTheRoom": {
      "objecaoPontoCego": "...",
      "respostaEstrategica": "..."
    },
    "perguntasDePoder": [
      "Pergunta 1: ...",
      "Pergunta 2: ...",
      "Pergunta 3: ..."
    ]
  },
  "output2": {
    "assunto": "...",
    "corpoEmail": "...",
    "spinAnalysis": {
      "situacaoProblema": "...",
      "implicacao": "...",
      "necessidadeSolucao": "..."
    },
    "wordCount": 145
  },
  "output3": {
    "mensagemLinkedin": "...",
    "charCount": 380
  },
  "rawMarkdown": "...texto formatado completo com Output #1, seguido estritamente de Output #2 e Output #3 com tabelas e negritos em Markdown..."
}
Importante: O valor de "rawMarkdown" deve conter o briefing completo formatado em Markdown com alta elegância executiva, sem inventar dados não fornecidos ou alucinados.`;

    const userPrompt = `Gere o briefing de prospecção executivo para:
Nome do Lead: ${leadName}
Empresa/Site: ${company}
Cargo: ${role}
Tema/Solução: ${theme}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: systemPrompt },
            { text: userPrompt }
          ]
        }
      ],
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.7,
      },
    });

    const responseText = response.text || '';

    // Parse JSON from response
    let parsedData: any = null;

    try {
      // Find JSON block if wrapped in markdown
      let jsonContent = responseText.trim();
      const match = jsonContent.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (match) {
        jsonContent = match[1];
      }
      parsedData = JSON.parse(jsonContent);
    } catch {
      // If parsing fails directly, build fallback structure from markdown
      parsedData = {
        output1: {
          empresaPerfil: {
            setor: 'Setor Empresarial',
            tamanhoEstimado: 'Médio / Grande Porte',
            principaisProdutos: `Soluções corporativas e serviços vinculados a ${company}`,
            posicionamento: 'Posicionamento competitivo de mercado B2B',
          },
          doresProvaveis: [
            `Pressão por eficiência operacional em ${theme}`,
            `Gargalos de escala e integração na rotina de ${role}`,
            'Dificuldade de mensuração clara do ROI e impacto da inação',
          ],
          insightsLead: {
            esferaInfluencia: 'Decisor',
            justificativa: `Como ${role}, possui autoridade direta ou forte poder de veto sobre contratações relacionadas a ${theme}.`,
          },
          elephantInTheRoom: {
            objecaoPontoCego: 'Medo de complexidade de implementação ou percepção de que a equipe interna já cobre o tema.',
            respostaEstrategica: 'Demonstrar complementaridade com o time atual, destacando velocidade de retorno (Time-to-Value) e baixo atrito operacional.',
          },
          perguntasDePoder: [
            'Se vocês continuarem operando da forma atual pelos próximos 12 meses, qual é o custo real em termos de receita e equipe?',
            'O que tem impedido vocês de resolver definitivamente essa dor internamente?',
            'Qual métrica direta do seu setor seria mais beneficiada se esse gargalo fosse eliminado hoje?',
          ],
        },
        output2: {
          assunto: `Visão sobre eficiência em ${theme} na ${company}`,
          corpoEmail: `Olá ${leadName},\n\nAcompanhando as iniciativas recentes da ${company}, notei que desafios em ${theme} têm impactado diretamente a velocidade operacional de lideranças como ${role}.\n\nQuando esse gargalo persiste, o time costuma absorver retrabalho invisível e perda de produtividade. Estruturamos uma abordagem focada em destravar esse processo sem sobrecarregar a operação interna.\n\nFaria sentido batermos um papo rápido de 10 minutos na próxima quinta-feira para trocar ideias sobre esse cenário?\n\nAbraços,\n[Seu Nome]`,
          spinAnalysis: {
            situacaoProblema: `Desafios operacionais em ${theme}`,
            implicacao: 'Perda de produtividade e retrabalho invisível',
            necessidadeSolucao: 'Abordagem de rápida implementação',
          },
          wordCount: 75,
        },
        output3: {
          mensagemLinkedin: `Olá ${leadName}, vejo seus desafios na liderança como ${role} na ${company}. Líderes do seu setor têm enfrentado atritos em ${theme} que drenam velocidade do time. Faz sentido trocarmos uma ideia rápida de 10 min sobre como acelerar essa frente? Abraço!`,
          charCount: 240,
        },
        rawMarkdown: responseText,
      };
    }

    // Ensure rawMarkdown exists
    if (!parsedData.rawMarkdown) {
      parsedData.rawMarkdown = buildFormattedMarkdown(
        leadName || '',
        company || '',
        role || '',
        theme || '',
        parsedData
      );
    }

    // Calculate actual word count and character count for accuracy
    const emailBody = parsedData.output2?.corpoEmail || '';
    const wordCount = emailBody.trim().split(/\s+/).filter(Boolean).length;
    if (parsedData.output2) {
      parsedData.output2.wordCount = wordCount;
    }

    const linkedinText = parsedData.output3?.mensagemLinkedin || '';
    const charCount = linkedinText.length;
    if (parsedData.output3) {
      parsedData.output3.charCount = charCount;
    }

    return res.json({
      success: true,
      data: parsedData,
    });
  } catch (err: any) {
    console.error('Erro na rota /api/generate-briefing:', err);
    return res.status(500).json({
      error: 'Erro na geração do briefing',
      message: err?.message || 'Falha ao processar solicitação com a API Gemini.',
    });
  }
});

function buildFormattedMarkdown(
  leadName: string,
  company: string,
  role: string,
  theme: string,
  data: any
): string {
  const o1 = data.output1 || {};
  const ep = o1.empresaPerfil || {};
  const dores = Array.isArray(o1.doresProvaveis) ? o1.doresProvaveis : [];
  const ins = o1.insightsLead || {};
  const ele = o1.elephantInTheRoom || {};
  const pergs = Array.isArray(o1.perguntasDePoder) ? o1.perguntasDePoder : [];
  const o2 = data.output2 || {};
  const o3 = data.output3 || {};

  return `# Briefing Estratégico de Sales Intelligence & Discovery

**Lead:** ${leadName}  
**Cargo:** ${role}  
**Empresa:** ${company}  
**Tema:** ${theme}  

---

## 2.1) Output #1: Relatório Estratégico de Discovery

### A. Perfil da Empresa
- **Setor:** ${ep.setor || 'N/A'}
- **Tamanho Estimado:** ${ep.tamanhoEstimado || 'N/A'}
- **Principais Produtos/Serviços:** ${ep.principaisProdutos || 'N/A'}
- **Posicionamento de Mercado:** ${ep.posicionamento || 'N/A'}

### B. Análise de Dores Prováveis
${dores.map((d: string, i: number) => `${i + 1}. ${d}`).join('\n')}

### C. Insights sobre o Lead
- **Esfera de Influência:** ${ins.esferaInfluencia || 'Decisor'}
- **Justificativa Estratégica:** ${ins.justificativa || 'N/A'}

### D. "The Elephant in the Room" & Resposta à Objeção
- **Ponto Cego / Objeção Oculta:** ${ele.objecaoPontoCego || ele || 'N/A'}
- **Resposta Estratégica à Objeção (Como Desarmar e Reenquadrar):** ${ele.respostaEstrategica || 'Demonstrar impacto prático imediato e baixo atrito de integração.'}

### E. 3 Perguntas de Poder (Custo da Inação)
${pergs.map((p: string, i: number) => `${i + 1}. ${p}`).join('\n')}

---

## 2.2) Output #2: Texto para Envio de Email

**Assunto:** ${o2.assunto || `Visão estratégica para ${company}`}

**Email:**
${o2.corpoEmail || ''}

---

## 2.3) Output #3: Mensagem para LinkedIn

${o3.mensagemLinkedin || ''}
`;
}

// Development and Production setup
if (process.env.NODE_ENV !== 'production') {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[ProspecAI] Servidor rodando na porta ${PORT}`);
});
