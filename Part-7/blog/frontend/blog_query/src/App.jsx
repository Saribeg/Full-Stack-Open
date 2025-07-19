import { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';

import { Container, CssBaseline } from '@mui/material';

import Notification from './components/Notification';
import NotFound from './components/NotFound';
import Header from './components/Header/Header';
import LoginForm from './components/Auth/LoginForm';
import About from './components/About/About';
import Users from './components/User/Users';
import UserDetails from './components/User/UserDetails';
import BlogSection from './components/Blog/BlogSection';
import BlogDetails from './components/Blog/BlogDetails';

import UserContext from './contexts/UserContext';

const App = () => {
  const { user } = useContext(UserContext);

  return (
    <>
      <CssBaseline />
      <Notification />
      <Container maxWidth="lg" disableGutters>
        <Header />
      </Container>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }} disableGutters >
        {user
          ? (
            <Routes>
              <Route path="/" element={<BlogSection />} />
              <Route path="about" element={<About />}/>
              <Route path="blogs" element={<BlogSection />}/>
              <Route path="blogs/:id" element={<BlogDetails />} />
              <Route path="users/:id" element={<UserDetails />} />
              <Route path="users" element={<Users />}/>
              <Route path="*" element={<NotFound />} />
            </Routes>
          )
          : (
            <LoginForm />
          )}
      </Container>
    </>
  );
};

export default App;