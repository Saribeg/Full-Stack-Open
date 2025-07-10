import { useContext } from 'react'
import NotificationContext from '../contexts/NotificationContext'

const Notification = () => {
  const { notification } = useContext(NotificationContext)

  if (!notification) return null

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5,
    color: notification.type === 'error' ? 'red' : 'green',
    backgroundColor: notification.type === 'error' ? 'ffe6e6' : 'e6ffe6'
  }

  return (
    <div style={style}>
      {notification.message}
    </div>
  )
}

export default Notification
