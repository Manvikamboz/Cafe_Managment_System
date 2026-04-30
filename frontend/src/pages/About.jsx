import { motion } from 'framer-motion';

export default function About() {
  return (
    <motion.section 
      className="container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="hero-mini">
        <h1 className="page-title playfair">Our Story</h1>
        <p className="subtitle">Driven by passion, defined by quality.</p>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1.5fr 1fr', alignItems: 'center' }}>
        <div className="card">
          <h2>Redefining the Café Experience</h2>
          <p style={{ margin: '1rem 0' }}>
            Smart Café began with a simple idea: that great food and modern technology should go hand in hand. 
            We've built a space where you can enjoy artisanal coffee and gourmet meals with the convenience of 
            real-time tracking and seamless digital interactions.
          </p>
          <p>
            Our mission is to provide an unforgettable culinary journey, leveraging the power of the MERN stack 
            to ensure that your experience is as smooth as our signature espresso.
          </p>
          
          <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
            <div>
              <h3 style={{ color: 'var(--primary)', fontSize: '2rem' }}>5k+</h3>
              <p style={{ fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 600 }}>Happy Customers</p>
            </div>
            <div>
              <h3 style={{ color: 'var(--primary)', fontSize: '2rem' }}>25+</h3>
              <p style={{ fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 600 }}>Gourmet Dishes</p>
            </div>
            <div>
              <h3 style={{ color: 'var(--primary)', fontSize: '2rem' }}>12</h3>
              <p style={{ fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 600 }}>Expert Chefs</p>
            </div>
          </div>
        </div>

        <div 
          className="card" 
          style={{ 
            height: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #fef3c7 0%, #fffbeb 100%)',
            border: '2px dashed var(--primary)'
          }}
        >
          <p className="playfair" style={{ fontSize: '1.5rem', textAlign: 'center', color: 'var(--primary-dark)' }}>
            "Good food is the foundation of genuine happiness."
          </p>
        </div>
      </div>
    </motion.section>
  );
}
