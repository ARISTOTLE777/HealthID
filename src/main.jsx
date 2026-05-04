import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import { ToastProvider } from './components/Toast';
import { I18nProvider } from './lib/i18n';
import { PatientProvider } from './lib/PatientContext';
import './index.css';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <PatientProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </PatientProvider>
      </I18nProvider>
    </QueryClientProvider>
  </StrictMode>,
);
