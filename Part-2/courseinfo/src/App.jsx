import Course from './Course'

const App = () => {
  const course = {
    id: 1,
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      },
      {
        name: "My custom new part",
        exercises: 3,
        id: 4
      },
      {
        name: "Redux",
        exercises: 11,
        id: 5
      }
    ]
  }

  return <Course course={course} />
}

export default App