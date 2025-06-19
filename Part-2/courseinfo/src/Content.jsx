import Part from './Part'

const Content = ({content}) => {
  return content.map((item) => <Part key={item.id} partData={item}/>)
}

export default Content