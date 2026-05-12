import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { companyAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import {
  FiArrowLeft, FiUser, FiMail, FiPhone, FiDownload,
  FiCheck, FiX, FiBriefcase, FiBookOpen, FiClock,
  FiCheckCircle, FiXCircle, FiAlertCircle
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const StatusBadge = ({ status }) => {
  const styles = {
    pending:  'bg-yellow-50 text-yellow-700 border border-yellow-200',
    accepted: 'bg-green-50 text-green-700 border border-green-200',
    rejected: 'bg-red-50 text-red-700 border border-red-200',
  };
  const icons = {
    pending:  <FiAlertCircle size={12} />,
    accepted: <FiCheckCircle size={12} />,
    rejected: <FiXCircle size={12} />,
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${styles[status] || styles.pending}`}>
      {icons[status]} {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const CompanyApplications = () => {
  const { internshipId } = useParams();
  const [applications, setApplications] = useState([]);
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    Promise.all([
      companyAPI.getApplications(internshipId),
      companyAPI.getInternships({ limit: 100 }),
    ]).then(([appRes, intRes]) => {
      setApplications(appRes.data.applications || []);
      const found = (intRes.data.internships || []).find(
        i => String(i.internship_id) === String(internshipId)
      );
      setInternship(found || null);
    }).catch(() => {})
      .finally(() => setLoading(false));
  }, [internshipId]);

  const handleStatus = async (appId, status) => {
    setUpdating(appId);
    try {
      await companyAPI.updateApplicationStatus(appId, status);
      setApplications(prev =>
        prev.map(a => a.application_id === appId ? { ...a, status } : a)
      );
      toast.success(
        status === 'accepted'
          ? '✅ Application accepted! Student will be notified.'
          : '❌ Application rejected.',
        { duration: 3000 }
      );
    } catch {
      toast.error('Failed to update. Please try again.');
    } finally {
      setUpdating(null);
    }
  };

  const filtered = filter === 'all'
    ? applications
    : applications.filter(a => a.status === filter);

  const counts = {
    all:      applications.length,
    pending:  applications.filter(a => a.status === 'pending').length,
    accepted: applications.filter(a => a.status === 'accepted').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 to-purple-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3 mb-3">
            <Link to="/company/dashboard"
              className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors">
              <FiArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="text-xl font-bold">Applications</h1>
              {internship && (
                <p className="text-purple-200 text-sm mt-0.5">{internship.title}</p>
              )}
            </div>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap gap-3 mt-4">
            {[
              { key: 'all',      label: 'Total',    color: 'bg-white/20' },
              { key: 'pending',  label: 'Pending',  color: 'bg-yellow-500/30' },
              { key: 'accepted', label: 'Accepted', color: 'bg-green-500/30' },
              { key: 'rejected', label: 'Rejected', color: 'bg-red-500/30' },
            ].map(({ key, label, color }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  filter === key
                    ? 'bg-white text-purple-700 shadow-md'
                    : `${color} text-white hover:bg-white/30`
                }`}
              >
                {label}
                <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${
                  filter === key ? 'bg-purple-100 text-purple-700' : 'bg-white/20'
                }`}>
                  {counts[key]}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <LoadingSpinner text="Loading applications..." />
        ) : filtered.length === 0 ? (
          <div className="card text-center py-16">
            <FiUser size={48} className="mx-auto text-gray-200 mb-3" />
            <p className="text-gray-500 font-medium">
              {filter === 'all' ? 'No applications yet.' : `No ${filter} applications.`}
            </p>
            {filter !== 'all' && (
              <button onClick={() => setFilter('all')}
                className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium">
                View all applications
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(app => (
              <div key={app.application_id}
                className={`bg-white rounded-2xl border shadow-sm transition-all ${
                  app.status === 'accepted' ? 'border-green-200 bg-green-50/30' :
                  app.status === 'rejected' ? 'border-red-100 opacity-75' :
                  'border-gray-100 hover:shadow-md'
                }`}>
                <div className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">

                    {/* Student info */}
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-sm">
                        {(app.student_name || 'S').charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="font-bold text-gray-900">{app.student_name}</h3>
                          <StatusBadge status={app.status} />
                        </div>

                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mb-2">
                          <span className="flex items-center gap-1">
                            <FiMail size={11} className="text-gray-400" />
                            {app.email}
                          </span>
                          {app.phone && (
                            <a href={`tel:${app.phone}`}
                              className="flex items-center gap-1 text-green-600 hover:text-green-700 font-medium">
                              <FiPhone size={11} />
                              {app.phone}
                            </a>
                          )}
                        </div>

                        {/* Trade & Level badges */}
                        <div className="flex flex-wrap gap-2 mb-2">
                          {app.trade && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold border border-blue-200">
                              <FiBriefcase size={10} /> {app.trade}
                            </span>
                          )}
                          {app.level && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-semibold border border-purple-200">
                              <FiBookOpen size={10} /> {app.level}
                            </span>
                          )}
                          {app.school && (
                            <span className="text-xs text-gray-400">{app.school}</span>
                          )}
                        </div>

                        {/* Applied date */}
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                          <FiClock size={10} />
                          Applied {new Date(app.application_date).toLocaleDateString('en-RW', {
                            day: 'numeric', month: 'short', year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col items-end gap-3 flex-shrink-0">
                      {/* CV download */}
                      {app.cv_file && (
                        <a
                          href={`/uploads/cvs/${app.cv_file}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-semibold rounded-xl border border-blue-200 transition-colors"
                        >
                          <FiDownload size={12} /> Download CV
                        </a>
                      )}

                      {/* Accept / Reject buttons — only for pending */}
                      {app.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleStatus(app.application_id, 'accepted')}
                            disabled={updating === app.application_id}
                            className="flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
                          >
                            {updating === app.application_id
                              ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              : <FiCheck size={14} />
                            }
                            Accept
                          </button>
                          <button
                            onClick={() => handleStatus(app.application_id, 'rejected')}
                            disabled={updating === app.application_id}
                            className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
                          >
                            {updating === app.application_id
                              ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              : <FiX size={14} />
                            }
                            Reject
                          </button>
                        </div>
                      )}

                      {/* Undo option for accepted/rejected */}
                      {app.status !== 'pending' && (
                        <button
                          onClick={() => handleStatus(app.application_id, 'pending')}
                          disabled={updating === app.application_id}
                          className="text-xs text-gray-400 hover:text-gray-600 underline transition-colors"
                        >
                          Reset to pending
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Cover note */}
                  {app.notes && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-xs font-semibold text-gray-500 mb-1.5">Cover Note:</p>
                      <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-3 leading-relaxed">
                        "{app.notes}"
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyApplications;
