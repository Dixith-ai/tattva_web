import '../styles/from-perception-to-understanding.css'

export function FromPerceptionToUnderstanding() {
  return (
    <section className="perception-understanding" id="perception-understanding" aria-labelledby="perception-understanding-title">
      <p className="understanding-kicker"><span aria-hidden="true" />05 / FROM PERCEPTION TO UNDERSTANDING</p>

      <div className="understanding-copy">
        <h2 id="perception-understanding-title">FROM SIGNALS<br />TO UNDERSTANDING.</h2>
        <p>A map describes where things are. Environmental intelligence adds what they are, where they are, and how they relate to the surrounding space.</p>
      </div>

      <div className="understanding-composition" data-asset="tattva-environmental-intelligence" aria-label="TATTVA environmental intelligence asset pending">
        <div className="understanding-layer understanding-layer--signals" data-layer="signals">
          <div className="layer-heading"><strong>RAW SIGNALS</strong><span>SENSOR DATA</span></div>
          <p className="layer-micro layer-micro--signals">WHAT THE SENSORS SEE</p>
          <i className="signal-mark signal-mark--one" /><i className="signal-mark signal-mark--two" /><i className="signal-mark signal-mark--three" /><i className="signal-mark signal-mark--four" /><i className="signal-mark signal-mark--five" />
        </div>
        <div className="understanding-layer understanding-layer--geometry" data-layer="geometry">
          <div className="layer-heading"><strong>GEOMETRY</strong><span>SPATIAL STRUCTURE</span></div>
          <p className="layer-micro layer-micro--geometry">WHERE THINGS ARE</p>
          <i className="geometry-mark geometry-mark--one" /><i className="geometry-mark geometry-mark--two" /><i className="geometry-mark geometry-mark--three" />
        </div>
        <div className="understanding-layer understanding-layer--objects" data-layer="objects">
          <div className="layer-heading"><strong>OBJECTS</strong><span>SEMANTIC DETECTION</span></div>
          <p className="layer-micro layer-micro--objects">WHAT EXISTS</p>
          <i className="object-mark object-mark--one" /><i className="object-mark object-mark--two" /><i className="object-mark object-mark--three" />
        </div>
        <div className="understanding-layer understanding-layer--relationships" data-layer="relationships">
          <div className="layer-heading"><strong>SPATIAL RELATIONSHIPS</strong><span>LOCATION / CONTEXT</span></div>
          <p className="layer-micro layer-micro--relationships">HOW THINGS ARE RELATED</p>
          <i className="relationship-mark relationship-mark--one" /><i className="relationship-mark relationship-mark--two" /><i className="relationship-mark relationship-mark--three" />
        </div>
        <div className="understanding-layer understanding-layer--environment" data-layer="environment">
          <div className="layer-heading"><strong>ENVIRONMENTAL REPRESENTATION</strong><span>STRUCTURED ENVIRONMENT</span></div>
          <p className="layer-micro layer-micro--environment">WHAT THE ENVIRONMENT MEANS</p>
          <i className="environment-mark environment-mark--one" /><i className="environment-mark environment-mark--two" />
        </div>
        <p className="understanding-key-statement">GEOMETRY BECOMES CONTEXT.</p>
        <p className="understanding-final-statement">NOT JUST A MAP.<br />A STRUCTURED ENVIRONMENT.</p>
      </div>

      <p className="understanding-pipeline">SIGNALS → GEOMETRY → OBJECTS → RELATIONSHIPS → ENVIRONMENT</p>
      <p className="understanding-bottom-label">PERCEPTION / ENVIRONMENTAL INTELLIGENCE</p>
      <p className="understanding-section-number">05 / 07</p>
    </section>
  )
}
