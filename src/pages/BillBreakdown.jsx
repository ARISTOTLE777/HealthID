import { useState } from 'react';
import ImageUploader from '../components/ImageUploader';
import SkeletonLoader from '../components/SkeletonLoader';
import { useToast } from '../components/Toast';
import { getFeatureAIResponse, getFeatureAIResponseWithImage, SYSTEM_PROMPTS, buildBillPrompt } from '../lib/ai';
import { fallbackResponses } from '../lib/fallbacks';
import jsPDF from 'jspdf';

export default function BillBreakdown() {
  const [bill, setBill] = useState('');
  const [imageData, setImageData] = useState(null);
  const [inputMode, setInputMode] = useState('text');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const addToast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputMode === 'text' && !bill.trim()) { addToast('Please enter your bill details', 'error'); return; }
    if (inputMode === 'image' && !imageData) { addToast('Please upload an image of your bill', 'error'); return; }
    setLoading(true);
    setResult('');
    try {
      let response;
      let source = 'ai';
      let fallbackReason = '';
      if (inputMode === 'image' && imageData) {
        const imagePrompt = bill.trim()
          ? `This is an image of a medical bill. Additional context: ${bill}. Read every charge from this bill image. For each line item: explain what it is in plain language, whether it is reasonable, and flag anything the patient should question. End with a list of questions to ask the billing department.`
          : 'This is an image of a medical bill. Read every charge from this bill image. For each line item: explain what it is in plain language, whether it is reasonable, and flag anything the patient should question. End with a list of questions to ask the billing department.';
        const result = await getFeatureAIResponseWithImage({
          systemPrompt: SYSTEM_PROMPTS.billBreakdown,
          textPrompt: imagePrompt,
          imageData,
          fallbackResponse: fallbackResponses.billBreakdown,
          minimumLength: 180,
          relevanceTerms: ['charge', 'reasonable', 'question', 'bill'],
        });
        response = result.content;
        source = result.source;
        fallbackReason = result.reason || '';
      } else {
        const result = await getFeatureAIResponse({
          systemPrompt: SYSTEM_PROMPTS.billBreakdown,
          userPrompt: buildBillPrompt(bill),
          fallbackResponse: fallbackResponses.billBreakdown,
          minimumLength: 180,
          relevanceTerms: ['charge', 'reasonable', 'question', 'bill'],
        });
        response = result.content;
        source = result.source;
        fallbackReason = result.reason || '';
      }
      setResult(response);
      if (source === 'fallback') {
        console.warn('Bill fallback triggered:', fallbackReason);
        addToast('Using offline bill guidance', 'warning');
      }
    } finally {
      setLoading(false);
    }
  };

  const parseBillItems = (text) => {
    if (!text) return { items: [], questions: '', summary: '' };
    const items = [];
    const sections = text.split('\n');
    let currentItem = null;
    let questionsSection = '';
    let inQuestions = false;
    let summarySection = '';

    for (const line of sections) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      if (trimmed.toLowerCase().includes('questions to ask') || trimmed.toLowerCase().includes('flagged charges')) {
        inQuestions = true; continue;
      }
      if (trimmed.toLowerCase().includes('general advice') || trimmed.toLowerCase().includes('always request')) {
        summarySection += trimmed + '\n'; continue;
      }
      if (inQuestions) { questionsSection += trimmed + '\n'; continue; }
      if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
        if (currentItem) items.push(currentItem);
        const name = trimmed.replace(/\*\*/g, '');
        currentItem = { name, content: '', status: 'standard' };
      } else if (currentItem) {
        currentItem.content += trimmed + '\n';
        if (trimmed.toLowerCase().includes('question') || trimmed.toLowerCase().includes('flag') || trimmed.toLowerCase().includes('seems high')) {
          currentItem.status = 'flagged';
        } else if (trimmed.toLowerCase().includes('review') || trimmed.toLowerCase().includes('verify')) {
          currentItem.status = currentItem.status !== 'flagged' ? 'review' : currentItem.status;
        }
      }
    }
    if (currentItem) items.push(currentItem);
    return { items, questions: questionsSection, summary: summarySection };
  };

  const { items, questions } = parseBillItems(result);
  const standardCount = items.filter(i => i.status === 'standard').length;
  const reviewCount = items.filter(i => i.status === 'review').length;
  const flaggedCount = items.filter(i => i.status === 'flagged').length;

  const statusConfig = {
    standard: { border: 'border-l-success', badge: 'bg-green-50 text-success', label: 'Standard' },
    review: { border: 'border-l-warning', badge: 'bg-amber-50 text-warning', label: 'Review This' },
    flagged: { border: 'border-l-primary', badge: 'bg-alert/10 text-primary', label: 'Question This' },
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(186, 25, 33);
    doc.text('HealthID — Bill Breakdown Report', 20, 25);
    doc.setFontSize(10);
    doc.setTextColor(26, 6, 8);
    const lines = doc.splitTextToSize(result, 170);
    let y = 45;
    lines.forEach((line) => {
      if (y > 275) { doc.addPage(); y = 20; }
      doc.text(line, 20, y);
      y += 5;
    });
    doc.save('HealthID-Bill-Report.pdf');
    addToast('Bill report downloaded');
  };

  const copySummary = () => {
    const text = items.filter(i => i.status !== 'standard').map(i => `${i.name}: ${i.status}`).join('\n') + '\n\n' + questions;
    navigator.clipboard.writeText(text);
    addToast('Summary copied to clipboard');
  };

  return (
    <div>
      <div className="bg-primary text-white py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-2xl sm:text-3xl font-bold">What Did I Actually Pay For</h1>
          <p className="mt-2 text-sm opacity-90">Type your bill details or upload a photo. No more hidden surprises.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Input mode toggle */}
        <div className="flex gap-1 bg-surface p-1 rounded-lg w-fit">
          <button
            onClick={() => setInputMode('text')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${inputMode === 'text' ? 'bg-surface text-primary shadow-sm' : 'text-text-muted hover:text-text-primary'}`}
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Type or Paste
            </span>
          </button>
          <button
            onClick={() => setInputMode('image')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${inputMode === 'image' ? 'bg-surface text-primary shadow-sm' : 'text-text-muted hover:text-text-primary'}`}
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Upload Photo
            </span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {inputMode === 'image' && (
            <ImageUploader
              label="Upload a photo of your medical bill"
              onImageSelect={setImageData}
            />
          )}

          <textarea
            value={bill}
            onChange={(e) => setBill(e.target.value)}
            rows={inputMode === 'image' ? 3 : 5}
            placeholder={inputMode === 'image'
              ? '(Optional) Add any notes, e.g. "this was for a routine check-up at a private hospital"'
              : 'For example: Consultation fee Rs 800, ECG Rs 400, Complete Blood Count Rs 350, Urine Culture Rs 600, Registration Rs 100, GST Rs 104. Total Rs 2354'}
            className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
          />

          {loading ? (
            <div className="bg-surface-card border border-border rounded-xl p-6"><SkeletonLoader lines={8} /></div>
          ) : (
            <button type="submit" className="w-full py-3 bg-cta text-white font-semibold rounded-lg hover:bg-cta-dark transition-colors">
              {inputMode === 'image' ? 'Analyse Bill from Image' : 'Analyse My Bill'}
            </button>
          )}
        </form>

        {result && (
          <div className="space-y-4 animate-fade-in">
            {items.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-surface-card border border-border rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-success">{standardCount}</div>
                  <div className="text-xs text-text-muted">Standard</div>
                </div>
                <div className="bg-surface-card border border-border rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-warning">{reviewCount}</div>
                  <div className="text-xs text-text-muted">To Review</div>
                </div>
                <div className="bg-surface-card border border-border rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-primary">{flaggedCount}</div>
                  <div className="text-xs text-text-muted">Flagged</div>
                </div>
              </div>
            )}

            {items.map((item, i) => {
              const config = statusConfig[item.status];
              return (
                <div key={i} className={`bg-surface-card border border-border rounded-lg border-l-4 ${config.border} p-4`}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-bold text-text-primary">{item.name}</h4>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${config.badge}`}>{config.label}</span>
                  </div>
                  {item.content.split('\n').filter(Boolean).map((line, j) => (
                    <p key={j} className="text-sm text-text-secondary leading-relaxed">{line}</p>
                  ))}
                </div>
              );
            })}

            {questions && (
              <div className="bg-primary-light rounded-xl p-5">
                <h4 className="text-sm font-bold text-text-primary mb-2">Questions to Ask the Hospital</h4>
                {questions.split('\n').filter(Boolean).map((q, i) => (
                  <p key={i} className="text-sm text-text-secondary mb-1">{q}</p>
                ))}
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={downloadPDF} className="flex-1 py-3 bg-cta text-white font-semibold rounded-lg hover:bg-cta-dark transition-colors">
                Download Bill Report
              </button>
              <button onClick={copySummary} className="flex-1 py-3 border border-border text-text-secondary font-semibold rounded-lg hover:bg-surface transition-colors">
                Copy Summary
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
