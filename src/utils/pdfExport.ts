import { jsPDF } from 'jspdf';
import { BriefingReport } from '../types/briefing';

export function exportBriefingToPdf(report: BriefingReport) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin - 10) {
      doc.addPage();
      y = margin + 5;
      drawPageHeader();
    }
  };

  const drawPageHeader = () => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('ProspecAI · Dossiê Estratégico de Sales Intelligence & Discovery', margin, 10);
    doc.text(
      new Date(report.createdAt).toLocaleDateString('pt-BR'),
      pageWidth - margin,
      10,
      { align: 'right' }
    );
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, 12, pageWidth - margin, 12);
  };

  // Top Cover / Header Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(margin, y, contentWidth, 34, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text('DOSSIÊ EXECUTIVO DE DISCOVERY B2B', margin + 6, y + 9);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text(report.inputs.leadName, margin + 6, y + 17);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(203, 213, 225); // slate-300
  const leadSub = `${report.inputs.role} · ${report.inputs.company}`;
  doc.text(leadSub, margin + 6, y + 23);

  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184); // slate-400
  const themeLines = doc.splitTextToSize(`Tema: ${report.inputs.theme}`, contentWidth - 12);
  doc.text(themeLines[0] || '', margin + 6, y + 29);

  y += 40;

  // Helper for Section Headers
  const drawSectionHeader = (code: string, title: string, color = [30, 41, 59]) => {
    checkPageBreak(12);
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(margin, y, contentWidth, 7, 1.5, 1.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(color[0], color[1], color[2]);
    doc.text(`${code} · ${title}`, margin + 3, y + 4.8);
    y += 10;
  };

  // 1. Output #1: Relatório de Discovery
  drawSectionHeader('OUTPUT #1', 'RELATÓRIO ESTRATÉGICO DE DISCOVERY', [79, 70, 229]);

  // A. Perfil da Empresa
  checkPageBreak(25);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text('A. Perfil da Empresa', margin, y);
  y += 5;

  const profile = report.output1.empresaPerfil;
  const profileItems = [
    { label: 'Setor:', val: profile.setor },
    { label: 'Porte / Tamanho:', val: profile.tamanhoEstimado },
    { label: 'Principais Produtos/Serviços:', val: profile.principaisProdutos },
    { label: 'Posicionamento de Mercado:', val: profile.posicionamento },
  ];

  profileItems.forEach((item) => {
    checkPageBreak(8);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    doc.text(`• ${item.label}`, margin + 2, y);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    const splitVal = doc.splitTextToSize(item.val || 'N/A', contentWidth - 55);
    doc.text(splitVal, margin + 48, y);
    y += Math.max(splitVal.length * 4.2, 5.5);
  });

  y += 3;

  // B. Dores Prováveis
  checkPageBreak(25);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text('B. Análise de Dores Prováveis (3 Maiores Desafios)', margin, y);
  y += 5;

  report.output1.doresProvaveis.forEach((dor, idx) => {
    checkPageBreak(12);
    doc.setFillColor(254, 243, 199); // amber-100
    doc.rect(margin + 2, y - 3, 5, 5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(146, 64, 14); // amber-800
    doc.text(`0${idx + 1}`, margin + 3.2, y + 0.6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    const splitDor = doc.splitTextToSize(dor, contentWidth - 14);
    doc.text(splitDor, margin + 10, y);
    y += splitDor.length * 4.2 + 2.5;
  });

  y += 2;

  // C. Insights sobre o Lead
  checkPageBreak(20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text('C. Insights sobre o Lead & Esfera de Influência', margin, y);
  y += 5;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(67, 56, 202); // indigo-700
  doc.text(`Esfera Decisória: ${report.output1.insightsLead.esferaInfluencia}`, margin + 2, y);
  y += 4.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  const splitJust = doc.splitTextToSize(report.output1.insightsLead.justificativa, contentWidth - 4);
  doc.text(splitJust, margin + 2, y);
  y += splitJust.length * 4.2 + 4;

  // D. "The Elephant in the Room" & Resposta à Objeção
  checkPageBreak(35);
  doc.setFillColor(255, 241, 242); // rose-50
  doc.setDrawColor(254, 205, 211); // rose-200
  doc.roundedRect(margin, y, contentWidth, 6, 1, 1, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(159, 18, 57); // rose-800
  doc.text('D. "The Elephant in the Room" & Resposta à Objeção', margin + 3, y + 4.2);
  y += 8;

  // Ponto Cego
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(159, 18, 57);
  doc.text('Ponto Cego / Objeção Oculta Identificada:', margin + 2, y);
  y += 4;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  const splitObj = doc.splitTextToSize(report.output1.elephantInTheRoom.objecaoPontoCego, contentWidth - 4);
  doc.text(splitObj, margin + 2, y);
  y += splitObj.length * 4.2 + 3;

  // Resposta à Objeção
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(5, 150, 105); // emerald-600
  doc.text('Como Desarmar & Reenquadrar na Reunião (Resposta Estratégica):', margin + 2, y);
  y += 4;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  const splitResp = doc.splitTextToSize(report.output1.elephantInTheRoom.respostaEstrategica, contentWidth - 4);
  doc.text(splitResp, margin + 2, y);
  y += splitResp.length * 4.2 + 5;

  // E. 3 Perguntas de Poder
  checkPageBreak(25);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text('E. 3 Perguntas de Poder (Custo da Inação)', margin, y);
  y += 5;

  report.output1.perguntasDePoder.forEach((perg, idx) => {
    checkPageBreak(12);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`P${idx + 1}:`, margin + 2, y);

    doc.setFont('helvetica', 'italic');
    doc.setTextColor(51, 65, 85);
    const splitPerg = doc.splitTextToSize(`"${perg}"`, contentWidth - 12);
    doc.text(splitPerg, margin + 10, y);
    y += splitPerg.length * 4.2 + 2.5;
  });

  y += 5;

  // 2. Output #2: Email SPIN
  drawSectionHeader('OUTPUT #2', 'TEXTO PARA ENVIO DE EMAIL (FRAMEWORK SPIN)', [37, 99, 235]);

  checkPageBreak(12);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text('Assunto:', margin, y);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(report.output2.assunto, margin + 18, y);
  y += 6;

  checkPageBreak(30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text('Email:', margin, y);
  y += 4.5;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  const emailLines = doc.splitTextToSize(report.output2.corpoEmail, contentWidth - 6);
  const emailBoxHeight = emailLines.length * 4.2 + 6;

  checkPageBreak(emailBoxHeight);
  doc.roundedRect(margin, y, contentWidth, emailBoxHeight, 1.5, 1.5, 'FD');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text(emailLines, margin + 3, y + 5);
  y += emailBoxHeight + 6;

  // 3. Output #3: LinkedIn
  drawSectionHeader('OUTPUT #3', 'TEXTO PARA MENSAGEM NO LINKEDIN', [2, 132, 199]);

  checkPageBreak(25);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Abordagem Direta (${report.output3.charCount} caracteres):`, margin, y);
  y += 4.5;

  doc.setFillColor(243, 246, 248);
  doc.setDrawColor(203, 213, 225);
  const linkedinLines = doc.splitTextToSize(report.output3.mensagemLinkedin, contentWidth - 6);
  const linkedinBoxHeight = linkedinLines.length * 4.2 + 6;

  checkPageBreak(linkedinBoxHeight);
  doc.roundedRect(margin, y, contentWidth, linkedinBoxHeight, 1.5, 1.5, 'FD');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text(linkedinLines, margin + 3, y + 5);
  y += linkedinBoxHeight + 8;

  // Page numbering in footer on all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Página ${i} de ${totalPages} · ProspecAI Sales Intelligence`,
      pageWidth / 2,
      pageHeight - 8,
      { align: 'center' }
    );
  }

  // Save the PDF directly
  const safeLead = report.inputs.leadName.toLowerCase().replace(/\s+/g, '_');
  const safeCompany = report.inputs.company.toLowerCase().replace(/[^a-z0-9]/g, '_');
  doc.save(`briefing_${safeLead}_${safeCompany}.pdf`);
}
