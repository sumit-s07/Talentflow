import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';


async function enableMocking() {

  
 
  const { worker } = await import('./data/database/browser');
  const { seedDatabase } = await import('./data/database/seed');

  // Seding the IndexedDB with initial data if it's empty
  await seedDatabase();
  
  // start the MSW worker with the 'bypass' option for unhandled requests
  return worker.start({
    onUnhandledRequest: 'bypass',
  });
}


enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});