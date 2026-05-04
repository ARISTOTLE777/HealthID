export default function AIResponseCard({ content, title }) {
  if (!content) return null;

  const sections = content.split('\n').filter(Boolean);

  return (
    <div className="bg-surface-card border border-border rounded-xl overflow-hidden animate-fade-in">
      {title && (
        <div className="bg-primary px-6 py-4">
          <h3 className="font-display text-lg font-bold text-white">{title}</h3>
        </div>
      )}
      <div className="p-6">
        <div className="prose prose-sm max-w-none text-text-primary">
          {sections.map((line, i) => {
            const trimmed = line.trim();
            if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
              return <h4 key={i} className="text-primary font-bold text-base mt-4 mb-2 first:mt-0">{trimmed.replace(/\*\*/g, '')}</h4>;
            }
            if (trimmed.startsWith('- ')) {
              return <li key={i} className="ml-4 text-sm text-text-secondary mb-1 list-disc">{trimmed.slice(2)}</li>;
            }
            if (/^\d+\./.test(trimmed)) {
              return <li key={i} className="ml-4 text-sm text-text-secondary mb-1 list-decimal">{trimmed.replace(/^\d+\.\s*/, '')}</li>;
            }
            return <p key={i} className="text-sm text-text-secondary mb-2 leading-relaxed">{trimmed}</p>;
          })}
        </div>
      </div>
    </div>
  );
}
