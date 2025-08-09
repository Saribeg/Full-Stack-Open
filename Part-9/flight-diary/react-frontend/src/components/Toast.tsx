import { Status } from '../types';
const Toast = (props: Status) => {
  const { type, message } = props;

  return <div className={`toast ${type}`}>{message}</div>;
};

export default Toast;