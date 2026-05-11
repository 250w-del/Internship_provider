import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { TRADES, LEVELS } from '../constants/trades';
import {
  FiBriefcase, FiMail, FiLock, FiEye, FiEyeOff,
  FiUser, FiPhone, FiMapPin, FiAlertCircle, FiCheckCircle
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const [type, setType] = useState(searchParams.get('type') || 'student');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [studentForm, setStudentForm] = useState({
    full_name: '', email: '', phone: '', trade: '', level: '', school: '', password: '', confirmPassword: ''
  });
  const [companyForm, setCompanyForm] = useState({
    company_name: '', email: '', phone: '', location: '', description: '', password: '', confirmPassword: ''
  });

  useEffect(() => {
    const t = searchParams.get('type');
    if (t === 'student' || t === 'company') setType(t);
  }, [searchParams]);

  const handleStudentChange = e => {
    setStudentForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };
  const handleCompanyChange = e => {
    setCompanyForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (type === 'student') {
      if (studentForm.password !== studentForm.confirmPassword) {
        return setError('Passwords do not match');
      }
      if (!studentForm.trade || !studentForm.level) {
        return setError('Please select your trade and level');
      }
      setLoading(true);
      try {
        const { confirmPassword, ...data } = studentForm;
        const res = await authAPI.registerStudent(data);
        login(res.data.token, res.data.user, res.data.role);
        toast.success('Account created! Welcome to Internship Provider.');
        navigate('/student/dashboard');
      } catch (err) {
        setError(err.response?.data?.message || 'Registration failed');
      } finally {
        setLoading(false);
      }
    } else {
      if (companyForm.password !== companyForm.confirmPassword) {
        return setError('Passwords do not match');
      }
      setLoading(true);
      try {
        const { confirmPassword, ...data } = companyForm;
        const res = await authAPI.registerCompany(data);
        login(res.data.token, res.data.user, res.data.role);
        toast.success('Company registered! Welcome to Internship Provider.');
        navigate('/company/dashboard');
      } catch (err) {
        setError(err.response?.data?.message || 'Registration failed');
      } finally {
        setLoading(false);
      }
    }
  };

  const inputClass = "input-field";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center shadow-lg">
              <FiBriefcase className="text-white text-2xl" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="text-gray-500 mt-1 text-sm">Join Rwanda's TVET internship platform</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {/* Type selector */}
          <div className="flex rounded-xl bg-gray-100 p-1 mb-6">
            {[
              { value: 'student', label: '🎓 Student' },
              { value: 'company', label: '🏢 Company' },
            ].map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => { setType(value); setError(''); }}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  type === value ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700 flex items-center gap-2">
              <FiAlertCircle size={16} className="flex-shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {type === 'student' ? (
              <>
                <div>
                  <label className={labelClass}>Full Name *</label>
                  <div className="relative">
                    <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input name="full_name" value={studentForm.full_name} onChange={handleStudentChange}
                      placeholder="Your full name" required className={`${inputClass} pl-10`} />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Email Address *</label>
                  <div className="relative">
                    <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input type="email" name="email" value={studentForm.email} onChange={handleStudentChange}
                      placeholder="you@example.com" required className={`${inputClass} pl-10`} />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Phone Number</label>
                  <div className="relative">
                    <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input name="phone" value={studentForm.phone} onChange={handleStudentChange}
                      placeholder="+250 7XX XXX XXX" className={`${inputClass} pl-10`} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>TVET Trade *</label>
                    <select name="trade" value={studentForm.trade} onChange={handleStudentChange}
                      required className={inputClass}>
                      <option value="">Select Trade</option>
                      {TRADES.map(t => (
                        <option key={t.code} value={t.code}>{t.icon} {t.code}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Level *</label>
                    <select name="level" value={studentForm.level} onChange={handleStudentChange}
                      required className={inputClass}>
                      <option value="">Select Level</option>
                      {LEVELS.map(l => (
                        <option key={l.code} value={l.code}>{l.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {studentForm.trade && (
                  <div className="p-3 bg-blue-50 rounded-xl text-xs text-blue-700 flex items-center gap-2">
                    <FiCheckCircle size={14} />
                    {TRADES.find(t => t.code === studentForm.trade)?.name}
                    {studentForm.level && ` — ${studentForm.level}`}
                  </div>
                )}

                <div>
                  <label className={labelClass}>School / Institution</label>
                  <input name="school" value={studentForm.school} onChange={handleStudentChange}
                    placeholder="e.g. IPRC Kigali" className={inputClass} />
                </div>

                <div>
                  <label className={labelClass}>Password *</label>
                  <div className="relative">
                    <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input type={showPass ? 'text' : 'password'} name="password" value={studentForm.password}
                      onChange={handleStudentChange} placeholder="Min. 6 characters" required minLength={6}
                      className={`${inputClass} pl-10 pr-10`} />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Confirm Password *</label>
                  <div className="relative">
                    <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input type="password" name="confirmPassword" value={studentForm.confirmPassword}
                      onChange={handleStudentChange} placeholder="Repeat password" required
                      className={`${inputClass} pl-10`} />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className={labelClass}>Company Name *</label>
                  <div className="relative">
                    <FiBriefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input name="company_name" value={companyForm.company_name} onChange={handleCompanyChange}
                      placeholder="Your company name" required className={`${inputClass} pl-10`} />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Email Address *</label>
                  <div className="relative">
                    <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input type="email" name="email" value={companyForm.email} onChange={handleCompanyChange}
                      placeholder="company@example.com" required className={`${inputClass} pl-10`} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Phone</label>
                    <div className="relative">
                      <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input name="phone" value={companyForm.phone} onChange={handleCompanyChange}
                        placeholder="+250 7XX XXX XXX" className={`${inputClass} pl-10`} />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Location</label>
                    <div className="relative">
                      <FiMapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input name="location" value={companyForm.location} onChange={handleCompanyChange}
                        placeholder="Kigali, Rwanda" className={`${inputClass} pl-10`} />
                    </div>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Company Description</label>
                  <textarea name="description" value={companyForm.description} onChange={handleCompanyChange}
                    placeholder="Brief description of your company..." rows={3}
                    className={`${inputClass} resize-none`} />
                </div>

                <div>
                  <label className={labelClass}>Password *</label>
                  <div className="relative">
                    <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input type={showPass ? 'text' : 'password'} name="password" value={companyForm.password}
                      onChange={handleCompanyChange} placeholder="Min. 6 characters" required minLength={6}
                      className={`${inputClass} pl-10 pr-10`} />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Confirm Password *</label>
                  <div className="relative">
                    <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input type="password" name="confirmPassword" value={companyForm.confirmPassword}
                      onChange={handleCompanyChange} placeholder="Repeat password" required
                      className={`${inputClass} pl-10`} />
                  </div>
                </div>
              </>
            )}

            <button type="submit" disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3 mt-2">
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating account...</>
              ) : (
                `Register as ${type === 'student' ? 'Student' : 'Company'}`
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-semibold hover:text-blue-700">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
