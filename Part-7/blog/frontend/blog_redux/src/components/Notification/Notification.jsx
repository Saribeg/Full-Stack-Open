import { useSelector } from 'react-redux';
import clsx from 'clsx';
import { selectNotification } from '../../store/notification/selectors';

const Notification = () => {
  const { message, type = 'success', popup, duration } = useSelector(selectNotification);

  if (!message || typeof message !== 'string') return null;

  const wrapperBase = 'w-full my-4 rounded-xl p-[2px]';
  const innerBase = 'w-full rounded-xl p-4';
  const gradientBorders = {
    success: 'bg-gradient-to-br from-[#1ba57d] to-[#0f2e2e]',
    error: 'bg-gradient-to-br from-[#ff5c5c] to-[#2c0e11]'
  };
  const innerBg = {
    success: 'bg-[var(--color-notif-success-bg)]',
    error: 'bg-[var(--color-notif-error-bg)]'
  };
  const barColor = {
    success: 'bg-emerald-300',
    error: 'bg-red-400'
  };

  return popup ? (
    <div
      className={clsx(
        'fixed right-0 bottom-0 z-50 w-[360px] overflow-hidden rounded-xl p-[2px] shadow-lg',
        gradientBorders[type]
      )}
      style={{ '--notif-duration': `${duration}ms` }}
    >
      <div className={clsx('relative rounded-xl px-5 py-4', innerBg[type])}>
        <div className="flex min-h-[48px] items-center">{message}</div>
        <div className="absolute bottom-0 left-0 h-[4px] w-full overflow-hidden">
          <div className={clsx(barColor[type], 'animate-notif-progress h-full')} />
        </div>
      </div>
    </div>
  ) : (
    <div className={clsx(wrapperBase, gradientBorders[type])}>
      <div className={clsx(innerBase, innerBg[type])}>{message}</div>
    </div>
  );
};

export default Notification;
