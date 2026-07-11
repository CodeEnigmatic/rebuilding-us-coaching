import hero from './assets/austellarlife.jpg'
import identityImage from './assets/austellar-identity.jpg'
import individualImage from './assets/austellar.individual.jpg'
import relationshipImage from './assets/austellar.relationship.jpg'
import communityImage from './assets/austellar.community.jpg'
import siteBG from './assets/aulogo.jpg'
import bookCover from './assets/book-cover.jpeg'
import { SiteHeader } from './components/SiteHeader'

const academyProgram = {
  brand: 'AU-STELLAR LIFE Academy',
  tagline: 'The Pursuit of Human Excellence',
  slogan: 'Refine. Strive. Live. Thrive.',
  promise: 'Tier-based training for refining the individual, strengthening relationships, and building communities that protect, serve, and endure.',
  tracks: [
    { id: 'individual', title: 'AU-STELLAR INDIVIDUAL™', description: 'Develop clarity, character, discipline, emotional intelligence, purpose, and personal leadership.' },
    { id: 'relationship', title: 'AU-STELLAR RELATIONSHIP™', description: 'Build communication, trust, connection, respect, growth, and lasting commitment.' },
    { id: 'community', title: 'AU-STELLAR COMMUNITY™', description: 'Strengthen leadership, education, collaboration, organizations, innovation, and community culture.' },
  ],
}

const trainingTiers = [
  { name: 'Foundation', level: 'Tier 1', description: 'Learn the core framework and establish practical daily foundations.' },
  { name: 'Development', level: 'Tier 2', description: 'Go deeper with guided exercises, assessments, workshops, and applied training.' },
  { name: 'Mastery', level: 'Tier 3', description: 'Advance into leadership, accountability, and long-term transformation.' },
]

const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'Vision', href: '#vision' },
  { label: 'Individual', href: '#individual' },
  { label: 'Relationship', href: '#relationship' },
  { label: 'Community', href: '#community' },
  { label: 'Book', href: '#book' },
  { label: 'Contact', href: '#contact' },
  { label: 'Join Academy', href: '#membership' },
]

export function App() {
  return (
    <div className="page-shell" style={{ backgroundImage: `url(${siteBG})` }}>
      <SiteHeader navItems={navItems} />

      <section id="home" className="hero academy-hero">
        <img
          className="hero-image"
          src={hero}
          alt="AU-STELLAR LIFE — The Pursuit of Human Excellence"
        />
        <img
          className="identity-image"
          src={identityImage}
          alt="What it means to have an AU-STELLAR LIFE: refine yourself, strive toward excellence, and shape your life's course."
        />
      </section>

      <main>
        <section id="vision" className="section vision-section">
          <div className="glass-box wide-box vision-box">
            <p className="eyebrow">The Vision</p>
            <h2>Build Better People. Strengthen Relationships. Transform Communities.</h2>
            <p>
              AU-STELLAR LIFE is a human-development vision built on a simple truth: lasting change moves
              from the inside out. When individuals develop clarity, character, discipline, and purpose,
              they become capable of building healthier relationships. Stronger relationships, in turn,
              create families, organizations, and communities that protect, serve, and endure.
            </p>
            <p>
              The Academy brings psychology, philosophy, science, leadership, relationships, and purpose
              together into one practical path—the pursuit of human excellence for ourselves, for one
              another, and for the world we leave behind.
            </p>
          </div>
        </section>

        <section className="section pathways-section" aria-labelledby="pathways-title">
          <div className="pathways-heading">
            <p className="eyebrow">Three Paths. One Vision.</p>
            <h2 id="pathways-title">The AU-STELLAR LIFE Framework</h2>
            <p>Explore the three connected foundations of lasting human development.</p>
          </div>

          <div className="pathway-list">
            <article id="individual" className="pathway-panel">
              <img src={individualImage} alt="AU-STELLAR Individual framework: identity, mindset, discipline, emotions, character, purpose, health, wisdom, courage, leadership, clarity, focus, freedom, growth, strength, and integrity." />
              <div className="pathway-invitation">
                <p>Ready to refine yourself and unlock your potential?</p>
                <a href="#individual-membership" className="primary-button">Join Individual Training</a>
              </div>
            </article>

            <article id="relationship" className="pathway-panel">
              <img src={relationshipImage} alt="AU-STELLAR Relationship framework: communication, trust, connection, respect, growth, and commitment." />
              <div className="pathway-invitation">
                <p>Ready to build a stronger relationship on purpose?</p>
                <a href="#relationship-membership" className="primary-button">Join Relationship Training</a>
              </div>
            </article>

            <article id="community" className="pathway-panel">
              <img src={communityImage} alt="AU-STELLAR Community framework: leadership, education, collaboration, organizations, innovation, and community." />
              <div className="pathway-invitation">
                <p>Ready to lead, connect, and build a stronger future?</p>
                <a href="#community-membership" className="primary-button">Join Community Training</a>
              </div>
            </article>
          </div>
        </section>

        <section className="section philosophy-section">
          <div className="glass-box">
            <h2>The Philosophy</h2>
            <p>
              To live AU-STELLAR LIFE is to burn away what holds us back, refining ourselves; strive toward
              excellence by choosing to build rather than destroy; and recognize that our daily experiences,
              choices, and relationships shape the course of our lives.
            </p>
            <p className="motto">{academyProgram.slogan}</p>
          </div>
        </section>

        <section id="book" className="section book-section">
          <div className="glass-box book-container">
            <div className="book-text">
              <p className="eyebrow">AU-STELLAR RELATIONSHIP Framework</p>
              <h2>Rebuilding Us: A Relationship Framework by AU-STELLAR LIFE</h2>
              <p className="book-intro">
                Rebuilding Us remains part of the ecosystem as the relationship framework inside AU-STELLAR
                RELATIONSHIP™.
              </p>
              <p>
                The book and project support the Academy curriculum through communication, emotional control,
                trust, conflict, intimacy, and pattern awareness.
              </p>
              <a
                href="https://www.amazon.com/Rebuilding-Us-spark-Rekindle-ablaze-ebook/dp/B0GX2XB5YT/"
                target="_blank"
                rel="noopener noreferrer"
                className="book-button"
              >
                View on Amazon
              </a>
            </div>
            <div className="book-image">
              {/* TODO: Replace or redesign this cover image when the AU-STELLAR LIFE Academy edition is ready. */}
              <img src={bookCover} alt="Rebuilding Us book cover" />
            </div>
          </div>
        </section>

        <section id="contact" className="section contact-section">
          <div className="glass-box">
            <h2>Build the Academy With Intention</h2>
            <p>
              This first version is ready to expand with more lessons, facilitator guides, video scripts,
              workbook exports, user progress, and eventually AI coaching once the foundation is mature.
            </p>
            <div className="contact-highlight">
              <p>
                Next content areas can include facilitator notes, certification rubrics, downloadable
                workbooks, and lesson scripts for video production.
              </p>
            </div>
            <a href="mailto:your-email@example.com?subject=AU-STELLAR LIFE Academy Inquiry" className="contact-button">
              Contact AU-STELLAR LIFE
            </a>
          </div>
        </section>

        <section id="membership" className="section academy-section">
          <div className="overlay membership-intro">
            <p className="eyebrow">{academyProgram.slogan}</p>
            <h2>{academyProgram.brand}</h2>
            <h2>{academyProgram.tagline}</h2>
            <p>{academyProgram.promise}</p>
            <p className="academy-lock">Academy lessons, assessments, exercises, and training resources are available only to enrolled members.</p>
          </div>

          <div className="membership-paths">
            {academyProgram.tracks.map((track) => (
              <article id={`${track.id}-membership`} className="membership-path" key={track.id}>
                <p className="eyebrow">Choose Your Path</p>
                <h2>{track.title}</h2>
                <p>{track.description}</p>
                <div className="tier-grid">
                  {trainingTiers.map((tier) => (
                    <div className="tier-card" key={tier.name}>
                      <span>{tier.level}</span>
                      <h3>{tier.name}</h3>
                      <p>{tier.description}</p>
                      <a
                        className="primary-button"
                        href={`mailto:your-email@example.com?subject=${encodeURIComponent(`${track.title} — ${tier.name} enrollment`)}`}
                      >
                        Choose {tier.name}
                      </a>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
