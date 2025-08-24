import Navbar from '../../../components/common/Navbar';
import Hero from '../../../components/home/Hero';
import HowItWorks from '../../../components/home/HowItWorks';

const Home = () => {

  return (
    <div className="bg-gradient-to-r from-blue-200 to-pink-200 p-8 min-h-screen w-full">
      <Navbar />
      <Hero />
      <HowItWorks />
    </div>
  );
};

export default Home;
