import Part from './Part'

const Content = ({content}) => {
  return (
    <ul>
      {content.map((item) =>
        <Part key={item.id} partData={item}/>
      )}
    </ul>
  )
}

export default Content