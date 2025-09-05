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
import CreateBlog from './pages/admin/createBlog/CreateBlog';
import BlogPage from './pages/public/blog/BlogPage';
import AdminDashboard from './pages/admin/dashboard/AdminDashboard';
import AdminRoute from './common/AdminRoite';
import EditBlog from './pages/admin/editBlog/EditBlog';
import CreateQrCode from './pages/protected/qrcodes/create/CreateQrCode';
import QrRedirect from './pages/public/qrRedirect/QrRedirect';
import QrCodeDetails from './pages/protected/qrcodes/details/QrCodeDetails';
import EditQrCode from './pages/protected/qrcodes/edit/EditQrCode';
import QrPage from './pages/public/qrPage/QrPage';

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
        <Route path="/blog/:slug" element={<BlogPage />} />
        <Route path="/qrcodes/link/:id" element={<QrRedirect />} />
        <Route path="/qr/:shortCode" element={<QrRedirect />} />
        <Route path="/page/:shortCode" element={<QrPage />} />

        <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />}/>} />
        <Route path="/qrcodes/create" element={<ProtectedRoute element={<CreateQrCode />} />} />
        <Route path="/qrcodes/details/:id" element={<ProtectedRoute element={<QrCodeDetails />} />} />
        <Route path="/qrcodes/edit/:id" element={<ProtectedRoute element={<EditQrCode />} />} />

        <Route path="/blog/create/new" element={<AdminRoute element={<CreateBlog />}/>} />
        <Route path="/admin/dashboard" element={<AdminRoute element={<AdminDashboard />} />} />
        <Route path="/blog/edit/:slug" element={<AdminRoute element={<EditBlog />} />} />

      </Routes>
    </Router>
  );
}

export default App;
