import { Building2, User, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface StoryTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StoryTypeModal({ isOpen, onClose }: StoryTypeModalProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleOptionClick = (path: string) => {
    onClose();
    navigate(path);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white shadow-xl transition-all">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-3 top-3 z-10 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Modal content */}
          <div className="px-4 py-5">
            <div className="text-center mb-5">
              <h2 className="text-lg font-semibold text-gray-900">Share Your Story</h2>
              <p className="mt-1 text-sm text-gray-500">Choose your experience type</p>
            </div>

            <div className="space-y-3">
              {/* As a candidate option */}
              <button
                onClick={() => handleOptionClick('/submit')}
                className="group w-full rounded-md border border-gray-200 bg-white p-3 hover:border-blue-200 hover:bg-blue-50/40 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-blue-600 text-white group-hover:bg-blue-700">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-gray-900 group-hover:text-blue-600">As a candidate</div>
                    <p className="text-xs text-gray-500">I was ghosted by a company</p>
                  </div>
                </div>
              </button>

              {/* As a recruiter option */}
              <button
                onClick={() => handleOptionClick('/submit-recruiter')}
                className="group w-full rounded-md border border-gray-200 bg-white p-3 hover:border-purple-200 hover:bg-purple-50/40 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-purple-600 text-white group-hover:bg-purple-700">
                    <User className="h-5 w-5" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-gray-900 group-hover:text-purple-600">As a recruiter</div>
                    <p className="text-xs text-gray-500">I was ghosted by a candidate</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
