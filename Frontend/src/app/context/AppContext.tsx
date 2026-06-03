import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Plant } from '../data/plants';

export interface CartItem {
  plant: Plant;
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AppContextType {
  // Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  // Cart
  cart: CartItem[];
  addToCart: (plant: Plant, quantity?: number) => void;
  removeFromCart: (plantId: string) => void;
  updateQuantity: (plantId: string, quantity: number) => void;
  cartTotal: number;
  cartCount: number;
  // Wishlist
  wishlist: Plant[];
  addToWishlist: (plant: Plant) => void;
  removeFromWishlist: (plantId: string) => void;
  isWishlisted: (plantId: string) => boolean;
  moveToCart: (plantId: string) => void;
  // Auth
  user: User | null;
  login: (email: string, name: string) => void;
  logout: () => void;
  // Cart drawer
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('plantsteller-theme');
    return (saved as 'light' | 'dark') || 'light';
  });
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('plantsteller-cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [wishlist, setWishlist] = useState<Plant[]>(() => {
    const saved = localStorage.getItem('plantsteller-wishlist');
    return saved ? JSON.parse(saved) : [];
  });
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('plantsteller-user');
    return saved ? JSON.parse(saved) : null;
  });
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('plantsteller-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('plantsteller-cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('plantsteller-wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  const addToCart = (plant: Plant, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(i => i.plant.id === plant.id);
      if (existing) {
        return prev.map(i => i.plant.id === plant.id ? { ...i, quantity: i.quantity + quantity } : i);
      }
      return [...prev, { plant, quantity }];
    });
    setCartOpen(true);
  };

  const removeFromCart = (plantId: string) => {
    setCart(prev => prev.filter(i => i.plant.id !== plantId));
  };

  const updateQuantity = (plantId: string, quantity: number) => {
    if (quantity <= 0) { removeFromCart(plantId); return; }
    setCart(prev => prev.map(i => i.plant.id === plantId ? { ...i, quantity } : i));
  };

  const cartTotal = cart.reduce((sum, i) => sum + i.plant.price * i.quantity, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  const addToWishlist = (plant: Plant) => {
    setWishlist(prev => prev.find(p => p.id === plant.id) ? prev : [...prev, plant]);
  };

  const removeFromWishlist = (plantId: string) => {
    setWishlist(prev => prev.filter(p => p.id !== plantId));
  };

  const isWishlisted = (plantId: string) => wishlist.some(p => p.id === plantId);

  const moveToCart = (plantId: string) => {
    const plant = wishlist.find(p => p.id === plantId);
    if (plant) { addToCart(plant); removeFromWishlist(plantId); }
  };

  const login = (email: string, name: string) => {
    const newUser: User = { id: Date.now().toString(), name, email };
    setUser(newUser);
    localStorage.setItem('plantsteller-user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('plantsteller-user');
  };

  return (
    <AppContext.Provider value={{
      theme, toggleTheme,
      cart, addToCart, removeFromCart, updateQuantity, cartTotal, cartCount,
      wishlist, addToWishlist, removeFromWishlist, isWishlisted, moveToCart,
      user, login, logout,
      cartOpen, setCartOpen,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
