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
          01 / AUTONOMOUS DISASTER RESPONSE
        </p>
        <h1 id="opening-title">TATTVA</h1>
        <p className="opening-subtitle">AUTONOMOUS AIR-GROUND RESCUE PLATFORM</p>
        <p className="opening-description">
          Disasters can leave responders facing damaged infrastructure, inaccessible terrain and limited situational awareness. Finding survivors, identifying hazards and deciding where to act first can become slow, dangerous and uncertain.
        </p>
        <p className="opening-solution">
          TATTVA addresses this by autonomously surveying affected areas, detecting survivors and hazards with on-device AI, and transforming between aerial and ground operation to investigate critical areas and deliver actionable intelligence to rescue teams.
        </p>
        <p className="opening-workflow">DISCOVER&nbsp; / &nbsp;VALIDATE&nbsp; / &nbsp;PRIORITIZE</p>
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
