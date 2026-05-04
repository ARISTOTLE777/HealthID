import { useState, useRef } from 'react';

export default function ImageUploader({ onImageSelect, label = 'Upload an image' }) {
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const processFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target.result;
      setPreview(base64);
      // Extract the raw base64 data (strip the data:image/...;base64, prefix)
      const rawBase64 = base64.split(',')[1];
      const mediaType = file.type;
      onImageSelect({ base64: rawBase64, mediaType, fileName: file.name, previewUrl: base64 });
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e) => {
    if (e.target.files?.[0]) processFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e) => { e.preventDefault(); setDragActive(true); };
  const handleDragLeave = () => setDragActive(false);

  const clearImage = () => {
    setPreview(null);
    setFileName('');
    onImageSelect(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-text-primary mb-2">{label}</label>
      {!preview ? (
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${dragActive
              ? 'border-primary bg-primary-light/50'
              : 'border-border hover:border-primary/40 hover:bg-surface'
            }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleChange}
            className="hidden"
          />
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-primary-light flex items-center justify-center">
              <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">Click to upload or drag and drop</p>
              <p className="text-xs text-text-muted mt-1">Take a photo or choose from your gallery</p>
              <p className="text-xs text-text-muted">PNG, JPG, WEBP up to 10MB</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative border border-border rounded-xl overflow-hidden bg-surface">
          <img src={preview} alt="Uploaded document" className="w-full max-h-64 object-contain bg-surface-card" />
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <div className="flex items-center gap-2 min-w-0">
              <svg className="w-4 h-4 text-success flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-xs text-text-secondary truncate">{fileName}</span>
            </div>
            <button
              onClick={clearImage}
              className="text-xs font-medium text-primary hover:text-primary-dark transition-colors flex items-center gap-1"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Remove
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
