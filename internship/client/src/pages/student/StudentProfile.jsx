import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { studentAPI } from '../../services/api';
import { TRADES, LEVELS } from '../../constants/trades';
import { FiUser, FiMail, FiPhone, FiUpload, FiSave, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

const StudentProfile = () => {
  const { user, login, token, role } = useAuth();
  const [form, setForm] = useState({
    full_name: user?.full_name || '',
    phone: user?.phone || '',
    trade: user?.trade || '',
    level: user?.level || '',
    school: user?.school || '',
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await studentAPI.updateProfile(form);
      login(token, res.data.student, role);
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCVUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('cv', file);
    setUploading(true);
    try {
      await studentAPI.uploadCV(formData);
      toast.success('CV uploaded successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h1>

        <div className="card mb-5">
          {/* Avatar */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-md">
              {user?.full_name?.charAt(0) || 'S'}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{user?.full_name}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
              <div className="flex gap-2 mt-1">
                {user?.trade && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">{user.trade}</span>}
                {user?.level && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">{user.level}</span>}
              </div>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input name="full_name" value={form.full_name} onChange={handleChange}
                  className="input-field pl-10" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input value={user?.email} disabled className="input-field pl-10 bg-gray-50 text-gray-400 cursor-not-allowed" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
              <div className="relative">
                <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input name="phone" value={form.phone} onChange={handleChange}
                  placeholder="+250 7XX XXX XXX" className="input-field pl-10" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Trade</label>
                <select name="trade" value={form.trade} onChange={handleChange} className="input-field">
                  <option value="">Select Trade</option>
                  {TRADES.map(t => <option key={t.code} value={t.code}>{t.icon} {t.code}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Level</label>
                <select name="level" value={form.level} onChange={handleChange} className="input-field">
                  <option value="">Select Level</option>
                  {LEVELS.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">School / Institution</label>
              <input name="school" value={form.school} onChange={handleChange}
                placeholder="e.g. IPRC Kigali" className="input-field" />
            </div>

            <button type="submit" disabled={saving} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
              {saving ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</> : <><FiSave size={16} /> Save Changes</>}
            </button>
          </form>
        </div>

        {/* CV Upload */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">CV / Resume</h2>
          {user?.cv_file ? (
            <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-xl mb-4">
              <FiCheckCircle className="text-green-600 flex-shrink-0" size={18} />
              <div>
                <p className="text-sm font-medium text-green-800">CV uploaded</p>
                <p className="text-xs text-green-600">{user.cv_file}</p>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl mb-4 text-sm text-amber-700">
              No CV uploaded yet. Upload your CV to improve your chances.
            </div>
          )}
          <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" onChange={handleCVUpload} className="hidden" />
          <button onClick={() => fileRef.current?.click()} disabled={uploading}
            className="btn-secondary w-full flex items-center justify-center gap-2 py-3">
            {uploading ? <><div className="w-4 h-4 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" /> Uploading...</> : <><FiUpload size={16} /> {user?.cv_file ? 'Replace CV' : 'Upload CV'}</>}
          </button>
          <p className="text-xs text-gray-400 mt-2 text-center">PDF, DOC, DOCX — max 5MB</p>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
