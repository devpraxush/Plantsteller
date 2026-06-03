import { useParams, Link } from 'react-router';
import { motion } from 'motion/react';
import { Heart, ShoppingCart, Star, Sparkles, Droplets, Sun, Thermometer, Wind, ArrowLeft, Package } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PlantCard } from '../components/PlantCard';
import { useEffect, useState } from 'react';
import { Plant } from '../data/plants';
import { getProduct, getProducts } from '../api/products';

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [plant, setPlant] = useState<Plant | null>(null);
  const [related, setRelated] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart, addToWishlist, removeFromWishlist, isWishlisted } = useApp();
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState<'care' | 'details'>('care');
  const wishlisted = plant ? isWishlisted(plant.id) : false;

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    Promise.all([getProduct(id), getProducts()])
      .then(([product, products]) => {
        setPlant(product);
        setRelated(products.filter(p => p.id !== id && p.category === product.category).slice(0, 4));
        setError('');
      })
      .catch(() => setError('Plant not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-background)', color: 'var(--color-foreground)', fontFamily: 'DM Sans, sans-serif' }}>
        Loading plant...
      </div>
    );
  }

  if (!plant || error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: 'var(--color-background)' }}>
        <p style={{ fontSize: '48px' }}>🌿</p>
        <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '24px', color: 'var(--color-foreground)' }}>Plant not found</p>
        <Link to="/shop" className="px-6 py-2 rounded-full text-white" style={{ background: '#1A4731', fontFamily: 'DM Sans, sans-serif' }}>Back to Shop</Link>
      </div>
    );
  }

  const careInfo = [
    { icon: Sun, label: 'Light', value: plant.light },
    { icon: Droplets, label: 'Water', value: plant.water },
    { icon: Wind, label: 'Humidity', value: plant.humidity },
    { icon: Thermometer, label: 'Temperature', value: plant.temperature },
  ];

  const discount = plant.originalPrice ? Math.round((1 - plant.price / plant.originalPrice) * 100) : 0;

  return (
    <div style={{ background: 'var(--color-background)', minHeight: '100vh' }}>
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8">
          <Link to="/shop" className="flex items-center gap-1.5 transition-colors hover:text-green-700" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'var(--color-muted-foreground)' }}>
            <ArrowLeft size={16} /> Shop
          </Link>
          <span style={{ color: 'var(--color-muted-foreground)' }}>/</span>
          <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'var(--color-foreground)' }}>{plant.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 mb-20">
          {/* Image */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <div className="relative rounded-3xl overflow-hidden" style={{ height: '500px' }}>
              <img src={plant.image} alt={plant.name} className="w-full h-full object-cover" />
              {plant.badge && (
                <span className="absolute top-5 left-5 px-3 py-1.5 rounded-full text-white" style={{ background: '#1A4731', fontFamily: 'DM Sans, sans-serif', fontSize: '12px', fontWeight: 600 }}>
                  {plant.badge}
                </span>
              )}
              {plant.aiRecommended && (
                <span className="absolute top-5 right-5 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white" style={{ background: 'rgba(0,0,0,0.6)', fontFamily: 'DM Sans, sans-serif', fontSize: '12px', fontWeight: 600 }}>
                  <Sparkles size={12} /> AI Pick
                </span>
              )}
              {discount > 0 && (
                <span className="absolute bottom-5 left-5 px-3 py-1.5 rounded-full text-white" style={{ background: '#ef4444', fontFamily: 'DM Sans, sans-serif', fontSize: '12px', fontWeight: 600 }}>
                  -{discount}% OFF
                </span>
              )}
            </div>
          </motion.div>

          {/* Details */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            {plant.aiRecommended && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4" style={{ background: 'rgba(30,86,49,0.1)', color: '#1A4731' }}>
                <Sparkles size={13} />
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', fontWeight: 600 }}>AI Recommended for You</span>
              </div>
            )}

            <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, fontSize: '42px', color: 'var(--color-foreground)', lineHeight: 1.2 }}>{plant.name}</h1>
            <p className="mt-1" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '15px', color: 'var(--color-muted-foreground)', fontStyle: 'italic' }}>{plant.scientificName}</p>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-4">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16} className={i < Math.round(plant.rating) ? 'fill-amber-400 stroke-amber-400' : 'stroke-gray-300'} />
                ))}
              </div>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'var(--color-foreground)', fontWeight: 500 }}>{plant.rating}</span>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'var(--color-muted-foreground)' }}>({plant.reviewCount} reviews)</span>
              <span className="ml-2 capitalize px-2 py-0.5 rounded-full" style={{ background: 'var(--color-secondary)', fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'var(--color-muted-foreground)' }}>
                {plant.careLevel} care
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mt-6">
              <span style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, fontSize: '40px', color: '#1A4731' }}>₹{plant.price.toLocaleString('en-IN')}</span>
              {plant.originalPrice && (
                <span className="line-through" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '18px', color: 'var(--color-muted-foreground)' }}>₹{plant.originalPrice.toLocaleString('en-IN')}</span>
              )}
            </div>

            <p className="mt-5" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '15px', color: 'var(--color-muted-foreground)', lineHeight: 1.8 }}>
              {plant.longDescription}
            </p>

            {/* Size */}
            <div className="flex items-center gap-2 mt-5 p-3 rounded-xl" style={{ background: 'var(--color-secondary)' }}>
              <Package size={16} style={{ color: '#1A4731' }} />
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'var(--color-foreground)' }}>Size: <strong>{plant.size}</strong></span>
            </div>

            {/* Quantity + Add to cart */}
            <div className="flex items-center gap-4 mt-8">
              <div className="flex items-center rounded-xl overflow-hidden" style={{ border: '1px solid var(--color-border)' }}>
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-10 h-11 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '18px', color: 'var(--color-foreground)' }}
                >−</button>
                <span className="w-10 text-center" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '15px', color: 'var(--color-foreground)' }}>{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="w-10 h-11 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '18px', color: 'var(--color-foreground)' }}
                >+</button>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => addToCart(plant, qty)}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-white"
                style={{ background: '#1A4731', fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '15px' }}
              >
                <ShoppingCart size={18} /> Add to Cart
              </motion.button>

              <button
                onClick={() => wishlisted ? removeFromWishlist(plant.id) : addToWishlist(plant)}
                className="w-12 h-12 rounded-xl flex items-center justify-center transition-colors"
                style={{ border: '1px solid var(--color-border)', background: wishlisted ? '#fff0f0' : 'var(--color-card)' }}
              >
                <Heart size={20} className={wishlisted ? 'fill-red-500 stroke-red-500' : 'stroke-gray-400'} />
              </button>
            </div>

            {/* In stock */}
            <p className="mt-4" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: plant.inStock ? '#16a34a' : '#ef4444' }}>
              {plant.inStock ? '✓ In stock — ready to ship' : '✗ Currently out of stock'}
            </p>
          </motion.div>
        </div>

        {/* Tabs: Care info & Details */}
        <div className="mb-20">
          <div className="flex gap-1 mb-8 p-1 rounded-xl w-fit" style={{ background: 'var(--color-secondary)' }}>
            {(['care', 'details'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-6 py-2.5 rounded-lg capitalize transition-all"
                style={{
                  background: activeTab === tab ? '#1A4731' : 'transparent',
                  color: activeTab === tab ? 'white' : 'var(--color-muted-foreground)',
                  fontFamily: 'DM Sans, sans-serif', fontWeight: 500, fontSize: '14px',
                }}
              >
                {tab === 'care' ? 'Care Guide' : 'Product Details'}
              </button>
            ))}
          </div>

          {activeTab === 'care' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {careInfo.map(c => (
                <div key={c.label} className="p-5 rounded-2xl" style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: 'rgba(30,86,49,0.1)' }}>
                    <c.icon size={20} style={{ color: '#1A4731' }} />
                  </div>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'var(--color-muted-foreground)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{c.label}</p>
                  <p className="mt-1" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'var(--color-foreground)', fontWeight: 500 }}>{c.value}</p>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'details' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid sm:grid-cols-2 gap-4">
              {[
                ['Category', plant.category],
                ['Seasons', plant.season.join(', ')],
                ['Size', plant.size],
                ['Care Level', plant.careLevel],
                ['Scientific Name', plant.scientificName],
                ['In Stock', plant.inStock ? 'Yes' : 'No'],
              ].map(([key, val]) => (
                <div key={key} className="flex gap-4 p-4 rounded-xl" style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'var(--color-muted-foreground)', fontWeight: 600, minWidth: '120px' }}>{key}</span>
                  <span className="capitalize" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'var(--color-foreground)' }}>{val}</span>
                </div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Related Plants */}
        {related.length > 0 && (
          <div>
            <h2 className="mb-8" style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, fontSize: '28px', color: 'var(--color-foreground)' }}>You Might Also Like</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map(p => <PlantCard key={p.id} plant={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
