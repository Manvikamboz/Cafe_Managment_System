import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { User, ShoppingCart, ArrowRight } from 'lucide-react';

export default function Home() {
  const tickerItems = ["STARBUCKS", "STARBUCKS", "STARBUCKS", "STARBUCKS", "STARBUCKS", "STARBUCKS"];

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Hero Section */}
      <div className="container">
        <div className="hero">
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <p style={{ letterSpacing: '0.2em', fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary-light)', marginBottom: '1rem' }}>
              WHERE EVERY CUP TELLS A STORY
            </p>
            <h1 className="page-title">WHAT'S <span style={{ color: 'var(--primary)' }}>YOURS?</span></h1>
            <p className="subtitle">
              FRAPPUCCINO COFFEE DELIGHT<br />
              Indulge in the perfect blend of coffee and ice – the Frappuccino is your cool coffee escape. 
              Elevate your coffee moment with a creamy, icy Frappuccino delight.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginTop: '2rem' }}>
              <div>
                <p style={{ fontSize: '0.7rem', opacity: 0.6 }}>BEST RATING</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 900 }}>$8.6</p>
              </div>
              <Link to="/cookbook" className="btn-primary">ADD TO CART</Link>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', marginTop: '3rem' }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ width: '60px', height: '60px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px' }} />
              ))}
            </div>
          </motion.div>

          <motion.div 
            style={{ position: 'relative' }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div style={{ 
              width: '400px', 
              height: '400px', 
              background: 'var(--primary)', 
              borderRadius: '50% 50% 0 50%',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: -1
            }} />
            <img 
              src="/images/latte.png" 
              alt="Frappuccino" 
              style={{ width: '100%', filter: 'drop-shadow(0 30px 50px rgba(0,0,0,0.5))' }}
            />
            <div style={{ 
              position: 'absolute', 
              right: '-40px', 
              top: '50%', 
              transform: 'rotate(90deg)', 
              fontSize: '4rem', 
              fontWeight: 900, 
              opacity: 0.1,
              whiteSpace: 'nowrap'
            }}>
              FRAPPUCCINO
            </div>
          </motion.div>
        </div>
      </div>

      {/* Category Tabs Placeholder */}
      <div className="container" style={{ textAlign: 'center', margin: '4rem auto' }}>
        <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: 'var(--radius-full)' }}>
          {['DRINKS', 'FOOD', 'AT HOME', 'MERCHANDISE'].map((tab, i) => (
            <button 
              key={tab} 
              style={{ 
                padding: '0.75rem 2rem', 
                borderRadius: 'var(--radius-full)',
                background: i === 0 ? 'white' : 'transparent',
                color: i === 0 ? 'var(--primary-dark)' : 'white',
                fontWeight: 700,
                fontSize: '0.8rem'
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Unmatched Quality Section */}
      <div style={{ textAlign: 'center', padding: '6rem 0' }}>
        <h2 style={{ fontSize: '5rem', lineHeight: 0.8, marginBottom: '2rem' }}>UNMATCHED <br /> QUALITY</h2>
        <div className="ticker-wrap">
          <div className="ticker">
            {[...tickerItems, ...tickerItems].map((item, i) => (
              <span key={i} className="ticker-item">{item}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Section */}
      <div className="container" style={{ paddingBottom: '8rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4rem' }}>
          <span style={{ background: 'white', color: 'var(--primary-dark)', padding: '0.5rem 2rem', fontWeight: 900, borderRadius: '4px' }}>POPULAR</span>
        </div>
        
        <div className="grid">
          {[
            { name: 'Mocha Brew', price: '$7.50', img: '/images/mousse.png' },
            { name: 'Vanilla Latte', price: '$6.50', img: '/images/latte.png' },
            { name: 'Caramel Macchiato', price: '$8.00', img: '/images/latte.png' }
          ].map((item, i) => (
            <div key={i} className="menu-card">
              <div className="menu-image" style={{ backgroundImage: `url(${item.img})` }} />
              <h3>{item.name}</h3>
              <p className="price-tag">{item.price}</p>
              <button className="btn-primary" style={{ padding: '0.5rem 1.5rem', fontSize: '0.7rem' }}>ADD TO CART</button>
            </div>
          ))}
        </div>
      </div>

      {/* Branches Section */}
      <div style={{ background: '#0a1d18', padding: '6rem 0' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '4rem' }}>
          <div style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontSize: '3rem', fontWeight: 900, borderLeft: '2px solid var(--primary)', paddingLeft: '1rem' }}>
            OUR BRANCHES
          </div>
          <div className="grid">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="card" style={{ background: 'rgba(255,255,255,0.05)', color: 'white', padding: '1.5rem' }}>
                <div style={{ height: '100px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', marginBottom: '1rem' }} />
                <h4>NEW YORK</h4>
                <p style={{ fontSize: '0.7rem', opacity: 0.6 }}>123 Manhattan St, NY 10001</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer / Contact */}
      <div className="footer-dark">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
            <div className="card" style={{ background: 'white', color: 'var(--primary-dark)' }}>
              <h3>CONTACT</h3>
              <form style={{ marginTop: '2rem' }}>
                <input type="text" placeholder="NAME" style={{ width: '100%', padding: '1rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '4px' }} />
                <input type="email" placeholder="EMAIL" style={{ width: '100%', padding: '1rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '4px' }} />
                <button className="btn-primary" style={{ width: '100%' }}>SUBMIT</button>
              </form>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h2 style={{ fontSize: '3rem' }}>THANK YOU!</h2>
              <p style={{ opacity: 0.6 }}>Hang tight! We're coming your way soon!</p>
              <div style={{ 
                marginTop: '2rem', 
                width: '60px', 
                height: '60px', 
                background: 'var(--primary)', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'white'
              }}>
                <ArrowRight />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
