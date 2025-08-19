import React, { useState } from 'react';
import { URLResult } from '../types.ts';
import { INITIAL_DISPLAY_COUNT } from '../constants.ts';

interface ResultsTableProps {
  results: URLResult[];
  onUpdateResult: (id: number, newSlug: string) => void;
}

export const ResultsTable: React.FC<ResultsTableProps> = ({ results, onUpdateResult }) => {
  const [visibleCount, setVisibleCount] = useState(INITIAL_DISPLAY_COUNT);

  if (results.length === 0) {
    return null;
  }

  const visibleResults = results.slice(0, visibleCount);

  return (
    <div className="bg-light-card dark:bg-dark-card backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-black/5 dark:border-white/5">
      <h2 className="text-xl font-semibold mb-4 text-light-text dark:text-dark-secondary">
        3. Review & Refine Slugs
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-light-border dark:divide-dark-border">
          <thead className="bg-gray-50/50 dark:bg-slate-900/50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Original URL
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Current Slug
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Proposed Slug (Editable)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-light-border dark:divide-dark-border">
            {visibleResults.map((result) => (
              <tr key={result.id} className="hover:bg-gray-50/20 dark:hover:bg-slate-800/20">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-light-text dark:text-dark-text truncate max-w-xs">
                  <a href={result.originalUrl} target="_blank" rel="noopener noreferrer" className="hover:text-light-primary dark:hover:text-dark-primary">{result.originalUrl}</a>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  /{result.currentSlug}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <input
                    type="text"
                    value={result.proposedSlug}
                    onChange={(e) => onUpdateResult(result.id, e.target.value)}
                    className="w-full p-1 border rounded-md bg-gray-50 dark:bg-slate-900/80 dark:border-dark-border text-light-text dark:text-dark-text focus:ring-1 focus:ring-light-primary dark:focus:ring-dark-primary"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {visibleCount < results.length && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setVisibleCount(prev => prev + INITIAL_DISPLAY_COUNT)}
            className="px-4 py-2 border border-light-border dark:border-dark-border text-sm font-medium rounded-md text-light-primary dark:text-dark-primary hover:bg-gray-50/50 dark:hover:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-light-primary"
          >
            Load More Results
          </button>
        </div>
      )}
    </div>
  );
};