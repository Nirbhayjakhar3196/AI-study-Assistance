

export function cosineSimilarity(vectorA , vectorB){

    let dotProduct = 0;
    let MagnitudeA = 0;
    let MagnitudeB = 0;

    for(let i=0;i<vectorA.length;i++){

        dotProduct += vectorA[i] * vectorB[i];

        MagnitudeA += vectorA[i] * vectorA[i];

        MagnitudeB += vectorB[i] * vectorB[i];
    }

    MagnitudeA = Math.sqrt(MagnitudeA);
    MagnitudeB = Math.sqrt(MagnitudeB);

    return dotProduct/(MagnitudeA*MagnitudeB)
}

export function findRelevantChunks(questionEmbedding , vectors , topK = 3){

    const scoredChunks = vectors.map((chunk) => ({
        ...chunk,
        similarity : cosineSimilarity(questionEmbedding , chunk.embedding)
    }))

    scoredChunks.sort((a,b) => b.similarity - a.similarity)

    return scoredChunks.slice(0,topK);

}