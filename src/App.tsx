import { Header } from './components/Header'
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
      </main>
    </>
  )
}

export default App
