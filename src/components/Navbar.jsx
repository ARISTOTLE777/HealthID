import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useI18n, languages } from '../lib/i18n';
import { usePatient } from '../lib/PatientContext';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const location = useLocation();
  const { lang, setLang, t } = useI18n();
  const { isLoggedIn, patient } = usePatient();

  const isAdmin = location.pathname.startsWith('/admin');
  if (isAdmin) return null;

  const navLinks = [
    { path: '/', label: t('home') },
    { path: '/symptom-checker', label: t('symptomChecker') },
    { path: '/find-doctors', label: t('findDoctors') },
    { path: '/checklist', label: t('checklist') },
    { path: '/rx-decoder', label: t('rxDecoder') },
    { path: '/bill-breakdown', label: t('billBreakdown') },
  ];

  const currentLang = languages.find(l => l.code === lang);

  return (
    <nav className="sticky top-0 z-50 bg-primary border-b border-primary-dark/50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0 group">
            <svg className="w-8 h-8 text-teal group-hover:text-teal-light transition-colors" viewBox="0 0 32 32" fill="none">
              <rect x="2" y="2" width="28" height="28" rx="6" stroke="currentColor" strokeWidth="2.5"/>
              <path d="M16 8v16M8 16h16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            <div>
              <span className="font-display text-lg font-bold text-white group-hover:text-teal transition-colors">HealthID</span>
              <span className="hidden sm:block text-[10px] text-teal-light/80 leading-none -mt-0.5">{t('tagline')}</span>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  location.pathname === link.path
                    ? 'text-teal bg-primary-dark/50'
                    : 'text-white/80 hover:text-white hover:bg-primary-dark/30'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side: Language + Login */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Language toggle */}
            <div className="relative">
              <button onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white/80 rounded-md hover:bg-primary-dark/30 hover:text-white transition-colors"
                title="Change language">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                <span className="text-xs">{currentLang?.native || 'EN'}</span>
                <svg className={`w-3 h-3 transition-transform ${langOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {langOpen && (
                <>
                  <div className="fixed inset-0" onClick={() => setLangOpen(false)} />
                  <div className="absolute right-0 top-full mt-1 bg-surface border border-border rounded-xl shadow-lg py-2 w-48 z-50 animate-fade-in">
                    {languages.map(l => (
                      <button key={l.code} onClick={() => { setLang(l.code); setLangOpen(false); }}
                        className={`w-full px-4 py-2 text-left text-sm flex items-center justify-between hover:bg-surface-card transition-colors ${
                          lang === l.code ? 'text-primary font-medium bg-primary-light/30' : 'text-text-secondary'
                        }`}>
                        <span>{l.native}</span>
                        <span className="text-xs text-text-muted">{l.label}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Patient login / account */}
            {isLoggedIn ? (
              <Link to="/patient/dashboard"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white border border-teal rounded-lg hover:bg-teal hover:text-primary transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {patient.name.split(' ')[0]}
              </Link>
            ) : (
              <>
                <Link to="/admin/login"
                  className="px-3 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors">
                  {t('doctorLogin')}
                </Link>
                <Link to="/patient/login"
                  className="px-4 py-2 text-sm font-medium text-white border border-teal rounded-lg hover:bg-teal hover:text-primary-dark transition-colors">
                  {t('patientLogin')}
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

            {/* Mobile language picker */}
            <div className="pt-2 border-t border-primary-dark/50 mt-2">
              <p className="px-3 py-1 text-xs font-semibold text-white/50 uppercase">Language</p>
              <div className="flex flex-wrap gap-1.5 px-3 py-2">
                {languages.map(l => (
                  <button key={l.code} onClick={() => { setLang(l.code); }}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                      lang === l.code ? 'bg-teal text-primary-dark' : 'bg-primary-dark/30 text-white/80 hover:bg-primary-dark/60'
                    }`}>
                    {l.native}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile login */}
            {isLoggedIn ? (
              <Link to="/patient/dashboard" onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 text-sm font-medium text-white border border-teal rounded-lg text-center mt-2">
                {t('myAccount')}
              </Link>
            ) : (
              <div className="space-y-2 mt-2">
                <Link to="/admin/login" onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 text-sm font-medium text-white/80 border border-transparent rounded-lg text-center hover:text-white hover:bg-primary-dark/30 transition-colors">
                  {t('doctorLogin')}
                </Link>
                <Link to="/patient/login" onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 text-sm font-medium text-white border border-teal rounded-lg text-center hover:bg-teal hover:text-primary-dark transition-colors">
                  {t('patientLogin')}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
