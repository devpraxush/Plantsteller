import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, MessageCircle, Share2, Plus, X, MapPin, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';

const SERIF = 'Cormorant Garamond, serif';
const SANS = 'DM Sans, sans-serif';
const GREEN = '#1A4731';

interface Post {
  id: string;
  author: string;
  city: string;
  avatar: string;
  image: string;
  caption: string;
  plant: string;
  rating: number;
  badge: string;
  likes: number;
  liked: boolean;
  comments: { author: string; text: string }[];
  timeAgo: string;
}

const WHY_SHARE = [
  { emoji: '🌱', text: 'Your review helps thousands of plant lovers across India find their perfect plant' },
  { emoji: '📖', text: 'Share your growth journey — your experience becomes someone else\'s guide' },
  { emoji: '🏅', text: 'Earn PlantSteller Community badges for every review you post' },
  { emoji: '🌦️', text: 'Help us understand what thrives in your city\'s climate' },
];

const BADGES = [
  { emoji: '🌱', label: 'Seedling', req: '1 post' },
  { emoji: '🌿', label: 'Grower', req: '5 posts' },
  { emoji: '🌳', label: 'Garden Master', req: '20 posts' },
];

function PlantSVGIllustration() {
  return (
    <svg width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="90" cy="155" rx="40" ry="8" fill="#e4ece4" />
      <rect x="84" y="110" width="12" height="50" rx="6" fill="#1A4731" opacity="0.6" />
      <ellipse cx="90" cy="95" rx="35" ry="40" fill="#2d6a4f" opacity="0.8" />
      <ellipse cx="65" cy="108" rx="22" ry="28" fill="#40916c" opacity="0.7" transform="rotate(-20 65 108)" />
      <ellipse cx="115" cy="108" rx="22" ry="28" fill="#40916c" opacity="0.7" transform="rotate(20 115 108)" />
      <ellipse cx="90" cy="75" rx="20" ry="25" fill="#52b788" opacity="0.8" />
      {/* Speech bubble */}
      <rect x="105" y="28" width="68" height="40" rx="12" fill="white" stroke="#1A4731" strokeWidth="2" />
      <polygon points="115,68 125,68 120,78" fill="white" stroke="#1A4731" strokeWidth="2" strokeLinejoin="round" />
      <text x="118" y="52" fontFamily="DM Sans, sans-serif" fontSize="11" fill="#1A4731" fontWeight="600">Share your</text>
      <text x="118" y="64" fontFamily="DM Sans, sans-serif" fontSize="11" fill="#1A4731" fontWeight="600">story 🌿</text>
    </svg>
  );
}

export function Community() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [activePost, setActivePost] = useState<Post | null>(null);
  const [commentText, setCommentText] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newCaption, setNewCaption] = useState('');
  const [newPlant, setNewPlant] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newRating, setNewRating] = useState(5);
  const { user } = useApp();

  const postCount = posts.length;
  const userBadge = postCount >= 20 ? BADGES[2] : postCount >= 5 ? BADGES[1] : postCount >= 1 ? BADGES[0] : null;

  function toggleLike(id: string) {
    setPosts(prev => prev.map(p =>
      p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p
    ));
  }

  function addComment(postId: string) {
    if (!commentText.trim()) return;
    const authorName = user?.name || 'Plant Lover';
    setPosts(prev => prev.map(p =>
      p.id === postId ? { ...p, comments: [...p.comments, { author: authorName, text: commentText }] } : p
    ));
    if (activePost?.id === postId) {
      setActivePost(prev => prev ? { ...prev, comments: [...prev.comments, { author: user?.name || 'Plant Lover', text: commentText }] } : null);
    }
    setCommentText('');
  }

  function submitPost() {
    if (!newCaption.trim()) return;
    const images = [
      'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=600&q=80',
      'https://images.unsplash.com/photo-1604762511431-6280a12cb835?w=600&q=80',
      'https://images.unsplash.com/photo-1643670915600-57e018da570e?w=600&q=80',
      'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=600&q=80',
    ];
    const newPostCount = posts.length + 1;
    const badge = newPostCount >= 20 ? '🌳 Garden Master' : newPostCount >= 5 ? '🌿 Grower' : '🌱 Seedling';
    const newPost: Post = {
      id: Date.now().toString(),
      author: user?.name || 'Plant Lover',
      city: newCity || 'India',
      avatar: (user?.name || 'P')[0].toUpperCase(),
      image: images[Math.floor(Math.random() * images.length)],
      caption: newCaption,
      plant: newPlant || 'Houseplant',
      rating: newRating,
      badge,
      likes: 0,
      liked: false,
      comments: [],
      timeAgo: 'Just now',
    };
    setPosts(prev => [newPost, ...prev]);
    setShowModal(false);
    setNewCaption('');
    setNewPlant('');
    setNewCity('');
    setNewRating(5);
  }

  return (
    <div style={{ background: 'var(--color-background)', minHeight: '100vh' }}>
      {/* Header */}
      <div className="py-16 px-6 text-center" style={{ background: `linear-gradient(to bottom, #0D1F14, ${GREEN})` }}>
        <h1 style={{ fontFamily: SERIF, fontWeight: 600, fontSize: '52px', color: 'white' }}>Plant Community</h1>
        <p className="mt-3" style={{ fontFamily: SANS, fontSize: '16px', color: 'rgba(255,255,255,0.7)' }}>
          Share your plant journey with fellow plant lovers across India
        </p>
      </div>

      {/* Why Share section */}
      <div className="py-14 px-6" style={{ background: '#FAF8F3' }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-center mb-8" style={{ fontFamily: SERIF, fontWeight: 600, fontSize: '32px', color: GREEN }}>Why Share Your Story?</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {WHY_SHARE.map(w => (
              <div key={w.emoji} className="flex gap-4 p-5 rounded-2xl" style={{ background: 'white', border: '1px solid var(--color-border)' }}>
                <span style={{ fontSize: '24px', flexShrink: 0 }}>{w.emoji}</span>
                <p style={{ fontFamily: SANS, fontSize: '14px', color: '#3d5a3e', lineHeight: 1.6 }}>{w.text}</p>
              </div>
            ))}
          </div>

          {/* Community Badges */}
          <div className="mt-10 p-6 rounded-2xl text-center" style={{ background: 'white', border: '1px solid var(--color-border)' }}>
            <p className="mb-4" style={{ fontFamily: SANS, fontWeight: 600, fontSize: '13px', color: GREEN, textTransform: 'uppercase', letterSpacing: '1px' }}>Community Badges</p>
            <div className="flex justify-center gap-8 flex-wrap">
              {BADGES.map(b => (
                <div key={b.label} className="text-center">
                  <div style={{ fontSize: '36px' }}>{b.emoji}</div>
                  <p style={{ fontFamily: SANS, fontWeight: 600, fontSize: '13px', color: 'var(--color-foreground)', marginTop: '4px' }}>{b.label}</p>
                  <p style={{ fontFamily: SANS, fontSize: '11px', color: 'var(--color-muted-foreground)' }}>{b.req}</p>
                </div>
              ))}
            </div>
            {userBadge && (
              <p className="mt-4" style={{ fontFamily: SANS, fontSize: '13px', color: GREEN, fontWeight: 600 }}>
                You've earned: {userBadge.emoji} {userBadge.label}!
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10">
        {/* Post button */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          onClick={() => setShowModal(true)}
          className="w-full flex items-center gap-3 p-4 rounded-2xl mb-10"
          style={{ background: 'var(--color-card)', border: `2px dashed ${GREEN}40` }}
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: GREEN, color: 'white', fontFamily: SANS, fontWeight: 700 }}>
            {user ? user.name[0].toUpperCase() : '🌿'}
          </div>
          <span style={{ fontFamily: SANS, fontSize: '14px', color: 'var(--color-muted-foreground)' }}>Share your plant story...</span>
          <div className="ml-auto flex items-center gap-1 px-4 py-2 rounded-full text-white flex-shrink-0" style={{ background: GREEN, fontFamily: SANS, fontSize: '13px', fontWeight: 600 }}>
            <Plus size={14} /> Post Review
          </div>
        </motion.button>

        {/* Empty state */}
        {posts.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
            <div className="flex justify-center mb-6">
              <PlantSVGIllustration />
            </div>
            <h3 style={{ fontFamily: SERIF, fontWeight: 600, fontSize: '28px', color: 'var(--color-foreground)' }}>No stories yet!</h3>
            <p className="mt-3 max-w-sm mx-auto" style={{ fontFamily: SANS, fontSize: '15px', color: 'var(--color-muted-foreground)', lineHeight: 1.6 }}>
              Be the first to share your plant story and help plant lovers across India.
            </p>
            <motion.button
              whileHover={{ scale: 1.04 }}
              onClick={() => setShowModal(true)}
              className="mt-6 px-8 py-3 rounded-full text-white"
              style={{ background: GREEN, fontFamily: SANS, fontWeight: 600, fontSize: '15px' }}
            >
              Be the first to share your plant story →
            </motion.button>
          </motion.div>
        )}

        {/* Masonry-style feed */}
        {posts.length > 0 && (
          <div className="space-y-6">
            {posts.map(post => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl overflow-hidden"
                style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}
              >
                <div className="flex items-center gap-3 p-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: GREEN, color: 'white', fontFamily: SANS, fontWeight: 700 }}>
                    {post.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p style={{ fontFamily: SANS, fontWeight: 600, fontSize: '14px', color: 'var(--color-foreground)' }}>{post.author}</p>
                      <span style={{ fontFamily: SANS, fontSize: '11px', color: GREEN }}>{post.badge}</span>
                    </div>
                    <div className="flex items-center gap-1" style={{ color: 'var(--color-muted-foreground)' }}>
                      <MapPin size={11} />
                      <p style={{ fontFamily: SANS, fontSize: '12px' }}>{post.city} · {post.plant} · {post.timeAgo}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: post.rating }).map((_, i) => <Star key={i} size={12} className="fill-amber-400 stroke-amber-400" />)}
                  </div>
                </div>

                <div style={{ height: '340px', overflow: 'hidden' }}>
                  <img src={post.image} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>

                <div className="p-4">
                  <div className="flex items-center gap-4 mb-3">
                    <button onClick={() => toggleLike(post.id)} className="flex items-center gap-1.5 transition-transform hover:scale-110">
                      <Heart size={22} className={post.liked ? 'fill-red-500 stroke-red-500' : 'stroke-gray-400'} />
                      <span style={{ fontFamily: SANS, fontSize: '13px', color: 'var(--color-foreground)' }}>{post.likes}</span>
                    </button>
                    <button onClick={() => setActivePost(post)} className="flex items-center gap-1.5" style={{ color: 'var(--color-muted-foreground)' }}>
                      <MessageCircle size={22} />
                      <span style={{ fontFamily: SANS, fontSize: '13px' }}>{post.comments.length}</span>
                    </button>
                    <button className="ml-auto" style={{ color: 'var(--color-muted-foreground)' }}><Share2 size={20} /></button>
                  </div>
                  <p style={{ fontFamily: SANS, fontSize: '14px', color: 'var(--color-foreground)', lineHeight: 1.6 }}>
                    <strong>{post.author}</strong> {post.caption}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Post Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={e => e.stopPropagation()} className="w-full max-w-md rounded-2xl p-6" style={{ background: 'var(--color-card)' }}>
              <div className="flex items-center justify-between mb-6">
                <h2 style={{ fontFamily: SERIF, fontWeight: 700, fontSize: '26px', color: 'var(--color-foreground)' }}>Share Your Plant Story</h2>
                <button onClick={() => setShowModal(false)} style={{ color: 'var(--color-muted-foreground)' }}><X size={20} /></button>
              </div>

              <div className="space-y-3">
                <input type="text" placeholder="Plant name (e.g. Monstera)" value={newPlant} onChange={e => setNewPlant(e.target.value)} className="w-full px-4 py-3 rounded-xl outline-none" style={{ background: 'var(--color-secondary)', border: '1px solid var(--color-border)', color: 'var(--color-foreground)', fontFamily: SANS, fontSize: '14px' }} />
                <input type="text" placeholder="Your city" value={newCity} onChange={e => setNewCity(e.target.value)} className="w-full px-4 py-3 rounded-xl outline-none" style={{ background: 'var(--color-secondary)', border: '1px solid var(--color-border)', color: 'var(--color-foreground)', fontFamily: SANS, fontSize: '14px' }} />
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl" style={{ background: 'var(--color-secondary)', border: '1px solid var(--color-border)' }}>
                  <span style={{ fontFamily: SANS, fontSize: '13px', color: 'var(--color-muted-foreground)' }}>Rating:</span>
                  {[1, 2, 3, 4, 5].map(r => (
                    <button key={r} onClick={() => setNewRating(r)}>
                      <Star size={18} className={r <= newRating ? 'fill-amber-400 stroke-amber-400' : 'stroke-gray-300'} />
                    </button>
                  ))}
                </div>
                <textarea placeholder="Share your plant story — what works in your city, how it's grown, care tips..." value={newCaption} onChange={e => setNewCaption(e.target.value)} rows={4} className="w-full px-4 py-3 rounded-xl outline-none resize-none" style={{ background: 'var(--color-secondary)', border: '1px solid var(--color-border)', color: 'var(--color-foreground)', fontFamily: SANS, fontSize: '14px' }} />
                <button onClick={submitPost} className="w-full py-3.5 rounded-xl text-white" style={{ background: GREEN, fontFamily: SANS, fontWeight: 600, fontSize: '15px' }}>
                  Post Review 🌿
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comment modal */}
      <AnimatePresence>
        {activePost && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={() => setActivePost(null)}>
            <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} onClick={e => e.stopPropagation()} className="w-full max-w-md rounded-2xl overflow-hidden flex flex-col" style={{ background: 'var(--color-card)', maxHeight: '75vh' }}>
              <div className="flex items-center justify-between p-4" style={{ borderBottom: '1px solid var(--color-border)' }}>
                <p style={{ fontFamily: SANS, fontWeight: 600, fontSize: '15px', color: 'var(--color-foreground)' }}>Comments</p>
                <button onClick={() => setActivePost(null)} style={{ color: 'var(--color-muted-foreground)' }}><X size={18} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {activePost.comments.length === 0 ? (
                  <p className="text-center py-8" style={{ fontFamily: SANS, fontSize: '14px', color: 'var(--color-muted-foreground)' }}>No comments yet. Be first! 🌱</p>
                ) : activePost.comments.map((c, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: GREEN, color: 'white', fontSize: '12px', fontFamily: SANS, fontWeight: 600 }}>{c.author[0]}</div>
                    <div className="flex-1 p-3 rounded-xl" style={{ background: 'var(--color-secondary)' }}>
                      <p style={{ fontFamily: SANS, fontWeight: 600, fontSize: '12px', color: GREEN }}>{c.author}</p>
                      <p style={{ fontFamily: SANS, fontSize: '13px', color: 'var(--color-foreground)' }}>{c.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 flex gap-2" style={{ borderTop: '1px solid var(--color-border)' }}>
                <input type="text" value={commentText} onChange={e => setCommentText(e.target.value)} onKeyDown={e => e.key === 'Enter' && addComment(activePost.id)} placeholder="Add a comment..." className="flex-1 px-4 py-2.5 rounded-xl outline-none" style={{ background: 'var(--color-secondary)', border: '1px solid var(--color-border)', color: 'var(--color-foreground)', fontFamily: SANS, fontSize: '13px' }} />
                <button onClick={() => addComment(activePost.id)} className="px-4 py-2.5 rounded-xl text-white" style={{ background: GREEN, fontFamily: SANS, fontSize: '13px', fontWeight: 500 }}>Post</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
