import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Leaf, ShoppingCart, Sparkles, RotateCcw } from 'lucide-react';
import { plants, Plant } from '../data/plants';
import { useApp } from '../context/AppContext';

interface Message {
  id: string;
  role: 'user' | 'bot';
  text: string;
  plants?: Plant[];
}

type Step = 'greeting' | 'location' | 'season' | 'setup' | 'level' | 'recommend';

const STEPS: Record<Step, { question: string; options?: string[] }> = {
  greeting: { question: '' },
  location: {
    question: "🌍 What's your climate like?",
    options: ['Tropical / Hot & Humid', 'Temperate / Mild', 'Arid / Dry & Hot', 'Cold / Northern'],
  },
  season: {
    question: '🌸 What season are you shopping for?',
    options: ['Spring', 'Summer', 'Fall', 'Winter'],
  },
  setup: {
    question: '🏠 How\'s your home set up?',
    options: ['Bright sunny windows', 'Mostly indirect light', 'Low light spaces', 'Outdoor garden'],
  },
  level: {
    question: '🌱 What\'s your plant care experience?',
    options: ['Total beginner', 'Some experience', 'Green thumb', 'Plant obsessed'],
  },
  recommend: { question: '' },
};

function getRecommendations(answers: Record<string, string>): Plant[] {
  const scored = plants.map(p => {
    let score = 0;

    // Care level matching
    const level = answers.level || '';
    if ((level === 'Total beginner' || level === 'Some experience') && p.careLevel === 'easy') score += 3;
    if (level === 'Green thumb' && (p.careLevel === 'easy' || p.careLevel === 'moderate')) score += 2;
    if (level === 'Plant obsessed') score += 1;
    if (level !== 'Plant obsessed' && p.careLevel === 'expert') score -= 2;

    // Light matching
    const setup = answers.setup || '';
    if (setup === 'Bright sunny windows' && (p.light.includes('bright') || p.light.includes('direct'))) score += 2;
    if (setup === 'Mostly indirect light' && p.light.includes('indirect')) score += 2;
    if (setup === 'Low light spaces' && p.light.includes('Low')) score += 3;
    if (setup === 'Outdoor garden' && p.category === 'outdoor') score += 2;

    // Season matching
    const season = answers.season || '';
    if (p.season.includes(season)) score += 2;

    // Climate matching
    const climate = answers.location || '';
    if (climate === 'Tropical / Hot & Humid' && (p.category === 'tropical' || p.humidity.includes('7') || p.humidity.includes('8'))) score += 2;
    if (climate === 'Arid / Dry & Hot' && p.category === 'succulent') score += 3;
    if (climate === 'Cold / Northern' && p.temperature.includes('60')) score += 1;

    // Boost AI recommended
    if (p.aiRecommended) score += 1;

    return { plant: p, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(s => s.plant);
}

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [step, setStep] = useState<Step>('greeting');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [inputVal, setInputVal] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useApp();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (open && messages.length === 0) {
      setTimeout(() => {
        addBotMessage("🌿 Hi! I'm Leaf 🌿, your personal plant advisor. Tell me about your space and I'll find your perfect plant!", 'greeting');
      }, 400);
    }
  }, [open]);

  function addBotMessage(text: string, nextStep?: Step, plants?: Plant[]) {
    const msg: Message = {
      id: Date.now().toString(),
      role: 'bot',
      text,
      plants,
    };
    setMessages(prev => [...prev, msg]);
    if (nextStep) setStep(nextStep);
  }

  function handleOption(option: string) {
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: option };
    setMessages(prev => [...prev, userMsg]);

    const newAnswers = { ...answers, [step]: option };
    setAnswers(newAnswers);

    setTimeout(() => {
      const steps: Step[] = ['greeting', 'location', 'season', 'setup', 'level', 'recommend'];
      const currentIdx = steps.indexOf(step);

      if (step === 'level') {
        const recs = getRecommendations(newAnswers);
        addBotMessage(
          `✨ Based on your preferences, here are my top picks for you!`,
          'recommend',
          recs
        );
        setTimeout(() => {
          addBotMessage("Would you like to explore more plants or need help with care tips? Just type a question!");
        }, 600);
      } else {
        const nextStep = steps[currentIdx + 1] as Step;
        const { question } = STEPS[nextStep];
        addBotMessage(question, nextStep);
      }
    }, 300);
  }

  function handleSend() {
    if (!inputVal.trim()) return;
    const text = inputVal.trim();
    setInputVal('');

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text };
    setMessages(prev => [...prev, userMsg]);

    setTimeout(() => {
      const lower = text.toLowerCase();
      if (lower.includes('care') || lower.includes('water')) {
        addBotMessage("💧 Great question! Most indoor plants prefer to dry out slightly between waterings. A general rule: if the top inch of soil is dry, it's time to water. Let me know which plant you're asking about!");
      } else if (lower.includes('light') || lower.includes('sun')) {
        addBotMessage("☀️ Most houseplants love bright, indirect light near a window. Direct sun can scorch leaves. Low-light champs include Snake Plant, Peace Lily, and ZZ Plant!");
      } else if (lower.includes('beginner') || lower.includes('easy')) {
        addBotMessage("🌱 For beginners, I recommend Snake Plant, Golden Pothos, or ZZ Plant — they're nearly impossible to kill and look great!");
      } else if (lower.includes('purif') || lower.includes('air')) {
        addBotMessage("🌬️ Top air purifiers: Peace Lily, Boston Fern, and Snake Plant! They remove toxins like formaldehyde and benzene from indoor air.");
      } else {
        addBotMessage("I'm here to help with plant recommendations! You can ask about watering, light needs, beginner-friendly plants, or restart the quiz to get new recommendations. 🌿");
      }
    }, 400);
  }

  function restart() {
    setMessages([]);
    setStep('greeting');
    setAnswers({});
    setTimeout(() => {
      addBotMessage("🌿 Let's start fresh! I'll help you find the perfect plants for your space.", 'location');
      setTimeout(() => {
        addBotMessage(STEPS.location.question, 'location');
      }, 600);
    }, 300);
  }

  const currentOptions = step !== 'greeting' && step !== 'recommend' ? STEPS[step].options : undefined;
  const showOptions = currentOptions && messages.length > 0 && messages[messages.length - 1]?.role === 'bot';

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl"
        style={{ background: 'linear-gradient(135deg, #1A4731, #2d7a47)' }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={open ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <Leaf size={24} className="text-white" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center" style={{ fontSize: '9px', color: '#1A4731', fontWeight: 700 }}>AI</span>
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 flex flex-col rounded-2xl shadow-2xl overflow-hidden"
            style={{ width: '360px', height: '560px', background: 'var(--color-card)', border: '1px solid var(--color-border)' }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0" style={{ background: '#1A4731' }}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)' }}>
                <Sparkles size={18} className="text-white" />
              </div>
              <div className="flex-1">
                <p style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 600, fontSize: '15px', color: 'white' }}>Leaf</p>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: 'rgba(255,255,255,0.7)' }}>PlantSteller AI • Online</p>
              </div>
              <button onClick={restart} className="text-white/70 hover:text-white p-1" title="Restart">
                <RotateCcw size={16} />
              </button>
              <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white p-1">
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <AnimatePresence initial={false}>
                {messages.map(msg => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {msg.role === 'bot' ? (
                      <div className="flex gap-2 items-start">
                        <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5" style={{ background: '#1A4731' }}>
                          <Leaf size={12} className="text-white" />
                        </div>
                        <div className="rounded-2xl rounded-tl-sm px-3 py-2 max-w-[80%]" style={{ background: 'var(--color-secondary)', color: 'var(--color-foreground)' }}>
                          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', lineHeight: '1.5' }}>{msg.text}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-end">
                        <div className="rounded-2xl rounded-tr-sm px-3 py-2 max-w-[80%]" style={{ background: '#1A4731', color: 'white' }}>
                          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', lineHeight: '1.5' }}>{msg.text}</p>
                        </div>
                      </div>
                    )}

                    {/* Plant recommendation cards */}
                    {msg.plants && msg.plants.length > 0 && (
                      <div className="mt-2 space-y-2 ml-9">
                        {msg.plants.map(plant => (
                          <div key={plant.id} className="rounded-xl overflow-hidden flex gap-2 p-2" style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
                            <img src={plant.image} alt={plant.name} className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 600, fontSize: '13px', color: 'var(--color-foreground)' }} className="truncate">{plant.name}</p>
                              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: 'var(--color-muted-foreground)' }}>${plant.price.toFixed(2)}</p>
                              <button
                                onClick={() => addToCart(plant)}
                                className="mt-1 flex items-center gap-1 px-2 py-1 rounded-lg text-white transition-all hover:opacity-90"
                                style={{ background: '#1A4731', fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 500 }}
                              >
                                <ShoppingCart size={10} /> Add to Cart
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Quick reply options */}
              {showOptions && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-wrap gap-2 ml-9"
                >
                  {currentOptions!.map(opt => (
                    <button
                      key={opt}
                      onClick={() => handleOption(opt)}
                      className="px-3 py-1.5 rounded-full border transition-colors hover:border-green-600 hover:text-green-700"
                      style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', borderColor: 'var(--color-border)', color: 'var(--color-foreground)', background: 'var(--color-card)' }}
                    >
                      {opt}
                    </button>
                  ))}
                </motion.div>
              )}

              {/* Start button on greeting */}
              {step === 'greeting' && messages.length === 1 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="ml-9">
                  <button
                    onClick={() => {
                      const userMsg: Message = { id: Date.now().toString(), role: 'user', text: "Let's start!" };
                      setMessages(prev => [...prev, userMsg]);
                      setTimeout(() => addBotMessage(STEPS.location.question, 'location'), 300);
                    }}
                    className="px-4 py-2 rounded-full text-white"
                    style={{ background: '#1A4731', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 500 }}
                  >
                    Let's find my perfect plant! 🌿
                  </button>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 p-3 flex-shrink-0" style={{ borderTop: '1px solid var(--color-border)' }}>
              <input
                type="text"
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Ask about plants..."
                className="flex-1 px-3 py-2 rounded-xl outline-none"
                style={{
                  background: 'var(--color-secondary)',
                  color: 'var(--color-foreground)',
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '13px',
                  border: 'none',
                }}
              />
              <button
                onClick={handleSend}
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-opacity hover:opacity-80"
                style={{ background: '#1A4731' }}
              >
                <Send size={15} className="text-white" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
