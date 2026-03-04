import Hero from '../components/Hero';
import Stats from '../components/Stats';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import Providers from '../components/Providers';
import Testimonials from '../components/Testimonials';
import CTA from '../components/CTA';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <Providers />
      <Testimonials />
      <CTA />
    </>
  );
}
