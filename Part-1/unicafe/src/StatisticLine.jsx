const StatisticLine = ({text, value}) => {
  return (
    <tr>
      <td style={{ border: '1px solid #d3d3d3', padding: '8px' }}>{text}:</td>
      <td style={{ border: '1px solid #d3d3d3', padding: '8px', width: '170px' }}>{value}</td>
    </tr>
    
  )
} 
export default StatisticLine