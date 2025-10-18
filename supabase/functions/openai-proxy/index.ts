import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get request body
    const requestBody = await req.json()
    
    // Get OpenAI API key - prioritize user's key, fallback to server key
    let openaiApiKey = requestBody.userApiKey || req.headers.get('x-openai-key')
    
    // Fallback to server key for backward compatibility or admin features
    if (!openaiApiKey) {
      openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    }
    
    if (!openaiApiKey) {
      throw new Error('OpenAI API key required. Please configure your API key in Settings.')
    }
    
    // Remove userApiKey from request body before sending to OpenAI
    const { userApiKey, ...openaiRequest } = requestBody
    
    // Forward request to OpenAI
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(openaiRequest),
    })

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text()
      throw new Error(`OpenAI API error: ${openaiResponse.status} ${errorText}`)
    }

    const data = await openaiResponse.json()

    return new Response(
      JSON.stringify(data),
      {
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        },
        status: 200,
      },
    )

  } catch (error) {
    console.error('OpenAI proxy error:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message 
      }),
      {
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        },
        status: 400,
      },
    )
  }
})
