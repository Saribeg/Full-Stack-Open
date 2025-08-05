import { RetryLink } from '@apollo/client/link/retry';
import { toast } from 'react-toastify';

let retryToastShown = false;

export const retryLink = new RetryLink({
  attempts: {
    max: 2,
    retryIf: (error) => {
      const status = error?.statusCode;
      const shouldRetry =
        !!error &&
        status !== 401 &&
        status !== 403 &&
        status !== 400;

      if (shouldRetry && !retryToastShown) {
        toast.info('Retrying request(s)... Server temporarily unavailable.');
        retryToastShown = true;
        setTimeout(() => {
          retryToastShown = false;
        }, 5000); // suppress further retry toasts for 5 sec
      }

      return shouldRetry;
    }
  },
  delay: {
    initial: 300,
    max: 1000,
    jitter: true
  }
});
