export default function ChatInput({
  message,
  setMessage,
  sendMessage,
  loading,
}) {
  return (
    <footer className="bg-white border-t p-4">
      <div className="max-w-3xl mx-auto flex gap-2">

        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !loading) {
              sendMessage();
            }
          }}
          placeholder="Ask anything..."
          className="flex-1 border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-purple-500"
        />

        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-black text-white px-5 rounded-lg disabled:bg-gray-400"
        >
          {loading ? "Thinking..." : "Send"}
        </button>

      </div>
    </footer>
  );
}