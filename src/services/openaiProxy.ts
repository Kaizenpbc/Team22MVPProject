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
 */
export const callOpenAIProxy = async (request: OpenAIProxyRequest): Promise<OpenAIProxyResponse> => {
  const { supabase } = await import('../lib/supabase');
  
  const { data, error } = await supabase.functions.invoke('openai-proxy', {
    body: request
  });

  if (error) {
    throw new Error(`OpenAI proxy error: ${error.message}`);
  }

  return data;
};
