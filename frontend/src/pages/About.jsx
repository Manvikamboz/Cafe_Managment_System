import { motion } from 'framer-motion';

export default function About() {
  return (
    <motion.section 
      className="container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{ paddingTop: '6rem', paddingBottom: '8rem' }}
    >
      <div className="hero-mini" style={{ textAlign: 'center', marginBottom: '5rem' }}>
        <h1 className="page-title">Our Story</h1>
        <p className="subtitle">Driven by passion, defined by quality, powered by discovery.</p>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1.5fr 1fr', alignItems: 'stretch', gap: '3rem' }}>
        <div className="card" style={{ background: 'var(--bg-card)', color: 'var(--text-main)', border: '1px solid var(--border-light)' }}>
          <h2>Redefining Food Discovery</h2>
          <p style={{ margin: '1.5rem 0', lineHeight: 1.7 }}>
            FoodSpot began with a simple idea: to solve the common problem of fragmented food discovery. 
            Instead of switching between maps, social media reviews, and delivery portals, we built a single interface 
            where you can discover nearby cafes, restaurants, and hidden local street-food stalls.
          </p>
          <p style={{ lineHeight: 1.7 }}>
            We leverage geolocation queries, distance sorting (via Haversine calculations), and integrations like 
            the Swiggy Developer Portal to give food lovers the most convenient way to decide where to eat next.
          </p>
          
          <div style={{ display: 'flex', gap: '2rem', marginTop: '3rem' }}>
            <div>
              <h3 style={{ color: 'var(--primary)', fontSize: '2rem' }}>50+</h3>
              <p style={{ fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)' }}>Partner Spots</p>
            </div>
            <div>
              <h3 style={{ color: 'var(--primary)', fontSize: '2rem' }}>450+</h3>
              <p style={{ fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)' }}>Curated Dishes</p>
            </div>
            <div>
              <h3 style={{ color: 'var(--primary)', fontSize: '2rem' }}>10k+</h3>
              <p style={{ fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)' }}>Monthly Searches</p>
            </div>
          </div>
        </div>

        <div 
          className="card" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: 'rgba(255, 82, 59, 0.05)',
            border: '2px dashed var(--primary)',
            borderRadius: 'var(--radius-md)',
            padding: '3rem'
          }}
        >
          <p style={{ fontSize: '1.4rem', textAlign: 'center', color: 'var(--text-main)', fontStyle: 'italic', lineHeight: 1.6 }}>
            "Good food is the foundation of genuine happiness, and finding it should be effortless."
          </p>
        </div>
      </div>
    </motion.section>
  );
}
