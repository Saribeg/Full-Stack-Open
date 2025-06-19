const Part = ({partData}) => {
  const {name, exercises} = partData;
  
  return (
      <p>{name}: {exercises}</p>
  )
}

export default Part