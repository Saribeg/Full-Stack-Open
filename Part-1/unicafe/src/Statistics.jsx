import StatisticLine from './StatisticLine'

const Statistics = ({statistics: { good, neutral, bad }}) => {
  const total = good + neutral + bad
  const average = total === 0 ? 0 : (good - bad) / total
  const positive = total === 0 ? 0 : (good / total) * 100

  if (!total) {
    return <p>No feedback given</p>
  }

  return (
    <div>
      <StatisticLine text="Good" value ={good} />
      <StatisticLine text="Neutral" value ={neutral} />
      <StatisticLine text="Bad" value ={bad} />
      <StatisticLine text="All" value ={total} />
      <StatisticLine text="Average" value ={average} />
      <StatisticLine text="Positive" value ={positive + '%'} />
    </div>
  )
}

export default Statistics