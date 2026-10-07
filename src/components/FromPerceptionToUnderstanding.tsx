import { useEffect, useRef, useState } from 'react'
import '../styles/from-perception-to-understanding.css'

type ConceptStage = {
  phrase: string
  pipelineIndex: number
}

function getConceptStage(progress: number): ConceptStage {
  if (progress < 0.22) return { phrase: 'WHAT THE SENSORS SEE', pipelineIndex: 0 }
  if (progress < 0.42) return { phrase: 'WHERE THINGS ARE', pipelineIndex: 1 }
  if (progress < 0.62) return { phrase: 'WHAT EXISTS', pipelineIndex: 2 }
  if (progress < 0.82) return { phrase: 'HOW THINGS ARE RELATED', pipelineIndex: 3 }
  return { phrase: 'WHAT THE ENVIRONMENT MEANS', pipelineIndex: 4 }
}

export function FromPerceptionToUnderstanding() {
  const sectionRef = useRef<HTMLElement>(null)
  const compositionRef = useRef<HTMLDivElement>(null)
  const [conceptStage, setConceptStage] = useState<ConceptStage>(getConceptStage(0))

  useEffect(() => {
    let frameId = 0

    const updateProgress = () => {
      frameId = 0

      const section = sectionRef.current
      const composition = compositionRef.current
      if (!section || !composition) return

      const rect = section.getBoundingClientRect()
      const scrollDistance = Math.max(section.offsetHeight - window.innerHeight, 1)
      const progress = Math.min(Math.max(-rect.top / scrollDistance, 0), 1)

      const geometryOpacity = Math.min(Math.max((progress - 0.15) / 0.25, 0), 1)
      const objectsOpacity = Math.min(Math.max((progress - 0.32) / 0.28, 0), 1)
      const relationshipsOpacity = Math.min(Math.max((progress - 0.52) / 0.26, 0), 1)
      const environmentOpacity = Math.min(Math.max((progress - 0.7) / 0.3, 0), 1)

      composition.style.setProperty('--signals-opacity', (1 - progress * 0.65).toFixed(3))
      composition.style.setProperty('--geometry-opacity', geometryOpacity.toFixed(3))
      composition.style.setProperty('--objects-opacity', objectsOpacity.toFixed(3))
      composition.style.setProperty('--relationships-opacity', relationshipsOpacity.toFixed(3))
      composition.style.setProperty('--environment-opacity', environmentOpacity.toFixed(3))
      composition.style.setProperty('--context-opacity', Math.min(Math.max((progress - 0.46) / 0.18, 0), 1).toFixed(3))
      composition.style.setProperty('--conclusion-opacity', Math.min(Math.max((progress - 0.7) / 0.3, 0), 1).toFixed(3))

      const nextStage = getConceptStage(progress)
      setConceptStage((currentStage) => (
        currentStage.pipelineIndex === nextStage.pipelineIndex ? currentStage : nextStage
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

  const pipeline = ['SIGNALS', 'GEOMETRY', 'OBJECTS', 'RELATIONSHIPS', 'ENVIRONMENT']

  return (
    <section className="perception-understanding" id="perception-understanding" ref={sectionRef} aria-labelledby="perception-understanding-title">
      <p className="understanding-kicker">
        <span aria-hidden="true" />
        05 / FROM PERCEPTION TO UNDERSTANDING
      </p>

      <div className="understanding-copy">
        <h2 id="perception-understanding-title">FROM SIGNALS<br />TO UNDERSTANDING.</h2>
        <p>A map describes where things are. Environmental intelligence adds what they are, where they are, and how they relate to the surrounding space.</p>
      </div>

      <div className="understanding-composition" ref={compositionRef} data-asset="tattva-environmental-intelligence" aria-label="TATTVA environmental intelligence asset pending">
        <div className="understanding-layer understanding-layer--signals" data-layer="signals">
          <span>[ RAW SIGNALS — ASSET PENDING ]</span>
          <i className="signal-mark signal-mark--one" />
          <i className="signal-mark signal-mark--two" />
          <i className="signal-mark signal-mark--three" />
          <i className="signal-mark signal-mark--four" />
          <i className="signal-mark signal-mark--five" />
        </div>
        <div className="understanding-layer understanding-layer--geometry" data-layer="geometry">
          <span>[ GEOMETRY — ASSET PENDING ]</span>
          <i className="geometry-mark geometry-mark--one" />
          <i className="geometry-mark geometry-mark--two" />
          <i className="geometry-mark geometry-mark--three" />
        </div>
        <div className="understanding-layer understanding-layer--objects" data-layer="objects">
          <span>[ OBJECTS — ASSET PENDING ]</span>
          <i className="object-mark object-mark--one" />
          <i className="object-mark object-mark--two" />
          <i className="object-mark object-mark--three" />
        </div>
        <div className="understanding-layer understanding-layer--relationships" data-layer="relationships">
          <span>[ SPATIAL RELATIONSHIPS — ASSET PENDING ]</span>
          <i className="relationship-mark relationship-mark--one" />
          <i className="relationship-mark relationship-mark--two" />
          <i className="relationship-mark relationship-mark--three" />
        </div>
        <div className="understanding-layer understanding-layer--environment" data-layer="environment">
          <span>[ ENVIRONMENTAL REPRESENTATION — ASSET PENDING ]</span>
          <i className="environment-mark environment-mark--one" />
          <i className="environment-mark environment-mark--two" />
        </div>

        <p className="understanding-micro-copy">{conceptStage.phrase}</p>
        <p className="understanding-key-statement">GEOMETRY BECOMES CONTEXT.</p>
        <p className="understanding-final-statement">NOT JUST A MAP.<br />A STRUCTURED ENVIRONMENT.</p>
      </div>

      <div className="understanding-pipeline" aria-label="Conceptual pipeline">
        {pipeline.map((stage, index) => (
          <span className={index === conceptStage.pipelineIndex ? 'is-current' : ''} key={stage}>
            {stage}
            {index < pipeline.length - 1 && <i>→</i>}
          </span>
        ))}
      </div>

      <p className="understanding-bottom-label">PERCEPTION / ENVIRONMENTAL INTELLIGENCE</p>
      <p className="understanding-section-number">05 / 07</p>
    </section>
  )
}
