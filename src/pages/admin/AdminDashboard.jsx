import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AppointmentCard from '../../components/AppointmentCard';
import { useToast } from '../../components/Toast';
import { getAdminSession, getStoredAppointments, setStoredAppointments } from '../../lib/storage';
import { appointments as seedAppointments } from '../../lib/mockData';

export default function AdminDashboard() {
  const session = getAdminSession();
  const addToast = useToast();
  const [allAppointments, setAllAppointments] = useState(() => getStoredAppointments() || seedAppointments);
  const [detailModal, setDetailModal] = useState(null);

  const myAppts = useMemo(() => allAppointments.filter(a => a.doctorId === session?.doctorId), [allAppointments, session]);

  const today = new Date().toISOString().split('T')[0];
  const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];

  const stats = {
    total: myAppts.length,
    pending: myAppts.filter(a => a.status === 'Pending').length,
    confirmed: myAppts.filter(a => a.status === 'Confirmed').length,
    completed: myAppts.filter(a => a.status === 'Completed').length,
  };

  const urgencyChart = [
    { name: 'Low', count: myAppts.filter(a => a.urgency === 'Low').length, fill: '#2d6a3f' },
    { name: 'Moderate', count: myAppts.filter(a => a.urgency === 'Moderate').length, fill: '#92610a' },
    { name: 'High', count: myAppts.filter(a => a.urgency === 'High').length, fill: '#ea580c' },
    { name: 'Emergency', count: myAppts.filter(a => a.urgency === 'Emergency').length, fill: '#D9534F' },
  ];

  const upcoming = myAppts.filter(a => a.date >= today && a.date <= nextWeek && a.status !== 'Cancelled').sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));

  const recentActivity = myAppts.filter(a => a.status !== 'Pending').slice(-5).reverse();

  const updateStatus = (id, status) => {
    const updated = allAppointments.map(a => a.id === id ? { ...a, status } : a);
    setAllAppointments(updated);
    setStoredAppointments(updated);
    addToast(`Appointment ${status.toLowerCase()}`);
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-text-primary">{greeting}, {session?.name}</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Appointments', value: stats.total, color: 'text-text-primary' },
          { label: 'Pending', value: stats.pending, color: 'text-warning' },
          { label: 'Confirmed', value: stats.confirmed, color: 'text-success' },
          { label: 'Completed', value: stats.completed, color: 'text-blue-600' },
        ].map(s => (
          <div key={s.label} className="bg-surface-card border border-border rounded-xl p-4">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-text-muted mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Urgency chart */}
      <div className="bg-surface-card border border-border rounded-xl p-5">
        <h3 className="text-sm font-semibold text-text-primary mb-4">Appointments by Urgency</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={urgencyChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#C8CCBB" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {urgencyChart.map((entry, i) => (
                  <Bar key={i} dataKey="count" fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Upcoming */}
      <div className="bg-surface-card border border-border rounded-xl p-5">
        <h3 className="text-sm font-semibold text-text-primary mb-4">Upcoming Appointments (Next 7 Days)</h3>
        {upcoming.length === 0 ? (
          <p className="text-sm text-text-muted">No upcoming appointments.</p>
        ) : (
          <div className="space-y-2">
            {upcoming.map(a => (
              <AppointmentCard key={a.id} appointment={a}
                onConfirm={(id) => updateStatus(id, 'Confirmed')}
                onCancel={(id) => updateStatus(id, 'Cancelled')}
                onComplete={(id) => updateStatus(id, 'Completed')}
                onViewDetails={setDetailModal}
              />
            ))}
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-surface-card border border-border rounded-xl p-5">
        <h3 className="text-sm font-semibold text-text-primary mb-4">Recent Activity</h3>
        <div className="space-y-2">
          {recentActivity.map(a => (
            <div key={a.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div>
                <span className="text-sm text-text-primary font-medium">{a.patientName}</span>
                <span className="text-xs text-text-muted ml-2">{a.status}</span>
              </div>
              <span className="text-xs text-text-muted">{a.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Detail modal */}
      {detailModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setDetailModal(null)}>
          <div className="bg-surface-card rounded-xl max-w-md w-full p-6 animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-bold text-text-primary">Appointment Details</h3>
              <button onClick={() => setDetailModal(null)} className="p-1 rounded hover:bg-surface"><svg className="w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg></button>
            </div>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium text-text-secondary">ID:</span> {detailModal.id}</p>
              <p><span className="font-medium text-text-secondary">Patient:</span> {detailModal.patientName}</p>
              <p><span className="font-medium text-text-secondary">Phone:</span> {detailModal.patientPhone}</p>
              <p><span className="font-medium text-text-secondary">Date:</span> {detailModal.date} at {detailModal.time}</p>
              <p><span className="font-medium text-text-secondary">Urgency:</span> <span className={detailModal.urgency === 'Emergency' ? 'text-primary font-bold' : ''}>{detailModal.urgency}</span></p>
              <p><span className="font-medium text-text-secondary">Reason:</span> {detailModal.reason}</p>
              <p><span className="font-medium text-text-secondary">Notes:</span> {detailModal.notes}</p>
              <p><span className="font-medium text-text-secondary">Status:</span> {detailModal.status}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
