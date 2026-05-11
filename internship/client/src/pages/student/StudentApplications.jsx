import React, { useState, useEffect } from 'react';
import { studentAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { FiFileText, FiCalendar, FiMapPin } from 'react-icons/fi';

const StudentApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    studentAPI.getApplications({ limit: 50 })
      .then(res => setApplications(res.data.applications || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="py-20"><LoadingSpinner text="Loading applications..." /></div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Applications</h1>

        {applications.length === 0 ? (
          <div className="card text-center py-16">
            <FiFileText size={48} className="mx-auto text-gray-200 mb-3" />
            <p className="text-gray-500 font-medium">No applications yet</p>
            <p className="text-gray-400 text-sm mt-1">Browse internships and apply to get started.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map(app => (
              <div key={app.application_id} className="card hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
                      {(app.company_name || 'C').charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{app.title}</h3>
                      <p className="text-sm text-gray-500">{app.company_name}</p>
                      <div className="flex flex-wrap gap-3 mt-1.5">
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <FiCalendar size={11} />
                          Applied {new Date(app.application_date).toLocaleDateString('en-RW', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                        {app.deadline && (
                          <span className="flex items-center gap-1 text-xs text-gray-400">
                            <FiCalendar size={11} />
                            Deadline {new Date(app.deadline).toLocaleDateString('en-RW', { day: 'numeric', month: 'short' })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <span className={`badge-${app.status} self-start sm:self-center`}>{app.status}</span>
                </div>
                {app.notes && (
                  <div className="mt-3 pt-3 border-t border-gray-50">
                    <p className="text-xs text-gray-400 font-medium mb-1">Your note:</p>
                    <p className="text-sm text-gray-600">{app.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentApplications;
