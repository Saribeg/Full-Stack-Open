const Part = ({partData}) => {
  const {name, exercises} = partData;
  
  return (
      <li>{name}: {exercises}</li>
  )
}

export default Part