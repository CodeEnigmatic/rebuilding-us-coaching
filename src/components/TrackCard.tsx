import type { AcademyTrack } from '../types/academy'

type TrackCardProps = {
  track: AcademyTrack
}

export function TrackCard({ track }: TrackCardProps) {
  return (
    <article className="academy-card track-card" id={track.id}>
      {/* TODO: Add a dedicated module graphic for this AU-STELLAR LIFE track. */}
      <p className="card-kicker">{track.coreIdea}</p>
      <h3>{track.title}</h3>
      <p className="audience">{track.audience}</p>
      <p>{track.description}</p>
    </article>
  )
}
