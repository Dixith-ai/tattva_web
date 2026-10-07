import { useEffect, useRef, useState } from 'react'
import '../styles/how-tattva-sees.css'

type PerceptionKey = 'rgb' | 'depth' | 'lidar' | 'thermal' | 'environment'

type PerceptionState = {
  key: PerceptionKey
  indexLabel: string
  title: string
  detail: string
  stageAnnotation: string
  technicalAnnotation: string
  assetLabel: string
}

const perceptionStates: PerceptionState[] = [
  {
    key: 'rgb',
    indexLabel: '01  RGB',
    title: 'RGB',
    detail: 'VISUAL INFORMATION',
    stageAnnotation: 'COLOR / FORM / CONTEXT',
    technicalAnnotation: 'VISUAL INPUT',
    assetLabel: '[ RGB SENSOR VIEW — ASSET PENDING ]',
  },
  {
    key: 'depth',
    indexLabel: '02  DEPTH',
    title: 'DEPTH',
    detail: 'DISTANCE / STRUCTURE',
    stageAnnotation: 'DEPTH MAP',
    technicalAnnotation: 'SPATIAL DISTANCE',
    assetLabel: '[ DEPTH SENSOR VIEW — ASSET PENDING ]',
  },
  {
    key: 'lidar',
    indexLabel: '03  LiDAR',
    title: 'LiDAR',
    detail: 'GEOMETRY / SPACE',
    stageAnnotation: '3D SPATIAL STRUCTURE',
    technicalAnnotation: 'GEOMETRIC STRUCTURE',
    assetLabel: '[ LiDAR SENSOR VIEW — ASSET PENDING ]',
  },
  {
    key: 'thermal',
    indexLabel: '04  THERMAL',
    title: 'THERMAL',
    detail: 'HEAT / PRESENCE',
    stageAnnotation: 'THERMAL SIGNATURE',
    technicalAnnotation: 'THERMAL RESPONSE',
    assetLabel: '[ THERMAL SENSOR VIEW — ASSET PENDING ]',
  },
  {
    key: 'environment',
    indexLabel: '05  ENVIRONMENT',
    title: 'ENVIRONMENT',
    detail: 'MULTI-SENSOR VIEW',
    stageAnnotation: 'FROM SIGNALS TO CONTEXT',
    technicalAnnotation: 'ENVIRONMENTAL CONTEXT',
    assetLabel: '[ ENVIRONMENT VIEW — ASSET PENDING ]',
  },
]

function getPerceptionState(progress: number): PerceptionState {
  if (progress < 0.2) return perceptionStates[0]
  if (progress < 0.4) return perceptionStates[1]
  if (progress < 0.6) return perceptionStates[2]
  if (progress < 0.8) return perceptionStates[3]
  return perceptionStates[4]
}

export function HowTattvaSees() {
  const sectionRef = useRef<HTMLElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const progressFillRef = useRef<HTMLSpanElement>(null)
  const [activeState, setActiveState] = useState<PerceptionState>(perceptionStates[0])

  useEffect(() => {
    let frameId = 0

    const updateProgress = () => {
      frameId = 0

      const section = sectionRef.current
      const viewport = viewportRef.current
      const progressFill = progressFillRef.current
      if (!section || !viewport || !progressFill) return

      const rect = section.getBoundingClientRect()
      const scrollDistance = Math.max(section.offsetHeight - window.innerHeight, 1)
      const progress = Math.min(Math.max(-rect.top / scrollDistance, 0), 1)

      viewport.style.setProperty('--perception-progress', progress.toFixed(4))
      progressFill.style.transform = `scaleY(${progress})`

      const nextState = getPerceptionState(progress)
      setActiveState((currentState) => (
        currentState.key === nextState.key ? currentState : nextState
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
    <section className="how-tattva-sees" id="how-tattva-sees" ref={sectionRef} aria-labelledby="how-tattva-sees-title">
      <div className="perception-viewport" ref={viewportRef} data-active-view={activeState.key}>
        <p className="perception-kicker">
          <span aria-hidden="true" />
          04 / HOW TATTVA SEES
        </p>

        <div className="perception-copy">
          <h2 id="how-tattva-sees-title">THE SAME WORLD.<br />DIFFERENT SIGNALS.</h2>
          <p>Each sensing modality reveals a different part of the environment. Together, they provide the information needed to perceive space, objects and conditions around the platform.</p>
        </div>

        <div className="perception-stage" data-asset="tattva-perception-stage" aria-label="TATTVA perception assets pending">
          <div className="perception-layer perception-layer--rgb" data-asset="tattva-rgb-view">
            <span>[ RGB SENSOR VIEW — ASSET PENDING ]</span>
          </div>
          <div className="perception-layer perception-layer--depth" data-asset="tattva-depth-view">
            <span>[ DEPTH SENSOR VIEW — ASSET PENDING ]</span>
          </div>
          <div className="perception-layer perception-layer--lidar" data-asset="tattva-lidar-view">
            <span>[ LiDAR SENSOR VIEW — ASSET PENDING ]</span>
          </div>
          <div className="perception-layer perception-layer--thermal" data-asset="tattva-thermal-view">
            <span>[ THERMAL SENSOR VIEW — ASSET PENDING ]</span>
          </div>
          <div className="perception-layer perception-layer--environment" data-asset="tattva-environment-view">
            <span>[ ENVIRONMENT VIEW — ASSET PENDING ]</span>
          </div>

          <div className="perception-stage-state" aria-live="polite">
            <strong>{activeState.title}</strong>
            <span>{activeState.detail}</span>
            <i>{activeState.stageAnnotation}</i>
          </div>
        </div>

        <p className="perception-stage-annotation">{activeState.technicalAnnotation}</p>

        <div className="perception-current-view" aria-live="polite">
          <span>CURRENT VIEW</span>
          <strong>{activeState.title}</strong>
        </div>

        <nav className="perception-index" aria-label="Sensor index">
          {perceptionStates.map((state) => (
            <span className={state.key === activeState.key ? 'is-active' : ''} key={state.key}>
              {state.indexLabel}
            </span>
          ))}
        </nav>

        <div className="perception-progress" aria-hidden="true">
          <i><b ref={progressFillRef} /></i>
        </div>

        <p className="perception-bottom-label">PERCEPTION / SENSOR LAYERS</p>
        <p className="perception-section-number">04 / 10</p>
      </div>
    </section>
  )
}
