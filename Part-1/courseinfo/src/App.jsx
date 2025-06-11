import Header from './Header'
import Content from './Content'
import Total from './Total'

const App = () => {
  const course = 'Half Stack application development'
  const part1 = {
    name: 'Fundamentals of React',
    exercises: 10
  }
  const part2 = {
    name: 'Using props to pass data',
    exercises: 7
  }
  const part3 = {
    name: 'State of a component',
    exercises: 14
  }

  return (
    <div>
      <Header course={course} />
      <Content content={[part1, part2, part3]} />
      <Total numberOfExercises={[part1, part2, part3].reduce((sum, item )=> sum + item.exercises, 0)}/>
    </div>
  )
}

export default App