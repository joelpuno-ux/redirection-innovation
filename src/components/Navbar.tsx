import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Logo } from './Logo';

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'Products', href: '#products' },
  { name: 'About Us', href: '#about' },
  { name: 'Contact', href: '#contact' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`
        sticky top-0 z-50 w-full transition-all duration-300 bg-white shadow-sm
        ${scrolled ? 'border-b border-corporate-200' : 'border-b border-transparent'}
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 lg:h-24">
          {/* Logo */}
          <div className="cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
            <Logo textClassName="hidden md:block" />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-dark-600 hover:text-redirection-600 transition-colors"
              >
                {link.name}
              </a>
            ))}
            <a
              href="https://play.google.com/store/apps/details?id=com.kabyaw.eats"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-sm px-5 py-2.5"
            >
              Download Kabyaw Eats
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-dark-600 hover:text-redirection-600"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="block px-4 py-3 text-dark-600 hover:bg-redirection-50 hover:text-redirection-600 rounded-xl transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <a
              href="https://play.google.com/store.apps/details?id=com.kabyaw.eats"
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-3 bg-redirection-600 text-white text-center font-medium rounded-xl hover:bg-redirection-700 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Download Kabyaw Eats
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}