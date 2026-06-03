import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Plant } from '../data/plants';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router';
import { motion } from 'motion/react';

interface PlantCardProps {
  plant: Plant;
}

const SERIF = 'Cormorant Garamond, serif';
const SANS = 'DM Sans, sans-serif';
const GREEN = '#1A4731';

const badgeColors: Record<string, string> = {
  'Best Seller': '#b45309',
  'Air Purifier': '#065f46',
  'For Beginners': '#1d4ed8',
  'Most Popular': '#9d174d',
  'Sale': '#dc2626',
  'Trending': '#6d28d9',
  'New Arrival': '#0891b2',
  'India Favourite': '#1A4731',
  'Most Loved': '#be185d',
  'Cultural Icon': '#92400e',
  'Medicinal': '#059669',
  'Premium': '#7c2d12',
  'Limited Stock': '#ea580c',
};

export function PlantCard({ plant }: PlantCardProps) {
  const { addToCart, addToWishlist, removeFromWishlist, isWishlisted } = useApp();
  const wishlisted = isWishlisted(plant.id);
  const discount = plant.originalPrice ? Math.round((1 - plant.price / plant.originalPrice) * 100) : 0;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      className="group relative rounded-2xl overflow-hidden"
      style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', transition: 'box-shadow 0.25s' }}
    >
      <Link to={`/shop/${plant.id}`} className="block">
        <div className="relative overflow-hidden" style={{ height: '220px' }}>
          <img
            src={plant.image}
            alt={plant.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {plant.badge && (
            <span className="absolute top-3 left-3 text-white px-2.5 py-1 rounded-full" style={{ background: badgeColors[plant.badge] || GREEN, fontSize: '11px', fontFamily: SANS, fontWeight: 600 }}>
              {plant.badge}
            </span>
          )}
          {discount > 0 && (
            <span className="absolute bottom-3 left-3 text-white px-2.5 py-1 rounded-full" style={{ background: '#dc2626', fontSize: '11px', fontFamily: SANS, fontWeight: 600 }}>
              -{discount}% OFF
            </span>
          )}
        </div>
      </Link>

      {/* Wishlist */}
      <button
        onClick={() => wishlisted ? removeFromWishlist(plant.id) : addToWishlist(plant)}
        className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
        style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(4px)' }}
        aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart size={15} className={wishlisted ? 'fill-red-500 stroke-red-500' : 'stroke-gray-500'} />
      </button>

      <div className="p-4">
        <Link to={`/shop/${plant.id}`}>
          <h3 className="truncate hover:text-green-900 transition-colors" style={{ fontFamily: SERIF, fontWeight: 600, fontSize: '19px', color: 'var(--color-foreground)', lineHeight: 1.25 }}>
            {plant.name}
          </h3>
        </Link>
        <p style={{ fontFamily: SANS, fontSize: '12px', color: 'var(--color-muted-foreground)', fontStyle: 'italic' }}>
          {plant.scientificName}
        </p>

        <div className="flex items-center gap-1 mt-2 mb-2">
          <Star size={12} className="fill-amber-400 stroke-amber-400" />
          <span style={{ fontFamily: SANS, fontSize: '12px', color: 'var(--color-foreground)' }}>{plant.rating}</span>
          <span style={{ fontFamily: SANS, fontSize: '11px', color: 'var(--color-muted-foreground)' }}>({plant.reviewCount})</span>
          <span className="ml-auto capitalize px-2 py-0.5 rounded-full" style={{ fontFamily: SANS, fontSize: '10px', color: 'var(--color-muted-foreground)', background: 'var(--color-secondary)' }}>
            {plant.careLevel}
          </span>
        </div>

        {plant.careTip && (
          <p className="mb-3 line-clamp-2" style={{ fontFamily: SANS, fontSize: '12px', color: 'var(--color-muted-foreground)', fontStyle: 'italic', lineHeight: 1.5 }}>
            {plant.careTip}
          </p>
        )}

        <div className="flex items-center justify-between mt-2">
          <div>
            <span style={{ fontFamily: SERIF, fontSize: '22px', fontWeight: 600, color: GREEN }}>
              ₹{plant.price.toLocaleString('en-IN')}
            </span>
            {plant.originalPrice && (
              <span className="ml-2 line-through" style={{ fontFamily: SANS, fontSize: '12px', color: 'var(--color-muted-foreground)' }}>
                ₹{plant.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>
          <button
            onClick={() => addToCart(plant)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-white transition-all hover:opacity-85 active:scale-95"
            style={{ background: GREEN, fontFamily: SANS, fontSize: '13px', fontWeight: 500 }}
          >
            <ShoppingCart size={13} /> Add
          </button>
        </div>
      </div>
    </motion.div>
  );
}
