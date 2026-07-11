import type { AcademyProgram } from '../types/academy'

export const academyProgram: AcademyProgram = {
  brand: 'AU-STELLAR LIFE Academy',
  tagline: 'The Pursuit of Human Excellence',
  slogan: 'Refine. Strive. Live. Thrive.',
  disciplines: ['Psychology', 'Philosophy', 'Science', 'Leadership', 'Relationships', 'Purpose'],
  promise:
    'A structured human development curriculum for refining the individual, strengthening relationships, and building communities that protect, serve, and endure.',
  tracks: [
    {
      id: 'individual',
      title: 'AU-STELLAR INDIVIDUAL™',
      coreIdea: 'Refine Yourself',
      audience: 'Personal growth, identity, emotional intelligence, habits, purpose, discipline, and character.',
      description:
        'Develop the inner architecture required to live with purpose, solve meaningful problems, and become a steadier person under pressure.',
    },
    {
      id: 'relationship',
      title: 'AU-STELLAR RELATIONSHIP™',
      coreIdea: 'Build Together',
      audience: 'Couples, communication, trust, attachment, conflict, forgiveness, and family connection.',
      description:
        'The home of Rebuilding Us: a relationship framework for slowing the cycle, seeing the pattern, and choosing repair over drift.',
    },
    {
      id: 'community',
      title: 'AU-STELLAR COMMUNITY™',
      coreIdea: 'Strengthen Culture',
      audience: 'Schools, mentorships, businesses, families, organizations, and community culture.',
      description:
        'Build durable networks by developing stronger individuals and healthier relationships that protect, serve, and strengthen future generations.',
    },
  ],
  modules: [
    {
      id: 'individual-foundations',
      trackId: 'individual',
      title: 'Foundations of Self-Refinement',
      subtitle: 'Identity, awareness, and personal standards',
      description:
        'A starting module for understanding who you are becoming, what patterns are shaping you, and what standards will guide your growth.',
      outcomes: [
        'Name the identity you are building.',
        'Identify recurring emotional and behavioral patterns.',
        'Define personal standards that can survive pressure.',
      ],
      lessons: [
        {
          id: 'identity-direction',
          title: 'Identity and Direction',
          objective: 'Clarify the kind of person you are practicing becoming.',
          coreIdeas: ['Identity is practiced before it is proven.', 'Direction reduces emotional drift.', 'Purpose becomes practical through responsibility.'],
          practice: 'Write a one-sentence identity standard beginning with "I am becoming someone who..."',
          reflection: 'Where are your current choices inconsistent with the person you say you want to become?',
        },
        {
          id: 'emotional-awareness',
          title: 'Emotional Awareness Under Pressure',
          objective: 'Notice emotional signals before they become automatic reactions.',
          coreIdeas: ['Emotions carry information.', 'Awareness creates choice.', 'Regulation begins with naming what is happening.'],
          practice: 'Pause during one stressful moment and label the feeling, fear, impulse, and need.',
          reflection: 'What emotion most often drives your decisions before you realize it?',
        },
        {
          id: 'discipline-character',
          title: 'Discipline as Character Practice',
          objective: 'Connect daily discipline to character formation rather than image management.',
          coreIdeas: ['Discipline is repeated self-respect.', 'Small promises build self-trust.', 'Character is visible under inconvenience.'],
          practice: 'Choose one non-negotiable daily action for seven days.',
          reflection: 'What do you learn about yourself when no one is watching?',
        },
      ],
      resources: [
        {
          id: 'self-refinement-assessment',
          type: 'assessment',
          title: 'Self-Refinement Baseline',
          prompt: 'Rate each statement from 1 to 5, then choose one focus area for the next week.',
          items: [
            'I can describe the person I am becoming.',
            'I notice my emotional patterns before reacting.',
            'My habits reflect my stated values.',
            'I solve meaningful problems instead of avoiding discomfort.',
          ],
        },
        {
          id: 'identity-journal',
          type: 'journal',
          title: 'Identity Alignment Journal',
          prompt: 'Use these prompts at the end of the day.',
          items: [
            'Where did I act in alignment today?',
            'Where did I betray my own standard?',
            'What is one repair I can make tomorrow?',
          ],
        },
        {
          id: 'discipline-worksheet',
          type: 'worksheet',
          title: 'Seven-Day Discipline Map',
          prompt: 'Define one small discipline and make it trackable.',
          items: ['Daily action', 'Trigger moment', 'Likely obstacle', 'Recovery plan', 'Completion score'],
        },
      ],
    },
    {
      id: 'relationship-rebuilding-us',
      trackId: 'relationship',
      title: 'Rebuilding Us Relationship Framework',
      subtitle: 'Communication, trust, conflict, and repair',
      description:
        'A practical relationship module for couples and individuals who want to understand the pattern beneath recurring conflict.',
      outcomes: [
        'Map the conflict cycle without blaming one person.',
        'Practice clearer communication and emotional regulation.',
        'Create a repair rhythm for rebuilding trust.',
      ],
      lessons: [
        {
          id: 'pattern-before-problem',
          title: 'The Pattern Before the Problem',
          objective: 'Separate the recurring relationship pattern from the surface argument.',
          coreIdeas: ['Most conflict repeats before it resolves.', 'The pattern is the shared opponent.', 'Awareness lowers defensiveness.'],
          practice: 'Describe one recurring argument as a cycle with triggers, interpretations, emotions, and reactions.',
          reflection: 'What do you usually protect when conflict begins?',
        },
        {
          id: 'communication-clarity',
          title: 'Communication With Clarity',
          objective: 'Replace accusation and mind-reading with clear emotional language.',
          coreIdeas: ['Clarity reduces threat.', 'Requests work better than verdicts.', 'Listening is an act of leadership.'],
          practice: 'Use the sentence: "When this happens, I feel..., I tend to..., and what I need is..."',
          reflection: 'What do you hope your partner understands that you rarely say directly?',
        },
        {
          id: 'trust-repair',
          title: 'Trust and Repair',
          objective: 'Build a repeatable process for accountability, forgiveness, and renewed safety.',
          coreIdeas: ['Repair requires ownership.', 'Forgiveness does not erase structure.', 'Trust grows through consistent evidence.'],
          practice: 'Create a repair agreement with one apology behavior, one changed action, and one check-in time.',
          reflection: 'What evidence would help trust feel believable again?',
        },
      ],
      resources: [
        {
          id: 'relationship-cycle-questionnaire',
          type: 'questionnaire',
          title: 'Relationship Cycle Questionnaire',
          prompt: 'Answer individually first, then compare answers without debating.',
          items: [
            'What topic most often starts the cycle?',
            'What do I feel in my body when the cycle begins?',
            'What story do I tell myself about the other person?',
            'What do I do that makes repair harder?',
          ],
        },
        {
          id: 'repair-exercise',
          type: 'exercise',
          title: 'Ten-Minute Repair Conversation',
          prompt: 'Use a timer and keep the goal to understanding, not winning.',
          items: ['Two minutes: what happened', 'Two minutes: what I felt', 'Two minutes: what I needed', 'Two minutes: ownership', 'Two minutes: next repair step'],
        },
        {
          id: 'rebuilding-us-slides',
          type: 'slideOutline',
          title: 'Rebuilding Us Intro Slide Outline',
          prompt: 'Use this outline for a future workshop, webinar, or video lesson.',
          items: ['The shared opponent is the pattern', 'Emotional regulation before resolution', 'Communication as translation', 'Trust as repeated evidence', 'Repair as a lifestyle'],
        },
      ],
    },
    {
      id: 'community-culture',
      trackId: 'community',
      title: 'Culture That Protects and Serves',
      subtitle: 'Leadership, mentorship, families, and organizations',
      description:
        'A culture-building module for leaders who want to strengthen people, relationships, and durable networks of support.',
      outcomes: [
        'Define the culture you are responsible for shaping.',
        'Identify weak points in trust, mentorship, and accountability.',
        'Design a small community-strengthening initiative.',
      ],
      lessons: [
        {
          id: 'culture-is-practiced',
          title: 'Culture Is Practiced',
          objective: 'Understand culture as repeated behavior, not a slogan.',
          coreIdeas: ['Culture is what gets repeated.', 'Leaders make standards visible.', 'Communities become durable through shared responsibility.'],
          practice: 'List five behaviors your current culture rewards and five behaviors it tolerates.',
          reflection: 'What does your environment teach people to become?',
        },
        {
          id: 'mentorship-networks',
          title: 'Mentorship and Durable Networks',
          objective: 'Create support structures that help people grow before crisis hits.',
          coreIdeas: ['Mentorship transfers strength.', 'Networks protect people from isolation.', 'Education creates opportunity.'],
          practice: 'Map three people you can support and three people who can challenge you.',
          reflection: 'Who is becoming stronger because you are present?',
        },
        {
          id: 'service-leadership',
          title: 'Strength in Service',
          objective: 'Turn personal growth into protection, contribution, and opportunity for others.',
          coreIdeas: ['Strength is stewardship.', 'Leadership lifts the struggling without enabling stagnation.', 'Purpose becomes communal through service.'],
          practice: 'Design one small act of service that can be repeated monthly.',
          reflection: 'Where can your strength reduce someone else’s unnecessary suffering?',
        },
      ],
      resources: [
        {
          id: 'culture-audit',
          type: 'assessment',
          title: 'Community Culture Audit',
          prompt: 'Score each area from 1 to 5 and identify the most urgent gap.',
          items: ['Trust', 'Communication', 'Accountability', 'Mentorship', 'Opportunity', 'Service'],
        },
        {
          id: 'initiative-worksheet',
          type: 'worksheet',
          title: 'Community Initiative Planner',
          prompt: 'Draft a simple initiative that can start without funding or new systems.',
          items: ['Problem being solved', 'People served', 'Weekly action', 'Mentors or leaders needed', 'Evidence of impact'],
        },
        {
          id: 'leadership-journal',
          type: 'journal',
          title: 'Leadership Reflection',
          prompt: 'Reflect after a hard leadership moment.',
          items: ['What standard did I model?', 'Where did I avoid a necessary conversation?', 'Who needed more clarity, care, or challenge?'],
        },
      ],
    },
  ],
}
