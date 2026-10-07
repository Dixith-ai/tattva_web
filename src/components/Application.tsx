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
        <h2 id="application-title">BUILT FOR<br />THE<br />PLACES<br />PEOPLE<br />SHOULDN&apos;T<br />ENTER<br />FIRST.</h2>
        <p>TATTVA surveys hazardous environments, identifies potential survivors and hazards, and helps responders assess where to go next.</p>
      </div>

      <div className="application-mission" data-application-scenario data-stage={activeStage}>
        <div className="mission-view" aria-label="Interactive disaster-response mission scenario">
          <svg viewBox="0 0 920 540" role="img" aria-label="TATTVA disaster-response mission view">
            <path className="mission-perimeter" d="M58 86 H858 V452 H58 Z" />
            <path className="mission-access-road" d="M83 388 C220 378 296 361 412 334 S640 258 836 198" />
            <path className="mission-terrain mission-terrain--one" d="M85 139 C172 112 226 136 291 118 S422 88 501 118" />
            <path className="mission-terrain mission-terrain--two" d="M472 423 C579 395 679 415 832 372" />

            <g className="mission-structure mission-structure--north"><path d="M136 159 H332 V246 H136 Z" /><path d="M164 183 H289 V224 H164 Z" /></g>
            <g className="mission-structure mission-structure--east"><path d="M578 133 H794 V274 H578 Z" /><path d="M614 164 H754 V243 H614 Z" /></g>
            <g className="mission-structure mission-structure--south"><path d="M304 336 H553 V416 H304 Z" /><path d="M345 361 H505 V393 H345 Z" /></g>
            <g className="mission-debris"><path d="M365 284 L404 260 L440 284 L420 313 L379 311 Z" /><path d="M690 334 L722 309 L757 341 L733 371 L698 365 Z" /><path d="M205 319 L233 298 L268 325 L243 351 L214 346 Z" /></g>

            <g className="mission-platform"><path className="platform-arm" d="M120 370 L156 406 M156 370 L120 406" /><rect x="132" y="382" width="12" height="12" /><circle cx="119" cy="369" r="5" /><circle cx="157" cy="369" r="5" /><circle cx="119" cy="407" r="5" /><circle cx="157" cy="407" r="5" /><circle cx="138" cy="388" r="31" className="platform-scan" /></g>
            <path className="mission-survey-boundary" d="M104 336 C205 275 341 255 442 278 S665 289 806 202" />
            <path className="mission-survey-sweep" d="M119 349 A44 44 0 0 1 167 368" />
            <path className="mission-route mission-route--inspection" d="M138 388 C237 370 351 350 454 298 S542 253 624 220" />
            <path className="mission-route mission-route--priority" d="M624 220 C677 206 720 189 773 167" />

            <g className="mission-marker mission-marker--survivor"><circle cx="624" cy="220" r="19" className="marker-ring" /><circle cx="624" cy="214" r="4" className="survivor-head" /><path className="survivor-body" d="M615 232 C616 224 632 224 633 232 M624 219 V230" /></g>
            <g className="mission-marker mission-marker--hazard"><path d="M712 328 L724 350 L700 350 Z" /><path className="hazard-symbol" d="M712 334 V342 M712 346 V347" /></g>
            <g className="mission-marker mission-marker--inspection"><rect x="601" y="197" width="46" height="46" /><path d="M624 188 V252 M592 220 H656" /><rect x="586" y="182" width="76" height="76" className="inspection-ring" /></g>
            <g className="mission-marker mission-marker--priority"><path d="M773 146 L789 162 L773 178 L757 162 Z" /><path d="M773 136 V188 M747 162 H799" /></g>

            <text className="mission-label mission-label--survey" x="104" y="322">AERIAL SURVEY</text>
            <text className="mission-label mission-label--survivor" x="570" y="187">SURVIVOR CANDIDATE</text>
            <text className="mission-label mission-label--hazard" x="681" y="375">HAZARD</text>
            <text className="mission-label mission-label--inspection" x="559" y="278">INSPECTION TARGET</text>
            <text className="mission-label mission-label--priority" x="730" y="122">PRIORITY</text>
          </svg>
        </div>

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
