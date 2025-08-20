import React from 'react';

const tools = [
  { name: 'SEO Orchestrator', description: 'The master tool to coordinate your entire SEO strategy, from keywords to content, ensuring topical authority.' },
  { name: 'ContentForge AI', description: 'Instantly embed AI-generated interactive tools to captivate readers and dominate search rankings. Go from static text to an interactive experience in minutes, not days.' },
  { name: 'WordPress Content Optimizer Pro', description: 'Directly optimize your WordPress content for higher rankings with deep semantic analysis.' },
  { name: 'Photo AI Enhancer', description: 'Upscale, de-noise, and enhance your images to professional quality, boosting visual appeal and page speed.' },
  { name: 'AI Slug Optimizer', description: 'Generate perfectly optimized, keyword-rich URL slugs that search engines and users love.' },
  { name: 'AI Co-pilot', description: 'Architect high-impact, credible social media campaigns that actually convert.' },
];

export const ArsenalSection: React.FC = () => {
  return (
    <div className="bg-light-card dark:bg-dark-card backdrop-blur-lg p-6 sm:p-8 my-8 rounded-2xl shadow-xl border border-black/5 dark:border-white/5">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-light-text dark:text-dark-secondary tracking-tight">
          Dominate Your Niche with an Unfair Advantage
        </h2>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600 dark:text-gray-400">
          We don't just offer tools; we deliver an integrated AI-powered ecosystem that builds lasting Topical Authority, making your content the definitive source in your field.
        </p>
        
        <div className="mt-12">
            <h3 className="text-2xl font-bold text-light-text dark:text-dark-secondary">Your Complete SEO Arsenal</h3>
            <p className="mt-2 text-md text-gray-500 dark:text-gray-400">A synergistic suite of tools designed to work together, amplifying your results.</p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3 text-left">
          {tools.map((tool) => (
            <div key={tool.name} className={`p-6 bg-gray-50/50 dark:bg-slate-900/50 rounded-xl relative transition-all duration-300 ${tool.name === 'AI Slug Optimizer' ? 'ring-2 ring-light-primary dark:ring-dark-primary' : 'ring-1 ring-black/5 dark:ring-white/5'}`}>
              {tool.name === 'AI Slug Optimizer' && (
                <span className="absolute top-0 right-0 -mt-3 -mr-3 px-3 py-1 bg-light-primary dark:bg-dark-primary text-white text-xs font-bold rounded-full shadow-md">
                  You are here
                </span>
              )}
              <h4 className="text-lg font-bold text-light-primary dark:text-dark-primary">{tool.name}</h4>
              <p className="mt-2 text-sm text-light-text dark:text-dark-text">{tool.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <a
            href="https://viral-post.affiliatemarketingforsuccess.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-bold rounded-xl text-white bg-light-primary hover:bg-light-primary-hover dark:bg-dark-primary dark:hover:bg-dark-primary-hover transform hover:scale-105 transition-transform duration-200 shadow-lg"
          >
            Dominate Your Niche – Unlock Your Complete AI-Powered SEO Arsenal
          </a>
        </div>
      </div>
    </div>
  );
};
