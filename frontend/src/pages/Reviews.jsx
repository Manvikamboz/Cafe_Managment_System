import { useEffect, useState } from 'react';
import API from '../api/axios';
import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await API.get('/reviews');
        setReviews(data);
      } catch (err) {
        console.error('Failed to fetch reviews');
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  return (
    <motion.section 
      className="container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ paddingTop: '6rem', paddingBottom: '10rem' }}
    >
      <div style={{ textAlign: 'center', marginBottom: '8rem' }}>
        <p style={{ letterSpacing: '0.2em', fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary-light)', marginBottom: '1rem' }}>
          THE COMMUNITY SPEAKS
        </p>
        <h1 className="page-title playfair">WALL OF <span style={{ color: 'var(--primary)' }}>LOVE</span></h1>
        <p className="subtitle" style={{ margin: '0 auto' }}>Discover why thousands of coffee lovers choose Smart Café every day.</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--primary-light)' }}>Gathering stories...</div>
      ) : (
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
          {reviews.length > 0 ? (
            reviews.map((review, i) => (
              <motion.div 
                key={review._id} 
                className="card"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                style={{ background: 'white', border: '1px solid #eee', borderRadius: '4px', position: 'relative' }}
              >
                <Quote size={40} style={{ position: 'absolute', top: '-20px', left: '20px', color: 'var(--primary)', opacity: 0.1 }} />
                <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem' }}>
                  {[...Array(5)].map((_, starI) => (
                    <Star 
                      key={starI} 
                      size={14} 
                      fill={starI < review.rating ? "var(--primary)" : "none"} 
                      color={starI < review.rating ? "var(--primary)" : "#ddd"} 
                    />
                  ))}
                </div>
                <p style={{ fontStyle: 'italic', color: 'var(--primary-dark)', fontSize: '1.1rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                  "{review.comment}"
                </p>
                <div style={{ borderTop: '1px solid #eee', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontWeight: 900, fontSize: '0.8rem', color: 'var(--primary-dark)' }}>{review.email.split('@')[0].toUpperCase()}</p>
                    <p style={{ fontSize: '0.7rem', color: '#999' }}>VERIFIED GUEST</p>
                  </div>
                  {review.menuItemId && (
                    <span style={{ fontSize: '0.65rem', background: '#f4f4f4', padding: '0.25rem 0.5rem', borderRadius: '2px', fontWeight: 700 }}>
                      REVIEWED ITEM
                    </span>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem', background: 'rgba(255,255,255,0.05)', color: 'white', borderRadius: '4px' }}>
              <h3>NO REVIEWS YET</h3>
              <p style={{ opacity: 0.6, marginTop: '1rem' }}>Be the first to share your experience!</p>
            </div>
          )}
        </div>
      )}
    </motion.section>
  );
}
