import { createContext, useReducer } from 'react';
import PropTypes from 'prop-types';

const userReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER': {
      return action.payload;
    }
    case 'LOGOUT_USER':
      return null;
    default:
      return state;
  }
};

const UserContext = createContext();

export const UserContextProvider = (props) => {
  const [user, dispatchUser] = useReducer(userReducer, null);

  return (
    <UserContext.Provider value={{ user, dispatchUser }}>
      {props.children}
    </UserContext.Provider>
  );
};

UserContext.displayName = 'UserContext';

export default UserContext;

UserContextProvider.propTypes = {
  children: PropTypes.node.isRequired
};