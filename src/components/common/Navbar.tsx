import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setTimeout(() => {
      navigate('/');
    }, 50);
  };

  return (
    <div className="w-full bg-[#F5F5F5]/80 pl-6 pr-3 py-3 flex justify-between items-center z-50 rounded-2xl">
      <div
        className="text-2xl font-bold text-[#141414] cursor-pointer"
        onClick={() => navigate("/")}
      >
        CUSTOM QR
      </div>

      <div className="space-x-4">
        {token ? (
          <>
            {user?.role === "admin" && (
              <button
                onClick={() => navigate("/admin/dashboard")}
                className="text-lg font-medium text-[#141414] hover:text-[#036AFF] transition-all cursor-pointer"
              >
                ADMIN
              </button>
            )}
            <button
              onClick={handleLogout}
              className="text-[#e04343] text-lg font-medium px-5 py-2 transition-all cursor-pointer"
            >
              LOGOUT
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate("/login")}
              className="text-lg font-medium text-[#141414] hover:text-[#036AFF] transition-all cursor-pointer"
            >
              LOGIN
            </button>
            <button
              onClick={() => navigate("/register")}
              className="text-lg font-medium bg-white text-[#036AFF] px-5 py-2 rounded-xl shadow transition-all cursor-pointer hover:shadow-[0_0_20px_rgba(100,100,100,0.5)]"
            >
              REGISTER
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
