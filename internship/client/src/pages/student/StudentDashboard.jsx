import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { studentAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import InternshipCard from '../../components/InternshipCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { TRADES, LEVELS, TRADE_COLORS } from '../../constants/trades';
import {
  FiBriefcase, FiFileText, FiCheckCircle, FiClock,
  FiUpload, FiUser, FiArrowRight, FiAlertCircle
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const StatCard = ({ icon: Icon, label, value, color, sub }) => (
  <div className="card flex items-center gap-4">
    <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center flex-shrink-0`}>
      <Icon className="text-white text-xl" />
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  </div>
);

const StudentDashboard = () => {
  const { user } = useAuth();
  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyModal, setApplyModal] = useState(null);
  const [applyNote, setApplyNote] = useState('');
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    Promise.all([
      studentAPI.getInternships({ limit: 6 }),
      studentAPI.getApplications({ limit: 100 }),
    ]).then(([intRes, appRes]) => {
      setInternships(intRes.data.internships || []);
      setApplications(appRes.data.applications || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const appliedIds = new Set(applications.map(a => a.internship_id));

  const handleApply = async () => {
    if (!applyModal) return;
    setApplying(true);
    try {
      await studentAPI.apply({ internship_id: applyModal.internship_id, notes: applyNote });
      toast.success('Application submitted!');
      setApplications(prev => [...prev, { internship_id: applyModal.internship_id, status: 'pending' }]);
      setApplyModal(null);
      setApplyNote('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    accepted: applications.filter(a => a.status === 'accepted').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };

  const tradeInfo = TRADES.find(t => t.code === user?.trade);
  const levelInfo = LEVELS.find(l => l.code === user?.level);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-2xl font-bold backdrop-blur-sm">
                {user?.full_name?.charAt(0) || 'S'}
              </div>
              <div>
                <h1 className="text-xl font-bold">Welcome, {user?.full_name}!</h1>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  {tradeInfo && (
                    <span className="text-xs bg-white/20 px-2.5 py-1 rounded-full font-medium">
                      {tradeInfo.icon} {tradeInfo.code}
                    </span>
                  )}
                  {user?.level && (
                    <span className="text-xs bg-white/20 px-2.5 py-1 rounded-full font-medium">
                      {user.level}
                    </span>
                  )}
                  {user?.school && (
                    <span className="text-xs text-blue-200">{user.school}</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Link to="/student/dashboard/profile" className="flex items-center gap-1.5 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-medium transition-colors backdrop-blur-sm">
                <FiUser size={14} /> Profile
              </Link>
              <Link to="/student/dashboard/applications" className="flex items-center gap-1.5 px-4 py-2 bg-white text-blue-700 hover:bg-blue-50 rounded-xl text-sm font-medium transition-colors">
                <FiFileText size={14} /> My Applications
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* CV upload reminder */}
        {!user?.cv_file && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <FiAlertCircle className="text-amber-500 flex-shrink-0" size={20} />
              <div>
                <p className="text-sm font-semibold text-amber-800">Upload your CV</p>
                <p className="text-xs text-amber-600">Companies need your CV to review your application.</p>
              </div>
            </div>
            <Link to="/student/dashboard/profile" className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-medium transition-colors whitespace-nowrap">
              <FiUpload size={14} /> Upload CV
            </Link>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={FiBriefcase} label="Total Applied" value={stats.total} color="bg-blue-600" />
          <StatCard icon={FiClock} label="Pending" value={stats.pending} color="bg-yellow-500" />
          <StatCard icon={FiCheckCircle} label="Accepted" value={stats.accepted} color="bg-green-600" />
          <StatCard icon={FiFileText} label="Rejected" value={stats.rejected} color="bg-red-500" />
        </div>

        {/* Available Internships */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Internships for You</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Matched to your trade ({user?.trade}) and level ({user?.level})
              </p>
            </div>
            <Link to="/student/dashboard/internships" className="flex items-center gap-1.5 text-sm text-blue-600 font-semibold hover:text-blue-700 group">
              View All <FiArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner text="Loading internships..." />
          ) : internships.length === 0 ? (
            <div className="card text-center py-12">
              <FiBriefcase size={40} className="mx-auto text-gray-200 mb-3" />
              <p className="text-gray-500 font-medium">No internships available for your trade/level yet.</p>
              <p className="text-gray-400 text-sm mt-1">Check back soon or update your profile.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {internships.map(i => (
                <InternshipCard
                  key={i.internship_id}
                  internship={i}
                  showApply
                  applied={appliedIds.has(i.internship_id)}
                  onApply={setApplyModal}
                />
              ))}
            </div>
          )}
        </div>

        {/* Recent Applications */}
        {applications.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-gray-900">Recent Applications</h2>
              <Link to="/student/dashboard/applications" className="text-sm text-blue-600 font-semibold hover:text-blue-700">
                View All
              </Link>
            </div>
            <div className="card overflow-hidden p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Position</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Company</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {applications.slice(0, 5).map(app => (
                      <tr key={app.application_id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3.5 font-medium text-gray-900">{app.title}</td>
                        <td className="px-5 py-3.5 text-gray-500">{app.company_name}</td>
                        <td className="px-5 py-3.5 text-gray-400 text-xs">
                          {new Date(app.application_date).toLocaleDateString()}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`badge-${app.status}`}>{app.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Apply Modal */}
      {applyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md animate-slide-up">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-1">Apply for Internship</h3>
              <p className="text-sm text-gray-500 mb-4">{applyModal.title} at {applyModal.company_name}</p>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Cover Note <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                value={applyNote}
                onChange={e => setApplyNote(e.target.value)}
                placeholder="Briefly explain why you're a good fit..."
                rows={4}
                className="input-field resize-none"
              />
              <div className="flex gap-3 mt-5">
                <button onClick={() => { setApplyModal(null); setApplyNote(''); }}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button onClick={handleApply} disabled={applying}
                  className="flex-1 btn-primary py-2.5 flex items-center justify-center gap-2">
                  {applying ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Applying...</> : 'Submit Application'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
