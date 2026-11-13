export function Footer() {
  return (
    <footer className="bg-corporate-950 text-corporate-200 border-t border-corporate-700">
      <div className="section-container pt-16 pb-8">
        <div className="grid lg:grid-cols-4 gap-12 lg:gap-16 pb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-6 inline-block bg-white rounded-2xl p-4 shadow-lg">
              <img
                src="/logo-full.png"
                alt="ReDirection Innovations Inc — Serving with Purpose, Directing Success."
                className="w-56 h-auto"
              />
            </div>
            <p className="text-dark-300 text-sm leading-relaxed max-w-sm">
              Building technology solutions that empower local businesses and connect
              communities across the Philippines.
            </p>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-white font-bold mb-6">Products</h4>
            <ul className="space-y-3">
              <li>
                <a href="#products" className="text-dark-300 hover:text-redirection-400 transition-colors text-sm">
                  Kabyaw Eats
                </a>
              </li>
              <li>
                <a href="#gozeb" className="text-dark-300 hover:text-redirection-400 transition-colors text-sm">
                  GoZeb
                </a>
              </li>
              <li>
                <a href="https://play.google.com/store/apps/details?id=com.kabyaw.eats" target="_blank" rel="noopener noreferrer" className="text-dark-300 hover:text-redirection-400 transition-colors text-sm">
                  Customer App (Google Play)
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-bold mb-6">Company</h4>
            <ul className="space-y-3">
              <li>
                <a href="#about" className="text-dark-300 hover:text-redirection-400 transition-colors text-sm">
                  About Us
                </a>
              </li>
              <li>
                <a href="#contact" className="text-dark-300 hover:text-redirection-400 transition-colors text-sm">
                  Partner With Us
                </a>
              </li>
              <li>
                <a href="#" className="text-dark-300 hover:text-redirection-400 transition-colors text-sm">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-6">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-dark-300">
                <span className="w-5 text-redirection-400">📍</span>
                <span>Purok 4, San Carlos, Cabiao, Nueva Ecija</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-dark-300">
                <span className="w-5 text-redirection-400">✉️</span>
                <span>support@redirectioninnovation.com</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-dark-300">
                <span className="w-5 text-redirection-400">📱</span>
                <span>0961 349 7061</span>
              </li>
            </ul>
            <div className="mt-6 flex gap-3">
              <a href="#" className="w-10 h-10 rounded-lg bg-dark-800 flex items-center justify-center hover:bg-redirection-600 hover:text-white transition-colors text-dark-300">
                📘
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-dark-800 flex items-center justify-center hover:bg-redirection-600 hover:text-white transition-colors text-dark-300">
                📷
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-dark-800 flex items-center justify-center hover:bg-redirection-600 hover:text-white transition-colors text-dark-300">
                💼
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-dark-700 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-dark-500 text-sm">
            &copy; {new Date().getFullYear()} Redirection Innovation Inc. All rights reserved.
          </p>
          <p className="text-dark-500 text-sm">
            Proudly built in the Philippines 🇵🇭
          </p>
        </div>
      </div>
    </footer>
  );
}