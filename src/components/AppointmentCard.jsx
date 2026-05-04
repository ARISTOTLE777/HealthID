const urgencyColors = {
  Low: 'bg-green-50 text-success border-green-200',
  Moderate: 'bg-amber-50 text-warning border-amber-200',
  High: 'bg-orange-50 text-orange-600 border-orange-200',
  Emergency: 'bg-alert/10 text-primary border-alert/30',
};

const statusColors = {
  Pending: 'bg-amber-50 text-warning',
  Confirmed: 'bg-green-50 text-success',
  Completed: 'bg-blue-50 text-blue-600',
  Cancelled: 'bg-gray-100 text-gray-500',
};

export default function AppointmentCard({ appointment, onConfirm, onCancel, onComplete, onViewDetails }) {
  return (
    <div className="bg-surface-card border border-border rounded-lg p-4 hover:shadow-sm transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-sm font-semibold text-text-primary">{appointment.patientName}</h4>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${urgencyColors[appointment.urgency]}`}>
              {appointment.urgency}
            </span>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusColors[appointment.status]}`}>
              {appointment.status}
            </span>
          </div>
          <p className="text-xs text-text-muted mt-1">{appointment.date} at {appointment.time}</p>
          <p className="text-xs text-text-secondary mt-1 truncate">{appointment.reason}</p>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {appointment.status === 'Pending' && (
            <>
              <button onClick={() => onConfirm(appointment.id)} className="px-2.5 py-1.5 text-[10px] font-semibold bg-success text-white rounded-md hover:opacity-90 transition-opacity">
                Confirm
              </button>
              <button onClick={() => onCancel(appointment.id)} className="px-2.5 py-1.5 text-[10px] font-semibold bg-gray-200 text-gray-600 rounded-md hover:bg-gray-300 transition-colors">
                Cancel
              </button>
            </>
          )}
          {appointment.status === 'Confirmed' && (
            <button onClick={() => onComplete(appointment.id)} className="px-2.5 py-1.5 text-[10px] font-semibold bg-blue-500 text-white rounded-md hover:opacity-90 transition-opacity">
              Complete
            </button>
          )}
          <button onClick={() => onViewDetails(appointment)} className="px-2.5 py-1.5 text-[10px] font-semibold border border-border text-text-secondary rounded-md hover:bg-surface transition-colors">
            View
          </button>
        </div>
      </div>
    </div>
  );
}
