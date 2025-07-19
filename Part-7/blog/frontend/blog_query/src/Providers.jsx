import { BrowserRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import UserInitializer from './components/UserInitializer';

import { NotificationContextProvider } from './contexts/NotificationContext';
import { UserContextProvider } from './contexts/UserContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false
    },
  },
});


const Providers = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <NotificationContextProvider>
      <UserContextProvider>
        <UserInitializer>
          <BrowserRouter>
            {children}
          </BrowserRouter>
        </UserInitializer>
      </UserContextProvider>
    </NotificationContextProvider>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);

export default Providers;

Providers.propTypes = {
  children: PropTypes.node.isRequired
};