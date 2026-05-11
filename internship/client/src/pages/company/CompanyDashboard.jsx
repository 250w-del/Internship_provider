import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { companyAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { TRADES, LEVELS } from '../../constants/trades';
import LoadingSpinner from '../../components/LoadingSpinner';
import {
  FiBriefcase, FiUsers, FiClock, FiCheckCircle,
  FiPlus, FiTrash2, FiEye, FiArrowRight, FiMapPin, FiCalendar
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="card flex items-center gap-4">
    <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center flex-shrink-0`}>
      <Icon className="text-white text-xl" />
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  </div>
);

const CompanyDashboard = () => {
  const { user } = useAuth();
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [posting, setPosting] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', requirements: '',
    trade: '', level_required: 'Any', location: '', duration: '', deadline: ''
  });

  useEffect(() => {
    companyAPI.getInternships({ limit: 20 })
      .then(res => setInternships(res.data.internships || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handlePost = async (e) => {
    e.preventDefault();
    setPosting(true);
    try {
      const res = await companyAPI.postInternship(form);
      setInternships(prev => [res.data.internship, ...prev]);
      toast.success('Internship posted! Awaiting admin approval.');
      setShowModal(false);
      setForm({ title: '', description: '', requirements: '', trade: '', level_required: 'Any', location: '', duration: '', deadline: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post internship');
    } finally {
      setPosting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this internship?')) return;
    try {
      await companyAPI.deleteInternship(id);
      setInternships(prev => prev.filter(i => i.internship_id !== id));
      toast.success('Internship deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const stats = {
    total: internships.length,
    pending: internships.filter(i => i.status === 'pending').length,
    approved: internships.filter(i => i.status === 'approved').length,
    applications: internships.reduce((sum, i) => sum + (i.applications_count || 0), 0),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-2xl font-bold backdrop-blur-sm">
                {user?.company_name?.charAt(0) || 'C'}
              </div>
              <div>
                <h1 className="text-xl font-bold">{user?.company_name}</h1>
                <p className="text-purple-200 text-sm">{user?.location}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link to="/company/dashboard/profile" className="flex items-center gap-1.5 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-medium transition-colors">
                Profile
              </Link>
              <button onClick={() => setShowModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-white text-purple-700 hover:bg-purple-50 rounded-xl text-sm font-semibold transition-colors">
                <FiPlus size={14} /> Post Internship
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={FiBriefcase} label="Total Posted" value={stats.total} color="bg-purple-600" />
          <StatCard icon={FiClock} label="Pending Approval" value={stats.pending} color="bg-yellow-500" />
          <StatCard icon={FiCheckCircle} label="Approved" value={stats.approved} color="bg-green-600" />
          <StatCard icon={FiUsers} label="Total Applications" value={stats.applications} color="bg-blue-600" />
        </div>

        {/* Internships list */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gray-900">My Internships</h2>
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-semibold transition-colors">
            <FiPlus size={14} /> Post New
          </button>
        </div>

        {loading ? (
          <LoadingSpinner text="Loading internships..." />
        ) : internships.length === 0 ? (
          <div className="card text-center py-16">
            <FiBriefcase size={48} className="mx-auto text-gray-200 mb-3" />
            <p className="text-gray-500 font-medium">No internships posted yet</p>
            <button onClick={() => setShowModal(true)} className="mt-4 btn-primary text-sm py-2 px-5">
              Post Your First Internship
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {internships.map(i => (
              <div key={i.internship_id} className="card hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{i.title}</h3>
                      <span className={`badge-${i.status}`}>{i.status}</span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><FiBriefcase size={11} /> {i.trade} — {i.level_required}</span>
                      {i.location && <span className="flex items-center gap-1"><FiMapPin size={11} /> {i.location}</span>}
                      {i.deadline && <span className="flex items-center gap-1"><FiCalendar size={11} /> {new Date(i.deadline).toLocaleDateString()}</span>}
                      <span className="flex items-center gap-1"><FiUsers size={11} /> {i.applications_count || 0} applications</span>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Link to={`/company/dashboard/internships/${i.internship_id}/applications`}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg font-medium transition-colors">
                      <FiEye size={12} /> Applications
                    </Link>
                    <button onClick={() => handleDelete(i.internship_id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-medium transition-colors">
                      <FiTrash2 size={12} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Post Internship Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg my-4 animate-slide-up">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-5">Post New Internship</h3>
              <form onSubmit={handlePost} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Title *</label>
                  <input name="title" value={form.title} onChange={handleChange} required
                    placeholder="e.g. Software Developer Intern" className="input-field" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Trade *</label>
                    <select name="trade" value={form.trade} onChange={handleChange} required className="input-field">
                      <option value="">Select Trade</option>
                      {TRADES.map(t => <option key={t.code} value={t.code}>{t.icon} {t.code}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Level Required</label>
                    <select name="level_required" value={form.level_required} onChange={handleChange} className="input-field">
                      <option value="Any">Any Level</option>
                      {LEVELS.map(l => <option key={l.code} value={l.code}>{l.code}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
                    <input name="location" value={form.location} onChange={handleChange}
                      placeholder="Kigali, Rwanda" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Duration</label>
                    <input name="duration" value={form.duration} onChange={handleChange}
                      placeholder="e.g. 3 months" className="input-field" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Deadline *</label>
                  <input type="date" name="deadline" value={form.deadline} onChange={handleChange}
                    required min={new Date().toISOString().split('T')[0]} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                  <textarea name="description" value={form.description} onChange={handleChange}
                    placeholder="Describe the internship role..." rows={3} className="input-field resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Requirements</label>
                  <textarea name="requirements" value={form.requirements} onChange={handleChange}
                    placeholder="Skills and qualifications needed..." rows={2} className="input-field resize-none" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)}
                    className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={posting}
                    className="flex-1 btn-primary py-2.5 flex items-center justify-center gap-2">
                    {posting ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Posting...</> : 'Post Internship'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyDashboard;
