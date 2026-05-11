import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiBriefcase, FiMenu, FiX, FiUser, FiLogOut,
  FiHome, FiGrid, FiFileText, FiSettings
} from 'react-icons/fi';

const Navbar = () => {
  const { user, role, logout, isAdmin, isCompany, isStudent } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropdownOpen(false);
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
      isActive(path)
        ? 'bg-blue-100 text-blue-700'
        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
    }`;

  const getDashboardLink = () => {
    if (isAdmin) return '/admin/dashboard';
    if (isCompany) return '/company/dashboard';
    if (isStudent) return '/student/dashboard';
    return '/';
  };

  const getUserName = () => {
    if (!user) return '';
    return user.full_name || user.company_name || user.username || 'User';
  };

  const getRoleBadge = () => {
    if (isAdmin) return { label: 'Admin', cls: 'bg-red-100 text-red-700' };
    if (isCompany) return { label: 'Company', cls: 'bg-purple-100 text-purple-700' };
    if (isStudent) return { label: 'Student', cls: 'bg-green-100 text-green-700' };
    return null;
  };

  const badge = getRoleBadge();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <FiBriefcase className="text-white text-lg" />
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-bold text-gray-900">Internship</span>
              <span className="text-lg font-bold text-blue-600"> Provider</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/" className={navLinkClass('/')}>
              <span className="flex items-center gap-1.5"><FiHome size={14} /> Home</span>
            </Link>
            <Link to="/internships" className={navLinkClass('/internships')}>
              <span className="flex items-center gap-1.5"><FiBriefcase size={14} /> Internships</span>
            </Link>

            {user && (
              <Link to={getDashboardLink()} className={navLinkClass(getDashboardLink())}>
                <span className="flex items-center gap-1.5"><FiGrid size={14} /> Dashboard</span>
              </Link>
            )}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {!user ? (
              <>
                <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">
                  Register
                </Link>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors border border-gray-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {getUserName().charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-800 leading-none">{getUserName()}</p>
                    {badge && (
                      <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${badge.cls}`}>
                        {badge.label}
                      </span>
                    )}
                  </div>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 animate-fade-in">
                    <Link
                      to={getDashboardLink()}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      <FiGrid size={15} /> Dashboard
                    </Link>
                    <Link
                      to={`${getDashboardLink()}/profile`}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      <FiSettings size={15} /> Profile Settings
                    </Link>
                    <hr className="my-1 border-gray-100" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <FiLogOut size={15} /> Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-1 animate-fade-in">
          <Link to="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium">
            <FiHome size={16} /> Home
          </Link>
          <Link to="/internships" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium">
            <FiBriefcase size={16} /> Internships
          </Link>
          {user ? (
            <>
              <Link to={getDashboardLink()} onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium">
                <FiGrid size={16} /> Dashboard
              </Link>
              <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 font-medium">
                <FiLogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <div className="flex gap-2 pt-2">
              <Link to="/login" onClick={() => setMenuOpen(false)} className="flex-1 text-center py-2.5 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                Login
              </Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="flex-1 text-center py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
