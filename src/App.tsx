import { Header } from './components/Header'
import { HowTattvaSees } from './components/HowTattvaSees'
import { InsideMachine } from './components/InsideMachine'
import { Opening } from './components/Opening'
import { Transformation } from './components/Transformation'
import { TheSystem } from './components/TheSystem'
import { MissionSimulation } from './components/MissionSimulation'

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
        <MissionSimulation />
      </main>
    </>
  )
}

export default App
