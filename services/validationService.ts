import { AIProvider } from "../types.ts";

const validateOpenAIKey = async (apiKey: string, provider: 'openai' | 'openrouter'): Promise<boolean> => {
    const url = provider === 'openai' ? 'https://api.openai.com/v1/models' : 'https://openrouter.ai/api/v1/models';
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${apiKey}` },
        });
        return response.ok;
    } catch (error) {
        console.error(`${provider} validation error:`, error);
        return false;
    }
};

const validateClaudeKey = async (apiKey: string): Promise<boolean> => {
    try {
        // We use corsproxy.io because Anthropic API doesn't support CORS headers for browser-side requests.
        const response = await fetch('https://corsproxy.io/?' + encodeURIComponent('https://api.anthropic.com/v1/messages'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: "claude-3-haiku-20240307",
                max_tokens: 1,
                messages: [{ role: "user", content: "test" }]
            }),
        });
        // A 400 bad request error means the key is valid but the request is malformed (which is fine for validation).
        // A 401/403 means the key is invalid.
        return response.status === 400 || response.ok;
    } catch (error) {
        console.error("Claude validation error:", error);
        return false;
    }
};

export const validateApiKey = async (provider: AIProvider, apiKey: string): Promise<boolean> => {
    if (provider === 'gemini') {
        // Assume key is provided via environment variables and is always valid, per project setup.
        return true;
    }
    
    if (!apiKey) return false;

    switch (provider) {
        case 'openai':
            return await validateOpenAIKey(apiKey, 'openai');
        case 'openrouter':
            return await validateOpenAIKey(apiKey, 'openrouter');
        case 'claude':
            return await validateClaudeKey(apiKey);
        default:
            return false;
    }
};
