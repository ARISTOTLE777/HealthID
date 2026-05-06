import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { usePatient } from '../lib/PatientContext';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { isLoggedIn, patient } = usePatient();

  const isAdmin = location.pathname.startsWith('/admin');
  if (isAdmin) return null;

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/journey', label: '✦ Journey', highlight: true },
    { path: '/symptom-checker', label: 'Symptoms' },
    { path: '/find-doctors', label: 'Doctors' },
    { path: '/checklist', label: 'Checklist' },
    { path: '/rx-decoder', label: 'Rx Decoder' },
    { path: '/bill-breakdown', label: 'Bill Analysis' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-primary border-b border-primary-dark/50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0 group">
            <svg className="w-7 h-7 text-teal group-hover:text-teal-light transition-colors" viewBox="0 0 32 32" fill="none">
              <rect x="2" y="2" width="28" height="28" rx="6" stroke="currentColor" strokeWidth="2.5"/>
              <path d="M16 8v16M8 16h16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            <span className="font-display text-lg font-bold text-white group-hover:text-teal transition-colors whitespace-nowrap">HealthID</span>
          </Link>

          {/* Desktop links — single-line, compact */}
          <div className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-2.5 py-1.5 text-[13px] font-medium rounded-md transition-colors whitespace-nowrap ${
                  link.highlight
                    ? location.pathname === link.path
                      ? 'text-primary bg-teal font-bold'
                      : 'text-teal border border-teal/40 hover:bg-teal hover:text-primary font-bold'
                    : location.pathname === link.path
                    ? 'text-teal bg-primary-dark/50'
                    : 'text-white/80 hover:text-white hover:bg-primary-dark/30'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side: Login only (no language toggle) */}
          <div className="hidden lg:flex items-center gap-2">
            {isLoggedIn ? (
              <Link to="/patient/dashboard"
                className="flex items-center gap-2 px-4 py-1.5 text-sm font-medium text-white border border-teal rounded-lg hover:bg-teal hover:text-primary transition-colors whitespace-nowrap">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {patient.name.split(' ')[0]}
              </Link>
            ) : (
              <>
                <Link to="/admin/login"
                  className="px-3 py-1.5 text-[13px] font-medium text-white/80 hover:text-white transition-colors whitespace-nowrap">
                  Doctor Login
                </Link>
                <Link to="/patient/login"
                  className="px-4 py-1.5 text-[13px] font-medium text-white border border-teal rounded-lg hover:bg-teal hover:text-primary-dark transition-colors whitespace-nowrap">
                  Patient Login
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-md text-white/80 hover:text-white hover:bg-primary-dark/50 transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-primary-dark/50 bg-primary shadow-inner">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path} onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                  location.pathname === link.path ? 'text-teal bg-primary-dark/50' : 'text-white/80 hover:text-white hover:bg-primary-dark/30'
                }`}>
                {link.label}
              </Link>
            ))}

            {/* Mobile login */}
            {isLoggedIn ? (
              <Link to="/patient/dashboard" onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 text-sm font-medium text-white border border-teal rounded-lg text-center mt-2">
                My Account
              </Link>
            ) : (
              <div className="space-y-2 mt-2">
                <Link to="/admin/login" onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 text-sm font-medium text-white/80 border border-transparent rounded-lg text-center hover:text-white hover:bg-primary-dark/30 transition-colors">
                  Doctor Login
                </Link>
                <Link to="/patient/login" onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 text-sm font-medium text-white border border-teal rounded-lg text-center hover:bg-teal hover:text-primary-dark transition-colors">
                  Patient Login
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
