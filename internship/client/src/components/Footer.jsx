import React from 'react';
import { Link } from 'react-router-dom';
import {
  FiBriefcase, FiMail, FiPhone, FiMapPin,
  FiFacebook, FiTwitter, FiLinkedin, FiInstagram
} from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const trades = ['NIT', 'SOD', 'FBO', 'CSA', 'ETE', 'BDC', 'Electricity', 'Tourism'];

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Top wave */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 h-1.5 w-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <FiBriefcase className="text-white text-xl" />
              </div>
              <div>
                <span className="text-white font-bold text-lg">Internship</span>
                <span className="text-blue-400 font-bold text-lg"> Provider</span>
              </div>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-5">
              Rwanda's premier TVET internship placement platform. Connecting skilled students with leading companies across all sectors.
            </p>
            {/* Social links */}
            <div className="flex gap-3">
              {[
                { icon: FiFacebook, href: '#', label: 'Facebook' },
                { icon: FiTwitter, href: '#', label: 'Twitter' },
                { icon: FiLinkedin, href: '#', label: 'LinkedIn' },
                { icon: FiInstagram, href: '#', label: 'Instagram' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              {[
                { label: 'Home', to: '/' },
                { label: 'Browse Internships', to: '/internships' },
                { label: 'Student Register', to: '/register?type=student' },
                { label: 'Company Register', to: '/register?type=company' },
                { label: 'Login', to: '/login' },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-sm text-gray-400 hover:text-blue-400 transition-colors duration-200 flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* TVET Trades */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">TVET Trades</h3>
            <ul className="space-y-2.5">
              {trades.map((trade) => (
                <li key={trade}>
                  <Link
                    to={`/internships?trade=${trade}`}
                    className="text-sm text-gray-400 hover:text-blue-400 transition-colors duration-200 flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    {trade}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <FiMapPin className="text-blue-400 mt-0.5 flex-shrink-0" size={16} />
                <span className="text-sm text-gray-400">KG 7 Ave, Kigali, Rwanda<br />Rwanda TVET Board</span>
              </li>
              <li className="flex items-center gap-3">
                <FiPhone className="text-blue-400 flex-shrink-0" size={16} />
                <a href="tel:+250788000000" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">
                  +250 788 000 000
                </a>
              </li>
              <li className="flex items-center gap-3">
                <FiMail className="text-blue-400 flex-shrink-0" size={16} />
                <a href="mailto:info@internshipprovider.rw" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">
                  info@internshipprovider.rw
                </a>
              </li>
            </ul>

            {/* Levels badge */}
            <div className="mt-5 p-3 bg-gray-800 rounded-xl">
              <p className="text-xs text-gray-500 mb-2 font-medium">Available Levels</p>
              <div className="flex gap-2">
                {['L3', 'L4', 'L5'].map((lvl) => (
                  <span key={lvl} className="px-2.5 py-1 bg-blue-900 text-blue-300 text-xs font-semibold rounded-lg">
                    {lvl}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            © {currentYear} Internship Provider. All rights reserved. Powered by Rwanda TVET Board.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Privacy Policy</a>
            <a href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
