import React, { useState, useEffect } from 'react';
import { studentAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import InternshipCard from '../../components/InternshipCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { FiBriefcase } from 'react-icons/fi';
import toast from 'react-hot-toast';

const StudentInternships = () => {
  const { user } = useAuth();
  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyModal, setApplyModal] = useState(null);
  const [applyNote, setApplyNote] = useState('');
  const [applying, setApplying] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 12;

  useEffect(() => {
    Promise.all([
      studentAPI.getInternships({ page, limit }),
      studentAPI.getApplications({ limit: 200 }),
    ]).then(([intRes, appRes]) => {
      setInternships(intRes.data.internships || []);
      setTotal(intRes.data.total || 0);
      setApplications(appRes.data.applications || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [page]);

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

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Available Internships</h1>
          <p className="text-gray-500 text-sm mt-1">
            Showing internships for <strong>{user?.trade}</strong> — <strong>{user?.level}</strong>
          </p>
        </div>

        {loading ? (
          <LoadingSpinner size="lg" text="Loading internships..." />
        ) : internships.length === 0 ? (
          <div className="card text-center py-16">
            <FiBriefcase size={48} className="mx-auto text-gray-200 mb-3" />
            <p className="text-gray-500 font-medium">No internships available for your trade/level.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
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
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="px-4 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-colors">
                  Previous
                </button>
                <span className="px-4 py-2 text-sm text-gray-600">Page {page} of {totalPages}</span>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="px-4 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-colors">
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {applyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md animate-slide-up">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-1">Apply for Internship</h3>
              <p className="text-sm text-gray-500 mb-4">{applyModal.title} at {applyModal.company_name}</p>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Cover Note <span className="text-gray-400 font-normal">(optional)</span></label>
              <textarea value={applyNote} onChange={e => setApplyNote(e.target.value)}
                placeholder="Briefly explain why you're a good fit..." rows={4} className="input-field resize-none" />
              <div className="flex gap-3 mt-5">
                <button onClick={() => { setApplyModal(null); setApplyNote(''); }}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button onClick={handleApply} disabled={applying}
                  className="flex-1 btn-primary py-2.5 flex items-center justify-center gap-2">
                  {applying ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Applying...</> : 'Submit'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentInternships;
