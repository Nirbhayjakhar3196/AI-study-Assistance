import { NextResponse } from "next/server";
import { extractPdfText } from "@/lib/pdfParser";
import { createChunks } from "../../../lib/chunkText";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const pdfFile = formData.get("pdf");

    if (!pdfFile) {
      return NextResponse.json(
        { message: "Please upload a PDF." },
        { status: 400 }
      );
    }

   const extractedText = await extractPdfText(pdfFile);

console.log("========== PARSER DEBUG ==========");
console.log("Characters:", extractedText.length);
console.log(extractedText.slice(0, 300));
console.log("=================================");

const chunks = createChunks(extractedText);

console.log("========== CHUNK DEBUG ==========");
console.log("Characters:", extractedText.length);
console.log("Words:", extractedText.replace(/\s+/g, " ").trim().split(" ").length);
console.log("Chunks:", chunks.length);
console.log("First Chunk Preview:");
console.log(chunks[0]?.slice(0, 150));
console.log("=================================");

return NextResponse.json({
  message: "PDF parsed successfully!",
  characters: extractedText.length,
  totalChunks: chunks.length,
  firstChunk: chunks[0],
});

  } catch (error) {
    console.error("UPLOAD ERROR:", error);

    return NextResponse.json(
      {
        message: "Failed to parse PDF.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}