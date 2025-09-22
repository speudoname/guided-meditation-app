export default function HomePage() {
  return (
    <div className="mobile-container min-h-screen py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-2">Guided</h1>
        <p className="text-center text-gray-600 dark:text-gray-400">
          Your meditation companion
        </p>
      </header>

      <main className="space-y-4">
        <div className="bg-gray-100 dark:bg-gray-900 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-2">Quick Start</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Begin your meditation journey
          </p>
          <button className="w-full bg-blue-600 text-white rounded-xl py-3 font-medium hover:bg-blue-700 transition">
            Start Timer
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button className="bg-white dark:bg-gray-800 rounded-xl p-4 text-left border border-gray-200 dark:border-gray-700">
            <div className="text-2xl mb-2">🧘</div>
            <h3 className="font-medium">Courses</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Guided programs</p>
          </button>

          <button className="bg-white dark:bg-gray-800 rounded-xl p-4 text-left border border-gray-200 dark:border-gray-700">
            <div className="text-2xl mb-2">🌬️</div>
            <h3 className="font-medium">Breathing</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Exercises</p>
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Your Tokens</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Available balance</p>
            </div>
            <div className="text-2xl font-bold">100</div>
          </div>
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="mobile-container">
          <div className="grid grid-cols-4 py-2">
            <button className="flex flex-col items-center py-2 text-blue-600">
              <span className="text-xl mb-1">🏠</span>
              <span className="text-xs">Home</span>
            </button>
            <button className="flex flex-col items-center py-2">
              <span className="text-xl mb-1">⏱️</span>
              <span className="text-xs">Timer</span>
            </button>
            <button className="flex flex-col items-center py-2">
              <span className="text-xl mb-1">📊</span>
              <span className="text-xs">Progress</span>
            </button>
            <button className="flex flex-col items-center py-2">
              <span className="text-xl mb-1">👤</span>
              <span className="text-xs">Profile</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}