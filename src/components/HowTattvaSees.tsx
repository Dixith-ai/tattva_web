import { useEffect, useRef, useState } from 'react'
import '../styles/how-tattva-sees.css'

type PerceptionKey = 'rgb' | 'depth' | 'lidar' | 'map'

type PerceptionState = {
  key: PerceptionKey
  indexLabel: string
  title: string
  detail: string
  stageAnnotation: string
  technicalAnnotation: string
  assetPath: string
  alt: string
}

type MotionWindow = {
  enterStart: number
  enterEnd: number
  exitStart: number
  exitEnd: number
  x: number
  y: number
  scale: number
  blur: number
}

const perceptionStates: PerceptionState[] = [
  {
    key: 'rgb',
    indexLabel: '01  RGB',
    title: 'RGB',
    detail: 'VISUAL INFORMATION',
    stageAnnotation: 'COLOR / FORM / CONTEXT',
    technicalAnnotation: 'VISUAL INPUT',
    assetPath: '/images/perception/rgb-camera.jpeg',
    alt: 'RGB camera view from the TATTVA simulation environment',
  },
  {
    key: 'depth',
    indexLabel: '02  DEPTH',
    title: 'DEPTH',
    detail: 'DISTANCE / STRUCTURE',
    stageAnnotation: 'DEPTH MAP',
    technicalAnnotation: 'SPATIAL DISTANCE',
    assetPath: '/images/perception/depth-camera.jpeg',
    alt: 'Depth-camera visualization from the TATTVA simulation environment',
  },
  {
    key: 'lidar',
    indexLabel: '03  LIDAR',
    title: 'LIDAR',
    detail: 'GEOMETRY / SPACE',
    stageAnnotation: '3D SPATIAL STRUCTURE',
    technicalAnnotation: 'GEOMETRIC STRUCTURE',
    assetPath: '/images/perception/lidar.jpeg',
    alt: 'LiDAR point-cloud visualization from the TATTVA simulation environment',
  },
  {
    key: 'map',
    indexLabel: '04  3D MAP',
    title: '3D MAP',
    detail: 'ENVIRONMENT MAP',
    stageAnnotation: 'RECONSTRUCTED ENVIRONMENT',
    technicalAnnotation: 'SPATIAL RECONSTRUCTION',
    assetPath: '/images/perception/3d-map.jpeg',
    alt: 'Three-dimensional environment map from the TATTVA simulation environment',
  },
]

const motionWindows: Record<PerceptionKey, MotionWindow> = {
  rgb: { enterStart: 0, enterEnd: 0, exitStart: 0.18, exitEnd: 0.32, x: -22, y: 10, scale: 0.94, blur: 2.4 },
  depth: { enterStart: 0.18, enterEnd: 0.32, exitStart: 0.43, exitEnd: 0.57, x: 28, y: -12, scale: 0.92, blur: 2.2 },
  lidar: { enterStart: 0.43, enterEnd: 0.57, exitStart: 0.68, exitEnd: 0.82, x: -30, y: 16, scale: 0.9, blur: 2.6 },
  map: { enterStart: 0.68, enterEnd: 0.82, exitStart: 1, exitEnd: 1, x: 26, y: -10, scale: 0.91, blur: 2.2 },
}

function clamp(value: number) {
  return Math.min(Math.max(value, 0), 1)
}

function getStateVisibility(progress: number, window: MotionWindow) {
  const entering = window.enterEnd === window.enterStart
    ? 1
    : clamp((progress - window.enterStart) / (window.enterEnd - window.enterStart))
  const exiting = window.exitEnd === window.exitStart
    ? 1
    : 1 - clamp((progress - window.exitStart) / (window.exitEnd - window.exitStart))

  return Math.min(entering, exiting)
}

function getPerceptionState(progress: number): PerceptionState {
  if (progress < 0.25) return perceptionStates[0]
  if (progress < 0.5) return perceptionStates[1]
  if (progress < 0.75) return perceptionStates[2]
  return perceptionStates[3]
}

export function HowTattvaSees() {
  const sectionRef = useRef<HTMLElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const progressFillRef = useRef<HTMLSpanElement>(null)
  const [activeState, setActiveState] = useState<PerceptionState>(perceptionStates[0])

  useEffect(() => {
    let frameId = 0

    const updateProgress = () => {
      frameId = 0

      const section = sectionRef.current
      const viewport = viewportRef.current
      const stage = stageRef.current
      const progressFill = progressFillRef.current
      if (!section || !viewport || !stage || !progressFill) return

      const rect = section.getBoundingClientRect()
      const scrollDistance = Math.max(section.offsetHeight - window.innerHeight, 1)
      const progress = Math.min(Math.max(-rect.top / scrollDistance, 0), 1)

      viewport.style.setProperty('--perception-progress', progress.toFixed(4))
      progressFill.style.transform = `scaleY(${progress})`

      perceptionStates.forEach((state) => {
        const layer = stage.querySelector<HTMLElement>(`[data-perception-view="${state.key}"]`)
        if (!layer) return

        const motion = motionWindows[state.key]
        const visibility = getStateVisibility(progress, motion)
        const movement = 1 - visibility

        layer.style.setProperty('--view-opacity', visibility.toFixed(3))
        layer.style.setProperty('--view-x', `${(motion.x * movement).toFixed(2)}px`)
        layer.style.setProperty('--view-y', `${(motion.y * movement).toFixed(2)}px`)
        layer.style.setProperty('--view-scale', (1 - ((1 - motion.scale) * movement)).toFixed(3))
        layer.style.setProperty('--view-blur', `${(motion.blur * movement).toFixed(2)}px`)
        layer.style.setProperty('--view-clip', `${((1 - visibility) * 100).toFixed(2)}%`)
      })

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

        <div className="perception-stage" data-asset="tattva-perception-stage" ref={stageRef} aria-label="TATTVA perception views">
          {perceptionStates.map((state) => (
            <figure
              className={`perception-layer perception-layer--${state.key}`}
              data-perception-view={state.key}
              data-asset={`tattva-${state.key}-view`}
              key={state.key}
            >
              <img src={state.assetPath} alt={state.alt} />
            </figure>
          ))}

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
        <p className="perception-section-number">04 / 04</p>
      </div>
    </section>
  )
}
