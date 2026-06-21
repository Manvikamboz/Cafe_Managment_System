import { useEffect, useState } from 'react';
import API from '../../api/axios';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { ShoppingBag, Clock, CheckCircle, RefreshCw, ChefHat } from 'lucide-react';

const STATUS_COLORS = { pending:'#f59e0b', preparing:'#3b82f6', 'out-for-delivery':'#8b5cf6', delivered:'#10b981', cancelled:'#ef4444' };
const STATUS_FLOW = ['pending', 'preparing', 'out-for-delivery', 'delivered', 'cancelled'];

export default function StaffDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('active'); // active | all

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/orders');
      setOrders(data);
    } catch { toast.error('Failed to load orders'); }
    finally { setLoading(false); }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/orders/${id}/status`, { status });
      toast.success(`Order marked: ${status.replace(/-/g,' ')}`);
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o));
    } catch { toast.error('Update failed'); }
  };

  const filtered = filter === 'active'
    ? orders.filter(o => !['delivered','cancelled'].includes(o.status))
    : orders;

  const stats = [
    { label:'Total Orders', value: orders.length, color:'#3b82f6', icon: ShoppingBag },
    { label:'Active', value: orders.filter(o => !['delivered','cancelled'].includes(o.status)).length, color:'#f59e0b', icon: Clock },
    { label:'Delivered Today', value: orders.filter(o => o.status==='delivered').length, color:'#10b981', icon: CheckCircle },
  ];

  return (
    <motion.section initial={{ opacity:0 }} animate={{ opacity:1 }} className="container" style={{ paddingTop:'5rem', paddingBottom:'6rem' }}>

      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'3rem' }}>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'0.5rem' }}>
            <ChefHat size={28} style={{ color:'var(--primary)' }} />
            <h1 style={{ fontSize:'2.5rem', fontWeight:900, textTransform:'uppercase', margin:0 }}>Staff Panel</h1>
          </div>
          <p style={{ color:'var(--text-muted)', fontSize:'0.85rem' }}>Manage and fulfil live customer orders in real-time</p>
        </div>
        <button onClick={fetchOrders} style={{ background:'rgba(255,255,255,0.05)', border:'1px solid var(--border-light)', color:'var(--text-main)', padding:'0.6rem 1.25rem', borderRadius:'var(--radius-full)', display:'flex', alignItems:'center', gap:'0.5rem', cursor:'pointer', fontSize:'0.85rem' }}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1.5rem', marginBottom:'3rem' }}>
        {stats.map(({ label, value, color, icon: Icon }) => (
          <motion.div key={label} whileHover={{ y:-4 }} className="card" style={{ background:'var(--bg-card)', border:'1px solid var(--border-light)', padding:'1.75rem', display:'flex', alignItems:'center', gap:'1.25rem' }}>
            <div style={{ background:`${color}20`, padding:'0.85rem', borderRadius:'12px' }}>
              <Icon size={24} style={{ color }} />
            </div>
            <div>
              <p style={{ fontSize:'2rem', fontWeight:900, color:'var(--text-main)', margin:0 }}>{value}</p>
              <p style={{ fontSize:'0.75rem', color:'var(--text-muted)', margin:0, textTransform:'uppercase', letterSpacing:'0.05em' }}>{label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div style={{ display:'flex', gap:'0.5rem', marginBottom:'2rem' }}>
        {['active','all'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding:'0.5rem 1.25rem', borderRadius:'var(--radius-full)', border:'1px solid var(--border-light)', cursor:'pointer', fontWeight:700, fontSize:'0.8rem', textTransform:'uppercase', transition:'all 0.2s', background: filter===f ? 'var(--primary)' : 'transparent', color: filter===f ? 'white' : 'var(--text-muted)' }}>
            {f === 'active' ? 'Active Orders' : 'All Orders'}
          </button>
        ))}
      </div>

      {/* Orders */}
      {loading ? (
        <div style={{ textAlign:'center', padding:'5rem', color:'var(--text-muted)' }}>Loading orders...</div>
      ) : filtered.length === 0 ? (
        <div className="card" style={{ textAlign:'center', padding:'4rem', background:'var(--bg-card)', border:'2px dashed var(--border-light)', color:'var(--text-muted)' }}>
          <ChefHat size={48} style={{ opacity:0.3, margin:'0 auto 1rem' }} />
          <p>{filter === 'active' ? 'No active orders right now. All clear!' : 'No orders found.'}</p>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
          {filtered.map(order => (
            <motion.div key={order._id} layout className="card" style={{ background:'var(--bg-card)', border:`1px solid ${STATUS_COLORS[order.status]}30`, borderRadius:'var(--radius-md)', padding:'1.5rem' }}>
              {/* Top row */}
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'1rem', marginBottom:'1.25rem' }}>
                <div>
                  <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'0.35rem' }}>
                    <h4 style={{ margin:0, fontWeight:800, color:'var(--text-main)', fontSize:'1rem' }}>
                      Order #{order._id.slice(-6).toUpperCase()}
                    </h4>
                    <span style={{ background:`${STATUS_COLORS[order.status]}20`, color:STATUS_COLORS[order.status], padding:'0.2rem 0.65rem', borderRadius:'999px', fontSize:'0.7rem', fontWeight:800, textTransform:'uppercase' }}>
                      {order.status.replace(/-/g,' ')}
                    </span>
                  </div>
                  <p style={{ margin:0, color:'var(--text-muted)', fontSize:'0.82rem' }}>
                    👤 {order.user?.name || 'Customer'} &nbsp;·&nbsp;
                    🍽️ {order.eatery?.name || 'Eatery'} &nbsp;·&nbsp;
                    🕐 {new Date(order.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                <div style={{ textAlign:'right' }}>
                  <p style={{ fontWeight:900, color:'var(--primary)', fontSize:'1.2rem', margin:0 }}>₹{order.totalPrice.toFixed(0)}</p>
                  <p style={{ color:'var(--text-muted)', fontSize:'0.75rem', margin:0 }}>{order.orderItems.length} item{order.orderItems.length>1?'s':''}</p>
                </div>
              </div>

              {/* Items */}
              <div style={{ background:'rgba(255,255,255,0.02)', borderRadius:'10px', padding:'1rem', marginBottom:'1.25rem', display:'flex', flexWrap:'wrap', gap:'0.5rem' }}>
                {order.orderItems.map((item, i) => (
                  <span key={i} style={{ background:'rgba(255,255,255,0.05)', border:'1px solid var(--border-light)', color:'var(--text-main)', padding:'0.3rem 0.75rem', borderRadius:'999px', fontSize:'0.8rem' }}>
                    {item.qty}× {item.name}
                  </span>
                ))}
              </div>

              {/* Status Actions */}
              {!['delivered','cancelled'].includes(order.status) && (
                <div style={{ display:'flex', gap:'0.75rem', flexWrap:'wrap' }}>
                  {STATUS_FLOW.map(s => {
                    const currentIdx = STATUS_FLOW.indexOf(order.status);
                    const thisIdx = STATUS_FLOW.indexOf(s);
                    const isNext = thisIdx === currentIdx + 1;
                    const isCurrent = s === order.status;
                    const isCancel = s === 'cancelled';
                    if (!isNext && !isCurrent && !isCancel) return null;
                    return (
                      <button key={s} onClick={() => !isCurrent && updateStatus(order._id, s)} disabled={isCurrent} style={{ padding:'0.55rem 1.1rem', borderRadius:'var(--radius-full)', border:'none', cursor: isCurrent ? 'default' : 'pointer', fontWeight:700, fontSize:'0.78rem', textTransform:'uppercase', transition:'all 0.2s',
                        background: isCurrent ? 'rgba(255,255,255,0.05)' : isCancel ? 'rgba(239,68,68,0.1)' : `${STATUS_COLORS[s]}20`,
                        color: isCurrent ? 'var(--text-muted)' : isCancel ? '#ef4444' : STATUS_COLORS[s],
                        border: `1px solid ${isCurrent ? 'var(--border-light)' : isCancel ? 'rgba(239,68,68,0.3)' : `${STATUS_COLORS[s]}40`}`
                      }}>
                        {isCurrent ? `✓ ${s.replace(/-/g,' ')}` : `→ ${s.replace(/-/g,' ')}`}
                      </button>
                    );
                  })}
                </div>
              )}

              {order.status === 'delivered' && (
                <p style={{ color:'#10b981', fontWeight:700, fontSize:'0.85rem', margin:0 }}>✅ Delivered successfully</p>
              )}
              {order.status === 'cancelled' && (
                <p style={{ color:'#ef4444', fontWeight:700, fontSize:'0.85rem', margin:0 }}>❌ Order cancelled</p>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </motion.section>
  );
}
