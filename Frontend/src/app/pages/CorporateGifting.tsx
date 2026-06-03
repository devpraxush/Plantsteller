import { useState } from 'react';
import { motion } from 'motion/react';
import { Building2, Package, Palette, Phone, Mail, CheckCircle, ArrowRight, Users, Leaf } from 'lucide-react';

const packages = [
  {
    name: 'Starter',
    plants: 5,
    price: 2999,
    priceLabel: '₹2,999',
    popular: false,
    features: ['5 curated plants', 'Custom ribbon & card', 'Care guide booklet', 'Standard delivery across India', 'Basic branding'],
  },
  {
    name: 'Growth',
    plants: 15,
    price: 7499,
    priceLabel: '₹7,499',
    popular: true,
    features: ['15 premium plants', 'Custom branded packaging', 'Handwritten cards', 'Priority delivery', 'Logo on pots', '1 month care support'],
  },
  {
    name: 'Enterprise',
    plants: 50,
    price: 0,
    priceLabel: 'Custom',
    popular: false,
    features: ['50+ hand-picked plants', 'Full custom branding', 'Personal account manager', 'Express delivery nationwide', 'Custom pot engraving', 'Quarterly replenishment'],
  },
];

const occasions = ['Employee Onboarding', 'Client Appreciation', 'Festival Gifting', 'Office Décor', 'Product Launch', 'Conference Giveaways', 'Anniversary Celebrations', 'Custom Event'];

export function CorporateGifting() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ company: '', name: '', email: '', phone: '', occasion: '', quantity: '', message: '' });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    setSubmitted(true);
  }

  return (
    <div style={{ background: 'var(--color-background)', minHeight: '100vh' }}>
      {/* Hero */}
      <div className="py-24 px-6 text-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0D1F14, #1A4731)' }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 70% 30%, #C9952A, transparent 50%)' }} />
        <div className="relative z-10 max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ background: 'rgba(201,168,76,0.2)' }}>
              <Building2 size={14} style={{ color: '#C9952A' }} />
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#C9952A', fontWeight: 500 }}>Corporate Gifting Program</span>
            </div>
            <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, fontSize: 'clamp(36px, 5vw, 60px)', color: 'white', lineHeight: 1.2 }}>
              Gift Green.<br /><span style={{ color: '#C9952A' }}>Gift Meaningful.</span>
            </h1>
            <p className="mt-6 max-w-xl mx-auto" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '17px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.7 }}>
              Make your brand unforgettable with beautifully curated plant gifts. Perfect for employees, clients, and events across India.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Stats */}
      <div className="py-12 px-6" style={{ background: '#FAF8F3' }}>
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: Users, value: '150+', label: 'Corporate Clients' },
            { icon: Package, value: '5,000+', label: 'Gifts Delivered' },
            { icon: Leaf, value: '100%', label: 'Live Plant Guarantee' },
            { icon: Building2, value: '48hr', label: 'Custom Turnaround' },
          ].map(s => (
            <div key={s.label}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ background: 'rgba(26,71,49,0.1)' }}>
                <s.icon size={22} style={{ color: '#1A4731' }} />
              </div>
              <p style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, fontSize: '28px', color: '#1A4731' }}>{s.value}</p>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#4a6741' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Packages */}
      <div className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, fontSize: '40px', color: 'var(--color-foreground)' }}>Gifting Packages</h2>
            <p className="mt-3" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '16px', color: 'var(--color-muted-foreground)' }}>All packages include custom branding and nationwide delivery</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {packages.map((pkg, i) => (
              <motion.div
                key={pkg.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative rounded-2xl p-8"
                style={{
                  background: pkg.popular ? '#1A4731' : 'var(--color-card)',
                  border: pkg.popular ? 'none' : '1px solid var(--color-border)',
                  boxShadow: pkg.popular ? '0 20px 60px rgba(26,71,49,0.3)' : undefined,
                }}
              >
                {pkg.popular && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-white" style={{ background: '#C9952A', fontFamily: 'DM Sans, sans-serif', fontSize: '12px', fontWeight: 700 }}>
                    Most Popular
                  </span>
                )}
                <div className="mb-6">
                  <Package size={32} style={{ color: pkg.popular ? '#C9952A' : '#1A4731' }} />
                </div>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 600, fontSize: '26px', color: pkg.popular ? 'white' : 'var(--color-foreground)' }}>{pkg.name}</h3>
                <p className="mt-1" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: pkg.popular ? 'rgba(255,255,255,0.7)' : 'var(--color-muted-foreground)' }}>{pkg.plants}{pkg.price === 0 ? '+' : ''} plants included</p>
                <div className="mt-4 mb-6">
                  <span style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 600, fontSize: '40px', color: pkg.popular ? 'white' : '#1A4731' }}>{pkg.priceLabel}</span>
                  {pkg.price > 0 && <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: pkg.popular ? 'rgba(255,255,255,0.6)' : 'var(--color-muted-foreground)' }}> / bundle</span>}
                </div>
                <ul className="space-y-3 mb-8">
                  {pkg.features.map(feat => (
                    <li key={feat} className="flex items-center gap-2">
                      <CheckCircle size={16} style={{ color: pkg.popular ? '#C9952A' : '#1A4731', flexShrink: 0 }} />
                      <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: pkg.popular ? 'rgba(255,255,255,0.85)' : 'var(--color-foreground)' }}>{feat}</span>
                    </li>
                  ))}
                </ul>
                <a href="#inquiry">
                  <button
                    className="w-full py-3 rounded-xl flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
                    style={{
                      background: pkg.popular ? '#C9952A' : '#1A4731',
                      color: 'white',
                      fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '14px',
                    }}
                  >
                    Get This Package <ArrowRight size={15} />
                  </button>
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Occasions */}
      <div className="py-16 px-6" style={{ background: 'var(--color-secondary)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="mb-4" style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, fontSize: '36px', color: 'var(--color-foreground)' }}>Perfect For Every Occasion</h2>
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {occasions.map(o => (
              <span key={o} className="px-4 py-2 rounded-full" style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'var(--color-foreground)' }}>
                {o}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Customization */}
      <div className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, fontSize: '36px', color: 'var(--color-foreground)' }}>Full Customization</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Palette, title: 'Custom Branding', desc: 'Logo on pots, custom ribbons, branded packaging, and personalized message cards.' },
              { icon: Package, title: 'Plant Selection', desc: 'Choose from 120+ plant varieties or let our experts curate the perfect mix for your brand.' },
              { icon: Building2, title: 'Bulk Discounts', desc: 'Special pricing for orders of 50+ units. The more you order, the more you save.' },
            ].map(f => (
              <div key={f.title} className="text-center p-6 rounded-2xl" style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(26,71,49,0.1)' }}>
                  <f.icon size={26} style={{ color: '#1A4731' }} />
                </div>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 600, fontSize: '20px', color: 'var(--color-foreground)' }}>{f.title}</h3>
                <p className="mt-2" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'var(--color-muted-foreground)', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Inquiry Form */}
      <div id="inquiry" className="py-20 px-6" style={{ background: '#FAF8F3' }}>
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, fontSize: '36px', color: '#1A4731' }}>Request a Quote</h2>
            <p className="mt-3" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '15px', color: '#4a6741' }}>Our team will reach out within 24 hours</p>
          </div>

          {submitted ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center p-12 rounded-2xl" style={{ background: 'white' }}>
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(26,71,49,0.1)' }}>
                <CheckCircle size={40} style={{ color: '#1A4731' }} />
              </div>
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, fontSize: '28px', color: '#1A4731' }}>Inquiry Received!</h3>
              <p className="mt-3" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '15px', color: '#4a6741' }}>Our corporate gifting team will contact you within 24 hours.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="p-8 rounded-2xl space-y-4" style={{ background: 'white' }}>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#4a6741', fontWeight: 600 }}>Company Name *</label>
                  <input required value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} className="mt-1 w-full px-4 py-3 rounded-xl outline-none" style={{ background: '#FAF8F3', border: '1px solid rgba(26,71,49,0.2)', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: '#1A4731' }} placeholder="Acme Corp" />
                </div>
                <div>
                  <label style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#4a6741', fontWeight: 600 }}>Contact Name *</label>
                  <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="mt-1 w-full px-4 py-3 rounded-xl outline-none" style={{ background: '#FAF8F3', border: '1px solid rgba(26,71,49,0.2)', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: '#1A4731' }} placeholder="Your name" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#4a6741', fontWeight: 600 }}>Email *</label>
                  <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="mt-1 w-full px-4 py-3 rounded-xl outline-none" style={{ background: '#FAF8F3', border: '1px solid rgba(26,71,49,0.2)', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: '#1A4731' }} placeholder="you@company.com" />
                </div>
                <div>
                  <label style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#4a6741', fontWeight: 600 }}>Phone</label>
                  <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="mt-1 w-full px-4 py-3 rounded-xl outline-none" style={{ background: '#FAF8F3', border: '1px solid rgba(26,71,49,0.2)', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: '#1A4731' }} placeholder="+91 XXXXX XXXXX" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#4a6741', fontWeight: 600 }}>Occasion</label>
                  <select value={form.occasion} onChange={e => setForm({ ...form, occasion: e.target.value })} className="mt-1 w-full px-4 py-3 rounded-xl outline-none" style={{ background: '#FAF8F3', border: '1px solid rgba(26,71,49,0.2)', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: '#1A4731' }}>
                    <option value="">Select occasion</option>
                    {occasions.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#4a6741', fontWeight: 600 }}>Estimated Quantity</label>
                  <input value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} className="mt-1 w-full px-4 py-3 rounded-xl outline-none" style={{ background: '#FAF8F3', border: '1px solid rgba(26,71,49,0.2)', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: '#1A4731' }} placeholder="e.g. 50 units" />
                </div>
              </div>
              <div>
                <label style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#4a6741', fontWeight: 600 }}>Additional Requirements</label>
                <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={4} className="mt-1 w-full px-4 py-3 rounded-xl outline-none resize-none" style={{ background: '#FAF8F3', border: '1px solid rgba(26,71,49,0.2)', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: '#1A4731' }} placeholder="Tell us about your branding requirements, delivery timeline, etc." />
              </div>
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="w-full py-4 rounded-xl text-white"
                style={{ background: '#1A4731', fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '15px', opacity: loading ? 0.7 : 1 }}
              >
                {loading ? 'Submitting...' : 'Request a Quote →'}
              </motion.button>
            </form>
          )}

          {/* Direct Contact */}
          <div className="mt-8 grid sm:grid-cols-2 gap-4">
            <a href="tel:6392826369" className="flex items-center gap-3 p-4 rounded-xl transition-shadow hover:shadow-md" style={{ background: 'white' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(26,71,49,0.1)' }}>
                <Phone size={18} style={{ color: '#1A4731' }} />
              </div>
              <div>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '13px', color: '#1A4731' }}>Pranav Ayush</p>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#4a6741' }}>+91 6392826369</p>
              </div>
            </a>
            <a href="tel:9354447494" className="flex items-center gap-3 p-4 rounded-xl transition-shadow hover:shadow-md" style={{ background: 'white' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(26,71,49,0.1)' }}>
                <Phone size={18} style={{ color: '#1A4731' }} />
              </div>
              <div>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '13px', color: '#1A4731' }}>Vinayak Raj</p>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#4a6741' }}>+91 9354447494</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
