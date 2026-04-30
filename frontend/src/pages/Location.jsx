import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function Location() {
  return (
    <motion.section 
      className="container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="hero-mini">
        <h1 className="page-title playfair">Find Us</h1>
        <p className="subtitle">We're waiting for you in the heart of the city.</p>
      </div>

      <div className="grid">
        <div className="card">
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <MapPin color="var(--primary)" />
            <div>
              <h4 style={{ fontWeight: 600 }}>Address</h4>
              <p style={{ color: 'var(--text-muted)' }}>123 Culinary Ave, Food City, FC 45678</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <Phone color="var(--primary)" />
            <div>
              <h4 style={{ fontWeight: 600 }}>Phone</h4>
              <p style={{ color: 'var(--text-muted)' }}>+1 (555) 123-4567</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <Mail color="var(--primary)" />
            <div>
              <h4 style={{ fontWeight: 600 }}>Email</h4>
              <p style={{ color: 'var(--text-muted)' }}>hello@smartcafe.com</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <Clock color="var(--primary)" />
            <div>
              <h4 style={{ fontWeight: 600 }}>Hours</h4>
              <p style={{ color: 'var(--text-muted)' }}>Mon - Sun: 8:00 AM - 10:00 PM</p>
            </div>
          </div>
        </div>

        <div 
          className="card" 
          style={{ 
            background: '#e2e8f0', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            minHeight: '300px'
          }}
        >
          <p style={{ fontWeight: 600, color: '#64748b' }}>Interactive Map Placeholder</p>
        </div>
      </div>
    </motion.section>
  );
}
