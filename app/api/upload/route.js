import { NextResponse } from "next/server";

import { extractPdfText } from "../../../lib/pdfParser";
import { chunkText } from "../../../lib/chunkText";
import { createEmbedding } from "../../../lib/embeddings";

import fs from "fs/promises";
import path from "path";

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

    // STEP 4 — Save embeddings.json
    const dataFolder = path.join(process.cwd(), "data");

    await fs.mkdir(dataFolder, { recursive: true });

    await fs.writeFile(
      path.join(dataFolder, "embeddings.json"),
      JSON.stringify(vectors, null, 2)
    );

    return NextResponse.json({
      success: true,
      message: `${pdf.name} uploaded successfully!`,
      totalChunks: vectors.length,
    });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Upload failed.",
      },
      {
        status: 500,
      }
    );
  }
}