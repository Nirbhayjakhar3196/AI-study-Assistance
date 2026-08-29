import ai from "../../../lib/gemini";
import { NextResponse } from "next/server";

import fs from "fs/promises";
import path from "path";

import { createEmbedding } from "../../../lib/embeddings";
import { findRelevantChunks } from "../../../lib/retrieval";
import { buildPrompt } from "../../../lib/promptBuilder";

export async function POST(request) {
  try {
    // STEP 1 — Receive Question
    const body = await request.json();
    const question = body.message;

    // STEP 2 — Create Question Embedding
    const questionEmbedding = await createEmbedding(question);

    // STEP 3 — Load embeddings.json
    const databasePath = path.join(
      process.cwd(),
      "data",
      "embeddings.json"
    );

    const vectors = JSON.parse(
      await fs.readFile(databasePath, "utf-8")
    );

    // STEP 4 — Retrieve Top 3 Chunks
    const relevantChunks = findRelevantChunks(
      questionEmbedding,
      vectors,
      3
    );

    // STEP 5 — Build Final Prompt
    const finalPrompt = buildPrompt(question, relevantChunks);

    console.log("========== RAG DEBUG ==========");
    console.log("Question:", question);

    relevantChunks.forEach((chunk) => {
      console.log(
        `Chunk ${chunk.id} | Similarity: ${chunk.similarity.toFixed(4)}`
      );
    });

    console.log("===============================");

    // STEP 6 — Gemini Streaming
    const response = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: finalPrompt,
    });

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of response) {
          controller.enqueue(
            encoder.encode(chunk.text)
          );
        }

        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("CHAT API ERROR:", error);

    return NextResponse.json(
      {
        error: "Something went wrong with Gemini API.",
      },
      {
        status: 500,
      }
    );
  }
}