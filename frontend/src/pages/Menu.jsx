import { useEffect, useState } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function Menu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const { data } = await API.get('/menu');
      setItems(data);
    } catch (err) {
      setError('Unable to load our seasonal collection.');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (id) => {
    if (!user) {
      return toast.error('Please sign in to order your brew');
    }
    try {
      await API.post('/cart/add', { menuItemId: id, quantity: 1 });
      toast.success('Added to your basket');
    } catch (err) {
      toast.error('Failed to add item');
    }
  };

  return (
    <motion.section 
      className="container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ paddingTop: '4rem', paddingBottom: '8rem' }}
    >
      <div className="hero-mini" style={{ textAlign: 'center', marginBottom: '6rem' }}>
        <p style={{ letterSpacing: '0.2em', fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary-light)', marginBottom: '1rem' }}>
          HANDCRAFTED FOR YOU
        </p>
        <h1 className="page-title playfair" style={{ fontSize: '4rem' }}>The <span style={{ color: 'var(--primary)' }}>Collection</span></h1>
        <p className="subtitle" style={{ margin: '0 auto' }}>Explore our signature blends, seasonal treats, and artisanal pastries.</p>
      </div>

      {loading && <div style={{ textAlign: 'center', padding: '5rem', fontSize: '1.2rem', color: 'var(--primary-light)' }}>Preparing our finest selections...</div>}
      
      {error && (
        <div className="card" style={{ background: '#fee2e2', color: '#b91c1c', textAlign: 'center', margin: '2rem auto', maxWidth: '500px' }}>
          {error}
        </div>
      )}
      
      <div className="grid">
        {items.map(item => (
          <article key={item._id} className="menu-card">
            <div 
              className="menu-image" 
              style={{ 
                backgroundImage: `url(${item.imageUrl || '/images/latte.png'})`,
                height: '240px'
              }}
            />
            <div className="menu-info" style={{ padding: '0' }}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--primary)', border: '1px solid var(--primary)', padding: '0.1rem 0.6rem', borderRadius: '4px' }}>
                  {item.category.toUpperCase()}
                </span>
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 900 }}>{item.name}</h3>
              <p className="description" style={{ fontSize: '0.8rem', color: '#666', margin: '1rem 0' }}>{item.description}</p>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <span className="price-tag" style={{ margin: 0 }}>${item.price.toFixed(2)}</span>
                <button 
                  className="btn-primary" 
                  style={{ width: '100%', padding: '0.75rem', fontSize: '0.8rem' }}
                  onClick={() => addToCart(item._id)}
                  disabled={!item.isAvailable}
                >
                  {item.isAvailable ? 'ADD TO BASKET' : 'OUT OF STOCK'}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </motion.section>
  );
}
