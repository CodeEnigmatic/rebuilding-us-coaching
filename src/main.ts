import './style.css'
import hero from './assets/hero.jpg'
import siteBG from './assets/background.jpeg'
import bookCover from './assets/book-cover.jpeg'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<div class="page-shell" style="background-image: url(${siteBG})">

  <!-- HERO -->
  <section class="hero" style="background-image: url(${hero})">
    <div class="overlay">
      <h1>Find the spark. Rekindle the flame. Set your love ablaze.</h1>
    </div>
  </section>

  <!-- BURN OUT -->
  <section class="section burn-out-section">
    <h2>Why do most relationships burn out?</h2>

    <p>It’s not always incompatibility.</p>
    <p>It’s not always irreconcilable differences.</p>

    <p class="anchor-line">
      It’s the perception or lack of awareness of the patterns.
    </p>

    <p>
      Emotional dysregulation and the behaviors that follow when the relationship is under pressure.
    </p>

    <p>We communicate—but we aren’t clearly heard or understood.</p>
    <p>We allow the feelings from the past to dictate how we respond.</p>
    <p>We lack confidence in our partner — then project insecurities.</p>
    <p>We don’t understand each other’s emotional handbook.</p>

    <p>
      We want intimacy—<br>
      but our thoughts and emotions derail connection.
    </p>

    <p>
      We chase what we see—<br>
      in movies, music, and curated moments—
    </p>

    <p>but our patterns don’t reflect connection.</p>

    <p class="closing-lines">
      They reflect tension.<br>
      A lack of emotional awareness.<br>
      A negative perspective.
    </p>
  </section>

  <!-- REBUILDING -->
  <section class="section rebuilding-section">
    <h2>How do couples start rebuilding?</h2>

    <p>We are quick to judge and jump to conclusions—but fail to read deeper.</p>

    <p class="anchor-line">
      Real change starts when we slow down enough to see the pattern.
    </p>
  </section>

  <!-- OFFER -->
  <section class="section offer-section">
    <div class="glass-box">
      <h2>How I Help</h2>
    </div>
  </section>

  <!-- PRICING -->
  <section class="section pricing-section">
    <div class="glass-box">
      <h2>Pricing</h2>
    </div>
  </section>

  <!-- CTA -->
  <section class="section cta-section">
    <div class="glass-box">
      <h2>Start Rebuilding Today</h2>
    </div>
  </section>

  <!-- CONTACT -->
  <section id="contact" class="section contact-section">
    <div class="glass-box">
      <h2>Contact</h2>
    </div>
  </section>

  <!-- BOOK -->
  <section class="section book-section">
    <div class="glass-box book-container">
      <div class="book-text">
        <h2>Rebuilding Us</h2>

        <a
          href="https://www.amazon.com/Rebuilding-Us-spark-Rekindle-ablaze-ebook/dp/B0GX2XB5YT/"
          target="_blank"
          class="book-button"
        >
          View on Amazon
        </a>
      </div>

      <div class="book-image">
        <img src="${bookCover}" alt="Rebuilding Us Book Cover">
      </div>
    </div>
  </section>

  <!-- YOUTUBE -->
  <section class="section youtube-section">
    <h2>Watch & Learn</h2>

    <div class="glass-box">
      <p>
        In my Rebuilding US Project series, I break down real relationship dynamics,
        communication patterns, and emotional awareness on my YouTube channel.
      </p>

      <a
        href="https://www.youtube.com/@Rebuilding.US.Project"
        target="_blank"
        style="display:inline-block; margin-top:20px; padding:12px 24px; background:red; color:white; font-weight:700; text-decoration:none; border-radius:8px;"
      >
        Watch on YouTube
      </a>
    </div>
  </section>

  <!-- CLOSING (FADE SECTION) -->
  <section class="section closing-section">
    <div class="glass-box">

      <p class="fade-line">
        Transformation doesn’t happen all at once. Life and relationships are like a game of Tetris.
      </p>

      <p class="fade-line">
        Experiences, mistakes, challenges, pain, joy, and the tools you pick up along the way are all stacking themselves one after another.
      </p>

      <p class="fade-line">
        Every once in a while, you receive an epiphany—and that epiphany turns into a life-changing realization.
      </p>

      <p class="fade-line">
        It takes time to absorb the lesson. Once absorbed, when acted upon with intention and consistency, it leads to real change.
      </p>

      <p class="fade-line closing-line">
        Think consistent progress rather than perfection. Anchor yourself in the storm—and embrace the transformation.
      </p>

    </div>
  </section>

</div>
`

// FADE ANIMATION
const fadeLines = document.querySelectorAll('.fade-line')

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show')
      }
    })
  },
  {
    threshold: 0.25,
  }
)

fadeLines.forEach((line) => {
  observer.observe(line)
})