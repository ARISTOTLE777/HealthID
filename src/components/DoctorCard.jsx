import RatingBar from './RatingBar';

export default function DoctorCard({ doctor, onBookAppointment, expanded, onToggle }) {
  const initials = doctor.name.replace('Dr. ', '').split(' ').map(n => n[0]).join('');
  const starCount = Math.round(doctor.overallRating);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(doctor.clinicName + ', ' + doctor.address)}`;

  return (
    <div className="bg-surface-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-all">
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-display text-base font-bold text-text-primary">{doctor.name}</h3>
              {doctor.verified && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary-light text-primary text-[10px] font-semibold rounded-full">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                  Verified
                </span>
              )}
            </div>
            <p className="text-sm text-primary font-medium">{doctor.specialisation}</p>
            <p className="text-xs text-text-muted mt-1 flex items-center gap-1">
              {doctor.clinicName} — {doctor.location}
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="inline-flex items-center text-primary hover:text-primary-dark transition-colors" title="View on Google Maps">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </a>
            </p>

            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-0.5">
                {[1,2,3,4,5].map(s => (
                  <span key={s} className={`star ${s <= starCount ? 'star-filled' : 'star-empty'}`} />
                ))}
              </div>
              <span className="text-sm font-bold text-text-primary">{doctor.overallRating.toFixed(1)}</span>
              <span className="text-xs text-text-muted">({doctor.evaluationCount} evaluations)</span>
            </div>

            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {doctor.acceptingPatients && (
                <span className="inline-flex items-center px-2 py-0.5 bg-green-50 text-success text-[10px] font-semibold rounded-full border border-green-200">
                  Accepting Patients
                </span>
              )}
              {doctor.availableSlots?.[0] && (
                <span className="text-[10px] text-text-muted">
                  Next available: {doctor.availableSlots[0].date}
                </span>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={() => onToggle(doctor.id)}
          className="mt-3 text-sm text-primary font-medium hover:underline flex items-center gap-1 transition-colors"
        >
          {expanded ? 'Hide Details' : 'View Details'}
          <svg className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {expanded && (
        <div className="border-t border-border p-5 bg-surface animate-fade-in">
          <p className="text-sm text-text-secondary mb-4">{doctor.bio}</p>

          <div className="space-y-2 mb-4">
            <h4 className="text-sm font-semibold text-text-primary">Evaluation Scores</h4>
            <RatingBar label="Hygiene & Cleanliness" value={doctor.ratings.hygiene} />
            <RatingBar label="Medical Qualification" value={doctor.ratings.qualification} />
            <RatingBar label="Communication Quality" value={doctor.ratings.communication} />
            <RatingBar label="Wait Time" value={doctor.ratings.waitTime} />
            <RatingBar label="Treatment Outcomes" value={doctor.ratings.outcomes} />
          </div>

          <div className="text-xs text-text-muted space-y-1 mb-4">
            <p className="flex items-start gap-1">
              <span className="font-medium text-text-secondary">Address:</span>
              <span>{doctor.address}</span>
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:text-primary-dark transition-colors font-medium ml-1 whitespace-nowrap">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                Open in Maps
              </a>
            </p>
            <p><span className="font-medium text-text-secondary">Phone:</span> {doctor.phone}</p>
          </div>

          {doctor.acceptingPatients && (
            <button
              onClick={() => onBookAppointment(doctor)}
              className="w-full py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark transition-colors"
            >
              Request Appointment
            </button>
          )}
        </div>
      )}
    </div>
  );
}
