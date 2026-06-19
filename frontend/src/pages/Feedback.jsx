import { useState } from 'react';
import API from '../api/axios';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { MessageCircle, Star, Send } from 'lucide-react';

export default function Feedback() {
  const [form, setForm] = useState({ name: '', email: '', rating: 5, message: '' });
  const [hoveredStar, setHoveredStar] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const submit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.post('/feedback', {
        ...form,
        rating: Number(form.rating)
      });
      toast.success('Thank you for sharing your experience!');
      setForm({ name: '', email: '', rating: 5, message: '' });
    } catch (err) {
      toast.error('Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.section 
      className="container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ paddingTop: '6rem', paddingBottom: '8rem' }}
    >
      <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
        <h1 className="page-title">YOUR <span style={{ color: 'var(--primary)' }}>VOICE</span></h1>
        <p className="subtitle" style={{ margin: '0 auto' }}>Help us craft the perfect culinary discovery experience by sharing your thoughts.</p>
      </div>

      <div className="feedback-grid">
        <motion.div 
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          style={{ 
            background: 'rgba(255, 255, 255, 0.02)', 
            border: '1.5px solid var(--border-light)',
            backdropFilter: 'blur(10px)',
            padding: '4rem', 
            borderRadius: 'var(--radius-md)', 
            color: 'var(--text-main)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          <MessageCircle size={60} style={{ color: 'var(--primary)', marginBottom: '2rem' }} />
          <h2 style={{ fontSize: '2.5rem', lineHeight: 1.1 }}>WE'RE <br />LISTENING</h2>
          <p style={{ marginTop: '2rem', opacity: 0.8, fontSize: '0.95rem', lineHeight: 1.7 }}>
            At FoodSpot, we aim to eliminate fragmented search and bring local restaurants, cafes, and street food gems to your fingertips. Your suggestions help us improve location services, filter systems, and order integrations.
          </p>
          <div style={{ marginTop: '3rem', borderLeft: '2px solid var(--primary)', paddingLeft: '2rem' }}>
            <p style={{ fontStyle: 'italic', opacity: 0.9, fontSize: '1rem', lineHeight: 1.6 }}>
              "Good food is sweeter when shared, and great discovery is built together."
            </p>
          </div>
        </motion.div>

        <form 
          className="card" 
          onSubmit={submit} 
          style={{ 
            padding: '3.5rem', 
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-card)',
            color: 'var(--text-main)',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-lg)'
          }}
        >
          <div className="form-group">
            <label style={{ color: 'var(--text-main)' }}>NAME</label>
            <input 
              name="name" 
              value={form.name} 
              onChange={handleChange} 
              required 
              placeholder="YOUR NAME" 
              style={{ background: 'rgba(255,255,255,0.03)', color: 'white', border: '1px solid var(--border-light)' }}
            />
          </div>
          
          <div className="form-group">
            <label style={{ color: 'var(--text-main)' }}>EMAIL ADDRESS</label>
            <input 
              type="email" 
              name="email" 
              value={form.email} 
              onChange={handleChange} 
              required 
              placeholder="YOUR@EMAIL.COM" 
              style={{ background: 'rgba(255,255,255,0.03)', color: 'white', border: '1px solid var(--border-light)' }}
            />
          </div>
          
          <div className="form-group">
            <label style={{ color: 'var(--text-main)' }}>RATING</label>
            <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.25rem' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setForm(prev => ({ ...prev, rating: star }))}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.25rem 0.25rem 0.25rem 0',
                    transition: 'transform 0.2s ease',
                    transform: (hoveredStar || form.rating) >= star ? 'scale(1.15)' : 'scale(1)',
                  }}
                >
                  <Star
                    size={28}
                    fill={(hoveredStar || form.rating) >= star ? '#FBBF24' : 'none'}
                    color={(hoveredStar || form.rating) >= star ? '#FBBF24' : '#6b7280'}
                    strokeWidth={1.5}
                    style={{ transition: 'fill 0.2s ease, color 0.2s ease' }}
                  />
                </button>
              ))}
            </div>
          </div>
          
          <div className="form-group">
            <label style={{ color: 'var(--text-main)' }}>YOUR MESSAGE</label>
            <textarea 
              name="message" 
              value={form.message} 
              onChange={handleChange} 
              required 
              placeholder="SHARE YOUR EXPERIENCE..." 
              style={{ background: 'rgba(255,255,255,0.03)', color: 'white', border: '1px solid var(--border-light)' }}
            />
          </div>
          
          <button 
            type="submit" 
            className="btn-primary" 
            style={{ 
              width: '100%', 
              padding: '1.1rem', 
              borderRadius: 'var(--radius-full)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '0.75rem',
              marginTop: '1rem'
            }} 
            disabled={loading}
          >
            {loading ? 'SUBMITTING...' : <><Send size={18} /> SEND FEEDBACK</>}
          </button>
        </form>
      </div>
    </motion.section>
  );
}
