
export function cosineSimilarity(vectorA, vectorB) {
  if (!vectorA || !vectorB || !Array.isArray(vectorA) || !Array.isArray(vectorB)) {
    return 0;
  }

  const length = Math.min(vectorA.length, vectorB.length);
  if (length === 0) return 0;

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < length; i++) {
    dotProduct += vectorA[i] * vectorB[i];
    magnitudeA += vectorA[i] * vectorA[i];
    magnitudeB += vectorB[i] * vectorB[i];
  }

  magnitudeA = Math.sqrt(magnitudeA);
  magnitudeB = Math.sqrt(magnitudeB);

  if (magnitudeA === 0 || magnitudeB === 0) return 0;

  return dotProduct / (magnitudeA * magnitudeB);
}

export function findRelevantChunks(questionEmbedding, vectors, topK = 3) {
  if (!vectors || !Array.isArray(vectors) || vectors.length === 0) {
    return [];
  }

  const scoredChunks = vectors.map((chunk) => ({
    ...chunk,
    similarity: cosineSimilarity(questionEmbedding, chunk.embedding),
  }));

  scoredChunks.sort((a, b) => b.similarity - a.similarity);

  return scoredChunks.slice(0, topK);
}