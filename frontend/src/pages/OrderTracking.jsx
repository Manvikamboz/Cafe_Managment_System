import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import io from 'socket.io-client';
import { motion } from 'framer-motion';
import { Clock, MapPin, CheckCircle, ArrowLeft, RefreshCw } from 'lucide-react';

export default function OrderTracking() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const orderId = query.get('id');

  useEffect(() => {
    if (!orderId) {
      navigate('/');
      return;
    }

    fetchOrder();

    // Setup Socket.io for live updates
    const socket = io(window.location.hostname === 'localhost' ? 'http://localhost:5000' : window.location.origin);
    socket.emit('joinOrder', orderId);

    socket.on('orderStatusUpdated', (data) => {
      if (data.orderId === orderId) {
        setOrder(prev => prev ? { ...prev, status: data.status } : null);
        toast.info(`Order status updated: ${data.status.replace(/-/g, ' ')}`);
      }
    });

    return () => socket.disconnect();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const { data } = await API.get(`/orders/${orderId}`);
      setOrder(data);
      setLoading(false);
    } catch (err) {
      toast.error('Failed to load order details');
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ff523b';
      case 'preparing': return '#f59e0b';
      case 'out-for-delivery': return '#3b82f6';
      case 'delivered': return '#10b981';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pending Confirmation';
      case 'preparing': return 'Chef is Preparing';
      case 'out-for-delivery': return 'Out for Delivery';
      case 'delivered': return 'Delivered successfully';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="loader-container" style={{ minHeight: '80vh' }}>
        <div className="spinner"></div>
        <p>Connecting to order dispatcher stream...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <h2>Order Not Found</h2>
        <button className="btn-primary" style={{ marginTop: '2rem' }} onClick={() => navigate('/')}>
          Back to Explore
        </button>
      </div>
    );
  }

  return (
    <motion.section 
      className="container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ paddingTop: '6rem', paddingBottom: '8rem' }}
    >
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <button 
          onClick={() => navigate('/')} 
          style={{ background: 'none', color: 'var(--text-muted)', display: 'inline-flex', gap: '0.5rem', alignItems: 'center', marginBottom: '2rem', fontSize: '0.9rem', fontWeight: 600 }}
        >
          <ArrowLeft size={16} /> Back to Discover
        </button>

        <div className="card" style={{ background: 'var(--bg-card)', color: 'var(--text-main)', border: '1px solid var(--border-light)', padding: '3rem', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.75rem', textTransform: 'uppercase', letterSpacing: '-0.02em', margin: 0 }}>
              Live Order Tracker
            </h2>
            <button onClick={fetchOrder} style={{ background: 'none', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700, fontSize: '0.8rem' }}>
              <RefreshCw size={14} /> Refresh
            </button>
          </div>

          <div 
            style={{ 
              fontSize: '1.2rem', 
              fontWeight: 'bold', 
              color: 'white', 
              backgroundColor: getStatusColor(order.status),
              padding: '1.25rem',
              borderRadius: 'var(--radius-sm)',
              margin: '1.5rem 0 2.5rem',
              textAlign: 'center',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              boxShadow: '0 4px 15px rgba(0,0,0,0.15)'
            }}
          >
            {getStatusText(order.status)}
          </div>

          <div className="tracking-eatery-info" style={{ display: 'flex', gap: '1rem', background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-light)', marginBottom: '2rem' }}>
            <MapPin size={24} style={{ color: 'var(--primary)', flexShrink: 0 }} />
            <div>
              <h4 style={{ margin: 0, fontSize: '1.1rem' }}>Eatery Point</h4>
              <p style={{ margin: '0.25rem 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                {order.eatery?.name || 'Local Food Spot'}<br />
                {order.eatery?.address}
              </p>
            </div>
          </div>
          
          <div className="order-details" style={{ textAlign: 'left', marginTop: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
              Receipt Breakdown
            </h3>
            <p style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              <span>Order Reference ID</span>
              <span style={{ fontFamily: 'monospace' }}>{order._id}</span>
            </p>
            <p style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              <span>Time Placed</span>
              <span>{new Date(order.createdAt).toLocaleString()}</span>
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {order.orderItems.map((item, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>
                    <strong style={{ color: 'var(--text-main)' }}>{item.qty}x</strong> {item.name}
                  </span>
                  <span>₹{(item.qty * item.price).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div style={{ height: '1px', background: 'var(--border-light)', margin: '1.5rem 0' }} />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.3rem' }}>
              <span>Amount Paid</span>
              <span style={{ color: 'var(--primary)' }}>₹{order.totalPrice.toFixed(2)}</span>
            </div>
          </div>
          
          <button 
            className="btn-primary" 
            style={{ marginTop: '3rem', width: '100%', padding: '1rem' }} 
            onClick={() => navigate('/')}
          >
            Order from another FoodSpot
          </button>
        </div>
      </div>
    </motion.section>
  );
}
