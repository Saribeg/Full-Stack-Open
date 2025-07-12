import ReactDOM from 'react-dom/client';
import Providers from './Providers';
import App from './App';
import './styles/index.css';
import './styles/forms.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Providers>
    <App />
  </Providers>
);