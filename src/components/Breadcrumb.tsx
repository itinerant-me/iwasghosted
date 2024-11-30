import { ChevronRight } from 'lucide-react';

export default function Breadcrumb() {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-500">
      <a href="/" className="hover:text-gray-700 transition-colors">iwg</a>
      <ChevronRight className="w-4 h-4" />
      <span className="text-gray-900">my ghosted story</span>
    </nav>
  );
}