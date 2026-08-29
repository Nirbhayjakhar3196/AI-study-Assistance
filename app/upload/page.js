"use client";

import { useState } from "react";

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  function handleFileChange(event) {
    const file = event.target.files[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file only.");
      return;
    }

    setSelectedFile(file);
  }

  async function handleUpload() {
  if (!selectedFile) {
    alert("Please select a PDF first.");
    return;
  }

  setUploading(true);

  const formData = new FormData();
  formData.append("pdf", selectedFile);

  try {
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || "Upload failed.");
    }

    alert(
      `${data.message}\n\nTotal Chunks Created: ${data.totalChunks}`
    );

    console.log("========== CHUNK INFO ==========");
    console.log("Total Chunks:", data.totalChunks);
    console.log("First Chunk:");
    console.log(data.firstChunk);
    console.log("================================");

  } catch (error) {
    console.error("Frontend Error:", error);
    alert(error.message || "Upload failed.");
  } finally {
    setUploading(false);
  }
}


  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <section className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-xl">

        <h1 className="text-3xl font-bold text-center">
          📄 Upload Study Notes
        </h1>

        <p className="text-center text-gray-500 mt-2">
          Upload your PDF notes to build your personal AI knowledge base.
        </p>

        <label className="mt-8 flex flex-col items-center justify-center border-2 border-dashed border-purple-500 rounded-xl p-10 cursor-pointer hover:bg-purple-50 transition">

          <span className="text-5xl">📚</span>

          <p className="mt-4 font-semibold text-purple-700">
            Click to choose a PDF
          </p>

          <p className="text-sm text-gray-500">
            Only PDF files are supported.
          </p>

          <input
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={handleFileChange}
          />

        </label>

        {selectedFile && (
          <div className="mt-6 bg-purple-100 rounded-lg p-4">
            <p className="font-semibold text-purple-800">
              📄 {selectedFile.name}
            </p>

            <p className="text-sm text-purple-600">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
          className="mt-6 w-full bg-black text-white py-3 rounded-xl disabled:bg-gray-400"
        >
          {uploading ? "Uploading..." : "Upload PDF"}
        </button>

      </section>
    </main>
  );
}