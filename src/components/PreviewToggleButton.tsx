import { Eye, EyeOff } from 'lucide-react';

interface PreviewToggleButtonProps {
  showPreview: boolean;
  onClick: () => void;
}

export default function PreviewToggleButton({ showPreview, onClick }: PreviewToggleButtonProps) {
  return (
    <button
      onClick={onClick}
      className="preview-button flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
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
  );
}
