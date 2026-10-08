import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import type { InsideMachineVisualState } from './InsideMachineCad'
import '../styles/inside-machine.css'

const InsideMachineCad = lazy(() => import('./InsideMachineCad').then(({ InsideMachineCad: Cad }) => ({ default: Cad })))

type SystemKey = InsideMachineVisualState

type SystemState = {
  key: SystemKey
  indexLabel: string
  callout: string
  subsystemLabel: string
  subsystemDetails: string[]
  image?: string
}

const systems: SystemState[] = [
  {
    key: 'outer', indexLabel: '01  OUTER PLATFORM', callout: 'STRUCTURE',
    subsystemLabel: '01 / OUTER PLATFORM', subsystemDetails: ['STRUCTURE / MOBILITY'],
  },
  {
    key: 'compute', indexLabel: '02  COMPUTE', callout: 'COMPUTE',
    subsystemLabel: '02 / COMPUTE', subsystemDetails: ['ONBOARD COMPUTE', 'EDGE AI', 'SENSOR FUSION', 'REAL-TIME INFERENCE'], image: '/images/machine/computational.png',
  },
  {
    key: 'control', indexLabel: '03  FLIGHT CONTROL', callout: 'CONTROL',
    subsystemLabel: '03 / FLIGHT CONTROL', subsystemDetails: ['HOLYBRO PIXHAWK 6C', 'LOW-LEVEL FLIGHT CONTROL', 'MOTOR / ESC EXECUTION'], image: '/images/machine/pixhawk-flight-controller.png',
  },
  {
    key: 'sensing', indexLabel: '04  SENSING', callout: 'PERCEPTION',
    subsystemLabel: '04 / SENSING', subsystemDetails: ['MULTI-SENSOR INPUT', 'eMEET C950', 'RGB VISUAL INPUT', 'RPLIDAR A1M8', '2D SPATIAL SENSING'], image: '/images/machine/camera-lidar.png',
  },
  {
    key: 'transformation', indexLabel: '05  TRANSFORMATION', callout: 'ACTUATION',
    subsystemLabel: '05 / TRANSFORMATION', subsystemDetails: ['MECHANICAL TRANSFORMATION', 'ROTATIONAL ACTUATION', 'CONFIGURATION CHANGE'],
  },
  {
    key: 'propulsion', indexLabel: '06  PROPULSION', callout: 'PROPULSION',
    subsystemLabel: '06 / PROPULSION', subsystemDetails: ['PROPULSION SYSTEM', 'BLDC MOTOR', 'ELECTRONIC SPEED CONTROL'], image: '/images/machine/bldc-esc.png',
  },
]

const visualWindows: Record<SystemKey, [number, number, number, number]> = {
  outer: [0, 0, 0.18, 0.3],
  compute: [0.12, 0.24, 0.36, 0.48],
  control: [0.3, 0.42, 0.54, 0.66],
  sensing: [0.48, 0.6, 0.72, 0.84],
  transformation: [0.66, 0.76, 0.86, 0.96],
  propulsion: [0.82, 0.92, 1, 1],
}

const visualMotion: Record<SystemKey, { x: number; y: number; rotation: number; scale: number }> = {
  outer: { x: -42, y: 18, rotation: -8, scale: 0.86 },
  compute: { x: 56, y: -28, rotation: 5, scale: 0.82 },
  control: { x: -48, y: 32, rotation: -6, scale: 0.84 },
  sensing: { x: 52, y: 18, rotation: 5, scale: 0.82 },
  transformation: { x: -38, y: -26, rotation: -4, scale: 0.88 },
  propulsion: { x: 46, y: 18, rotation: 6, scale: 0.84 },
}

function clamp(value: number) {
  return Math.min(Math.max(value, 0), 1)
}

function getVisualOpacity(progress: number, key: SystemKey) {
  const [enterStart, enterEnd, exitStart, exitEnd] = visualWindows[key]
  if (progress < enterStart || progress > exitEnd) return 0
  if (progress < enterEnd) return clamp((progress - enterStart) / Math.max(enterEnd - enterStart, 0.001))
  if (progress > exitStart) return 1 - clamp((progress - exitStart) / Math.max(exitEnd - exitStart, 0.001))
  return 1
}

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
  const stageRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef(0)
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
      progressRef.current = progress

      viewport.style.setProperty('--inside-machine-progress', progress.toFixed(4))
      stageRef.current?.style.setProperty('--inside-machine-progress', progress.toFixed(4))

      systems.forEach((system) => {
        const element = stageRef.current?.querySelector<HTMLElement>(`[data-visual-system="${system.key}"]`)
        if (!element) return

        const opacity = getVisualOpacity(progress, system.key)
        const [enterStart, enterEnd, exitStart, exitEnd] = visualWindows[system.key]
        const entering = progress < enterEnd
          ? 1 - clamp((progress - enterStart) / Math.max(enterEnd - enterStart, 0.001))
          : 0
        const exiting = progress > exitStart
          ? clamp((progress - exitStart) / Math.max(exitEnd - exitStart, 0.001))
          : 0
        const motion = visualMotion[system.key]
        const travel = entering - exiting

        element.style.setProperty('--visual-opacity', opacity.toFixed(4))
        element.style.setProperty('--visual-x', `${(travel * motion.x).toFixed(2)}px`)
        element.style.setProperty('--visual-y', `${(travel * motion.y).toFixed(2)}px`)
        element.style.setProperty('--visual-rotate', `${(travel * motion.rotation).toFixed(2)}deg`)
        element.style.setProperty('--visual-scale', (1 - ((1 - opacity) * (1 - motion.scale))).toFixed(4))
      })
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

        <div className="inside-machine-stage" data-asset="tattva-exploded-view" aria-label="TATTVA internal systems" ref={stageRef}>
          <Suspense fallback={null}>
            <InsideMachineCad progressRef={progressRef} />
          </Suspense>

          {systems.filter((system) => system.image).map((system) => (
            <img
              className={`inside-machine-image inside-machine-image--${system.key}`}
              data-asset={`tattva-${system.key}`}
              data-visual-system={system.key}
              src={system.image}
              alt=""
              key={system.key}
            />
          ))}

          {systems.map((system) => (
            <p className={`inside-callout inside-callout--${system.key}`} data-visual-system={system.key} key={system.key}>
              {system.callout}
            </p>
          ))}

          <div className="inside-active-system" aria-live="polite">
            <span>{activeSystem.subsystemLabel}</span>
            <strong>{activeSystem.subsystemDetails[0]}</strong>
            <div>
              {activeSystem.subsystemDetails.slice(1).map((detail) => <span key={detail}>{detail}</span>)}
            </div>
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
