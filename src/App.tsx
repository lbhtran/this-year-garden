import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Hero } from './components/Hero';
import { Navigation } from './components/Navigation';
import { WeatherWidget } from './components/WeatherWidget';
import { OverviewSection } from './components/OverviewSection';
import { DiagramsSection } from './components/DiagramsSection';
import { SeedsSection } from './components/SeedsSection';
import { ShoppingSection } from './components/ShoppingSection';
import { PestsSection } from './components/PestsSection';
import { TemperatureSection } from './components/TemperatureSection';
import { TreesSection } from './components/TreesSection';
import { TimelineSection } from './components/TimelineSection';
import { usePlants } from './hooks/usePlants';
import { useShopping } from './hooks/useShopping';
import { useWeather } from './hooks/useWeather';
import { initialContainers } from './data/containers';

function App() {
  const { isSignedIn } = useAuth();
  const { plants, updatePlant, addPlant, deletePlant } = usePlants();
  const { items: shoppingItems, toggleItem } = useShopping();
  const [activeSection, setActiveSection] = useState('overview');
  const weather = useWeather();

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          if (entry.target.id) {
            setActiveSection(entry.target.id);
          }
        }
      });
    }, { threshold: 0.08 });

    document.querySelectorAll('.section, .timeline-item').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Hero />
      <Navigation activeSection={activeSection} />

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 100px' }}>
        <div style={{ paddingTop: 48 }}>
          <WeatherWidget plants={plants} weather={weather} />
        </div>

        <OverviewSection containers={initialContainers} />
        <DiagramsSection />
        <SeedsSection
          plants={plants}
          onUpdatePlant={updatePlant}
          onAddPlant={addPlant}
          onDeletePlant={deletePlant}
          currentWeather={weather.current}
          isSignedIn={!!isSignedIn}
        />
        <ShoppingSection items={shoppingItems} onToggle={toggleItem} isSignedIn={!!isSignedIn} />
        <PestsSection />
        <TemperatureSection currentTemp={weather.current?.temperature} />
        <TreesSection />
        <TimelineSection />
      </main>

      <footer style={{ background: 'var(--green-deep)', color: 'var(--green-pale)', textAlign: 'center', padding: '40px 24px', fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: 1, opacity: 0.8 }}>
        🪴 My Garden Plan · First Season 2026 · Made with care
      </footer>
    </>
  );
}

export default App;
