import React, { useState } from 'react';
import { URLResult, ExportType } from '../types';
import { generatePluginZip, generateWpCliCommands, generateSqlScript } from '../services/exportService';
import { Modal } from './Modal';

interface ExportCardProps {
  results: URLResult[];
  onShowToast: (message: string, type?: 'success' | 'error') => void;
}

const CopyIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>);
const DownloadIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>);

export const ExportCard: React.FC<ExportCardProps> = ({ results, onShowToast }) => {
  const [activeTab, setActiveTab] = useState<ExportType>(ExportType.PLUGIN);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (results.length === 0) {
    return null;
  }
  
  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    onShowToast('Copied to clipboard!');
  };

  const handleDownloadPlugin = () => {
    generatePluginZip(results);
    onShowToast('Plugin download started!');
  };

  const handleShowSql = () => {
    setIsModalOpen(true);
  };
  
  const handleConfirmSql = () => {
    setIsModalOpen(false);
    setActiveTab(ExportType.SQL);
  };
  
  const getTabClassName = (tab: ExportType) => {
    return `px-4 py-2 text-sm font-medium rounded-md focus:outline-none transition-colors duration-200 ${
      activeTab === tab 
      ? 'bg-light-primary text-white dark:bg-dark-primary' 
      : 'text-gray-600 hover:bg-gray-200/50 dark:text-dark-text dark:hover:bg-dark-border/50'
    }`;
  };

  const wpCliContent = generateWpCliCommands(results);
  const sqlContent = generateSqlScript(results);

  return (
    <div className="bg-light-card dark:bg-dark-card backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-black/5 dark:border-white/5">
      <h2 className="text-xl font-semibold mb-4 text-light-text dark:text-dark-secondary">
        4. Export & Implement
      </h2>
      <div className="mb-4 border-b border-light-border dark:border-dark-border">
          <nav className="flex space-x-2" aria-label="Tabs">
            <button onClick={() => setActiveTab(ExportType.PLUGIN)} className={getTabClassName(ExportType.PLUGIN)}>
              WordPress Plugin (Safe)
            </button>
            <button onClick={() => setActiveTab(ExportType.WP_CLI)} className={getTabClassName(ExportType.WP_CLI)}>
              WP-CLI Commands (Advanced)
            </button>
            <button onClick={handleShowSql} className={getTabClassName(ExportType.SQL)}>
              SQL Script (Expert)
            </button>
          </nav>
      </div>

      <div>
        {activeTab === ExportType.PLUGIN && (
          <div>
            <p className="text-sm mb-4 text-light-text dark:text-dark-text">This is the safest method. Download the generated plugin, upload it to your WordPress site, and activate it. It will automatically create 301 redirects from the old URLs to the new ones, preserving your SEO value.</p>
            <button
              onClick={handleDownloadPlugin}
              className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-light-success hover:bg-green-700 dark:bg-dark-success focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <DownloadIcon/> Download Plugin.zip
            </button>
          </div>
        )}
        {activeTab === ExportType.WP_CLI && (
          <div>
            <p className="text-sm mb-4 text-light-text dark:text-dark-text">For developers. Run these commands via SSH on your server. This performs a comprehensive search-and-replace in your database. Always make a backup first: `wp db export`</p>
            <div className="relative">
              <pre className="bg-gray-100 dark:bg-slate-900/80 text-light-text dark:text-dark-text p-4 rounded-md overflow-x-auto max-h-60">
                <code>{wpCliContent}</code>
              </pre>
              <button onClick={() => handleCopy(wpCliContent)} className="absolute top-2 right-2 p-2 rounded-md bg-gray-300 dark:bg-dark-border hover:bg-gray-400 dark:hover:bg-gray-600">
                <CopyIcon/>
              </button>
            </div>
          </div>
        )}
        {activeTab === ExportType.SQL && (
           <div>
            <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
              <span className="font-medium">Danger!</span> This is a high-risk operation. Running incorrect SQL can break your site. You must manually adapt these queries for all necessary database columns. The WP-CLI method is strongly preferred.
            </div>
            <div className="relative">
              <pre className="bg-gray-100 dark:bg-slate-900/80 text-light-text dark:text-dark-text p-4 rounded-md overflow-x-auto max-h-60">
                <code>{sqlContent}</code>
              </pre>
              <button onClick={() => handleCopy(sqlContent)} className="absolute top-2 right-2 p-2 rounded-md bg-gray-300 dark:bg-dark-border hover:bg-gray-400 dark:hover:bg-gray-600">
                <CopyIcon/>
              </button>
            </div>
          </div>
        )}
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmSql}
        title="SQL Script Warning"
      >
        <p className="text-sm text-light-text dark:text-dark-text">
            Generating a raw SQL script is extremely risky and can cause permanent data loss if used incorrectly.
            <br/><br/>
            Please confirm that you have created a complete backup of your WordPress database before proceeding.
        </p>
      </Modal>
    </div>
  );
};