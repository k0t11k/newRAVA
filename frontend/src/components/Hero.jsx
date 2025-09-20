import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { CalendarIcon, MapPinIcon, CurrencyDollarIcon } from './Icons';

const Hero = ({ events, user, setCart, setShowAuthModal, setTickets, backend }) => {
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const categories = ['All', 'Concert', 'Theater', 'Comedy', 'Festival', 'Conference', 'Exhibition'];
  const [loadedEvents, setLoadedEvents] = useState([]);

  useEffect(() => {
    if (backend) {
      backend.get_events().then(setLoadedEvents);
    } else {
      setLoadedEvents(events);
    }
  }, [backend, events]);

  const featuredEvents = useMemo(() => loadedEvents.filter(event => ['1', '2', '3'].includes(event.id)), [loadedEvents]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = loadedEvents.filter(e => 
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) || e.city.toLowerCase().includes(searchQuery.toLowerCase())
      ).map(e => e.title);
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  }, [searchQuery, loadedEvents]);

  const handleAddToCart = useCallback((event) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setCart(prev => {
      const existing = prev.find(item => item.id === event.id);
      if (existing) {
        return prev.map(item => item.id === event.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { id: event.id, title: event.title, price: parseInt(event.price_range.split('-')[0]), quantity: 1 }];
    });
  }, [user, setCart, setShowAuthModal]);

  const handleBuyNow = useCallback(async (event) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    if (backend) {
      const price = parseInt(event.price_range.split('-')[0]);
      const ticket = await backend.buy_ticket(event.id, price);
      setTickets(prev => [...prev, ticket]);
      alert(`Ticket purchased! QR: ${ticket.qr_code}`);
    } else {
      // Заглушка
      setTickets(prev => [...prev, { id: `${event.id}-${Date.now()}`, qr_code: `qr-${event.id}` }]);
    }
  }, [user, backend, setTickets, setShowAuthModal]);

  const filteredFeatured = useMemo(() => 
    featuredEvents.filter(e => filterCategory === 'All' || e.category === filterCategory)
      .filter(e => !searchQuery || e.title.toLowerCase().includes(searchQuery.toLowerCase()) || e.city.toLowerCase().includes(searchQuery.toLowerCase()))
  , [featuredEvents, filterCategory, searchQuery]);

  return (
    <div className="space-y-12">
      {/* Promotional Banner */}
      <section className="bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] py-4 px-4 sm:px-6 md:px-8 text-center">
        <div className="max-w-7xl mx-auto">
          <p className="text-lg sm:text-xl font-semibold text-white mb-2">Limited Time Offer: Get 10% off your first ticket!</p>
          <Link to="/events" className="button inline-block">Shop Now</Link>
        </div>
      </section>
      {/* Hero Section */}
      <section className="relative min-h-[60vh] sm:min-h-[70vh] md:min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-r from-[rgba(0,240,255,0.2)] to-[rgba(212,0,255,0.2)] animate-gradient-x">
        <video src="https://assets.mixkit.co/videos/preview/mixkit-concert-light-show-6897-large.mp4" autoPlay loop muted className="absolute w-full h-full object-cover opacity-30 hero-video lazy-img" />
        <div className="absolute inset-0 bg-black/50 transition-opacity duration-300" />
        <div className="relative z-10 text-center px-4 sm:px-6 md:px-8">
          <div className="fade-in-up">
            <img src="https://i.ibb.co/LXjmYR6J/image-4.png" alt="RV.RA-ICP Logo" className="w-32 sm:w-40 md:w-48 mx-auto mb-4 sm:mb-6 animate-pulse lazy-img" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)]">
              RV.RA-ICP (TP Tickets Partner) — Discover Unforgettable Events
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 mb-6 sm:mb-8 md:mb-10 max-w-xl sm:max-w-2xl md:max-w-3xl mx-auto font-light">
              Explore concerts, theaters, and festivals in Kyiv and beyond. Secure tickets with ease!
            </p>
            <div className="relative flex flex-col sm:flex-row gap-4 items-center justify-center mb-8">
              <div className="relative w-full sm:w-1/2">
                <input
                  type="text"
                  placeholder="Search events..."
                  className="bg-gray-800 text-white p-3 rounded-lg input-focus w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {suggestions.length > 0 && (
                  <div className="autocomplete-suggestions mt-1">
                    {suggestions.map(s => <div key={s} className="suggestion-item" onClick={() => setSearchQuery(s)}>{s}</div>)}
                  </div>
                )}
              </div>
              <Link to="/events" className="button inline-block hover:scale-110 transition-all">Browse Events</Link>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`category-button ${filterCategory === cat ? 'active' : ''}`}
                  onClick={() => setFilterCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* Featured Events */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8 sm:mb-12 md:mb-16 text-transparent bg-clip-text bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] fade-in-up">
          Featured Events
        </h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFeatured.map(event => (
            <div key={event.id} className="card overflow-hidden border-[1.5px] border-[rgba(0,240,255,0.3)] hover:border-[rgba(212,0,255,0.4)] hover:shadow-lg transition-all fade-in-up">
              <div className="relative">
                <img src={event.image} alt={event.title} className="w-full h-48 sm:h-56 md:h-64 object-cover rounded-t-xl lazy-img" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(17,17,17,0.9)] to-transparent transition-opacity duration-300" />
              </div>
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-[var(--neon-blue)] mb-2 line-clamp-2">{event.title}</h3>
                <p className="text-gray-300 flex items-center mb-1 text-sm sm:text-base">
                  <CalendarIcon className="w-4 sm:w-5 h-4 sm:h-5 mr-2 text-[var(--neon-purple)]" />
                  Date: {event.date} {event.time}
                </p>
                <p className="text-gray-300 flex items-center mb-1 text-sm sm:text-base">
                  <MapPinIcon className="w-4 sm:w-5 h-4 sm:h-5 mr-2 text-[var(--neon-purple)]" />
                  City: {event.city}
                </p>
                <p className="text-gray-300 flex items-center mb-3 sm:mb-4 text-sm sm:text-base">
                  <CurrencyDollarIcon className="w-4 sm:w-5 h-4 sm:h-5 mr-2 text-[var(--neon-purple)]" />
                  Price: {event.price_range}
                </p>
                <div className="flex gap-2 flex-wrap">
                  <Link to={`/event/${event.id}`} className="button flex-1 text-center text-sm sm:text-base">View Details</Link>
                  <button className="button flex-1 text-center text-sm sm:text-base" onClick={() => handleAddToCart(event)}>Add to Cart</button>
                  <button className="button flex-1 text-center text-sm sm:text-base" onClick={() => handleBuyNow(event)}>Buy Now</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* Testimonials */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 bg-gray-800/20">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8 sm:mb-12 md:mb-16 text-transparent bg-clip-text bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] fade-in-up">
          What Our Users Say
        </h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card bg-gray-800/40 p-6 rounded-lg border border-[rgba(0,240,255,0.2)] fade-in-up">
            <p className="text-gray-300 mb-4">"Amazing experience! Easy to use and secure ticket purchasing."</p>
            <p className="text-[var(--neon-blue)] font-semibold">— Anna K.</p>
          </div>
          <div className="card bg-gray-800/40 p-6 rounded-lg border border-[rgba(0,240,255,0.2)] fade-in-up">
            <p className="text-gray-300 mb-4">"Found the best concerts in Kyiv with RV.RA-ICP!"</p>
            <p className="text-[var(--neon-blue)] font-semibold">— Dmytro P.</p>
          </div>
          <div className="card bg-gray-800/40 p-6 rounded-lg border border-[rgba(0,240,255,0.2)] fade-in-up">
            <p className="text-gray-300 mb-4">"Quick and reliable service. Love the QR code tickets!"</p>
            <p className="text-[var(--neon-blue)] font-semibold">— Olena S.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;