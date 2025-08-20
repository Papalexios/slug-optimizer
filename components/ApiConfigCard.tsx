import React from 'react';
import { AIConfig, AIProvider, KeyValidationStatus } from '../types.ts';
import { AI_PROVIDERS, AI_MODELS } from '../constants.ts';

interface ApiConfigCardProps {
  config: AIConfig;
  setConfig: React.Dispatch<React.SetStateAction<AIConfig>>;
  validationStatus: Record<AIProvider, KeyValidationStatus>;
  onValidate: (provider: AIProvider, apiKey: string) => void;
}

const ValidatingIcon = () => <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;
const ValidIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-light-success dark:text-dark-success" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>;
const InvalidIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-light-danger dark:text-dark-danger" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>;

export const ApiConfigCard: React.FC<ApiConfigCardProps> = ({ config, setConfig, validationStatus, onValidate }) => {
  const currentProvider = config.provider;
  const currentStatus = validationStatus[currentProvider];
  
  const handleProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newProvider = e.target.value as AIProvider;
    const newModel = AI_MODELS[newProvider]?.[0]?.value || '';
    setConfig(prev => ({ ...prev, provider: newProvider, model: newModel, apiKey: '' }));
  };

  return (
    <div className="bg-light-card dark:bg-dark-card backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-black/5 dark:border-white/5">
      <h2 className="text-xl font-semibold mb-4 text-light-text dark:text-dark-secondary">
        1. Configure AI Provider
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="aiProvider" className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
            AI Provider
          </label>
          <select
            id="aiProvider"
            value={currentProvider}
            onChange={handleProviderChange}
            className="w-full p-2 border rounded-md bg-gray-50 dark:bg-slate-900/80 dark:border-dark-border text-light-text dark:text-dark-text focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary"
          >
            {AI_PROVIDERS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div>
            <label htmlFor="model" className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                Model
            </label>
            {currentProvider === 'openrouter' ? (
                 <input
                    type="text"
                    id="model"
                    value={config.model}
                    onChange={(e) => setConfig(prev => ({...prev, model: e.target.value}))}
                    className="w-full p-2 border rounded-md bg-gray-50 dark:bg-slate-900/80 dark:border-dark-border text-light-text dark:text-dark-text focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary"
                    placeholder="e.g., mistralai/mistral-7b-instruct"
                />
            ) : (
                <select
                    id="model"
                    value={config.model}
                    onChange={(e) => setConfig(prev => ({...prev, model: e.target.value}))}
                    className="w-full p-2 border rounded-md bg-gray-50 dark:bg-slate-900/80 dark:border-dark-border text-light-text dark:text-dark-text focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary"
                >
                    {AI_MODELS[currentProvider].map(m => <option key={m.value} value={m.value}>{m.name}</option>)}
                </select>
            )}
        </div>
      </div>
      <div className="mt-4">
          <>
            <label htmlFor="apiKey" className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
              {AI_PROVIDERS.find(p => p.id === currentProvider)?.name} API Key
            </label>
            <div className="flex items-center gap-2">
              <input
                id="apiKey"
                type="password"
                value={config.apiKey}
                onChange={(e) => setConfig(prev => ({...prev, apiKey: e.target.value}))}
                className="flex-grow p-2 border rounded-md bg-gray-50 dark:bg-slate-900/80 dark:border-dark-border text-light-text dark:text-dark-text focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary"
                placeholder="Enter your API key"
              />
              <div className="flex-shrink-0 w-28 text-center">
                <button
                    onClick={() => onValidate(currentProvider, config.apiKey)}
                    disabled={!config.apiKey || currentStatus === 'validating'}
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-light-primary hover:bg-light-primary-hover dark:bg-dark-primary dark:hover:bg-dark-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-light-primary disabled:bg-gray-400"
                >
                    {currentStatus === 'validating' ? <ValidatingIcon/> : 'Validate'}
                </button>
              </div>
              <div className="w-20 flex items-center gap-2 text-sm">
                    {currentStatus === 'valid' && <><ValidIcon /> <span className="text-light-success dark:text-dark-success">Valid</span></>}
                    {currentStatus === 'invalid' && <><InvalidIcon /> <span className="text-light-danger dark:text-dark-danger">Invalid</span></>}
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Your API key is stored securely in your browser's local storage and is never sent to our servers.
              </p>
          </>
      </div>
    </div>
  );
};
