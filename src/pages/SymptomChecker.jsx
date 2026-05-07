import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UrgencySelector from '../components/UrgencySelector';
import AIResponseCard from '../components/AIResponseCard';
import SkeletonLoader from '../components/SkeletonLoader';
import { useToast } from '../components/Toast';
import { getFeatureAIResponse, SYSTEM_PROMPTS, buildSymptomPrompt } from '../lib/ai';
import { fallbackResponses } from '../lib/fallbacks';
import { specialistTypes } from '../lib/mockData';

export default function SymptomChecker() {
  const [urgency, setUrgency] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const addToast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) { addToast('Please describe your symptoms', 'error'); return; }
    if (!urgency) { addToast('Please select an urgency level', 'error'); return; }
    setLoading(true);
    setResult('');
    try {
      const { content, source } = await getFeatureAIResponse({
        systemPrompt: SYSTEM_PROMPTS.symptomChecker,
        userPrompt: buildSymptomPrompt(urgency, symptoms),
        fallbackResponse: () => fallbackResponses.symptomChecker(urgency, symptoms),
        minimumLength: 180,
        relevanceTerms: ['specialist', 'appointment', 'red flags', 'emergency'],
      });
      setResult(content);
      if (source === 'fallback') {
        addToast('Using offline recommendation — for best results, add a Gemini API key', 'warning');
      }
    } finally {
      setLoading(false);
    }
  };

  const prefillSymptoms = (keywords) => {
    setSymptoms(`I have been experiencing ${keywords.join(', ')} for the past few days.`);
    addToast('Symptoms pre-filled');
  };

  return (
    <div>
      {/* Header */}
      <div className="bg-primary text-white py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-2xl sm:text-3xl font-bold">Which Specialist Do I Need</h1>
          <p className="mt-2 text-sm opacity-90">Describe your symptoms in plain language. No medical jargon needed.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <UrgencySelector value={urgency} onChange={setUrgency} />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <textarea
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              rows={5}
              maxLength={1000}
              placeholder="For example: I have had a dull ache in my lower back for three days. It gets worse when I sit for long periods. I also feel tingling in my left leg."
              className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
            />
            <span className="absolute bottom-3 right-3 text-xs text-text-muted">{symptoms.length}/1000</span>
          </div>
          {loading ? (
            <div className="bg-surface-card border border-border rounded-xl p-6">
              <SkeletonLoader lines={6} />
            </div>
          ) : (
            <button type="submit" className="w-full py-3 bg-cta text-white font-semibold rounded-lg hover:bg-cta-dark transition-colors">
              Find the Right Specialist
            </button>
          )}
        </form>

        {result && (
          <div className="space-y-4">
            {(() => {
              let specialist = null;
              const match = result.match(/\*\*Recommended Specialist:\s*([A-Za-z\s]+)/i) || result.match(/Recommended Specialist:\s*([A-Za-z\s]+)/i);
              if (match) {
                specialist = match[1].trim();
              } else {
                for (const spec of specialistTypes) {
                  if (result.toLowerCase().includes(spec.name.toLowerCase())) {
                    specialist = spec.name;
                    break;
                  }
                }
              }
              
              if (specialist) {
                return (
                  <button 
                    onClick={() => navigate('/find-doctors', { state: { specialty: specialist } })}
                    className="w-full py-3 bg-teal text-white font-semibold rounded-lg hover:bg-teal-dark transition-colors shadow-sm"
                  >
                    Find {specialist}
                  </button>
                );
              }
              return null;
            })()}
            <AIResponseCard content={result} title="Your Specialist Recommendation" />
          </div>
        )}

        {/* Specialist reference grid */}
        <div>
          <h3 className="font-display text-lg font-bold text-text-primary mb-4">Browse by specialist</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {specialistTypes.map((spec) => (
              <button
                key={spec.name}
                onClick={() => prefillSymptoms(spec.keywords)}
                className="bg-surface-card border border-border rounded-lg p-4 text-left hover:border-primary/50 hover:shadow-sm transition-all group"
              >
                <h4 className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors">{spec.name}</h4>
                <p className="text-xs text-text-muted mt-1">{spec.keywords.join(', ')}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
