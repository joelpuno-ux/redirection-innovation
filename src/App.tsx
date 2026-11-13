import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { KabyawEats } from './components/KabyawEats';
import { GoZeb } from './components/GoZeb';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { MerchantsList } from './components/MerchantsList';
import { Footer } from './components/Footer';

function App() {
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