import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import drConsultIllustration from '../assets/dr_consult_illustration.svg';

const stats = [
  { value: '1.4B',   label: 'Patients in India',              icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
  { value: '73%',    label: 'Rely on Google for health info',  icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
  { value: '0',      label: 'Conflicts of interest',           icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
  { value: '1,062',  label: 'Verified Doctors',                icon: 'M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16' },
];

const journeyPhases = [
  { phase: 'Before Visit', color: '#2BB3B1', bg: '#E8F8F8', steps: ['Symptom Checker', 'Find a Doctor', 'Pre-Consult Checklist'] },
  { phase: 'Appointment', color: '#7C3AED', bg: '#F3EEF9', steps: ['Book & Attend'] },
  { phase: 'After Visit', color: '#E55C13', bg: '#FCF0EA', steps: ['Prescription Decoder', 'Bill Breakdown', 'Post-Consult Chat', 'Treatment Awareness'] },
];

const features = [
  { title: 'Symptom Checker',      desc: 'Find the right specialist based on your symptoms.',          path: '/symptom-checker',    icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
  { title: 'Find Doctors',         desc: 'Browse verified doctors rated on objective parameters.',      path: '/find-doctors',        icon: 'M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16' },
  { title: 'Pre-Consult Checklist', desc: 'Get personalised questions to ask your doctor.',             path: '/checklist',           icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
  { title: 'Rx Decoder',           desc: 'Understand every medicine in plain language.',                path: '/rx-decoder',          icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' },
  { title: 'Bill Breakdown',       desc: 'Know what you paid for and what to question.',               path: '/bill-breakdown',      icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z' },
  { title: 'Treatment Aware',      desc: 'Doctor visit? Medication? Just rest? A smart tool to figure out the approach.', path: '/treatment-aware', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477-4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
  { title: 'Report Issue',         desc: 'Flag bad hygiene, poor service, or billing problems at any clinic.', path: '/report-issue', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
  { title: '7-Day Chat',           desc: 'Post-consult follow-up chat. Ask anything within the window.', path: '/post-consult-chat', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
  { title: 'My Health Vault',      desc: 'Store prescriptions, bills, and reports securely for future reference.', path: '/patient/dashboard', icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4' },
];

export default function Home() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    navigate('/symptom-checker', { state: { query } });
  };

  return (
    <div className="relative">

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="bg-primary overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">

            {/* Left — Text + Search */}
            <div className="flex-1 min-w-0">
              {/* Platform label */}
              <span className="animate-fade-up inline-block mb-5 px-3 py-1 text-xs font-bold tracking-widest uppercase rounded-full bg-teal/20 text-teal border border-teal/40">
                India's Health Intelligence Platform
              </span>

              <h1 className="animate-fade-up animate-fade-up-delay-1 font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight">
                Your Health,<br />
                <span className="text-teal">Your Rights.</span>
              </h1>

              <p className="animate-fade-up animate-fade-up-delay-2 mt-5 text-base sm:text-lg text-white/75 leading-relaxed max-w-lg">
                Find the right specialist, verify your doctor, and walk into every consultation fully prepared.
              </p>

              {/* Search bar */}
              <Link
                to="/journey"
                className="animate-fade-up animate-fade-up-delay-3 mt-8 inline-flex items-center gap-2 px-8 py-4 bg-cta text-white text-lg font-semibold rounded-xl shadow-xl hover:bg-cta-dark hover:-translate-y-1 transition-all duration-200"
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Start Your Health Journey
              </Link>


              {/* Quick chips */}
              <div className="animate-fade-up animate-fade-up-delay-4 mt-4 flex flex-wrap gap-2">
                {['Fever', 'Chest pain', 'Headache', 'Diabetes', 'Skin rash'].map(term => (
                  <button
                    key={term}
                    onClick={() => navigate('/symptom-checker', { state: { query: term } })}
                    className="px-3 py-1 text-xs font-medium rounded-full bg-white/10 text-white/80 hover:bg-white/20 border border-white/20 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            {/* Right — Illustration (fade-down entrance) */}
            <div className="hidden lg:flex flex-shrink-0 w-[500px] xl:w-[600px] items-center justify-center animate-fade-down">
              {/* Decorative teal blob behind illustration */}
              <div className="relative transform scale-[2] origin-center translate-x-8">
                <div className="absolute -inset-8 rounded-full bg-teal/15 blur-3xl" />
                <img
                  src={drConsultIllustration}
                  alt="Doctor consultation illustration"
                  className="relative w-full drop-shadow-2xl"
                  draggable={false}
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── STATS STRIP ──────────────────────────────────────────────── */}
      <section className="bg-surface-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="flex items-center gap-4 bg-white rounded-xl px-5 py-4 border border-border shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-teal-light flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={s.icon} />
                  </svg>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary leading-none">{s.value}</div>
                  <div className="text-xs text-text-muted mt-0.5 leading-snug">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PATIENT JOURNEY CTA ─────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block mb-4 px-4 py-1.5 text-xs font-bold tracking-widest uppercase rounded-full border border-teal text-teal bg-teal-light">
              Step-by-Step Journey
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-primary">
              Your Complete Health Journey
            </h2>
            <p className="text-sm text-text-muted mt-3 max-w-xl mx-auto">
              From first symptom to full recovery — guided step by step, like a railway journey with a clear destination.
            </p>
          </div>

          {/* Phase train */}
          <div className="flex flex-col md:flex-row items-stretch gap-0 mb-10 rounded-2xl overflow-hidden border border-border shadow-sm">
            {journeyPhases.map((phase, pi) => (
              <div
                key={phase.phase}
                className="flex-1 p-6"
                style={{ background: phase.bg, borderRight: pi < journeyPhases.length - 1 ? '1px solid #E5E7EB' : 'none' }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: phase.color }} />
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: phase.color }}>
                    {phase.phase}
                  </span>
                </div>
                <div className="space-y-2">
                  {phase.steps.map((step, si) => (
                    <div key={step} className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ color: phase.color, border: `1.5px solid ${phase.color}` }}>
                        {pi === 0 ? si + 1 : pi === 1 ? 4 : si + 5}
                      </span>
                      <span className="text-sm font-semibold text-text-primary">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/journey"
              className="inline-flex items-center gap-3 px-10 py-4 bg-primary text-white text-base font-bold rounded-xl shadow-xl hover:bg-teal hover:-translate-y-1 transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Start Your Guided Journey
            </Link>
            <p className="text-xs text-text-muted mt-3">Or jump directly to any tool below</p>
          </div>
        </div>
      </section>

      {/* ── AYURVEDA BANNER ──────────────────────────────────────────── */}
      <section className="py-12 bg-surface-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-border rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 shadow-sm">
            <div className="flex-1">
              <span className="inline-block mb-3 px-3 py-1 text-xs font-semibold tracking-wide uppercase rounded-full bg-teal-light text-teal">
                Inclusive Healthcare
              </span>
              <h2 className="font-display text-2xl font-bold text-primary">Ayurveda Counts</h2>
              <p className="text-sm text-text-secondary mt-3 leading-relaxed">
                Practitioners of Ayurvedic, Unani, Siddha, and Homeopathic medicine serve millions across India.
                They deserve the same certification and quality evaluation framework as allopathic doctors.
              </p>
              <p className="text-sm text-text-secondary mt-2 leading-relaxed">
                HealthID is building India's first unified directory that includes all systems of medicine — evaluated fairly, transparently, and without bias.
              </p>
              <Link
                to="/find-doctors"
                className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 bg-cta text-white text-sm font-semibold rounded-lg hover:bg-cta-dark transition-colors"
              >
                Find Verified Doctors
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="w-24 h-24 bg-teal-light rounded-2xl flex items-center justify-center flex-shrink-0">
              <svg className="w-12 h-12 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURE CARDS ────────────────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="inline-block mb-4 px-4 py-1.5 text-xs font-bold tracking-widest uppercase rounded-full border border-teal text-teal bg-teal-light">
              Direct Access
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-primary">
              All Tools — Accessible Anytime
            </h2>
            <p className="text-sm text-text-muted mt-2">Use any feature directly without following the full journey.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => {
              const title = f.title;
              const desc = f.desc;
              return (
                <Link
                  key={f.path}
                  to={f.path}
                  className="group flex items-start gap-4 bg-surface-card border border-border rounded-xl p-5 border-l-[3px] border-l-teal hover:border-l-primary hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="w-10 h-10 rounded-lg bg-teal-light flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-teal/20 transition-colors">
                    <svg className="w-5 h-5 text-teal group-hover:text-teal-dark transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={f.icon} />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-sm font-bold text-primary">{title}</h3>
                    <p className="text-xs text-text-secondary mt-1 leading-relaxed">{desc}</p>
                    <div className="mt-2 flex items-center gap-1 text-teal text-xs font-semibold group-hover:gap-2 transition-all">
                      <span>Get started</span>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FLOATING HELP CHAT BUTTON ─────────────────────────────────── */}
      <Link
        to="/post-consult-chat"
        id="floating-chat-btn"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-cta text-white shadow-xl flex items-center justify-center hover:bg-cta-dark hover:scale-110 transition-all duration-200 group"
        aria-label="Open Help Chat"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <span className="absolute right-16 bg-primary text-white text-xs font-medium px-2.5 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
          Help Chat
        </span>
      </Link>

    </div>
  );
}
