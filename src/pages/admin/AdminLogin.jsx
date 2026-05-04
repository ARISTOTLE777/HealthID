import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminUsers } from '../../lib/mockData';
import { setAdminSession } from '../../lib/storage';
import { useToast } from '../../components/Toast';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const addToast = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const user = adminUsers.find(u => u.email === email && u.password === password);
    if (user) {
      setAdminSession({ ...user, loginAt: new Date().toISOString() });
      addToast(`Welcome, ${user.name}`);
      navigate('/admin/dashboard');
    } else {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="bg-surface-card rounded-xl shadow-lg max-w-md w-full p-8 animate-fade-in">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <svg className="w-8 h-8 text-primary" viewBox="0 0 32 32" fill="none">
              <rect x="2" y="2" width="28" height="28" rx="6" stroke="currentColor" strokeWidth="2.5"/>
              <path d="M16 8v16M8 16h16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            <span className="font-display text-xl font-bold text-text-primary">HealthID</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-text-primary">Doctor Portal</h1>
          <p className="text-sm text-text-muted mt-1">Sign in to manage your appointments and profile</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Email</label>
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="doctor@healthid.in"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Password</label>
            <input
              type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            {error && <p className="text-xs text-primary mt-2">{error}</p>}
          </div>
          <button type="submit" className="w-full py-3 bg-cta text-white font-semibold rounded-lg hover:bg-cta-dark transition-colors">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
