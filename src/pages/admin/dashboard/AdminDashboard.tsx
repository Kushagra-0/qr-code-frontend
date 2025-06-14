import Main from "../../../components/adminDashboard/Main";
import Navbar from "../../../components/common/Navbar";

const AdminDashboard = () => {
  return (
    <div className="bg-gradient-to-r from-blue-200 to-pink-200 p-8 h-screen w-full">
      <Navbar />
      <Main />
    </div>
  );
};

export default AdminDashboard;