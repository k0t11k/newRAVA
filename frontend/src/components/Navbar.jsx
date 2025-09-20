import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCartIcon, UserIcon, TicketIcon } from './Icons';

const Navbar = ({ user, setUser, cart, tickets }) => {
  const cartItemCount = useMemo(() => cart.reduce((sum, item) => sum + (item.quantity || 1), 0), [cart]);
  const ticketCount = useMemo(() => tickets.length, [tickets]);

  return (
    <nav className="bg-gray-900/90 backdrop-blur-lg py-4 px-4 sm:px-6 md:px-8 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] hover:scale-105 transition-transform">
          RV.RA-ICP
        </Link>
        <div className="flex items-center gap-4 sm:gap-6">
          <Link to="/" className="footer-link hover:scale-105 transition-transform">Home</Link>
          <Link to="/events" className="footer-link hover:scale-105 transition-transform">Events</Link>
          <Link to="/about" className="footer-link hover:scale-105 transition-transform">About Us</Link>
          <Link to="/payment-methods" className="footer-link hover:scale-105 transition-transform">Payment Methods</Link>
          {user && (
            <>
              <Link to="/account" className="footer-link flex items-center gap-2 hover:scale-105 transition-transform">
                <TicketIcon className="w-5 h-5" />
                My Account
                {ticketCount > 0 && <span className="cart-badge">{ticketCount}</span>}
              </Link>
              <Link to="/admin" className="footer-link hover:scale-105 transition-transform">Admin</Link>
            </>
          )}
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-gray-300 font-medium">{user.principal?.slice(0, 8)}...</span>
              <button onClick={() => setUser(null)} className="footer-link hover:scale-105 transition-transform">Logout</button>
            </div>
          ) : (
            <Link to="/login" className="footer-link flex items-center gap-2 hover:scale-105 transition-transform">
              <UserIcon className="w-5 h-5" />
              Login
            </Link>
          )}
          <Link to="/cart" className="cart-icon footer-link flex items-center gap-2 hover:scale-105 transition-transform">
            <ShoppingCartIcon className="w-5 h-5" />
            Cart
            {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;