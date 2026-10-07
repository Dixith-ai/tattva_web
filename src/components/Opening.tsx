import '../styles/opening.css'

export function Opening() {
  return (
    <section className="opening" id="top" aria-labelledby="opening-title">
      <div className="opening-model-placeholder" data-asset="tattva-hero-model" aria-label="TATTVA hero model asset pending">
        {/* TODO: Replace with final TATTVA 3D hero asset. */}
        <span>[ TATTVA HERO MODEL — ASSET PENDING ]</span>
      </div>

      <div className="opening-content">
        <p className="opening-kicker">
          <span aria-hidden="true" />
          01 / TRANSFORMABLE PLATFORM
        </p>
        <h1 id="opening-title">TATTVA</h1>
        <p className="opening-subtitle">Transformable Air–Ground Platform</p>
        <p className="opening-description">
          A transformable robotic platform designed to move between aerial and ground operation while sensing, mapping and understanding its environment.
        </p>
        <p className="opening-micro-label">ENVIRONMENTAL INTELLIGENCE / 01</p>
      </div>

      <div className="opening-scroll-indicator" aria-hidden="true">
        <span>SCROLL TO EXPLORE</span>
        <i />
      </div>

      <p className="opening-corner-label">TATTVA / AERIAL–GROUND</p>
    </section>
  )
}
