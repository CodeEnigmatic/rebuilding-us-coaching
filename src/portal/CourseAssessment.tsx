import { useCallback, useEffect, useMemo, useState } from 'react'
import { getSupabaseClient } from '../lib/supabase'
import type { Json } from '../types/database'

type Track = { id: string; slug: string; title: string }
type AssessmentKind = 'entry' | 'midpoint' | 'exit'
type Assessment = { id: string; assessment_type: AssessmentKind; title: string; version: number }
type Question = { id: string; dimension: string; prompt: string; display_order: number }
type Attempt = { id: string; assessment_id: string; completed_at: string | null; dimension_scores: Json }
type Scores = Record<string, number>

const ratingLabels = ['Not true yet', 'Rarely true', 'Sometimes true', 'Usually true', 'Consistently true']
const dimensionOrder = ['Awareness', 'Understanding', 'Strategy', 'Transformation', 'Excellence', 'Love', 'Legacy', 'Alignment', 'Resilience']
const courseUrl = (track: string) => `/?${new URLSearchParams({ portal: 'course', track }).toString()}`

function scoreRecord(value: Json): Scores {
  if (!value || Array.isArray(value) || typeof value !== 'object') return {}
  return Object.fromEntries(dimensionOrder.flatMap((dimension) => typeof value[dimension] === 'number' ? [[dimension, value[dimension] as number]] : []))
}

function RadarChart({ scores, label }: { scores: Scores; label: string }) {
  const dimensions = dimensionOrder.filter((dimension) => scores[dimension] !== undefined)
  const size = 420
  const center = size / 2
  const radius = 125
  const labelRadius = 174
  const strongestScore = Math.max(...Object.values(scores))
  const weakestScore = Math.min(...Object.values(scores))
  const position = (index: number, distance: number) => {
    const angle = (Math.PI * 2 * index) / dimensions.length - Math.PI / 2
    return { x: center + Math.cos(angle) * distance, y: center + Math.sin(angle) * distance, cosine: Math.cos(angle) }
  }
  const scorePoint = (index: number, value: number) => position(index, radius * (value / 5))
  const polygon = dimensions.map((dimension, index) => { const point = scorePoint(index, scores[dimension]); return `${point.x},${point.y}` }).join(' ')
  return <figure className="radar-result"><svg viewBox={`0 0 ${size} ${size}`} role="img" aria-labelledby={`radar-title-${label} radar-description-${label}`}><title id={`radar-title-${label}`}>{label} assessment radar chart</title><desc id={`radar-description-${label}`}>A labeled visual summary of nine self-reported AU-STELLAR dimensions. Gold markers identify the strongest current score and amber-red markers identify the lowest current growth area. The accompanying table contains the same information.</desc>{[1, 2, 3, 4, 5].map((level) => <g key={level}><circle cx={center} cy={center} r={radius * level / 5} fill="none" stroke="rgba(245,210,122,.2)" /><text x={center + 4} y={center - radius * level / 5 + 13} className="radar-scale">{level}</text></g>)}{dimensions.map((dimension, index) => { const edge = position(index, radius); return <line key={dimension} x1={center} y1={center} x2={edge.x} y2={edge.y} stroke="rgba(255,255,255,.18)" /> })}<polygon points={polygon} fill="rgba(245,210,122,.25)" stroke="#f5d27a" strokeWidth="3" />{dimensions.map((dimension, index) => { const point = scorePoint(index, scores[dimension]); const strongest = scores[dimension] === strongestScore; const weakest = scores[dimension] === weakestScore && weakestScore !== strongestScore; return <circle key={`score-${dimension}`} cx={point.x} cy={point.y} r={strongest ? 7 : 4} className={strongest ? 'radar-point strongest' : weakest ? 'radar-point weakest' : 'radar-point'} /> })}{dimensions.map((dimension, index) => { const labelPoint = position(index, labelRadius); const strongest = scores[dimension] === strongestScore; const weakest = scores[dimension] === weakestScore && weakestScore !== strongestScore; return <text key={`label-${dimension}`} x={labelPoint.x} y={labelPoint.y} dy="0.35em" textAnchor={labelPoint.cosine > 0.25 ? 'start' : labelPoint.cosine < -0.25 ? 'end' : 'middle'} className={strongest ? 'radar-label strongest' : weakest ? 'radar-label weakest' : 'radar-label'}>{dimension} ({scores[dimension]})</text> })}</svg><figcaption>{label} self-reflection profile</figcaption></figure>
}

function StrengthSummary({ scores }: { scores: Scores }) {
  const entries = dimensionOrder.filter((dimension) => scores[dimension] !== undefined).map((dimension) => [dimension, scores[dimension]] as const)
  const strongestScore = Math.max(...entries.map((entry) => entry[1]))
  const weakestScore = Math.min(...entries.map((entry) => entry[1]))
  const strongest = entries.filter((entry) => entry[1] === strongestScore).map((entry) => entry[0])
  const weakest = entries.filter((entry) => entry[1] === weakestScore).map((entry) => entry[0])
  return <div className="strength-summary"><article className="strength-card"><span>Strongest current attribute{strongest.length > 1 ? 's' : ''}</span><h3>{strongest.join(' · ')}</h3><p>At {strongestScore.toFixed(1)} out of 5, {strongest.length > 1 ? 'these are your highest relative scores' : 'this is your highest relative score'} in this self-reflection. Consider how this strength can support another area.</p></article><article className="growth-card"><span>Possible weakness or growth area{weakest.length > 1 ? 's' : ''}</span><h3>{weakest.join(' · ')}</h3><p>At {weakestScore.toFixed(1)} out of 5, {weakest.length > 1 ? 'these areas may deserve' : 'this area may deserve'} focused practice. A lower score is a starting point, not a permanent label.</p></article></div>
}

function ScoreTable({ scores, comparison }: { scores: Scores; comparison?: Scores }) {
  const strongestScore = Math.max(...Object.values(comparison ?? scores))
  const weakestScore = Math.min(...Object.values(comparison ?? scores))
  return <div className="assessment-score-table"><table><caption>{comparison ? 'Entry and exit score comparison' : 'Assessment dimension scores'}</caption><thead><tr><th>Dimension</th><th>{comparison ? 'Entry' : 'Score'}</th>{comparison && <th>Exit</th>}{comparison && <th>Change</th>}</tr></thead><tbody>{dimensionOrder.filter((dimension) => scores[dimension] !== undefined).map((dimension) => { const score = scores[dimension]; const current = comparison?.[dimension] ?? score; return <tr className={current === strongestScore ? 'strongest' : current === weakestScore && weakestScore !== strongestScore ? 'weakest' : ''} key={dimension}><th>{dimension}{current === strongestScore && <span className="score-marker">Strongest</span>}{current === weakestScore && weakestScore !== strongestScore && <span className="score-marker">Growth area</span>}</th><td>{score.toFixed(1)} / 5</td>{comparison && <td>{comparison[dimension]?.toFixed(1) ?? '—'} / 5</td>}{comparison && <td>{comparison[dimension] === undefined ? '—' : `${comparison[dimension] - score >= 0 ? '+' : ''}${(comparison[dimension] - score).toFixed(1)}`}</td>}</tr> })}</tbody></table></div>
}

export function CourseAssessment({ track, userId }: { track: Track; userId: string }) {
  const params = useMemo(() => new URLSearchParams(location.search), [])
  const requestedKind = params.get('type')
  const kind: AssessmentKind = requestedKind === 'midpoint' || requestedKind === 'exit' ? requestedKind : 'entry'
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [assessment, setAssessment] = useState<Assessment | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [attempts, setAttempts] = useState<Attempt[]>([])
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [currentScores, setCurrentScores] = useState<Scores | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const loadHistory = useCallback(async (nextAssessments: Assessment[]) => {
    if (!nextAssessments.length) return
    const { data, error: requestError } = await getSupabaseClient().from('assessment_attempts').select('id,assessment_id,completed_at,dimension_scores').eq('user_id', userId).in('assessment_id', nextAssessments.map((item) => item.id)).not('completed_at', 'is', null).order('completed_at', { ascending: false })
    if (requestError) setError(requestError.message)
    else setAttempts((data ?? []) as Attempt[])
  }, [userId])

  useEffect(() => {
    const load = async () => {
      const supabase = getSupabaseClient()
      const assessmentResult = await supabase.from('course_assessments').select('id,assessment_type,title,version').eq('track_id', track.id).eq('status', 'published').order('version', { ascending: false })
      if (assessmentResult.error) { setError(assessmentResult.error.message); setLoading(false); return }
      const nextAssessments = (assessmentResult.data ?? []) as Assessment[]
      setAssessments(nextAssessments)
      const selected = nextAssessments.find((item) => item.assessment_type === kind) ?? null
      setAssessment(selected)
      if (selected) {
        const questionResult = await supabase.from('assessment_questions').select('id,dimension,prompt,display_order').eq('assessment_id', selected.id).order('display_order')
        if (questionResult.error) setError(questionResult.error.message)
        else setQuestions((questionResult.data ?? []) as Question[])
      }
      await loadHistory(nextAssessments)
      setLoading(false)
    }
    void load()
  }, [kind, loadHistory, track.id])

  async function submit() {
    if (!assessment || questions.some((question) => !answers[question.id])) return
    setSubmitting(true); setError('')
    const scores = Object.fromEntries(questions.map((question) => [question.dimension, answers[question.id]]))
    const supabase = getSupabaseClient()
    const attemptResult = await supabase.from('assessment_attempts').insert({ user_id: userId, assessment_id: assessment.id }).select('id').single()
    if (attemptResult.error) { setError(attemptResult.error.message); setSubmitting(false); return }
    const responseResult = await supabase.from('assessment_responses').insert(questions.map((question) => ({ attempt_id: attemptResult.data.id, question_id: question.id, response: answers[question.id], score: answers[question.id] })))
    if (responseResult.error) setError(responseResult.error.message)
    else {
      const completionResult = await supabase.from('assessment_attempts').update({ dimension_scores: scores, completed_at: new Date().toISOString() }).eq('id', attemptResult.data.id)
      if (completionResult.error) setError(completionResult.error.message)
      else { setCurrentScores(scores); await loadHistory(assessments) }
    }
    setSubmitting(false)
  }

  if (loading) return <section className="portal-card"><h1>Loading assessment</h1></section>
  if (!assessment) return <section className="portal-card"><h1>Assessment unavailable</h1><p>No published {kind} assessment is available.</p></section>
  const completed = questions.filter((question) => answers[question.id]).length
  const entryAssessment = assessments.find((item) => item.assessment_type === 'entry')
  const exitAssessment = assessments.find((item) => item.assessment_type === 'exit')
  const entryAttempt = attempts.find((item) => item.assessment_id === entryAssessment?.id)
  const exitAttempt = attempts.find((item) => item.assessment_id === exitAssessment?.id)
  const entryScores = entryAttempt ? scoreRecord(entryAttempt.dimension_scores) : null
  const exitScores = exitAttempt ? scoreRecord(exitAttempt.dimension_scores) : null
  const latestCurrentAttempt = attempts.find((item) => item.assessment_id === assessment.id)
  const displayedScores = currentScores ?? (latestCurrentAttempt ? scoreRecord(latestCurrentAttempt.dimension_scores) : null)

  return <div className="portal-dashboard"><section className="portal-card assessment-experience"><p className="eyebrow">{track.title}</p><h1>{assessment.title}</h1><p>Version {assessment.version} · {kind === 'entry' ? 'Establish your baseline.' : kind === 'midpoint' ? 'Notice what is changing and where practice is still needed.' : 'Reflect on your current growth and compare it with your baseline.'}</p><p className="assessment-note">This is a self-reported coaching snapshot, not a diagnosis. Answer according to your current experience rather than the answer you think you should give.</p>{error && <p className="portal-alert error">{error}</p>}<div className="persisted-assessment-questions">{questions.map((question, index) => <fieldset key={question.id}><legend>{index + 1}. {question.prompt}</legend><div>{ratingLabels.map((label, ratingIndex) => { const value = ratingIndex + 1; return <label key={label}><input type="radio" name={question.id} value={value} checked={answers[question.id] === value} onChange={() => setAnswers((current) => ({ ...current, [question.id]: value }))} /><span>{value}<small>{label}</small></span></label> })}</div></fieldset>)}</div><button className="primary-button" disabled={submitting || completed !== questions.length} onClick={submit}>{submitting ? 'Saving…' : 'Complete assessment'}</button>{completed !== questions.length && <small>{completed} of {questions.length} answered</small>}</section>{displayedScores && <section className="portal-card"><h2>Your {kind} results</h2><p>Use the shape and scores to choose priorities for practice. Higher numbers describe greater current consistency, not greater human worth.</p><StrengthSummary scores={displayedScores} /><div className="assessment-results-layout"><RadarChart scores={displayedScores} label={kind} /><ScoreTable scores={displayedScores} /></div></section>}{entryScores && exitScores && <section className="portal-card"><h2>Entry-to-exit comparison</h2><p>Change scores describe movement in self-reported experience. They do not prove causation or guarantee permanent change.</p><StrengthSummary scores={exitScores} /><div className="assessment-results-layout"><RadarChart scores={exitScores} label="exit" /><ScoreTable scores={entryScores} comparison={exitScores} /></div></section>}<a className="portal-text-link" href={courseUrl(track.slug)}>Return to course</a></div>
}
