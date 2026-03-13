export default function ExitTestDialog({ isOpen, onCancel, onExit }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-6 mx-4 max-w-sm w-full">
        <h2 className="text-lg font-bold text-center">Exit Test?</h2>
        <p className="text-sm text-gray-500 text-center mt-2">
          Your progress will not be saved. Are you sure you want to exit?
        </p>
        <div className="mt-6 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 border border-gray-200 rounded-xl py-3 font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onExit}
            className="flex-1 bg-red-500 text-white rounded-xl py-3 font-semibold hover:bg-red-600"
          >
            Exit
          </button>
        </div>
      </div>
    </div>
  );
}
