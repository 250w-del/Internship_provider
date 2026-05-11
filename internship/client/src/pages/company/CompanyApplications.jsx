import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { companyAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { FiArrowLeft, FiUser, FiMail, FiPhone, FiDownload, FiCheck, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

const CompanyApplications = () => {
  const { internshipId } = useParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    companyAPI.getApplications(internshipId)
      .then(res => setApplications(res.data.applications || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [internshipId]);

  const handleStatus = async (appId, status) => {
    setUpdating(appId);
    try {
      await companyAPI.updateApplicationStatus(appId, status);
      setApplications(prev => prev.map(a =>
        a.application_id === appId ? { ...a, status } : a
      ));
      toast.success(`Application ${status}`);
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/company/dashboard" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <FiArrowLeft size={18} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
        </div>

        {loading ? (
          <LoadingSpinner text="Loading applications..." />
        ) : applications.length === 0 ? (
          <div className="card text-center py-16">
            <FiUser size={48} className="mx-auto text-gray-200 mb-3" />
            <p className="text-gray-500">No applications yet for this internship.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map(app => (
              <div key={app.application_id} className="card">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
                      {(app.student_name || 'S').charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{app.student_name}</h3>
                      <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-400">
                        <span className="flex items-center gap-1"><FiMail size={11} /> {app.email}</span>
                        {app.phone && <span className="flex items-center gap-1"><FiPhone size={11} /> {app.phone}</span>}
                        {app.trade && <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">{app.trade} — {app.level}</span>}
                      </div>
                      {app.notes && (
                        <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded-lg">{app.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span className={`badge-${app.status}`}>{app.status}</span>
                    {app.cv_file && (
                      <a href={`http://localhost:5000/uploads/cvs/${app.cv_file}`} target="_blank" rel="noreferrer"
                        className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700">
                        <FiDownload size={12} /> Download CV
                      </a>
                    )}
                    {app.status === 'pending' && (
                      <div className="flex gap-2">
                        <button onClick={() => handleStatus(app.application_id, 'accepted')}
                          disabled={updating === app.application_id}
                          className="flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs rounded-lg font-medium transition-colors">
                          <FiCheck size={12} /> Accept
                        </button>
                        <button onClick={() => handleStatus(app.application_id, 'rejected')}
                          disabled={updating === app.application_id}
                          className="flex items-center gap-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs rounded-lg font-medium transition-colors">
                          <FiX size={12} /> Reject
                        </button>
                      </div>
                    )}
                  </div>
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
