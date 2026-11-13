import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { KabyawEats } from './components/KabyawEats';
import { ZebGo } from './components/ZebGo';
import { About } from './components/About';
import { Services } from './components/Services';
import { Contact } from './components/Contact';
import { MerchantsList } from './components/MerchantsList';
import { Footer } from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-white text-corporate-900 font-sans">
      <Navbar />
      <Hero />
      <KabyawEats />
      <ZebGo />
      <About />
      <Services />
      <Contact />
      <MerchantsList />
      <Footer />
    </div>
  );
}

export default App;