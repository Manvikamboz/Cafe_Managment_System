import { useEffect, useState } from 'react';
import API from '../../api/axios';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Users, ShoppingBag, Utensils, DollarSign, Trash2, RefreshCw, Shield } from 'lucide-react';

const STATUS_COLORS = { pending:'#f59e0b', preparing:'#3b82f6', 'out-for-delivery':'#8b5cf6', delivered:'#10b981', cancelled:'#ef4444' };

export default function AdminDashboard() {
  const [tab, setTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [menu, setMenu] = useState([]);
  const [eateries, setEateries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [newItem, setNewItem] = useState({ name:'', price:'', category:'', description:'', eateryId:'' });

  useEffect(() => { fetchAll(); }, []);
  useEffect(() => { fetchTab(); }, [tab]);

  const fetchAll = async () => {
    try {
      const [u, o, m, e] = await Promise.all([
        API.get('/users'), API.get('/orders'), API.get('/menu'), API.get('/eateries')
      ]);
      setUsers(u.data); setOrders(o.data); setMenu(m.data); setEateries(e.data);
    } catch { toast.error('Failed to load data'); }
  };

  const fetchTab = async () => {
    setLoading(true);
    try {
      if (tab === 'users') { const { data } = await API.get('/users'); setUsers(data); }
      else if (tab === 'orders') { const { data } = await API.get('/orders'); setOrders(data); }
      else if (tab === 'menu') { const { data } = await API.get('/menu'); setMenu(data); }
      else if (tab === 'eateries') { const { data } = await API.get('/eateries'); setEateries(data); }
    } catch { toast.error('Refresh failed'); }
    finally { setLoading(false); }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try { await API.delete(`/users/${id}`); toast.success('User deleted'); fetchTab(); }
    catch { toast.error('Delete failed'); }
  };

  const updateRole = async (id, role) => {
    try { await API.put(`/users/${id}/role`, { role }); toast.success('Role updated'); fetchTab(); }
    catch { toast.error('Update failed'); }
  };

  const updateOrderStatus = async (id, status) => {
    try { await API.put(`/orders/${id}/status`, { status }); toast.success('Status updated'); fetchTab(); }
    catch { toast.error('Update failed'); }
  };

  const deleteMenuItem = async (id) => {
    if (!window.confirm('Delete menu item?')) return;
    try { await API.delete(`/menu/${id}`); toast.success('Item deleted'); fetchTab(); }
    catch { toast.error('Delete failed'); }
  };

  const addMenuItem = async (e) => {
    e.preventDefault();
    try {
      await API.post('/menu', newItem);
      toast.success('Menu item added');
      setShowAddMenu(false);
      setNewItem({ name:'', price:'', category:'', description:'', eateryId:'' });
      fetchTab();
    } catch { toast.error('Failed to add item'); }
  };

  const deleteEatery = async (id) => {
    if (!window.confirm('Delete this eatery?')) return;
    try { await API.delete(`/eateries/${id}`); toast.success('Eatery deleted'); fetchTab(); }
    catch { toast.error('Delete failed'); }
  };

  const totalRevenue = orders.filter(o => o.status === 'delivered').reduce((s, o) => s + o.totalPrice, 0);

  const stats = [
    { icon: Users, label: 'Total Users', value: users.length, color: '#3b82f6' },
    { icon: Utensils, label: 'Eateries', value: eateries.length, color: '#f59e0b' },
    { icon: ShoppingBag, label: 'Total Orders', value: orders.length, color: '#8b5cf6' },
    { icon: DollarSign, label: 'Revenue', value: `₹${totalRevenue.toFixed(0)}`, color: '#10b981' },
  ];

  const tabs = ['users', 'orders', 'menu', 'eateries'];

  return (
    <motion.section initial={{ opacity:0 }} animate={{ opacity:1 }} className="container" style={{ paddingTop:'5rem', paddingBottom:'6rem' }}>
      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'3rem' }}>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'0.5rem' }}>
            <Shield size={28} style={{ color:'var(--primary)' }} />
            <h1 style={{ fontSize:'2.5rem', fontWeight:900, textTransform:'uppercase', margin:0 }}>Admin Panel</h1>
          </div>
          <p style={{ color:'var(--text-muted)', fontSize:'0.85rem' }}>Full system control — users, eateries, menu, orders</p>
        </div>
        <button onClick={fetchAll} style={{ background:'rgba(255,255,255,0.05)', border:'1px solid var(--border-light)', color:'var(--text-main)', padding:'0.6rem 1.25rem', borderRadius:'var(--radius-full)', display:'flex', alignItems:'center', gap:'0.5rem', cursor:'pointer', fontSize:'0.85rem' }}>
          <RefreshCw size={14} /> Refresh All
        </button>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1.5rem', marginBottom:'3rem' }}>
        {stats.map(({ icon: Icon, label, value, color }) => (
          <motion.div key={label} whileHover={{ y:-4 }} className="card" style={{ background:'var(--bg-card)', border:'1px solid var(--border-light)', padding:'1.75rem', display:'flex', alignItems:'center', gap:'1.25rem' }}>
            <div style={{ background:`${color}20`, padding:'0.85rem', borderRadius:'12px' }}>
              <Icon size={24} style={{ color }} />
            </div>
            <div>
              <p style={{ fontSize:'1.8rem', fontWeight:900, color:'var(--text-main)', margin:0 }}>{value}</p>
              <p style={{ fontSize:'0.75rem', color:'var(--text-muted)', margin:0, textTransform:'uppercase', letterSpacing:'0.05em' }}>{label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:'0.5rem', marginBottom:'2rem', background:'rgba(255,255,255,0.03)', padding:'0.4rem', borderRadius:'var(--radius-sm)', border:'1px solid var(--border-light)', width:'fit-content' }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding:'0.6rem 1.5rem', borderRadius:'10px', border:'none', cursor:'pointer', fontWeight:700, fontSize:'0.8rem', textTransform:'uppercase', letterSpacing:'0.05em', transition:'all 0.2s', background: tab===t ? 'var(--primary)' : 'transparent', color: tab===t ? 'white' : 'var(--text-muted)' }}>
            {t}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="card" style={{ background:'var(--bg-card)', border:'1px solid var(--border-light)', padding:'2rem' }}>
        {loading ? (
          <div style={{ textAlign:'center', padding:'3rem', color:'var(--text-muted)' }}>Loading...</div>
        ) : (

          /* ── USERS ── */
          tab === 'users' ? (
            <>
              <h3 style={{ marginBottom:'1.5rem', color:'var(--text-main)' }}>Registered Users ({users.length})</h3>
              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom:'1px solid var(--border-light)' }}>
                      {['Name','Email','Role','Joined','Actions'].map(h => (
                        <th key={h} style={{ textAlign:'left', padding:'0.75rem', fontSize:'0.7rem', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.08em' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u._id} style={{ borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding:'0.85rem', color:'var(--text-main)', fontWeight:600 }}>{u.name}</td>
                        <td style={{ padding:'0.85rem', color:'var(--text-muted)', fontSize:'0.85rem' }}>{u.email}</td>
                        <td style={{ padding:'0.85rem' }}>
                          <select value={u.role} onChange={e => updateRole(u._id, e.target.value)} disabled={u.role==='admin'} style={{ background:'rgba(255,255,255,0.05)', border:'1px solid var(--border-light)', color:'var(--text-main)', padding:'0.3rem 0.6rem', borderRadius:'6px', fontSize:'0.8rem', cursor: u.role==='admin' ? 'not-allowed' : 'pointer' }}>
                            <option value="customer">Customer</option>
                            <option value="staff">Staff</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td style={{ padding:'0.85rem', color:'var(--text-muted)', fontSize:'0.8rem' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td style={{ padding:'0.85rem' }}>
                          <button onClick={() => deleteUser(u._id)} disabled={u.role==='admin'} style={{ background: u.role==='admin' ? 'rgba(255,255,255,0.05)' : 'rgba(239,68,68,0.15)', color: u.role==='admin' ? 'var(--text-muted)' : '#ef4444', border:'none', padding:'0.35rem 0.75rem', borderRadius:'6px', cursor: u.role==='admin' ? 'not-allowed' : 'pointer', fontSize:'0.8rem' }}>
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) :

          /* ── ORDERS ── */
          tab === 'orders' ? (
            <>
              <h3 style={{ marginBottom:'1.5rem', color:'var(--text-main)' }}>All Orders ({orders.length})</h3>
              <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
                {orders.map(o => (
                  <div key={o._id} style={{ background:'rgba(255,255,255,0.02)', border:'1px solid var(--border-light)', borderRadius:'12px', padding:'1.25rem', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'1rem' }}>
                    <div>
                      <p style={{ fontWeight:700, color:'var(--text-main)', fontSize:'0.9rem', marginBottom:'0.25rem' }}>Order #{o._id.slice(-6).toUpperCase()}</p>
                      <p style={{ color:'var(--text-muted)', fontSize:'0.8rem', margin:0 }}>{o.user?.name} · {o.eatery?.name} · ₹{o.totalPrice}</p>
                      <p style={{ color:'var(--text-muted)', fontSize:'0.75rem', marginTop:'0.25rem' }}>{o.orderItems.map(i => `${i.qty}x ${i.name}`).join(', ')}</p>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
                      <span style={{ background:`${STATUS_COLORS[o.status]}20`, color:STATUS_COLORS[o.status], padding:'0.3rem 0.75rem', borderRadius:'999px', fontSize:'0.75rem', fontWeight:700, textTransform:'uppercase' }}>{o.status.replace(/-/g,' ')}</span>
                      <select value={o.status} onChange={e => updateOrderStatus(o._id, e.target.value)} style={{ background:'rgba(255,255,255,0.05)', border:'1px solid var(--border-light)', color:'var(--text-main)', padding:'0.4rem 0.75rem', borderRadius:'8px', fontSize:'0.8rem', cursor:'pointer' }}>
                        {['pending','preparing','out-for-delivery','delivered','cancelled'].map(s => <option key={s} value={s}>{s.replace(/-/g,' ')}</option>)}
                      </select>
                    </div>
                  </div>
                ))}
                {orders.length === 0 && <p style={{ color:'var(--text-muted)', textAlign:'center', padding:'2rem' }}>No orders yet.</p>}
              </div>
            </>
          ) :

          /* ── MENU ── */
          tab === 'menu' ? (
            <>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
                <h3 style={{ color:'var(--text-main)', margin:0 }}>Menu Items ({menu.length})</h3>
                <button onClick={() => setShowAddMenu(v => !v)} style={{ background:'var(--primary)', color:'white', border:'none', padding:'0.6rem 1.25rem', borderRadius:'var(--radius-full)', fontWeight:700, fontSize:'0.8rem', cursor:'pointer' }}>
                  {showAddMenu ? 'Cancel' : '+ Add Item'}
                </button>
              </div>

              {showAddMenu && (
                <form onSubmit={addMenuItem} style={{ background:'rgba(255,82,59,0.05)', border:'1px solid rgba(255,82,59,0.2)', borderRadius:'12px', padding:'1.5rem', marginBottom:'1.5rem', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
                  <div className="form-group" style={{ margin:0 }}>
                    <label style={{ color:'var(--text-muted)', fontSize:'0.7rem', textTransform:'uppercase' }}>Item Name *</label>
                    <input required value={newItem.name} onChange={e => setNewItem(p => ({...p, name:e.target.value}))} placeholder="e.g. Masala Dosa" style={{ color:'var(--text-main)', background:'rgba(255,255,255,0.05)', border:'1px solid var(--border-light)' }} />
                  </div>
                  <div className="form-group" style={{ margin:0 }}>
                    <label style={{ color:'var(--text-muted)', fontSize:'0.7rem', textTransform:'uppercase' }}>Price (₹) *</label>
                    <input required type="number" value={newItem.price} onChange={e => setNewItem(p => ({...p, price:e.target.value}))} placeholder="120" style={{ color:'var(--text-main)', background:'rgba(255,255,255,0.05)', border:'1px solid var(--border-light)' }} />
                  </div>
                  <div className="form-group" style={{ margin:0 }}>
                    <label style={{ color:'var(--text-muted)', fontSize:'0.7rem', textTransform:'uppercase' }}>Category *</label>
                    <input required value={newItem.category} onChange={e => setNewItem(p => ({...p, category:e.target.value}))} placeholder="e.g. Main Course" style={{ color:'var(--text-main)', background:'rgba(255,255,255,0.05)', border:'1px solid var(--border-light)' }} />
                  </div>
                  <div className="form-group" style={{ margin:0 }}>
                    <label style={{ color:'var(--text-muted)', fontSize:'0.7rem', textTransform:'uppercase' }}>Eatery *</label>
                    <select required value={newItem.eateryId} onChange={e => setNewItem(p => ({...p, eateryId:e.target.value}))} style={{ color:'var(--text-main)', background:'rgba(255,255,255,0.05)', border:'1px solid var(--border-light)', padding:'1rem 1.25rem', borderRadius:'var(--radius-sm)', width:'100%' }}>
                      <option value="">Select Eatery</option>
                      {eateries.map(e => <option key={e._id} value={e._id}>{e.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group" style={{ margin:0, gridColumn:'1/-1' }}>
                    <label style={{ color:'var(--text-muted)', fontSize:'0.7rem', textTransform:'uppercase' }}>Description</label>
                    <input value={newItem.description} onChange={e => setNewItem(p => ({...p, description:e.target.value}))} placeholder="Brief description..." style={{ color:'var(--text-main)', background:'rgba(255,255,255,0.05)', border:'1px solid var(--border-light)' }} />
                  </div>
                  <button type="submit" style={{ gridColumn:'1/-1', background:'var(--primary)', color:'white', border:'none', padding:'0.85rem', borderRadius:'var(--radius-full)', fontWeight:700, cursor:'pointer' }}>Save Menu Item</button>
                </form>
              )}

              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom:'1px solid var(--border-light)' }}>
                      {['Item','Category','Price','Eatery','Status',''].map(h => <th key={h} style={{ textAlign:'left', padding:'0.75rem', fontSize:'0.7rem', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.08em' }}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {menu.map(item => (
                      <tr key={item._id} style={{ borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding:'0.85rem', color:'var(--text-main)', fontWeight:600 }}>{item.name}</td>
                        <td style={{ padding:'0.85rem', color:'var(--text-muted)', fontSize:'0.85rem' }}>{item.category}</td>
                        <td style={{ padding:'0.85rem', color:'var(--primary)', fontWeight:700 }}>₹{item.price}</td>
                        <td style={{ padding:'0.85rem', color:'var(--text-muted)', fontSize:'0.85rem' }}>{item.eatery?.name || '—'}</td>
                        <td style={{ padding:'0.85rem' }}>
                          <span style={{ background: item.isAvailable ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: item.isAvailable ? '#10b981' : '#ef4444', padding:'0.2rem 0.6rem', borderRadius:'999px', fontSize:'0.7rem', fontWeight:700 }}>
                            {item.isAvailable ? 'Available' : 'Sold Out'}
                          </span>
                        </td>
                        <td style={{ padding:'0.85rem' }}>
                          <button onClick={() => deleteMenuItem(item._id)} style={{ background:'rgba(239,68,68,0.15)', color:'#ef4444', border:'none', padding:'0.35rem 0.75rem', borderRadius:'6px', cursor:'pointer', fontSize:'0.8rem' }}>
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) :

          /* ── EATERIES ── */
          (
            <>
              <h3 style={{ marginBottom:'1.5rem', color:'var(--text-main)' }}>Eateries ({eateries.length})</h3>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px,1fr))', gap:'1rem' }}>
                {eateries.map(e => (
                  <div key={e._id} style={{ background:'rgba(255,255,255,0.02)', border:'1px solid var(--border-light)', borderRadius:'12px', overflow:'hidden' }}>
                    <div style={{ height:'100px', backgroundImage:`url(${e.imageUrl})`, backgroundSize:'cover', backgroundPosition:'center' }} />
                    <div style={{ padding:'1rem' }}>
                      <p style={{ fontWeight:700, color:'var(--text-main)', marginBottom:'0.25rem' }}>{e.name}</p>
                      <p style={{ color:'var(--text-muted)', fontSize:'0.75rem', marginBottom:'0.75rem' }}>{e.type} · {e.priceRange} · ⭐{e.rating}</p>
                      <button onClick={() => deleteEatery(e._id)} style={{ background:'rgba(239,68,68,0.15)', color:'#ef4444', border:'none', padding:'0.35rem 0.85rem', borderRadius:'6px', cursor:'pointer', fontSize:'0.8rem', width:'100%' }}>
                        Delete Eatery
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )
        )}
      </div>
    </motion.section>
  );
}
