import React, { useState } from 'react';
import { X, Key, ShieldCheck, Trash2 } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onSaveKey: (key: string) => void;
  demoMode: boolean;
  onToggleDemoMode: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  apiKey,
  onSaveKey,
  demoMode,
  onToggleDemoMode,
}) => {
  const [inputValue, setInputValue] = useState(apiKey);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveKey(inputValue.trim());
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleClear = () => {
    setInputValue('');
    onSaveKey('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-cream border-4 border-black shadow-brutal-lg rounded-2xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-marigold border-2 border-black rounded-lg p-1 hover:bg-yellow-400 shadow-brutal-sm"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-marigold border-2 border-black rounded-xl shadow-brutal-sm">
            <Key className="w-6 h-6 text-black" />
          </div>
          <div>
            <h2 className="text-xl font-bungee text-black">Settings</h2>
            <p className="text-xs text-gray-700 font-semibold">Gemini API & Game Modes</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-black mb-1">
              Gemini API Key
            </label>
            <input
              type="password"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-3 py-2 border-2 border-black rounded-lg bg-white shadow-brutal-sm font-mono text-sm focus:outline-none focus:ring-2 focus:ring-magenta"
            />
            <p className="text-xs text-gray-600 mt-1 flex items-center gap-1 font-medium">
              <ShieldCheck className="w-4 h-4 text-teal" />
              Stored only in your browser (localStorage).
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 brutal-btn-primary py-2 text-sm"
            >
              {savedSuccess ? 'Saved! ✓' : 'Save Key'}
            </button>
            {inputValue && (
              <button
                type="button"
                onClick={handleClear}
                className="brutal-btn bg-red-400 hover:bg-red-500 text-black px-3 py-2 rounded-xl text-sm"
                title="Clear key"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>

        <div className="mt-6 pt-4 border-t-2 border-black/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-black">Demo Mode (Offline Fallback)</p>
              <p className="text-xs text-gray-600">Play without any AI API key</p>
            </div>
            <button
              onClick={onToggleDemoMode}
              className={`px-3 py-1.5 border-2 border-black rounded-lg font-bungee text-xs shadow-brutal-sm transition-all ${
                demoMode ? 'bg-teal text-black' : 'bg-gray-200 text-gray-700'
              }`}
            >
              {demoMode ? 'ENABLED' : 'DISABLED'}
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="text-xs font-bold text-gray-600 hover:text-black underline"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
