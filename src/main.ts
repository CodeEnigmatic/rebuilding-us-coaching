import './style.css'
import hero from './assets/hero.jpg'
import siteBG from './assets/background.jpeg'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<div class="page-shell" style="background-image: url(${siteBG})">
  <section class="hero" style="background-image: url(${hero})">
    <div class="overlay">
      <h1>Find the spark. Rekindle the flame. Set your love ablaze.</h1>
      
    </div>
  </section>


  <section class="section burn-out-section">
  <h2>Why do most relationships burn out?</h2>

  <p>It’s not always incompatibility.</p>
  <p>It’s not always irreconcilable differences.</p>

  <p class="anchor-line">It’s the perception or lack of awareness of the patterns.</p>

  <p>
   1.  Emotional dysregulation and the behaviors that follow when the relationship is under pressure.
  </p>

  <p>We communicate—but we aren’t clearly heard or understood.</p>
  <p>We  allow the feelings from the past dictate how we respond in the present and future.</p>
  <p> We lack confidence in our partner - than project our insecurities onto the relationship.</p>
  <p>We don't understand each other's relationship emotional handbook - we fail to meet each others expectations and desires .</p>

  <p>
    We want intimacy—<br>
    but our thoughts, desires, and emotions can derail us from connection.
  </p>

  <p>
    We chase what we see—<br>
    in movies, in music, in curated moments online—
  </p>

  <p>but our patterns don’t reflect connection.</p>

  <p class="closing-lines">
    They reflect tension.<br>
    A Lack Emotional Awareness.<br>
    They have a negative perspective.
  </p>
</section>`

