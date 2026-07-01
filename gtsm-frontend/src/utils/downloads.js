function createObjectDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function sanitizeFilename(value, fallback = "document") {
  const cleaned = String(value || fallback)
    .trim()
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-zA-Z0-9_-]+/g, "_")
    .replace(/^_+|_+$/g, "");

  return cleaned || fallback;
}

export function downloadTextFile(filename, content) {
  const blob = new Blob([String(content || "")], {
    type: "text/plain;charset=utf-8"
  });

  createObjectDownload(blob, filename);
}

function normalizePdfText(text) {
  return String(text || "")
    .normalize("NFKD")
    .replace(/[^\x20-\x7E\n]/g, " ")
    .replace(/\t/g, "    ");
}

function escapePdfText(text) {
  return normalizePdfText(text)
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

function wrapText(text, maxChars = 88) {
  const normalized = normalizePdfText(text).trim();

  if (!normalized) {
    return [""];
  }

  const words = normalized.split(/\s+/);
  const lines = [];
  let currentLine = "";

  words.forEach((word) => {
    const nextLine = currentLine ? `${currentLine} ${word}` : word;

    if (nextLine.length > maxChars) {
      if (currentLine) {
        lines.push(currentLine);
      }
      currentLine = word;
    } else {
      currentLine = nextLine;
    }
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines.length ? lines : [""];
}

function buildLines(title, sections = []) {
  const lines = [
    {
      type: "title",
      text: title
    },
    {
      type: "spacer",
      text: ""
    }
  ];

  sections.forEach((section) => {
    if (section.heading) {
      lines.push({
        type: "heading",
        text: section.heading
      });
    }

    const bodyParts = Array.isArray(section.body)
      ? section.body
      : String(section.body || "")
        .split(/\n+/)
        .map((item) => item.trim())
        .filter(Boolean);

    bodyParts.forEach((part) => {
      wrapText(part).forEach((wrappedLine) => {
        lines.push({
          type: "body",
          text: wrappedLine
        });
      });
    });

    const bullets = Array.isArray(section.bullets) ? section.bullets : [];

    bullets.forEach((bullet) => {
      wrapText(`- ${bullet}`).forEach((wrappedLine) => {
        lines.push({
          type: "body",
          text: wrappedLine
        });
      });
    });

    lines.push({
      type: "spacer",
      text: ""
    });
  });

  return lines;
}

function paginateLines(lines) {
  const capacity = 44;
  const weights = {
    title: 2.4,
    heading: 1.4,
    body: 1,
    spacer: 0.7
  };

  const pages = [];
  let currentPage = [];
  let currentWeight = 0;

  lines.forEach((line) => {
    const weight = weights[line.type] || 1;

    if (currentPage.length && currentWeight + weight > capacity) {
      pages.push(currentPage);
      currentPage = [];
      currentWeight = 0;
    }

    currentPage.push(line);
    currentWeight += weight;
  });

  if (currentPage.length) {
    pages.push(currentPage);
  }

  return pages;
}

function buildPageContent(lines, pageNumber) {
  let content = "BT\n50 790 Td\n";
  let currentFont = "";
  let currentSize = 0;
  let currentLeading = 0;

  const setFont = (font, size, leading) => {
    if (currentFont === font && currentSize === size && currentLeading === leading) {
      return;
    }

    currentFont = font;
    currentSize = size;
    currentLeading = leading;
    content += `/${font} ${size} Tf\n${leading} TL\n`;
  };

  lines.forEach((line, index) => {
    if (line.type === "title") {
      setFont("F2", pageNumber === 0 ? 18 : 14, pageNumber === 0 ? 24 : 18);
    } else if (line.type === "heading") {
      setFont("F2", 13, 18);
    } else {
      setFont("F1", 11, 14);
    }

    if (index > 0) {
      content += "T*\n";
    }

    if (line.type !== "spacer") {
      content += `(${escapePdfText(line.text)}) Tj\n`;
    }
  });

  content += "ET";
  return content;
}

export function downloadPdfDocument({ filename, title, sections }) {
  const pages = paginateLines(buildLines(title, sections));
  const objects = [];

  objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>");

  const contentAndPageIds = [];

  pages.forEach((pageLines, pageIndex) => {
    const content = buildPageContent(pageLines, pageIndex);
    const contentId = objects.length + 1;
    objects.push(`<< /Length ${content.length} >>\nstream\n${content}\nendstream`);
    const pageId = objects.length + 1;
    contentAndPageIds.push({
      contentId,
      pageId
    });
    objects.push("");
  });

  const pagesId = objects.length + 1;
  const catalogId = pagesId + 1;

  contentAndPageIds.forEach(({ contentId, pageId }, index) => {
    objects[pageId - 1] = `<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 595.28 841.89] /Resources << /Font << /F1 1 0 R /F2 2 0 R >> >> /Contents ${contentId} 0 R >>`;
    contentAndPageIds[index].pageRef = `${pageId} 0 R`;
  });

  objects.push(`<< /Type /Pages /Kids [${contentAndPageIds.map((page) => page.pageRef).join(" ")}] /Count ${contentAndPageIds.length} >>`);
  objects.push(`<< /Type /Catalog /Pages ${pagesId} 0 R >>`);

  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefStart = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";

  for (let index = 1; index <= objects.length; index += 1) {
    pdf += `${String(offsets[index]).padStart(10, "0")} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  const blob = new Blob([pdf], {
    type: "application/pdf"
  });

  createObjectDownload(blob, filename);
}

export async function downloadRemoteFile(url, filename) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Unable to download file from ${url}`);
  }

  const blob = await response.blob();
  createObjectDownload(blob, filename);
}
