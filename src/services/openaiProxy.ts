/**
 * OpenAI Proxy Service
 * Routes OpenAI API calls through Supabase Edge Functions to avoid CORS issues
 */

export interface OpenAIProxyRequest {
  model: string;
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  max_tokens?: number;
  temperature?: number;
}

export interface OpenAIProxyResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

/**
 * Call OpenAI API through Supabase Edge Function (proxy)
 * Now supports user's own API key (BYOK model)
 */
export const callOpenAIProxy = async (
  request: OpenAIProxyRequest, 
  userApiKey?: string
): Promise<OpenAIProxyResponse> => {
  const { supabase } = await import('../lib/supabase');
  
  // Get user's API key from localStorage if not provided
  if (!userApiKey) {
    userApiKey = localStorage.getItem('openai_api_key') || undefined;
  }
  
  const { data, error } = await supabase.functions.invoke('openai-proxy', {
    body: {
      ...request,
      userApiKey // Pass user's API key to Edge Function
    }
  });

  if (error) {
    throw new Error(`OpenAI proxy error: ${error.message}`);
  }

  return data;
};
