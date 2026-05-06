import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Loader from './components/Loader';
import Home from './pages/Home';
import SymptomChecker from './pages/SymptomChecker';
import DoctorFinder from './pages/DoctorFinder';
import PreConsultChecklist from './pages/PreConsultChecklist';
import PrescriptionDecoder from './pages/PrescriptionDecoder';
import BillBreakdown from './pages/BillBreakdown';
import BookAppointment from './pages/BookAppointment';
import TreatmentAware from './pages/TreatmentAware';
import ReportIssue from './pages/ReportIssue';
import PostConsultChat from './pages/PostConsultChat';
import PatientJourney from './pages/PatientJourney';
import PatientLogin from './pages/patient/PatientLogin';
import PatientDashboard from './pages/patient/PatientDashboard';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AppointmentManager from './pages/admin/AppointmentManager';
import DoctorProfile from './pages/admin/DoctorProfile';
import PatientMessages from './pages/admin/PatientMessages';
import AdminSettings from './pages/admin/AdminSettings';
import { Link } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="font-display text-6xl font-bold text-primary">404</h1>
        <p className="text-text-secondary mt-4 text-lg">Page not found</p>
        <Link to="/" className="inline-block mt-6 px-6 py-3 bg-cta text-white font-semibold rounded-lg hover:bg-cta-dark transition-colors">
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default function App() {
  const [isAppLoading, setIsAppLoading] = useState(true);

  useEffect(() => {
    // Simulate initial data fetching or app initialization
    const timer = setTimeout(() => {
      setIsAppLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isAppLoading) {
    return <Loader />;
  }

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/symptom-checker" element={<SymptomChecker />} />
        <Route path="/find-doctors" element={<DoctorFinder />} />
        <Route path="/checklist" element={<PreConsultChecklist />} />
        <Route path="/rx-decoder" element={<PrescriptionDecoder />} />
        <Route path="/bill-breakdown" element={<BillBreakdown />} />
        <Route path="/book-appointment" element={<BookAppointment />} />
        <Route path="/treatment-aware" element={<TreatmentAware />} />
        <Route path="/report-issue" element={<ReportIssue />} />
        <Route path="/post-consult-chat" element={<PostConsultChat />} />
        <Route path="/journey" element={<PatientJourney />} />
        <Route path="/patient/login" element={<PatientLogin />} />
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="appointments" element={<AppointmentManager />} />
          <Route path="profile" element={<DoctorProfile />} />
          <Route path="messages" element={<PatientMessages />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
