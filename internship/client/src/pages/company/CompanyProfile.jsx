import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { companyAPI } from '../../services/api';
import { FiBriefcase, FiMail, FiPhone, FiMapPin, FiSave, FiFileText } from 'react-icons/fi';
import toast from 'react-hot-toast';

const CompanyProfile = () => {
  const { user, login, token, role } = useAuth();
  const [form, setForm] = useState({
    company_name: user?.company_name || '',
    phone: user?.phone || '',
    location: user?.location || '',
    description: user?.description || '',
  });
  const [saving, setSaving] = useState(false);

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await companyAPI.updateProfile(form);
      login(token, res.data.company, role);
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Company Profile</h1>

        <div className="card mb-5">
          {/* Avatar */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-md">
              {user?.company_name?.charAt(0) || 'C'}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{user?.company_name}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
              {user?.location && <p className="text-xs text-gray-400 mt-0.5">{user.location}</p>}
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Company Name</label>
              <div className="relative">
                <FiBriefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input name="company_name" value={form.company_name} onChange={handleChange}
                  className="input-field pl-10" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input value={user?.email} disabled
                  className="input-field pl-10 bg-gray-50 text-gray-400 cursor-not-allowed" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                <div className="relative">
                  <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input name="phone" value={form.phone} onChange={handleChange}
                    placeholder="+250 7XX XXX XXX" className="input-field pl-10" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
                <div className="relative">
                  <FiMapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input name="location" value={form.location} onChange={handleChange}
                    placeholder="Kigali, Rwanda" className="input-field pl-10" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
              <div className="relative">
                <FiFileText className="absolute left-3.5 top-3.5 text-gray-400" size={16} />
                <textarea name="description" value={form.description} onChange={handleChange}
                  placeholder="Describe your company..." rows={4}
                  className="input-field pl-10 resize-none" />
              </div>
            </div>

            <button type="submit" disabled={saving}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3">
              {saving
                ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
                : <><FiSave size={16} /> Save Changes</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
