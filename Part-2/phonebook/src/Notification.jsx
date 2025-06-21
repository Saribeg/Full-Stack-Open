const Notification = ({ message, messageType }) => {
  const className = `notification ${messageType}`
  return message
    ? <div className={className}>{message}</div>
    : null
}

export default Notification