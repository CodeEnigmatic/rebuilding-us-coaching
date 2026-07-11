import { useState } from 'react'
import hero from './assets/austellarlife.jpg'
import identityImage from './assets/austellar-identity.jpg'
import individualImage from './assets/austellar.individual.jpg'
import relationshipImage from './assets/austellar.relationship.jpg'
import communityImage from './assets/austellar.community.jpg'
import siteBG from './assets/aulogo.jpg'
import bookCover from './assets/book-cover.jpeg'
import gymShirtImage from './assets/gymislife.jpg'
import ethosShirtImage from './assets/austellarlife-ethos.jpg'
import { SiteHeader } from './components/SiteHeader'

type MerchProduct = {
  id: string
  name: string
  description: string
  price: number
  image: string
}

type CartItem = MerchProduct & {
  size: string
  quantity: number
}

const merchProducts: MerchProduct[] = [
  {
    id: 'life-is-a-gym-shirt',
    name: 'Life Is a Gym Tee',
    description: 'A black training tee built around strength, endurance, technique, focus, and mental toughness.',
    price: 30,
    image: gymShirtImage,
  },
  {
    id: 'austellar-ethos-shirt',
    name: 'AU-STELLAR LIFE Ethos Tee',
    description: 'The AU-STELLAR LIFE identity and ethos presented across the front, sleeve, and back.',
    price: 30,
    image: ethosShirtImage,
  },
]

const shirtSizes = ['S', 'M', 'L', 'XL', '2XL']

const academyProgram = {
  brand: 'AU-STELLAR LIFE Academy',
  tagline: 'The Pursuit of Human Excellence',
  slogan: 'Refine. Strive. Live. Thrive.',
  promise: 'Tier-based training for refining the individual, strengthening relationships, and building communities that protect, serve, and endure.',
}

const trainingTiers = [
  {
    id: 'individual-membership',
    level: 'Tier 1',
    name: 'Individual',
    access: ['AU-STELLAR Individual'],
    description: 'Refine yourself through identity, mindset, discipline, emotional intelligence, purpose, and personal leadership.',
  },
  {
    id: 'relationship-membership',
    level: 'Tier 2',
    name: 'Relationship',
    access: ['Everything in Tier 1', 'AU-STELLAR Relationship'],
    description: 'Build communication, trust, connection, respect, growth, and lasting commitment.',
  },
  {
    id: 'community-membership',
    level: 'Tier 3',
    name: 'Community',
    access: ['Everything in Tiers 1 and 2', 'AU-STELLAR Community'],
    description: 'Strengthen leadership, education, collaboration, organizations, innovation, and community culture.',
  },
]

const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'Vision', href: '#vision' },
  { label: 'Individual', href: '#individual' },
  { label: 'Relationship', href: '#relationship' },
  { label: 'Community', href: '#community' },
  { label: 'Merch', href: '#merch' },
  { label: 'Book', href: '#book' },
  { label: 'Watch', href: '#youtube' },
  { label: 'Contact', href: '#contact' },
  { label: 'Join Academy', href: '#membership' },
]

export function App() {
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({
    'life-is-a-gym-shirt': 'M',
    'austellar-ethos-shirt': 'M',
  })
  const [cart, setCart] = useState<CartItem[]>([])

  const addToCart = (product: MerchProduct) => {
    const size = selectedSizes[product.id]
    setCart((currentCart) => {
      const matchingItem = currentCart.find((item) => item.id === product.id && item.size === size)

      if (matchingItem) {
        return currentCart.map((item) =>
          item.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        )
      }

      return [...currentCart, { ...product, size, quantity: 1 }]
    })
  }

  const changeQuantity = (productId: string, size: string, change: number) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === productId && item.size === size
            ? { ...item, quantity: item.quantity + change }
            : item,
        )
        .filter((item) => item.quantity > 0),
    )
  }

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)

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

        <section id="merch" className="section merch-section">
          <div className="glass-box wide-box merch-heading">
            <p className="eyebrow">Wear the Ethos</p>
            <h2>AU-STELLAR LIFE Merch</h2>
            <p>Two statement tees designed around strength, purpose, and the pursuit of human excellence.</p>
          </div>

          <div className="merch-layout">
            <div className="product-grid">
              {merchProducts.map((product) => (
                <article className="product-card" key={product.id}>
                  <img src={product.image} alt={`${product.name} shown from the front and back`} />
                  <div className="product-details">
                    <div className="product-title-row">
                      <h3>{product.name}</h3>
                      <strong>${product.price.toFixed(2)}</strong>
                    </div>
                    <p>{product.description}</p>
                    <label htmlFor={`${product.id}-size`}>Choose a size</label>
                    <select
                      id={`${product.id}-size`}
                      value={selectedSizes[product.id]}
                      onChange={(event) => setSelectedSizes((sizes) => ({ ...sizes, [product.id]: event.target.value }))}
                    >
                      {shirtSizes.map((size) => <option value={size} key={size}>{size}</option>)}
                    </select>
                    <button className="primary-button add-cart-button" type="button" onClick={() => addToCart(product)}>
                      Add to Cart
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <aside className="cart-panel" aria-live="polite">
              <p className="eyebrow">Your Order</p>
              <h3>Shopping Cart</h3>
              {cart.length === 0 ? (
                <p className="empty-cart">Your cart is empty. Select a shirt and size to begin.</p>
              ) : (
                <div className="cart-items">
                  {cart.map((item) => (
                    <div className="cart-item" key={`${item.id}-${item.size}`}>
                      <div>
                        <strong>{item.name}</strong>
                        <span>Size {item.size} · ${item.price.toFixed(2)}</span>
                      </div>
                      <div className="quantity-controls" aria-label={`Quantity for ${item.name}, size ${item.size}`}>
                        <button type="button" onClick={() => changeQuantity(item.id, item.size, -1)} aria-label="Decrease quantity">−</button>
                        <span>{item.quantity}</span>
                        <button type="button" onClick={() => changeQuantity(item.id, item.size, 1)} aria-label="Increase quantity">+</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="cart-total">
                <span>Subtotal</span>
                <strong>${cartTotal.toFixed(2)}</strong>
              </div>
              <p className="shipping-note">Shipping and applicable taxes will be calculated at secure checkout.</p>
              <button className="primary-button checkout-button" type="button" disabled>
                Secure Checkout Coming Soon
              </button>
            </aside>
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

        <section id="youtube" className="section youtube-section">
          <div className="glass-box youtube-container">
            <div className="youtube-text">
              <p className="eyebrow">Watch &amp; Learn</p>
              <h2>The Rebuilding Us Project</h2>
              <p>
                Explore relationship dynamics, communication patterns, emotional awareness, and the work
                behind rebuilding stronger connections.
              </p>
              <a
                className="youtube-button"
                href="https://www.youtube.com/@Rebuilding.US.Project"
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit the YouTube Channel
              </a>
            </div>
            <div className="youtube-video">
              <iframe
                src="https://www.youtube.com/embed/dGXy3vbmy5Y?si=OIVFS6cfGxwcgTJl"
                title="Rebuilding Us Project — why we are here and why this work matters"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
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
            <div className="membership-path">
              <p className="eyebrow">Choose Your Level</p>
              <h2>One Academy. Three Cumulative Tiers.</h2>
              <p>Every higher tier includes the training and member access from all tiers below it.</p>
              <div className="tier-grid">
                {trainingTiers.map((tier) => (
                  <article id={tier.id} className="tier-card" key={tier.name}>
                    <span>{tier.level}</span>
                    <h3>{tier.name}</h3>
                    <p>{tier.description}</p>
                    <ul className="tier-access">
                      {tier.access.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                    <button className="primary-button tier-button" type="button" disabled>
                      Pricing Coming Soon
                    </button>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
