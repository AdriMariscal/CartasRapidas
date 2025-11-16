// src/lib/pdf-client.js
import { jsPDF } from 'jspdf';

// Namespace global sencillo para Cartas Rápidas
window.CartasRapidas = window.CartasRapidas || {};

/**
 * Genera y descarga el PDF de una carta.
 * @param {{ beforeText: string; afterText: string; signatureDataUrl?: string; title: string }} options
 */
window.CartasRapidas.generateLetterPdf = function ({
  beforeText,
  afterText,
  signatureDataUrl,
  title,
}) {
  if (!beforeText && !afterText) return;

  const doc = new jsPDF({
    unit: 'pt',
    format: 'a4',
  });

  const marginLeft = 60;
  const marginTop = 60;
  const maxWidth = 475;
  const lineHeight = 14;

  doc.setFont('Times', 'Normal');
  doc.setFontSize(11);

  let y = marginTop;
  let pageHeight = doc.internal.pageSize.getHeight();

  const addTextBlock = (text) => {
    if (!text) return;
    const lines = doc.splitTextToSize(text, maxWidth);
  lines.forEach((line) => {
      if (y > pageHeight - marginTop) {
        doc.addPage();
        y = marginTop;
        pageHeight = doc.internal.pageSize.getHeight();
      }
    doc.text(line, marginLeft, y);
    y += lineHeight;
  });
  };

  // 1) Texto antes de {firma}
  addTextBlock(beforeText);

  // 2) Firma en el hueco de {firma}, si existe
  if (signatureDataUrl) {
    const sigWidth = 180;
    const sigHeight = 60;

    // Pequeño espacio antes de la firma
    y += lineHeight;

    if (y + sigHeight > pageHeight - marginTop) {
      doc.addPage();
      y = marginTop;
      pageHeight = doc.internal.pageSize.getHeight();
    }

    doc.addImage(signatureDataUrl, 'PNG', marginLeft, y, sigWidth, sigHeight);

    // Espacio después de la firma antes del siguiente texto
    y += sigHeight + lineHeight;
  }

  // 3) Texto después de {firma} (por ejemplo el nombre)
  addTextBlock(afterText);

  const safeTitle = (title || 'carta').toLowerCase().replace(/[^a-z0-9]+/gi, '-');
  doc.save(`${safeTitle || 'carta'}.pdf`);
};
