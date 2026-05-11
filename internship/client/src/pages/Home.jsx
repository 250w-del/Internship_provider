import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { publicAPI } from '../services/api';
import { TRADES } from '../constants/trades';
import InternshipCard from '../components/InternshipCard';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  FiArrowRight, FiBriefcase, FiUsers, FiAward,
  FiCheckCircle, FiSearch, FiTrendingUp, FiStar
} from 'react-icons/fi';

const StatCard = ({ icon: Icon, value, label, color }) => (
  <div className="text-center">
    <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg`}>
      <Icon className="text-white text-2xl" />
    </div>
    <div className="text-3xl font-bold text-white mb-1">{value}</div>
    <div className="text-blue-200 text-sm">{label}</div>
  </div>
);

const Home = () => {
  const navigate = useNavigate();
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTrade, setSearchTrade] = useState('');

  useEffect(() => {
    publicAPI.getInternships({ limit: 6 })
      .then(res => setInternships(res.data.internships || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/internships${searchTrade ? `?trade=${searchTrade}` : ''}`);
  };

  return (
    <div className="min-h-screen">
      {/* ── Hero ── */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600 rounded-full opacity-20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-500 rounded-full opacity-20 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-700 rounded-full opacity-10 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-blue-700/50 border border-blue-500/50 rounded-full px-4 py-1.5 text-sm font-medium text-blue-200 mb-6 backdrop-blur-sm">
              <FiStar size={14} className="text-yellow-400" />
              Rwanda TVET Board Official Platform
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              Launch Your Career with
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300 mt-1">
                Internship Provider
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-blue-100 mb-10 leading-relaxed max-w-2xl mx-auto">
              Rwanda's premier TVET internship platform. Find internships matched to your trade and level — from L3 to L5 across all sectors.
            </p>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-10">
              <select
                value={searchTrade}
                onChange={e => setSearchTrade(e.target.value)}
                className="flex-1 px-4 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/40 backdrop-blur-sm text-sm"
              >
                <option value="" className="text-gray-900">All Trades</option>
                {TRADES.map(t => (
                  <option key={t.code} value={t.code} className="text-gray-900">{t.icon} {t.code} – {t.name}</option>
                ))}
              </select>
              <button type="submit" className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-blue-700 font-semibold rounded-xl hover:bg-blue-50 transition-colors shadow-lg">
                <FiSearch size={16} /> Search
              </button>
            </form>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/register?type=student" className="flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-blue-700 font-semibold rounded-xl hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl">
                <FiUsers size={16} /> Register as Student
              </Link>
              <Link to="/register?type=company" className="flex items-center justify-center gap-2 px-7 py-3.5 bg-blue-600/50 border border-white/30 text-white font-semibold rounded-xl hover:bg-blue-600/70 transition-all backdrop-blur-sm">
                <FiBriefcase size={16} /> Register as Company
              </Link>
            </div>
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L60 50C120 40 240 20 360 15C480 10 600 20 720 25C840 30 960 30 1080 25C1200 20 1320 10 1380 5L1440 0V60H0Z" fill="#f8fafc" />
          </svg>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-900 py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <StatCard icon={FiBriefcase} value="200+" label="Active Internships" color="bg-blue-500" />
            <StatCard icon={FiUsers} value="1,500+" label="Students Placed" color="bg-cyan-500" />
            <StatCard icon={FiAward} value="12" label="TVET Trades" color="bg-indigo-500" />
            <StatCard icon={FiTrendingUp} value="95%" label="Placement Rate" color="bg-blue-400" />
          </div>
        </div>
      </section>

      {/* ── Trades ── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Browse by Trade</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Find internships tailored to your TVET trade and qualification level</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {TRADES.map((trade) => (
              <Link
                key={trade.code}
                to={`/internships?trade=${trade.code}`}
                className="group bg-white rounded-2xl p-5 border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-200 text-center"
              >
                <div className="text-3xl mb-3">{trade.icon}</div>
                <div className="font-bold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">{trade.code}</div>
                <div className="text-xs text-gray-400 mt-1 leading-snug line-clamp-2">{trade.name}</div>
                <div className="mt-3 flex justify-center gap-1">
                  {['L3', 'L4', 'L5'].map(l => (
                    <span key={l} className="text-xs px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded font-medium">{l}</span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Internships ── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Latest Internships</h2>
              <p className="text-gray-500">Fresh opportunities across all TVET trades</p>
            </div>
            <Link to="/internships" className="hidden sm:flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors group">
              View All <FiArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner text="Loading internships..." />
          ) : internships.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <FiBriefcase size={48} className="mx-auto mb-3 opacity-30" />
              <p>No internships available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {internships.map(i => (
                <InternshipCard key={i.internship_id} internship={i} />
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link to="/internships" className="btn-primary inline-flex items-center gap-2">
              Browse All Internships <FiArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">How It Works</h2>
            <p className="text-gray-500">Get placed in 3 simple steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Create Your Profile', desc: 'Register as a student, select your TVET trade and level (L3–L5), and complete your profile.', icon: FiUsers },
              { step: '02', title: 'Browse & Apply', desc: 'Explore internships matched to your trade and level. Apply with one click and upload your CV.', icon: FiSearch },
              { step: '03', title: 'Get Placed', desc: 'Companies review your application and accept you. Start your internship and build your career.', icon: FiCheckCircle },
            ].map(({ step, title, desc, icon: Icon }) => (
              <div key={step} className="relative text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Icon className="text-white text-2xl" />
                </div>
                <div className="absolute top-0 right-1/4 text-6xl font-black text-blue-50 -z-0 select-none">{step}</div>
                <h3 className="font-bold text-gray-900 text-lg mb-2 relative z-10">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-16 bg-gradient-to-r from-blue-700 to-blue-900 text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-blue-200 mb-8 text-lg">Join thousands of TVET students who found their internship through Internship Provider.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register?type=student" className="px-8 py-3.5 bg-white text-blue-700 font-semibold rounded-xl hover:bg-blue-50 transition-colors shadow-lg">
              Get Started as Student
            </Link>
            <Link to="/register?type=company" className="px-8 py-3.5 border-2 border-white/40 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors">
              Post an Internship
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
