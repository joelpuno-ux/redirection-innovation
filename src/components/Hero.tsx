import { ArrowRight, Rocket, ShieldCheck, Globe, Flame } from 'lucide-react';
import { useScrollReveal } from '../lib/useScrollReveal';

const stats = [
  { value: '10%', label: 'Commission from stores' },
  { value: '5%', label: 'Commission from riders' },
  { value: '2+', label: 'Cities served' },
  { value: '3', label: 'App ecosystem' },
];

const features = [
  {
    icon: <Rocket className="w-6 h-6" />,
    title: 'Innovation',
    desc: 'Cutting-edge technology solutions for local businesses in the Philippines.',
  },
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: 'Trusted Platform',
    desc: 'Kabyaw Eats is approved on Google Play Store with secure payment processing.',
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: 'Regional Impact',
    desc: 'Empowering Cabiao, Gapan City, and surrounding communities with digital tools.',
  },
  {
    icon: <Flame className="w-6 h-6" />,
    title: 'Growth Focused',
    desc: 'Scaling from Central Luzon to serve more Filipino communities every day.',
  },
];

export function Hero() {
  const { ref, isVisible } = useScrollReveal(0.1, 0);

  return (
    <section id="home" ref={ref} className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-corporate-50 via-corporate-100 to-corporate-50">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="mesh-blob w-[600px] h-[600px] bg-redirection-100 top-[-10%] left-[-10%] rounded-full animate-float" />
        <div className="mesh-blob w-[700px] h-[700px] bg-red/20 bottom-[-15%] right-[-15%] rounded-full animate-float" style={{ animationDelay: '2s' }} />
        <div className="mesh-blob w-[400px] h-[400px] bg-redirection-200 top-[30%] right-[20%] rounded-full animate-float" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-5xl">
          {/* Left: Content */}
          <div className="space-y-6 max-w-xl">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-redirection-600 animate-pulse" />
              <span className="text-sm font-semibold text-redirection-600 uppercase tracking-wider">
                Redirection Innovation Inc.
              </span>
            </div>

            <h1 className={`text-5xl md:text-7xl lg:text-8xl font-bold leading-tight tracking-tight text-corporate-900 ${isVisible ? 'reveal active' : 'reveal reveal-delay-1'}`}>
              Powering the Future of<br />
              <span className="text-gradient">Local Innovation</span>
            </h1>

            <p className={`text-lg md:text-xl leading-relaxed text-corporate-600 max-w-lg ${isVisible ? 'reveal active' : 'reveal reveal-delay-2'}`}>
              A homegrown Philippine technology company building digital solutions that empower
              local businesses, connect communities, and drive economic growth in Central Luzon
              and beyond.
            </p>

            <div className={`flex flex-wrap items-center gap-3 pt-4 ${isVisible ? 'reveal active' : 'reveal reveal-delay-3'}`}>
              <a
                href="#products"
                className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all hover:shadow-lg"
              >
                Explore Our Products <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#contact"
                className="btn-ghost flex items-center gap-2 px-5 py-2.5 rounded-lg border border-corporate-400 hover:bg-corporate-50 transition-all"
              >
                Partner With Us
              </a>
            </div>
          </div>

          {/* Right: Feature cards */}
          <div className={`grid grid-cols-2 gap-6 ${isVisible ? 'reveal active' : 'reveal reveal-delay-4'}`}>
            {features.map((feature, idx) => (
              <div
                key={feature.title}
                className="bg-white/85 backdrop-blur-md border border-white/50 shadow-lg rounded-2xl p-6 group card-hover cursor-pointer"
              >
                <div className="w-12 h-12 bg-redirection-50 text-redirection-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-redirection-600 group-hover:text-white transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-corporate-900 mb-2 group-hover:text-redirection-600 transition-colors">{feature.title}</h3>
                <p className="text-sm text-corporate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subtle bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-corporate-200" />
    </section>
  );
}