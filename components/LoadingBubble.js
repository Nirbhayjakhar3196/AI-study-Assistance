export default function LoadingBubble() {
  return (
    <div className="flex justify-start">
      <div className="bg-gray-200 rounded-xl p-3 max-w-sm">
        <p className="text-xs text-purple-600 mb-1 font-semibold">
          🤖 Gemini
        </p>

        <p className="animate-pulse text-gray-600">
          Gemini is thinking...
        </p>
      </div>
    </div>
  );
}