import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import '../styles/transformation.css'

const TattvaTransformationModel = lazy(() => import('./TattvaTransformationModel').then(({ TattvaTransformationModel: TransformationModel }) => ({ default: TransformationModel })))

type TransformationState = 'aerial' | 'mechanism' | 'transforming' | 'ground'

function getTransformationState(progress: number): TransformationState {
  if (progress < 0.28) return 'aerial'
  if (progress < 0.5) return 'mechanism'
  if (progress < 0.75) return 'transforming'
  return 'ground'
}

export function Transformation() {
  const sectionRef = useRef<HTMLElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const progressFillRef = useRef<HTMLSpanElement>(null)
  const progressRef = useRef(0)
  const [state, setState] = useState<TransformationState>('aerial')
  const [shouldLoadModel, setShouldLoadModel] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    if (!section || !('IntersectionObserver' in window)) {
      setShouldLoadModel(true)
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadModel(true)
          observer.disconnect()
        }
      },
      { rootMargin: '600px 0px' },
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

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

      progressRef.current = progress
      viewport.style.setProperty('--transformation-progress', progress.toFixed(4))
      progressFill.style.transform = `scaleY(${progress})`

      const nextState = getTransformationState(progress)
      setState((currentState) => (currentState === nextState ? currentState : nextState))
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

  const currentStateLabel = {
    aerial: 'AERIAL CONFIGURATION',
    mechanism: 'TRANSFORMATION MECHANISM',
    transforming: 'MECHANICAL RECONFIGURATION',
    ground: 'GROUND CONFIGURATION',
  }[state]

  return (
    <section className="transformation" id="transformation" ref={sectionRef} aria-labelledby="transformation-title">
      <div className="transformation-viewport" ref={viewportRef} data-state={state}>
        <p className="transformation-kicker">
          <span aria-hidden="true" />
          02 / TRANSFORMATION
        </p>

        <div className="transformation-copy">
          <h2 id="transformation-title">ONE PLATFORM.<br />TWO MODES.</h2>
          <p>
            TATTVA is designed to transition between aerial mobility and ground operation without treating them as separate platforms.
          </p>
        </div>

        <div className="transformation-stage">
          {/* STATE 1: AERIAL CONFIGURATION */}
          {/* STATE 2: TRANSFORMATION MECHANISM */}
          {/* STATE 3: MECHANICAL RECONFIGURATION */}
          {/* STATE 4: GROUND CONFIGURATION */}
          {shouldLoadModel ? (
            <Suspense fallback={<div className="transformation-model-canvas" aria-hidden="true"><span className="transformation-model-loading" /></div>}>
              <TattvaTransformationModel progressRef={progressRef} />
            </Suspense>
          ) : <div className="transformation-model-canvas" aria-hidden="true"><span className="transformation-model-loading" /></div>}

          <div className="transformation-state-label transformation-state-label--aerial">
            <strong>AERIAL</strong>
            <span>FLIGHT CONFIGURATION</span>
          </div>
          <div className="transformation-state-label transformation-state-label--mechanism">
            <strong>MECHANISM</strong>
            <span>TRANSFORMATION MECHANISM</span>
          </div>
          <div className="transformation-state-label transformation-state-label--transforming">
            <strong>TRANSFORMATION</strong>
            <span>MECHANICAL RECONFIGURATION</span>
          </div>
          <div className="transformation-state-label transformation-state-label--ground">
            <strong>GROUND</strong>
            <span>MOBILE CONFIGURATION</span>
          </div>

          <p className="transformation-annotation">AIR → GROUND</p>
          <p className="transformation-current-state" aria-live="polite">{currentStateLabel}</p>
        </div>

        <p className="transformation-bottom-label">AIR / GROUND</p>

        <div className="transformation-progress" aria-hidden="true">
          <span>02</span>
          <i><b ref={progressFillRef} /></i>
          <span>03</span>
        </div>
      </div>
    </section>
  )
}
