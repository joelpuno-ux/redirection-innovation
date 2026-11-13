import { Mail, Phone, MapPin, Send } from 'lucide-react';

export function Contact() {
  return (
    <section id="contact" className="py-24 lg:py-32 relative overflow-hidden">
      <div className="section-container">
        <div className="text-center mb-12 lg:mb-20">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-redirection-100 text-redirection-700 text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-redirection-600" />
            Get In Touch
          </span>
          <h2 className="section-title">Partner With Us</h2>
          <p className="section-subtitle">
            Local merchants and riders — join the Kabyaw Eats ecosystem and grow your business
            with fair commissions and dedicated local support.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-premium border border-gray-100">
            <h3 className="text-2xl font-bold text-corporate-900 mb-6">Join the Network</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('Thank you for your interest! We will get in touch with you shortly.');
              }}
              className="space-y-5"
            >
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-redirection-600 focus:border-redirection-600 outline-none transition-colors"
                  placeholder="Juan Dela Cruz"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-redirection-600 focus:border-redirection-600 outline-none transition-colors"
                  placeholder="juan@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-redirection-600 focus:border-redirection-600 outline-none transition-colors"
                  placeholder="+63 9xx xxx xxxx"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1">I am interested in</label>
                <select
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-redirection-600 focus:border-redirection-600 outline-none transition-colors bg-white"
                >
                  <option>Merchant Partner (Store)</option>
                  <option>Rider Partner (Delivery)</option>
                  <option>Both</option>
                  <option>General Inquiry</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1">Location / City</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-redirection-600 focus:border-redirection-600 outline-none transition-colors"
                  placeholder="Cabiao, Gapan City, etc."
                />
              </div>
              <button
                type="submit"
                className="btn-primary w-full flex justify-center"
              >
                <Send className="w-4 h-4 mr-2" /> Submit Application
              </button>
            </form>
          </div>

          {/* Info Cards */}
          <div className="space-y-6">
            <InfoCard
              icon={<MapPin className="w-5 h-5" />}
              title="Head Office"
              description="Redirection Innovation Inc.<br />Central Luzon, Philippines"
            />
            <InfoCard
              icon={<Phone className="w-5 h-5" />}
              title="Partner Hotline"
              description="+63 9xx xxx xxxx<br />Merchant & Rider Support"
            />
            <InfoCard
              icon={<Mail className="w-5 h-5" />}
              title="Email"
              description="partners@redirectioninnovation.ph<br />business@redirectioninnovation.ph"
            />
          </div>
        </div>

        {/* Partnership Highlights */}
        <div className="mt-16 lg:mt-24 rounded-2xl bg-redirection-600 p-8 lg:p-12 text-white shadow-premium-red overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-redirection-400/20 via-redirection-900/0 to-redirection-900/0" />
          <div className="relative z-10 text-center">
            <h3 className="text-2xl lg:text-3xl font-bold mb-4">Ready to grow your business?</h3>
            <p className="text-redirection-100/90 mb-8 max-w-xl mx-auto">
              Join Kabyaw Eats as a merchant or rider. Fair commissions, local support,
              and a growing customer base in Cabiao and Gapan City.
            </p>
            <a
              href="mailto:partners@redirectioninnovation.ph"
              className="inline-flex items-center gap-2 bg-white text-redirection-600 hover:bg-redirection-50 font-semibold px-8 py-3 rounded-xl transition-colors"
            >
              <Send className="w-4 h-4" />
              Email Us Today
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex items-start gap-4 bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
      <div className="w-12 h-12 bg-redirection-50 rounded-lg flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <h4 className="font-bold text-dark-900">{title}</h4>
        <p className="text-dark-600 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: description }} />
      </div>
    </div>
  );
}