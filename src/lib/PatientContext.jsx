import { createContext, useContext, useState, useEffect } from 'react';

const PATIENT_KEY = 'healthid_patient_session';
const PATIENTS_DB = 'healthid_patients_db';
const VAULT_KEY = 'healthid_document_vault';

const PatientContext = createContext(null);

export function PatientProvider({ children }) {
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(PATIENT_KEY);
      if (saved) setPatient(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  const signup = (data) => {
    const patients = JSON.parse(localStorage.getItem(PATIENTS_DB) || '[]');
    if (patients.find(p => p.phone === data.phone)) {
      throw new Error('An account with this phone number already exists');
    }
    const newPatient = {
      id: `PAT-${Date.now()}`,
      name: data.name,
      phone: data.phone,
      email: data.email || '',
      password: data.password,
      city: data.city || '',
      state: data.state || '',
      language: data.language || 'en',
      createdAt: new Date().toISOString(),
    };
    patients.push(newPatient);
    localStorage.setItem(PATIENTS_DB, JSON.stringify(patients));
    const session = { ...newPatient };
    delete session.password;
    setPatient(session);
    localStorage.setItem(PATIENT_KEY, JSON.stringify(session));
    return session;
  };

  const login = (phone, password) => {
    const patients = JSON.parse(localStorage.getItem(PATIENTS_DB) || '[]');
    const found = patients.find(p => p.phone === phone && p.password === password);
    if (!found) throw new Error('Invalid phone number or password');
    const session = { ...found };
    delete session.password;
    setPatient(session);
    localStorage.setItem(PATIENT_KEY, JSON.stringify(session));
    return session;
  };

  const logout = () => {
    setPatient(null);
    localStorage.removeItem(PATIENT_KEY);
  };

  const updateProfile = (updates) => {
    const patients = JSON.parse(localStorage.getItem(PATIENTS_DB) || '[]');
    const idx = patients.findIndex(p => p.id === patient.id);
    if (idx >= 0) {
      patients[idx] = { ...patients[idx], ...updates };
      localStorage.setItem(PATIENTS_DB, JSON.stringify(patients));
    }
    const updated = { ...patient, ...updates };
    setPatient(updated);
    localStorage.setItem(PATIENT_KEY, JSON.stringify(updated));
  };

  // Document vault operations
  const getVault = () => {
    try {
      const all = JSON.parse(localStorage.getItem(VAULT_KEY) || '{}');
      return all[patient?.id] || [];
    } catch { return []; }
  };

  const addDocument = (doc) => {
    const all = JSON.parse(localStorage.getItem(VAULT_KEY) || '{}');
    if (!all[patient.id]) all[patient.id] = [];
    const newDoc = {
      id: `DOC-${Date.now()}`,
      ...doc,
      uploadedAt: new Date().toISOString(),
    };
    all[patient.id].unshift(newDoc);
    localStorage.setItem(VAULT_KEY, JSON.stringify(all));
    return newDoc;
  };

  const deleteDocument = (docId) => {
    const all = JSON.parse(localStorage.getItem(VAULT_KEY) || '{}');
    if (all[patient.id]) {
      all[patient.id] = all[patient.id].filter(d => d.id !== docId);
      localStorage.setItem(VAULT_KEY, JSON.stringify(all));
    }
  };

  return (
    <PatientContext.Provider value={{
      patient, signup, login, logout, updateProfile,
      getVault, addDocument, deleteDocument,
      isLoggedIn: !!patient,
    }}>
      {children}
    </PatientContext.Provider>
  );
}

export function usePatient() {
  return useContext(PatientContext);
}
