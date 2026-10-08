import { Header } from './components/Header'
import { Conclusion } from './components/Conclusion'
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
        <Conclusion />
      </main>
    </>
  )
}

export default App
