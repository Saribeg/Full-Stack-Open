import Part from './Part'

const Content = ({content}) => {
  const { part1, exercises1, part2, exercises2, part3, exercises3 } = content

  return (
    <>
      <Part partData={{part1, exercises1}}/>
      <Part partData={{part2, exercises2}}/>
      <Part partData={{part3, exercises3}}/>
    </>
  )
}

export default Content