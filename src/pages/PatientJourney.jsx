import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// ── Journey step definitions ────────────────────────────────────────────────
const JOURNEY_STEPS = [
  {
    id: 'symptoms',
    phase: 'pre',
    label: 'Symptom Checker',
    shortLabel: 'Symptoms',
    description: 'Describe what you\'re feeling and find the right specialist.',
    detail: 'Our AI analyses your symptoms and recommends the exact type of doctor you need — no medical jargon required.',
    path: '/symptom-checker',
    icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
    color: '#2BB3B1',
    bgColor: '#E8F8F8',
    cta: 'Check Symptoms',
  },
  {
    id: 'doctors',
    phase: 'pre',
    label: 'Find a Doctor',
    shortLabel: 'Find Doctor',
    description: 'Browse verified, objectively rated doctors near you.',
    detail: 'Every doctor is rated by certified HealthID inspectors on hygiene, qualifications, communication, wait time, and outcomes.',
    path: '/find-doctors',
    icon: 'M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16',
    color: '#0B3B60',
    bgColor: '#E6EFF6',
    cta: 'Find Doctors',
  },
  {
    id: 'checklist',
    phase: 'pre',
    label: 'Pre-Consult Checklist',
    shortLabel: 'Checklist',
    description: 'Know the exact questions to ask your doctor before your visit.',
    detail: 'AI generates 10 personalised questions based on your specific condition so you leave no stone unturned during your appointment.',
    path: '/checklist',
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
    color: '#E55C13',
    bgColor: '#FCF0EA',
    cta: 'Generate Checklist',
  },
  {
    id: 'appointment',
    phase: 'during',
    label: 'Doctor Appointment',
    shortLabel: 'Appointment',
    description: 'Your consultation — the heart of the journey.',
    detail: 'After booking, attend your appointment armed with your personalised checklist. Take notes and collect your prescription.',
    path: '/find-doctors',
    icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    color: '#7C3AED',
    bgColor: '#F3EEF9',
    cta: 'Book Appointment',
    isGate: true,
  },
  {
    id: 'rx',
    phase: 'post',
    label: 'Prescription Decoder',
    shortLabel: 'Prescription',
    description: 'Understand every medicine your doctor prescribed in plain language.',
    detail: 'Upload or type your prescription. Our AI explains each drug: what it does, why it was prescribed, side effects, and warnings.',
    path: '/rx-decoder',
    icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
    color: '#2BB3B1',
    bgColor: '#E8F8F8',
    cta: 'Decode Prescription',
  },
  {
    id: 'bill',
    phase: 'post',
    label: 'Bill Breakdown',
    shortLabel: 'Bill',
    description: 'Know exactly what you paid for and what to question.',
    detail: 'AI analyses your medical bill line by line, flags unusual charges, and gives you specific questions to ask for a refund or clarification.',
    path: '/bill-breakdown',
    icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z',
    color: '#0B3B60',
    bgColor: '#E6EFF6',
    cta: 'Break Down Bill',
  },
  {
    id: 'postconsult',
    phase: 'post',
    label: 'Post-Consult Chat',
    shortLabel: 'Follow-up',
    description: 'Ask follow-up questions after your appointment.',
    detail: 'Still confused? Chat with our AI about your diagnosis, medicines, or next steps anytime after your consultation.',
    path: '/post-consult-chat',
    icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
    color: '#E55C13',
    bgColor: '#FCF0EA',
    cta: 'Start Chat',
  },
  {
    id: 'treatment',
    phase: 'post',
    label: 'Treatment Awareness',
    shortLabel: 'Treatment',
    description: 'Understand your condition and treatment options in depth.',
    detail: 'Deep-dive into your diagnosis: what the condition means, treatment options, lifestyle changes, and what to expect during recovery.',
    path: '/treatment-aware',
    icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13',
    color: '#7C3AED',
    bgColor: '#F3EEF9',
    cta: 'Learn More',
  },
];

const PHASE_META = {
  pre: { label: 'Before Your Visit', color: '#2BB3B1', bg: '#E8F8F8' },
  during: { label: 'During Your Visit', color: '#7C3AED', bg: '#F3EEF9' },
  post: { label: 'After Your Visit', color: '#E55C13', bg: '#FCF0EA' },
};

// No longer needed — pill bar handles connection


// ── Main Component ────────────────────────────────────────────────────────────
export default function PatientJourney() {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [gateUnlocked, setGateUnlocked] = useState(false);
  const navigate = useNavigate();
  const detailRef = useRef(null);

  const handleStepClick = (index) => {
    const step = JOURNEY_STEPS[index];
    // If step is after the gate (appointment) and gate not unlocked, block
    const gateIndex = JOURNEY_STEPS.findIndex(s => s.isGate);
    const isAfterGate = index > gateIndex;
    if (isAfterGate && !gateUnlocked) return;
    setActiveStep(index);
    if (detailRef.current) {
      setTimeout(() => detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
    }
  };

  const markComplete = (index) => {
    const next = new Set(completedSteps);
    next.add(index);
    setCompletedSteps(next);
    // Check if appointment step is complete → unlock post steps
    const gateIndex = JOURNEY_STEPS.findIndex(s => s.isGate);
    if (index === gateIndex) setGateUnlocked(true);
    // Auto-advance
    if (index < JOURNEY_STEPS.length - 1) {
      const nextIndex = index + 1;
      const nextStep = JOURNEY_STEPS[nextIndex];
      if (nextStep.isGate && !gateUnlocked) {
        setActiveStep(nextIndex);
      } else if (!nextStep.isGate || gateUnlocked) {
        setActiveStep(nextIndex);
      }
    }
  };

  const goToTool = (step, index) => {
    markComplete(index);
    navigate(step.path);
  };

  const currentStep = JOURNEY_STEPS[activeStep];
  const gateIndex = JOURNEY_STEPS.findIndex(s => s.isGate);

  // Group steps by phase
  const phases = ['pre', 'during', 'post'];

  return (
    <div className="journey-page">
      {/* ── Hero Banner ──────────────────────────────────────────────── */}
      <div className="journey-hero">
        <div className="journey-hero-inner">
          <span className="journey-badge">Step-by-Step Health Journey</span>
          <h1 className="journey-title">
            Your Complete<br />
            <span className="journey-title-accent">Health Journey</span>
          </h1>
          <p className="journey-subtitle">
            Follow the guided flow from first symptom to full recovery — or jump directly to any tool you need.
          </p>
          <div className="journey-hero-stats">
            <div className="journey-stat">
              <span className="journey-stat-num">8</span>
              <span className="journey-stat-label">Tools</span>
            </div>
            <div className="journey-stat-divider" />
            <div className="journey-stat">
              <span className="journey-stat-num">3</span>
              <span className="journey-stat-label">Phases</span>
            </div>
            <div className="journey-stat-divider" />
            <div className="journey-stat">
              <span className="journey-stat-num">AI</span>
              <span className="journey-stat-label">Powered</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Phase Legend ─────────────────────────────────────────────── */}
      <div className="journey-phase-legend">
        {phases.map(phase => (
          <div key={phase} className="journey-phase-pill" style={{ background: PHASE_META[phase].bg, color: PHASE_META[phase].color }}>
            <span className="journey-phase-dot" style={{ background: PHASE_META[phase].color }} />
            {PHASE_META[phase].label}
          </div>
        ))}
        <div className="journey-phase-pill journey-gate-pill">
          <svg width="14" height="14" fill="none" stroke="#7C3AED" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Appointment Gate — post tools unlock after booking
        </div>
      </div>

      {/* ── Pill Bar Stepper ──────────────────────────────────────────── */}
      <div className="jpill-wrap">

        {/* ── Row 1: the pill with embedded circles ── */}
        <div className="jpill-outer">
          {/* Inner track — circles position relative to this */}
          <div className="jpill-track">
            {/* Gradient fill bar */}
            <div
              className="jpill-bar"
              style={{
                width: `${Math.max(4, (completedSteps.size / JOURNEY_STEPS.length) * 100)}%`,
              }}
            />

          {/* Circle nodes — positioned absolutely, centred vertically inside pill */}
          {JOURNEY_STEPS.map((step, index) => {
            const isCompleted = completedSteps.has(index);
            const isActive = activeStep === index;
            const isAfterGate = index > gateIndex;
            const isLocked = isAfterGate && !gateUnlocked;
            const nodeState = isCompleted ? 'done' : isActive ? 'active' : isLocked ? 'locked' : 'todo';

            return (
              <button
                key={step.id}
                id={`journey-step-${step.id}`}
                className={`jpill-node jpill-node--${nodeState}`}
                style={{ left: `${(index / (JOURNEY_STEPS.length - 1)) * 100}%` }}
                onClick={() => handleStepClick(index)}
                title={isLocked ? 'Complete your appointment first' : step.label}
                disabled={isLocked}
              >
                {isCompleted ? (
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="jpill-node-number">{index + 1}</span>
                )}
              </button>
            );
          })}
          </div>{/* close jpill-track */}
        </div>


        {/* ── Row 2: labels grid — one cell per step, perfectly aligned ── */}
        <div className="jpill-labels">
          {JOURNEY_STEPS.map((step, index) => {
            const isCompleted = completedSteps.has(index);
            const isActive = activeStep === index;
            const isAfterGate = index > gateIndex;
            const isLocked = isAfterGate && !gateUnlocked;
            const nodeState = isCompleted ? 'done' : isActive ? 'active' : isLocked ? 'locked' : 'todo';

            return (
              <div key={step.id} className="jpill-label-cell">
                <span className={`jpill-label jpill-label--${nodeState}${isActive ? ' jpill-label--bold' : ''}`}>
                  {step.shortLabel}
                </span>
              </div>
            );
          })}
        </div>

        {/* Tip row */}
        {gateUnlocked && (
          <div className="jpill-tip">
            <svg width="14" height="14" fill="none" stroke="#2BB3B1" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Post-appointment tools are now unlocked — continue your journey!
          </div>
        )}
        {!gateUnlocked && completedSteps.size > 0 && (
          <div className="jpill-tip">
            <svg width="14" height="14" fill="none" stroke="#2BB3B1" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Complete your doctor appointment to unlock post-visit tools.
          </div>
        )}
      </div>




      {/* ── Active Step Detail Card ───────────────────────────────────── */}
      <div className="journey-detail-wrap" ref={detailRef}>
        <div
          className="journey-detail-card"
          key={currentStep.id}
          style={{ '--card-color': currentStep.color, '--card-bg': currentStep.bgColor }}
        >
          {/* Left: info */}
          <div className="journey-detail-left">
            <div className="journey-detail-phase-tag" style={{ background: PHASE_META[currentStep.phase].bg, color: PHASE_META[currentStep.phase].color }}>
              {PHASE_META[currentStep.phase].label}
            </div>
            <div className="journey-detail-icon-wrap">
              <svg width="28" height="28" fill="none" stroke="white" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d={currentStep.icon} />
              </svg>
            </div>
            <div className="journey-detail-step-num">Step {activeStep + 1} of {JOURNEY_STEPS.length}</div>
            <h2 className="journey-detail-title">{currentStep.label}</h2>
            <p className="journey-detail-desc">{currentStep.description}</p>
            <p className="journey-detail-detail">{currentStep.detail}</p>

            {currentStep.isGate && (
              <div className="journey-gate-notice">
                <svg width="16" height="16" fill="none" stroke="#7C3AED" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Post-appointment tools unlock after you mark this step complete.
              </div>
            )}

            <div className="journey-detail-actions">
              <button
                className="journey-btn-primary"
                style={{ background: currentStep.color }}
                onClick={() => goToTool(currentStep, activeStep)}
              >
                {currentStep.cta}
                <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {!completedSteps.has(activeStep) && (
                <button
                  className="journey-btn-secondary"
                  onClick={() => markComplete(activeStep)}
                >
                  Mark as Done
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </button>
              )}
              {completedSteps.has(activeStep) && (
                <div className="journey-done-badge">
                  <svg width="16" height="16" fill="none" stroke="#2BB3B1" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Completed
                </div>
              )}
            </div>
          </div>

          {/* Right: progress panel */}
          <div className="journey-detail-right">
            <h3 className="journey-progress-title">Journey Progress</h3>
            <div className="journey-progress-bar-wrap">
              <div
                className="journey-progress-bar"
                style={{ width: `${(completedSteps.size / JOURNEY_STEPS.length) * 100}%` }}
              />
            </div>
            <p className="journey-progress-text">{completedSteps.size} of {JOURNEY_STEPS.length} steps complete</p>

            <div className="journey-step-list">
              {JOURNEY_STEPS.map((step, index) => {
                const done = completedSteps.has(index);
                const active = activeStep === index;
                const isAfterGate = index > gateIndex;
                const locked = isAfterGate && !gateUnlocked;
                return (
                  <button
                    key={step.id}
                    className={`journey-mini-step ${active ? 'journey-mini-active' : ''} ${done ? 'journey-mini-done' : ''} ${locked ? 'journey-mini-locked' : ''}`}
                    onClick={() => handleStepClick(index)}
                    disabled={locked}
                  >
                    <div className="journey-mini-circle" style={{ background: done ? step.color : active ? step.color + '22' : '#F3F4F6', border: `2px solid ${done || active ? step.color : '#E5E7EB'}` }}>
                      {done ? (
                        <svg width="10" height="10" fill="none" stroke={step.color} strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : locked ? (
                        <svg width="10" height="10" fill="none" stroke="#9CA3AF" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      ) : (
                        <span style={{ fontSize: '9px', fontWeight: 700, color: active ? step.color : '#9CA3AF' }}>{index + 1}</span>
                      )}
                    </div>
                    <div className="journey-mini-info">
                      <span className="journey-mini-label" style={{ color: active ? step.color : locked ? '#9CA3AF' : done ? '#374151' : '#4B5563' }}>
                        {step.label}
                      </span>
                      <span className="journey-mini-phase" style={{ color: PHASE_META[step.phase].color }}>
                        {PHASE_META[step.phase].label}
                      </span>
                    </div>
                    {step.isGate && (
                      <span className="journey-gate-badge">Gate</span>
                    )}
                  </button>
                );
              })}
            </div>

            {gateUnlocked && (
              <div className="journey-gate-unlocked">
                <svg width="16" height="16" fill="none" stroke="#2BB3B1" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
                Post-appointment tools unlocked!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Navigation Arrows ─────────────────────────────────────────── */}
      <div className="journey-nav-wrap">
        <button
          className="journey-nav-btn"
          onClick={() => handleStepClick(Math.max(0, activeStep - 1))}
          disabled={activeStep === 0}
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Previous Step
        </button>
        <div className="journey-dot-nav">
          {JOURNEY_STEPS.map((_, i) => (
            <button
              key={i}
              onClick={() => handleStepClick(i)}
              className={`journey-dot ${activeStep === i ? 'journey-dot-active' : ''} ${completedSteps.has(i) ? 'journey-dot-done' : ''}`}
            />
          ))}
        </div>
        <button
          className="journey-nav-btn journey-nav-next"
          onClick={() => handleStepClick(Math.min(JOURNEY_STEPS.length - 1, activeStep + 1))}
          disabled={activeStep === JOURNEY_STEPS.length - 1 || (activeStep >= gateIndex && !gateUnlocked && activeStep !== gateIndex)}
        >
          Next Step
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* ── Tools Hub ─────────────────────────────────────────────────── */}
      <div className="journey-tools-hub">
        <div className="journey-tools-hub-inner">
          <div className="journey-tools-header">
            <span className="journey-tools-badge">Direct Access</span>
            <h2 className="journey-tools-title">Jump to Any Tool</h2>
            <p className="journey-tools-sub">All HealthID features available independently — no need to follow the full journey.</p>
          </div>

          <div className="journey-tools-grid">
            {JOURNEY_STEPS.map((step, index) => (
              <Link
                key={step.id}
                to={step.path}
                id={`tool-card-${step.id}`}
                className="journey-tool-card"
                style={{ '--tc': step.color, '--tcbg': step.bgColor }}
              >
                <div className="journey-tool-icon">
                  <svg width="22" height="22" fill="none" stroke={step.color} strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d={step.icon} />
                  </svg>
                </div>
                <div className="journey-tool-info">
                  <div className="journey-tool-phase" style={{ color: PHASE_META[step.phase].color }}>
                    {PHASE_META[step.phase].label}
                  </div>
                  <h3 className="journey-tool-name">{step.label}</h3>
                  <p className="journey-tool-desc">{step.description}</p>
                </div>
                <div className="journey-tool-step-num" style={{ color: step.color }}>
                  {index + 1}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
