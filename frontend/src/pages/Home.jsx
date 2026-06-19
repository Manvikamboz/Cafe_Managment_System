import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Search, Star, DollarSign, Heart, Clock, Compass, PhoneCall } from 'lucide-react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

export default function Home() {
  const { user, setUser } = useAuth();
  
  // States
  const [eateries, setEateries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState(''); // restaurant, cafe, street-food
  const [selectedBudget, setSelectedBudget] = useState(''); // $, $$, $$$
  const [selectedCuisine, setSelectedCuisine] = useState('');
  
  // Location States
  const [userLocation, setUserLocation] = useState({
    lat: 12.9716, // Bangalore Center Default
    lng: 77.5946,
    name: 'MG Road, Bangalore (Default)'
  });
  const [gpsLoading, setGpsLoading] = useState(false);

  // Preset location simulations for testing
  const presets = [
    { name: 'MG Road (Center)', lat: 12.9716, lng: 77.5946 },
    { name: 'Indiranagar', lat: 12.9750, lng: 77.5990 },
    { name: 'Koramangala', lat: 12.9690, lng: 77.5890 },
    { name: 'Jayanagar', lat: 12.9620, lng: 77.6010 }
  ];

  const cuisines = ['All Cuisines', 'Italian', 'South Indian', 'Chinese', 'Street Food', 'Beverages', 'Dessert'];

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
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          name: 'Your GPS Coordinates'
        });
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
      
      // Update local user state
      const updatedUser = { ...user, favorites: data.favorites };
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));
      // Re-trigger auth context state update if component listening
      if (setUser) setUser(updatedUser);
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
                Explore local eateries, check menu highlights, see ratings, and order directly or redirect to Swiggy.
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
            
            <div className="presets-group">
              <span className="presets-label">Simulate Proximity:</span>
              <div className="presets-list">
                {presets.map((preset) => (
                  <button
                    key={preset.name}
                    className={`preset-tag ${userLocation.name.includes(preset.name) ? 'active' : ''}`}
                    onClick={() => setUserLocation({ lat: preset.lat, lng: preset.lng, name: preset.name + ', Bangalore' })}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
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
                  setUserLocation({ lat: 12.9716, lng: 77.5946, name: 'MG Road, Bangalore (Default)' });
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
