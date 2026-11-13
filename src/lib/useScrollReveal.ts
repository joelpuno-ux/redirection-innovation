import { useEffect, useState, useRef } from 'react';

export function useScrollReveal<T extends HTMLElement = HTMLElement>(threshold = 0.1, delay = 0) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const element = ref.current;

    // Fail-safe: kung walang naka-attach na element o walang IntersectionObserver,
    // ipakita agad ang content para HINDI maging blanko ang page.
    if (!element || typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: '0px 0px -8% 0px' }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, delay]);

  return { ref, isVisible };
}