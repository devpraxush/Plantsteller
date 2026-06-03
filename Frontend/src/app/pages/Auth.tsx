import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Leaf, Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function Auth() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useApp();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    if (mode === 'signup' && !name) { setError('Please enter your name.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }

    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    login(email, mode === 'signup' ? name : email.split('@')[0]);
    setLoading(false);
    navigate('/');
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--color-background)' }}>
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-16 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0D1F14, #1A4731)' }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 30% 70%, #C9A84C, transparent 50%)' }} />
        <div className="relative z-10 text-center">
          <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8" style={{ background: 'rgba(201,168,76,0.2)' }}>
            <Leaf size={44} style={{ color: '#C9A84C' }} />
          </div>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, fontSize: '40px', color: 'white', lineHeight: 1.2 }}>
            Welcome to<br />PlantSteller
          </h2>
          <p className="mt-5 max-w-xs" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '16px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>
            Join India's most loved plant community. Discover, shop, and grow your plant family.
          </p>
          <div className="mt-10 space-y-3">
            {['🌿 Personalized AI recommendations', '🛒 Easy one-click checkout', '🌸 Exclusive member deals', '💬 Plant care community'].map(feat => (
              <p key={feat} style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>{feat}</p>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Logo for mobile */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <Leaf size={28} style={{ color: '#1A4731' }} />
            <span style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, fontSize: '22px', color: '#1A4731' }}>PlantSteller</span>
          </div>

          {/* Tab toggle */}
          <div className="flex gap-1 p-1 rounded-xl mb-8" style={{ background: 'var(--color-secondary)' }}>
            {(['login', 'signup'] as const).map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); }}
                className="flex-1 py-2.5 rounded-lg capitalize transition-all"
                style={{
                  background: mode === m ? '#1A4731' : 'transparent',
                  color: mode === m ? 'white' : 'var(--color-muted-foreground)',
                  fontFamily: 'DM Sans, sans-serif', fontWeight: 500, fontSize: '14px',
                }}
              >
                {m === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={mode} initial={{ opacity: 0, x: mode === 'login' ? -20 : 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
              <h1 className="mb-2" style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, fontSize: '32px', color: 'var(--color-foreground)' }}>
                {mode === 'login' ? 'Welcome back 🌿' : 'Join PlantSteller 🌱'}
              </h1>
              <p className="mb-8" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'var(--color-muted-foreground)' }}>
                {mode === 'login' ? 'Sign in to your PlantSteller account' : 'Create your free account today'}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'signup' && (
                  <div className="relative">
                    <User size={17} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-muted-foreground)' }} />
                    <input
                      type="text"
                      placeholder="Your name"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl outline-none"
                      style={{ background: 'var(--color-secondary)', border: '1px solid var(--color-border)', color: 'var(--color-foreground)', fontFamily: 'DM Sans, sans-serif', fontSize: '14px' }}
                    />
                  </div>
                )}
                <div className="relative">
                  <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-muted-foreground)' }} />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl outline-none"
                    style={{ background: 'var(--color-secondary)', border: '1px solid var(--color-border)', color: 'var(--color-foreground)', fontFamily: 'DM Sans, sans-serif', fontSize: '14px' }}
                  />
                </div>
                <div className="relative">
                  <Lock size={17} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-muted-foreground)' }} />
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-3.5 rounded-xl outline-none"
                    style={{ background: 'var(--color-secondary)', border: '1px solid var(--color-border)', color: 'var(--color-foreground)', fontFamily: 'DM Sans, sans-serif', fontSize: '14px' }}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-muted-foreground)' }}>
                    {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>

                {error && (
                  <p className="text-sm" style={{ color: '#ef4444', fontFamily: 'DM Sans, sans-serif', fontSize: '13px' }}>{error}</p>
                )}

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white transition-opacity"
                  style={{ background: '#1A4731', fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '15px', opacity: loading ? 0.7 : 1 }}
                >
                  {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
                  {!loading && <ArrowRight size={16} />}
                </motion.button>
              </form>

              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} />
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'var(--color-muted-foreground)' }}>or continue with</span>
                <div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Google', icon: '🔵' },
                  { label: 'Apple', icon: '🍎' },
                ].map(provider => (
                  <button
                    key={provider.label}
                    onClick={() => { login(`user@${provider.label.toLowerCase()}.com`, `Plant Lover`); navigate('/'); }}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl transition-colors hover:border-green-600"
                    style={{ border: '1px solid var(--color-border)', background: 'var(--color-card)', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'var(--color-foreground)' }}
                  >
                    {provider.icon} {provider.label}
                  </button>
                ))}
              </div>

              <p className="mt-6 text-center" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'var(--color-muted-foreground)' }}>
                {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                <button
                  onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}
                  style={{ color: '#1A4731', fontWeight: 600 }}
                >
                  {mode === 'login' ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
