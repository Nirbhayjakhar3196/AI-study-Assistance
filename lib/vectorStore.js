
import fs from "fs/promises";
import path from "path";
import os from "os";

function getVectorFilePaths() {
  const tmpFile = path.join(os.tmpdir(), "embeddings.json");
  const localDir = path.join(process.cwd(), "data");
  const localFile = path.join(localDir, "embeddings.json");
  return { tmpFile, localDir, localFile };
}

export async function saveEmbeddings(vectors) {
  const { tmpFile, localDir, localFile } = getVectorFilePaths();
  const content = JSON.stringify(vectors, null, 2);

  // Write to tmp directory (always writable on Vercel & Node)
  try {
    await fs.writeFile(/*turbopackIgnore: true*/ tmpFile, content, "utf-8");
  } catch (err) {
    console.error("Failed to write to tmpfile:", err);
  }

  // Also try writing to local data directory if writable
  try {
    await fs.mkdir(localDir, { recursive: true });
    await fs.writeFile(/*turbopackIgnore: true*/ localFile, content, "utf-8");
  } catch (err) {
    // Read-only filesystem on Vercel lambda - ignore
  }

  return tmpFile;
}

export async function loadEmbeddings() {
  const { tmpFile, localFile } = getVectorFilePaths();

  // Try reading from tmp directory first
  try {
    const data = await fs.readFile(/*turbopackIgnore: true*/ tmpFile, "utf-8");
    return JSON.parse(data);
  } catch (tmpErr) {
    // Fallback to local project directory file
    try {
      const data = await fs.readFile(/*turbopackIgnore: true*/ localFile, "utf-8");
      return JSON.parse(data);
    } catch (localErr) {
      return [];
    }
  }
}
