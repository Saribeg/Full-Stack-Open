import Header from './Header'
import Content from './Content'
import Total from './Total'

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }
  const {name, parts} = course;

  return (
    <div>
      <Header course={name} />
      <Content content={parts} />
      <Total numberOfExercises={parts.reduce((sum, item )=> sum + item.exercises, 0)}/>
    </div>
  )
}

export default App