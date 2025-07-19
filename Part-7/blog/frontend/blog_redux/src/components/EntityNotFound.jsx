import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import InlineNotification from './Notification/InlineNotification';
import Button from './ui/Form/Button';
import entity404 from '../assets/404-entity.png';

const EntityNotFound = ({ message, redirectTo, buttonText, notificationPlacement }) => {
  const navigate = useNavigate();
  const [left, setLeft] = useState('30%');

  useEffect(() => {
    const updateLeft = () => {
      const width = window.innerWidth;
      if (width >= 1280) setLeft('30%');
      else if (width >= 1024) setLeft('25%');
      else if (width >= 768) setLeft('20%');
      else if (width >= 640) setLeft('15%');
      else setLeft('10%');
    };

    updateLeft();
    window.addEventListener('resize', updateLeft);
    return () => window.removeEventListener('resize', updateLeft);
  }, []);

  return (
    <div
      className="relative flex h-screen items-center justify-center bg-[#0b1120] text-cyan-300"
      style={{
        backgroundImage: `url(${entity404})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'cover'
      }}
    >
      <div
        className="absolute flex flex-col items-center text-center"
        style={{
          top: '40%',
          left,
          maxWidth: '300px'
        }}
      >
        <h1 className="mb-4 text-4xl font-bold text-cyan-300">Oops!</h1>

        <div className="mb-6 text-cyan-200">{message}</div>

        <Button uiType="ghostNeon" onClick={() => navigate(redirectTo)}>
          {buttonText}
        </Button>

        <InlineNotification placement={notificationPlacement} />
      </div>
    </div>
  );
};

EntityNotFound.propTypes = {
  message: PropTypes.node.isRequired,
  redirectTo: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  notificationPlacement: PropTypes.string
};

export default EntityNotFound;
