import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Phone, Mail, MessageCircle, CheckCircle, Search } from 'lucide-react';

const faqs = [
  {
    category: 'Orders & Shipping',
    items: [
      { q: 'How long does delivery take?', a: 'We deliver within 3-5 business days for metros and 5-7 days for other cities. Express delivery (1-2 days) is available for ₹99 extra.' },
      { q: 'Do you ship across India?', a: 'Yes! We deliver to 500+ cities across India. Some remote areas may have additional delivery charges.' },
      { q: 'How are plants packed for shipping?', a: 'All plants are carefully packed with breathable materials, moisture-retaining gel packs, and secure padding to ensure they arrive healthy and stress-free.' },
      { q: 'Can I track my order?', a: 'Yes! Once your order ships, you\'ll receive a tracking link via email and WhatsApp. You can also track from your account dashboard.' },
    ],
  },
  {
    category: 'Plants & Care',
    items: [
      { q: 'Are your plants guaranteed healthy?', a: 'Absolutely! All plants are inspected before shipment. If your plant arrives damaged or unhealthy, we\'ll replace it free of charge within 48 hours of delivery.' },
      { q: 'What if my plant has pests?', a: 'Contact us within 7 days of delivery with photos. We\'ll guide you through treatment and replace the plant if necessary, completely free.' },
      { q: 'Do you provide care guides?', a: 'Yes! Every order includes a detailed care guide. Our AI chatbot is also available 24/7 for personalized care advice specific to your plant and environment.' },
      { q: 'Can I return a plant?', a: 'If your plant arrives in poor condition, we\'ll replace or refund it. We don\'t accept returns of healthy plants as they are living beings.' },
    ],
  },
  {
    category: 'Payments & Accounts',
    items: [
      { q: 'What payment methods do you accept?', a: 'We accept UPI (GPay, PhonePe, Paytm), credit/debit cards, net banking, and Cash on Delivery for orders under ₹2000.' },
      { q: 'Is my payment information secure?', a: 'Yes, all payments are processed through secure, PCI-compliant payment gateways. We never store your card details.' },
      { q: 'Can I cancel my order?', a: 'Orders can be cancelled within 2 hours of placement. After that, plants may have already been prepared for dispatch.' },
      { q: 'How do I use a discount code?', a: 'Enter your discount code at checkout in the "Promo Code" field. Codes cannot be applied retroactively to placed orders.' },
    ],
  },
];

export function Support() {
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const filteredFaqs = faqs.map(cat => ({
    ...cat,
    items: cat.items.filter(item =>
      !search || item.q.toLowerCase().includes(search.toLowerCase()) || item.a.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter(cat => cat.items.length > 0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    setSubmitted(true);
  }

  return (
    <div style={{ background: 'var(--color-background)', minHeight: '100vh' }}>
      {/* Header */}
      <div className="py-20 px-6 text-center" style={{ background: 'linear-gradient(to bottom, #0D1F14, #1A4731)' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, fontSize: '48px', color: 'white' }}>Help & Support</h1>
          <p className="mt-3" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '16px', color: 'rgba(255,255,255,0.7)' }}>We're here to help your plants and your experience thrive</p>
          <div className="relative max-w-md mx-auto mt-8">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-xl outline-none"
              style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', fontFamily: 'DM Sans, sans-serif', fontSize: '14px' }}
            />
          </div>
        </motion.div>
      </div>

      {/* Quick contact */}
      <div className="py-12 px-6" style={{ background: 'var(--color-secondary)' }}>
        <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-4">
          {[
            { icon: MessageCircle, label: 'WhatsApp', value: 'Chat with us', href: 'https://wa.me/916392826369', color: '#25D366' },
            { icon: Phone, label: 'Call Us', value: '+91 6392826369', href: 'tel:6392826369', color: '#1A4731' },
            { icon: Mail, label: 'Email Us', value: 'pranavayush8@gmail.com', href: 'mailto:pranavayush8@gmail.com', color: '#4f46e5' },
          ].map(c => (
            <a key={c.label} href={c.href} target={c.label === 'WhatsApp' ? '_blank' : undefined} rel="noreferrer"
              className="flex items-center gap-3 p-4 rounded-xl transition-shadow hover:shadow-md"
              style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${c.color}15` }}>
                <c.icon size={22} style={{ color: c.color }} />
              </div>
              <div>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '13px', color: 'var(--color-foreground)' }}>{c.label}</p>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'var(--color-muted-foreground)' }}>{c.value}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="mb-12 text-center" style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, fontSize: '36px', color: 'var(--color-foreground)' }}>Frequently Asked Questions</h2>

          {filteredFaqs.length === 0 ? (
            <p className="text-center py-12" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '15px', color: 'var(--color-muted-foreground)' }}>No FAQs matching "{search}"</p>
          ) : (
            <div className="space-y-10">
              {filteredFaqs.map(cat => (
                <div key={cat.category}>
                  <h3 className="mb-4" style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '13px', color: '#1A4731', textTransform: 'uppercase', letterSpacing: '1px' }}>{cat.category}</h3>
                  <div className="space-y-2">
                    {cat.items.map(item => {
                      const isOpen = openFaq === item.q;
                      return (
                        <div key={item.q} className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--color-border)', background: 'var(--color-card)' }}>
                          <button
                            onClick={() => setOpenFaq(isOpen ? null : item.q)}
                            className="w-full flex items-center justify-between p-5 text-left"
                          >
                            <span style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 500, fontSize: '15px', color: 'var(--color-foreground)' }}>{item.q}</span>
                            <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                              <ChevronDown size={18} style={{ color: 'var(--color-muted-foreground)', flexShrink: 0 }} />
                            </motion.div>
                          </button>
                          <AnimatePresence initial={false}>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <p className="px-5 pb-5" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'var(--color-muted-foreground)', lineHeight: 1.7 }}>{item.a}</p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Contact Form */}
      <div className="py-20 px-6" style={{ background: 'var(--color-secondary)' }}>
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, fontSize: '36px', color: 'var(--color-foreground)' }}>Still Need Help?</h2>
            <p className="mt-3" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '15px', color: 'var(--color-muted-foreground)' }}>Send us a message and we'll get back within 24 hours</p>
          </div>

          {submitted ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center p-12 rounded-2xl" style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
              <CheckCircle size={48} style={{ color: '#1A4731', margin: '0 auto 16px' }} />
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, fontSize: '26px', color: 'var(--color-foreground)' }}>Message Sent!</h3>
              <p className="mt-3" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '15px', color: 'var(--color-muted-foreground)' }}>We'll respond to {form.email} within 24 hours.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="p-8 rounded-2xl space-y-4" style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'var(--color-muted-foreground)', fontWeight: 600 }}>Name *</label>
                  <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="mt-1 w-full px-4 py-3 rounded-xl outline-none" style={{ background: 'var(--color-secondary)', border: '1px solid var(--color-border)', color: 'var(--color-foreground)', fontFamily: 'DM Sans, sans-serif', fontSize: '14px' }} placeholder="Your name" />
                </div>
                <div>
                  <label style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'var(--color-muted-foreground)', fontWeight: 600 }}>Email *</label>
                  <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="mt-1 w-full px-4 py-3 rounded-xl outline-none" style={{ background: 'var(--color-secondary)', border: '1px solid var(--color-border)', color: 'var(--color-foreground)', fontFamily: 'DM Sans, sans-serif', fontSize: '14px' }} placeholder="you@email.com" />
                </div>
              </div>
              <div>
                <label style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'var(--color-muted-foreground)', fontWeight: 600 }}>Subject *</label>
                <input required value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="mt-1 w-full px-4 py-3 rounded-xl outline-none" style={{ background: 'var(--color-secondary)', border: '1px solid var(--color-border)', color: 'var(--color-foreground)', fontFamily: 'DM Sans, sans-serif', fontSize: '14px' }} placeholder="How can we help?" />
              </div>
              <div>
                <label style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'var(--color-muted-foreground)', fontWeight: 600 }}>Message *</label>
                <textarea required value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={5} className="mt-1 w-full px-4 py-3 rounded-xl outline-none resize-none" style={{ background: 'var(--color-secondary)', border: '1px solid var(--color-border)', color: 'var(--color-foreground)', fontFamily: 'DM Sans, sans-serif', fontSize: '14px' }} placeholder="Tell us about your issue or question..." />
              </div>
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="w-full py-4 rounded-xl text-white"
                style={{ background: '#1A4731', fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '15px', opacity: loading ? 0.7 : 1 }}
              >
                {loading ? 'Sending...' : 'Send Message →'}
              </motion.button>
            </form>
          )}
        </div>
      </div>

      {/* Team Contacts */}
      <div className="py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="mb-8" style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, fontSize: '30px', color: 'var(--color-foreground)' }}>Meet Our Team</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { name: 'Pranav Ayush', role: 'Co-Founder & Plant Expert', phone: '6392826369', email: 'pranavayush8@gmail.com' },
              { name: 'Vinayak Raj', role: 'Co-Founder & Operations', phone: '9354447494', email: 'vinayakraj201@gmail.com' },
            ].map(m => (
              <div key={m.name} className="p-6 rounded-2xl" style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#1A4731', color: 'white', fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, fontSize: '24px' }}>
                  {m.name[0]}
                </div>
                <p style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 600, fontSize: '18px', color: 'var(--color-foreground)' }}>{m.name}</p>
                <p className="mb-4" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'var(--color-muted-foreground)' }}>{m.role}</p>
                <div className="space-y-2">
                  <a href={`tel:${m.phone}`} className="flex items-center justify-center gap-2 hover:text-green-700 transition-colors" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'var(--color-foreground)' }}>
                    <Phone size={15} style={{ color: '#1A4731' }} /> +91 {m.phone}
                  </a>
                  <a href={`mailto:${m.email}`} className="flex items-center justify-center gap-2 hover:text-green-700 transition-colors" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'var(--color-foreground)' }}>
                    <Mail size={15} style={{ color: '#1A4731' }} /> {m.email}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
