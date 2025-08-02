import { onError } from '@apollo/client/link/error';
import { toast } from 'react-toastify';

// Avoid duplicate toasts
const shownMessages = new Set();

const showToastOnce = (message, type = 'error') => {
  if (!shownMessages.has(message)) {
    toast[type](message);
    shownMessages.add(message);
    setTimeout(() => shownMessages.delete(message), 5000);
  }
};

export const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      const code = err.extensions?.code;
      const message = err.message;

      // Handle authentication errors: log out + redirect
      if (code === 'UNAUTHENTICATED') {
        showToastOnce('Session expired. Please log in again.');
        localStorage.removeItem('library-user-token');
        setTimeout(() => {
          window.location.href = '/login';
        }, 500);
        return;
      }

      // Replace only INTERNAL_SERVER_ERROR to hide internal info
      const displayMessage =
        code === 'INTERNAL_SERVER_ERROR'
          ? 'Something went wrong. Please try again later.'
          : message;

      showToastOnce(displayMessage);
    }
  }

  if (networkError && networkError.statusCode !== 400) {
    console.log(networkError);
    showToastOnce('Server unavailable. Please try again later.');
  }
});
