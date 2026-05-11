import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import {
  FiUsers, FiBriefcase, FiCheckCircle, FiClock,
  FiTrendingUp, FiAlertCircle, FiCheck, FiX, FiTrash2
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const StatCard = ({ icon: Icon, label, value, color, sub }) => (
  <div className="card flex items-center gap-4">
    <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center flex-shrink-0`}>
      <Icon className="text-white text-xl" />
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-900">{value ?? '—'}</p>
      <p className="text-sm text-gray-500">{label}</p>
      {sub && <p className="text-xs text-gray-400">{sub}</p>}
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [pending, setPending] = useState([]);
  const [students, setStudents] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    Promise.all([
      adminAPI.getDashboard(),
      adminAPI.getPendingInternships({ limit: 20 }),
      adminAPI.getStudents({ limit: 20 }),
      adminAPI.getCompanies({ limit: 20 }),
    ]).then(([dashRes, pendRes, stuRes, comRes]) => {
      setStats(dashRes.data.stats);
      setPending(pendRes.data.internships || []);
      setStudents(stuRes.data.students || []);
      setCompanies(comRes.data.companies || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleApprove = async (id) => {
    setUpdating(id);
    try {
      await adminAPI.approveInternship(id);
      setPending(prev => prev.filter(i => i.internship_id !== id));
      toast.success('Internship approved!');
    } catch { toast.error('Failed to approve'); }
    finally { setUpdating(null); }
  };

  const handleReject = async (id) => {
    setUpdating(id);
    try {
      await adminAPI.rejectInternship(id);
      setPending(prev => prev.filter(i => i.internship_id !== id));
      toast.success('Internship rejected');
    } catch { toast.error('Failed to reject'); }
    finally { setUpdating(null); }
  };

  const handleDeleteStudent = async (id) => {
    if (!window.confirm('Delete this student?')) return;
    try {
      await adminAPI.deleteStudent(id);
      setStudents(prev => prev.filter(s => s.student_id !== id));
      toast.success('Student deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const handleDeleteCompany = async (id) => {
    if (!window.confirm('Delete this company?')) return;
    try {
      await adminAPI.deleteCompany(id);
      setCompanies(prev => prev.filter(c => c.company_id !== id));
      toast.success('Company deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'pending', label: `Pending (${pending.length})` },
    { id: 'students', label: 'Students' },
    { id: 'companies', label: 'Companies' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-700 to-red-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-2xl font-bold backdrop-blur-sm">
              A
            </div>
            <div>
              <h1 className="text-xl font-bold">Admin Dashboard</h1>
              <p className="text-red-200 text-sm">Rwanda TVET Board — Internship Provider</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <LoadingSpinner size="lg" text="Loading dashboard..." />
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard icon={FiUsers} label="Total Students" value={stats?.students} color="bg-blue-600" />
              <StatCard icon={FiBriefcase} label="Total Companies" value={stats?.companies} color="bg-purple-600" />
              <StatCard icon={FiCheckCircle} label="Approved Internships" value={stats?.internships?.approved} color="bg-green-600" />
              <StatCard icon={FiClock} label="Pending Review" value={stats?.internships?.pending} color="bg-yellow-500" />
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 overflow-x-auto">
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 min-w-max py-2 px-4 text-sm font-semibold rounded-lg transition-all duration-200 whitespace-nowrap ${
                    activeTab === tab.id ? 'bg-white text-red-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Overview */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card">
                  <h3 className="font-semibold text-gray-900 mb-4">Internship Stats</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Total', value: stats?.internships?.total, color: 'bg-gray-200' },
                      { label: 'Approved', value: stats?.internships?.approved, color: 'bg-green-500' },
                      { label: 'Pending', value: stats?.internships?.pending, color: 'bg-yellow-500' },
                      { label: 'Rejected', value: stats?.internships?.rejected, color: 'bg-red-500' },
                    ].map(({ label, value, color }) => (
                      <div key={label} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
                          <span className="text-sm text-gray-600">{label}</span>
                        </div>
                        <span className="font-semibold text-gray-900">{value ?? 0}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="card">
                  <h3 className="font-semibold text-gray-900 mb-4">Application Stats</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Total', value: stats?.applications?.total, color: 'bg-gray-200' },
                      { label: 'Accepted', value: stats?.applications?.accepted, color: 'bg-green-500' },
                      { label: 'Pending', value: stats?.applications?.pending, color: 'bg-yellow-500' },
                      { label: 'Rejected', value: stats?.applications?.rejected, color: 'bg-red-500' },
                    ].map(({ label, value, color }) => (
                      <div key={label} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
                          <span className="text-sm text-gray-600">{label}</span>
                        </div>
                        <span className="font-semibold text-gray-900">{value ?? 0}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Pending Internships */}
            {activeTab === 'pending' && (
              <div>
                {pending.length === 0 ? (
                  <div className="card text-center py-16">
                    <FiCheckCircle size={48} className="mx-auto text-green-200 mb-3" />
                    <p className="text-gray-500">No pending internships. All caught up!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pending.map(i => (
                      <div key={i.internship_id} className="card">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <h3 className="font-semibold text-gray-900">{i.title}</h3>
                            <p className="text-sm text-gray-500">{i.company_name}</p>
                            <div className="flex flex-wrap gap-2 mt-1.5">
                              <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">{i.trade}</span>
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{i.level_required}</span>
                              {i.deadline && <span className="text-xs text-gray-400">Deadline: {new Date(i.deadline).toLocaleDateString()}</span>}
                            </div>
                            {i.description && <p className="text-xs text-gray-400 mt-1.5 line-clamp-2">{i.description}</p>}
                          </div>
                          <div className="flex gap-2 flex-shrink-0">
                            <button onClick={() => handleApprove(i.internship_id)}
                              disabled={updating === i.internship_id}
                              className="flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-xl font-medium transition-colors">
                              <FiCheck size={14} /> Approve
                            </button>
                            <button onClick={() => handleReject(i.internship_id)}
                              disabled={updating === i.internship_id}
                              className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-xl font-medium transition-colors">
                              <FiX size={14} /> Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Students */}
            {activeTab === 'students' && (
              <div className="card overflow-hidden p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Trade</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Level</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">School</th>
                        <th className="px-5 py-3"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {students.map(s => (
                        <tr key={s.student_id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-5 py-3.5 font-medium text-gray-900">{s.full_name}</td>
                          <td className="px-5 py-3.5 text-gray-500 text-xs">{s.email}</td>
                          <td className="px-5 py-3.5"><span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">{s.trade}</span></td>
                          <td className="px-5 py-3.5"><span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full font-medium">{s.level}</span></td>
                          <td className="px-5 py-3.5 text-gray-400 text-xs">{s.school || '—'}</td>
                          <td className="px-5 py-3.5">
                            <button onClick={() => handleDeleteStudent(s.student_id)}
                              className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                              <FiTrash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Companies */}
            {activeTab === 'companies' && (
              <div className="card overflow-hidden p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Company</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                        <th className="px-5 py-3"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {companies.map(c => (
                        <tr key={c.company_id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900">{c.company_name}</span>
                              {c.is_admin && <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-medium">Admin</span>}
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-gray-500 text-xs">{c.email}</td>
                          <td className="px-5 py-3.5 text-gray-400 text-xs">{c.location || '—'}</td>
                          <td className="px-5 py-3.5 text-gray-400 text-xs">{new Date(c.created_at).toLocaleDateString()}</td>
                          <td className="px-5 py-3.5">
                            {!c.is_admin && (
                              <button onClick={() => handleDeleteCompany(c.company_id)}
                                className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                <FiTrash2 size={14} />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
