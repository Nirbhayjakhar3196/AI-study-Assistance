import PDFParser from "pdf2json";

export function extractPdfText(file) {
  return new Promise(async (resolve, reject) => {

    // Convert uploaded file into bytes
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const parser = new PDFParser();

    // If parser fails
    parser.on("pdfParser_dataError", (error) => {
      reject(error);
    });

    // When parser finishes reading PDF
    parser.on("pdfParser_dataReady", (pdf) => {
      let text = "";

      pdf.Pages.forEach((page) => {
        page.Texts.forEach((item) => {
          item.R.forEach((run) => {
            text += run.T + " ";
          });
        });

        text += "\n";
      });

      resolve(text);
    });

    parser.parseBuffer(buffer);
  });
}