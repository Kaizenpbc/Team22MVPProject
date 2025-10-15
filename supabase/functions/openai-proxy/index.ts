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
    // Get OpenAI API key from environment
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured in Supabase secrets')
    }

    // Get request body
    const requestBody = await req.json()
    
    // Forward request to OpenAI
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
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
