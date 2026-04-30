import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import io from 'socket.io-client';

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

    const socket = io();
    socket.emit('joinOrder', orderId);

    socket.on('orderStatusUpdated', (data) => {
      if (data.orderId === orderId) {
        setOrder(prev => ({ ...prev, status: data.status }));
        toast.info(`Order status updated to: ${data.status}`);
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
      case 'pending': return '#64748b';
      case 'preparing': return '#f59e0b';
      case 'out-for-delivery': return '#3b82f6';
      case 'delivered': return '#10b981';
      case 'cancelled': return '#ef4444';
      default: return '#000';
    }
  };

  if (loading) return <div className="container">Loading order status...</div>;
  if (!order) return <div className="container">Order not found</div>;

  return (
    <section className="container">
      <div className="card hero" style={{ textAlign: 'center', maxWidth: '600px', margin: '2rem auto' }}>
        <h2>Order Status</h2>
        <div 
          style={{ 
            fontSize: '1.5rem', 
            fontWeight: 'bold', 
            color: 'white', 
            backgroundColor: getStatusColor(order.status),
            padding: '1rem',
            borderRadius: '12px',
            margin: '1.5rem 0',
            textTransform: 'uppercase'
          }}
        >
          {order.status.replace(/-/g, ' ')}
        </div>
        
        <div className="order-details" style={{ textAlign: 'left', marginTop: '2rem' }}>
          <h3>Order Details</h3>
          <p><strong>Order ID:</strong> {order._id}</p>
          <p><strong>Placed on:</strong> {new Date(order.createdAt).toLocaleString()}</p>
          <hr />
          {order.orderItems.map((item, index) => (
            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', margin: '0.5rem 0' }}>
              <span>{item.qty}x {item.name}</span>
              <span>${(item.qty * item.price).toFixed(2)}</span>
            </div>
          ))}
          <hr />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
            <span>Total Paid</span>
            <span>${order.totalPrice.toFixed(2)}</span>
          </div>
        </div>
        
        <button 
          className="btn-primary" 
          style={{ marginTop: '2rem' }} 
          onClick={() => navigate('/cookbook')}
        >
          Order More
        </button>
      </div>
    </section>
  );
}
