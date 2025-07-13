import PropTypes from 'prop-types';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { NotificationContextProvider } from './contexts/NotificationContext';
import { UserContextProvider } from './contexts/UserContext';
const queryClient = new QueryClient();


const Providers = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <NotificationContextProvider>
      <UserContextProvider>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </UserContextProvider>
    </NotificationContextProvider>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);

export default Providers;

Providers.propTypes = {
  children: PropTypes.node.isRequired
};