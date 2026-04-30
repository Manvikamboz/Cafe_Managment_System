import { useState } from 'react';
import API from '../api/axios';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { MessageCircle, Star, Send } from 'lucide-react';

export default function Feedback() {
  const [form, setForm] = useState({ name: '', email: '', rating: '5', message: '' });
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
      setForm({ name: '', email: '', rating: '5', message: '' });
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
        <h1 className="page-title playfair">YOUR <span style={{ color: 'var(--primary)' }}>VOICE</span></h1>
        <p className="subtitle" style={{ margin: '0 auto' }}>Help us craft the perfect coffee experience by sharing your thoughts.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
        <motion.div 
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          style={{ background: 'var(--primary-dark)', padding: '4rem', borderRadius: '4px', color: 'white' }}
        >
          <MessageCircle size={60} style={{ color: 'var(--primary)', marginBottom: '2rem' }} />
          <h2 className="playfair" style={{ fontSize: '2.5rem', lineHeight: 1 }}>WE'RE <br />LISTENING</h2>
          <p style={{ marginTop: '2rem', opacity: 0.7, fontSize: '0.9rem' }}>
            At Smart Café, every detail matters. From the temperature of your brew to the 
            smile of our barista, we want to know how we did.
          </p>
          <div style={{ marginTop: '3rem', borderLeft: '2px solid var(--primary)', paddingLeft: '2rem' }}>
            <p style={{ fontStyle: 'italic', opacity: 0.9 }}>"A great cup of coffee starts with a great conversation."</p>
          </div>
        </motion.div>

        <form className="card" onSubmit={submit} style={{ padding: '3.5rem', borderRadius: '4px' }}>
          <div className="form-group">
            <label style={{ color: 'var(--primary-dark)', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.1em' }}>NAME</label>
            <input name="name" value={form.name} onChange={handleChange} required placeholder="YOUR NAME" style={{ borderRadius: '4px' }} />
          </div>
          <div className="form-group">
            <label style={{ color: 'var(--primary-dark)', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.1em' }}>EMAIL ADDRESS</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="YOUR@EMAIL.COM" style={{ borderRadius: '4px' }} />
          </div>
          <div className="form-group">
            <label style={{ color: 'var(--primary-dark)', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.1em' }}>RATING</label>
            <select name="rating" value={form.rating} onChange={handleChange} style={{ borderRadius: '4px' }}>
              <option value="5">★★★★★ EXCELLENT</option>
              <option value="4">★★★★ GOOD</option>
              <option value="3">★★★ AVERAGE</option>
              <option value="2">★★ POOR</option>
              <option value="1">★ VERY POOR</option>
            </select>
          </div>
          <div className="form-group">
            <label style={{ color: 'var(--primary-dark)', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.1em' }}>YOUR MESSAGE</label>
            <textarea name="message" rows="4" value={form.message} onChange={handleChange} required placeholder="SHARE YOUR EXPERIENCE..." style={{ borderRadius: '4px' }} />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1.1rem', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }} disabled={loading}>
            {loading ? 'SUBMITTING...' : <><Send size={18} /> SEND FEEDBACK</>}
          </button>
        </form>
      </div>
    </motion.section>
  );
}
