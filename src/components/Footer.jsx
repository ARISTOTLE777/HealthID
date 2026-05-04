import { Link, useLocation } from 'react-router-dom';
import { useI18n } from '../lib/i18n';

export default function Footer() {
  const location = useLocation();
  const { t } = useI18n();
  if (location.pathname.startsWith('/admin')) return null;

  return (
    <footer className="bg-primary text-white border-t border-primary-dark/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-7 h-7 text-teal" viewBox="0 0 32 32" fill="none">
                <rect x="2" y="2" width="28" height="28" rx="6" stroke="currentColor" strokeWidth="2.5"/>
                <path d="M16 8v16M8 16h16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
              <span className="font-display text-lg font-bold">HealthID</span>
            </div>
            <p className="text-sm text-gray-400">{t('tagline')}</p>
          </div>

          {/* Tools */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">{t('tools')}</h4>
            <ul className="space-y-2">
              <li><Link to="/symptom-checker" className="text-sm text-gray-300 hover:text-white transition-colors">{t('symptomChecker')}</Link></li>
              <li><Link to="/checklist" className="text-sm text-gray-300 hover:text-white transition-colors">{t('checklist')}</Link></li>
              <li><Link to="/rx-decoder" className="text-sm text-gray-300 hover:text-white transition-colors">{t('rxDecoder')}</Link></li>
              <li><Link to="/bill-breakdown" className="text-sm text-gray-300 hover:text-white transition-colors">{t('billBreakdown')}</Link></li>
              <li><Link to="/treatment-aware" className="text-sm text-gray-300 hover:text-white transition-colors">{t('treatmentAware')}</Link></li>
              <li><Link to="/report-issue" className="text-sm text-gray-300 hover:text-white transition-colors">{t('reportIssue')}</Link></li>
              <li><Link to="/post-consult-chat" className="text-sm text-gray-300 hover:text-white transition-colors">{t('postConsultChat')}</Link></li>
            </ul>
          </div>

          {/* Doctors */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Doctors</h4>
            <ul className="space-y-2">
              <li><Link to="/find-doctors" className="text-sm text-gray-300 hover:text-white transition-colors">Find Verified Doctors</Link></li>
              <li><Link to="/book-appointment" className="text-sm text-gray-300 hover:text-white transition-colors">Book Appointment</Link></li>
            </ul>
          </div>

          {/* Login */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">{t('login')}</h4>
            <ul className="space-y-2">
              <li><Link to="/admin/login" className="text-sm text-gray-300 hover:text-white transition-colors">{t('doctorPortal')}</Link></li>
              <li><Link to="/patient/login" className="text-sm text-gray-300 hover:text-white transition-colors">{t('patientPortal')}</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-700">
          <p className="text-xs text-gray-500 text-center">HealthID — {t('footerCopy')}</p>
        </div>
      </div>
    </footer>
  );
}
