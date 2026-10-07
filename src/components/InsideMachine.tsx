import { useEffect, useRef, useState } from 'react'
import '../styles/inside-machine.css'

type SystemKey = 'outer' | 'compute' | 'control' | 'sensing' | 'transformation' | 'propulsion'

type SystemState = {
  key: SystemKey
  indexLabel: string
  title: string
  detail: string
  callout: string
}

const systems: SystemState[] = [
  { key: 'outer', indexLabel: '01  OUTER PLATFORM', title: 'OUTER PLATFORM', detail: 'STRUCTURE / MOBILITY', callout: 'STRUCTURE' },
  { key: 'compute', indexLabel: '02  COMPUTE', title: 'COMPUTE', detail: 'ONBOARD INTELLIGENCE', callout: 'COMPUTE' },
  { key: 'control', indexLabel: '03  FLIGHT CONTROL', title: 'FLIGHT CONTROL', detail: 'LOW-LEVEL MOTION CONTROL', callout: 'CONTROL' },
  { key: 'sensing', indexLabel: '04  SENSING', title: 'SENSING', detail: 'PERCEPTION / SPATIAL INPUT', callout: 'PERCEPTION' },
  { key: 'transformation', indexLabel: '05  TRANSFORMATION', title: 'TRANSFORMATION', detail: 'AIR ↔ GROUND RECONFIGURATION', callout: 'ACTUATION' },
  { key: 'propulsion', indexLabel: '06  PROPULSION', title: 'PROPULSION', detail: 'FLIGHT / GROUND MOBILITY', callout: 'PROPULSION' },
]

function getActiveSystem(progress: number): SystemState {
  if (progress < 0.18) return systems[0]
  if (progress < 0.36) return systems[1]
  if (progress < 0.54) return systems[2]
  if (progress < 0.72) return systems[3]
  if (progress < 0.86) return systems[4]
  return systems[5]
}

export function InsideMachine() {
  const sectionRef = useRef<HTMLElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const [activeSystem, setActiveSystem] = useState<SystemState>(systems[0])

  useEffect(() => {
    let frameId = 0

    const updateProgress = () => {
      frameId = 0

      const section = sectionRef.current
      const viewport = viewportRef.current
      if (!section || !viewport) return

      const rect = section.getBoundingClientRect()
      const scrollDistance = Math.max(section.offsetHeight - window.innerHeight, 1)
      const progress = Math.min(Math.max(-rect.top / scrollDistance, 0), 1)

      viewport.style.setProperty('--inside-machine-progress', progress.toFixed(4))
      const nextSystem = getActiveSystem(progress)
      setActiveSystem((currentSystem) => (
        currentSystem.key === nextSystem.key ? currentSystem : nextSystem
      ))
    }

    const requestUpdate = () => {
      if (frameId === 0) frameId = window.requestAnimationFrame(updateProgress)
    }

    updateProgress()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)

    return () => {
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
      if (frameId) window.cancelAnimationFrame(frameId)
    }
  }, [])

  return (
    <section className="inside-machine" id="inside-machine" ref={sectionRef} aria-labelledby="inside-machine-title">
      <div className="inside-machine-viewport" ref={viewportRef} data-active-system={activeSystem.key}>
        <p className="inside-machine-kicker">
          <span aria-hidden="true" />
          03 / INSIDE THE MACHINE
        </p>

        <div className="inside-machine-copy">
          <h2 id="inside-machine-title">THE MACHINE<br />IS MORE THAN<br />ITS SHELL.</h2>
          <p>Flight control, onboard computation, sensing, actuation and propulsion work together as one system.</p>
        </div>

        <div className="inside-machine-stage" data-asset="tattva-exploded-view" aria-label="TATTVA exploded view asset pending">
          {/* TODO: Replace placeholder with final TATTVA exploded CAD/model asset. */}
          <div className="inside-layer inside-layer--outer" aria-hidden="true" />
          <div className="inside-layer inside-layer--compute" data-asset="tattva-compute" aria-hidden="true" />
          <div className="inside-layer inside-layer--control" data-asset="tattva-flight-controller" aria-hidden="true" />
          <div className="inside-layer inside-layer--sensing" data-asset="tattva-sensing" aria-hidden="true" />
          <div className="inside-layer inside-layer--motion" aria-hidden="true">
            <span data-asset="tattva-transformation" />
            <span data-asset="tattva-propulsion" />
          </div>

          <p className="inside-machine-asset-label">[ TATTVA EXPLODED VIEW — ASSET PENDING ]</p>

          <div className="inside-sensor-labels" aria-hidden="true">
            <span>RGB</span>
            <span>THERMAL</span>
            <span>LiDAR</span>
            <span>IMU</span>
            <span>GPS</span>
          </div>

          {systems.map((system) => (
            <p className={`inside-callout inside-callout--${system.key}`} key={system.key}>
              {system.callout}
            </p>
          ))}

          <div className="inside-active-system" aria-live="polite">
            <strong>{activeSystem.title}</strong>
            <span>{activeSystem.detail}</span>
          </div>
        </div>

        <nav className="inside-machine-index" aria-label="Internal system index">
          {systems.map((system) => (
            <span className={system.key === activeSystem.key ? 'is-active' : ''} key={system.key}>
              {system.indexLabel}
            </span>
          ))}
        </nav>

        <p className="inside-machine-bottom-label">SYSTEM / INTERNAL ARCHITECTURE</p>
        <p className="inside-machine-section-number">03 / 10</p>
      </div>
    </section>
  )
}
