import { Application } from './components/Application'
import { Header } from './components/Header'
import { HowTattvaSees } from './components/HowTattvaSees'
import { InsideMachine } from './components/InsideMachine'
import { Opening } from './components/Opening'
import { Transformation } from './components/Transformation'
import { TheSystem } from './components/TheSystem'

function App() {
  return (
    <>
      <Header />
      <main>
        <Opening />
        <Transformation />
        <InsideMachine />
        <HowTattvaSees />
        <TheSystem />
        <Application />
      </main>
    </>
  )
}

export default App
