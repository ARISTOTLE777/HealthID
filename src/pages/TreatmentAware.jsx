import { useState } from 'react';
import { useToast } from '../components/Toast';
import { callAI, SYSTEM_PROMPTS } from '../lib/ai';
import SkeletonLoader from '../components/SkeletonLoader';

export default function TreatmentAware() {
  const [form, setForm] = useState({ symptoms: '', duration: '', severity: 'mild', age: '', conditions: '' });
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const addToast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.symptoms.trim()) { addToast('Please describe your symptoms', 'error'); return; }
    setLoading(true);
    setResult('');
    const prompt = `Patient details:
- Symptoms: ${form.symptoms}
- Duration: ${form.duration || 'not specified'}
- Severity: ${form.severity}
- Age: ${form.age || 'not specified'}
- Existing conditions: ${form.conditions || 'none mentioned'}

Based on these symptoms, recommend ONE of these approaches:
1. DOCTOR VISIT — if professional assessment is needed
2. MEDICATION — if OTC/pharmacy medicine may help (specify what)
3. REST & HOME CARE — if the body can heal on its own

Provide:
- Your recommended approach (one of the three above) as a clear heading
- Why this approach and not the others
- Specific actionable steps the patient should take
- When to escalate to the next level of care
- Warning signs that need immediate attention

Be specific to their symptoms. Use simple language.`;

    try {
      const response = await callAI(
        'You are HealthID Treatment Aware, a medical literacy tool. You help patients understand whether they need a doctor visit, medication, or just rest. You do NOT diagnose. Always include when to see a doctor.',
        prompt
      );
      setResult(response);
    } catch {
      // Smart fallback based on severity
      const approaches = {
        mild: { approach: 'REST & HOME CARE', advice: 'Based on the mild severity of your symptoms, rest and home care may be the appropriate first step.' },
        moderate: { approach: 'MEDICATION', advice: 'Your moderate symptoms may benefit from appropriate medication. Consult a pharmacist before taking any medicine.' },
        severe: { approach: 'DOCTOR VISIT', advice: 'Given the severity of your symptoms, a professional medical assessment is recommended.' },
      };
      const fb = approaches[form.severity] || approaches.moderate;
      setResult(`**Recommended Approach: ${fb.approach}**

${fb.advice}

**What to do now:**
- Rest adequately and stay hydrated
- Monitor your symptoms for any changes
- Keep a note of when symptoms started and what makes them better or worse
- Avoid self-medicating without professional guidance

**When to see a doctor:**
- Symptoms persist for more than 3-5 days without improvement
- Symptoms suddenly worsen
- You develop fever, severe pain, or difficulty breathing
- You notice any new or unexpected symptoms

**Warning Signs — Seek Emergency Care:**
- High fever above 103°F
- Severe breathing difficulty
- Chest pain or pressure
- Loss of consciousness
- Uncontrolled bleeding

**Important:** This is a general guidance tool. When in doubt, always consult a qualified medical professional.`);
      addToast('Using offline guidance', 'warning');
    } finally {
      setLoading(false);
    }
  };

  const parseResult = (text) => {
    if (!text) return { approach: '', sections: [] };
    let approach = 'GUIDANCE';
    if (text.toLowerCase().includes('doctor visit')) approach = 'DOCTOR VISIT';
    else if (text.toLowerCase().includes('medication')) approach = 'MEDICATION';
    else if (text.toLowerCase().includes('rest') || text.toLowerCase().includes('home care')) approach = 'REST & HOME CARE';

    const approachColors = {
      'DOCTOR VISIT': { bg: 'bg-alert/10', border: 'border-primary', text: 'text-primary', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
      'MEDICATION': { bg: 'bg-amber-50', border: 'border-warning', text: 'text-warning', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' },
      'REST & HOME CARE': { bg: 'bg-green-50', border: 'border-success', text: 'text-success', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
      'GUIDANCE': { bg: 'bg-blue-50', border: 'border-blue-400', text: 'text-blue-700', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    };

    return { approach, colors: approachColors[approach] || approachColors['GUIDANCE'], content: text };
  };

  const parsed = parseResult(result);

  return (
    <div>
      <div className="bg-primary text-white py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-2xl sm:text-3xl font-bold">Doctor Visit? Medication? Just Rest?</h1>
          <p className="mt-2 text-sm opacity-90">A smart tool to figure out the right approach for your symptoms.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">What are you experiencing? *</label>
            <textarea value={form.symptoms} onChange={e => setForm({ ...form, symptoms: e.target.value })} rows={4}
              placeholder="Describe your symptoms in detail, e.g. 'mild headache for 2 days, gets worse in the evening, no fever'"
              className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">How long?</label>
              <input type="text" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })}
                placeholder="e.g. 3 days" className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Severity</label>
              <select value={form.severity} onChange={e => setForm({ ...form, severity: e.target.value })}
                className="w-full px-4 py-3 border border-border rounded-xl text-sm bg-surface-card focus:outline-none focus:ring-2 focus:ring-primary/20">
                <option value="mild">Mild — Annoying but manageable</option>
                <option value="moderate">Moderate — Affecting daily activities</option>
                <option value="severe">Severe — Very painful or concerning</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Age (optional)</label>
              <input type="number" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })}
                placeholder="e.g. 35" className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
          </div>
          {loading ? (
            <div className="bg-surface-card border border-border rounded-xl p-6"><SkeletonLoader lines={6} /></div>
          ) : (
            <button type="submit" className="w-full py-3 bg-cta text-white font-semibold rounded-lg hover:bg-cta-dark transition-colors">
              What Should I Do?
            </button>
          )}
        </form>

        {result && (
          <div className="animate-fade-in space-y-4">
            <div className={`${parsed.colors.bg} border-2 ${parsed.colors.border} rounded-xl p-6`}>
              <div className="flex items-center gap-3 mb-3">
                <svg className={`w-8 h-8 ${parsed.colors.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={parsed.colors.icon} />
                </svg>
                <h3 className={`font-display text-xl font-bold ${parsed.colors.text}`}>{parsed.approach}</h3>
              </div>
            </div>
            <div className="bg-surface-card border border-border rounded-xl p-6">
              {parsed.content.split('\n').filter(Boolean).map((line, i) => {
                const trimmed = line.trim();
                if (trimmed.startsWith('**') && trimmed.endsWith('**')) return <h4 key={i} className="text-primary font-bold text-sm mt-4 mb-2">{trimmed.replace(/\*\*/g, '')}</h4>;
                if (trimmed.startsWith('- ')) return <p key={i} className="text-sm text-text-secondary ml-4 mb-1">{trimmed}</p>;
                return <p key={i} className="text-sm text-text-secondary leading-relaxed mb-1">{trimmed}</p>;
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
