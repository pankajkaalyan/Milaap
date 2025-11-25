import React, { useState } from 'react';
import { generativeService } from '../../services/ai/generativeService';
import { useAppContext } from '../../hooks/useAppContext';
import Button from '../ui/Button';
import CloseIcon from '../icons/CloseIcon';
import { ButtonVariant } from '../../types';

interface AIProfileAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTextGenerated: (text: string) => void;
}

const AIProfileAssistantModal: React.FC<AIProfileAssistantModalProps> = ({ isOpen, onClose, onTextGenerated }) => {
  const { t, addToast } = useAppContext();
  const [keywords, setKeywords] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!keywords.trim()) {
      addToast('Please enter some keywords first.', 'error');
      return;
    }
    
    setIsLoading(true);
    setGeneratedText('');

    try {
      const text = await generativeService.generateProfileText(keywords);
      setGeneratedText(text);
    } catch (error) {
      // console.error('Error generating profile text:', error);
      addToast(t('ai_assistant.error'), 'error');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleUseText = () => {
    if (generatedText) {
      onTextGenerated(generatedText);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="relative bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg border border-white/10 flex flex-col">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white z-10" aria-label="Close">
          <CloseIcon />
        </button>
        <div className="p-6 pr-12 border-b border-white/10">
          <h2 className="text-2xl font-bold text-white">{t('ai_assistant.title')}</h2>
          <p className="text-sm text-gray-400 mt-1">{t('ai_assistant.description')}</p>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label htmlFor="ai-keywords" className="block text-sm font-medium text-gray-300 mb-1">
              {t('ai_assistant.keywords_label')}
            </label>
            <textarea
              id="ai-keywords"
              rows={3}
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border rounded-lg focus:outline-none focus:ring-2 border-gray-600 focus:ring-pink-500"
              placeholder="e.g., software engineer, love hiking, family-oriented..."
              disabled={isLoading}
              aria-label={t('ai_assistant.keywords_label')}
            />
          </div>
          
          <Button onClick={handleGenerate} disabled={isLoading} className="w-full">
            {isLoading ? t('ai_assistant.generating') : (generatedText ? t('ai_assistant.regenerate') : t('ai_assistant.generate'))}
          </Button>

          {isLoading && (
             <div className="text-center py-4">
                <div role="status" className="flex justify-center items-center space-x-2">
                    <svg aria-hidden="true" className="w-6 h-6 text-gray-400 animate-spin fill-pink-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0492C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5424 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                    </svg>
                    <span className="text-gray-300">{t('ai_assistant.generating')}</span>
                </div>
             </div>
           )}

          {generatedText && !isLoading && (
            <div className="p-4 bg-white/5 rounded-lg border border-white/10 mt-4 animate-fade-in" aria-live="polite">
              <p className="text-gray-200 whitespace-pre-wrap">{generatedText}</p>
            </div>
          )}
        </div>
        
        <div className="p-6 border-t border-white/10 flex justify-end space-x-4">
          <Button onClick={onClose} variant={ButtonVariant.SECONDARY} className="w-auto" disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleUseText} disabled={!generatedText || isLoading} className="w-auto">
            {t('ai_assistant.use_text')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AIProfileAssistantModal;
