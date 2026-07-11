export type AcademyTrackId = 'individual' | 'relationship' | 'community'

export type CurriculumResourceType =
  | 'assessment'
  | 'questionnaire'
  | 'journal'
  | 'worksheet'
  | 'exercise'
  | 'slideOutline'

export type CurriculumResource = {
  id: string
  type: CurriculumResourceType
  title: string
  prompt: string
  items: string[]
}

export type Lesson = {
  id: string
  title: string
  objective: string
  coreIdeas: string[]
  practice: string
  reflection: string
}

export type CurriculumModule = {
  id: string
  trackId: AcademyTrackId
  title: string
  subtitle: string
  description: string
  outcomes: string[]
  lessons: Lesson[]
  resources: CurriculumResource[]
}

export type AcademyTrack = {
  id: AcademyTrackId
  title: string
  coreIdea: string
  audience: string
  description: string
}

export type AcademyProgram = {
  brand: string
  tagline: string
  slogan: string
  disciplines: string[]
  promise: string
  tracks: AcademyTrack[]
  modules: CurriculumModule[]
}
