import { useState } from 'react'
import '../styles/application.css'

type ApplicationStage = 'survey' | 'detect' | 'validate' | 'prioritize'

const stages: Array<{ id: ApplicationStage; nav: string; title: string; description: string }> = [
  { id: 'survey', nav: '01 / SURVEY', title: 'SURVEY', description: 'Rapidly assess the affected area from the air before responders enter it.' },
  { id: 'detect', nav: '02 / DETECT', title: 'DETECT', description: 'Identify potential survivors, hazards and areas requiring closer inspection.' },
  { id: 'validate', nav: '03 / VALIDATE', title: 'VALIDATE', description: 'Use closer-range sensing to verify important findings and assess local conditions.' },
  { id: 'prioritize', nav: '04 / PRIORITIZE', title: 'PRIORITIZE', description: 'Turn verified findings into actionable rescue priorities and inspection routes.' },
]

export function Application() {
  const [activeStage, setActiveStage] = useState<ApplicationStage>('survey')
  const activeContent = stages.find((stage) => stage.id === activeStage) ?? stages[0]

  return (
    <section className="application" id="application" aria-labelledby="application-title">
      <p className="application-kicker"><span aria-hidden="true" />06 / APPLICATION</p>

      <div className="application-copy">
        <h2 id="application-title">BUILT FOR THE<br />PLACES PEOPLE<br />SHOULDN&apos;T ENTER<br />FIRST.</h2>
        <p>TATTVA surveys hazardous environments, identifies potential survivors and hazards, and helps responders decide where closer inspection is needed.</p>
      </div>

      <div className="application-scenario" data-application-scenario data-asset="tattva-application-scenario" data-stage={activeStage}>
        <svg viewBox="0 0 860 500" role="img" aria-label="Interactive TATTVA application scenario">
          <path className="scenario-boundary" d="M72 117 L210 73 L395 104 L510 58 L768 118 L724 385 L555 429 L364 387 L198 438 L91 344 Z" />
          <path className="scenario-structure" d="M158 178 L293 136 L389 173 L356 274 L203 293 Z M468 143 L610 112 L684 191 L650 280 L499 265 Z M295 322 L434 290 L542 346 L489 402 L338 388 Z" />
          <path className="scenario-survey-field" d="M124 129 L408 92 L676 154 L697 341 L498 397 L244 369 L111 291 Z" />
          <path className="scenario-scan-line" d="M158 201 C302 164 451 169 658 216" />
          <path className="scenario-route" d="M133 366 C252 331 341 329 432 300 S580 237 700 173" />

          <g className="scenario-marker scenario-marker--candidate scenario-marker--candidate-one"><circle cx="333" cy="204" r="8" /><circle cx="333" cy="204" r="15" className="marker-ring" /></g>
          <g className="scenario-marker scenario-marker--candidate scenario-marker--candidate-two"><circle cx="541" cy="231" r="8" /><circle cx="541" cy="231" r="15" className="marker-ring" /></g>
          <g className="scenario-marker scenario-marker--hazard scenario-marker--hazard-one"><path d="M620 320 L631 339 L609 339 Z" /></g>
          <g className="scenario-marker scenario-marker--hazard scenario-marker--hazard-two"><path d="M247 337 L258 356 L236 356 Z" /></g>
          <g className="scenario-marker scenario-marker--target"><rect x="522" y="212" width="38" height="38" /><path d="M541 205 V257 M515 231 H567" /><rect x="507" y="197" width="68" height="68" className="target-boundary" /></g>
          <g className="scenario-marker scenario-marker--priority"><path d="M690 157 L704 171 L690 185 L676 171 Z" /><path d="M690 145 V197 M664 171 H716" /></g>

          <text className="scenario-asset-label" x="430" y="257" textAnchor="middle">[ TATTVA APPLICATION SCENARIO — ASSET PENDING ]</text>
          <text className="scenario-annotation scenario-annotation--survey" x="117" y="109">AERIAL SURVEY</text>
          <text className="scenario-annotation scenario-annotation--candidate" x="279" y="188">SURVIVOR CANDIDATE</text>
          <text className="scenario-annotation scenario-annotation--hazard" x="604" y="362">HAZARD</text>
          <text className="scenario-annotation scenario-annotation--target" x="492" y="284">INSPECTION TARGET</text>
          <text className="scenario-annotation scenario-annotation--priority" x="654" y="138">PRIORITY</text>
        </svg>

        <div className="application-stage-controls" aria-label="Application stages">
          {stages.map((stage) => (
            <button type="button" aria-label={stage.nav} aria-pressed={activeStage === stage.id} className={activeStage === stage.id ? 'is-active' : ''} onClick={() => setActiveStage(stage.id)} key={stage.id}>{stage.nav}</button>
          ))}
        </div>

        <div className="application-information" aria-live="polite"><strong>{activeContent.title}</strong><p>{activeContent.description}</p></div>
      </div>

      <p className="application-bottom-label">APPLICATION / RESCUE INTELLIGENCE</p>
      <p className="application-section-number">06 / 07</p>
    </section>
  )
}
