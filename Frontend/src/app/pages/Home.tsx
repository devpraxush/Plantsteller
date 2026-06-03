import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowRight, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { plants } from '../data/plants';
import { PlantCard } from '../components/PlantCard';

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=1400&q=85',
  'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=1400&q=85',
  'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1400&q=85',
  'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=1400&q=85',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1400&q=85',
  'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=1400&q=85',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=85',
  'https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=1400&q=85',
];

const QUOTES = [
  { text: 'In every walk with nature, one receives far more than he seeks.', author: 'John Muir' },
  { text: 'A garden is a friend you can visit any time.', author: '' },
  { text: 'Plants give us oxygen for the lungs and for the soul.', author: '' },
  { text: 'To plant a garden is to believe in tomorrow.', author: 'Audrey Hepburn' },
  { text: 'The love of gardening is a seed once sown that never dies.', author: 'Gertrude Jekyll' },
  { text: 'A garden requires patient labor and attention. Plants do not grow merely to satisfy ambitions.', author: 'Liberty Hyde Bailey' },
  { text: 'He who plants a tree, plants hope.', author: 'Lucy Larcom' },
  { text: 'Gardens are not made by singing "Oh, how beautiful," and sitting in the shade.', author: 'Rudyard Kipling' },
  { text: 'Flowers always make people better, happier, and more helpful.', author: 'Luther Burbank' },
  { text: 'A tree is a tree — how many more do you need to look at?', author: 'Ronald Reagan (misquote) — we disagree.' },
  { text: 'The earth laughs in flowers.', author: 'Ralph Waldo Emerson' },
  { text: 'To forget how to dig the earth and tend the soil is to forget ourselves.', author: 'Mahatma Gandhi' },
  { text: 'Nature does not hurry, yet everything is accomplished.', author: 'Lao Tzu' },
  { text: 'In nature, nothing is perfect and everything is perfect.', author: 'Alice Walker' },
  { text: 'Adopt the pace of nature: her secret is patience.', author: 'Ralph Waldo Emerson' },
];

const SLOGANS = [
  'Your Perfect Plant is One Click Away',
  'Grow Something Beautiful Today',
  "India's Most Loved Plant Community",
];

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const HERO_IMAGE = getRandomItem(HERO_IMAGES);
const HERO_QUOTE = getRandomItem(QUOTES);

const SEASON_TABS = [
  { label: '🌞 Summer Picks', season: 'Summer' },
  { label: '🌧️ Monsoon Picks', season: 'Monsoon' },
  { label: '❄️ Winter Picks', season: 'Winter' },
  { label: '🌸 All Season', season: 'All Season' },
];

const features = [
  { emoji: '🌿', title: 'Curated Selection', desc: 'Hand-picked plants from the finest nurseries across India.' },
  { emoji: '✨', title: 'AI Recommendations', desc: 'Personalised plant picks based on your city, season and lifestyle.' },
  { emoji: '☀️', title: 'Expert Care Guides', desc: 'Step-by-step tips to keep every plant thriving in your home.' },
  { emoji: '💚', title: 'Live Plant Guarantee', desc: 'All plants inspected and guaranteed healthy on arrival.' },
];

const reviews = [
  { name: 'Priya S.', city: 'Mumbai', rating: 5, text: 'My Monstera arrived perfectly packed! The care guide was incredibly helpful.', plant: 'Monstera Deliciosa' },
  { name: 'Rahul M.', city: 'Bengaluru', rating: 5, text: 'The AI chatbot recommended the perfect plants for my low-light apartment!', plant: 'ZZ Plant' },
  { name: 'Ananya K.', city: 'Delhi', rating: 5, text: 'Absolutely love the community here. Found my new favourite — Bird of Paradise!', plant: 'Bird of Paradise' },
];

export function Home() {
  const [sloganIdx, setSloganIdx] = useState(0);
  const [activeSeason, setActiveSeason] = useState('Summer');
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });

  useEffect(() => {
    const interval = setInterval(() => {
      setSloganIdx(i => (i + 1) % SLOGANS.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const seasonalPlants = plants.filter(p =>
    p.season.includes(activeSeason) || (activeSeason === 'All Season' && p.season.includes('All Season'))
  ).slice(0, 8);

  return (
    <div>
      {/* Hero — full-screen rotating background */}
      <section className="relative flex items-center justify-center overflow-hidden" style={{ minHeight: '100vh' }}>
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
          style={{ backgroundImage: `url(${HERO_IMAGE})` }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(13,31,20,0.55) 0%, rgba(13,31,20,0.7) 60%, rgba(13,31,20,0.85) 100%)' }} />

        {/* Quote — bottom-left */}
        <div className="absolute bottom-10 left-8 right-8 sm:right-auto sm:max-w-sm z-10">
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 400, fontSize: '17px', color: 'rgba(255,255,255,0.8)', fontStyle: 'italic', lineHeight: 1.6, textShadow: '0 1px 8px rgba(0,0,0,0.4)' }}>
            "{HERO_QUOTE.text}"
          </p>
          {HERO_QUOTE.author && (
            <p className="mt-1" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.55)', letterSpacing: '0.5px' }}>
              — {HERO_QUOTE.author}
            </p>
          )}
        </div>

        {/* Center content */}
        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto" style={{ marginBottom: '80px' }}>
          <AnimatePresence mode="wait">
            <motion.h1
              key={sloganIdx}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.6 }}
              style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 600, fontSize: 'clamp(40px, 6vw, 76px)', color: 'white', lineHeight: 1.12, textShadow: '0 2px 16px rgba(0,0,0,0.3)' }}
            >
              {SLOGANS[sloganIdx]}
            </motion.h1>
          </AnimatePresence>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-5"
            style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '18px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.7 }}
          >
            Discover, shop and grow with India's most loved plant community.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-10 flex flex-wrap justify-center gap-4"
          >
            <Link to="/shop">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-8 py-4 rounded-full"
                style={{ background: '#C9952A', color: 'white', fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '16px' }}
              >
                Shop Plants <ArrowRight size={17} />
              </motion.button>
            </Link>
            <Link to="/community">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-8 py-4 rounded-full"
                style={{ border: '1.5px solid rgba(255,255,255,0.5)', color: 'white', fontFamily: 'DM Sans, sans-serif', fontWeight: 500, fontSize: '16px', background: 'rgba(255,255,255,0.08)' }}
              >
                Join Community
              </motion.button>
            </Link>
          </motion.div>

          {/* Slogan dots */}
          <div className="flex justify-center gap-2 mt-10">
            {SLOGANS.map((_, i) => (
              <button key={i} onClick={() => setSloganIdx(i)} className="transition-all" style={{ width: i === sloganIdx ? '24px' : '8px', height: '8px', borderRadius: '999px', background: i === sloganIdx ? '#C9952A' : 'rgba(255,255,255,0.35)' }} />
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6" style={{ background: 'var(--color-background)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 600, fontSize: '42px', color: 'var(--color-foreground)' }}>Why PlantSteller?</h2>
            <p className="mt-3" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '16px', color: 'var(--color-muted-foreground)' }}>Everything you need to grow a thriving plant collection</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-7 rounded-2xl"
                style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}
              >
                <div className="text-4xl mb-4">{f.emoji}</div>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 600, fontSize: '22px', color: 'var(--color-foreground)' }}>{f.title}</h3>
                <p className="mt-2" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'var(--color-muted-foreground)', lineHeight: 1.7 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Plants Carousel */}
      <section className="py-20 px-6" style={{ background: 'var(--color-secondary)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="mb-2" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: '#1A4731', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px' }}>Featured</p>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 600, fontSize: '40px', color: 'var(--color-foreground)' }}>Staff Picks</h2>
            </div>
            <div className="flex gap-2">
              <button onClick={() => emblaApi?.scrollPrev()} className="w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-green-800 hover:text-white" style={{ border: '1.5px solid #1A4731', color: '#1A4731' }}>
                <ChevronLeft size={18} />
              </button>
              <button onClick={() => emblaApi?.scrollNext()} className="w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-green-800 hover:text-white" style={{ border: '1.5px solid #1A4731', color: '#1A4731' }}>
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
          <div ref={emblaRef} className="overflow-hidden">
            <div className="flex gap-6">
              {plants.map(plant => (
                <div key={plant.id} style={{ flex: '0 0 280px', minWidth: 0 }}>
                  <PlantCard plant={plant} />
                </div>
              ))}
            </div>
          </div>
          <div className="mt-10 text-center">
            <Link to="/shop">
              <motion.button
                whileHover={{ scale: 1.04 }}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-white"
                style={{ background: '#1A4731', fontFamily: 'DM Sans, sans-serif', fontWeight: 500, fontSize: '15px' }}
              >
                View All Plants <ArrowRight size={16} />
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* Seasonal Shop */}
      <section className="py-20 px-6" style={{ background: 'var(--color-background)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 600, fontSize: '40px', color: 'var(--color-foreground)' }}>Shop by Season</h2>
            <p className="mt-3" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '15px', color: 'var(--color-muted-foreground)' }}>Plants curated for India's distinct seasons</p>
          </div>

          {/* Season tabs */}
          <div className="flex gap-3 overflow-x-auto pb-3 mb-10 justify-center flex-wrap">
            {SEASON_TABS.map(tab => (
              <button
                key={tab.season}
                onClick={() => setActiveSeason(tab.season)}
                className="px-5 py-2.5 rounded-full whitespace-nowrap transition-all"
                style={{
                  background: activeSeason === tab.season ? '#1A4731' : 'var(--color-card)',
                  color: activeSeason === tab.season ? 'white' : 'var(--color-foreground)',
                  border: `1px solid ${activeSeason === tab.season ? '#1A4731' : 'var(--color-border)'}`,
                  fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 500,
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Seasonal care note */}
          {activeSeason === 'Summer' && <p className="text-center mb-8" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'var(--color-muted-foreground)', fontStyle: 'italic' }}>🌞 Thrives in warm conditions — perfect for April–June</p>}
          {activeSeason === 'Monsoon' && <p className="text-center mb-8" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'var(--color-muted-foreground)', fontStyle: 'italic' }}>🌧️ Thrives in humidity — perfect for July–September</p>}
          {activeSeason === 'Winter' && <p className="text-center mb-8" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'var(--color-muted-foreground)', fontStyle: 'italic' }}>❄️ Adapts beautifully to cooler temperatures — October–February</p>}
          {activeSeason === 'All Season' && <p className="text-center mb-8" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'var(--color-muted-foreground)', fontStyle: 'italic' }}>🌸 Grows beautifully all year round in Indian climates</p>}

          <AnimatePresence mode="wait">
            <motion.div
              key={activeSeason}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {(seasonalPlants.length > 0 ? seasonalPlants : plants.slice(0, 8)).map(plant => (
                <PlantCard key={plant.id} plant={plant} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-20 px-6" style={{ background: 'var(--color-secondary)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 600, fontSize: '40px', color: 'var(--color-foreground)' }}>What Our Community Says</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {reviews.map((r, i) => (
              <motion.div
                key={r.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-7 rounded-2xl"
                style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: r.rating }).map((_, j) => (
                    <Star key={j} size={14} className="fill-amber-400 stroke-amber-400" />
                  ))}
                </div>
                <p className="mb-5" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '18px', color: 'var(--color-foreground)', lineHeight: 1.6, fontStyle: 'italic' }}>"{r.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#1A4731', color: 'white', fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '15px' }}>
                    {r.name[0]}
                  </div>
                  <div>
                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '14px', color: 'var(--color-foreground)' }}>{r.name}</p>
                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'var(--color-muted-foreground)' }}>{r.city} · {r.plant}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center" style={{ background: '#1A4731' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 600, fontSize: 'clamp(32px, 5vw, 52px)', color: 'white', lineHeight: 1.2 }}>
            Ready to grow your plant family?
          </h2>
          <p className="mt-4" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '17px', color: 'rgba(255,255,255,0.7)' }}>
            Join thousands of plant lovers across India.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/shop">
              <motion.button whileHover={{ scale: 1.05 }} className="px-10 py-4 rounded-full" style={{ background: '#C9952A', color: 'white', fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '16px' }}>
                Shop Now
              </motion.button>
            </Link>
            <Link to="/corporate-gifting">
              <motion.button whileHover={{ scale: 1.05 }} className="px-10 py-4 rounded-full" style={{ border: '1.5px solid rgba(255,255,255,0.4)', color: 'white', fontFamily: 'DM Sans, sans-serif', fontWeight: 500, fontSize: '16px', background: 'transparent' }}>
                Corporate Gifting
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
