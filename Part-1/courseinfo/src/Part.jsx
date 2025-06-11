const Part = ({partData }) => {
  // As I already familiar with JS and knew React in the past, I decided to use more
  // reusable approach instead of listing partX and exercisesX
  return (
      <p>{Object.values(partData).join(' ')}</p>
  )
}

export default Part