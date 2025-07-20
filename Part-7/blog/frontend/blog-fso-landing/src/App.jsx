import Header from './components/Header/Header';
import AboutMe from './components/AboutMe';
import AboutProject from './components/AboutProject';
import Technologies from './components/Technologies';
import Projects from './components/Projects';
import Timelog from './components/Timelog';
import Footer from './components/Footer';

function App() {
  return (
    <div className="mx-auto max-w-7xl">
      <Header />
      <AboutMe />
      <AboutProject />
      <Technologies />
      <Projects />
      <Timelog />
      <Footer />
    </div>
  );
}

export default App;
