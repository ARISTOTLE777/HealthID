export default function UrgencySelector({ value, onChange }) {
  const levels = [
    { key: 'Low', label: 'Low', desc: 'Mild discomfort, can wait a few days', color: 'bg-success text-white', ring: 'ring-success' },
    { key: 'Moderate', label: 'Moderate', desc: 'Should see a doctor this week', color: 'bg-warning text-white', ring: 'ring-warning' },
    { key: 'High', label: 'High', desc: 'Need an appointment within 48 hours', color: 'bg-cta text-white', ring: 'ring-cta' },
    { key: 'Emergency', label: 'Emergency', desc: 'Severe symptoms, consider A&E now', color: 'bg-alert text-white', ring: 'ring-alert' },
  ];

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-text-primary">How urgent are your symptoms?</label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {levels.map((level) => {
          const isSelected = value === level.key;
          const isEmergency = level.key === 'Emergency' && isSelected;
          return (
            <button
              key={level.key}
              type="button"
              onClick={() => onChange(level.key)}
              className={`relative p-3 rounded-xl border-2 text-left transition-all ${
                isSelected
                  ? `${level.color} border-transparent shadow-md ${isEmergency ? 'animate-pulse-border' : ''}`
                  : 'bg-surface-card border-border text-text-secondary hover:border-teal/40'
              }`}
            >
              <span className={`block text-sm font-bold ${isSelected ? '' : 'text-text-primary'}`}>{level.label}</span>
              <span className={`block text-xs mt-1 ${isSelected ? 'opacity-90' : 'text-text-muted'}`}>{level.desc}</span>
            </button>
          );
        })}
      </div>

      {value === 'Emergency' && (
        <div className="bg-alert text-white p-4 rounded-lg flex items-start gap-3 animate-fade-in">
          <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M12 3a9 9 0 100 18 9 9 0 000-18z" />
          </svg>
          <div>
            <p className="font-bold text-sm">Your symptoms may require emergency care.</p>
            <p className="text-sm mt-1 opacity-90">Please go to the nearest emergency department or call 112 immediately. Do not wait for an appointment.</p>
          </div>
        </div>
      )}
    </div>
  );
}
