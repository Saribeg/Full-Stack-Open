import PropTypes from 'prop-types';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { NotificationContextProvider } from './contexts/NotificationContext';
import { UserContextProvider } from './contexts/UserContext';
const queryClient = new QueryClient();


const Providers = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <NotificationContextProvider>
      <UserContextProvider>
        {children}
      </UserContextProvider>
    </NotificationContextProvider>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);

export default Providers;

Providers.propTypes = {
  children: PropTypes.node.isRequired
};