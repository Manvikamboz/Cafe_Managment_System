import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import EateryDetail from './pages/EateryDetail.jsx';
import Cart from './pages/Cart.jsx';
import Feedback from './pages/Feedback.jsx';
import Reviews from './pages/Reviews.jsx';
import About from './pages/About.jsx';
import Location from './pages/Location.jsx';
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';
import OrderTracking from './pages/OrderTracking.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import StaffDashboard from './pages/staff/StaffDashboard.jsx';
import ChatbotWidget from './components/ChatbotWidget.jsx';
import { useAuth } from './context/AuthContext.jsx';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="loading-container">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;

  return children;
};

function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/eatery/:id" element={<EateryDetail />} />
          <Route path="/cookbook" element={<Navigate to="/" replace />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/about" element={<About />} />
          <Route path="/location" element={<Location />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route 
            path="/orders/track" 
            element={
              <ProtectedRoute>
                <OrderTracking />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/staff" 
            element={
              <ProtectedRoute roles={['admin', 'staff']}>
                <StaffDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
      <ChatbotWidget />
    </div>
  );
}

export default App;
