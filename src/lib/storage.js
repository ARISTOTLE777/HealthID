const STORAGE_KEYS = {
  ADMIN_SESSION: 'healthid_admin_session',
  CHECKLIST_PROGRESS: 'healthid_checklist_progress',
  APPOINTMENTS: 'healthid_appointments',
  DOCTORS: 'healthid_doctors',
};

export function getAdminSession() {
  try {
    const session = localStorage.getItem(STORAGE_KEYS.ADMIN_SESSION);
    return session ? JSON.parse(session) : null;
  } catch { return null; }
}

export function setAdminSession(session) {
  localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, JSON.stringify(session));
}

export function clearAdminSession() {
  localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
}

export function getChecklistProgress() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CHECKLIST_PROGRESS);
    return data ? JSON.parse(data) : null;
  } catch { return null; }
}

export function setChecklistProgress(progress) {
  localStorage.setItem(STORAGE_KEYS.CHECKLIST_PROGRESS, JSON.stringify({
    ...progress,
    savedAt: new Date().toISOString(),
  }));
}

export function getStoredAppointments() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
    return data ? JSON.parse(data) : null;
  } catch { return null; }
}

export function setStoredAppointments(appointments) {
  localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
}

export function getStoredDoctors() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.DOCTORS);
    return data ? JSON.parse(data) : null;
  } catch { return null; }
}

export function setStoredDoctors(doctors) {
  localStorage.setItem(STORAGE_KEYS.DOCTORS, JSON.stringify(doctors));
}
