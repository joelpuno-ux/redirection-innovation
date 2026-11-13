import { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { KabyawEats } from './components/KabyawEats';
import { GoZeb } from './components/GoZeb';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { MerchantsList } from './components/MerchantsList';
import { Footer } from './components/Footer';
import { AdminApp } from './components/admin/AdminApp';

/** Hidden admin route: #/admin lang ang entry point — walang link sa public nav. */
function useHashRoute(): string {
  const [hash, setHash] = useState(() => window.location.hash);
  useEffect(() => {
    const onHash = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  return hash;
}

function App() {
  const hash = useHashRoute();
  if (hash.startsWith('#/admin')) return <AdminApp />;

  return (
    <div className="min-h-screen bg-white text-corporate-900 font-sans">
      <Navbar />
      <Hero />
      <KabyawEats />
      <GoZeb />
      <About />
      <Contact />
      <MerchantsList />
      <Footer />
    </div>
  );
}

export default App;