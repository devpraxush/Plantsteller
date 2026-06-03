import { useState } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Trash2, ArrowLeft, CheckCircle, Package, Truck, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function Cart() {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useApp();
  const [step, setStep] = useState<'cart' | 'details' | 'confirm'>('cart');
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', city: '', pin: '', payment: 'upi' });
  const [loading, setLoading] = useState(false);

  const shipping = cartTotal > 999 ? 0 : 79;
  const tax = cartTotal * 0.05;
  const grandTotal = cartTotal + shipping + tax;

  async function handleOrder(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setStep('confirm');
  }

  if (step === 'confirm') {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: 'var(--color-background)' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(30,86,49,0.1)' }}>
            <CheckCircle size={48} style={{ color: '#1A4731' }} />
          </div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, fontSize: '36px', color: 'var(--color-foreground)' }}>Order Placed! 🌿</h1>
          <p className="mt-4" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '16px', color: 'var(--color-muted-foreground)', lineHeight: 1.7 }}>
            Your plants are being carefully prepared for shipment. You'll receive a tracking link via email and WhatsApp.
          </p>
          <p className="mt-2" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: '#1A4731', fontWeight: 500 }}>
            Expected delivery: 3-5 business days
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/shop">
              <button className="px-8 py-3 rounded-full text-white" style={{ background: '#1A4731', fontFamily: 'DM Sans, sans-serif', fontWeight: 500 }}>
                Continue Shopping
              </button>
            </Link>
            <Link to="/community">
              <button className="px-8 py-3 rounded-full" style={{ border: '1px solid var(--color-border)', color: 'var(--color-foreground)', fontFamily: 'DM Sans, sans-serif', fontWeight: 500 }}>
                Share in Community
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--color-background)', minHeight: '100vh' }}>
      <div className="py-14 px-6 text-center" style={{ background: 'linear-gradient(to bottom, #0D1F14, #1A4731)' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, fontSize: '48px', color: 'white' }}>
          {step === 'cart' ? 'Your Cart' : 'Checkout'}
        </h1>
        <p className="mt-3" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '16px', color: 'rgba(255,255,255,0.7)' }}>
          {step === 'cart' ? `${cartCount} item${cartCount !== 1 ? 's' : ''} in your cart` : 'Complete your order'}
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Progress */}
        <div className="flex items-center justify-center gap-3 mb-12">
          {(['cart', 'details'] as const).map((s, i) => (
            <div key={s} className="flex items-center gap-3">
              {i > 0 && <div className="w-16 h-px" style={{ background: step === 'cart' ? 'var(--color-border)' : '#1A4731' }} />}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: step !== 'cart' || s === 'cart' ? '#1A4731' : 'var(--color-secondary)', color: step !== 'cart' || s === 'cart' ? 'white' : 'var(--color-muted-foreground)' }}>
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 600 }}>{i + 1}</span>
                </div>
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: step !== 'cart' || s === 'cart' ? 'var(--color-foreground)' : 'var(--color-muted-foreground)', fontWeight: step !== 'cart' || s === 'cart' ? 600 : 400, textTransform: 'capitalize' }}>{s === 'cart' ? 'Cart' : 'Delivery Details'}</span>
              </div>
            </div>
          ))}
        </div>

        {cart.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
            <ShoppingCart size={48} className="mx-auto mb-4" style={{ color: 'var(--color-muted-foreground)' }} />
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 600, fontSize: '28px', color: 'var(--color-foreground)' }}>Your cart is empty</h2>
            <p className="mt-3" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '15px', color: 'var(--color-muted-foreground)' }}>Add some plants to get started</p>
            <Link to="/shop">
              <motion.button whileHover={{ scale: 1.04 }} className="mt-8 px-8 py-3 rounded-full text-white" style={{ background: '#1A4731', fontFamily: 'DM Sans, sans-serif', fontWeight: 500 }}>
                Shop Plants
              </motion.button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2">
              {step === 'cart' && (
                <AnimatePresence>
                  <div className="space-y-4">
                    {cart.map(item => (
                      <motion.div
                        key={item.plant.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        className="flex gap-4 p-4 rounded-2xl"
                        style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}
                      >
                        <Link to={`/shop/${item.plant.id}`}>
                          <img src={item.plant.image} alt={item.plant.name} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link to={`/shop/${item.plant.id}`}>
                            <h3 className="hover:text-green-700 transition-colors" style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 600, fontSize: '16px', color: 'var(--color-foreground)' }}>{item.plant.name}</h3>
                          </Link>
                          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'var(--color-muted-foreground)', fontStyle: 'italic' }}>{item.plant.size}</p>
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center rounded-lg overflow-hidden" style={{ border: '1px solid var(--color-border)' }}>
                              <button onClick={() => updateQuantity(item.plant.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800" style={{ fontFamily: 'DM Sans, sans-serif', color: 'var(--color-foreground)' }}>−</button>
                              <span className="w-8 text-center" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'var(--color-foreground)' }}>{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.plant.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800" style={{ fontFamily: 'DM Sans, sans-serif', color: 'var(--color-foreground)' }}>+</button>
                            </div>
                            <div className="flex items-center gap-3">
                              <span style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, fontSize: '18px', color: '#1A4731' }}>₹{(item.plant.price * item.quantity).toLocaleString('en-IN')}</span>
                              <button onClick={() => removeFromCart(item.plant.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                <Trash2 size={15} className="stroke-red-400" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </AnimatePresence>
              )}

              {step === 'details' && (
                <form onSubmit={handleOrder} className="space-y-4">
                  <button type="button" onClick={() => setStep('cart')} className="flex items-center gap-2 mb-2" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'var(--color-muted-foreground)' }}>
                    <ArrowLeft size={16} /> Back to cart
                  </button>
                  <div className="p-6 rounded-2xl space-y-4" style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
                    <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 600, fontSize: '20px', color: 'var(--color-foreground)' }}>Delivery Details</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <input required placeholder="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="px-4 py-3 rounded-xl outline-none" style={{ background: 'var(--color-secondary)', border: '1px solid var(--color-border)', color: 'var(--color-foreground)', fontFamily: 'DM Sans, sans-serif', fontSize: '14px' }} />
                      <input required type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="px-4 py-3 rounded-xl outline-none" style={{ background: 'var(--color-secondary)', border: '1px solid var(--color-border)', color: 'var(--color-foreground)', fontFamily: 'DM Sans, sans-serif', fontSize: '14px' }} />
                      <input required placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="px-4 py-3 rounded-xl outline-none sm:col-span-2" style={{ background: 'var(--color-secondary)', border: '1px solid var(--color-border)', color: 'var(--color-foreground)', fontFamily: 'DM Sans, sans-serif', fontSize: '14px' }} />
                      <input required placeholder="Full Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="px-4 py-3 rounded-xl outline-none sm:col-span-2" style={{ background: 'var(--color-secondary)', border: '1px solid var(--color-border)', color: 'var(--color-foreground)', fontFamily: 'DM Sans, sans-serif', fontSize: '14px' }} />
                      <input required placeholder="City" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className="px-4 py-3 rounded-xl outline-none" style={{ background: 'var(--color-secondary)', border: '1px solid var(--color-border)', color: 'var(--color-foreground)', fontFamily: 'DM Sans, sans-serif', fontSize: '14px' }} />
                      <input required placeholder="PIN Code" value={form.pin} onChange={e => setForm({ ...form, pin: e.target.value })} className="px-4 py-3 rounded-xl outline-none" style={{ background: 'var(--color-secondary)', border: '1px solid var(--color-border)', color: 'var(--color-foreground)', fontFamily: 'DM Sans, sans-serif', fontSize: '14px' }} />
                    </div>
                  </div>
                  <div className="p-6 rounded-2xl space-y-3" style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
                    <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 600, fontSize: '20px', color: 'var(--color-foreground)' }}>Payment Method</h3>
                    {[
                      { value: 'upi', label: 'UPI / GPay / PhonePe', emoji: '📱' },
                      { value: 'card', label: 'Credit / Debit Card', emoji: '💳' },
                      { value: 'cod', label: 'Cash on Delivery', emoji: '💵' },
                    ].map(p => (
                      <label key={p.value} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer" style={{ background: form.payment === p.value ? 'rgba(30,86,49,0.08)' : 'var(--color-secondary)', border: `1.5px solid ${form.payment === p.value ? '#1A4731' : 'var(--color-border)'}` }}>
                        <input type="radio" name="payment" value={p.value} checked={form.payment === p.value} onChange={() => setForm({ ...form, payment: p.value })} />
                        <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'var(--color-foreground)' }}>{p.emoji} {p.label}</span>
                      </label>
                    ))}
                  </div>
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full py-4 rounded-xl text-white"
                    style={{ background: '#1A4731', fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '16px', opacity: loading ? 0.7 : 1 }}
                  >
                    {loading ? 'Placing Order...' : `Place Order · ₹${grandTotal.toLocaleString('en-IN')}`}
                  </motion.button>
                </form>
              )}
            </div>

            {/* Order Summary */}
            <div>
              <div className="p-6 rounded-2xl sticky top-24" style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
                <h3 className="mb-5" style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, fontSize: '20px', color: 'var(--color-foreground)' }}>Order Summary</h3>
                <div className="space-y-3 mb-5">
                  <div className="flex justify-between">
                    <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'var(--color-muted-foreground)' }}>Subtotal ({cartCount} items)</span>
                    <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'var(--color-foreground)' }}>₹{cartTotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'var(--color-muted-foreground)' }}>Shipping</span>
                    <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: shipping === 0 ? '#16a34a' : 'var(--color-foreground)' }}>
                      {shipping === 0 ? 'Free' : `₹${shipping.toLocaleString('en-IN')}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'var(--color-muted-foreground)' }}>Tax (5%)</span>
                    <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'var(--color-foreground)' }}>₹{tax.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="h-px" style={{ background: 'var(--color-border)' }} />
                  <div className="flex justify-between">
                    <span style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, fontSize: '17px', color: 'var(--color-foreground)' }}>Total</span>
                    <span style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, fontSize: '20px', color: '#1A4731' }}>₹{grandTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {shipping > 0 && (
                  <p className="mb-4 text-center" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'var(--color-muted-foreground)' }}>
                    Add ₹{(999 - cartTotal).toLocaleString('en-IN')} more for free shipping
                  </p>
                )}

                {step === 'cart' && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setStep('details')}
                    className="w-full py-3.5 rounded-xl text-white"
                    style={{ background: '#1A4731', fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '15px' }}
                  >
                    Proceed to Checkout →
                  </motion.button>
                )}

                <div className="mt-4 space-y-2">
                  {[
                    { icon: Package, text: 'Secure packaging guaranteed' },
                    { icon: Truck, text: 'Live plant delivery' },
                    { icon: Shield, text: '7-day replacement warranty' },
                  ].map(b => (
                    <div key={b.text} className="flex items-center gap-2">
                      <b.icon size={13} style={{ color: '#1A4731', flexShrink: 0 }} />
                      <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'var(--color-muted-foreground)' }}>{b.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
