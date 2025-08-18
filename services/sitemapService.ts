const processedSitemaps = new Set<string>();
const allUrls = new Set<string>();

const parseAndExtractUrls = async (url: string): Promise<void> => {
  if (processedSitemaps.has(url)) {
    return;
  }
  processedSitemaps.add(url);

  // Use a CORS proxy to bypass browser same-origin policy restrictions.
  const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
  const response = await fetch(proxyUrl);

  if (!response.ok) {
    throw new Error(`Failed to fetch sitemap: ${response.statusText} (${response.status}) from ${url}`);
  }

  const xmlText = await response.text();
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, 'application/xml');

  const parserError = xmlDoc.querySelector('parsererror');
  if (parserError) {
    throw new Error(`Error parsing XML from ${url}. Make sure it is a valid XML sitemap.`);
  }

  // It's a sitemap index file, recursively parse the sitemaps listed.
  const sitemapNodes = xmlDoc.querySelectorAll('sitemap > loc');
  if (sitemapNodes.length > 0) {
    const sitemapUrls = Array.from(sitemapNodes)
      .map(node => node.textContent?.trim())
      .filter((sitemapUrl): sitemapUrl is string => !!sitemapUrl);
    
    await Promise.all(sitemapUrls.map(sitemapUrl => parseAndExtractUrls(sitemapUrl)));
    return;
  }
  
  // It's a regular sitemap with URLs.
  const urlNodes = xmlDoc.querySelectorAll('url > loc');
  if (urlNodes.length > 0) {
    urlNodes.forEach(node => {
      if (node.textContent) {
        allUrls.add(node.textContent.trim());
      }
    });
    return;
  }
};


export const fetchUrlsFromSitemap = async (sitemapUrl: string): Promise<string[]> => {
  processedSitemaps.clear();
  allUrls.clear();

  try {
    await parseAndExtractUrls(sitemapUrl);
    return Array.from(allUrls);
  } catch (error) {
    console.error("Sitemap crawling failed:", error);
    if (error instanceof TypeError) { // Often "Failed to fetch" is a TypeError
        throw new Error("Could not fetch sitemap. Please ensure the URL is correct and publicly accessible.");
    }
    throw error;
  }
};