import { NavLink } from 'react-router-dom';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2 text-gray-900">
            <span className="font-semibold font-mono tracking-tight min-w-[120px]">iwasghosted</span>
          </NavLink>

          {/* Navigation */}
          <nav className="flex items-center gap-4">
            <NavLink
              to="/wall-of-shame"
              className={({ isActive }) =>
                `px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`
              }
            >
              Wall of Shame
            </NavLink>
            <NavLink
              to="/insights"
              className={({ isActive }) =>
                `px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`
              }
            >
              Insights
            </NavLink>
            <NavLink
              to="/submit"
              className={({ isActive }) =>
                `px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`
              }
            >
              Share Your Story
            </NavLink>
            <NavLink
              to="/stories"
              className={({ isActive }) =>
                `px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`
              }
            >
              Browse Stories
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
}