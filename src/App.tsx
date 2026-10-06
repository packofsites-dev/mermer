import React, { useCallback, useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { FeaturedDishesSection } from './components/FeaturedDish';
import { FullMenuPage } from './components/FullMenuPage';
import { AtmosphereSection } from './components/AtmosphereSection';
import { LocationSection } from './components/LocationSection';
import { Footer } from './components/Footer';
import { AdminPage } from './components/AdminPage';
import { MenuCategoryName, MenuItem } from './data/menuData';
import { fetchMenuFoods } from './services/api';

type AppView = 'home' | 'menu' | 'admin';

function getInitialViewFromLocation(): AppView {
  if (typeof window !== 'undefined') {
    const path = window.location.pathname.replace(/\/+$/, '');
    const hash = window.location.hash.replace(/^#\/?/, '');
    if (path === '/admin' || hash === 'admin') {
      return 'admin';
    }
    if (path === '/menu' || hash === 'menu') {
      return 'menu';
    }
  }
  return 'home';
}

export default function App() {
  const [activeView, setActiveView] = useState<AppView>(
    getInitialViewFromLocation
  );
  const [initialMenuCategory, setInitialMenuCategory] = useState<
    MenuCategoryName | undefined
  >(undefined);
  const [foods, setFoods] = useState<MenuItem[]>([]);
  const [isLoadingMenu, setIsLoadingMenu] = useState<boolean>(true);

  const loadMenuFromBackend = useCallback(async () => {
    setIsLoadingMenu(true);
    try {
      const loadedFoods = await fetchMenuFoods();
      setFoods(loadedFoods);
    } catch {
      // Keep existing state if network request fails
    } finally {
      setIsLoadingMenu(false);
    }
  }, []);

  useEffect(() => {
    loadMenuFromBackend();
  }, [loadMenuFromBackend]);

  useEffect(() => {
    const handlePopState = () => {
      setActiveView(getInitialViewFromLocation());
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const handleNavigateHome = (sectionId?: string) => {
    if (typeof window !== 'undefined' && window.location.pathname !== '/') {
      window.history.pushState({}, '', sectionId ? `/#${sectionId}` : '/');
    }
    setActiveView('home');
    if (sectionId) {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 40);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleOpenFullMenu = (category?: MenuCategoryName) => {
    if (typeof window !== 'undefined' && window.location.pathname !== '/menu') {
      window.history.pushState({}, '', '/menu');
    }
    setInitialMenuCategory(category);
    setActiveView('menu');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      id="top"
      className="min-h-screen flex flex-col bg-bone text-charcoal overflow-x-hidden"
    >
      <Navbar
        activeView={activeView === 'menu' ? 'menu' : 'home'}
        onNavigateHome={handleNavigateHome}
        onNavigateMenu={() => handleOpenFullMenu(undefined)}
      />

      <main className="flex-1">
        {activeView === 'home' && (
          <>
            <Hero onOpenMenu={() => handleOpenFullMenu(undefined)} />
            <AboutSection />
            <FeaturedDishesSection items={foods} />
            <AtmosphereSection />
            <LocationSection />
          </>
        )}

        {activeView === 'menu' && (
          <FullMenuPage
            initialCategory={initialMenuCategory}
            items={foods}
            isLoading={isLoadingMenu}
            onBackHome={() => handleNavigateHome()}
          />
        )}

        {activeView === 'admin' && (
          <AdminPage
            items={foods}
            isLoadingMenu={isLoadingMenu}
            onRefreshMenu={loadMenuFromBackend}
            onBackHome={() => handleNavigateHome()}
          />
        )}
      </main>

      <Footer
        onNavigateMenu={() => handleOpenFullMenu(undefined)}
        onNavigateHomeSection={handleNavigateHome}
      />
    </div>
  );
}
