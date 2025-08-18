import React, { useState } from 'react';

interface InputCardProps {
  onOptimize: (sitemapUrl: string, geoTarget: string) => void;
  isLoading: boolean;
  progressMessage: string;
  disabled: boolean;
}

const LoadingIcon = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

export const InputCard: React.FC<InputCardProps> = ({ onOptimize, isLoading, progressMessage, disabled }) => {
  const [sitemapUrl, setSitemapUrl] = useState('');
  const [geoTarget, setGeoTarget] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (sitemapUrl.trim() && geoTarget.trim()) {
      onOptimize(sitemapUrl.trim(), geoTarget.trim());
    }
  };

  return (
    <div className={`bg-light-card dark:bg-dark-card backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-black/5 dark:border-white/5 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      <h2 className="text-xl font-semibold mb-4 text-light-text dark:text-dark-secondary">
        2. Input Your Data
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="sitemapUrl" className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
            Enter Sitemap URL
          </label>
          <input
            id="sitemapUrl"
            type="url"
            value={sitemapUrl}
            onChange={(e) => setSitemapUrl(e.target.value)}
            className="w-full p-2 border rounded-md bg-gray-50 dark:bg-slate-900/80 dark:border-dark-border text-light-text dark:text-dark-text focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary"
            placeholder="https://example.com/sitemap.xml"
            disabled={isLoading || disabled}
            required
          />
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            The app will automatically crawl your sitemap to find all published pages. We use a proxy to handle common access issues.
          </p>
        </div>
        <div className="mb-4">
          <label htmlFor="geoTarget" className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
            Geo-Target (e.g., "San Francisco", "London")
          </label>
          <input
            type="text"
            id="geoTarget"
            value={geoTarget}
            onChange={(e) => setGeoTarget(e.target.value)}
            className="w-full p-2 border rounded-md bg-gray-50 dark:bg-slate-900/80 dark:border-dark-border text-light-text dark:text-dark-text focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary"
            placeholder="Enter city, state, or region"
            disabled={isLoading || disabled}
            required
          />
        </div>
        <div className="flex items-center justify-between">
            <button
                type="submit"
                disabled={isLoading || disabled || !sitemapUrl || !geoTarget}
                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-xl shadow-lg text-white bg-light-primary hover:bg-light-primary-hover dark:bg-dark-primary dark:hover:bg-dark-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-light-primary dark:focus:ring-dark-primary disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transform hover:scale-105 transition-transform duration-200"
                >
                {isLoading && <LoadingIcon />}
                {isLoading ? 'Processing...' : 'Crawl & Optimize Slugs'}
            </button>
            {isLoading && (
                <div className="text-sm text-light-text dark:text-dark-text font-medium">
                    {progressMessage}
                </div>
            )}
        </div>
      </form>
    </div>
  );
};