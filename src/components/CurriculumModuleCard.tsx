import type { CurriculumModule } from '../types/academy'

const resourceLabels = {
  assessment: 'Assessment',
  questionnaire: 'Questionnaire',
  journal: 'Journal',
  worksheet: 'Worksheet',
  exercise: 'Exercise',
  slideOutline: 'Slide Outline',
}

type CurriculumModuleCardProps = {
  module: CurriculumModule
}

export function CurriculumModuleCard({ module }: CurriculumModuleCardProps) {
  return (
    <article className="module-card">
      <div className="module-heading">
        <p className="card-kicker">{module.subtitle}</p>
        <h3>{module.title}</h3>
        <p>{module.description}</p>
      </div>

      <div className="module-block">
        <h4>Outcomes</h4>
        <ul>
          {module.outcomes.map((outcome) => (
            <li key={outcome}>{outcome}</li>
          ))}
        </ul>
      </div>

      <div className="lesson-grid">
        {module.lessons.map((lesson) => (
          <section className="lesson-card" key={lesson.id}>
            <h4>{lesson.title}</h4>
            <p>{lesson.objective}</p>
            <ul>
              {lesson.coreIdeas.map((idea) => (
                <li key={idea}>{idea}</li>
              ))}
            </ul>
            <div className="lesson-practice">
              <strong>Practice:</strong> {lesson.practice}
            </div>
            <div className="lesson-practice">
              <strong>Reflect:</strong> {lesson.reflection}
            </div>
          </section>
        ))}
      </div>

      <div className="resource-grid">
        {module.resources.map((resource) => (
          <section className="resource-card" key={resource.id}>
            <span>{resourceLabels[resource.type]}</span>
            <h4>{resource.title}</h4>
            <p>{resource.prompt}</p>
            <ol>
              {resource.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </article>
  )
}
