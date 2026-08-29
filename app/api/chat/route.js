import ai from "../../../lib/gemini";
import { NextResponse } from "next/server";

import { createEmbedding } from "../../../lib/embeddings";
import { loadEmbeddings } from "../../../lib/vectorStore";
import { findRelevantChunks } from "../../../lib/retrieval";
import { buildPrompt } from "../../../lib/promptBuilder";

export async function POST(request) {
  try {
    // STEP 1 — Receive Question
    const body = await request.json();
    const question = body?.message;

    if (!question || typeof question !== "string") {
      return NextResponse.json(
        { error: "Question message is required." },
        { status: 400 }
      );
    }

    // STEP 2 — Load embeddings safely
    const vectors = await loadEmbeddings();

    let finalPrompt = question;
    let relevantChunks = [];

    if (vectors && vectors.length > 0) {
      // STEP 3 — Create Question Embedding
      const questionEmbedding = await createEmbedding(question);

      // STEP 4 — Retrieve Top 3 Chunks
      relevantChunks = findRelevantChunks(
        questionEmbedding,
        vectors,
        3
      );

      // STEP 5 — Build Final Prompt
      finalPrompt = buildPrompt(question, relevantChunks);

      console.log("========== RAG DEBUG ==========");
      console.log("Question:", question);

      relevantChunks.forEach((chunk) => {
        console.log(
          `Chunk ${chunk.id} | Similarity: ${chunk.similarity?.toFixed(4) || "0"}`
        );
      });

      console.log("===============================");
    } else {
      console.warn("No uploaded notes/embeddings found. Responding directly.");
    }

    // STEP 6 — Gemini Streaming
    let response;
    try {
      response = await ai.models.generateContentStream({
        model: "gemini-2.5-flash",
        contents: finalPrompt,
      });
    } catch (modelError) {
      console.warn("gemini-2.5-flash failed, trying gemini-2.0-flash fallback:", modelError.message);
      response = await ai.models.generateContentStream({
        model: "gemini-2.0-flash",
        contents: finalPrompt,
      });
    }

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of response) {
            const chunkText = chunk.text || "";
            if (chunkText) {
              controller.enqueue(encoder.encode(chunkText));
            }
          }
        } catch (streamError) {
          console.error("Stream Error:", streamError);
        } finally {
          controller.close();
        }
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
        error: error.message || "Something went wrong with Gemini API.",
      },
      {
        status: 500,
      }
    );
  }
}