import { GoogleGenAI, Type } from "@google/genai";
import { URLResult, AIConfig } from '../types';

const getSlug = (url: string): string => {
  try {
    const path = new URL(url).pathname;
    const slug = path.startsWith('/') ? path.substring(1) : path;
    return slug.endsWith('/') ? slug.slice(0, -1) : slug;
  } catch (e) {
    return 'invalid-url';
  }
};

const getBasePrompt = (geoTarget: string, urls: string[]): string => `
  You are an expert SEO specialist for WordPress websites. 
  Your task is to rewrite URL slugs to be more SEO-friendly and geo-targeted.
  The geo-target is: "${geoTarget}".

  Follow these rules:
  1.  Create short, descriptive, keyword-rich slugs.
  2.  Incorporate the geo-target "${geoTarget}" naturally where it makes sense. If the page is not location-specific (e.g., 'about-us', 'contact'), do not force the geo-target.
  3.  Use hyphens (-) to separate words.
  4.  Use lowercase letters only.
  5.  Remove common stop words (e.g., 'a', 'the', 'in').
  6.  Ensure the new slug is a clear improvement over the old one for SEO.
  7.  The original URLs provided are: ${urls.join(', ')}.
`;

const mapResults = (apiResponse: any[], urls: string[]): URLResult[] => {
  if (!Array.isArray(apiResponse)) {
    throw new Error("AI response was not a valid JSON array.");
  }
  
  const resultMap = new Map<string, string>();
  apiResponse.forEach((item: { originalUrl: string; proposedSlug: string; }) => {
    if (item.originalUrl && item.proposedSlug) {
      resultMap.set(item.originalUrl, item.proposedSlug);
    }
  });

  return urls.map((url, index) => ({
    id: Date.now() + index,
    originalUrl: url,
    currentSlug: getSlug(url),
    proposedSlug: resultMap.get(url) || getSlug(url),
  }));
};

const handleApiError = (error: any, provider: string): never => {
    console.error(`Error calling ${provider} API:`, error);
    let message = 'An unknown error occurred.';
    if (error.message) {
        message = error.message;
    }
    if (error.status === 401) {
        message = `Authentication failed. Please check your ${provider} API key.`;
    }
    throw new Error(message);
}

const optimizeWithGemini = async (urls: string[], geoTarget: string, config: AIConfig): Promise<URLResult[]> => {
  const ai = new GoogleGenAI({ apiKey: config.apiKey });
  const prompt = getBasePrompt(geoTarget, urls) + `
    Return a JSON array of objects, where each object has two keys: "originalUrl" and "proposedSlug".
  `;

  try {
    const response = await ai.models.generateContent({
      model: config.model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              originalUrl: { type: Type.STRING },
              proposedSlug: { type: Type.STRING },
            },
            required: ["originalUrl", "proposedSlug"],
          },
        },
      },
    });
    
    const textResponse = response.text.trim();
    const result = JSON.parse(textResponse);
    return mapResults(result, urls);

  } catch (error) {
    handleApiError(error, 'Gemini');
  }
};

const optimizeWithOpenAI = async (urls: string[], geoTarget: string, config: AIConfig): Promise<URLResult[]> => {
    const prompt = getBasePrompt(geoTarget, urls);
    const apiURL = config.provider === 'openrouter' 
        ? 'https://openrouter.ai/api/v1/chat/completions'
        : 'https://api.openai.com/v1/chat/completions';
    
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
    };

    if (config.provider === 'openrouter') {
        headers['HTTP-Referer'] = 'https://wordpress-slug-optimizer.web.app';
        headers['X-Title'] = 'WP Slug Optimizer';
    }

    try {
        const res = await fetch(apiURL, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                model: config.model,
                messages: [
                    { role: 'system', content: 'You are an SEO expert. Respond with only a valid JSON array of objects with keys "originalUrl" and "proposedSlug".' },
                    { role: 'user', content: prompt }
                ],
                response_format: { type: 'json_object' }
            }),
        });
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error.message || `HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        const jsonContent = JSON.parse(data.choices[0].message.content);
        // The JSON object might be wrapped, e.g. {"results": [...]}, so we find the first array.
        const arrayResult = Array.isArray(jsonContent) ? jsonContent : Object.values(jsonContent).find(Array.isArray);
        return mapResults(arrayResult || [], urls);
    } catch(error) {
        handleApiError(error, config.provider === 'openrouter' ? 'OpenRouter' : 'OpenAI');
    }
};

const optimizeWithClaude = async (urls: string[], geoTarget: string, config: AIConfig): Promise<URLResult[]> => {
    const prompt = getBasePrompt(geoTarget, urls);
    try {
        const res = await fetch('https://corsproxy.io/?https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': config.apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: config.model,
                max_tokens: 4096,
                system: 'You are an SEO expert. Your task is to return a valid JSON array of objects, where each object has "originalUrl" and "proposedSlug" keys. Respond ONLY with the JSON array, without any surrounding text or markdown formatting.',
                messages: [{ role: 'user', content: prompt }],
            }),
        });
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error.message || `HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        const textContent = data.content[0].text;
        const jsonResult = JSON.parse(textContent);
        return mapResults(jsonResult, urls);
    } catch(error) {
        handleApiError(error, 'Claude');
    }
};


export const optimizeSlugs = async (
  urls: string[], 
  geoTarget: string,
  config: AIConfig
): Promise<URLResult[]> => {
    try {
        switch(config.provider) {
            case 'gemini':
                return await optimizeWithGemini(urls, geoTarget, config);
            case 'openai':
            case 'openrouter':
                return await optimizeWithOpenAI(urls, geoTarget, config);
            case 'claude':
                return await optimizeWithClaude(urls, geoTarget, config);
            default:
                throw new Error('Unsupported AI provider');
        }
    } catch (error) {
        console.error("Error during slug optimization:", error);
        if (error instanceof Error) {
            throw error;
        }
        throw new Error("An unknown error occurred during optimization.");
    }
};
