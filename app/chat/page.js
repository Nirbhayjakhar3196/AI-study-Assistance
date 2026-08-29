"use client";

import { useState, useEffect, useRef } from "react";

export default function ChatPage() {
  // ===========================
  // Upload States
  // ===========================
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [pdfReady, setPdfReady] = useState(false);

  // ===========================
  // Chat States
  // ===========================
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // ===========================
  // Select PDF
  // ===========================
  function handleFileChange(event) {
    const file = event.target.files[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Please upload PDF only.");
      return;
    }

    setSelectedFile(file);
  }

  // ===========================
  // Upload PDF
  // ===========================
  async function handleUpload() {
    if (!selectedFile) return;

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
        throw new Error(data.message);
      }

      setPdfReady(true);

      setMessages((prev) => [
        ...prev,
        {
          role: "system",
          text: `📄 ${selectedFile.name} uploaded successfully! Ask me anything from your notes.`,
        },
      ]);
    } catch (error) {
      console.error(error);
      alert("Upload failed.");
    }

    setUploading(false);
  }

  // ===========================
  // Send Question
  // ===========================
  async function handleSend() {
    if (!message.trim()) return;

    if (!pdfReady) {
      alert("Please upload a PDF first.");
      return;
    }

    const userMessage = {
      role: "user",
      text: message,
    };

    setMessages((prev) => [...prev, userMessage]);

    const currentQuestion = message;

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: currentQuestion,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || errData.message || "Chat request failed.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let aiAnswer = "";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "",
        },
      ]);

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        aiAnswer += decoder.decode(value, { stream: true });

        setMessages((prev) => {
          const updated = [...prev];
          if (updated.length > 0) {
            updated[updated.length - 1] = {
              ...updated[updated.length - 1],
              text: aiAnswer,
            };
          }
          return updated;
        });
      }

      aiAnswer += decoder.decode();
      setMessages((prev) => {
        const updated = [...prev];
        if (updated.length > 0) {
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            text: aiAnswer,
          };
        }
        return updated;
      });
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: `❌ ${error.message || "Something went wrong while generating answer."}`,
        },
      ]);
    }

    setLoading(false);
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      handleSend();
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 flex justify-center p-6">
      <section className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden">

        {/* HEADER */}
        <div className="bg-purple-700 text-white p-6">
          <h1 className="text-3xl font-bold">
            📚 AI Study Assistant
          </h1>

          <p className="text-purple-100 mt-2">
            Upload your study notes once and chat with them using Gemini + RAG.
          </p>
        </div>

        {/* PDF Upload */}
        <div className="p-6 bg-purple-50 border-b">

          <h2 className="text-xl font-bold text-purple-700 mb-4">
            Upload Study Notes
          </h2>

          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="w-full border rounded-lg bg-white p-3"
          />

          {selectedFile && (
            <div className="mt-4 bg-white rounded-lg border p-4">

              <p className="font-semibold text-purple-700">
                📄 {selectedFile.name}
              </p>

              <p className="text-sm text-gray-500">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>

            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="mt-4 bg-purple-700 text-white px-5 py-3 rounded-xl disabled:bg-gray-400"
          >
            {uploading ? "Uploading PDF..." : "Upload PDF"}
          </button>

          {pdfReady && (
            <p className="text-green-600 mt-4 font-semibold">
              ✅ PDF Ready! Ask questions below.
            </p>
          )}

        </div>

        {/* Chat Section */}
        <div className="p-6">

          <h2 className="text-xl font-bold mb-4">
            💬 Chat With Your Notes
          </h2>

          <div className="h-[450px] overflow-y-auto bg-gray-50 rounded-xl border p-4 space-y-4">


            {messages.length === 0 && (
              <div className="text-center text-gray-400 mt-36">
                Upload your notes and ask your first question.
              </div>
            )}

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`max-w-[80%] p-4 rounded-xl whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "ml-auto bg-blue-100"
                    : msg.role === "assistant"
                    ? "bg-green-100"
                    : "bg-purple-100"
                }`}
              >
                <p className="font-semibold text-sm mb-2">
                  {msg.role === "user"
                    ? "🧑 You"
                    : msg.role === "assistant"
                    ? "🤖 AI"
                    : "📄 System"}
                </p>

                <p>{msg.text}</p>
              </div>
            ))}

            {loading && (
              <div className="bg-green-100 rounded-xl p-4 w-fit">
                🤖 AI is thinking...
              </div>
            )}

            <div ref={bottomRef}></div>

          </div>

          {/* Input */}
          <div className="flex gap-3 mt-5">

            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={!pdfReady || loading}
              placeholder={
                pdfReady
                  ? "Ask anything from uploaded notes..."
                  : "Upload PDF first..."
              }
              className="flex-1 border rounded-xl px-4 py-3 disabled:bg-gray-100"
            />

            <button
              onClick={handleSend}
              disabled={!pdfReady || loading}
              className="bg-black text-white px-6 rounded-xl disabled:bg-gray-400"
            >
              Send
            </button>

          </div>

        </div>

      </section>
    </main>
  );
}