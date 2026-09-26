import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
}

const responseHeaders = { ...corsHeaders, 'Content-Type': 'application/json' }
const membershipTiers = new Set(['individual', 'relationship', 'community'])

function readProjectKey(namedVariable: string, currentVariable: string, legacyVariable: string): string {
  const namedKeys = Deno.env.get(namedVariable)
  if (namedKeys) {
    try {
      const parsedKeys = JSON.parse(namedKeys) as Record<string, string>
      if (parsedKeys.default) return parsedKeys.default
    } catch {
      // Fall through to the single-key environment variables.
    }
  }
  return Deno.env.get(currentVariable) ?? Deno.env.get(legacyVariable) ?? ''
}

function json(body: Record<string, unknown>, status = 200) {
  return Response.json(body, { status, headers: responseHeaders })
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (request.method !== 'POST') return json({ error: 'Method not allowed.' }, 405)

  try {
    const authorization = request.headers.get('Authorization') ?? ''
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const publishableKey = readProjectKey('SUPABASE_PUBLISHABLE_KEYS', 'SUPABASE_PUBLISHABLE_KEY', 'SUPABASE_ANON_KEY')
    const secretKey = readProjectKey('SUPABASE_SECRET_KEYS', 'SUPABASE_SECRET_KEY', 'SUPABASE_SERVICE_ROLE_KEY')
    const inviteRedirectUrl = Deno.env.get('PORTAL_INVITE_REDIRECT_URL') ?? 'https://liveaustellarlife.com/?portal=update-password'

    if (!authorization || !supabaseUrl || !publishableKey || !secretKey) {
      return json({ error: 'Client invitation service is not configured.' }, 500)
    }

    const authClient = createClient(supabaseUrl, publishableKey, {
      global: { headers: { Authorization: authorization } },
      auth: { persistSession: false },
    })
    const { data: { user }, error: userError } = await authClient.auth.getUser()
    if (userError || !user) return json({ error: 'Authentication required.' }, 401)

    const { data: isAdmin, error: adminCheckError } = await authClient.rpc('is_admin')
    if (adminCheckError || !isAdmin) return json({ error: 'Administrator access required.' }, 403)

    const body = await request.json() as { displayName?: unknown; email?: unknown; tier?: unknown }
    const displayName = typeof body.displayName === 'string' ? body.displayName.trim() : ''
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
    const tier = typeof body.tier === 'string' ? body.tier : ''

    if (displayName.length < 1 || displayName.length > 100) {
      return json({ error: 'Enter a client name between 1 and 100 characters.' }, 400)
    }
    if (!email || email.length > 254 || !email.includes('@')) {
      return json({ error: 'Enter a valid client email address.' }, 400)
    }
    if (!membershipTiers.has(tier)) return json({ error: 'Choose a valid membership tier.' }, 400)
    if (email === user.email?.toLowerCase()) return json({ error: 'You cannot invite the account you are currently using.' }, 400)

    const adminClient = createClient(supabaseUrl, secretKey, {
      auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
    })
    const { data: invitation, error: invitationError } = await adminClient.auth.admin.inviteUserByEmail(email, {
      data: { display_name: displayName },
      redirectTo: inviteRedirectUrl,
    })

    if (invitationError || !invitation.user) {
      const errorCode = 'code' in (invitationError ?? {}) ? String(invitationError?.code ?? '') : ''
      if (errorCode === 'email_address_not_authorized') {
        return json({ error: 'Email invitations require custom SMTP. Configure Resend in Supabase Authentication settings, then try again.' }, 503)
      }
      if (invitationError?.message.toLowerCase().includes('already')) {
        return json({ error: 'An account already exists for that email. Refresh the client list and grant access from its row.' }, 409)
      }
      return json({ error: invitationError?.message ?? 'The invitation could not be sent.' }, 400)
    }

    const { error: grantError } = await authClient.rpc('admin_grant_membership', {
      target_user_id: invitation.user.id,
      granted_tier: tier,
      grant_ends_at: null,
    })
    if (grantError) {
      return json({
        error: 'The invitation was sent, but access could not be assigned. Refresh the client list and grant the tier from the new client row.',
        invitationSent: true,
      }, 500)
    }

    return json({ success: true, email, tier })
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : 'The invitation could not be completed.' }, 500)
  }
})
