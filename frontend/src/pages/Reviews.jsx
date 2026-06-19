import { useEffect, useState } from 'react';
import API from '../api/axios';
import { Star, Quote, Utensils } from 'lucide-react';
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
      <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
        <p style={{ letterSpacing: '0.25em', fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '1rem', textTransform: 'uppercase' }}>
          THE FOODIE COMMUNITY SPEAKS
        </p>
        <h1 className="page-title">WALL OF <span style={{ color: 'var(--primary)' }}>FAME</span></h1>
        <p className="subtitle" style={{ margin: '0 auto' }}>Discover why thousands of food lovers choose FoodSpot to discover local gems every day.</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--primary)' }}>Gathering culinary stories...</div>
      ) : (
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
          {reviews.length > 0 ? (
            reviews.map((review, i) => (
              <motion.div 
                key={review._id} 
                className="card"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                style={{ 
                  background: 'var(--bg-card)', 
                  border: '1px solid var(--border-light)', 
                  borderRadius: 'var(--radius-md)', 
                  position: 'relative',
                  color: 'var(--text-main)',
                  padding: '2.5rem'
                }}
              >
                <Quote size={40} style={{ position: 'absolute', top: '-15px', left: '20px', color: 'var(--primary)', opacity: 0.15 }} />
                
                <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem' }}>
                  {[...Array(5)].map((_, starI) => (
                    <Star 
                      key={starI} 
                      size={14} 
                      fill={starI < review.rating ? "var(--primary)" : "none"} 
                      color={starI < review.rating ? "var(--primary)" : "#4b5563"} 
                    />
                  ))}
                </div>
                
                <p style={{ fontStyle: 'italic', color: 'var(--text-main)', fontSize: '1.05rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                  "{review.comment}"
                </p>
                
                <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-main)' }}>
                      {review.userName || review.email.split('@')[0].toUpperCase()}
                    </p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>VERIFIED FOODIE</p>
                  </div>
                  {review.eateryId && (
                    <span style={{ 
                      fontSize: '0.65rem', 
                      background: 'rgba(255, 82, 59, 0.1)', 
                      color: 'var(--primary)', 
                      padding: '0.35rem 0.75rem', 
                      borderRadius: 'var(--radius-full)', 
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}>
                      <Utensils size={10} />
                      {review.eateryId.name || 'EATERY'}
                    </span>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '5rem', background: 'var(--bg-card)', color: 'var(--text-main)', border: '2px dashed var(--border-light)' }}>
              <h3>No reviews yet</h3>
              <p style={{ opacity: 0.6, marginTop: '1rem' }}>Be the first to share your experience!</p>
            </div>
          )}
        </div>
      )}
    </motion.section>
  );
}
