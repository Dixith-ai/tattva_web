import { useEffect, useRef, useState } from 'react'
import '../styles/conclusion.css'

export function Conclusion() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const section = sectionRef.current

    if (!section || window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      setIsVisible(true)
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.16 },
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      className={`conclusion${isVisible ? ' is-visible' : ''}`}
      id="conclusion"
      ref={sectionRef}
      aria-labelledby="conclusion-title"
    >
      <div className="conclusion-shell">
        <p className="conclusion-kicker conclusion-reveal" style={{ '--reveal-delay': '0ms' } as React.CSSProperties}>
          <span aria-hidden="true" />06 / CONCLUSION
        </p>

        <h2 id="conclusion-title" className="conclusion-title conclusion-reveal" style={{ '--reveal-delay': '120ms' } as React.CSSProperties}>
          TATTVA BRINGS<br />THE SYSTEM<br />TOGETHER.
        </h2>

        <div className="conclusion-statements">
          <p className="conclusion-statement conclusion-statement--primary conclusion-reveal" style={{ '--reveal-delay': '320ms' } as React.CSSProperties}>
            TATTVA brings <span className="conclusion-keyword" style={{ '--accent-delay': '720ms' } as React.CSSProperties}>aerial reconnaissance</span>, <span className="conclusion-keyword" style={{ '--accent-delay': '820ms' } as React.CSSProperties}>multi-sensor perception</span>, <span className="conclusion-keyword" style={{ '--accent-delay': '920ms' } as React.CSSProperties}>autonomous ground inspection</span> and <span className="conclusion-keyword" style={{ '--accent-delay': '1020ms' } as React.CSSProperties}>environmental understanding</span> into a single continuous rescue workflow.
          </p>
          <p className="conclusion-statement conclusion-statement--secondary conclusion-reveal" style={{ '--reveal-delay': '470ms' } as React.CSSProperties}>
            The system is designed to move beyond simply detecting a survivor — combining where a survivor is, what surrounds them, how the area can be accessed, and what risks may be present into <span className="conclusion-keyword" style={{ '--accent-delay': '1120ms' } as React.CSSProperties}>actionable information</span> for the response team.
          </p>
          <p className="conclusion-statement conclusion-statement--tertiary conclusion-reveal" style={{ '--reveal-delay': '610ms' } as React.CSSProperties}>
            By carrying information from detection through validation and assessment, TATTVA aims to <span className="conclusion-keyword" style={{ '--accent-delay': '1220ms' } as React.CSSProperties}>reduce uncertainty</span> before responders enter a disaster-affected environment.
          </p>
        </div>

        <div className="conclusion-workflow" aria-label="DETECT → VERIFY → MAP → ASSESS → PRIORITIZE">
          {['DETECT', '→', 'VERIFY', '→', 'MAP', '→', 'ASSESS', '→', 'PRIORITIZE'].map((item, index) => (
            <span
              aria-hidden="true"
              className={`conclusion-workflow-item${item === '→' ? ' conclusion-workflow-arrow' : ''}`}
              key={`${item}-${index}`}
              style={{ '--workflow-delay': `${780 + index * 90}ms` } as React.CSSProperties}
            >
              {item}
            </span>
          ))}
        </div>

        <div className="conclusion-closing conclusion-reveal" style={{ '--reveal-delay': '1260ms' } as React.CSSProperties}>
          <p>TATTVA</p>
          <span>An autonomous air–ground platform for intelligent disaster response.</span>
        </div>
      </div>
    </section>
  )
}
