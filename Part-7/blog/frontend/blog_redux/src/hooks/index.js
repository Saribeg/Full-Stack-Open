import { useDispatch } from 'react-redux';
import { setNotification } from '../store/reducers/notificationReducer';

export const useNotification = () => {
  const dispatch = useDispatch();

  return ({ message, type = 'success', seconds = 5 }) => {
    dispatch(setNotification(message, type, seconds));
  };
};
