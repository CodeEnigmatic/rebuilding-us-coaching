import type { MembershipTier } from '../types/database'

export type MaterialKind = 'Book pull' | 'Write' | 'Worksheet' | 'Video'

export type CurriculumDomainOutline = {
  id: string
  tier: Extract<MembershipTier, 'individual' | 'relationship'>
  title: string
  purpose: string
  lessonTopics: string[]
  materials: { kind: MaterialKind; title: string; note: string }[]
}

export const curriculumProductionOutlines: CurriculumDomainOutline[] = [
  {
    id: 'individual-awareness', tier: 'individual', title: '1. Awareness',
    purpose: 'Observe present reality, inner signals, and repeated patterns before trying to change them.',
    lessonTopics: ['What awareness is and is not', 'The story I am telling myself', 'Emotional, physical, and behavioral signals', 'Blind spots, bias, and the pause between trigger and response'],
    materials: [
      { kind: 'Book pull', title: 'Awareness stories and definitions', note: 'Locate passages about noticing patterns, internal narratives, or moments when greater awareness changed a decision.' },
      { kind: 'Write', title: 'Individual Awareness lesson guide', note: 'Define awareness, include your examples, and connect awareness to responsibility without shame.' },
      { kind: 'Worksheet', title: 'Trigger–Story–Feeling–Response Map', note: 'A repeatable one-page observation exercise.' },
      { kind: 'Video', title: 'Individual Awareness', note: 'Use the video already recorded; divide it into as many parts as the edit naturally requires.' },
    ],
  },
  {
    id: 'individual-identity', tier: 'individual', title: '2. Identity',
    purpose: 'Clarify who the member believes they are and who they are practicing becoming.',
    lessonTopics: ['Inherited and chosen identity', 'Labels, roles, beliefs, and values', 'Identity under pressure', 'Writing an identity standard'],
    materials: [
      { kind: 'Book pull', title: 'Identity and becoming', note: 'Locate personal stories or passages about self-concept, labels, values, and becoming.' },
      { kind: 'Write', title: 'Identity and Direction lesson', note: 'Explain how identity becomes visible through repeated choices.' },
      { kind: 'Worksheet', title: 'Identity Alignment Journal', note: 'Current identity, desired identity, evidence, contradictions, and next practice.' },
      { kind: 'Video', title: 'Who Are You Practicing Becoming?', note: 'Introduce identity as a practiced direction rather than a fixed label.' },
    ],
  },
  {
    id: 'individual-mindset', tier: 'individual', title: '3. Mindset',
    purpose: 'Recognize beliefs and interpretations that expand or restrict responsible action.',
    lessonTopics: ['Beliefs versus facts', 'Fixed and growth-oriented interpretations', 'Fear, avoidance, and self-protection', 'Reframing without denying reality'],
    materials: [
      { kind: 'Book pull', title: 'Beliefs, perspective, and growth', note: 'Locate examples of changed thinking, limiting beliefs, fear, or perseverance.' },
      { kind: 'Write', title: 'Belief Audit lesson', note: 'Teach members to test a belief for truth, usefulness, and responsibility.' },
      { kind: 'Worksheet', title: 'Belief-to-Behavior Audit', note: 'Belief, evidence, cost, alternative interpretation, and new action.' },
      { kind: 'Video', title: 'The Meaning You Give the Moment', note: 'Show how interpretation influences emotion and behavior.' },
    ],
  },
  {
    id: 'individual-emotional-regulation', tier: 'individual', title: '4. Emotional Regulation',
    purpose: 'Notice, name, tolerate, and respond to emotion without allowing it to control behavior.',
    lessonTopics: ['Emotions as information', 'Body cues and escalation', 'Pause, name, regulate, choose', 'Repair after an emotional reaction'],
    materials: [
      { kind: 'Book pull', title: 'Emotional pressure and response', note: 'Locate stories involving anger, fear, shame, grief, impulsivity, or recovery.' },
      { kind: 'Write', title: 'Regulation Before Reaction lesson', note: 'Keep the material educational and non-clinical; include when professional support is appropriate.' },
      { kind: 'Worksheet', title: 'Emotional Regulation Plan', note: 'Signals, triggers, grounding actions, support, and repair plan.' },
      { kind: 'Video', title: 'What Happens Before You React?', note: 'Walk through early signals and a practical pause.' },
    ],
  },
  {
    id: 'individual-habits', tier: 'individual', title: '5. Habits',
    purpose: 'Build small systems that make values and goals visible in daily behavior.',
    lessonTopics: ['Cue, routine, reward, and environment', 'Small promises and self-trust', 'Designing for consistency', 'Recovery after a missed day'],
    materials: [
      { kind: 'Book pull', title: 'Discipline and consistency', note: 'Locate passages about routines, standards, practice, setbacks, or self-trust.' },
      { kind: 'Write', title: 'Habits as Character Practice lesson', note: 'Connect systems and environment to discipline without moralizing every setback.' },
      { kind: 'Worksheet', title: 'Seven-Day Discipline Map', note: 'Use the existing draft and add cues, obstacles, tracking, and recovery.' },
      { kind: 'Video', title: 'The Small Promise You Keep', note: 'Teach one repeatable behavior as evidence of alignment.' },
    ],
  },
  {
    id: 'individual-purpose', tier: 'individual', title: '6. Purpose',
    purpose: 'Connect strengths, experience, responsibility, and service to meaningful direction.',
    lessonTopics: ['Purpose versus pressure to be impressive', 'Strengths, pain, skills, and service', 'Problems worth solving', 'Turning purpose into present responsibility'],
    materials: [
      { kind: 'Book pull', title: 'Purpose, calling, and service', note: 'Locate passages on meaning, contribution, faith, responsibility, or problems you felt called to solve.' },
      { kind: 'Write', title: 'Purpose Through Responsibility lesson', note: 'Offer reflection without promising one perfect calling.' },
      { kind: 'Worksheet', title: 'Purpose Intersection Map', note: 'Strengths, experience, pain overcome, people served, and next contribution.' },
      { kind: 'Video', title: 'Purpose Becomes Practical', note: 'Connect meaning to the next responsible action.' },
    ],
  },
  {
    id: 'individual-character', tier: 'individual', title: '7. Character',
    purpose: 'Practice integrity, courage, humility, compassion, and responsibility when choices become inconvenient.',
    lessonTopics: ['Character versus image', 'Integrity and alignment', 'Courage, humility, and ownership', 'Standards under inconvenience'],
    materials: [
      { kind: 'Book pull', title: 'Character under pressure', note: 'Locate stories about ownership, integrity, courage, humility, or making repair.' },
      { kind: 'Write', title: 'Character Is Practiced lesson', note: 'Define character as growth-oriented behavior, not a label of human worth.' },
      { kind: 'Worksheet', title: 'Character Evidence Review', note: 'Value, recent evidence, contradiction, repair, and next practice.' },
      { kind: 'Video', title: 'Who Are You When It Costs You?', note: 'Explore integrity when the better choice is inconvenient.' },
    ],
  },
  {
    id: 'individual-leadership', tier: 'individual', title: '8. Leadership',
    purpose: 'Develop self-leadership that creates clarity, responsibility, and constructive influence.',
    lessonTopics: ['Self-leadership before authority', 'Clarity and decision-making', 'Influence, service, and accountability', 'Leading without controlling'],
    materials: [
      { kind: 'Book pull', title: 'Leadership and responsibility', note: 'Locate lessons about influence, service, standards, decisions, or accountability.' },
      { kind: 'Write', title: 'Leadership Begins With Self lesson', note: 'Separate healthy influence from title, dominance, or control.' },
      { kind: 'Worksheet', title: 'Circle of Responsibility Map', note: 'What I control, influence, support, and must release.' },
      { kind: 'Video', title: 'The Standard You Model', note: 'Show how repeated behavior teaches more than stated values.' },
    ],
  },
  {
    id: 'individual-resilience', tier: 'individual', title: '9. Resilience',
    purpose: 'Adapt, recover, learn, and return to intentional growth after adversity or failure.',
    lessonTopics: ['Hardship without identity collapse', 'Recovery versus avoidance', 'Learning from setbacks', 'Returning to renewed awareness'],
    materials: [
      { kind: 'Book pull', title: 'Adversity, hope, and recovery', note: 'Locate stories of setbacks, grief, courage, adaptation, or rebuilding.' },
      { kind: 'Write', title: 'Refined, Not Defined lesson', note: 'Make room for pain while avoiding simplistic promises or forced positivity.' },
      { kind: 'Worksheet', title: 'Resilience Recovery Plan', note: 'What happened, what remains, support needed, lesson, and next step.' },
      { kind: 'Video', title: 'How Can This Refine Me?', note: 'Close the Individual pathway by returning resilience to awareness.' },
    ],
  },
  {
    id: 'relationship-communication', tier: 'relationship', title: '1. Communication',
    purpose: 'Replace accusation, assumption, and mind-reading with clear expression and responsible listening.',
    lessonTopics: ['Listening to understand', 'Observation versus accusation', 'Feelings, needs, and requests', 'Timing and emotional readiness'],
    materials: [
      { kind: 'Book pull', title: 'Communication and misunderstanding', note: 'Locate dialogue, stories, or principles about saying what is true and hearing what was meant.' },
      { kind: 'Write', title: 'Communication as Translation lesson', note: 'Build a repeatable structure for clear expression and listening.' },
      { kind: 'Worksheet', title: 'Clear Conversation Planner', note: 'Observation, feeling, story, need, request, and listening question.' },
      { kind: 'Video', title: 'Say What You Mean Without Making a Verdict', note: 'Demonstrate accusation versus clarity.' },
    ],
  },
  {
    id: 'relationship-trust', tier: 'relationship', title: '2. Trust',
    purpose: 'Understand trust as safety and repeated evidence built through truth, consistency, and repair.',
    lessonTopics: ['What trust requires', 'Reliability, honesty, and emotional safety', 'Trust injuries and accountability', 'Rebuilding through believable evidence'],
    materials: [
      { kind: 'Book pull', title: 'Trust, betrayal, and repair', note: 'Locate passages about broken trust, honesty, consistency, apology, or rebuilding.' },
      { kind: 'Write', title: 'Trust as Repeated Evidence lesson', note: 'Distinguish forgiveness, reconciliation, and restored trust.' },
      { kind: 'Worksheet', title: 'Trust Evidence Plan', note: 'Injury, impact, ownership, changed action, boundary, and review date.' },
      { kind: 'Video', title: 'What Makes Trust Believable Again?', note: 'Focus on consistent evidence rather than promises alone.' },
    ],
  },
  {
    id: 'relationship-conflict', tier: 'relationship', title: '3. Conflict',
    purpose: 'Identify the recurring cycle beneath surface arguments and build a safer path toward resolution.',
    lessonTopics: ['The pattern as the shared opponent', 'Trigger, interpretation, emotion, and reaction', 'Escalation and shutdown', 'Pause, return, and repair'],
    materials: [
      { kind: 'Book pull', title: 'Conflict cycles', note: 'Locate stories showing repeated arguments, defensiveness, escalation, avoidance, or repair.' },
      { kind: 'Write', title: 'The Pattern Before the Problem lesson', note: 'Explain the shared cycle without erasing individual responsibility.' },
      { kind: 'Worksheet', title: 'Relationship Cycle Map', note: 'Each person completes triggers, stories, feelings, reactions, and impacts separately.' },
      { kind: 'Video', title: 'Awareness, Expectations, and the Spiral', note: 'Use your beach-vacation story; edit into any number of parts needed to tell the trigger-to-repair sequence clearly.' },
    ],
  },
  {
    id: 'relationship-intimacy', tier: 'relationship', title: '4. Intimacy',
    purpose: 'Strengthen emotional, relational, and physical closeness through safety, honesty, and mutual care.',
    lessonTopics: ['Emotional safety and vulnerability', 'Affection, attention, and connection', 'Desire, consent, and respectful dialogue', 'Repairing distance without coercion'],
    materials: [
      { kind: 'Book pull', title: 'Closeness and disconnection', note: 'Locate passages on vulnerability, affection, loneliness, emotional safety, or reconnecting.' },
      { kind: 'Write', title: 'Intimacy Requires Safety lesson', note: 'Use respectful, non-coercive language and distinguish education from therapy.' },
      { kind: 'Worksheet', title: 'Connection Preferences Inventory', note: 'Ways each person gives, receives, requests, and declines connection.' },
      { kind: 'Video', title: 'Closeness Cannot Be Demanded', note: 'Explore safety, invitation, attention, and mutual responsibility.' },
    ],
  },
  {
    id: 'relationship-expectations', tier: 'relationship', title: '5. Expectations',
    purpose: 'Make hidden assumptions visible and turn unspoken expectations into realistic agreements or conscious release.',
    lessonTopics: ['Expectation versus agreement', 'Unspoken scripts and disappointment', 'Needs, preferences, and entitlement', 'Clarify, negotiate, or release'],
    materials: [
      { kind: 'Book pull', title: 'Expectations and disappointment', note: 'Locate stories where assumptions, plans, roles, or unmet hopes created conflict.' },
      { kind: 'Write', title: 'The Expectation You Never Said Out Loud lesson', note: 'Connect hidden expectations to stories, emotion, and behavior.' },
      { kind: 'Worksheet', title: 'Expectation-to-Agreement Map', note: 'Expectation, source, communication, realism, agreement, and release.' },
      { kind: 'Video', title: 'When the Day in Your Head Is Not the Day You Get', note: 'A companion reflection to the beach-vacation story.' },
    ],
  },
  {
    id: 'relationship-boundaries', tier: 'relationship', title: '6. Boundaries',
    purpose: 'Protect dignity, responsibility, and connection by clarifying what each person will and will not participate in.',
    lessonTopics: ['Boundary versus punishment or control', 'Ownership and consequences', 'Saying no with clarity', 'Respecting another person’s boundary'],
    materials: [
      { kind: 'Book pull', title: 'Boundaries and responsibility', note: 'Locate examples of limits, consequences, enabling, respect, or self-protection.' },
      { kind: 'Write', title: 'Boundaries Protect What Matters lesson', note: 'Include safety language and make clear that boundaries do not control another person.' },
      { kind: 'Worksheet', title: 'Boundary Builder', note: 'Situation, value protected, limit, action, communication, and support.' },
      { kind: 'Video', title: 'A Boundary Is About What I Will Do', note: 'Contrast a boundary with a threat or demand.' },
    ],
  },
  {
    id: 'relationship-parenting', tier: 'relationship', title: '7. Parenting',
    purpose: 'Create greater alignment between caregivers while protecting children from adult conflict and inconsistent standards.',
    lessonTopics: ['Shared values and different styles', 'Presenting a stable parenting team', 'Repair after parental conflict', 'Age-appropriate connection and discipline'],
    materials: [
      { kind: 'Book pull', title: 'Parenting, family, and modeled behavior', note: 'Locate stories or principles about children, discipline, family patterns, or caregiver alignment.' },
      { kind: 'Write', title: 'The Relationship Children Observe lesson', note: 'Avoid universal parenting claims; focus on values, modeling, consistency, and repair.' },
      { kind: 'Worksheet', title: 'Parenting Alignment Conversation', note: 'Values, current differences, non-negotiables, flexibility, and united next step.' },
      { kind: 'Video', title: 'What Are We Teaching Without Words?', note: 'Explore the relationship behaviors children repeatedly observe.' },
    ],
  },
  {
    id: 'relationship-shared-purpose', tier: 'relationship', title: '8. Shared Purpose',
    purpose: 'Move from merely managing life together toward a shared understanding of what the relationship is building and serving.',
    lessonTopics: ['Individual purpose within partnership', 'Shared values and priorities', 'Contribution, family, faith, and service', 'Turning vision into current commitments'],
    materials: [
      { kind: 'Book pull', title: 'Partnership and shared meaning', note: 'Locate passages about building together, service, family mission, or shared responsibility.' },
      { kind: 'Write', title: 'What Are We Building Together? lesson', note: 'Allow two distinct individuals to form shared direction without erasing personal identity.' },
      { kind: 'Worksheet', title: 'Shared Purpose Canvas', note: 'Values, people served, home culture, responsibilities, and next shared project.' },
      { kind: 'Video', title: 'Beyond Surviving the Week', note: 'Invite couples to name the larger purpose of their partnership.' },
    ],
  },
  {
    id: 'relationship-long-term-vision', tier: 'relationship', title: '9. Long-Term Vision',
    purpose: 'Create a flexible, honest picture of the relationship’s future and the practices needed to keep choosing it.',
    lessonTopics: ['Vision versus fantasy', 'Seasons, transitions, and changing needs', 'Rituals of connection and review', 'Legacy, aging, and continuing repair'],
    materials: [
      { kind: 'Book pull', title: 'Commitment, future, and legacy', note: 'Locate passages about endurance, seasons, long-term partnership, family legacy, or rebuilding.' },
      { kind: 'Write', title: 'The Relationship We Keep Building lesson', note: 'Close with an adaptable vision rather than a promise that circumstances will remain fixed.' },
      { kind: 'Worksheet', title: 'One-Year and Five-Year Relationship Vision', note: 'Connection, home, family, purpose, practices, risks, and quarterly review.' },
      { kind: 'Video', title: 'Choosing Us in the Next Season', note: 'Conclude with vision, resilience, and a repeatable relationship review.' },
    ],
  },
]
