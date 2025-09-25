
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Navigation,
  Hero,
  About,
  Team,
  Impact,
  Resources,
  Articles,
  Involve,
} from '../components';

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    // Scroll to the section if specified in the state
    if (location.state && location.state.section) {
      const element = document.getElementById(location.state.section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        // Clear the state after scrolling
        navigate(location.pathname, { replace: true });
      }
    }
    
  }, [location.state, navigate, location.pathname]);

  return (
    <div className="min-h-screen bg-[#E8DDD4] text-[#8B4513] overflow-x-hidden">
      <Navigation />
      {/* <Hero /> */}
      {/* <About /> */}
      {/* <Team /> */}
      <Impact />
      <Resources />
      <Articles />
      <Involve />
    </div>
  );
};

export default Home;