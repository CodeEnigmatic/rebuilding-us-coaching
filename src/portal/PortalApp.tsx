import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase'
import { academyProgram } from '../data/academy'
import { curriculumProductionOutlines } from '../data/curriculumProduction'
import type { AppRole, MembershipStatus, MembershipTier } from '../types/database'
import { hasTierAccess, mayOpenRoute, readPortalRoute, type PortalRoute } from './access'
import { CourseExperience } from './CourseExperience'

type MemberContext = {
  displayName: string | null
  role: AppRole
  tier: MembershipTier | null
  status: MembershipStatus | null
}

type AdminClient = {
  user_id: string
  display_name: string | null
  email: string | null
  role: AppRole
  tier: MembershipTier | null
  membership_status: MembershipStatus | null
  membership_id: string | null
  membership_ends_at: string | null
}

type SupportRequest = {
  id: string
  email: string
  display_name: string | null
  message: string
  status: 'new' | 'reviewed' | 'closed'
  created_at: string
}

const portalUrl = (route: PortalRoute) => `/?portal=${route}`
const ratingLabels = ['Not true yet', 'Rarely true', 'Sometimes true', 'Usually true', 'Consistently true']
function assessmentFeedback(title: string, items: string[], answers: string[]): string {
  if (title === 'Relationship Cycle Questionnaire') {
    return 'You completed your first relationship-cycle reflection. Review your answers for the trigger, the story you tell yourself, and the reaction that makes repair harder. That repeating sequence is the first pattern to bring into a coaching conversation.'
  }
  const ratings = answers.map(Number)
  const average = ratings.reduce((total, rating) => total + rating, 0) / ratings.length
  const focusItem = items[ratings.indexOf(Math.min(...ratings))]
  const range = average >= 4 ? 'a strong current foundation' : average >= 3 ? 'a developing foundation' : 'an important opportunity for focused growth'
  return `Your current average is ${average.toFixed(1)} out of 5, which suggests ${range}. Your clearest starting focus is: “${focusItem}” Choose one small action this week that would move this area forward by one point.`
}

function PortalShell({ children }: { children: ReactNode }) {
  return (
    <div className="portal-shell">
      <header className="portal-header">
        <a href="/" className="brand-mark"><span>AU-STELLAR</span><small>LIFE Portal</small></a>
        <a href="/" className="portal-text-link">Return to public site</a>
      </header>
      <main className="portal-main">{children}</main>
    </div>
  )
}

function StatePanel({ title, children }: { title: string; children: ReactNode }) {
  return <div className="portal-card state-panel"><h1>{title}</h1>{children}</div>
}

function AuthForm({ mode }: { mode: 'login' | 'register' | 'forgot-password' | 'update-password' }) {
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault(); setSubmitting(true); setError(''); setMessage('')
    const supabase = getSupabaseClient()
    try {
      if (mode === 'register') {
        const result = await supabase.auth.signUp({ email, password, options: { data: { display_name: displayName }, emailRedirectTo: `${location.origin}${portalUrl('dashboard')}` } })
        if (result.error) throw result.error
        setMessage('Check your email to verify your account, then sign in.')
      } else if (mode === 'login') {
        const result = await supabase.auth.signInWithPassword({ email, password })
        if (result.error) throw result.error
        location.assign(portalUrl('dashboard'))
      } else if (mode === 'forgot-password') {
        const result = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${location.origin}${portalUrl('update-password')}` })
        if (result.error) throw result.error
        setMessage('If an account exists for that address, a reset email has been sent.')
      } else {
        if (password.length < 8) throw new Error('Use at least eight characters.')
        const result = await supabase.auth.updateUser({ password })
        if (result.error) throw result.error
        setMessage('Password updated. You can continue to your dashboard.')
      }
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'The request could not be completed.') }
    finally { setSubmitting(false) }
  }

  const titles = { login: 'Sign in', register: 'Create your account', 'forgot-password': 'Reset your password', 'update-password': 'Choose a new password' }
  return (
    <PortalShell><section className="portal-card auth-card">
      <p className="eyebrow">Secure Client Portal</p><h1>{titles[mode]}</h1>
      <form onSubmit={submit} className="portal-form">
        {mode === 'register' && <label>Display name<input required maxLength={100} value={displayName} onChange={(e) => setDisplayName(e.target.value)} autoComplete="name" /></label>}
        {mode !== 'update-password' && <label>Email<input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" /></label>}
        {(mode === 'login' || mode === 'register' || mode === 'update-password') && <label>Password<input required minLength={8} type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} /></label>}
        {error && <p className="portal-alert error" role="alert">{error}</p>}
        {message && <p className="portal-alert success" role="status">{message}</p>}
        <button className="primary-button" disabled={submitting}>{submitting ? 'Please wait…' : titles[mode]}</button>
      </form>
      <nav className="auth-links">
        {mode !== 'login' && <a href={portalUrl('login')}>Sign in</a>}
        {mode !== 'register' && <a href={portalUrl('register')}>Create account</a>}
        {mode === 'login' && <a href={portalUrl('forgot-password')}>Forgot password?</a>}
        {mode === 'update-password' && <a href={portalUrl('dashboard')}>Continue to dashboard</a>}
      </nav>
    </section></PortalShell>
  )
}

function ClientDashboard({ session, context }: { session: Session; context: MemberContext }) {
  const pathways: { tier: MembershipTier; title: string; description: string }[] = [
    { tier: 'individual', title: 'Refine Yourself', description: 'Individual foundations, identity, habits, character, and resilience.' },
    { tier: 'relationship', title: 'Build Together', description: 'Communication, trust, conflict, intimacy, and shared purpose.' },
    { tier: 'community', title: 'Strengthen Culture', description: 'Leadership, mentorship, culture, impact, and legacy.' },
  ]
  const [assessmentAnswers, setAssessmentAnswers] = useState<Record<string, string>>({})
  const [assessmentResults, setAssessmentResults] = useState<Record<string, string>>({})
  const [supportMessage, setSupportMessage] = useState('')
  const [supportStatus, setSupportStatus] = useState('')
  const [supportError, setSupportError] = useState('')
  const [supportSending, setSupportSending] = useState(false)
  async function sendSupportRequest(event: FormEvent) {
    event.preventDefault(); setSupportSending(true); setSupportStatus(''); setSupportError('')
    const { data, error: requestError } = await getSupabaseClient().functions.invoke('send-support-request', { body: { message: supportMessage, displayName: context.displayName } })
    if (requestError || data?.error) setSupportError(data?.error ?? requestError?.message ?? 'Your message could not be sent.')
    else { setSupportMessage(''); setSupportStatus('Your message was sent to AU-STELLAR LIFE. We will follow up by email.') }
    setSupportSending(false)
  }
  async function signOut() { await getSupabaseClient().auth.signOut(); location.assign(portalUrl('login')) }
  return <PortalShell><div className="portal-dashboard">
    <section className="portal-card portal-welcome"><p className="eyebrow">Client Dashboard</p><h1>Welcome, {context.displayName ?? session.user.email}</h1><p>Your pathway entry assessments and Academy curriculum are available according to your membership access.</p><div className="portal-actions"><a className="primary-button" href={portalUrl('academy')}>Open Academy</a>{context.role === 'admin' && <a className="primary-button" href={portalUrl('admin')}>Manage clients</a>}<button className="secondary-button" onClick={signOut}>Sign out</button></div></section>
    <section className="portal-card"><h2>Access status</h2>{context.tier ? <p><strong>{context.tier}</strong> tier · {context.status}</p> : <p>No coaching tier is currently assigned. Contact your coach for access.</p>}</section>
    <section className="portal-grid">{pathways.map((pathway) => { const unlocked = hasTierAccess(context.tier, context.status, pathway.tier); return <article className={`portal-card pathway-access ${unlocked ? 'unlocked' : 'locked'}`} key={pathway.tier}><span>{unlocked ? 'Available' : 'Locked'}</span><h2>{pathway.title}</h2><p>{pathway.description}</p>{!unlocked && <small>Requires the {pathway.tier} tier or higher.</small>}</article> })}</section>
    <section className="portal-card assessment-library">
      <p className="eyebrow">Your starting point</p>
      <h2>Pathway entry assessments</h2>
      <p>Higher memberships include the assessments from every tier below them. These reflections are a coaching snapshot, not a clinical diagnosis.</p>
      <div className="portal-grid">
        {academyProgram.modules.map((module) => {
          const requiredTier = module.trackId as MembershipTier
          const unlocked = hasTierAccess(context.tier, context.status, requiredTier)
          const assessment = module.resources.find((resource) => resource.type === 'assessment' || resource.type === 'questionnaire')
          if (!assessment) return null
          const usesRatings = assessment.type === 'assessment'
          const completed = assessment.items.filter((_, index) => assessmentAnswers[`${assessment.id}-${index}`]?.trim()).length
          return <article className={`assessment-entry ${unlocked ? 'unlocked' : 'locked'}`} key={assessment.id}>
            <span>{unlocked ? `${requiredTier} access` : 'Locked'}</span>
            <h3>{assessment.title}</h3>
            <p>{unlocked ? assessment.prompt : `Available with ${requiredTier} membership or higher.`}</p>
            {unlocked && <details>
              <summary>Open assessment <small>{completed}/{assessment.items.length} answered</small></summary>
              <div className="assessment-prompts">
                {assessment.items.map((item, index) => {
                  const answerKey = `${assessment.id}-${index}`
                  return <label key={item}><strong>{index + 1}. {item}</strong>{usesRatings ? <select value={assessmentAnswers[answerKey] ?? ''} onChange={(event) => { setAssessmentAnswers((current) => ({ ...current, [answerKey]: event.target.value })); setAssessmentResults((current) => ({ ...current, [assessment.id]: '' })) }}><option value="">Choose a rating</option>{ratingLabels.map((label, ratingIndex) => <option value={ratingIndex + 1} key={label}>{ratingIndex + 1} — {label}</option>)}</select> : <textarea rows={3} value={assessmentAnswers[answerKey] ?? ''} onChange={(event) => { setAssessmentAnswers((current) => ({ ...current, [answerKey]: event.target.value })); setAssessmentResults((current) => ({ ...current, [assessment.id]: '' })) }} placeholder="Write your reflection…" />}</label>
                })}
                <button className="primary-button assessment-submit" type="button" disabled={completed !== assessment.items.length} onClick={() => {
                  const answers = assessment.items.map((_, index) => assessmentAnswers[`${assessment.id}-${index}`])
                  setAssessmentResults((current) => ({ ...current, [assessment.id]: assessmentFeedback(assessment.title, assessment.items, answers) }))
                }}>Submit assessment</button>
                {completed !== assessment.items.length && <small>Answer every question to submit.</small>}
                {assessmentResults[assessment.id] && <div className="assessment-result" role="status"><strong>Your reflection summary</strong><p>{assessmentResults[assessment.id]}</p></div>}
                <p className="assessment-note">Pilot mode: answers remain only in this browser session and are not saved yet.</p>
              </div>
            </details>}
          </article>
        })}
      </div>
    </section>
    <section className="portal-card curriculum-library">
      <p className="eyebrow">Academy curriculum</p>
      <h2>Individual and Relationship production roadmap</h2>
      <p>Use these complete domain outlines to build the course in whatever number of video parts each topic needs. Higher tiers inherit the curriculum below them.</p>
      <p className="curriculum-source-note"><strong>Book-source note:</strong> the manuscript is not connected to the portal yet. “Book pull” items identify passages to locate and adapt after the manuscript or table of contents is added.</p>
      <div className="curriculum-outline-grid">
        {(['individual', 'relationship'] as const).map((requiredTier) => {
          const unlocked = hasTierAccess(context.tier, context.status, requiredTier)
          const domains = curriculumProductionOutlines.filter((domain) => domain.tier === requiredTier)
          return <article className={`curriculum-outline ${unlocked ? 'unlocked' : 'locked'}`} key={requiredTier}>
            <span>{unlocked ? `${requiredTier} curriculum` : 'Locked'}</span>
            <h3>{requiredTier === 'individual' ? 'AU-STELLAR Individual' : 'AU-STELLAR Relationship'}</h3>
            <p><strong>{requiredTier === 'individual' ? 'Refine Yourself' : 'Build Together'}</strong></p>
            <p>{unlocked ? `${domains.length} curriculum domains with lesson and production-material outlines.` : `Available with ${requiredTier} membership or higher.`}</p>
            {unlocked && <>
              <details>
                <summary>View all {domains.length} domains</summary>
                <div className="curriculum-details">
                  {domains.map((domain) => <article className="curriculum-domain" key={domain.id}>
                    <h4>{domain.title}</h4><p>{domain.purpose}</p>
                    <section><h5>Lesson outline</h5><ol>{domain.lessonTopics.map((topic) => <li key={topic}>{topic}</li>)}</ol></section>
                    <section><h5>Materials to produce</h5><div className="material-roadmap">{domain.materials.map((material) => <div key={`${material.kind}-${material.title}`}><span>{material.kind}</span><strong>{material.title}</strong><p>{material.note}</p></div>)}</div></section>
                  </article>)}
                </div>
              </details>
            </>}
          </article>
        })}
      </div>
    </section>
    <section className="portal-card support-card">
      <p className="eyebrow">Questions and support</p>
      <h2>What do you need help with?</h2>
      <p>Share a question, coaching need, or suggestion. Your message will be sent securely to the AU-STELLAR LIFE administrator, who can reply to your account email.</p>
      <form className="portal-form" onSubmit={sendSupportRequest}>
        <label>Your question or need<textarea required minLength={10} maxLength={2000} rows={6} value={supportMessage} onChange={(event) => setSupportMessage(event.target.value)} placeholder="Tell us what you would like help with…" /></label>
        <small>{supportMessage.length}/2,000 characters</small>
        {supportError && <p className="portal-alert error" role="alert">{supportError}</p>}
        {supportStatus && <p className="portal-alert success" role="status">{supportStatus}</p>}
        <button className="primary-button" disabled={supportSending || supportMessage.trim().length < 10}>{supportSending ? 'Sending…' : 'Send message'}</button>
      </form>
    </section>
  </div></PortalShell>
}

function AdminDashboard() {
  const [clients, setClients] = useState<AdminClient[]>([])
  const [supportRequests, setSupportRequests] = useState<SupportRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  async function load() { setLoading(true); const { data, error: requestError } = await getSupabaseClient().rpc('admin_list_clients'); setError(requestError?.message ?? ''); setClients((data ?? []) as AdminClient[]); setLoading(false) }
  useEffect(() => {
    void getSupabaseClient().rpc('admin_list_clients').then(({ data, error: requestError }) => {
      setError(requestError?.message ?? '')
      setClients((data ?? []) as AdminClient[])
      setLoading(false)
    })
    void getSupabaseClient().from('support_requests').select('id,email,display_name,message,status,created_at').order('created_at', { ascending: false }).limit(50).then(({ data }) => setSupportRequests((data ?? []) as SupportRequest[]))
  }, [])
  async function grant(userId: string, tier: MembershipTier) { const { error: requestError } = await getSupabaseClient().rpc('admin_grant_membership', { target_user_id: userId, granted_tier: tier, grant_ends_at: null }); if (requestError) setError(requestError.message); else await load() }
  async function revoke(id: string) { const { error: requestError } = await getSupabaseClient().rpc('admin_revoke_membership', { target_membership_id: id }); if (requestError) setError(requestError.message); else await load() }
  return <PortalShell><div className="portal-dashboard"><section className="portal-card admin-panel"><p className="eyebrow">Administrator</p><h1>Client access</h1><p>Manual access changes are enforced and audited by PostgreSQL.</p>{error && <p className="portal-alert error" role="alert">{error}</p>}{loading ? <p>Loading clients…</p> : clients.length === 0 ? <p>No client accounts have registered yet.</p> : <div className="client-list">{clients.map((client) => <article key={client.user_id}><div><strong>{client.display_name ?? 'Unnamed client'}</strong><small>{client.email ?? client.user_id}</small><span>{client.tier ? `${client.tier} · ${client.membership_status}` : 'No tier'}</span></div><div className="admin-actions"><select aria-label={`Tier for ${client.email}`} defaultValue="individual" id={`tier-${client.user_id}`}><option value="individual">Individual</option><option value="relationship">Relationship</option><option value="community">Community</option></select><button onClick={() => grant(client.user_id, (document.querySelector(`#tier-${client.user_id}`) as HTMLSelectElement).value as MembershipTier)}>Grant</button>{client.membership_id && <button className="danger-button" onClick={() => revoke(client.membership_id!)}>Revoke</button>}</div></article>)}</div>}<a href={portalUrl('dashboard')} className="portal-text-link">Return to dashboard</a></section><section className="portal-card"><p className="eyebrow">Client inbox</p><h2>Questions and support needs</h2>{supportRequests.length === 0 ? <p>No client messages yet.</p> : <div className="support-request-list">{supportRequests.map((request) => <article key={request.id}><div><strong>{request.display_name ?? request.email}</strong><small>{request.email} · {new Date(request.created_at).toLocaleString()}</small></div><p>{request.message}</p><span>{request.status}</span></article>)}</div>}</section></div></PortalShell>
}

export function PortalApp() {
  const route = readPortalRoute(location.search) ?? 'login'
  const [session, setSession] = useState<Session | null>(null)
  const [context, setContext] = useState<MemberContext | null>(null)
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isSupabaseConfigured) return
    const supabase = getSupabaseClient()
    const loadContext = async (currentSession: Session | null) => {
      setSession(currentSession); setContext(null)
      if (currentSession) {
        const [profile, role, memberships] = await Promise.all([
          supabase.from('profiles').select('display_name').eq('user_id', currentSession.user.id).single(),
          supabase.from('user_roles').select('role').eq('user_id', currentSession.user.id).single(),
          supabase.from('memberships').select('tier,status').eq('user_id', currentSession.user.id).in('status', ['trialing', 'active', 'past_due']).order('created_at', { ascending: false }).limit(1),
        ])
        if (profile.error || role.error || memberships.error) setError(profile.error?.message ?? role.error?.message ?? memberships.error?.message ?? '')
        else setContext({ displayName: profile.data.display_name, role: role.data.role, tier: memberships.data[0]?.tier ?? null, status: memberships.data[0]?.status ?? null })
      }
      setLoading(false)
    }
    void supabase.auth.getSession().then(({ data }) => loadContext(data.session))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => { void loadContext(nextSession) })
    return () => listener.subscription.unsubscribe()
  }, [])

  if (!isSupabaseConfigured) return <PortalShell><StatePanel title="Portal setup required"><p>The secure portal is not connected yet. Add the Supabase project URL and publishable key to the deployment environment.</p></StatePanel></PortalShell>
  if (loading) return <PortalShell><StatePanel title="Loading secure portal"><p>Restoring your session…</p></StatePanel></PortalShell>
  if (error) return <PortalShell><StatePanel title="Portal unavailable"><p className="portal-alert error">{error}</p></StatePanel></PortalShell>
  if (!mayOpenRoute(route, Boolean(session), context?.role)) {
    if (!session) { location.replace(portalUrl('login')); return null }
    return <PortalShell><StatePanel title="Access denied"><p>Your account does not have administrator permission.</p><a href={portalUrl('dashboard')}>Return to dashboard</a></StatePanel></PortalShell>
  }
  if (route === 'login' || route === 'register' || route === 'forgot-password' || route === 'update-password') return <AuthForm mode={route} />
  if (route === 'admin') return <AdminDashboard />
  if ((route === 'academy' || route === 'course' || route === 'lesson' || route === 'assessment' || route === 'exercise') && session && context) return <PortalShell><CourseExperience route={route} userId={session.user.id} tier={context.tier} membershipStatus={context.status} /></PortalShell>
  return session && context ? <ClientDashboard session={session} context={context} /> : <PortalShell><StatePanel title="Account setup incomplete"><p>Your profile could not be loaded.</p></StatePanel></PortalShell>
}
