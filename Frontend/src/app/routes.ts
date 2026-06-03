import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Wishlist } from './pages/Wishlist';
import { Auth } from './pages/Auth';
import { Community } from './pages/Community';
import { CorporateGifting } from './pages/CorporateGifting';
import { Support } from './pages/Support';
import { NotFound } from './pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: 'shop', Component: Shop },
      { path: 'shop/:id', Component: ProductDetail },
      { path: 'cart', Component: Cart },
      { path: 'wishlist', Component: Wishlist },
      { path: 'login', Component: Auth },
      { path: 'auth', Component: Auth },
      { path: 'community', Component: Community },
      { path: 'gifting', Component: CorporateGifting },
      { path: 'corporate-gifting', Component: CorporateGifting },
      { path: 'support', Component: Support },
      { path: '*', Component: NotFound },
    ],
  },
]);
