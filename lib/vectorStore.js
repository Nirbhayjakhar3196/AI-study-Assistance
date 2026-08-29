
import fs from "fs/promises";
import path from "path";

const DATA_FOLDER = path.join(process.cwd(), "data");

const VECTOR_FILE = path.join(DATA_FOLDER, "embeddings.json");

export async function saveEmbeddings(vectors) {
  await fs.mkdir(DATA_FOLDER, { recursive: true });

  await fs.writeFile(
    VECTOR_FILE,
    JSON.stringify(vectors, null, 2),
    "utf-8"
  );

  return VECTOR_FILE;
}