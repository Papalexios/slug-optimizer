import React from 'react';

const valuableLinks = [
  { title: 'Build an Effective SEO Strategy', url: 'https://affiliatemarketingforsuccess.com/seo/build-an-effective-seo-strategy/' },
  { title: 'The Power of AI in SEO', url: 'https://affiliatemarketingforsuccess.com/affiliate-marketing/the-power-of-ai-in-seo/' },
  { title: 'Website Architecture That Drives Conversions', url: 'https://affiliatemarketingforsuccess.com/seo/website-architecture-that-drives-conversions/' },
];

export const Footer: React.FC = () => {
  return (
    <footer className="bg-transparent mt-8 py-6 px-8 border-t border-light-border dark:border-dark-border">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        <div className="md:col-span-1">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; 2025 Affiliate Marketing For Success. All rights reserved.
          </p>
        </div>
        <div className="md:col-span-2">
          <h3 className="font-semibold text-light-text dark:text-dark-secondary">Learn More About SEO & AI</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {valuableLinks.map(link => (
              <li key={link.url}>
                <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-light-primary dark:text-dark-primary hover:underline">
                  {link.title}
                </a>
              </li>
            ))}
             <li>
                <a href="https://affiliatemarketingforsuccess.com/blog/" target="_blank" rel="noopener noreferrer" className="text-light-primary dark:text-dark-primary hover:underline font-bold">
                  Visit Our Blog &rarr;
                </a>
              </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};