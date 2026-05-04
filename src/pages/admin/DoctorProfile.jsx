import { useState } from 'react';
import { useToast } from '../../components/Toast';
import { getAdminSession, getStoredDoctors, setStoredDoctors } from '../../lib/storage';
import { doctors as initialDoctors } from '../../lib/mockData';

export default function DoctorProfile() {
  const session = getAdminSession();
  const addToast = useToast();
  const allDoctors = getStoredDoctors() || initialDoctors;
  const doctorData = allDoctors.find(d => d.id === session?.doctorId);

  const [form, setForm] = useState({
    name: doctorData?.name || '',
    specialisation: doctorData?.specialisation || '',
    clinicName: doctorData?.clinicName || '',
    address: doctorData?.address || '',
    phone: doctorData?.phone || '',
    bio: doctorData?.bio || '',
    acceptingPatients: doctorData?.acceptingPatients ?? true,
  });

  const handleSave = () => {
    const updated = allDoctors.map(d =>
      d.id === session?.doctorId ? { ...d, ...form } : d
    );
    setStoredDoctors(updated);
    addToast('Profile updated successfully');
  };

  if (!doctorData) return <div className="p-8 text-text-muted">Doctor profile not found.</div>;

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-text-primary">My Profile</h1>

      <div className="bg-surface-card border border-border rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Name</label>
            <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
              className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Specialisation</label>
            <input type="text" value={form.specialisation} onChange={e => setForm({...form, specialisation: e.target.value})}
              className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Clinic Name</label>
            <input type="text" value={form.clinicName} onChange={e => setForm({...form, clinicName: e.target.value})}
              className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Phone</label>
            <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
              className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Address</label>
          <input type="text" value={form.address} onChange={e => setForm({...form, address: e.target.value})}
            className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Bio</label>
          <textarea rows={4} value={form.bio} onChange={e => setForm({...form, bio: e.target.value})}
            className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" />
        </div>
        <label className="flex items-center gap-3 cursor-pointer">
          <div className={`relative w-11 h-6 rounded-full transition-colors ${form.acceptingPatients ? 'bg-success' : 'bg-gray-300'}`}
            onClick={() => setForm({...form, acceptingPatients: !form.acceptingPatients})}>
            <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-surface rounded-full shadow transition-transform ${form.acceptingPatients ? 'translate-x-5' : ''}`} />
          </div>
          <span className="text-sm font-medium text-text-primary">Accepting New Patients</span>
        </label>
        <button onClick={handleSave} className="px-6 py-2.5 bg-cta text-white font-semibold rounded-lg hover:bg-cta-dark transition-colors">
          Save Changes
        </button>
      </div>

      {/* Evaluation scores - read only */}
      <div className="bg-surface-card border border-border rounded-xl p-6">
        <h3 className="text-sm font-semibold text-text-primary mb-4">Your Evaluation Scores</h3>
        <div className="space-y-3">
          {[
            ['Hygiene & Cleanliness', doctorData.ratings.hygiene],
            ['Medical Qualification', doctorData.ratings.qualification],
            ['Communication Quality', doctorData.ratings.communication],
            ['Wait Time', doctorData.ratings.waitTime],
            ['Treatment Outcomes', doctorData.ratings.outcomes],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center gap-3">
              <span className="text-xs font-medium text-text-secondary w-40">{label}</span>
              <div className="flex-1 h-2 bg-primary-light rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${(value / 5) * 100}%` }} />
              </div>
              <span className="text-xs font-bold text-text-primary w-8 text-right">{value.toFixed(1)}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-text-muted mt-3">Scores are updated after each HealthID evaluation cycle. {doctorData.evaluationCount} evaluations completed.</p>
      </div>
    </div>
  );
}
