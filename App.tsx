import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header.tsx';
import { InputCard } from './components/InputCard.tsx';
import { ResultsTable } from './components/ResultsTable.tsx';
import { ExportCard } from './components/ExportCard.tsx';
import { Toast } from './components/Toast.tsx';
import { ApiConfigCard } from './components/ApiConfigCard.tsx';
import { Footer } from './components/Footer.tsx';
import { Hero } from './components/Hero.tsx';
import { URLResult, ToastMessage, AIProvider, KeyValidationStatus, AIConfig } from './types.ts';
import { optimizeSlugs } from './services/aiService.ts';
import { fetchUrlsFromSitemap } from './services/sitemapService.ts';
import { URL_BATCH_SIZE, AI_PROVIDERS, AI_MODELS } from './constants.ts';
import { validateApiKey } from './services/validationService.ts';

// Helper to get initial config from localStorage
const getInitialConfig = (): AIConfig => {
  const storedConfig = localStorage.getItem('aiConfig');
  if (storedConfig) {
    return JSON.parse(storedConfig);
  }
  return {
    provider: 'gemini',
    apiKey: '',
    model: AI_MODELS.gemini[0].value,
  };
};

const getInitialValidationStatus = (): Record<AIProvider, KeyValidationStatus> => {
  const stored = localStorage.getItem('keyValidationStatus');
  if (stored) {
    return JSON.parse(stored);
  }
  return AI_PROVIDERS.reduce((acc, p) => ({ ...acc, [p.id]: 'idle' }), {} as Record<AIProvider, KeyValidationStatus>);
};


const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [results, setResults] = useState<URLResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [progressMessage, setProgressMessage] = useState('');
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [aiConfig, setAiConfig] = useState<AIConfig>(getInitialConfig);
  const [keyValidationStatus, setKeyValidationStatus] = useState<Record<AIProvider, KeyValidationStatus>>(getInitialValidationStatus);

  useEffect(() => {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Persist config to localStorage
  useEffect(() => {
    localStorage.setItem('aiConfig', JSON.stringify(aiConfig));
  }, [aiConfig]);

  useEffect(() => {
    localStorage.setItem('keyValidationStatus', JSON.stringify(keyValidationStatus));
  }, [keyValidationStatus]);

  // Automatically set Gemini provider as valid, since its key is from environment.
  useEffect(() => {
    if (aiConfig.provider === 'gemini') {
        setKeyValidationStatus(prev => ({ ...prev, gemini: 'valid' }));
    }
  }, [aiConfig.provider]);


  const toggleDarkMode = () => setIsDarkMode(prev => !prev);
  
  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ id: Date.now(), message, type });
  }, []);

  const handleValidateKey = async (provider: AIProvider, apiKey: string) => {
    if (!apiKey) {
      setKeyValidationStatus(prev => ({ ...prev, [provider]: 'idle' }));
      return;
    }
    setKeyValidationStatus(prev => ({ ...prev, [provider]: 'validating' }));
    const isValid = await validateApiKey(provider, apiKey);
    setKeyValidationStatus(prev => ({ ...prev, [provider]: isValid ? 'valid' : 'invalid' }));
    if (isValid) {
      showToast(`${AI_PROVIDERS.find(p => p.id === provider)?.name} API key is valid!`);
    } else {
      showToast(`${AI_PROVIDERS.find(p => p.id === provider)?.name} API key is invalid.`, 'error');
    }
  };

  const handleOptimize = async (sitemapUrl: string, geoTarget: string) => {
    setIsLoading(true);
    setResults([]);
    
    try {
      setProgressMessage('Crawling sitemap, this may take a moment...');
      const urls = await fetchUrlsFromSitemap(sitemapUrl);
      
      if (urls.length === 0) {
        showToast('No URLs found in the provided sitemap.', 'error');
        setIsLoading(false);
        setProgressMessage('');
        return;
      }
      
      showToast(`Found ${urls.length} URLs. Starting optimization...`, 'success');
      const totalUrls = urls.length;

      for (let i = 0; i < totalUrls; i += URL_BATCH_SIZE) {
        const batch = urls.slice(i, i + URL_BATCH_SIZE);
        const start = i + 1;
        const end = Math.min(i + URL_BATCH_SIZE, totalUrls);
        setProgressMessage(`Analyzing URLs ${start}-${end} of ${totalUrls}...`);
        
        const batchResults = await optimizeSlugs(batch, geoTarget, aiConfig);
        setResults(prev => [...prev, ...batchResults]);
      }
      showToast('Optimization complete!', 'success');
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      showToast(`Error: ${errorMessage}`, 'error');
    } finally {
      setIsLoading(false);
      setProgressMessage('');
    }
  };

  const handleUpdateResult = (id: number, newSlug: string) => {
    setResults(prevResults =>
      prevResults.map(r => (r.id === id ? { ...r, proposedSlug: newSlug } : r))
    );
  };

  const isKeyValid = keyValidationStatus[aiConfig.provider] === 'valid';

  return (
    <div className="min-h-screen text-light-text dark:text-dark-text font-sans flex flex-col">
      <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <main className="p-4 sm:p-8 max-w-7xl mx-auto w-full flex-grow">
        
        {!isLoading && results.length === 0 && <Hero />}

        <div className="space-y-8 mt-8">
          <ApiConfigCard
            config={aiConfig}
            setConfig={setAiConfig}
            validationStatus={keyValidationStatus}
            onValidate={handleValidateKey}
          />
          <InputCard onOptimize={handleOptimize} isLoading={isLoading} progressMessage={progressMessage} disabled={!isKeyValid} />
          
          {results.length > 0 && (
            <>
              <ResultsTable results={results} onUpdateResult={handleUpdateResult} />
              <ExportCard results={results} onShowToast={showToast} />
            </>
          )}

        </div>
      </main>
      <Toast toast={toast} onDismiss={() => setToast(null)} />
      <Footer />
    </div>
  );
};

export default App;
