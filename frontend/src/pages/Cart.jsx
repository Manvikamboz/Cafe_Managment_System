import { useEffect, useState } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      const { data } = await API.get('/cart');
      setCart(data);
    } catch (err) {
      toast.error('Failed to load your basket');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (menuItemId, quantity) => {
    try {
      const { data } = await API.put('/cart/update', { menuItemId, quantity });
      setCart(data);
    } catch (err) {
      toast.error('Could not update quantity');
    }
  };

  const removeItem = async (itemId) => {
    try {
      const { data } = await API.delete(`/cart/remove/${itemId}`);
      setCart(data);
      toast.success('Item removed from basket');
    } catch (err) {
      toast.error('Failed to remove item');
    }
  };

  const checkout = async () => {
    if (!cart || cart.items.length === 0) return;
    
    try {
      const firstItem = cart.items[0];
      const eateryId = firstItem.menuItem.eatery?._id || firstItem.menuItem.eatery;
      
      if (!eateryId) {
        throw new Error('Eatery ID is missing for items');
      }

      const orderData = {
        orderItems: cart.items.map(item => ({
          name: item.menuItem.name,
          qty: item.quantity,
          price: item.menuItem.price,
          menuItem: item.menuItem._id
        })),
        totalPrice: cart.items.reduce((acc, item) => acc + item.quantity * item.menuItem.price, 0),
        eatery: eateryId
      };

      const { data } = await API.post('/orders', orderData);
      await API.delete('/cart/clear');
      toast.success('Order placed! Your meal is being prepared.');
      navigate(`/orders/track?id=${data._id}`);
    } catch (err) {
      console.error(err);
      toast.error('Checkout failed. Please try again.');
    }
  };

  if (!user) {
    return (
      <section className="container" style={{ paddingTop: '6rem' }}>
        <div className="card" style={{ textAlign: 'center', padding: '4rem', background: 'var(--bg-card)', color: 'var(--text-main)' }}>
          <ShoppingBag size={64} style={{ margin: '0 auto 1.5rem', opacity: 0.5, color: 'var(--primary)' }} />
          <h2>Your Basket is Empty</h2>
          <p style={{ opacity: 0.8, marginBottom: '2rem' }}>Please sign in to view your saved items and start your order.</p>
          <button className="btn-primary" onClick={() => navigate('/login')}>Sign In to Order</button>
        </div>
      </section>
    );
  }

  if (loading) return <div className="container" style={{ padding: '6rem', textAlign: 'center' }}>Preparing your basket...</div>;

  const total = cart?.items.reduce((acc, item) => acc + item.quantity * (item.menuItem?.price || 0), 0) || 0;

  return (
    <motion.section 
      className="container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ padding: '4rem 2rem' }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '3rem' }}>
        <h1 className="page-title" style={{ fontSize: '3rem', marginBottom: 0 }}>Your Basket</h1>
        <span style={{ color: 'var(--primary)', fontWeight: 600 }}>({cart?.items.length || 0} items)</span>
      </div>
      
      {!cart || cart.items.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '5rem', background: 'rgba(255,255,255,0.02)', color: 'var(--text-main)', border: '2px dashed var(--border-light)' }}>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>It looks like you haven't added anything yet.</p>
          <button className="btn-primary" onClick={() => navigate('/')}>Explore Food Spots</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '4rem' }}>
          <div className="cart-items">
            {cart.items.map(item => (
              <motion.div 
                layout
                key={item._id} 
                className="card" 
                style={{ 
                  display: 'flex', 
                  gap: '2rem', 
                  alignItems: 'center', 
                  marginBottom: '1.5rem',
                  padding: '1.5rem',
                  background: 'var(--bg-card)',
                  color: 'var(--text-main)',
                  border: '1px solid var(--border-light)'
                }}
              >
                <div style={{ 
                  width: '80px', 
                  height: '80px', 
                  background: 'rgba(255,255,255,0.05)', 
                  borderRadius: '12px',
                  backgroundImage: `url(${item.menuItem?.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80'})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }} />
                
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '1.2rem', color: 'var(--text-main)' }}>{item.menuItem?.name || 'Unknown Item'}</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                    From: {item.menuItem?.eatery?.name || 'Local Eatery'}
                  </p>
                  <p style={{ color: 'var(--primary)', fontWeight: 700 }}>₹{item.menuItem?.price.toFixed(2)}</p>
                </div>

                 <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-light)' }}>
                    <button 
                      onClick={() => updateQuantity(item.menuItem._id, item.quantity - 1)}
                      style={{ background: 'none', color: 'var(--text-main)', display: 'flex' }}
                    >
                      <Minus size={14} />
                    </button>
                    <span style={{ fontWeight: 700, minWidth: '20px', textAlign: 'center', color: 'var(--text-main)' }}>{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.menuItem._id, item.quantity + 1)}
                      style={{ background: 'none', color: 'var(--text-main)', display: 'flex' }}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => removeItem(item.menuItem._id)}
                    style={{ background: 'none', color: '#ef4444', transition: '0.2s' }}
                    className="hover-scale"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="cart-summary">
            <div className="card" style={{ position: 'sticky', top: '100px', background: 'var(--bg-card)', color: 'var(--text-main)', border: '1px solid var(--border-light)' }}>
              <h3 style={{ marginBottom: '2rem' }}>Order Summary</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', opacity: 0.8 }}>
                <span>Subtotal</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', opacity: 0.8 }}>
                <span>Delivery Charge</span>
                <span style={{ color: '#22c55e', fontWeight: 600 }}>FREE</span>
              </div>
              <div style={{ height: '1px', background: 'var(--border-light)', margin: '2rem 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem', fontWeight: 900, fontSize: '1.5rem' }}>
                <span>Total</span>
                <span style={{ color: 'var(--primary)' }}>₹{total.toFixed(2)}</span>
              </div>
              
              <button 
                className="btn-primary" 
                style={{ width: '100%', padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }} 
                onClick={checkout}
              >
                CHECKOUT NOW <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.section>
  );
}
