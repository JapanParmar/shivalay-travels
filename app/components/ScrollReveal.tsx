'use client';
import { useEffect } from 'react';

export default function ScrollReveal() {
  useEffect(() => {
    const classes = ['.reveal', '.reveal-left', '.reveal-right', '.reveal-scale'];
    const selector = classes.join(':not(.in), ') + ':not(.in)';

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    const observe = () => {
      document.querySelectorAll(selector).forEach((el) => observer.observe(el));
    };

    observe();
    // Re-scan periodically so dynamically rendered elements are caught
    const id = setInterval(observe, 600);
    return () => {
      observer.disconnect();
      clearInterval(id);
    };
  }, []);

  return null;
}
