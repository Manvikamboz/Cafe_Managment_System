import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back to the Café!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.section 
      className="container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '85vh' }}
    >
      <motion.div 
        className="card"
        initial={{ y: 20, scale: 0.98 }}
        animate={{ y: 0, scale: 1 }}
        style={{ 
          maxWidth: '480px', 
          width: '100%', 
          padding: '4rem 3rem',
          background: 'white',
          border: '1px solid #ddd',
          borderRadius: '4px'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ 
            background: 'var(--primary)',
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            color: 'white'
          }}>
            <LogIn size={28} />
          </div>
          <h2 className="playfair" style={{ fontSize: '2.5rem', color: 'var(--primary-dark)' }}>SIGN IN</h2>
          <p style={{ color: '#666', fontSize: '0.85rem', marginTop: '0.5rem', letterSpacing: '0.05em' }}>
            YOUR JOURNEY STARTS WITH A CUP
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label style={{ color: 'var(--primary-dark)', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.1em' }}>
              EMAIL ADDRESS
            </label>
            <input 
              type="email" 
              placeholder="YOUR@EMAIL.COM"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              style={{ borderRadius: '4px', border: '1px solid #ddd', background: '#fcfcfc' }}
            />
          </div>
          <div className="form-group">
            <label style={{ color: 'var(--primary-dark)', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.1em' }}>
              PASSWORD
            </label>
            <input 
              type="password" 
              placeholder="••••••••"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              style={{ borderRadius: '4px', border: '1px solid #ddd', background: '#fcfcfc' }}
            />
          </div>
          
          <button 
            type="submit" 
            className="btn-primary" 
            style={{ width: '100%', marginTop: '1.5rem', padding: '1.1rem', borderRadius: '4px' }}
            disabled={loading}
          >
            {loading ? 'SIGNING IN...' : 'CONTINUE'}
          </button>
        </form>

        <p style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '0.8rem', color: '#666' }}>
          NEW HERE? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 900, textDecoration: 'underline' }}>JOIN NOW</Link>
        </p>
      </motion.div>
    </motion.section>
  );
}
