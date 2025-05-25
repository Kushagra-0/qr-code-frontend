import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/public/home/Home';
import Register from './pages/public/register/Register';
import Login from './pages/public/login/Login';
import VerifyOtp from './pages/public/verifyOtp/VerifyOtp';
import FindEmail from './pages/public/findEmail/FindEmail';
import ResetPassword from './pages/public/resetPassword/ResetPassword';
import ProtectedRoute from './common/ProtectedRoute';
import Dashboard from './pages/protected/dashboard/Dashboard';
import Blog from './pages/public/blog/Blog';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/find-email" element={<FindEmail />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/blog" element={<Blog />} />

        <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />}/>} />
      </Routes>
    </Router>
  );
}

export default App;
