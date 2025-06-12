import { useState } from 'react'
import Button from './Button'
import Statistics from './Statistics'

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>Give Feedback</h1>
      <div style={{ marginBottom: '20px' }}>
        <Button handleClick={() => setGood(good + 1)} text="Good"/>
        <Button handleClick={() => setNeutral(neutral + 1)} text="Neutral"/>
        <Button handleClick={() => setBad(bad + 1)} text="Bad"/>
      </div>
      <Statistics statistics={{good, neutral, bad}}/>
    </div>
  )
}

export default App