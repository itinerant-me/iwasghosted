import { NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2 text-gray-900">
            <span className="font-semibold font-mono tracking-tight min-w-[120px]">iwasghosted</span>
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <NavLink
              to="/stories"
              className={({ isActive }) =>
                `text-sm font-medium ${isActive ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`
              }
            >
              Stories
            </NavLink>
            <NavLink
              to="/wall-of-shame"
              className={({ isActive }) =>
                `text-sm font-medium ${isActive ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`
              }
            >
              Wall of Shame
            </NavLink>
            <NavLink
              to="/insights"
              className={({ isActive }) =>
                `text-sm font-medium ${isActive ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`
              }
            >
              Insights
            </NavLink>
            <NavLink
              to="/submit"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800"
            >
              Share Your Story
            </NavLink>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            {isMenuOpen ? (
              <X className="block h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="block h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-b border-gray-200">
            <NavLink
              to="/stories"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base font-medium ${
                  isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              Stories
            </NavLink>
            <NavLink
              to="/wall-of-shame"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base font-medium ${
                  isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              Wall of Shame
            </NavLink>
            <NavLink
              to="/insights"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base font-medium ${
                  isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              Insights
            </NavLink>
            <NavLink
              to="/submit"
              className="block w-full px-3 py-2 text-base font-medium text-center text-white bg-black rounded-md hover:bg-gray-800"
              onClick={() => setIsMenuOpen(false)}
            >
              Share Your Story
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
}