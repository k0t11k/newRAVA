import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthClient } from '@dfinity/auth-client';
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from './declarations/backend/index.js'; // Генерируется dfx
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import EventDetails from './components/EventDetails';
import Events from './components/Events';
import MyAccount from './components/MyAccount';
import Login from './components/Login';
import Cart from './components/Cart';
import AboutUs from './components/AboutUs';
import PaymentMethods from './components/PaymentMethods';
import AuthModal from './components/AuthModal';
import AdminPanel from './components/AdminPanel';
import Footer from './components/Footer';

const events = [ // Тестовые данные (загружаются из backend)
  { id: '1', title: 'N Crypto Awards 2025', date: '2025-10-12', time: '12:00', city: 'Kyiv', category: 'Comedy', priceRange: '1800-15000 UAH', image: 'https://d2q8nf5aywi2aj.cloudfront.net/uploads/resize/shows/logo/630x891_1751027556.webp', url: '/#/event/1', venue: 'Parkova road, 16a, Kiev, 03150', description: 'N Crypto Awards 2025 is the main final event...' },
  // Добавь все 5 событий из оригинала
];

function AppContent() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authClient, setAuthClient] = useState(null);
  const [backend, setBackend] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const init = async () => {
      const agent = new HttpAgent({ host: 'http://127.0.0.1:4943' });
      const backendActor = Actor.createActor(idlFactory, { agent, canisterId: process.env.CANISTER_ID_backend });
      setBackend(backendActor);

      const client = await AuthClient.create();
      setAuthClient(client);
      if (await client.isAuthenticated()) {
        const identity = await client.getIdentity();
        setUser({ principal: identity.getPrincipal().toString() });
        // Загрузить билеты
        const userTickets = await backendActor.get_user_tickets(identity.getPrincipal());
        setTickets(userTickets);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (authClient) {
      const handleAuth = async () => {
        if (await authClient.isAuthenticated()) {
          const identity = await authClient.getIdentity();
          setUser({ principal: identity.getPrincipal().toString() });
        }
      };
      authClient.on('authenticated', handleAuth);
    }
  }, [authClient]);

  const handleLogin = async () => {
    await authClient.login({
      identityProvider: 'http://127.0.0.1:4943/?canisterId=rmx6-jaaaa-aaaaa-aaadq-cai#authorize', // Локальный II
      onSuccess: () => window.location.reload(),
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} setUser={setUser} cart={cart} tickets={tickets} />
      <main className="flex-grow">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Hero events={events} user={user} setCart={setCart} setShowAuthModal={setShowAuthModal} setTickets={setTickets} backend={backend} />} />
          <Route path="/events" element={<Events events={events} cart={cart} setCart={setCart} user={user} setShowAuthModal={setShowAuthModal} setTickets={setTickets} backend={backend} />} />
          <Route path="/event/:id" element={<EventDetails events={events} user={user} setCart={setCart} setShowAuthModal={setShowAuthModal} setTickets={setTickets} backend={backend} />} />
          <Route path="/account" element={<MyAccount user={user} tickets={tickets} backend={backend} />} />
          <Route path="/login" element={<Login setUser={setUser} authClient={authClient} handleLogin={handleLogin} />} />
          <Route path="/cart" element={<Cart cart={cart} setCart={setCart} user={user} setShowAuthModal={setShowAuthModal} setTickets={setTickets} backend={backend} />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/payment-methods" element={<PaymentMethods />} />
          <Route path="/admin" element={<AdminPanel user={user} backend={backend} />} />
        </Routes>
      </main>
      {showAuthModal && <AuthModal setShow={setShowAuthModal} onLogin={handleLogin} />}
      <Footer />
    </div>
  );
}

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;