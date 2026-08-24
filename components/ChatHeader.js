export default function ChatHeader() {
  return (
    <header className="bg-gray-900 text-white shadow-md p-4">
      <div className="max-w-3xl mx-auto flex items-center justify-between">

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-xl">
            
          </div>

          <div>
            <h1 className="text-lg font-bold">
              AI Study Assistant
            </h1>

            <p className="text-sm text-gray-300">
              Powered by Gemini 2.5 Flash
            </p>
          </div>

        </div>

        <div className="flex items-center gap-2 text-green-400 text-sm">
          <div className="w-2 h-2 rounded-full bg-green-400"></div>
          Online
        </div>

      </div>
    </header>
  );
}