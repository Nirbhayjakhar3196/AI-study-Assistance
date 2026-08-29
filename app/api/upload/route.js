import { NextResponse } from "next/server";

import { extractPdfText } from "../../../lib/pdfParser";
import { chunkText } from "../../../lib/chunkText";
import { createEmbedding } from "../../../lib/embeddings";
import { saveEmbeddings } from "../../../lib/vectorStore";

export async function POST(request) {
  try {
    const formData = await request.formData();

    const pdf = formData.get("pdf");

    if (!pdf) {
      return NextResponse.json(
        {
          success: false,
          message: "No PDF uploaded.",
        },
        { status: 400 }
      );
    }

    // STEP 1 — Parse PDF
    const parsedText = await extractPdfText(pdf);

    console.log("========== PARSER DEBUG ==========");
    console.log("Characters:", parsedText.length);
    console.log(parsedText.slice(0, 300));
    console.log("=================================");

    if (!parsedText || !parsedText.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Could not extract text from the PDF. It might be empty or scanned images.",
        },
        { status: 400 }
      );
    }

    // STEP 2 — Chunk Text
    const chunks = chunkText(parsedText);

    console.log("Total Chunks:", chunks.length);

    // STEP 3 — Create Embeddings
    const vectors = [];

    for (let i = 0; i < chunks.length; i++) {
      console.log(`Creating embedding ${i + 1}/${chunks.length}`);

      const embedding = await createEmbedding(chunks[i]);

      vectors.push({
        id: i + 1,
        text: chunks[i],
        embedding,
      });
    }

    // STEP 4 — Save embeddings
    await saveEmbeddings(vectors);

    return NextResponse.json({
      success: true,
      message: `${pdf.name} uploaded successfully!`,
      totalChunks: vectors.length,
      firstChunk: chunks.length > 0 ? chunks[0] : "",
    });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Upload failed.",
      },
      {
        status: 500,
      }
    );
  }
}