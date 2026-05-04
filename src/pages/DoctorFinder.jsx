import { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import DoctorCard from '../components/DoctorCard';
import AppointmentModal from '../components/AppointmentModal';
import { useToast } from '../components/Toast';
import { doctors as initialDoctors, specialistTypes } from '../lib/mockData';
import { getStoredDoctors, getStoredAppointments, setStoredAppointments } from '../lib/storage';
import { appointments as seedAppointments } from '../lib/mockData';

const ITEMS_PER_PAGE = 20;

const allLocations = ['Sonipat','Delhi NCR','Mumbai','Bangalore','Chennai','Hyderabad','Pune','Kolkata','Jaipur','Ahmedabad','Lucknow','Chandigarh','Kochi','Bhopal','Indore','Nagpur','Patna','Coimbatore','Visakhapatnam','Thiruvananthapuram'];

export default function DoctorFinder() {
  const location = useLocation();
  const [doctors] = useState(() => getStoredDoctors() || initialDoctors);
  const [search, setSearch] = useState('');
  const [specialistFilter, setSpecialistFilter] = useState(location.state?.specialty || '');
  const [locationFilter, setLocationFilter] = useState('');
  const [acceptingOnly, setAcceptingOnly] = useState(false);
  const [urgencyFilter, setUrgencyFilter] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [modalDoctor, setModalDoctor] = useState(null);
  const [page, setPage] = useState(1);
  const addToast = useToast();

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return doctors.filter((d) => {
      const matchesSearch = !q || d.name.toLowerCase().includes(q) || d.specialisation.toLowerCase().includes(q) || d.location.toLowerCase().includes(q) || (d.clinicName && d.clinicName.toLowerCase().includes(q));
      const matchesSpec = !specialistFilter || d.specialisation === specialistFilter;
      const matchesLoc = !locationFilter || d.location === locationFilter;
      const matchesAccepting = !acceptingOnly || d.acceptingPatients;
      return matchesSearch && matchesSpec && matchesLoc && matchesAccepting;
    }).sort((a, b) => {
      if (urgencyFilter === 'Emergency') {
        const aDate = a.availableSlots?.[0]?.date || '9999';
        const bDate = b.availableSlots?.[0]?.date || '9999';
        return aDate.localeCompare(bDate);
      }
      return b.overallRating - a.overallRating;
    });
  }, [doctors, search, specialistFilter, locationFilter, acceptingOnly, urgencyFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  // Reset page when filters change
  const updateFilter = (setter) => (val) => { setter(val); setPage(1); };

  const handleBookAppointment = (doctor) => setModalDoctor(doctor);
  const handleToggle = (id) => setExpandedId(expandedId === id ? null : id);

  const handleSubmitAppointment = (appointment) => {
    const existing = getStoredAppointments() || seedAppointments;
    setStoredAppointments([...existing, appointment]);
    addToast('Appointment submitted successfully');
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const maxVisible = 7;
    let start = Math.max(1, page - 3);
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);
    const pages = [];
    for (let i = start; i <= end; i++) pages.push(i);

    return (
      <div className="flex items-center justify-center gap-1 mt-8">
        <button
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page === 1}
          className="px-3 py-2 text-sm border border-border rounded-lg disabled:opacity-40 hover:bg-surface transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        {start > 1 && (
          <>
            <button onClick={() => setPage(1)} className="px-3 py-2 text-sm border border-border rounded-lg hover:bg-surface transition-colors">1</button>
            {start > 2 && <span className="px-2 text-text-muted text-sm">...</span>}
          </>
        )}
        {pages.map(p => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`px-3 py-2 text-sm rounded-lg transition-colors ${p === page ? 'bg-primary text-white' : 'border border-border hover:bg-surface'}`}
          >
            {p}
          </button>
        ))}
        {end < totalPages && (
          <>
            {end < totalPages - 1 && <span className="px-2 text-text-muted text-sm">...</span>}
            <button onClick={() => setPage(totalPages)} className="px-3 py-2 text-sm border border-border rounded-lg hover:bg-surface transition-colors">{totalPages}</button>
          </>
        )}
        <button
          onClick={() => setPage(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="px-3 py-2 text-sm border border-border rounded-lg disabled:opacity-40 hover:bg-surface transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    );
  };

  return (
    <div>
      <div className="bg-primary text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-2xl sm:text-3xl font-bold">Verified Doctor Ratings</h1>
          <p className="mt-2 text-sm opacity-90">Every doctor rated by certified independent evaluators on 5 objective parameters.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Rating explanation */}
        <div className="bg-primary-light rounded-xl p-5 mb-6">
          <h3 className="text-sm font-semibold text-text-primary mb-3">How doctors are rated</h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {['Hygiene & Cleanliness', 'Medical Qualification', 'Communication Quality', 'Wait Time', 'Treatment Outcomes'].map((p) => (
              <div key={p} className="text-xs text-text-secondary bg-white/50 rounded-lg px-3 py-2 text-center">{p}</div>
            ))}
          </div>
          <p className="text-xs text-text-muted mt-3">Scores are based on unannounced evaluations conducted by certified HealthID inspectors every six months. Not based on public reviews.</p>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
          <input
            type="text" placeholder="Search by name, specialist, or area" value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
          <select value={urgencyFilter} onChange={(e) => updateFilter(setUrgencyFilter)(e.target.value)}
            className="px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
            <option value="">Any Urgency</option>
            <option value="Low">Low — Available This Week</option>
            <option value="Moderate">Moderate — Next 3 Days</option>
            <option value="High">High — Within 48 Hours</option>
            <option value="Emergency">Emergency — Immediate</option>
          </select>
          <select value={specialistFilter} onChange={(e) => updateFilter(setSpecialistFilter)(e.target.value)}
            className="px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
            <option value="">All Specialists</option>
            {specialistTypes.map((s) => <option key={s.name} value={s.name}>{s.name}</option>)}
          </select>
          <select value={locationFilter} onChange={(e) => updateFilter(setLocationFilter)(e.target.value)}
            className="px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
            <option value="">All Locations</option>
            {allLocations.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
          <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
            <input type="checkbox" checked={acceptingOnly} onChange={(e) => { setAcceptingOnly(e.target.checked); setPage(1); }}
              className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
            Accepting new patients only
          </label>
        </div>

        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-text-muted">Showing {filtered.length} doctors (page {page} of {totalPages || 1})</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {paginated.map((doctor) => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              expanded={expandedId === doctor.id}
              onToggle={handleToggle}
              onBookAppointment={handleBookAppointment}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-text-muted">No doctors match your filters.</p>
          </div>
        )}

        {renderPagination()}
      </div>

      {modalDoctor && (
        <AppointmentModal
          doctor={modalDoctor}
          onClose={() => setModalDoctor(null)}
          onSubmit={handleSubmitAppointment}
        />
      )}
    </div>
  );
}
