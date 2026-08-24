export default function ChatMessage({ message }) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-sm rounded-xl p-3 ${
          isUser
            ? "bg-blue-600 text-white"
            : "bg-white shadow border"
        }`}
      >
        {!isUser && (
          <p className="text-xs text-purple-600 mb-1 font-semibold">
            🤖 Gemini
          </p>
        )}

        <p>{message.text}</p>
      </div>
    </div>
  );
}