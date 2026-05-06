import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { usePatient } from '../../lib/PatientContext';

import { useToast } from '../../components/Toast';
import ImageUploader from '../../components/ImageUploader';

export default function PatientDashboard() {
  const { patient, isLoggedIn, logout, getVault, addDocument, deleteDocument } = usePatient();

  const addToast = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [showUpload, setShowUpload] = useState(false);
  const [uploadForm, setUploadForm] = useState({ type: 'prescription', title: '', notes: '' });
  const [uploadImage, setUploadImage] = useState(null);
  const [viewDoc, setViewDoc] = useState(null);

  if (!isLoggedIn) return <Navigate to="/patient/login" replace />;

  const vault = getVault();
  const prescriptions = vault.filter(d => d.type === 'prescription');
  const bills = vault.filter(d => d.type === 'bill');
  const reports = vault.filter(d => d.type === 'report');

  const handleUpload = (e) => {
    e.preventDefault();
    if (!uploadForm.title.trim()) { addToast('Please add a title', 'error'); return; }
    if (!uploadImage) { addToast('Please upload a document image', 'error'); return; }
    addDocument({
      type: uploadForm.type,
      title: uploadForm.title,
      notes: uploadForm.notes,
      imageData: uploadImage.previewUrl,
      fileName: uploadImage.fileName,
    });
    setShowUpload(false);
    setUploadForm({ type: 'prescription', title: '', notes: '' });
    setUploadImage(null);
    addToast('Document saved to your vault');
  };

  const handleDelete = (docId) => {
    deleteDocument(docId);
    addToast('Document removed');
    if (viewDoc?.id === docId) setViewDoc(null);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'vault', label: 'My Health Vault', icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4' },
    { id: 'appointments', label: 'My Appointments', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  ];

  const docTypeIcon = (type) => {
    if (type === 'prescription') return 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z';
    if (type === 'bill') return 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z';
    return 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">Welcome back, {patient.name.split(' ')[0]}</h1>
          <p className="text-sm text-text-muted mt-1">Manage your health records, appointments, and documents</p>
        </div>
        <button onClick={logout} className="px-4 py-2 text-sm font-medium text-text-secondary border border-border rounded-lg hover:bg-surface transition-colors">
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface p-1 rounded-lg mb-6 overflow-x-auto">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === tab.id ? 'bg-surface text-primary shadow-sm' : 'text-text-muted hover:text-text-primary'
            }`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
            </svg>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-surface-card border border-border rounded-xl p-5">
              <div className="text-2xl font-bold text-primary">{prescriptions.length}</div>
              <div className="text-sm text-text-muted mt-1">Prescriptions Saved</div>
            </div>
            <div className="bg-surface-card border border-border rounded-xl p-5">
              <div className="text-2xl font-bold text-primary">{bills.length}</div>
              <div className="text-sm text-text-muted mt-1">Bills Stored</div>
            </div>
            <div className="bg-surface-card border border-border rounded-xl p-5">
              <div className="text-2xl font-bold text-primary">{reports.length}</div>
              <div className="text-sm text-text-muted mt-1">Reports Uploaded</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: 'Upload Document', desc: 'Save a prescription, bill, or report', action: () => { setActiveTab('vault'); setShowUpload(true); } },
              { title: 'Check Symptoms', desc: 'Find the right specialist', link: '/symptom-checker' },
              { title: 'Find Doctors', desc: 'Browse 1,062 verified doctors', link: '/find-doctors' },
              { title: 'Decode Prescription', desc: 'Understand your medicines', link: '/rx-decoder' },
              { title: 'Analyse Bill', desc: 'Question hidden charges', link: '/bill-breakdown' },
              { title: 'Report Issue', desc: 'Flag bad hygiene or service', link: '/report-issue' },
            ].map((item, i) => (
              item.link ? (
                <Link key={i} to={item.link}
                  className="bg-surface-card border border-border rounded-xl p-5 hover:border-cta/40 hover:shadow-sm transition-all group">
                  <h3 className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors">{item.title}</h3>
                  <p className="text-xs text-text-muted mt-1">{item.desc}</p>
                </Link>
              ) : (
                <button key={i} onClick={item.action}
                  className="bg-surface-card border border-border rounded-xl p-5 text-left hover:border-cta/40 hover:shadow-sm transition-all group">
                  <h3 className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors">{item.title}</h3>
                  <p className="text-xs text-text-muted mt-1">{item.desc}</p>
                </button>
              )
            ))}
          </div>
        </div>
      )}

      {/* Vault Tab */}
      {activeTab === 'vault' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-text-primary">My Health Vault</h2>
            <button onClick={() => setShowUpload(!showUpload)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Upload Document
            </button>
          </div>

          {/* Upload form */}
          {showUpload && (
            <form onSubmit={handleUpload} className="bg-surface-card border border-border rounded-xl p-6 space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">Document Type *</label>
                  <select value={uploadForm.type} onChange={e => setUploadForm({ ...uploadForm, type: e.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-xl text-sm bg-surface-card focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option value="prescription">Prescription</option>
                    <option value="bill">Medical Bill</option>
                    <option value="report">Lab Report / Test Result</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">Title *</label>
                  <input type="text" value={uploadForm.title} onChange={e => setUploadForm({ ...uploadForm, title: e.target.value })}
                    placeholder="e.g. Blood test report - May 2026"
                    className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Notes (optional)</label>
                <input type="text" value={uploadForm.notes} onChange={e => setUploadForm({ ...uploadForm, notes: e.target.value })}
                  placeholder="Any additional context about this document"
                  className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <ImageUploader label="Upload document image" onImageSelect={setUploadImage} />
              <div className="flex gap-3">
                <button type="submit" className="px-6 py-2.5 bg-cta text-white text-sm font-semibold rounded-lg hover:bg-cta-dark transition-colors">
                  Save to Vault
                </button>
                <button type="button" onClick={() => setShowUpload(false)} className="px-6 py-2.5 border border-border text-text-secondary text-sm font-medium rounded-lg hover:bg-surface transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Document categories */}
          {[
            { label: 'Prescriptions', items: prescriptions, type: 'prescription' },
            { label: 'Medical Bills', items: bills, type: 'bill' },
            { label: 'Reports & Test Results', items: reports, type: 'report' },
          ].map(cat => (
            <div key={cat.type}>
              <h3 className="text-sm font-semibold text-text-secondary mb-3">{cat.label} ({cat.items.length})</h3>
              {cat.items.length === 0 ? (
                <div className="bg-surface rounded-xl p-6 text-center text-sm text-text-muted">
                  No {cat.label.toLowerCase()} saved yet
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {cat.items.map(doc => (
                    <div key={doc.id} className="bg-surface-card border border-border rounded-xl overflow-hidden hover:shadow-sm transition-all">
                      {doc.imageData && (
                        <button onClick={() => setViewDoc(doc)} className="w-full">
                          <img src={doc.imageData} alt={doc.title} className="w-full h-32 object-cover" />
                        </button>
                      )}
                      <div className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="min-w-0">
                            <h4 className="text-sm font-bold text-text-primary truncate">{doc.title}</h4>
                            <p className="text-xs text-text-muted mt-0.5">{new Date(doc.uploadedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                          </div>
                          <svg className="w-4 h-4 text-text-muted flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={docTypeIcon(doc.type)} />
                          </svg>
                        </div>
                        {doc.notes && <p className="text-xs text-text-muted mt-2 line-clamp-2">{doc.notes}</p>}
                        <div className="flex gap-2 mt-3">
                          <button onClick={() => setViewDoc(doc)} className="text-xs text-primary font-medium hover:underline">View</button>
                          <button onClick={() => handleDelete(doc.id)} className="text-xs text-text-muted hover:text-primary font-medium">Delete</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Appointments Tab */}
      {activeTab === 'appointments' && (
        <div className="animate-fade-in">
          <div className="bg-surface rounded-xl p-8 text-center">
            <svg className="w-12 h-12 text-text-muted mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-sm font-semibold text-text-primary">Your appointments will appear here</h3>
            <p className="text-xs text-text-muted mt-1">Book an appointment through the Doctor Finder to get started</p>
            <Link to="/find-doctors" className="inline-block mt-4 px-6 py-2.5 bg-cta text-white text-sm font-semibold rounded-lg hover:bg-cta-dark transition-colors">
              Find Doctors
            </Link>
          </div>
        </div>
      )}

      {/* Document Viewer Modal */}
      {viewDoc && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setViewDoc(null)}>
          <div className="bg-surface-card rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-surface-card border-b border-border px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-bold text-text-primary">{viewDoc.title}</h3>
                <p className="text-xs text-text-muted">{new Date(viewDoc.uploadedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
              <button onClick={() => setViewDoc(null)} className="p-1 rounded-md hover:bg-surface">
                <svg className="w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {viewDoc.imageData && <img src={viewDoc.imageData} alt={viewDoc.title} className="w-full" />}
            {viewDoc.notes && (
              <div className="px-6 py-4 border-t border-border">
                <p className="text-sm text-text-secondary">{viewDoc.notes}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
