import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Spotlight from '../components/Spotlight';
import ErrorBoundary from '../components/ErrorBoundary';

export default function Layout() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Delay to allow page content to render before scrolling
      const raf = requestAnimationFrame(() => {
        const el = document.getElementById(hash.slice(1));
        if (el) { el.scrollIntoView({ behavior: 'smooth' }); return; }
      });
      return () => cancelAnimationFrame(raf);
    }
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname, hash]);

  return (
    <div style={{ minHeight: '100vh', background: '#080808', position: 'relative' }}>
      <a
        href="#main-content"
        style={{
          position: 'absolute',
          left: '-9999px',
          top: 'auto',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
          zIndex: 1000,
        }}
        onFocus={(e) => {
          e.currentTarget.style.position = 'fixed';
          e.currentTarget.style.left = '16px';
          e.currentTarget.style.top = '16px';
          e.currentTarget.style.width = 'auto';
          e.currentTarget.style.height = 'auto';
          e.currentTarget.style.padding = '8px 16px';
          e.currentTarget.style.background = '#7c3aed';
          e.currentTarget.style.color = '#fff';
          e.currentTarget.style.borderRadius = '8px';
          e.currentTarget.style.fontSize = '14px';
          e.currentTarget.style.fontWeight = '600';
        }}
        onBlur={(e) => {
          e.currentTarget.style.position = 'absolute';
          e.currentTarget.style.left = '-9999px';
          e.currentTarget.style.width = '1px';
          e.currentTarget.style.height = '1px';
        }}
      >
        Skip to content
      </a>
      <Spotlight />
      <Navbar />
      <main id="main-content">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
}
