import { useState } from 'react';
import { useToast } from '../components/Toast';
import { usePatient } from '../lib/PatientContext';

const issueTypes = [
  { value: 'hygiene', label: 'Bad Hygiene', desc: 'Unclean facility, dirty equipment, poor sanitation' },
  { value: 'service', label: 'Poor Service', desc: 'Rude staff, long unexplained waits, dismissive behaviour' },
  { value: 'billing', label: 'Billing Fraud', desc: 'Hidden charges, inflated bills, duplicate charges' },
  { value: 'misdiagnosis', label: 'Wrong Treatment', desc: 'Incorrect diagnosis, unnecessary procedures suggested' },
  { value: 'overcharging', label: 'Overcharging', desc: 'Charging above published rate card, no itemised bill' },
  { value: 'other', label: 'Other', desc: 'Any other issue not listed above' },
];

export default function ReportIssue() {
  const { isLoggedIn, patient } = usePatient();
  const addToast = useToast();
  const [form, setForm] = useState({
    type: '', clinicName: '', doctorName: '', city: '', date: '', description: '', anonymous: true,
  });
  const [submitted, setSubmitted] = useState(false);
  const [reports, setReports] = useState(() => {
    try { return JSON.parse(localStorage.getItem('healthid_reports') || '[]'); } catch { return []; }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.type) { addToast('Please select an issue type', 'error'); return; }
    if (!form.clinicName.trim()) { addToast('Please enter the clinic/hospital name', 'error'); return; }
    if (!form.description.trim()) { addToast('Please describe the issue', 'error'); return; }

    const report = {
      id: `RPT-${Date.now()}`,
      ...form,
      patientId: isLoggedIn ? patient.id : 'anonymous',
      patientName: form.anonymous ? 'Anonymous' : (patient?.name || 'Unknown'),
      createdAt: new Date().toISOString(),
      status: 'submitted',
    };

    const updated = [report, ...reports];
    setReports(updated);
    localStorage.setItem('healthid_reports', JSON.stringify(updated));
    setSubmitted(true);
    addToast('Report submitted successfully');
  };

  if (submitted) {
    return (
      <div>
        <div className="bg-primary text-white py-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-display text-2xl sm:text-3xl font-bold">Report Submitted</h1>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-surface-card border border-border rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="font-display text-xl font-bold text-text-primary mb-2">Thank you for speaking up</h2>
            <p className="text-sm text-text-secondary max-w-md mx-auto">
              Your report has been logged. Every report helps improve healthcare standards across India. Patient feedback is the foundation of accountability.
            </p>
            <button onClick={() => { setSubmitted(false); setForm({ type: '', clinicName: '', doctorName: '', city: '', date: '', description: '', anonymous: true }); }}
              className="mt-6 px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark transition-colors">
              File Another Report
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-primary text-white py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-2xl sm:text-3xl font-bold">Report a Healthcare Issue</h1>
          <p className="mt-2 text-sm opacity-90">Bad hygiene? Poor service? Flag it. Patients deserve better.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Issue type selector */}
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-3">What type of issue? *</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {issueTypes.map(issue => (
              <button key={issue.value} onClick={() => setForm({ ...form, type: issue.value })}
                className={`p-4 text-left border rounded-xl transition-all ${
                  form.type === issue.value ? 'border-primary bg-primary-light' : 'border-border hover:border-primary/40'
                }`}>
                <h4 className="text-sm font-bold text-text-primary">{issue.label}</h4>
                <p className="text-xs text-text-muted mt-1">{issue.desc}</p>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Clinic / Hospital Name *</label>
              <input type="text" value={form.clinicName} onChange={e => setForm({ ...form, clinicName: e.target.value })}
                placeholder="Enter the name of the facility"
                className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Doctor Name (optional)</label>
              <input type="text" value={form.doctorName} onChange={e => setForm({ ...form, doctorName: e.target.value })}
                placeholder="If applicable"
                className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">City</label>
              <input type="text" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })}
                placeholder="City where the facility is located"
                className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Date of Visit</label>
              <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
                className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Describe the issue in detail *</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={5}
              placeholder="What happened? Be as specific as possible — this helps us and others."
              className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.anonymous} onChange={e => setForm({ ...form, anonymous: e.target.checked })}
              className="w-4 h-4 text-primary border-border rounded focus:ring-primary" />
            <span className="text-sm text-text-secondary">Submit anonymously (your identity will not be linked to this report)</span>
          </label>
          <button type="submit" className="w-full py-3 bg-cta text-white font-semibold rounded-lg hover:bg-cta-dark transition-colors">
            Submit Report
          </button>
        </form>
      </div>
    </div>
  );
}
