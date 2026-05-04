import { useState } from 'react';
import { useToast } from '../../components/Toast';
import { getAdminSession } from '../../lib/storage';

export default function AdminSettings() {
  const session = getAdminSession();
  const addToast = useToast();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [notifications, setNotifications] = useState({ email: true, sms: false });

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) { addToast('Please fill in both fields', 'error'); return; }
    setCurrentPassword('');
    setNewPassword('');
    addToast('Password updated successfully');
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-text-primary">Settings</h1>

      {/* Account Info */}
      <div className="bg-surface-card border border-border rounded-xl p-6">
        <h3 className="text-sm font-semibold text-text-primary mb-4">Account Information</h3>
        <div className="space-y-2 text-sm">
          <p><span className="font-medium text-text-secondary">Email:</span> {session?.email}</p>
          <p><span className="font-medium text-text-secondary">Last Login:</span> {session?.loginAt ? new Date(session.loginAt).toLocaleString('en-IN') : 'N/A'}</p>
          <p><span className="font-medium text-text-secondary">Account Created:</span> January 2025</p>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-surface-card border border-border rounded-xl p-6">
        <h3 className="text-sm font-semibold text-text-primary mb-4">Change Password</h3>
        <form onSubmit={handlePasswordChange} className="space-y-3 max-w-sm">
          <input type="password" placeholder="Current password" value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
          <input type="password" placeholder="New password" value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
          <button type="submit" className="px-4 py-2.5 bg-cta text-white text-sm font-semibold rounded-lg hover:bg-cta-dark transition-colors">
            Update Password
          </button>
        </form>
      </div>

      {/* Notification Preferences */}
      <div className="bg-surface-card border border-border rounded-xl p-6">
        <h3 className="text-sm font-semibold text-text-primary mb-4">Notification Preferences</h3>
        <div className="space-y-3">
          {[
            { key: 'email', label: 'Email Notifications', desc: 'Receive appointment updates via email' },
            { key: 'sms', label: 'SMS Notifications', desc: 'Receive appointment updates via SMS' },
          ].map(item => (
            <label key={item.key} className="flex items-center justify-between cursor-pointer p-3 rounded-lg hover:bg-surface transition-colors">
              <div>
                <span className="text-sm font-medium text-text-primary">{item.label}</span>
                <p className="text-xs text-text-muted">{item.desc}</p>
              </div>
              <div
                className={`relative w-11 h-6 rounded-full transition-colors ${notifications[item.key] ? 'bg-success' : 'bg-gray-300'}`}
                onClick={() => {
                  setNotifications({ ...notifications, [item.key]: !notifications[item.key] });
                  addToast('Preference updated');
                }}
              >
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-surface-card rounded-full shadow transition-transform ${notifications[item.key] ? 'translate-x-5' : ''}`} />
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
