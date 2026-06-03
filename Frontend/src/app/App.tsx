import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AppProvider } from './context/AppContext';
import { Chatbot } from './components/Chatbot';

export default function App() {
  return (
    <AppProvider>
      <RouterProvider router={router} />
      <Chatbot />
    </AppProvider>
  );
}
