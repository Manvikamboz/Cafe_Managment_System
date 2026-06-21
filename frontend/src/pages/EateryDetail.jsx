import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Star, DollarSign, Clock, ArrowLeft, Heart, MessageSquare, ExternalLink } from 'lucide-react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

export default function EateryDetail() {
  const { id } = useParams();
  const { user, refreshUser } = useAuth();
  
  // States
  const [eatery, setEatery] = useState(null);
  const [menu, setMenu] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Review Form States
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchEateryDetails();
    if (user) {
      setEmail(user.email || '');
      setUserName(user.name || '');
    }
  }, [id, user]);

  const fetchEateryDetails = async () => {
    setLoading(true);
    try {
      // 1. Get eatery
      const resEatery = await API.get(`/eateries/${id}`);
      setEatery(resEatery.data);

      // 2. Get menu items for eatery
      const resMenu = await API.get(`/menu?eateryId=${id}`);
      setMenu(resMenu.data);

      // 3. Get reviews for eatery
      const resReviews = await API.get(`/reviews?eateryId=${id}`);
      setReviews(resReviews.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load eatery details');
    } finally {
      setLoading(false);
    }
  };



  const submitReview = async (e) => {
    e.preventDefault();
    if (!comment.trim() || !email.trim()) {
      return toast.error('Please fill in email and comment');
    }
    setSubmittingReview(true);
    try {
      const { data } = await API.post('/reviews', {
        eateryId: id,
        email,
        userName,
        rating,
        comment
      });
      toast.success('Review posted successfully!');
      
      // Update reviews list and recalculate eatery rating locally
      setReviews(prev => [data, ...prev]);
      setComment('');
      
      // Reload eatery details to get updated average rating
      const resEatery = await API.get(`/eateries/${id}`);
      setEatery(resEatery.data);
    } catch (err) {
      toast.error('Failed to post review');
    } finally {
      setSubmittingReview(false);
    }
  };

  // Saved / Favorited Status
  const toggleFavorite = async () => {
    if (!user) return toast.error('Please log in to save spots');
    try {
      const { data } = await API.post(`/eateries/${id}/favorite`);
      toast.success(data.message);
      await refreshUser(); // Re-fetch user profile from DB
    } catch (err) {
      toast.error('Failed to save spot');
    }
  };

  const isFavorite = () => {
    if (!user || !user.favorites) return false;
    return user.favorites.some(fav => (fav._id || fav) === id);
  };



  if (loading) {
    return (
      <div className="loader-container" style={{ minHeight: '80vh' }}>
        <div className="spinner"></div>
        <p>Fetching menus, coordinates, and local reviews...</p>
      </div>
    );
  }

  if (!eatery) {
    return (
      <div className="container" style={{ paddingTop: '6rem', textAlign: 'center' }}>
        <h2>Eatery not found</h2>
        <Link to="/" className="btn-secondary" style={{ marginTop: '2rem', display: 'inline-flex', gap: '0.5rem', alignItems: 'center' }}>
          <ArrowLeft size={16} /> Back to discover
        </Link>
      </div>
    );
  }

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="eatery-detail-page"
    >
      {/* Top Banner and Navigation */}
      <div className="detail-banner" style={{ backgroundImage: `url(${eatery.imageUrl})` }}>
        <div className="banner-overlay"></div>
        <div className="container banner-inner">
          <Link to="/" className="back-link">
            <ArrowLeft size={18} />
            <span>Discover Spots</span>
          </Link>
          
          <button 
            className={`fav-btn-action ${isFavorite() ? 'active' : ''}`}
            onClick={toggleFavorite}
          >
            <Heart size={20} fill={isFavorite() ? 'currentColor' : 'none'} />
            <span>{isFavorite() ? 'Saved' : 'Save Spot'}</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container detail-content-grid">
        {/* Left Column: Details & Menu */}
        <div className="details-left">
          {/* Header Info */}
          <div className="spot-header-card card">
            <div className="header-top-row">
              <span className={`detail-type-tag ${eatery.type}`}>{eatery.type}</span>
              <div className="detail-rating">
                <Star size={16} fill="currentColor" />
                <strong>{eatery.rating.toFixed(1)}</strong>
                <span>({reviews.length} reviews)</span>
              </div>
            </div>

            <h1 className="detail-title-name">{eatery.name}</h1>
            <p className="detail-desc-text">{eatery.description}</p>

            <div className="detail-cuisines">
              {eatery.cuisine.map((c, i) => (
                <span key={i} className="detail-cuisine-badge">{c}</span>
              ))}
            </div>

            <div className="detail-meta-grid">
              <div className="meta-card">
                <Clock size={18} className="meta-icon" />
                <div>
                  <h5>Hours</h5>
                  <p>{eatery.operatingHours}</p>
                </div>
              </div>

              <div className="meta-card">
                <DollarSign size={18} className="meta-icon" />
                <div>
                  <h5>Pricing</h5>
                  <p>₹{eatery.costForTwo} for two ({eatery.priceRange})</p>
                </div>
              </div>

              <div className="meta-card">
                <MapPin size={18} className="meta-icon" />
                <div>
                  <h5>Address</h5>
                  <p>{eatery.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Google Maps Location Card */}
          <div className="google-map-card card" style={{ marginTop: '1.5rem', overflow: 'hidden', padding: '0' }}>
            <div className="card-header-map" style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={18} style={{ color: 'var(--primary)' }} />
                <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600', color: 'white' }}>Find on Google Maps</h4>
              </div>
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(eatery.name + ' ' + eatery.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-map-link"
                style={{ fontSize: '0.85rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.25rem', textDecoration: 'none' }}
              >
                <span>Open in Maps</span>
                <ExternalLink size={12} />
              </a>
            </div>
            <div className="map-iframe-container" style={{ width: '100%', height: '280px', background: '#1a1a24' }}>
              <iframe
                title="Google Maps Location"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) grayscale(10%) contrast(90%)' }}
                loading="lazy"
                allowFullScreen
                src={`https://maps.google.com/maps?q=${encodeURIComponent(eatery.name + ' ' + eatery.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
              ></iframe>
            </div>
          </div>

          {/* Menu Sections */}
          <div className="menu-container-section">
            <h2 className="section-heading-title">Handcrafted Menu</h2>
            {menu.length === 0 ? (
              <div className="card empty-menu">
                <p>No menu items available for this eatery yet.</p>
              </div>
            ) : (
              <div className="menu-list-rows">
                {menu.map((item) => (
                  <div key={item._id} className="menu-row-card card">
                    <div 
                      className="menu-row-image" 
                      style={{ backgroundImage: `url(${item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80'})` }}
                    />
                    <div className="menu-row-info">
                      <div className="menu-row-header">
                        <h4>{item.name}</h4>
                        <span className="menu-row-price">₹{item.price}</span>
                      </div>
                      <p className="menu-row-desc">{item.description}</p>
                      <span className="menu-row-cat-badge">{item.category}</span>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Swiggy Redirection & Review Posting */}
        <div className="details-right">


          {/* Add Review Form */}
          <div className="add-review-card card">
            <h4>Leave a Testimonial</h4>
            <form onSubmit={submitReview} className="review-form">
              <div className="form-group">
                <label>Reviewer Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Rahul Sharma"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Email Address *</label>
                <input 
                  type="email" 
                  placeholder="e.g. rahul@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Rating (Out of 5 Stars)</label>
                <div className="stars-rating-selector">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      className={`star-select-btn ${star <= rating ? 'selected' : ''}`}
                      onClick={() => setRating(star)}
                    >
                      <Star size={24} fill={star <= rating ? 'currentColor' : 'none'} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Your Review *</label>
                <textarea 
                  placeholder="Tell us about the popular dishes, taste, and experience..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                />
              </div>

              <button 
                type="submit" 
                className="btn-primary" 
                style={{ width: '100%' }}
                disabled={submittingReview}
              >
                {submittingReview ? 'Submitting...' : 'Post Testimonial'}
              </button>
            </form>
          </div>

          {/* Eatery Testimonials */}
          <div className="reviews-section-panel">
            <div className="reviews-header-row">
              <h3>Community Testimonials</h3>
              <span className="reviews-count">{reviews.length} total</span>
            </div>

            {reviews.length === 0 ? (
              <div className="card no-reviews">
                <MessageSquare size={24} />
                <p>Be the first to review this eatery!</p>
              </div>
            ) : (
              <div className="reviews-list-stack">
                {reviews.map((rev) => (
                  <div key={rev._id} className="review-comment-card card">
                    <div className="review-comment-header">
                      <div>
                        <h5>{rev.userName || 'Anonymous Foodie'}</h5>
                        <span className="review-date">{new Date(rev.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="review-comment-stars">
                        <Star size={12} fill="currentColor" />
                        <span>{rev.rating}</span>
                      </div>
                    </div>
                    <p className="review-comment-body">{rev.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>


    </motion.section>
  );
}
