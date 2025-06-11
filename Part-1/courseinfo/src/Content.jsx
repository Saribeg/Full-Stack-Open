const Content = ({content}) => {
  const { part1, exercises1, part2, exercises2, part3, exercises3 } = content

  return (
    <>
      <p>
        {part1} {exercises1}
      </p>
      <p>
        {part2} {exercises2}
      </p>
      <p>
        {part3} {exercises3}
      </p>
    </>
  )
}

export default Content