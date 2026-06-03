import { Link, Outlet, useLocation } from 'react-router';
import { useApp } from '../context/AppContext';
import { Sun, Moon, ShoppingCart, Heart, User, Leaf, X, Plus, Minus, Trash2, Instagram, MessageCircle, Menu } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function Layout() {
  const { theme, toggleTheme, cartCount, cartOpen, setCartOpen, cart, removeFromCart, updateQuantity, cartTotal, user, logout } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Shop' },
    { to: '/community', label: 'Community' },
    { to: '/corporate-gifting', label: 'Corporate Gifting' },
    { to: '/support', label: 'Support' },
  ];

  return (
    <div className="min-h-screen" style={{ fontFamily: 'DM Sans, sans-serif' }}>
      {/* Navbar */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled
            ? theme === 'dark' ? 'rgba(10,26,14,0.95)' : 'rgba(245,240,232,0.95)'
            : theme === 'dark' ? 'rgba(10,26,14,0.8)' : 'rgba(245,240,232,0.8)',
          backdropFilter: 'blur(12px)',
          borderBottom: scrolled ? '1px solid var(--color-border)' : 'none',
          boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.08)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between" style={{ height: '72px' }}>
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#1A4731' }}>
              <Leaf size={18} className="text-white" />
            </div>
            <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '22px', fontWeight: 700, color: '#1A4731' }}>
              PlantSteller
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '15px',
                  fontWeight: location.pathname === link.to ? 600 : 400,
                  color: location.pathname === link.to ? '#1A4731' : 'var(--color-foreground)',
                }}
                className="hover:text-green-700 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors" aria-label="Toggle theme">
              {theme === 'dark' ? <Sun size={20} style={{ color: '#C9952A' }} /> : <Moon size={20} style={{ color: '#1A4731' }} />}
            </button>

            <Link to="/wishlist" className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors" aria-label="Wishlist">
              <Heart size={20} style={{ color: 'var(--color-foreground)' }} />
            </Link>

            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
              aria-label="Cart"
            >
              <ShoppingCart size={20} style={{ color: 'var(--color-foreground)' }} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-white flex items-center justify-center"
                  style={{ background: '#1A4731', fontSize: '11px', fontWeight: 700 }}>
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>

            <Link to="/auth" className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-white transition-all hover:opacity-90"
              style={{ background: '#1A4731', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 500 }}>
              <User size={16} />
              {user ? user.name.split(' ')[0] : 'Sign In'}
            </Link>

            <button className="md:hidden p-2 rounded-full hover:bg-black/10 transition-colors" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={22} style={{ color: 'var(--color-foreground)' }} /> : <Menu size={22} style={{ color: 'var(--color-foreground)' }} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t px-4 py-4 space-y-3"
              style={{ background: 'var(--color-background)', borderColor: 'var(--color-border)' }}
            >
              {navLinks.map(link => (
                <Link key={link.to} to={link.to} className="block py-2"
                  style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '16px', color: 'var(--color-foreground)' }}>
                  {link.label}
                </Link>
              ))}
              <Link to="/auth" className="block py-2" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '16px', color: '#1A4731', fontWeight: 600 }}>
                {user ? `${user.name} (Sign Out)` : 'Sign In / Sign Up'}
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Cart Drawer */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50"
              onClick={() => setCartOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md flex flex-col shadow-2xl"
              style={{ background: 'var(--color-background)' }}
            >
              <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'var(--color-border)' }}>
                <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '22px', fontWeight: 600, color: 'var(--color-foreground)' }}>
                  Your Cart ({cartCount})
                </h2>
                <button onClick={() => setCartOpen(false)} className="p-2 rounded-full hover:bg-black/10 transition-colors">
                  <X size={20} style={{ color: 'var(--color-foreground)' }} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: '#1A4731' + '20' }}>
                      <ShoppingCart size={28} style={{ color: '#1A4731' }} />
                    </div>
                    <p style={{ fontFamily: 'DM Sans, sans-serif', color: 'var(--color-muted-foreground)' }}>Your cart is empty</p>
                    <Link to="/shop" onClick={() => setCartOpen(false)}
                      className="px-5 py-2 rounded-xl text-white"
                      style={{ background: '#1A4731', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 500 }}>
                      Browse Plants
                    </Link>
                  </div>
                ) : cart.map(item => (
                  <div key={item.plant.id} className="flex gap-3 p-3 rounded-xl" style={{ border: '1px solid var(--color-border)' }}>
                    <img src={item.plant.image} alt={item.plant.name} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="truncate" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '15px', fontWeight: 600, color: 'var(--color-foreground)' }}>
                        {item.plant.name}
                      </h4>
                      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#1A4731', fontWeight: 600 }}>
                        ₹{(item.plant.price * item.quantity).toLocaleString('en-IN')}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <button onClick={() => updateQuantity(item.plant.id, item.quantity - 1)}
                          className="w-6 h-6 rounded flex items-center justify-center hover:bg-black/10 transition-colors"
                          style={{ border: '1px solid var(--color-border)' }}>
                          <Minus size={12} style={{ color: 'var(--color-foreground)' }} />
                        </button>
                        <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 500, color: 'var(--color-foreground)' }}>
                          {item.quantity}
                        </span>
                        <button onClick={() => updateQuantity(item.plant.id, item.quantity + 1)}
                          className="w-6 h-6 rounded flex items-center justify-center hover:bg-black/10 transition-colors"
                          style={{ border: '1px solid var(--color-border)' }}>
                          <Plus size={12} style={{ color: 'var(--color-foreground)' }} />
                        </button>
                        <button onClick={() => removeFromCart(item.plant.id)}
                          className="ml-auto p-1 hover:text-red-500 transition-colors">
                          <Trash2 size={14} style={{ color: 'var(--color-muted-foreground)' }} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {cart.length > 0 && (
                <div className="p-5 border-t" style={{ borderColor: 'var(--color-border)' }}>
                  <div className="flex justify-between mb-4">
                    <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '16px', color: 'var(--color-foreground)' }}>Subtotal</span>
                    <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '20px', fontWeight: 600, color: '#1A4731' }}>
                      ₹{cartTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <Link
                    to="/cart"
                    onClick={() => setCartOpen(false)}
                    className="block w-full text-center py-3 rounded-xl text-white transition-all hover:opacity-90"
                    style={{ background: '#1A4731', fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '16px' }}
                  >
                    Proceed to Checkout
                  </Link>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main style={{ paddingTop: '72px' }}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer style={{ background: '#0D1F14', color: '#E8F5E9' }} className="mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#2D7A4F' }}>
                  <Leaf size={16} className="text-white" />
                </div>
                <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '20px', fontWeight: 700, color: '#4CAF73' }}>
                  PlantSteller
                </span>
              </div>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: '#9EBF9E', lineHeight: '1.6' }}>
                Community Powered Plant Shopping. Bringing nature into every home.
              </p>
              <div className="flex gap-3 mt-4">
                <a href="https://www.instagram.com/plantsteller" target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                  style={{ background: '#2D7A4F' }}>
                  <Instagram size={16} className="text-white" />
                </a>
                <a href="https://wa.me/916392826369" target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                  style={{ background: '#2D7A4F' }}>
                  <MessageCircle size={16} className="text-white" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '16px', fontWeight: 600, color: '#E8F5E9', marginBottom: '16px' }}>
                Quick Links
              </h4>
              {[
                { to: '/shop', label: 'Shop Plants' },
                { to: '/community', label: 'Community' },
                { to: '/corporate-gifting', label: 'Corporate Gifting' },
                { to: '/support', label: 'Help & Support' },
                { to: '/wishlist', label: 'Wishlist' },
              ].map(link => (
                <div key={link.to} className="mb-2">
                  <Link to={link.to}
                    style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: '#9EBF9E' }}
                    className="hover:text-green-400 transition-colors">
                    {link.label}
                  </Link>
                </div>
              ))}
            </div>

            {/* Contact */}
            <div>
              <h4 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '16px', fontWeight: 600, color: '#E8F5E9', marginBottom: '16px' }}>
                Connect With Us
              </h4>
              <div className="space-y-2" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: '#9EBF9E' }}>
                <p>📸 <a href="https://www.instagram.com/plantsteller" target="_blank" rel="noopener noreferrer"
                  className="hover:text-green-400 transition-colors">@plantsteller</a></p>
                <p>💬 <a href="https://wa.me/916392826369" target="_blank" rel="noopener noreferrer"
                  className="hover:text-green-400 transition-colors">WhatsApp Channel</a></p>
              </div>
            </div>

            {/* Team */}
            <div>
              <h4 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '16px', fontWeight: 600, color: '#E8F5E9', marginBottom: '16px' }}>
                Our Team
              </h4>
              <div className="space-y-4" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: '#9EBF9E' }}>
                <div>
                  <p style={{ color: '#E8F5E9', fontWeight: 500 }}>Pranav Ayush</p>
                  <p>📱 6392826369</p>
                  <a href="mailto:pranavayush8@gmail.com" className="hover:text-green-400 transition-colors">pranavayush8@gmail.com</a>
                </div>
                <div>
                  <p style={{ color: '#E8F5E9', fontWeight: 500 }}>Vinayak Raj</p>
                  <p>📱 9354447494</p>
                  <a href="mailto:vinayakraj201@gmail.com" className="hover:text-green-400 transition-colors">vinayakraj201@gmail.com</a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4"
            style={{ borderColor: '#1A4731' }}>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: '#6B9F6B' }}>
              © 2025 PlantSteller. All rights reserved. Made with 🌿 in India
            </p>
            <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '14px', color: '#6B9F6B', fontStyle: 'italic' }}>
              "Bringing nature into every home."
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
