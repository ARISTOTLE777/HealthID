import { useState, useMemo } from 'react';
import { getAdminSession, getStoredAppointments } from '../../lib/storage';
import { appointments as seedAppointments } from '../../lib/mockData';

export default function PatientMessages() {
  const session = getAdminSession();
  const allAppts = getStoredAppointments() || seedAppointments;
  const [readSet, setReadSet] = useState(new Set());

  const messages = useMemo(() =>
    allAppts
      .filter(a => a.doctorId === session?.doctorId && a.notes)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
  [allAppts, session]);

  const urgencyColors = { Low: 'bg-green-50 text-success', Moderate: 'bg-amber-50 text-warning', High: 'bg-orange-50 text-orange-600', Emergency: 'bg-alert/10 text-primary' };

  const toggleRead = (id) => {
    const next = new Set(readSet);
    next.has(id) ? next.delete(id) : next.add(id);
    setReadSet(next);
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-text-primary">Patient Messages</h1>
      <p className="text-sm text-text-muted">{messages.length} messages from appointment notes</p>

      <div className="space-y-3">
        {messages.map(m => (
          <div key={m.id} className={`bg-surface-card border rounded-xl p-5 transition-all ${readSet.has(m.id) ? 'border-border opacity-70' : 'border-border'}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-sm font-semibold text-text-primary">{m.patientName}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${urgencyColors[m.urgency]}`}>{m.urgency}</span>
                  {readSet.has(m.id) && <span className="text-[10px] text-text-muted">Read</span>}
                </div>
                <p className="text-xs text-text-muted mb-2">{m.createdAt} — {m.reason}</p>
                <p className="text-sm text-text-secondary leading-relaxed">{m.notes}</p>
              </div>
              <button
                onClick={() => toggleRead(m.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${readSet.has(m.id) ? 'bg-surface text-text-muted' : 'bg-primary-light text-primary'}`}
              >
                {readSet.has(m.id) ? 'Unread' : 'Mark Read'}
              </button>
            </div>
          </div>
        ))}
        {messages.length === 0 && <p className="text-sm text-text-muted text-center py-8">No patient messages.</p>}
      </div>
    </div>
  );
}
