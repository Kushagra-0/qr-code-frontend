import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/common/Navbar';
import Hero from '../../../components/home/Hero';
import { useAuth } from '../../../context/AuthContext';
import { useEffect } from 'react';
import HowItWorks from '../../../components/home/HowItWorks';

const Home = () => {
  const { token, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && token) {
      navigate("/dashboard");
    }
  }, [loading, token]);

  return (
    <div className="bg-gradient-to-r from-blue-200 to-pink-200 p-8 min-h-screen w-full">
      <Navbar />
      <Hero />
      <HowItWorks />
    </div>
  );
};

export default Home;
