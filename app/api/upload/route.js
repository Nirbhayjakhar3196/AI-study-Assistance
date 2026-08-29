import { NextResponse } from "next/server";
import { extractPdfText } from "@/lib/pdfParser";
import { createChunks } from "../../../lib/chunkText";
import { createEmbedding } from "../../../lib/embeddings";
import {saveEmbeddings} from "../../../lib/vectorStore"
import { findRelevantChunks } from "../../../lib/retrieval";
import fs from "fs/promises";
import path from "path"


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


const chunks = createChunks(extractedText);

// console.log("========== CHUNK DEBUG ==========");
// console.log("Characters:", extractedText.length);
// console.log("Words:", extractedText.replace(/\s+/g, " ").trim().split(" ").length);
// console.log("Chunks:", chunks.length);
// console.log("First Chunk Preview:");
// console.log(chunks[0]?.slice(0, 150));
// console.log("=================================");

  const vectors = [];

  for(let i =0;i<chunks.length;i++){

    console.log(`Generating embedding for Chunk ${i+1}....`);

    const embedding = await createEmbedding(chunks[i]);

    vectors.push({
      id : i+1,
      text : chunks[i],
      embedding
    })
    
    console.log(`Chunk ${i+1} Done ✅`);
    
  }

  const filePath = await saveEmbeddings(vectors);

  const databasePath = path.join(
    process.cwd(),
    "data",
    "embeddings.json"
  )

  const savedVectors = JSON.parse(
    await fs.readFile(databasePath, "utf-8")
  )

  const question = "Explain inheritance in OOP"

  const questionEmbedding = await  createEmbedding(question)

  const relevantChunks = findRelevantChunks(
    questionEmbedding,
    savedVectors,
    3
  );

  console.log("====== RETRIEVAL TEST ======");

  relevantChunks.forEach((chunk) => {
    console.log(`Chunk ${chunk.id}`);
    console.log("Similarity:", chunk.similarity.toFixed(4));
    console.log(chunk.text.slice(0,100));
  });

  console.log("============================");
  

  // console.log("Saved Vector Database");
  // console.log(filePath);
  
  

  
  console.log("Embedding Length:", vectors[0].embedding.length);
  console.log("First 10 Values:");
  console.log(vectors[0].embedding.slice(0,10));

  return NextResponse.json({
    message: "Retrieval test successful!",
    question,
    retrievedChunks: relevantChunks.map((chunk) => ({
      id: chunk.id,
      similarity: Number(chunk.similarity.toFixed(4)),
      preview: chunk.text.slice(0,120),
    })),
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