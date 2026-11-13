import { Globe, Users, Rocket } from 'lucide-react';

export function About() {
  return (
    <section id="about" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 lg:mb-14">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-redirection-100 text-redirection-700 text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-redirection-600" />
            Corporate Profile
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-corporate-900 mb-6 tracking-tight">
            About Redirection Innovation Inc.
          </h2>
          <p className="text-lg md:text-xl text-corporate-600 max-w-2xl mx-auto leading-relaxed">
            A homegrown Philippine technology company building digital solutions that empower
            local businesses and connect communities across Central Luzon.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <div className="space-y-6">
            <div className="bg-corporate-50 rounded-2xl p-8 border border-corporate-200 hover:border-redirection-300 transition-all duration-300">
              <h3 className="text-xl font-bold text-corporate-900 mb-4">Our Mission</h3>
              <p className="text-corporate-600 leading-relaxed">
                To build accessible, affordable, and impactful technology solutions that
                uplift local economies — starting right here in the Philippines.
              </p>
            </div>

            <div className="bg-corporate-50 rounded-2xl p-8 border border-corporate-200 hover:border-redirection-300 transition-all duration-300">
              <h3 className="text-xl font-bold text-corporate-900 mb-4">Our Story</h3>
              <p className="text-corporate-600 leading-relaxed">
                Redirection Innovation Inc. was founded with a vision to redirect how local
                businesses operate in the digital age. From Kabyaw Eats to Zeb Go and beyond,
                we create tools that serve real communities.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-8 border border-corporate-200 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 bg-redirection-600 rounded-xl flex items-center justify-center">
                  <Rocket className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-corporate-900">Regional Impact</h3>
              </div>
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-redirection-600 flex items-center justify-center text-white text-xs font-bold">1</div>
                  <div>
                    <p className="font-bold text-corporate-900">Cabiao</p>
                    <p className="text-sm text-corporate-600">Kabyaw Eats Homebase</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-redirection-600 flex items-center justify-center text-white text-xs font-bold">2</div>
                  <div>
                    <p className="font-bold text-corporate-900">Gapan City</p>
                    <p className="text-sm text-corporate-600">Expanding Service Area</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-redirection-600 flex items-center justify-center text-white text-xs font-bold">3</div>
                  <div>
                    <p className="font-bold text-corporate-900">Central Luzon</p>
                    <p className="text-sm text-corporate-600">Regional Expansion</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-6 border border-corporate-200 shadow-sm hover:border-redirection-300 transition-all duration-300">
                <div className="w-10 h-10 bg-redirection-50 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="w-5 h-5 text-redirection-600" />
                </div>
                <h4 className="font-bold text-corporate-900 mb-2">Philippine Based</h4>
                <p className="text-sm text-corporate-500">Headquartered in the Philippines, serving Central Luzon and beyond.</p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-corporate-200 shadow-sm hover:border-redirection-300 transition-all duration-300">
                <div className="w-10 h-10 bg-redirection-50 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-5 h-5 text-redirection-600" />
                </div>
                <h4 className="font-bold text-corporate-900 mb-2">Community Focused</h4>
                <p className="text-sm text-corporate-500">Empowering local merchants, riders, and small businesses.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}