function safeFileName(value: string) {
  const normalized = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return normalized || "negocio";
}

function isSectionTitle(value: string) {
  return (
    value === value.toLocaleUpperCase("pt-BR") &&
    !value.startsWith("PLANO INICIAL")
  );
}

function normalizePdfLine(value: string) {
  return value
    .normalize("NFC")
    .replace(/[\u00ad\u200b-\u200d\u2060\ufeff]/g, "")
    .replace(/[ \t]+/g, " ")
    .trim();
}

export async function downloadCampaignPlanPdf(
  text: string,
  businessName: string,
) {
  const { jsPDF } = await import("jspdf");
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  const footerLimit = pageHeight - 16;
  let cursorY = 18;

  function addPage() {
    pdf.addPage();
    cursorY = 18;
  }

  function ensureSpace(requiredHeight: number) {
    if (cursorY + requiredHeight > footerLimit) {
      addPage();
    }
  }

  function wrapLine(value: string, maxWidth: number) {
    const words = normalizePdfLine(value).split(" ").filter(Boolean);

    if (words.length === 0) {
      return [" "];
    }

    return words.reduce<string[]>((wrappedLines, word) => {
      const lastLine = wrappedLines.at(-1);

      if (!lastLine) {
        wrappedLines.push(word);
      } else if (pdf.getTextWidth(`${lastLine} ${word}`) <= maxWidth) {
        wrappedLines[wrappedLines.length - 1] = `${lastLine} ${word}`;
      } else {
        wrappedLines.push(word);
      }

      return wrappedLines;
    }, []);
  }

  function writeLines(
    lines: string[],
    options: {
      fontSize?: number;
      lineHeight?: number;
      color?: [number, number, number];
      style?: "normal" | "bold";
      indent?: number;
    } = {},
  ) {
    const fontSize = options.fontSize ?? 10;
    const lineHeight = options.lineHeight ?? 5;
    const indent = options.indent ?? 0;

    pdf.setFont("helvetica", options.style ?? "normal");
    pdf.setFontSize(fontSize);
    pdf.setCharSpace(0);
    pdf.setTextColor(...(options.color ?? [68, 64, 60]));

    lines.forEach((line) => {
      const wrappedLines = wrapLine(line, contentWidth - indent);

      wrappedLines.forEach((wrappedLine) => {
        ensureSpace(lineHeight);
        pdf.setCharSpace(0);
        pdf.text(wrappedLine, margin + indent, cursorY, { charSpace: 0 });
        cursorY += lineHeight;
      });

      cursorY += 1.5;
    });
  }

  const blocks = text.split(/\n{2,}/).filter(Boolean);
  const title = blocks.shift() ?? `PLANO INICIAL DE CAMPANHA — ${businessName}`;
  const notice = blocks.shift();

  pdf.setFillColor(4, 120, 87);
  pdf.rect(0, 0, pageWidth, 7, "F");
  writeLines([title], {
    fontSize: 18,
    lineHeight: 8,
    color: [28, 25, 23],
    style: "bold",
  });
  cursorY += 2;

  if (notice) {
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.setCharSpace(0);
    const noticeLines = wrapLine(notice, contentWidth - 10);
    const noticeHeight = noticeLines.length * 4.5 + 8;
    ensureSpace(noticeHeight);
    pdf.setFillColor(255, 251, 235);
    pdf.setDrawColor(217, 119, 6);
    pdf.roundedRect(
      margin,
      cursorY - 4,
      contentWidth,
      noticeHeight,
      2,
      2,
      "FD",
    );
    pdf.setTextColor(120, 53, 15);
    pdf.setCharSpace(0);
    noticeLines.forEach((line, index) => {
      pdf.text(line, margin + 5, cursorY + 1 + index * 4.5, {
        charSpace: 0,
      });
    });
    cursorY += noticeHeight + 3;
  }

  blocks.forEach((block) => {
    const [firstLine, ...remainingLines] = block.split("\n");
    const hasSectionTitle = isSectionTitle(firstLine);
    const contentLines = hasSectionTitle
      ? remainingLines
      : [firstLine, ...remainingLines];

    if (hasSectionTitle) {
      ensureSpace(18);
      cursorY += 2;
      pdf.setFillColor(236, 253, 245);
      pdf.rect(margin, cursorY - 5, contentWidth, 10, "F");
      writeLines([firstLine], {
        fontSize: 11,
        lineHeight: 5,
        color: [6, 95, 70],
        style: "bold",
        indent: 3,
      });
      cursorY += 1;
    }

    writeLines(contentLines, {
      fontSize: 9.5,
      lineHeight: 4.7,
      color: [68, 64, 60],
    });
    cursorY += 2;
  });

  const totalPages = pdf.getNumberOfPages();

  for (let page = 1; page <= totalPages; page += 1) {
    pdf.setPage(page);
    pdf.setDrawColor(214, 211, 209);
    pdf.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.setCharSpace(0);
    pdf.setTextColor(120, 113, 108);
    pdf.text(
      `Campanha Fácil IA • Plano inicial orientativo • Página ${page} de ${totalPages}`,
      margin,
      pageHeight - 7,
      { charSpace: 0 },
    );
  }

  pdf.setProperties({
    title: `Plano inicial de campanha — ${businessName}`,
    subject: "Pacote inicial de execução de campanha",
    creator: "Campanha Fácil IA",
  });
  pdf.save(`plano-campanha-${safeFileName(businessName)}.pdf`);
}
