import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePatient } from '../../lib/PatientContext';
import { useI18n } from '../../lib/i18n';
import { useToast } from '../../components/Toast';

const indianStates = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Delhi','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra',
  'Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim',
  'Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
];

export default function PatientLogin() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '', confirmPassword: '', city: '', state: '' });
  const [error, setError] = useState('');
  const { login, signup } = usePatient();
  const { t } = useI18n();
  const addToast = useToast();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    try {
      if (mode === 'login') {
        if (!form.phone || !form.password) { setError('Please enter phone number and password'); return; }
        login(form.phone, form.password);
        addToast('Welcome back!');
        navigate('/patient/dashboard');
      } else {
        if (!form.name || !form.phone || !form.password) { setError('Please fill all required fields'); return; }
        if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
        if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
        signup(form);
        addToast('Account created successfully!');
        navigate('/patient/dashboard');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const u = (key, val) => setForm({ ...form, [key]: val });

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="font-display text-2xl font-bold text-text-primary">
            {mode === 'login' ? t('patientLogin') : 'Create Patient Account'}
          </h1>
          <p className="text-sm text-text-muted mt-1">
            {mode === 'login' ? 'Access your health records, appointments, and saved documents' : 'Join HealthID to manage your health journey'}
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex gap-1 bg-surface p-1 rounded-lg mb-6">
          <button onClick={() => setMode('login')} className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-colors ${mode === 'login' ? 'bg-surface text-primary shadow-sm' : 'text-text-muted'}`}>
            Login
          </button>
          <button onClick={() => setMode('signup')} className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-colors ${mode === 'signup' ? 'bg-surface text-primary shadow-sm' : 'text-text-muted'}`}>
            Sign Up
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-alert/10 border border-alert/30 rounded-lg text-sm text-primary">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Full Name *</label>
              <input type="text" value={form.name} onChange={e => u('name', e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Phone Number *</label>
            <div className="flex">
              <span className="flex items-center px-3 bg-surface border border-r-0 border-border rounded-l-xl text-sm text-text-muted">+91</span>
              <input type="tel" value={form.phone} onChange={e => u('phone', e.target.value)}
                placeholder="10-digit mobile number" maxLength={10}
                className="flex-1 px-4 py-3 border border-border rounded-r-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
          </div>

          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Email (optional)</label>
                <input type="email" value={form.email} onChange={e => u('email', e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">City</label>
                  <input type="text" value={form.city} onChange={e => u('city', e.target.value)}
                    placeholder="Your city"
                    className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">State</label>
                  <select value={form.state} onChange={e => u('state', e.target.value)}
                    className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-surface-card">
                    <option value="">Select</option>
                    {indianStates.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Password *</label>
            <input type="password" value={form.password} onChange={e => u('password', e.target.value)}
              placeholder={mode === 'login' ? 'Enter your password' : 'Create a password (min 6 characters)'}
              className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
          </div>

          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Confirm Password *</label>
              <input type="password" value={form.confirmPassword} onChange={e => u('confirmPassword', e.target.value)}
                placeholder="Re-enter your password"
                className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
          )}

          <button type="submit" className="w-full py-3 bg-cta text-white font-semibold rounded-xl hover:bg-cta-dark transition-colors">
            {mode === 'login' ? 'Login to HealthID' : 'Create Account'}
          </button>
        </form>

        <p className="text-xs text-text-muted text-center mt-6">
          {mode === 'login' ? 'Don\'t have an account? ' : 'Already have an account? '}
          <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}
            className="text-primary font-medium hover:underline">
            {mode === 'login' ? 'Sign up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}
