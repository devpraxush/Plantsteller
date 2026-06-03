import { Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function Wishlist() {
  const { wishlist, removeFromWishlist, moveToCart } = useApp();

  return (
    <div style={{ background: 'var(--color-background)', minHeight: '100vh' }}>
      {/* Header */}
      <div className="py-14 px-6 text-center" style={{ background: 'linear-gradient(to bottom, #0A1A0E, #1A4731)' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, fontSize: '48px', color: 'white' }}>My Wishlist</h1>
        <p className="mt-3" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '16px', color: 'rgba(255,255,255,0.7)' }}>
          {wishlist.length} plant{wishlist.length !== 1 ? 's' : ''} saved
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {wishlist.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-24">
            <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(239,68,68,0.1)' }}>
              <Heart size={40} className="stroke-red-400" />
            </div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 600, fontSize: '28px', color: 'var(--color-foreground)' }}>Your wishlist is empty</h2>
            <p className="mt-3" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '15px', color: 'var(--color-muted-foreground)' }}>Save plants you love by clicking the heart icon</p>
            <Link to="/shop">
              <motion.button
                whileHover={{ scale: 1.04 }}
                className="mt-8 px-8 py-3 rounded-full text-white"
                style={{ background: '#1A4731', fontFamily: 'DM Sans, sans-serif', fontWeight: 500, fontSize: '15px' }}
              >
                Browse Plants
              </motion.button>
            </Link>
          </motion.div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-8">
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '15px', color: 'var(--color-muted-foreground)' }}>{wishlist.length} saved item{wishlist.length !== 1 ? 's' : ''}</p>
              <button
                onClick={() => wishlist.forEach(p => moveToCart(p.id))}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-white transition-opacity hover:opacity-90"
                style={{ background: '#1A4731', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 500 }}
              >
                <ShoppingCart size={16} /> Add All to Cart
              </button>
            </div>

            <AnimatePresence>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {wishlist.map(plant => (
                  <motion.div
                    key={plant.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="rounded-2xl overflow-hidden shadow-md"
                    style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}
                  >
                    <Link to={`/shop/${plant.id}`}>
                      <div className="relative overflow-hidden" style={{ height: '200px' }}>
                        <img src={plant.image} alt={plant.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                        {plant.badge && (
                          <span className="absolute top-3 left-3 text-white px-2 py-1 rounded-full" style={{ background: '#1A4731', fontSize: '11px', fontFamily: 'DM Sans, sans-serif', fontWeight: 600 }}>{plant.badge}</span>
                        )}
                      </div>
                    </Link>
                    <div className="p-4">
                      <Link to={`/shop/${plant.id}`}>
                        <h3 className="hover:text-green-700 transition-colors" style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 600, fontSize: '16px', color: 'var(--color-foreground)' }}>{plant.name}</h3>
                      </Link>
                      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'var(--color-muted-foreground)', fontStyle: 'italic' }}>{plant.scientificName}</p>
                      <p className="mt-3" style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, fontSize: '22px', color: '#1A4731' }}>₹{plant.price.toLocaleString('en-IN')}</p>
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => moveToCart(plant.id)}
                          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-white transition-opacity hover:opacity-90"
                          style={{ background: '#1A4731', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 500 }}
                        >
                          <ShoppingCart size={14} /> Move to Cart
                        </button>
                        <button
                          onClick={() => removeFromWishlist(plant.id)}
                          className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
                          style={{ border: '1px solid var(--color-border)' }}
                        >
                          <Trash2 size={15} className="stroke-red-400" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
}
