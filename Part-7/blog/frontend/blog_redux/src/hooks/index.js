// Reserved for manual one-off notifications (non-thunk)
import { useDispatch } from 'react-redux';
import { setNotification } from '../store/notification/thunks';

export const useNotification = () => {
  const dispatch = useDispatch();

  return ({ message, type = 'success', seconds = 5 }) => {
    dispatch(setNotification(message, type, seconds));
  };
};
