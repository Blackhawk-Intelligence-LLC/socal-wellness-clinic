# Supabase Edge Functions Setup for Secure API Proxy

## Why Use Edge Functions?

Instead of exposing your Acuity API credentials in the frontend (even as environment variables), you can use Supabase Edge Functions to keep them secure on the server side.

## Setup Steps

### 1. Install Supabase CLI
```bash
brew install supabase/tap/supabase
```

### 2. Create Edge Function
```bash
supabase functions new booking-proxy
```

### 3. Add the Function Code
Create `supabase/functions/booking-proxy/index.ts`:

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get Acuity credentials from environment
    const ACUITY_USER_ID = Deno.env.get('ACUITY_USER_ID')!
    const ACUITY_API_KEY = Deno.env.get('ACUITY_API_KEY')!
    
    // Get request details
    const { endpoint, method, body } = await req.json()
    
    // Make request to Acuity API
    const acuityResponse = await fetch(`https://acuityscheduling.com/api/v1${endpoint}`, {
      method: method || 'GET',
      headers: {
        'Authorization': 'Basic ' + btoa(`${ACUITY_USER_ID}:${ACUITY_API_KEY}`),
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    })

    const data = await acuityResponse.json()

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: acuityResponse.status,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
```

### 4. Set Secrets in Supabase Dashboard
Go to your Supabase project dashboard:
1. Navigate to Settings → Secrets
2. Add your secrets:
   - `ACUITY_USER_ID`
   - `ACUITY_API_KEY`

### 5. Deploy the Function
```bash
supabase functions deploy booking-proxy --project-ref phflhiiojlacaanpkvho
```

### 6. Update Your Frontend Code
Update `src/services/bookingApi.js` to use the Edge Function:

```javascript
const EDGE_FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/booking-proxy`;

async function callAcuityAPI(endpoint, method = 'GET', body = null) {
  const response = await fetch(EDGE_FUNCTION_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ endpoint, method, body }),
  });
  
  return response.json();
}
```

## Vercel Deployment

Now you only need these environment variables in Vercel:
- `VITE_SUPABASE_URL` (public)
- `VITE_SUPABASE_ANON_KEY` (public)

The sensitive Acuity credentials stay secure in Supabase!

## Alternative: Direct Vercel Env Vars

If you prefer the simpler approach, just add all variables directly in Vercel:
1. Go to your Vercel project settings
2. Navigate to Environment Variables
3. Add each variable for Production environment
4. Redeploy 