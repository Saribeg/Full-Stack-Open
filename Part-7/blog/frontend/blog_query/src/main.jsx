import ReactDOM from 'react-dom/client';
import App from './App';
import { NotificationContextProvider } from './contexts/NotificationContext';
import './styles/index.css';
import './styles/forms.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <NotificationContextProvider>
    <App />
  </NotificationContextProvider>
);