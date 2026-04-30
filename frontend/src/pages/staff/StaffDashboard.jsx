import { useEffect, useState } from 'react';
import API from '../../api/axios';
import { toast } from 'react-hot-toast';

export default function StaffDashboard() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await API.get('/orders');
      setOrders(data);
    } catch (err) {
      toast.error('Failed to fetch orders');
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await API.put(`/orders/${orderId}/status`, { status });
      toast.success('Order status updated');
      fetchOrders();
    } catch (err) {
      toast.error('Update failed');
    }
  };

  const getStatusOptions = (current) => {
    return ['pending', 'preparing', 'out-for-delivery', 'delivered', 'cancelled'];
  };

  return (
    <section className="container">
      <h1 className="page-title">Staff Dashboard</h1>
      <p className="subtitle">Manage and fulfill customer orders in real-time.</p>

      <div className="orders-grid">
        {orders.map(order => (
          <div key={order._id} className="card order-card" style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div>
                <strong>Order #{order._id.slice(-6)}</strong>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Customer: {order.user?.name}
                </p>
              </div>
              <select 
                value={order.status} 
                onChange={(e) => updateStatus(order._id, e.target.value)}
                style={{ 
                  padding: '0.5rem', 
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  backgroundColor: '#f8fafc'
                }}
              >
                {getStatusOptions(order.status).map(s => (
                  <option key={s} value={s}>{s.replace(/-/g, ' ')}</option>
                ))}
              </select>
            </div>
            
            <div className="order-items">
              {order.orderItems.map((item, i) => (
                <div key={i} style={{ fontSize: '0.9rem', margin: '0.2rem 0' }}>
                  {item.qty}x {item.name}
                </div>
              ))}
            </div>
            
            <div style={{ marginTop: '1rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
              <span>Total: ${order.totalPrice.toFixed(2)}</span>
              <span>{new Date(order.createdAt).toLocaleTimeString()}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
