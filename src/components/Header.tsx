export function Header() {
  return (
    <header className="site-header">
      <a className="site-wordmark" href="#opening" aria-label="TATTVA">
        TATTVA
      </a>

      <nav className="site-navigation" aria-label="Primary navigation">
        <a href="#transformation">TRANSFORMATION</a>
        <a href="#inside-the-machine">INSIDE THE MACHINE</a>
        <a href="#how-tattva-sees">HOW TATTVA SEES</a>
        <a href="#the-system">THE SYSTEM</a>
        <a href="#conclusion">CONCLUSION</a>
      </nav>

      <details className="site-mobile-navigation">
        <summary aria-label="Open section navigation">INDEX</summary>
        <nav aria-label="Mobile section navigation">
          <a href="#transformation">TRANSFORMATION</a>
          <a href="#inside-the-machine">INSIDE THE MACHINE</a>
          <a href="#how-tattva-sees">HOW TATTVA SEES</a>
          <a href="#the-system">THE SYSTEM</a>
          <a href="#conclusion">CONCLUSION</a>
        </nav>
      </details>

      <p className="site-system-label">AIR / GROUND SYSTEM</p>
    </header>
  )
}
