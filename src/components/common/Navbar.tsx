import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Menu, X } from "react-feather";

const Navbar = () => {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<any>(null);
  const buttonRef = useRef<any>(null);

  const handleLogout = () => {
    logout();
    setTimeout(() => {
      navigate("/");
    }, 50);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <nav className="w-full bg-[#F5F5F5]/80 px-6 py-3 flex justify-between items-center z-50 rounded-2xl relative">
      {/* Logo */}
      <div
        className="text-2xl font-bold text-[#141414] cursor-pointer "
        onClick={() => navigate("/")}
      >
        QRSONLY
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex space-x-4">
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
              onClick={() => navigate("/dashboard")}
              className="text-lg font-medium text-[#141414] hover:text-[#036AFF] transition-all cursor-pointer"
            >
              GO TO DASHBOARD
            </button>
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

      {/* Mobile Menu Button */}
      <div ref={buttonRef} className="md:hidden mt-2">
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div ref={dropdownRef} className="absolute top-full right-3 mt-2 w-48 bg-white rounded-xl flex flex-col items-start p-4 space-y-3 md:hidden shadow-[0_0_20px_rgba(100,100,100,0.5)]">
          {token ? (
            <>
              {user?.role === "admin" && (
                <button
                  onClick={() => {
                    navigate("/admin/dashboard");
                    setIsOpen(false);
                  }}
                  className="text-lg font-medium text-[#141414] hover:text-[#036AFF] transition-all"
                >
                  ADMIN
                </button>
              )}
              <button
                onClick={() => {
                  navigate("/dashboard");
                  setIsOpen(false);
                }}
                className="text-lg font-medium text-[#141414] hover:text-[#036AFF] transition-all"
              >
                GO TO DASHBOARD
              </button>
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="text-[#e04343] text-lg font-medium transition-all"
              >
                LOGOUT
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  navigate("/login");
                  setIsOpen(false);
                }}
                className="text-lg font-medium text-[#141414] hover:text-[#036AFF] transition-all"
              >
                LOGIN
              </button>
              <button
                onClick={() => {
                  navigate("/register");
                  setIsOpen(false);
                }}
                className="text-lg font-medium bg-white text-[#036AFF] px-5 py-2 rounded-xl shadow transition-all hover:shadow-[0_0_20px_rgba(100,100,100,0.5)]"
              >
                REGISTER
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
