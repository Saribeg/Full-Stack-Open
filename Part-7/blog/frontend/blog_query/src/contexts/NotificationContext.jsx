import { createContext, useReducer } from 'react';
import PropTypes from 'prop-types';

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SHOW_MESSAGE': {
      const { type, message } = action.payload;
      return { type, message };
    }
    case 'HIDE_MESSAGE':
      return null;
    default:
      return state;
  }
};

const NotificationContext = createContext();

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, null);

  return (
    <NotificationContext.Provider value={{ notification, notificationDispatch }}>
      {props.children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;

NotificationContextProvider.propTypes = {
  children: PropTypes.node.isRequired
};