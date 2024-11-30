import { Send, Eye, EyeOff } from 'lucide-react';

interface ActionButtonsProps {
  showPreview: boolean;
  setShowPreview: (show: boolean) => void;
  handleSubmit: () => void;
}

export default function ActionButtons({ showPreview, setShowPreview, handleSubmit }: ActionButtonsProps) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => setShowPreview(!showPreview)}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
      >
        {showPreview ? (
          <>
            <EyeOff className="w-4 h-4" />
            Hide Preview
          </>
        ) : (
          <>
            <Eye className="w-4 h-4" />
            Show Preview
          </>
        )}
      </button>
      <button
        onClick={handleSubmit}
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
      >
        <Send className="w-4 h-4" />
        Submit Story
      </button>
    </div>
  );
}
