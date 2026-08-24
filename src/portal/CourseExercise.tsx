import { useEffect, useState } from 'react'
import { getSupabaseClient } from '../lib/supabase'
import type { Json } from '../types/database'

type Exercise = { id: string; slug: string; title: string; instructions: string; visibility: 'private' | 'coach_shared' }
type Submission = { response: Json; status: 'not_started' | 'in_progress' | 'completed'; coach_feedback: string | null; updated_at: string }

function readContent(response: Json | undefined): string {
  if (!response || Array.isArray(response) || typeof response !== 'object') return ''
  return typeof response.content === 'string' ? response.content : ''
}

export function CourseExercise({ exercise, userId, returnUrl }: { exercise: Exercise; userId: string; returnUrl: string }) {
  const [content, setContent] = useState('')
  const [submission, setSubmission] = useState<Submission | null>(null)
  const [status, setStatus] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    void getSupabaseClient().from('exercise_submissions').select('response,status,coach_feedback,updated_at').eq('user_id', userId).eq('exercise_id', exercise.id).maybeSingle().then(({ data, error }) => {
      if (error) setStatus(error.message)
      else if (data) { setSubmission(data as Submission); setContent(readContent(data.response)) }
    })
  }, [exercise.id, userId])

  async function save(nextStatus: 'in_progress' | 'completed') {
    setSaving(true); setStatus('Saving…')
    const now = new Date().toISOString()
    const { data, error } = await getSupabaseClient().from('exercise_submissions').upsert({ user_id: userId, exercise_id: exercise.id, response: { content }, status: nextStatus, submitted_at: nextStatus === 'completed' ? now : null, updated_at: now }, { onConflict: 'user_id,exercise_id' }).select('response,status,coach_feedback,updated_at').single()
    if (error) setStatus(error.message)
    else { setSubmission(data as Submission); setStatus(nextStatus === 'completed' ? 'Exercise completed and saved.' : 'Private draft saved.') }
    setSaving(false)
  }

  return <article className="portal-card exercise-experience"><p className="eyebrow">Applied work</p><h1>{exercise.title}</h1><p>{exercise.instructions}</p><div className="privacy-boundary"><strong>Private by default</strong><p>Your response belongs to your account. It is not shared with another participant or coach unless a future sharing control explicitly says so.</p></div><label className="journal-field">Your response<textarea rows={14} maxLength={10000} value={content} onChange={(event) => { setContent(event.target.value); setStatus('Unsaved changes') }} placeholder="Write your reflection, plan, agreement, or blueprint here…" /></label><small>{content.length}/10,000 characters</small><div className="exercise-actions"><button className="secondary-button" disabled={saving || !content.trim()} onClick={() => save('in_progress')}>Save draft</button><button className="primary-button" disabled={saving || content.trim().length < 20} onClick={() => save('completed')}>{submission?.status === 'completed' ? 'Update completed work' : 'Complete exercise'}</button></div>{status && <p className={status.includes('saved') || status.includes('completed') ? 'portal-alert success' : ''} role="status">{status}</p>}{submission?.coach_feedback && <section className="coach-feedback"><h2>Coach feedback</h2><p>{submission.coach_feedback}</p></section>}<a className="portal-text-link" href={returnUrl}>Return to course</a></article>
}

