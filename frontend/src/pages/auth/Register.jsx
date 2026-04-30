import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error('Passwords do not match');
    }
    setLoading(true);
    try {
      await register(name, email, password);
      toast.success('Welcome to the Smart Café Rewards!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.section 
      className="container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '85vh', padding: '3rem 1rem' }}
    >
      <motion.div 
        className="card"
        initial={{ y: 20, scale: 0.98 }}
        animate={{ y: 0, scale: 1 }}
        style={{ 
          maxWidth: '550px', 
          width: '100%', 
          padding: '4rem 3.5rem',
          background: 'white',
          border: '1px solid #ddd',
          borderRadius: '4px'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
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
            <UserPlus size={28} />
          </div>
          <h2 className="playfair" style={{ fontSize: '2.5rem', color: 'var(--primary-dark)' }}>JOIN US</h2>
          <p style={{ color: '#666', fontSize: '0.85rem', marginTop: '0.5rem', letterSpacing: '0.05em' }}>
            EARN REWARDS WITH EVERY SIP
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label style={{ color: 'var(--primary-dark)', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.1em' }}>
              FULL NAME
            </label>
            <input 
              type="text" 
              placeholder="JOHN DOE"
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              style={{ borderRadius: '4px', border: '1px solid #ddd', background: '#fcfcfc' }}
            />
          </div>
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
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
            <div className="form-group">
              <label style={{ color: 'var(--primary-dark)', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.1em' }}>
                CONFIRM
              </label>
              <input 
                type="password" 
                placeholder="••••••••"
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required 
                style={{ borderRadius: '4px', border: '1px solid #ddd', background: '#fcfcfc' }}
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            className="btn-primary" 
            style={{ width: '100%', marginTop: '1.5rem', padding: '1.1rem', borderRadius: '4px' }}
            disabled={loading}
          >
            {loading ? 'CREATING ACCOUNT...' : 'JOIN NOW'}
          </button>
        </form>

        <p style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '0.8rem', color: '#666' }}>
          ALREADY A MEMBER? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 900, textDecoration: 'underline' }}>SIGN IN</Link>
        </p>
      </motion.div>
    </motion.section>
  );
}
