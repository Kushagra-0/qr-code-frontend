import Navbar from "../../../components/common/Navbar";
import Main from "../../../components/dashboard/Main";

const Dashboard = () => {
  return (
    <div className="bg-gradient-to-r from-blue-200 to-pink-200 p-8 h-screen w-full">
      <Navbar />
      <Main />
    </div>
  );
};

export default Dashboard;
