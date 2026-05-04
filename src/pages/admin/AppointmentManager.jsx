import { useState, useMemo } from 'react';
import { useToast } from '../../components/Toast';
import { getAdminSession, getStoredAppointments, setStoredAppointments } from '../../lib/storage';
import { appointments as seedAppointments } from '../../lib/mockData';

const urgencyColors = { Low: 'bg-green-50 text-success', Moderate: 'bg-amber-50 text-warning', High: 'bg-orange-50 text-orange-600', Emergency: 'bg-alert/10 text-primary' };
const statusColors = { Pending: 'bg-amber-50 text-warning', Confirmed: 'bg-green-50 text-success', Completed: 'bg-blue-50 text-blue-600', Cancelled: 'bg-gray-100 text-gray-500' };

export default function AppointmentManager() {
  const session = getAdminSession();
  const addToast = useToast();
  const [allAppts, setAllAppts] = useState(() => getStoredAppointments() || seedAppointments);
  const [statusFilter, setStatusFilter] = useState('');
  const [urgencyFilterVal, setUrgencyFilterVal] = useState('');
  const [selected, setSelected] = useState(new Set());
  const [detailModal, setDetailModal] = useState(null);

  const myAppts = useMemo(() => allAppts
    .filter(a => a.doctorId === session?.doctorId)
    .filter(a => !statusFilter || a.status === statusFilter)
    .filter(a => !urgencyFilterVal || a.urgency === urgencyFilterVal)
    .sort((a, b) => b.date.localeCompare(a.date)),
  [allAppts, session, statusFilter, urgencyFilterVal]);

  const updateStatus = (id, status) => {
    const updated = allAppts.map(a => a.id === id ? { ...a, status } : a);
    setAllAppts(updated);
    setStoredAppointments(updated);
    addToast(`Appointment ${status.toLowerCase()}`);
  };

  const bulkAction = (status) => {
    const updated = allAppts.map(a => selected.has(a.id) ? { ...a, status } : a);
    setAllAppts(updated);
    setStoredAppointments(updated);
    setSelected(new Set());
    addToast(`${selected.size} appointments ${status.toLowerCase()}`);
  };

  const toggleSelect = (id) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const toggleAll = () => {
    if (selected.size === myAppts.length) setSelected(new Set());
    else setSelected(new Set(myAppts.map(a => a.id)));
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-text-primary">Appointments</h1>

      <div className="flex flex-wrap gap-3 items-center">
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 border border-border rounded-lg text-sm">
          <option value="">All Statuses</option>
          <option>Pending</option><option>Confirmed</option><option>Completed</option><option>Cancelled</option>
        </select>
        <select value={urgencyFilterVal} onChange={e => setUrgencyFilterVal(e.target.value)} className="px-3 py-2 border border-border rounded-lg text-sm">
          <option value="">All Urgencies</option>
          <option>Low</option><option>Moderate</option><option>High</option><option>Emergency</option>
        </select>
        {selected.size > 0 && (
          <div className="flex gap-2 ml-auto">
            <button onClick={() => bulkAction('Confirmed')} className="px-3 py-2 text-xs font-semibold bg-success text-white rounded-lg">Confirm All ({selected.size})</button>
            <button onClick={() => bulkAction('Cancelled')} className="px-3 py-2 text-xs font-semibold bg-gray-400 text-white rounded-lg">Cancel All ({selected.size})</button>
          </div>
        )}
      </div>

      <div className="bg-surface-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface">
              <tr>
                <th className="px-4 py-3 text-left"><input type="checkbox" checked={selected.size === myAppts.length && myAppts.length > 0} onChange={toggleAll} className="rounded" /></th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary">ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary">Patient</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary">Time</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary">Urgency</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {myAppts.map(a => (
                <tr key={a.id} className="hover:bg-surface/50 transition-colors">
                  <td className="px-4 py-3"><input type="checkbox" checked={selected.has(a.id)} onChange={() => toggleSelect(a.id)} className="rounded" /></td>
                  <td className="px-4 py-3 text-xs font-mono text-text-muted">{a.id}</td>
                  <td className="px-4 py-3 font-medium text-text-primary">{a.patientName}</td>
                  <td className="px-4 py-3 text-text-secondary">{a.date}</td>
                  <td className="px-4 py-3 text-text-secondary">{a.time}</td>
                  <td className="px-4 py-3"><span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${urgencyColors[a.urgency]}`}>{a.urgency}</span></td>
                  <td className="px-4 py-3"><span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusColors[a.status]}`}>{a.status}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {a.status === 'Pending' && <button onClick={() => updateStatus(a.id, 'Confirmed')} className="px-2 py-1 text-[10px] font-semibold bg-success text-white rounded">Confirm</button>}
                      {a.status === 'Pending' && <button onClick={() => updateStatus(a.id, 'Cancelled')} className="px-2 py-1 text-[10px] font-semibold bg-gray-200 text-gray-600 rounded">Cancel</button>}
                      {a.status === 'Confirmed' && <button onClick={() => updateStatus(a.id, 'Completed')} className="px-2 py-1 text-[10px] font-semibold bg-blue-500 text-white rounded">Complete</button>}
                      <button onClick={() => setDetailModal(a)} className="px-2 py-1 text-[10px] font-semibold border border-border text-text-secondary rounded">View</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {myAppts.length === 0 && <div className="p-8 text-center text-text-muted text-sm">No appointments found.</div>}
      </div>

      {detailModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setDetailModal(null)}>
          <div className="bg-surface-card rounded-xl max-w-md w-full p-6 animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between mb-4">
              <h3 className="font-display text-lg font-bold text-text-primary">Appointment Details</h3>
              <button onClick={() => setDetailModal(null)} className="p-1 rounded hover:bg-surface"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg></button>
            </div>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">ID:</span> {detailModal.id}</p>
              <p><span className="font-medium">Patient:</span> {detailModal.patientName}</p>
              <p><span className="font-medium">Phone:</span> {detailModal.patientPhone}</p>
              <p><span className="font-medium">Email:</span> {detailModal.patientEmail || 'Not provided'}</p>
              <p><span className="font-medium">Date:</span> {detailModal.date} at {detailModal.time}</p>
              <p><span className="font-medium">Urgency:</span> <span className={detailModal.urgency === 'Emergency' ? 'text-primary font-bold' : ''}>{detailModal.urgency}</span></p>
              <p><span className="font-medium">Reason:</span> {detailModal.reason}</p>
              <p><span className="font-medium">Notes:</span> {detailModal.notes}</p>
              <p><span className="font-medium">Status:</span> {detailModal.status}</p>
              <p><span className="font-medium">Created:</span> {detailModal.createdAt}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
