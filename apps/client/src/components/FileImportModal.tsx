import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, ShieldAlert, FileText, Image, Music, Code, BookOpen, Utensils, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import { ItemCategory } from '@the-last-login/shared';

interface FileImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: () => void;
}

export const FileImportModal: React.FC<FileImportModalProps> = ({ isOpen, onClose, onImportSuccess }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ItemCategory>('photos');
  const [recipient, setRecipient] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setTitle(file.name.replace(/\.[^/.]+$/, ''));

      // Suggest category based on extension/type
      const name = file.name.toLowerCase();
      if (file.type.startsWith('image/')) setCategory('photos');
      else if (file.type.startsWith('audio/')) setCategory('audio');
      else if (name.includes('recipe') || name.includes('cocina')) setCategory('recipes');
      else if (name.endsWith('.md') || name.endsWith('.txt')) setCategory('stories');
      else if (name.endsWith('.zip') || name.endsWith('.ts') || name.endsWith('.py')) setCategory('creative');
      else setCategory('documents');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a title for this possession.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (selectedFile) {
        // Upload real binary locally
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('category', category);
        formData.append('recipient', recipient);
        await api.uploadFile(formData);
      } else {
        // Create manual entry without uploading a binary
        await api.createItem({
          title,
          description,
          category,
          fileType: 'text/plain',
          fileSize: 1024,
          fileName: `${title.toLowerCase().replace(/\s+/g, '_')}.txt`,
          contentSnippet: description || 'Digital memory record documented in The Last Login.',
          recipient: recipient || undefined,
          tags: [category, 'manual-entry']
        });
      }

      onImportSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to register item.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories: { id: ItemCategory; label: string; icon: any }[] = [
    { id: 'photos', label: 'Photographs', icon: Image },
    { id: 'recipes', label: 'Family Recipes', icon: Utensils },
    { id: 'documents', label: 'Documents & Deeds', icon: FileText },
    { id: 'audio', label: 'Audio & Voice Notes', icon: Music },
    { id: 'stories', label: 'Personal Stories', icon: BookOpen },
    { id: 'creative', label: 'Creative & Code', icon: Code },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-olive-950/60 backdrop-blur-sm animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="import-modal-title"
    >
      <div className="bg-parchment-100 border border-parchment-300 w-full max-w-xl rounded-2xl shadow-elevated flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 bg-parchment-200 border-b border-parchment-300 flex items-center justify-between shrink-0">
          <div>
            <h3 id="import-modal-title" className="font-serif text-xl font-semibold text-olive-900">
              Add to Life Inventory
            </h3>
            <p className="text-xs text-olive-700">
              Explicit local selection. No silent scanning of your device.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 rounded-lg text-olive-600 hover:text-olive-900 hover:bg-parchment-300 transition-colors focus-visible:ring-2 focus-visible:ring-marigold-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body with internal scrolling */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto flex-1">
          {error && (
            <div className="p-3 rounded-xl bg-terracotta-100 border border-terracotta-300 text-xs text-terracotta-700 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-terracotta-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Local File Picker Dropzone */}
          <div>
            <label className="block text-xs font-semibold text-olive-900 uppercase tracking-wider mb-2">
              Select Local File (Optional)
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-sage-300 hover:border-marigold-500 rounded-xl p-5 text-center cursor-pointer bg-parchment-50 hover:bg-parchment-100 transition-all group"
            >
              {selectedFile ? (
                <div className="flex items-center justify-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-sage-600" />
                  <div className="text-left">
                    <p className="text-sm font-semibold text-olive-900">{selectedFile.name}</p>
                    <p className="text-xs text-olive-600 font-mono">
                      {(selectedFile.size / 1024).toFixed(1)} KB • {selectedFile.type || 'Unknown Type'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <Upload className="w-7 h-7 mx-auto text-sage-600 group-hover:text-marigold-600 transition-colors" />
                  <p className="text-sm font-medium text-olive-900">
                    Click to browse your computer
                  </p>
                  <p className="text-[11px] text-olive-600">
                    Photos, PDFs, Audio, Text notes, or Code repositories
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Title & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-olive-900 uppercase tracking-wider mb-1">
                Item Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Abuela's Tamale Recipe"
                className="w-full px-3 py-2 bg-parchment-50 border border-parchment-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-marigold-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-olive-900 uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ItemCategory)}
                className="w-full px-3 py-2 bg-parchment-50 border border-parchment-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-marigold-500"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description & Intended Recipient */}
          <div>
            <label className="block text-xs font-semibold text-olive-900 uppercase tracking-wider mb-1">
              Description or Context
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What makes this possession meaningful? Any stories behind it?"
              className="w-full px-3 py-2 bg-parchment-50 border border-parchment-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-marigold-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-olive-900 uppercase tracking-wider mb-1">
              Intended Recipient (Optional)
            </label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="e.g. Elena (Daughter), Public Community, Family Archive"
              className="w-full px-3 py-2 bg-parchment-50 border border-parchment-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-marigold-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-between border-t border-parchment-300">
            <p className="text-[11px] text-olive-600 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-sage-500"></span>
              Files stay on your local disk
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm text-olive-700 hover:text-olive-900 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 bg-olive-900 hover:bg-olive-800 text-parchment-50 rounded-xl text-sm font-medium shadow-md transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Registering...' : 'Register Item'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
