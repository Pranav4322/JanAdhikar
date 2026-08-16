import { Link, useLocation } from 'react-router-dom';
import { Bell, FileText, Building2 } from 'lucide-react';

const navLinks = [
  { label: 'Report Issue', path: '/report' },
  { label: 'Track Complaint', path: '/track' },
  { label: 'Projects', path: '/projects' },
  { label: 'Analytics', path: '/analytics' },
  { label: 'About', path: '/about' },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-jan-orange flex items-center justify-center">
            <Building2 className="text-white" size={20} />
          </div>
          <div>
            <span className="font-bold text-lg text-jan-dark">JanAdhar</span>
            <span className="ml-2 text-xs text-gray-400 tracking-wide">Civic AI Platform</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors ${
                location.pathname === link.path
                  ? 'text-jan-orange'
                  : 'text-gray-600 hover:text-jan-dark'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button className="relative text-gray-500 hover:text-jan-dark">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-jan-orange rounded-full" />
          </button>
          <Link
            to="/report"
            className="flex items-center gap-2 bg-jan-orange hover:bg-jan-orange-light text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
          >
            <FileText size={16} />
            File Complaint
          </Link>
        </div>
      </div>
    </header>
  );
}