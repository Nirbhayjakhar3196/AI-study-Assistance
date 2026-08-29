import pdfParse from "pdf-parse/lib/pdf-parse.js";

const pdf = typeof pdfParse === "function" ? pdfParse : pdfParse.default;

export async function extractPdfText(file) {
  try {
    // Browser File -> Node Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse PDF
    const result = await pdf(buffer);

    return result.text;
  } catch (error) {
    console.error("PDF Parse Error:", error);
    throw error;
  }
}