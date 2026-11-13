import { Clock, Star, Bike, ArrowRight, ShieldCheck } from 'lucide-react';
import { useScrollReveal } from '../lib/useScrollReveal';

export function ZebGo() {
  const headerRef = useScrollReveal<HTMLDivElement>(0.1, 0);
  const contentRef = useScrollReveal<HTMLDivElement>(0.1, 100);

  return (
    <section id="zeb-go" className="py-16 lg:py-24 overflow-hidden relative">
      {/* Background */}
      <div className="absolute inset-0 bg-corporate-950">
        <div className="mesh-blob w-[600px] h-[600px] bg-redirection-500/15 top-[-10%] left-[-10%] rounded-full animate-float" style={{ animationDelay: '0s' }} />
        <div className="mesh-blob w-[700px] h-[700px] bg-corporate-800/70 bottom-[-15%] right-[-15%] rounded-full animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 section-container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Content */}
          <div ref={headerRef.ref} className="space-y-8">
            <div
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-redirection-600/20 text-redirection-100 text-sm font-medium border border-redirection-600/30 backdrop-blur-sm ${
                headerRef.isVisible ? 'reveal active' : 'reveal reveal-delay-1'
              }`}
            >
              <Star className="w-4 h-4 fill-yellow-300" />
              Coming Soon
            </div>
            <h2
              className={`text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight ${
                headerRef.isVisible ? 'reveal active' : 'reveal reveal-delay-2'
              }`}
            >
              Introducing Zeb Go
            </h2>
            <p className="text-lg text-redirection-100/80 leading-relaxed max-w-lg">
              A local TNVS (Transport Network Vehicle Service) motorcycle taxi platform.
              Book a safe, affordable ride with trusted community riders and get to school,
              work, or the market — fast and on time.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <a
                href="#contact"
                className="btn-primary w-full sm:w-auto text-center"
              >
                Be the First to Know
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=com.kabyaw.eats"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline w-full sm:w-auto text-center"
              >
                Download Kabyaw Eats
              </a>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-4">
              {[['24/7', 'On-Demand Rides'], ['TNVS', 'Motorcycle Taxi Service']].map(([label, desc]) => (
                <div key={label} className="bg-white/10 rounded-xl p-4 border border-white/20 backdrop-blur-sm">
                  <p className="text-xs text-redirection-200/60 uppercase tracking-wider font-semibold mb-1">{label}</p>
                  <p className="text-white text-sm">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Visual */}
          <div ref={contentRef.ref} className="relative h-[400px]">
            <div className="absolute inset-0 bg-gradient-to-b from-corporate-900/80 to-corporate-950 rounded-2xl border border-white/20">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558981806-ec537fae86c9?w=800&q=80')] bg-cover bg-center opacity-30" />
            </div>
            <div className="absolute bottom-8 left-8 right-8">
              <div className="bg-white/90 rounded-2xl p-6 shadow-xl shadow-red/20">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-redirection-600 rounded-xl flex items-center justify-center">
                    <Bike className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-dark-900 text-lg">Zeb Go</h3>
                    <p className="text-sm text-dark-600 font-medium">"Your ride, on time."</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-dark-400 uppercase font-bold">Launching Soon</p>
                    <p className="font-bold text-dark-900">Q1 2027</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider line */}
        <div className="mt-16 flex items-center gap-4">
          <div className="flex-1 h-px bg-white/20" />
          <span className="text-xs text-redirection-300/80 uppercase tracking-widest font-semibold">Future Expansion</span>
          <div className="flex-1 h-px bg-white/20" />
        </div>

        {/* Upcoming hint */}
        <div className="mt-12 flex items-center gap-4 text-white/70 text-sm">
          <Clock className="w-4 h-4" />
          <span>Affordable SME CRM — Empowering Local Small Businesses</span>
        </div>
      </div>
    </section>
  );
}