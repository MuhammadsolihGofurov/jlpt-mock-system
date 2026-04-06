import { PDFDocument } from 'pdf-lib';

export const generateFlashcardPdf = async (cards, title = "flashcards") => {
  const html2pdf = (await import("html2pdf.js")).default;

  const WORDS_PER_PAGE = 12;
  const COLUMNS = 3;
  const ROWS = 4;
  
  const pages = [];
  for (let i = 0; i < cards.length; i += WORDS_PER_PAGE) {
    const chunk = cards.slice(i, i + WORDS_PER_PAGE);
    const filledChunk = [...chunk];
    while (filledChunk.length < WORDS_PER_PAGE) {
      filledChunk.push({ term: "", furigana: "", definition: "" });
    }
    pages.push(filledChunk);
  }

  const element = document.createElement("div");
  let htmlContent = `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap');
      .pdf-container { font-family: 'Noto Sans JP', sans-serif; }
      .cell { border: 1px solid #000; text-align: center; vertical-align: middle; overflow: hidden; }
    </style>
    <div class="pdf-container">
  `;

  pages.forEach((pageCards, index) => {
    // 1-SAHIFA: Old tomoni
    htmlContent += `
      <div style="width: 297mm; height: 205mm; padding: 10mm; box-sizing: border-box; display: flex; align-items: center; justify-content: center; page-break-after: always;">
        <table style="width: 100%; height: 100%; border-collapse: collapse; table-layout: fixed; border: 2px solid #000;">
          ${Array.from({ length: ROWS }).map((_, r) => `
            <tr style="height: 25%;">
              ${Array.from({ length: COLUMNS }).map((_, c) => `
                <td class="cell" style="font-size: 55pt; font-weight: bold;">
                  ${pageCards[r * COLUMNS + c]?.term || ""}
                </td>
              `).join('')}
            </tr>
          `).join('')}
        </table>
      </div>
    `;

    // 2-SAHIFA: Orqa tomoni
    htmlContent += `
      <div style="width: 297mm; height: 205mm; padding: 10mm; box-sizing: border-box; display: flex; align-items: center; justify-content: center; page-break-after: always;">
        <table style="width: 100%; height: 100%; border-collapse: collapse; table-layout: fixed; border: 2px solid #000;">
          ${Array.from({ length: ROWS }).map((_, r) => `
            <tr style="height: 25%;">
              ${Array.from({ length: COLUMNS }).map((_, c) => {
                const colIndex = (COLUMNS - 1) - c; 
                const card = pageCards[r * COLUMNS + colIndex];
                return `
                  <td class="cell" style="padding: 5px;">
                    <div style="font-size: 18pt; color: #444; margin-bottom: 8px;">${card?.furigana || ""}</div>
                    <div style="font-size: 16pt; font-weight: bold;">${card?.definition || ""}</div>
                  </td>
                `;
              }).join('')}
            </tr>
          `).join('')}
        </table>
      </div>
    `;
  });

  htmlContent += `</div>`;
  element.innerHTML = htmlContent;

  const opt = {
    margin: 0,
    filename: `${title.replace(/[/\\?%*:|"<>]/g, '-')}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, letterRendering: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' },
    pagebreak: { mode: ['css', 'legacy'] }
  };

  try {
    // .save() ishlatmaymiz, o'rniga blob olamiz
    const worker = html2pdf().set(opt).from(element);
    const pdfBlob = await worker.outputPdf('blob');
    
    // Metadata yuklash
    const pdfDoc = await PDFDocument.load(await pdfBlob.arrayBuffer());
    // Metadata ichida massivni saqlaymiz
    pdfDoc.setSubject(JSON.stringify(cards)); 
    
    const pdfBytes = await pdfDoc.save();
    const finalBlob = new Blob([pdfBytes], { type: 'application/pdf' });
    
    // Faylni yuklab olish
    const link = document.createElement('a');
    link.href = URL.createObjectURL(finalBlob);
    link.download = opt.filename;
    link.click();
    
    // Xotirani tozalash
    setTimeout(() => URL.revokeObjectURL(link.href), 100);

  } catch (error) {
    console.error("PDF yaratishda yoki metadata qo'shishda xatolik:", error);
  }
};

export const parsePdfToCards = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    
    // Yashirilgan JSON-ni olamiz
    const cardsJson = pdfDoc.getSubject();
    
    if (cardsJson) {
      return JSON.parse(cardsJson);
    } else {
      throw new Error("Ushbu PDF-da yashirin ma'lumot topilmadi.");
    }
  } catch (error) {
    console.error("PDF o'qishda xato:", error);
    return [];
  }
};