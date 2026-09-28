import React, { useState, useEffect } from 'react';
import { StudentPreferences } from '../types/opportunity';
import { X, Check } from 'lucide-react';

interface InterestModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: StudentPreferences;
  onSavePreferences: (prefs: StudentPreferences) => void;
}

const INTEREST_CATEGORIES = [
  'AI / Machine Learning',
  'Software Development',
  'Electronics',
  'VLSI',
  'Embedded Systems',
  'Cybersecurity',
  'Data Science',
  'Robotics',
  'Design',
  'Entrepreneurship',
  'Research',
  'Business'
] as const;

export const InterestModal: React.FC<InterestModalProps> = ({
  isOpen,
  onClose,
  preferences,
  onSavePreferences
}) => {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [isSavedConfirmation, setIsSavedConfirmation] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedInterests(Array.isArray(preferences.domains) ? preferences.domains : []);
      setIsSavedConfirmation(false);
    }
  }, [isOpen, preferences]);

  if (!isOpen) return null;

  const toggleInterest = (category: string) => {
    setSelectedInterests(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };

  const handleSelectAll = () => {
    setSelectedInterests([...INTEREST_CATEGORIES]);
  };

  const handleClearAll = () => {
    setSelectedInterests([]);
  };

  const handleSave = () => {
    setIsSavedConfirmation(true);
    onSavePreferences({
      ...preferences,
      domains: selectedInterests as any
    });
    setTimeout(() => {
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg rounded-lg bg-[#111111] border border-[#262626] p-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-[#222222] mb-4">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              My Interests
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Select your academic and technical fields to personalize your opportunity feed.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white p-1 cursor-pointer transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Selection Controls */}
        <div className="flex items-center justify-between text-xs text-zinc-400 mb-3">
          <span>
            <strong className="text-white font-mono tabular-nums">{selectedInterests.length}</strong> selected
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSelectAll}
              className="text-xs text-zinc-400 hover:text-white cursor-pointer"
            >
              Select all
            </button>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <button
              type="button"
              onClick={handleClearAll}
              className="text-xs text-zinc-400 hover:text-white cursor-pointer"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
          {INTEREST_CATEGORIES.map(category => {
            const isSelected = selectedInterests.includes(category);
            return (
              <button
                key={category}
                type="button"
                onClick={() => toggleInterest(category)}
                className={`px-3 py-2 rounded-md text-xs font-medium text-left flex items-center justify-between border transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#1E1E1E] text-white border-[#E53935]'
                    : 'bg-[#161616] text-zinc-300 border-[#262626] hover:border-zinc-700 hover:text-white'
                }`}
              >
                <span>{category}</span>
                <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                  isSelected 
                    ? 'bg-[#E53935] border-[#E53935] text-white' 
                    : 'border-[#333333] bg-[#111111]'
                }`}>
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-[#222222] flex items-center justify-between gap-3">
          <div className="text-xs text-zinc-400">
            {isSavedConfirmation && (
              <span className="text-emerald-400 font-medium animate-fade-in flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>Interests saved</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-md text-xs font-medium text-zinc-400 hover:text-white bg-[#161616] hover:bg-[#1E1E1E] border border-[#262626] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSavedConfirmation}
              className="px-4 py-1.5 rounded-md text-xs font-semibold text-white bg-[#E53935] hover:bg-[#d32f2f] transition-colors cursor-pointer disabled:opacity-50"
            >
              Save Interests
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
