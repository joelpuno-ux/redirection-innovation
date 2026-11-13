import { Store, Bike, Smartphone, ShieldCheck, Rocket, MapPin, CheckCircle } from 'lucide-react';
import { useScrollReveal } from '../lib/useScrollReveal';

const appComponents = [
  {
    name: 'Customer App',
    icon: <Smartphone className="w-6 h-6" />,
    status: 'Available on Google Play Store',
    statusColor: 'bg-green-100 text-green-700 border border-green-200',
    desc: 'Browse local restaurants, place orders, and track delivery in real-time.',
  },
  {
    name: 'Merchant POS App',
    icon: <Store className="w-6 h-6" />,
    status: 'Available',
    statusColor: 'bg-blue-100 text-blue-700 border border-blue-200',
    desc: 'Manage orders, update menu, and track sales from one dashboard.',
  },
  {
    name: 'Rider App',
    icon: <Bike className="w-6 h-6" />,
    status: 'Available',
    statusColor: 'bg-purple-100 text-purple-700 border border-purple-200',
    desc: 'Accept delivery requests and earn with every completed order.',
  },
];

const features = [
  {
    icon: <ShieldCheck className="w-5 h-5" />,
    title: 'Fair Commission',
    desc: 'Only 10% from stores and 5% from riders — among the lowest in the industry.',
  },
  {
    icon: <Rocket className="w-5 h-5" />,
    title: 'Fast Delivery',
    desc: 'Local riders ensure your food arrives hot and on time.',
  },
  {
    icon: <MapPin className="w-5 h-5" />,
    title: 'Local Focus',
    desc: 'Proudly serving Cabiao and Gapan City with homegrown technology.',
  },
];

export function KabyawEats() {
  const headerRef = useScrollReveal<HTMLDivElement>(0.1, 0);
  const ecosystemRef = useScrollReveal<HTMLDivElement>(0.1, 100);
  const cardsRef = useScrollReveal<HTMLDivElement>(0.1, 200);
  const benefitsRef = useScrollReveal<HTMLDivElement>(0.1, 300);

  return (
    <section id="products" className="py-16 lg:py-24 bg-white">
      <div className="section-container">
        <div ref={headerRef.ref} className="text-center mb-12 lg:mb-16">
          <div
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-redirection-50/50 text-redirection-700 text-sm font-medium mb-6 border border-redirection-100 ${
              headerRef.isVisible ? 'reveal active' : 'reveal reveal-delay-1'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-redirection-600 animate-pulse" />
            Flagship Product
          </div>
          <div
            className={`mb-6 ${
              headerRef.isVisible ? 'reveal active' : 'reveal reveal-delay-2'
            }`}
          >
            <h2 className="sr-only">Kabyaw Eats</h2>
            <img
              src="/kabyaweats-logo.png"
              alt="Kabyaw Eats — food delivery and online services"
              className="h-24 md:h-28 w-auto mx-auto"
            />
          </div>
          <p
            className={`section-subtitle ${
              headerRef.isVisible ? 'reveal active' : 'reveal reveal-delay-3'
            }`}
          >
            A local food delivery and marketplace platform connecting hungry customers with
            neighborhood stores in Cabiao and Gapan City.
          </p>
        </div>

        {/* App Ecosystem Cards */}
        <div
          ref={ecosystemRef.ref}
          className={`grid lg:grid-cols-3 gap-6 mb-14 lg:mb-20 ${
            ecosystemRef.isVisible ? 'reveal active' : 'reveal reveal-delay-4'
          }`}
        >
          {appComponents.map((app) => (
            <div
              key={app.name}
              className="card-hover rounded-2xl p-8 bg-white border border-gray-100 shadow-sm group"
            >
              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-redirection-600 transition-colors">
                {app.icon}
              </div>
              <h3 className="text-xl font-bold text-dark-900 mb-3 group-hover:text-redirection-600 transition-colors">
                {app.name}
              </h3>
              <p className="text-dark-600 text-sm leading-relaxed mb-6">{app.desc}</p>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${app.statusColor}`}>
                {app.status}
              </span>
            </div>
          ))}
        </div>

        {/* Download & Action Cards */}
        <div
          ref={cardsRef.ref}
          className={`grid lg:grid-cols-3 gap-6 mb-14 lg:mb-20 ${
            cardsRef.isVisible ? 'reveal active' : 'reveal reveal-delay-5'
          }`}
        >
          <div className="rounded-2xl p-8 bg-redirection-600 text-white shadow-premium-red card-hover relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-redirection-700/30 rounded-full blur-3xl -mt-10 -mr-10" />
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                <Smartphone className="w-6 h-6" />
              </div>
            <h3 className="text-xl font-bold mb-3">Customer App</h3>
            <p className="text-dark-600 text-sm leading-relaxed mb-6">
              Approved on Google Play Store! Download and start ordering from local stores today.
            </p>
            <a
              href="https://play.google.com/store/apps/details?id=com.kabyaw.eats"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full text-center"
            >
              Download on Google Play
            </a>
            </div>
          </div>

          <div className="card-hover rounded-2xl p-8 bg-white border border-gray-100 shadow-sm">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
              <Store className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-dark-900 mb-3">Merchant POS</h3>
            <p className="text-dark-600 text-sm leading-relaxed mb-6">
              Join as a store partner. Manage orders, update your menu, and grow your sales.
            </p>
            <a href="#contact" className="btn-outline w-full text-center">
              Join as Merchant
            </a>
          </div>

          <div className="card-hover rounded-2xl p-8 bg-white border border-gray-100 shadow-sm">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-6">
              <Bike className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-dark-900 mb-3">Rider App</h3>
            <p className="text-dark-600 text-sm leading-relaxed mb-6">
              Become a rider and earn with every delivery. Flexible hours, fair commission.
            </p>
            <a href="#contact" className="btn-outline w-full text-center">
              Join as Rider
            </a>
          </div>
        </div>

        {/* Benefits */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h3 className="text-2xl md:text-3xl font-bold text-dark-900">Why partner with Kabyaw Eats?</h3>
            {features.map((feature) => (
              <div key={feature.title} className="flex items-start gap-4">
                <div className="w-10 h-10 bg-redirection-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <h4 className="font-bold text-dark-900">{feature.title}</h4>
                  <p className="text-dark-600 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-redirection-600/10 rounded-2xl blur-xl" />
            <div className="relative rounded-2xl overflow-hidden border border-redirection-200 bg-white/50 backdrop-blur-sm">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-10 h-10 bg-redirection-600 rounded-xl flex items-center justify-center">
                    <Store className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-redirection-600 font-bold uppercase">Commission Rate</p>
                    <p className="text-3xl font-bold text-dark-900">10%</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center">
                    <Bike className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-purple-600 font-bold uppercase">Rider Commission</p>
                    <p className="text-3xl font-bold text-dark-900">5%</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-green-600 font-bold uppercase">Approval Status</p>
                    <p className="text-3xl font-bold text-dark-900">Google Play Store</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Inline SVG components for icons not in the import list
function PlayStore({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  );
}