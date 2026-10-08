import { lazy, Suspense } from 'react'
import '../styles/opening.css'

const TattvaHeroModel = lazy(() => import('./TattvaHeroModel').then(({ TattvaHeroModel: HeroModel }) => ({ default: HeroModel })))

export function Opening() {
  return (
    <section className="opening" id="opening" aria-labelledby="opening-title">
      <Suspense fallback={<div className="opening-model-stage" aria-hidden="true"><span className="opening-model-loading" /></div>}>
        <TattvaHeroModel />
      </Suspense>

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
