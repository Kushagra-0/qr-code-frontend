import Navbar from '../../components/common/Navbar';
import Hero from '../../components/home/Hero';

const Home = () => {
  return (
    <div className="bg-gradient-to-r from-blue-200 to-pink-200 p-8 h-screen w-full">
      <Navbar />
      <Hero />
    </div>
  );
};

export default Home;
