import { Header } from './components/Header'
import { FromPerceptionToUnderstanding } from './components/FromPerceptionToUnderstanding'
import { HowTattvaSees } from './components/HowTattvaSees'
import { InsideMachine } from './components/InsideMachine'
import { Opening } from './components/Opening'
import { Transformation } from './components/Transformation'

function App() {
  return (
    <>
      <Header />
      <main>
        <Opening />
        <Transformation />
        <InsideMachine />
        <HowTattvaSees />
        <FromPerceptionToUnderstanding />
      </main>
    </>
  )
}

export default App
