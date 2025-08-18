import React from 'react';

const BrainIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-light-primary dark:text-dark-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h7.5M8.25 12h7.5m-7.5 5.25h7.5M3 13.5a13.43 13.43 0 003.262 9.134.563.563 0 00.916.037l2.102-3.235a1.125 1.125 0 011.942 0l2.102 3.235a.563.563 0 00.916-.037A13.43 13.43 0 0021 13.5a1.125 1.125 0 00-1.125-1.125h-1.5a1.125 1.125 0 01-1.125-1.125V9.375m-10.5 3.375V9.375m-1.5-1.5a1.125 1.125 0 011.125-1.125h1.5a1.125 1.125 0 001.125-1.125V3.375c0-.621-.504-1.125-1.125-1.125h-1.5A1.125 1.125 0 006 3.375v3.375c0 .621.504 1.125 1.125 1.125h1.5m6-4.875a1.125 1.125 0 011.125-1.125h1.5a1.125 1.125 0 011.125 1.125v3.375c0 .621-.504 1.125-1.125 1.125h-1.5a1.125 1.125 0 00-1.125 1.125V9.375" />
  </svg>
);
const PluginIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-light-primary dark:text-dark-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);
const CodeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-light-primary dark:text-dark-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
  </svg>
);

const features = [
  {
    icon: <BrainIcon />,
    title: 'Multi-AI Engine Access',
    description: 'Leverage the best AI for the job. Choose from top-tier models by Google, OpenAI, Anthropic, and more via OpenRouter.',
  },
  {
    icon: <PluginIcon />,
    title: 'One-Click Plugin Export',
    description: 'The safest implementation method. Generate a custom WordPress plugin to handle all 301 redirects instantly and without errors.',
  },
  {
    icon: <CodeIcon />,
    title: 'Pro-Developer Toolkit',
    description: 'For advanced users. Export your results as WP-CLI commands or raw SQL scripts for granular control and integration.',
  },
];

export const Hero: React.FC = () => {
  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-light-text dark:text-dark-secondary mb-4 tracking-tight">
          Transform Your SEO with AI-Powered URL Optimization
        </h1>
        <p className="max-w-4xl mx-auto mt-6 text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-light-primary to-green-500 dark:from-dark-primary dark:to-green-400">
          The only optimizer that generates a ready-to-install WordPress plugin for instant, safe, 301 redirects.
        </p>
      </div>

      <div className="mt-20 max-w-7xl mx-auto grid gap-8 md:grid-cols-3">
        {features.map((feature, index) => (
          <div key={index} className="bg-light-card/70 dark:bg-dark-card/70 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-black/5 dark:border-white/5 text-center">
            <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-light-primary/10 dark:bg-dark-primary/20 mx-auto">
              {feature.icon}
            </div>
            <h3 className="mt-6 text-lg font-bold text-light-text dark:text-dark-secondary">{feature.title}</h3>
            <p className="mt-2 text-base text-gray-600 dark:text-gray-400">{feature.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-20 max-w-3xl mx-auto">
        <figure className="bg-light-card/70 dark:bg-dark-card/70 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-black/5 dark:border-white/5">
          <blockquote className="text-center text-xl font-medium leading-9 text-light-text dark:text-dark-text">
            <p>"This is the only tool that understood I needed a safe, foolproof way to implement hundreds of redirects. The plugin generation is a game-changer. It saved me a full day of tedious, high-risk database work."</p>
          </blockquote>
          <figcaption className="mt-8">
            <div className="text-center text-base text-gray-600 dark:text-gray-400">
              <span className="font-bold">Sarah L.</span> – Senior WordPress Developer
            </div>
          </figcaption>
        </figure>
      </div>
    </div>
  );
};
