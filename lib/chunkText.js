export function createChunks(text, chunkSize = 300, overlap = 50) {
  // Safety check
  if (!text || typeof text !== "string") {
    return [];
  }

  // Clean text
  const cleanedText = text.replace(/\s+/g, " ").trim();

  // Convert into words
  const words = cleanedText.split(" ");

  console.log("Total Words:", words.length);

  const chunks = [];

  // Sliding window
  for (let i = 0; i < words.length; i += chunkSize - overlap) {
    const chunkWords = words.slice(i, i + chunkSize);

    if (chunkWords.length === 0) break;

    chunks.push(chunkWords.join(" "));
  }

  return chunks;
}