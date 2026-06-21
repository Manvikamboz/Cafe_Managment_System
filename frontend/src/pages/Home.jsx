import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Search, Star, DollarSign, Heart, Clock, Compass, PhoneCall } from 'lucide-react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

export default function Home() {
  const { user, refreshUser } = useAuth();
  
  // States
  const [eateries, setEateries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState(''); // restaurant, cafe, street-food
  const [selectedBudget, setSelectedBudget] = useState(''); // $, $$, $$$
  const [selectedCuisine, setSelectedCuisine] = useState('');
  
  // Location States
  const [userLocation, setUserLocation] = useState(() => {
    const saved = sessionStorage.getItem('userLocation');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      lat: 28.6304, // New Delhi Default
      lng: 77.2177,
      name: 'Connaught Place, New Delhi (Default)'
    };
  });
  const [gpsLoading, setGpsLoading] = useState(false);

  const cuisines = ['All Cuisines', 'Italian', 'South Indian', 'Chinese', 'Street Food', 'Beverages', 'Dessert'];

  // Auto-request location on very first load of the site
  useEffect(() => {
    if (!sessionStorage.getItem('userLocation')) {
      detectGPSLocation();
    }
  }, []);

  // Save location to sessionStorage on change
  useEffect(() => {
    sessionStorage.setItem('userLocation', JSON.stringify(userLocation));
  }, [userLocation]);

  useEffect(() => {
    fetchEateries();
  }, [userLocation, selectedType, selectedBudget, selectedCuisine]);

  const fetchEateries = async () => {
    setLoading(true);
    try {
      let url = `/eateries?userLat=${userLocation.lat}&userLng=${userLocation.lng}`;
      if (selectedType) url += `&type=${selectedType}`;
      if (selectedBudget) url += `&priceRange=${selectedBudget}`;
      if (selectedCuisine && selectedCuisine !== 'All Cuisines') url += `&cuisine=${selectedCuisine}`;
      if (searchQuery) url += `&q=${searchQuery}`;
      
      const { data } = await API.get(url);
      setEateries(data);
    } catch (err) {
      console.error(err);
      toast.error('Could not load eateries. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchEateries();
  };

  // Browser Geolocation Detector
  const detectGPSLocation = () => {
    if (!navigator.geolocation) {
      return toast.error('Geolocation is not supported by your browser.');
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        let name = 'Your GPS Coordinates';
        
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`, {
            headers: { 'User-Agent': 'FoodSpotApp' }
          });
          if (res.ok) {
            const data = await res.json();
            if (data && data.display_name) {
              // Get the first three components (e.g. Neighborhood, City, State)
              name = data.display_name.split(',').slice(0, 3).join(', ');
            }
          }
        } catch (err) {
          console.error('Reverse geocoding failed:', err);
        }

        setUserLocation({ lat, lng, name });
        setGpsLoading(false);
        toast.success('Location updated via GPS!');
      },
      (error) => {
        console.error(error);
        setGpsLoading(false);
        toast.error('Unable to retrieve location. Using default simulation.');
      }
    );
  };

  // Toggle Save/Favorite Eatery
  const toggleFavorite = async (eateryId) => {
    if (!user) {
      return toast.error('Please log in to save your favorite food spots.');
    }
    try {
      const { data } = await API.post(`/eateries/${eateryId}/favorite`);
      toast.success(data.message);
      await refreshUser(); // Re-fetch user profile from DB
    } catch (err) {
      toast.error('Failed to toggle favorite.');
    }
  };

  const isFav = (eateryId) => {
    if (!user || !user.favorites) return false;
    return user.favorites.some(fav => (fav._id || fav) === eateryId);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="discover-container"
    >
      {/* Search & Brand Banner */}
      <section className="discover-hero">
        <div className="container">
          <div className="hero-content">
            <motion.div
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              style={{ textAlign: 'center' }}
            >
              <span className="hero-badge">Smart Location Discovery</span>
              <h1 className="hero-title">Find Local Gems & Famous <span className="gradient-text">Food Spots</span></h1>
              <p className="hero-subtitle">
                Explore local eateries, check menu highlights, see ratings, and discover the best spots to visit near you.
              </p>
            </motion.div>

            {/* Premium Interactive Search Bar */}
            <form onSubmit={handleSearchSubmit} className="search-form-card">
              <div className="search-input-group">
                <Search className="search-icon" size={20} />
                <input 
                  type="text" 
                  placeholder="Search by restaurant name, dish, or cuisine..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="search-btn">Search</button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Proximity & Location simulation panel */}
      <section className="location-simulator-section">
        <div className="container">
          <div className="simulator-grid card">
            <div className="location-info-bar">
              <div className="loc-title-group">
                <MapPin className="pin-icon pulsing" size={24} />
                <div>
                  <h4>Current Location:</h4>
                  <p className="loc-name">{userLocation.name}</p>
                  <span className="loc-coords">({userLocation.lat.toFixed(4)}° N, {userLocation.lng.toFixed(4)}° E)</span>
                </div>
              </div>
              <button 
                onClick={detectGPSLocation} 
                disabled={gpsLoading}
                className="gps-btn"
              >
                {gpsLoading ? 'Detecting...' : 'Detect My GPS'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Filter and Content section */}
      <section className="discover-body">
        <div className="container">
          {/* Filtering controls */}
          <div className="filter-panel">
            {/* Eatery Type filters */}
            <div className="filter-group-row">
              <span className="group-label">Eatery Type:</span>
              <div className="tabs-row">
                <button 
                  className={`tab-btn ${selectedType === '' ? 'active' : ''}`}
                  onClick={() => setSelectedType('')}
                >
                  All Spots
                </button>
                <button 
                  className={`tab-btn ${selectedType === 'restaurant' ? 'active' : ''}`}
                  onClick={() => setSelectedType('restaurant')}
                >
                  Restaurants
                </button>
                <button 
                  className={`tab-btn ${selectedType === 'cafe' ? 'active' : ''}`}
                  onClick={() => setSelectedType('cafe')}
                >
                  Cafés
                </button>
                <button 
                  className={`tab-btn ${selectedType === 'street-food' ? 'active' : ''}`}
                  onClick={() => setSelectedType('street-food')}
                >
                  Street Food
                </button>
              </div>
            </div>

            <div className="bottom-filters-row">
              {/* Cuisine filters */}
              <div className="select-wrapper">
                <Compass size={16} className="select-icon" />
                <select 
                  value={selectedCuisine} 
                  onChange={(e) => setSelectedCuisine(e.target.value)}
                >
                  {cuisines.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Price / Budget filters */}
              <div className="budget-toggles">
                <span className="group-label">Budget:</span>
                <div className="budget-btn-group">
                  <button 
                    className={`budget-btn ${selectedBudget === '' ? 'active' : ''}`}
                    onClick={() => setSelectedBudget('')}
                  >
                    All
                  </button>
                  <button 
                    className={`budget-btn ${selectedBudget === '$' ? 'active' : ''}`}
                    onClick={() => setSelectedBudget('$')}
                    title="Budget ($)"
                  >
                    $
                  </button>
                  <button 
                    className={`budget-btn ${selectedBudget === '$$' ? 'active' : ''}`}
                    onClick={() => setSelectedBudget('$$')}
                    title="Moderate ($$)"
                  >
                    $$
                  </button>
                  <button 
                    className={`budget-btn ${selectedBudget === '$$$' ? 'active' : ''}`}
                    onClick={() => setSelectedBudget('$$$')}
                    title="Premium ($$$)"
                  >
                    $$$
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Eateries Grid */}
          {loading ? (
            <div className="loader-container">
              <div className="spinner"></div>
              <p>Scanning food spots near you...</p>
            </div>
          ) : eateries.length === 0 ? (
            <div className="empty-state card">
              <Compass size={48} style={{ color: 'var(--primary)' }} />
              <h3>No Food Spots Found</h3>
              <p>Try broadening your filters, changing your simulated location, or searching for something else.</p>
              <button 
                className="btn-primary" 
                onClick={() => {
                  setSelectedType('');
                  setSelectedBudget('');
                  setSelectedCuisine('');
                  setSearchQuery('');
                  setUserLocation({ lat: 28.6304, lng: 77.2177, name: 'Connaught Place, New Delhi (Default)' });
                }}
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="spots-grid">
              {eateries.map((eatery) => (
                <motion.article 
                  key={eatery._id}
                  className="spot-card card"
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="card-image-wrap" style={{ backgroundImage: `url(${eatery.imageUrl})` }}>
                    <div className="gradient-overlay"></div>
                    <button 
                      className={`favorite-btn ${isFav(eatery._id) ? 'favactive' : ''}`}
                      onClick={() => toggleFavorite(eatery._id)}
                      title="Save to favorites"
                    >
                      <Heart size={18} fill={isFav(eatery._id) ? 'currentColor' : 'none'} />
                    </button>
                    {eatery.distance !== undefined && (
                      <span className="distance-tag">
                        {eatery.distance} km away
                      </span>
                    )}
                    <span className={`type-tag ${eatery.type}`}>
                      {eatery.type === 'street-food' ? 'Street Food' : eatery.type}
                    </span>
                  </div>

                  <div className="card-body-content">
                    <div className="title-row">
                      <h3 className="spot-name">{eatery.name}</h3>
                      <div className="rating-badge">
                        <Star size={14} fill="currentColor" />
                        <span>{eatery.rating.toFixed(1)}</span>
                      </div>
                    </div>

                    <div className="address-row" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.8rem', margin: '0.4rem 0 0.6rem 0' }}>
                      <MapPin size={13} style={{ flexShrink: 0, color: 'var(--primary)' }} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{eatery.address}</span>
                    </div>

                    <p className="spot-desc">{eatery.description}</p>
                    
                    <div className="cuisines-tags">
                      {eatery.cuisine.map((c, i) => (
                        <span key={i} className="cuisine-badge">{c}</span>
                      ))}
                    </div>

                    <div className="spot-meta-details">
                      <div className="meta-item">
                        <Clock size={14} />
                        <span>{eatery.operatingHours}</span>
                      </div>
                      <div className="meta-item cost-item">
                        <DollarSign size={14} />
                        <span>₹{eatery.costForTwo} for two ({eatery.priceRange})</span>
                      </div>
                    </div>

                    <div className="dishes-highlights">
                      <strong>Popular:</strong> {eatery.popularDishes.join(', ')}
                    </div>

                    <div className="card-actions-row">
                      <Link to={`/eatery/${eatery._id}`} className="btn-details">
                        View Menu & Details
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>
    </motion.div>
  );
}
