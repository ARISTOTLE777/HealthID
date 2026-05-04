export default function ChecklistItem({ index, text, checked, onChange }) {
  return (
    <label className="flex items-start gap-3 p-3 rounded-lg hover:bg-surface transition-colors cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(index, e.target.checked)}
        className="checklist-checkbox mt-0.5"
      />
      <span className={`text-sm leading-relaxed transition-colors ${checked ? 'text-text-muted line-through' : 'text-text-primary'}`}>
        {text}
      </span>
    </label>
  );
}
