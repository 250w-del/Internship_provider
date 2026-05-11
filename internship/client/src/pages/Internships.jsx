import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { publicAPI } from '../services/api';
import { TRADES, LEVELS } from '../constants/trades';
import InternshipCard from '../components/InternshipCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { FiSearch, FiBriefcase, FiFilter, FiX } from 'react-icons/fi';

const Internships = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [internships, setInternships] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    trade: searchParams.get('trade') || '',
    level: searchParams.get('level') || '',
    search: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const limit = 12;

  const fetchInternships = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit };
      if (filters.trade) params.trade = filters.trade;
      if (filters.level) params.level = filters.level;
      const res = await publicAPI.getInternships(params);
      setInternships(res.data.internships || []);
      setTotal(res.data.total || 0);
    } catch {
      setInternships([]);
    } finally {
      setLoading(false);
    }
  }, [filters.trade, filters.level, page]);

  useEffect(() => { fetchInternships(); }, [fetchInternships]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
    const newParams = {};
    if (key === 'trade' ? value : filters.trade) newParams.trade = key === 'trade' ? value : filters.trade;
    if (key === 'level' ? value : filters.level) newParams.level = key === 'level' ? value : filters.level;
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setFilters({ trade: '', level: '', search: '' });
    setPage(1);
    setSearchParams({});
  };

  const totalPages = Math.ceil(total / limit);
  const hasFilters = filters.trade || filters.level;

  const filtered = filters.search
    ? internships.filter(i =>
        i.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        i.company_name?.toLowerCase().includes(filters.search.toLowerCase())
      )
    : internships;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-2">Browse Internships</h1>
          <p className="text-blue-200">
            {total > 0 ? `${total} internship${total !== 1 ? 's' : ''} available` : 'Find your perfect internship'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search by title or company..."
                value={filters.search}
                onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="input-field pl-10 py-2.5"
              />
            </div>

            {/* Trade filter */}
            <select
              value={filters.trade}
              onChange={e => handleFilterChange('trade', e.target.value)}
              className="input-field py-2.5 sm:w-48"
            >
              <option value="">All Trades</option>
              {TRADES.map(t => (
                <option key={t.code} value={t.code}>{t.icon} {t.code}</option>
              ))}
            </select>

            {/* Level filter */}
            <select
              value={filters.level}
              onChange={e => handleFilterChange('level', e.target.value)}
              className="input-field py-2.5 sm:w-36"
            >
              <option value="">All Levels</option>
              {LEVELS.map(l => (
                <option key={l.code} value={l.code}>{l.code}</option>
              ))}
            </select>

            {hasFilters && (
              <button onClick={clearFilters}
                className="flex items-center gap-1.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl border border-red-200 transition-colors whitespace-nowrap">
                <FiX size={14} /> Clear
              </button>
            )}
          </div>

          {/* Active filter badges */}
          {hasFilters && (
            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
              {filters.trade && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  Trade: {filters.trade}
                  <button onClick={() => handleFilterChange('trade', '')}><FiX size={12} /></button>
                </span>
              )}
              {filters.level && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  Level: {filters.level}
                  <button onClick={() => handleFilterChange('level', '')}><FiX size={12} /></button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <LoadingSpinner size="lg" text="Loading internships..." />
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <FiBriefcase size={56} className="mx-auto text-gray-200 mb-4" />
            <h3 className="text-lg font-semibold text-gray-500 mb-2">No internships found</h3>
            <p className="text-gray-400 text-sm mb-4">Try adjusting your filters or check back later.</p>
            {hasFilters && (
              <button onClick={clearFilters} className="btn-primary text-sm py-2 px-5">
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map(i => (
                <InternshipCard key={i.internship_id} internship={i} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const p = i + 1;
                  return (
                    <button key={p} onClick={() => setPage(p)}
                      className={`w-9 h-9 text-sm font-medium rounded-lg transition-colors ${
                        page === p ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                      }`}>
                      {p}
                    </button>
                  );
                })}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Internships;
