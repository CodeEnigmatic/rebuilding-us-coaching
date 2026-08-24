import { useEffect, useMemo, useState } from 'react'
import { getSupabaseClient } from '../lib/supabase'
import type { MembershipStatus, MembershipTier } from '../types/database'
import { hasTierAccess, type PortalRoute } from './access'
import { CourseAssessment } from './CourseAssessment'
import { CourseExercise } from './CourseExercise'

type Track = { id: string; slug: string; title: string; subtitle: string; description: string; transformation_statement: string; audience: string; estimated_weeks: number; access_level: MembershipTier; display_order: number }
type Module = { id: string; track_id: string; slug: string; framework_principle: string; title: string; summary: string; desired_outcome: string; guiding_question: string | null; applied_work: unknown; module_type: 'orientation' | 'framework' | 'capstone'; display_order: number }
type Lesson = { id: string; module_id: string; slug: string; title: string; objective: string; content: string; content_status: 'outline' | 'draft' | 'final'; media_url: string | null; reflection_prompts: unknown; display_order: number; estimated_minutes: number }
type Progress = { lesson_id: string; status: 'not_started' | 'in_progress' | 'completed' }
type Exercise = { id: string; module_id: string | null; lesson_id: string | null; slug: string; title: string; instructions: string; visibility: 'private' | 'coach_shared'; display_order: number }
type ExerciseProgress = { exercise_id: string; status: 'not_started' | 'in_progress' | 'completed' }
type SafetyResource = { id: string; track_id: string; title: string; body: string; resource_url: string | null }

const academyUrl = (route: PortalRoute, values: Record<string, string> = {}) => {
  const params = new URLSearchParams({ portal: route, ...values })
  return `/?${params.toString()}`
}

const stringList = (value: unknown): string[] => Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []

export function CourseExperience({ route, userId, tier, membershipStatus }: { route: PortalRoute; userId: string; tier: MembershipTier | null; membershipStatus: MembershipStatus | null }) {
  const [tracks, setTracks] = useState<Track[]>([])
  const [modules, setModules] = useState<Module[]>([])
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [progress, setProgress] = useState<Progress[]>([])
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [exerciseProgress, setExerciseProgress] = useState<ExerciseProgress[]>([])
  const [safetyResources, setSafetyResources] = useState<SafetyResource[]>([])
  const [journal, setJournal] = useState('')
  const [journalStatus, setJournalStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const params = useMemo(() => new URLSearchParams(location.search), [])
  const trackSlug = params.get('track')
  const moduleSlug = params.get('module')
  const lessonSlug = params.get('lesson')
  const exerciseSlug = params.get('exercise')

  useEffect(() => {
    const load = async () => {
      const supabase = getSupabaseClient()
      const trackResult = await supabase.from('course_tracks').select('id,slug,title,subtitle,description,transformation_statement,audience,estimated_weeks,access_level,display_order').eq('status', 'published').order('display_order')
      if (trackResult.error) { setError(trackResult.error.message); setLoading(false); return }
      const nextTracks = (trackResult.data ?? []) as Track[]
      setTracks(nextTracks)
      if (nextTracks.length === 0) { setLoading(false); return }
      const safetyResult = await supabase.from('course_safety_resources').select('id,track_id,title,body,resource_url').eq('status', 'published').order('display_order')
      if (!safetyResult.error) setSafetyResources((safetyResult.data ?? []) as SafetyResource[])
      const moduleResult = await supabase.from('course_modules').select('id,track_id,slug,framework_principle,title,summary,desired_outcome,guiding_question,applied_work,module_type,display_order').in('track_id', nextTracks.map((track) => track.id)).eq('status', 'published').order('display_order')
      if (moduleResult.error) { setError(moduleResult.error.message); setLoading(false); return }
      const nextModules = (moduleResult.data ?? []) as Module[]
      setModules(nextModules)

      const selectedTrack = nextTracks.find((track) => track.slug === trackSlug)
      if (selectedTrack && hasTierAccess(tier, membershipStatus, selectedTrack.access_level)) {
        const trackModuleIds = nextModules.filter((module) => module.track_id === selectedTrack.id).map((module) => module.id)
        if (trackModuleIds.length) {
          const [lessonResult, progressResult, exerciseResult, exerciseProgressResult] = await Promise.all([
            supabase.from('course_lessons').select('id,module_id,slug,title,objective,content,content_status,media_url,reflection_prompts,display_order,estimated_minutes').in('module_id', trackModuleIds).order('display_order'),
            supabase.from('lesson_progress').select('lesson_id,status').eq('user_id', userId),
            supabase.from('course_exercises').select('id,module_id,lesson_id,slug,title,instructions,visibility,display_order').in('module_id', trackModuleIds).order('display_order'),
            supabase.from('exercise_submissions').select('exercise_id,status').eq('user_id', userId),
          ])
          if (lessonResult.error || progressResult.error || exerciseResult.error || exerciseProgressResult.error) setError(lessonResult.error?.message ?? progressResult.error?.message ?? exerciseResult.error?.message ?? exerciseProgressResult.error?.message ?? '')
          else { setLessons((lessonResult.data ?? []) as Lesson[]); setProgress((progressResult.data ?? []) as Progress[]); setExercises((exerciseResult.data ?? []) as Exercise[]); setExerciseProgress((exerciseProgressResult.data ?? []) as ExerciseProgress[]) }
        }
      }
      setLoading(false)
    }
    void load()
  }, [membershipStatus, tier, trackSlug, userId])

  const selectedTrack = tracks.find((track) => track.slug === trackSlug)
  const selectedModule = modules.find((module) => module.track_id === selectedTrack?.id && module.slug === moduleSlug)
  const selectedLesson = lessons.find((lesson) => lesson.module_id === selectedModule?.id && lesson.slug === lessonSlug)
  const selectedExercise = exercises.find((exercise) => exercise.module_id === selectedModule?.id && exercise.slug === exerciseSlug)
  const completedIds = new Set(progress.filter((item) => item.status === 'completed').map((item) => item.lesson_id))
  const completedExerciseIds = new Set(exerciseProgress.filter((item) => item.status === 'completed').map((item) => item.exercise_id))

  useEffect(() => {
    if (!selectedLesson) return
    void getSupabaseClient().from('journal_entries').select('content').eq('user_id', userId).eq('lesson_id', selectedLesson.id).eq('prompt_key', 'lesson-reflection').maybeSingle().then(({ data }) => setJournal(data?.content ?? ''))
  }, [selectedLesson, userId])

  async function setLessonStatus(lesson: Lesson, status: 'in_progress' | 'completed') {
    const now = new Date().toISOString()
    const { error: requestError } = await getSupabaseClient().from('lesson_progress').upsert({ user_id: userId, lesson_id: lesson.id, status, started_at: now, completed_at: status === 'completed' ? now : null, updated_at: now }, { onConflict: 'user_id,lesson_id' })
    if (requestError) setError(requestError.message)
    else setProgress((current) => [...current.filter((item) => item.lesson_id !== lesson.id), { lesson_id: lesson.id, status }])
  }

  async function saveJournal() {
    if (!selectedLesson) return
    setJournalStatus('Saving…')
    const { error: requestError } = await getSupabaseClient().from('journal_entries').upsert({ user_id: userId, lesson_id: selectedLesson.id, module_id: null, prompt_key: 'lesson-reflection', content: journal, visibility: 'private', updated_at: new Date().toISOString() }, { onConflict: 'user_id,lesson_id,module_id,prompt_key' })
    setJournalStatus(requestError ? requestError.message : 'Private reflection saved.')
  }

  if (loading) return <section className="portal-card"><h1>Loading Academy</h1><p>Preparing your curriculum…</p></section>
  if (error) return <section className="portal-card"><h1>Academy unavailable</h1><p className="portal-alert error">{error}</p><p>If the course migration has not been applied yet, complete the Supabase setup before testing this experience.</p></section>

  if (route === 'academy') return <div className="portal-dashboard"><section className="portal-card"><p className="eyebrow">AU-STELLAR LIFE Academy</p><h1>The Pursuit of Human Excellence</h1><p>Identity sits at the center. Every course moves through Awaken, Understand, Practice, Integrate, and Multiply.</p></section><section className="course-catalog">{tracks.map((track) => {
    const available = hasTierAccess(tier, membershipStatus, track.access_level)
    const trackModules = modules.filter((module) => module.track_id === track.id)
    return <article className={`portal-card course-card ${available ? 'unlocked' : 'locked'}`} key={track.id}><span>{available ? 'Available' : `Requires ${track.access_level}`}</span><h2>{track.title}</h2><h3>{track.subtitle}</h3><p>{track.transformation_statement}</p><dl><div><dt>Duration</dt><dd>{track.estimated_weeks} weeks or self-paced</dd></div><div><dt>Structure</dt><dd>{trackModules.length} units</dd></div></dl><a className="primary-button" href={academyUrl('course', { track: track.slug })}>{available ? 'Open course' : 'Preview course'}</a></article>
  })}</section><a className="portal-text-link" href={academyUrl('dashboard')}>Return to dashboard</a></div>

  if (!selectedTrack) return <section className="portal-card"><h1>Course not found</h1><a href={academyUrl('academy')}>Return to Academy</a></section>
  const entitled = hasTierAccess(tier, membershipStatus, selectedTrack.access_level)
  const trackModules = modules.filter((module) => module.track_id === selectedTrack.id)
  const courseLessons = lessons.filter((lesson) => trackModules.some((module) => module.id === lesson.module_id))
  const courseExercises = exercises.filter((exercise) => trackModules.some((module) => module.id === exercise.module_id))
  const completedLessonCount = courseLessons.filter((lesson) => completedIds.has(lesson.id)).length
  const completedExerciseCount = courseExercises.filter((exercise) => completedExerciseIds.has(exercise.id)).length
  const requiredItemCount = courseLessons.length + courseExercises.length
  const completedCount = completedLessonCount + completedExerciseCount
  const progressPercent = requiredItemCount ? Math.round((completedCount / requiredItemCount) * 100) : 0
  const nextLesson = courseLessons.find((lesson) => !completedIds.has(lesson.id))
  const nextLessonModule = trackModules.find((module) => module.id === nextLesson?.module_id)

  if (route === 'assessment') {
    if (!entitled) return <section className="portal-card"><h1>Membership required</h1><p>This assessment requires {selectedTrack.access_level} access or higher.</p><a href={academyUrl('course', { track: selectedTrack.slug })}>View course outline</a></section>
    return <CourseAssessment track={{ id: selectedTrack.id, slug: selectedTrack.slug, title: selectedTrack.title }} userId={userId} />
  }

  if (route === 'exercise') {
    if (!entitled) return <section className="portal-card"><h1>Membership required</h1><p>This exercise requires {selectedTrack.access_level} access or higher.</p></section>
    if (!selectedModule || !selectedExercise) return <section className="portal-card"><h1>Exercise not found</h1><a href={academyUrl('course', { track: selectedTrack.slug })}>Return to course</a></section>
    return <CourseExercise exercise={selectedExercise} userId={userId} returnUrl={academyUrl('course', { track: selectedTrack.slug })} />
  }

  if (route === 'course') return <div className="portal-dashboard"><section className="portal-card course-hero"><p className="eyebrow">{selectedTrack.title}</p><h1>{selectedTrack.subtitle}</h1><p>{selectedTrack.transformation_statement}</p><p>{selectedTrack.description}</p>{entitled ? <><div className="course-progress"><strong>{progressPercent}% complete</strong><progress max="100" value={progressPercent}>{progressPercent}%</progress><small>{completedCount} of {requiredItemCount} required lessons and exercises completed</small></div>{nextLesson && nextLessonModule && <a className="primary-button resume-course" href={academyUrl('lesson', { track: selectedTrack.slug, module: nextLessonModule.slug, lesson: nextLesson.slug })}>{completedCount ? 'Resume course' : 'Start course'}: {nextLesson.title}</a>}<div className="assessment-actions"><a className="secondary-button" href={academyUrl('assessment', { track: selectedTrack.slug, type: 'entry' })}>Entry assessment</a><a className="secondary-button" href={academyUrl('assessment', { track: selectedTrack.slug, type: 'midpoint' })}>Midpoint reflection</a><a className="secondary-button" href={academyUrl('assessment', { track: selectedTrack.slug, type: 'exit' })}>Exit assessment</a></div></> : <p className="portal-alert">This curriculum preview is public, but lesson content requires {selectedTrack.access_level} access.</p>}</section>{safetyResources.filter((resource) => resource.track_id === selectedTrack.id).map((resource) => <aside className="portal-card safety-resource" key={resource.id}><p className="eyebrow">Safety and scope</p><h2>{resource.title}</h2><p>{resource.body}</p>{resource.resource_url && <a href={resource.resource_url}>View configured support resource</a>}</aside>)}<section className="course-module-list">{trackModules.map((module) => { const moduleLessons = lessons.filter((lesson) => lesson.module_id === module.id); const moduleExercises = exercises.filter((exercise) => exercise.module_id === module.id); return <article className="portal-card course-module" key={module.id}><span>{module.framework_principle}</span><h2>{module.title}</h2><p>{module.summary}</p><p><strong>Desired outcome:</strong> {module.desired_outcome}</p>{module.guiding_question && <blockquote>{module.guiding_question}</blockquote>}{entitled && <><h3>Lessons</h3><ol>{moduleLessons.map((lesson) => <li className={completedIds.has(lesson.id) ? 'completed' : ''} key={lesson.id}><a href={academyUrl('lesson', { track: selectedTrack.slug, module: module.slug, lesson: lesson.slug })}>{lesson.title}</a><small>{completedIds.has(lesson.id) ? 'Completed' : `${lesson.estimated_minutes} min`}</small></li>)}</ol><h3>Applied work</h3><ul className="exercise-list">{moduleExercises.map((exercise) => <li className={completedExerciseIds.has(exercise.id) ? 'completed' : ''} key={exercise.id}><a href={academyUrl('exercise', { track: selectedTrack.slug, module: module.slug, exercise: exercise.slug })}>{exercise.title}</a><small>{completedExerciseIds.has(exercise.id) ? 'Completed' : 'Private draft available'}</small></li>)}</ul></>}</article> })}</section><a className="portal-text-link" href={academyUrl('academy')}>Return to Academy</a></div>

  if (!entitled) return <section className="portal-card"><h1>Membership required</h1><p>This lesson requires {selectedTrack.access_level} access or higher.</p><a href={academyUrl('course', { track: selectedTrack.slug })}>View course outline</a></section>
  if (!selectedModule || !selectedLesson) return <section className="portal-card"><h1>Lesson not found</h1><a href={academyUrl('course', { track: selectedTrack.slug })}>Return to course</a></section>
  const moduleLessons = lessons.filter((lesson) => lesson.module_id === selectedModule.id)
  const lessonIndex = moduleLessons.findIndex((lesson) => lesson.id === selectedLesson.id)
  const previous = moduleLessons[lessonIndex - 1]
  const next = moduleLessons[lessonIndex + 1]
  return <article className="portal-card lesson-experience"><p className="eyebrow">{selectedModule.title}</p><h1>{selectedLesson.title}</h1><p className="lesson-objective"><strong>Learning objective:</strong> {selectedLesson.objective}</p><div className="media-placeholder">{selectedLesson.media_url ? <a href={selectedLesson.media_url}>Open lesson media</a> : <><strong>Video or media coming soon</strong><small>This lesson can be divided into the number of video parts the final teaching requires.</small></>}</div><section><h2>Lesson</h2><p>{selectedLesson.content}</p>{selectedLesson.content_status !== 'final' && <p className="curriculum-source-note">This lesson is currently an authored outline. Final teaching, story, practice guidance, and optional faith-and-philosophy reflection still need to be added.</p>}</section><section><h2>Private reflection</h2>{stringList(selectedLesson.reflection_prompts).map((prompt) => <p key={prompt}>{prompt}</p>)}<label className="journal-field">Your private journal<textarea rows={8} maxLength={10000} value={journal} onChange={(event) => { setJournal(event.target.value); setJournalStatus('Unsaved changes') }} /></label><button className="secondary-button" type="button" onClick={saveJournal}>Save reflection</button>{journalStatus && <small role="status">{journalStatus}</small>}</section><div className="lesson-completion"><button className="primary-button" type="button" onClick={() => setLessonStatus(selectedLesson, completedIds.has(selectedLesson.id) ? 'in_progress' : 'completed')}>{completedIds.has(selectedLesson.id) ? 'Mark in progress' : 'Mark lesson complete'}</button></div><nav className="lesson-navigation">{previous ? <a href={academyUrl('lesson', { track: selectedTrack.slug, module: selectedModule.slug, lesson: previous.slug })}>← {previous.title}</a> : <a href={academyUrl('course', { track: selectedTrack.slug })}>← Course overview</a>}{next ? <a href={academyUrl('lesson', { track: selectedTrack.slug, module: selectedModule.slug, lesson: next.slug })}>{next.title} →</a> : <a href={academyUrl('course', { track: selectedTrack.slug })}>Course overview →</a>}</nav></article>
}
