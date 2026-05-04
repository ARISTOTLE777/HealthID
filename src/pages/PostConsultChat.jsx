import { useState, useRef, useEffect } from 'react';
import { useToast } from '../components/Toast';
import { callAI } from '../lib/ai';
import SkeletonLoader from '../components/SkeletonLoader';

export default function PostConsultChat() {
  const addToast = useToast();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState({ doctor: '', condition: '', date: '' });
  const [started, setStarted] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const SYSTEM_PROMPT = `You are HealthID Post-Consult Assistant, a follow-up chat helper for patients who recently visited a doctor.

Context about this patient:
- Doctor consulted: ${context.doctor || 'Not specified'}
- Condition/Reason: ${context.condition || 'Not specified'}
- Visit date: ${context.date || 'Not specified'}

Your role:
1. Answer follow-up questions about their treatment, medication, or recovery
2. Help them understand post-visit instructions they may have forgotten
3. Monitor their progress and flag any warning signs
4. Suggest when they should book a follow-up appointment
5. Explain medication side effects in simple language

Rules:
- NEVER diagnose. You are a guidance assistant, not a doctor.
- If symptoms seem to be worsening, advise them to contact their doctor immediately.
- Keep responses concise and easy to understand.
- Always mention the 7-day window — this chat is for post-consult follow-up only.
- If asked about anything unrelated to their recent consultation, politely redirect.`;

  const handleStart = (e) => {
    e.preventDefault();
    if (!context.condition.trim()) {
      addToast('Please describe what you consulted the doctor for', 'error');
      return;
    }
    setStarted(true);
    setMessages([{
      role: 'assistant',
      content: `Welcome to your 7-day post-consult follow-up chat.${context.doctor ? ` I see you consulted ${context.doctor}` : ''} for ${context.condition}.${context.date ? ` Your visit was on ${context.date}.` : ''}\n\nYou can ask me anything about:\n- Your treatment plan or medication\n- Post-visit care instructions\n- Symptoms you are experiencing since the visit\n- When to schedule a follow-up\n\nHow can I help you today?`,
      timestamp: new Date(),
    }]);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = { role: 'user', content: input.trim(), timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Build conversation history for context
    const history = [...messages, userMsg].map(m =>
      `${m.role === 'user' ? 'Patient' : 'Assistant'}: ${m.content}`
    ).join('\n');

    const prompt = `Conversation so far:\n${history}\n\nPatient's latest message: ${userMsg.content}\n\nRespond helpfully and concisely. If the patient reports worsening symptoms, urgently advise contacting their doctor.`;

    try {
      const response = await callAI(SYSTEM_PROMPT, prompt);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      }]);
    } catch {
      // Offline fallback — contextual
      const lower = userMsg.content.toLowerCase();
      let fallback = '';

      if (lower.includes('pain') || lower.includes('hurt') || lower.includes('worse')) {
        fallback = `I understand you are experiencing discomfort. Here is what you should consider:\n\n**If the pain is worsening:**\n- Contact your doctor's clinic directly\n- If prescribed painkillers, ensure you are taking them as directed\n- Apply ice or heat as appropriate for your condition\n\n**Seek immediate care if:**\n- Pain is sudden and severe\n- You have fever above 101°F\n- You notice swelling, redness, or discharge\n\nWould you like guidance on anything else about your recovery?`;
      } else if (lower.includes('medicine') || lower.includes('medication') || lower.includes('tablet') || lower.includes('dose')) {
        fallback = `Regarding your medication:\n\n**General guidelines:**\n- Always take medicines at the prescribed times\n- Complete the full course even if you feel better\n- Take antibiotics with food unless told otherwise\n- Store medicines in a cool, dry place\n\n**Common concerns:**\n- Mild drowsiness or stomach upset is normal with many medicines\n- If you experience rash, severe nausea, or breathing difficulty, stop the medicine and call your doctor\n\nFor specific dosage questions, please refer to the prescription your doctor provided.`;
      } else if (lower.includes('follow') || lower.includes('next visit') || lower.includes('appointment')) {
        fallback = `Regarding your follow-up:\n\n**When to book a follow-up:**\n- If your doctor specified a date, stick to it\n- If not specified, a follow-up within 2 weeks is generally recommended\n- Book sooner if symptoms worsen or new symptoms appear\n\n**Before your next visit:**\n- Note down any changes in symptoms\n- Keep track of all medications taken\n- Write down questions you want to ask\n\nWould you like help preparing a checklist for your next visit?`;
      } else if (lower.includes('food') || lower.includes('diet') || lower.includes('eat')) {
        fallback = `Regarding diet during recovery:\n\n**General post-consult dietary advice:**\n- Stay well hydrated — aim for 8 glasses of water daily\n- Eat light, easily digestible meals\n- Avoid spicy, oily, or processed food if on medication\n- Include fruits, vegetables, and proteins for healing\n\n**If on antibiotics:**\n- Include probiotic foods like curd/yogurt\n- Avoid alcohol completely\n\nFor condition-specific dietary restrictions, please refer to your doctor's advice.`;
      } else {
        fallback = `Thank you for your question. Here are some general post-consultation guidelines:\n\n**Recovery tips:**\n- Take rest as advised by your doctor\n- Complete all prescribed medications\n- Monitor your symptoms and note any changes\n- Stay hydrated and maintain a balanced diet\n\n**Important reminders:**\n- Keep all follow-up appointments\n- Do not self-medicate or change dosages\n- Contact your doctor if symptoms worsen\n\nIs there something specific about your treatment or recovery I can help with?`;
      }

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: fallback,
        timestamp: new Date(),
      }]);
      addToast('Using offline guidance mode', 'warning');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  // Setup form
  if (!started) {
    return (
      <div>
        <div className="bg-primary text-white py-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-display text-2xl sm:text-3xl font-bold">7-Day Post-Consult Chat</h1>
            <p className="mt-2 text-sm opacity-90">Ask anything within the 7-day window after your doctor visit.</p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-surface-card border border-border rounded-xl p-6 sm:p-8">
            <h2 className="font-display text-lg font-bold text-text-primary mb-1">Start your follow-up session</h2>
            <p className="text-sm text-text-muted mb-6">Tell us about your recent consultation so we can provide relevant guidance.</p>

            <form onSubmit={handleStart} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Doctor Name (optional)</label>
                <input type="text" value={context.doctor} onChange={e => setContext({ ...context, doctor: e.target.value })}
                  placeholder="e.g. Dr. Priya Sharma"
                  className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">What did you consult for? *</label>
                <textarea value={context.condition} onChange={e => setContext({ ...context, condition: e.target.value })}
                  rows={3} placeholder="e.g. Persistent cough and mild fever for 5 days, prescribed antibiotics and cough syrup"
                  className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Date of Visit (optional)</label>
                <input type="date" value={context.date} onChange={e => setContext({ ...context, date: e.target.value })}
                  className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <button type="submit" className="w-full py-3 bg-cta text-white font-semibold rounded-xl hover:bg-cta-dark transition-colors">
                Start Chat Session
              </button>
            </form>

            <div className="mt-6 bg-surface rounded-xl p-4">
              <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">How this works</h4>
              <ul className="space-y-2">
                {[
                  'Ask follow-up questions about your medication or treatment',
                  'Get help understanding post-visit care instructions',
                  'Report new or changed symptoms since your visit',
                  'Know when to book a follow-up appointment',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-text-secondary">
                    <svg className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Chat interface
  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 64px)' }}>
      {/* Chat header */}
      <div className="bg-primary text-white px-4 sm:px-6 py-4 flex-shrink-0">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-display text-lg font-bold">7-Day Follow-up Chat</h1>
            <p className="text-xs opacity-80 mt-0.5">
              {context.condition.length > 60 ? context.condition.slice(0, 60) + '...' : context.condition}
              {context.doctor ? ` — ${context.doctor}` : ''}
            </p>
          </div>
          <div className="bg-white/20 rounded-lg px-3 py-1.5 text-xs font-medium">
            {messages.filter(m => m.role === 'user').length} messages
          </div>
        </div>
      </div>

      {/* Chat messages */}
      <div ref={chatRef} className="flex-1 overflow-y-auto bg-surface">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-primary text-white rounded-br-md'
                  : 'bg-surface-card border border-border text-text-primary rounded-bl-md'
              }`}>
                {msg.content.split('\n').filter(Boolean).map((line, j) => {
                  const trimmed = line.trim();
                  if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
                    return <p key={j} className={`text-xs font-bold mt-2 mb-1 ${msg.role === 'user' ? 'text-white/90' : 'text-primary'}`}>{trimmed.replace(/\*\*/g, '')}</p>;
                  }
                  if (trimmed.startsWith('- ')) {
                    return <p key={j} className={`text-xs ml-3 mb-0.5 ${msg.role === 'user' ? 'text-white/80' : 'text-text-secondary'}`}>{trimmed}</p>;
                  }
                  return <p key={j} className={`text-sm leading-relaxed mb-1 ${msg.role === 'user' ? '' : 'text-text-secondary'}`}>{trimmed}</p>;
                })}
                <p className={`text-[10px] mt-2 ${msg.role === 'user' ? 'text-white/50' : 'text-text-muted'}`}>
                  {formatTime(msg.timestamp)}
                </p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-surface-card border border-border rounded-2xl rounded-bl-md px-4 py-3 max-w-[75%]">
                <SkeletonLoader lines={3} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input bar */}
      <div className="bg-surface-card border-t border-border px-4 sm:px-6 py-4 flex-shrink-0">
        <form onSubmit={handleSend} className="max-w-3xl mx-auto flex gap-3">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about your medication, symptoms, recovery..."
            disabled={loading}
            className="flex-1 px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50"
          />
          <button type="submit" disabled={loading || !input.trim()}
            className="px-5 py-3 bg-cta text-white rounded-xl font-medium text-sm hover:bg-cta-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
        <p className="max-w-3xl mx-auto text-[10px] text-text-muted mt-2 text-center">
          This chat is for post-consultation guidance only. For emergencies, call 112 or visit the nearest hospital.
        </p>
      </div>
    </div>
  );
}
