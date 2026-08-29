export function buildPrompt(question, retrievedChunks) {
  const context = retrievedChunks.map((chunk, index) => {
    return `Chunk ${index + 1}:\n ${chunk.text}`;
  })
  .join("\n\n----------------------\n\n");

  return `
You are an AI Study Assistant.

Use ONLY the study notes provided below to answer the student's question.

Study Notes:
${context}

Student Question:
${question}

Instructions:
- Answer only from the study notes.
- Keep the explanation simple and student-friendly.
- If the answer is not present in the notes, say:
  "This information is not available in the uploaded notes."
`;
}
