import ai from "./gemini";

export async function createEmbedding(text) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      // Try official SDK method with text-embedding-004
      try {
        const response = await ai.models.embedContent({
          model: "text-embedding-004",
          contents: text,
        });

        if (response && response.embedding && response.embedding.values) {
          return response.embedding.values;
        }
      } catch (sdkError) {
        console.warn("SDK embedContent failed, trying REST fallback:", sdkError.message);
      }

      // REST API fallback with text-embedding-004
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-2:embedContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "models/text-embedding-004",
            content: {
              parts: [{ text }],
            },
          }),
        }
      );

      const data = await response.json();

      if (data && data.embedding && data.embedding.values) {
        return data.embedding.values;
      }

      if (data && data.error) {
        throw new Error(data.error.message || "Gemini Embedding API Error");
      }
    }

    throw new Error("GEMINI_API_KEY is not set or invalid response received.");
  } catch (error) {
    console.error("Embedding Error:", error);
    throw error;
  }
}
