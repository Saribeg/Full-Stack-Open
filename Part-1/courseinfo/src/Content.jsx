import Part from './Part'

const Content = ({content}) => {
  return content.map((item) => <Part key={Math.random()} partData={item}/>)
}

export default Content