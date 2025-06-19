import Header from './Header'
import Content from './Content'
import Total from './Total'

const Course = ({course}) => {
  const {name, parts} = course;

  return (
    <div>
      <Header course={name} />
      <Content content={parts} />
      <Total numberOfExercises={parts.reduce((sum, item )=> sum + item.exercises, 0)}/>
    </div>
  )
}

export default Course