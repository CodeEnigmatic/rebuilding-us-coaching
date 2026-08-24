import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
}

function readNamedKey(variable: string, legacyVariable: string): string {
  const value = Deno.env.get(variable)
  if (value) {
    const keys = JSON.parse(value) as Record<string, string>
    if (keys.default) return keys.default
  }
  return Deno.env.get(legacyVariable) ?? ''
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const authorization = request.headers.get('Authorization') ?? ''
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const publishableKey = readNamedKey('SUPABASE_PUBLISHABLE_KEYS', 'SUPABASE_ANON_KEY')
    const secretKey = readNamedKey('SUPABASE_SECRET_KEYS', 'SUPABASE_SERVICE_ROLE_KEY')
    const resendApiKey = Deno.env.get('RESEND_API_KEY') ?? ''
    const destination = Deno.env.get('ADMIN_SUPPORT_EMAIL') ?? 'Liveaustellarlife@gmail.com'
    const sender = Deno.env.get('SUPPORT_FROM_EMAIL') ?? 'AU-STELLAR LIFE <onboarding@resend.dev>'

    if (!authorization || !supabaseUrl || !publishableKey || !secretKey || !resendApiKey) {
      throw new Error('Support request service is not configured.')
    }

    const authClient = createClient(supabaseUrl, publishableKey, {
      global: { headers: { Authorization: authorization } },
      auth: { persistSession: false },
    })
    const { data: { user }, error: userError } = await authClient.auth.getUser()
    if (userError || !user?.email) return Response.json({ error: 'Authentication required.' }, { status: 401, headers: corsHeaders })

    const body = await request.json() as { message?: unknown; displayName?: unknown }
    const message = typeof body.message === 'string' ? body.message.trim() : ''
    const displayName = typeof body.displayName === 'string' ? body.displayName.trim().slice(0, 100) : ''
    if (message.length < 10 || message.length > 2000) {
      return Response.json({ error: 'Write between 10 and 2,000 characters.' }, { status: 400, headers: corsHeaders })
    }

    const adminClient = createClient(supabaseUrl, secretKey, { auth: { persistSession: false } })
    const { data: savedRequest, error: insertError } = await adminClient.from('support_requests').insert({
      user_id: user.id,
      email: user.email,
      display_name: displayName || null,
      message,
    }).select('id').single()
    if (insertError) throw insertError

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${resendApiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: sender,
        to: [destination],
        reply_to: user.email,
        subject: `Client portal question from ${displayName || user.email}`,
        text: `Client: ${displayName || 'Not provided'}\nEmail: ${user.email}\nUser ID: ${user.id}\n\nQuestion or need:\n${message}`,
      }),
    })
    const emailResult = await emailResponse.json() as { id?: string; message?: string }
    if (!emailResponse.ok) throw new Error(`${emailResult.message ?? 'Email delivery failed.'} Your message was saved in the admin inbox.`)
    await adminClient.from('support_requests').update({ email_delivery_id: emailResult.id ?? null }).eq('id', savedRequest.id)

    return Response.json({ success: true }, { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : 'Request failed.' }, { status: 500, headers: corsHeaders })
  }
})
